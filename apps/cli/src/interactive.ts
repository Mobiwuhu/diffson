#!/usr/bin/env bun
import {
  intro,
  outro,
  text,
  select,
  confirm,
  spinner,
  isCancel,
  cancel,
  log,
} from "@clack/prompts";
import { DiffService, PresetName, type Result } from "@diffson/core";

export interface Config {
  json1: string;
  json2: string;
  preset: PresetName;
  parseNestedJson: boolean;
  ignorePaths: string[];
  arrayIdentityPaths: string[];
}

function validateJson(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

function renderResults(results: Result[]): string {
  if (results.length === 0) {
    return "✓ 未发现差异\n";
  }

  return JSON.stringify(results, null, 2);
}

async function saveResults(results: Result[]): Promise<void> {
  const path = await text({
    message: "输入输出文件路径",
    placeholder: "diff-result.json",
    defaultValue: "diff-result.json",
  });

  if (isCancel(path)) {
    return;
  }

  if (!path) {
    log.info("已取消保存");
    return;
  }

  try {
    await Bun.write(path, JSON.stringify(results, null, 2));
    log.success(`结果已保存到 ${path}`);
  } catch (error) {
    log.error(`保存失败: ${error}`);
  }
}

async function copyToClipboard(results: Result[]): Promise<void> {
  const json = JSON.stringify(results, null, 2);
  try {
    const process = Bun.spawn({
      cmd: ["pbcopy"],
      stdin: "pipe",
      stdout: "ignore",
      stderr: "ignore",
    });
    await process.stdin?.write(json);
    await process.stdin?.end();
    await process.exited;
    log.success("结果已复制到剪贴板");
  } catch (error) {
    log.error(`复制失败: ${error}`);
    log.message("提示: 在 macOS 上需要 pbcopy 支持");
  }
}

async function main(): Promise<void> {
  intro("🔍 Diffson - 交互式 JSON Diff 工具");

  mainLoop:
  while (true) {
    try {
      // Step 1: Get JSON inputs (only once per session)
      const jsonInputs = await (async () => {
        // Get first JSON
        let json1 = await text({
          message: "请粘贴第一个 JSON",
          placeholder: '{"key": "value"}',
          validate: (value) => {
            if (!value) return "JSON 不能为空";
            if (!validateJson(value)) return "JSON 格式错误";
          },
        });

        if (isCancel(json1)) {
          cancel("操作已取消");
          process.exit(0);
        }

        // Get second JSON
        let json2 = await text({
          message: "请粘贴第二个 JSON",
          placeholder: '{"key": "value"}',
          validate: (value) => {
            if (!value) return "JSON 不能为空";
            if (!validateJson(value)) return "JSON 格式错误";
          },
        });

        if (isCancel(json2)) {
          cancel("操作已取消");
          process.exit(0);
        }

        return {
          json1: json1!,
          json2: json2!,
        };
      })();

      // Step 2: Configuration and result loop (can repeat without re-entering JSON)
      while (true) {
        // Step 2a: Get configuration
        const config = await (async () => {
          // Choose preset
          const preset = await select({
            message: "选择比较预设",
            options: [
              { value: PresetName.FullSmart, label: "Full Smart (智能比较 - 推荐)", hint: "推荐使用" },
              { value: PresetName.FullOrdered, label: "Full Ordered (顺序敏感)" },
              { value: PresetName.LeftSmart, label: "Left Smart (仅比较左侧)" },
              { value: PresetName.LeftOrdered, label: "Left Ordered (仅左侧顺序)" },
            ],
            initialValue: PresetName.FullSmart,
          });

          if (isCancel(preset)) {
            cancel("操作已取消");
            process.exit(0);
          }

          // Parse nested JSON
          const parseNestedJson = await confirm({
            message: "是否解析嵌套的 JSON 字符串？",
            initialValue: false,
          });

          if (isCancel(parseNestedJson)) {
            cancel("操作已取消");
            process.exit(0);
          }

          // Ignored paths
          const ignorePathsInput = await text({
            message: "输入要忽略的逻辑路径（可选, 逗号分隔）",
            placeholder: "data.timestamp,items.name",
            initialValue: "",
          });

          if (isCancel(ignorePathsInput)) {
            cancel("操作已取消");
            process.exit(0);
          }

          const ignorePaths = ignorePathsInput
            ? ignorePathsInput.split(",").map((p) => p.trim()).filter(Boolean)
            : [];

          // Array identity paths
          const arrayIdentityPathsInput = await text({
            message: "输入数组 identity 路径（可选, 逗号分隔，仅智能数组匹配使用）",
            placeholder: "items.id,users.email",
            initialValue: "",
          });

          if (isCancel(arrayIdentityPathsInput)) {
            cancel("操作已取消");
            process.exit(0);
          }

          const arrayIdentityPaths = arrayIdentityPathsInput
            ? arrayIdentityPathsInput.split(",").map((p) => p.trim()).filter(Boolean)
            : [];

          return {
            preset: preset as PresetName,
            parseNestedJson: parseNestedJson as boolean,
            ignorePaths,
            arrayIdentityPaths,
          };
        })();

        // Step 2b: Perform diff
        const s = spinner();
        s.start("正在比较 JSON...");

        const left = JSON.parse(jsonInputs.json1);
        const right = JSON.parse(jsonInputs.json2);

        const diffService = new DiffService(config.preset);
        const results = diffService.diffElement(left, right, {
          ignorePaths: config.ignorePaths,
          arrayMatching: config.arrayIdentityPaths.length > 0
            ? { identityPaths: config.arrayIdentityPaths }
            : undefined,
          parseNestedJson: config.parseNestedJson,
        });

        s.stop("比较完成");

        // Step 2c: Show results
        log.message(renderResults(results));

        // Step 2d: Handle user action (can repeat)
        while (true) {
          const action = await select({
            message: "选择操作",
            options: [
              { value: "reconfig", label: "⚙️  重新选择配置" },
              { value: "copy", label: "📋 复制结果到剪贴板" },
              { value: "save", label: "💾 保存结果到文件" },
              { value: "restart", label: "🔄 重新开始（输入新的 JSON）" },
              { value: "exit", label: "🚪 退出" },
            ],
            initialValue: "reconfig",
          });

          if (isCancel(action)) {
            cancel("操作已取消");
            process.exit(0);
          }

          if (action === "reconfig") {
            // Break out of action loop, go back to config selection
            break;
          } else if (action === "copy") {
            await copyToClipboard(results);
            // Stay in action loop
            continue;
          } else if (action === "save") {
            await saveResults(results);
            // Stay in action loop
            continue;
          } else if (action === "restart") {
            // Break out of both inner loops, go back to JSON input
            intro("🔍 Diffson - 交互式 JSON Diff 工具");
            break mainLoop;
          } else if (action === "exit") {
            outro("👋 再见！");
            process.exit(0);
          }
        }
        // If we reach here, user selected "reconfig", continue to config selection
      }
    } catch (error) {
      log.error(`发生错误: ${error}`);

      const shouldRetry = await confirm({
        message: "是否重试？",
        initialValue: true,
      });

      if (isCancel(shouldRetry)) {
        cancel("操作已取消");
        process.exit(0);
      }

      if (!shouldRetry) {
        outro("👋 再见！");
        process.exit(0);
      }

      intro("🔍 Diffson - 交互式 JSON Diff 工具");
    }
  }
}

export async function runInteractiveMode(): Promise<void> {
  await main();
}
