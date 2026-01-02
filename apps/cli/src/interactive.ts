#!/usr/bin/env bun
import { DiffService, PresetName, type Result } from "@diffson/core";

interface Config {
  json1: string;
  json2: string;
  preset: PresetName;
  parseNestedJson: boolean;
  noisePaths: string[];
  specialPaths: string[];
}

async function runGumCommand(cmd: string): Promise<string> {
  const process = Bun.spawn({
    cmd: ["bash", "-c", cmd],
    stdout: "pipe",
    stderr: "pipe",
  });
  await process.exited;

  let stdout = "";
  if (process.stdout) {
    const reader = process.stdout.getReader();
    const { value, done } = await reader.read();
    if (value) stdout = new TextDecoder().decode(value);
  }

  return stdout || "";
}

async function getJsonInput(prompt: string): Promise<string> {
  const cmd = `gum write --placeholder "${prompt}" --height 15 --header "按 Ctrl+D 完成输入"`;
  const result = await runGumCommand(cmd);
  return result.trim();
}

async function getPreset(): Promise<PresetName> {
  const cmd = `gum choose "Full Smart (智能比较 - 推荐)" "Full Ordered (顺序敏感)" "Left Smart (仅比较左侧)" "Left Ordered (仅左侧顺序)" --cursor "Full Smart (智能比较 - 推荐)" --height 4`;
  const result = await runGumCommand(cmd);
  const selected = result.trim();

  switch (selected) {
    case "Full Smart (智能比较 - 推荐)":
      return PresetName.FullSmart;
    case "Full Ordered (顺序敏感)":
      return PresetName.FullOrdered;
    case "Left Smart (仅比较左侧)":
      return PresetName.LeftSmart;
    case "Left Ordered (仅左侧顺序)":
      return PresetName.LeftOrdered;
    default:
      return PresetName.FullSmart;
  }
}

async function getNestedJsonChoice(): Promise<boolean> {
  const cmd = `gum confirm "是否解析嵌套的 JSON 字符串？" --default=false --affirmative="Yes" --negative="No"`;
  const result = await runGumCommand(cmd);
  return result.trim() === "true";
}

async function getPaths(prompt: string): Promise<string[]> {
  const cmd = `gum input --placeholder "${prompt}" --width 50`;
  const result = await runGumCommand(cmd);
  const trimmed = result.trim();
  if (!trimmed) return [];
  return trimmed.split(",").map((p: string) => p.trim());
}

function validateJson(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

function renderResults(results: Result[]): void {
  if (results.length === 0) {
    console.log("✓ No differences found\n");
    return;
  }

  let output = `\nFound ${results.length} difference${results.length > 1 ? "s" : ""}:\n\n`;

  for (const item of results) {
    const symbol = item.diffType === "ADD" ? "+" : item.diffType === "DELETE" ? "-" : "~";
    const color = item.diffType === "ADD" ? "#00ff00" : item.diffType === "DELETE" ? "#ff0000" : "#ffff00";
    const path = item.leftPath ?? item.rightPath ?? "(root)";

    output += `${symbol} ${path}\n`;

    if (item.diffType === "DELETE") {
      output += `    - ${String(item.left)}\n`;
    } else if (item.diffType === "ADD") {
      output += `    + ${String(item.right)}\n`;
    } else if (item.diffType === "MODIFY") {
      output += `    - ${String(item.left)}\n`;
      output += `    + ${String(item.right)}\n`;
    }

    output += "\n";
  }

  console.log(output);
}

async function showResults(results: Result[]): Promise<string> {
  renderResults(results);

  const cmd = `gum choose "🔄 重新开始" "📋 复制结果到剪贴板" "💾 保存结果到文件" "🚪 退出" --cursor "🔄 重新开始" --height 4`;
  const result = await runGumCommand(cmd);
  return result.trim();
}

async function saveResults(results: Result[]): Promise<void> {
  const cmd = `gum input --placeholder "输入输出文件路径（例如：diff-result.json）" --width 50 --value "diff-result.json"`;
  const result = await runGumCommand(cmd);
  const path = result.trim();

  if (!path) {
    console.log("已取消保存\n");
    return;
  }

  try {
    await Bun.write(path, JSON.stringify(results, null, 2));
    console.log(`结果已保存到 ${path}\n`);
  } catch (error) {
    console.log(`保存失败: ${error}\n`);
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
    console.log("结果已复制到剪贴板\n");
  } catch (error) {
    console.log(`复制失败: ${error}\n`);
    console.log("提示: 在 macOS 上需要安装 pbcopy\n");
  }
}

async function main(): Promise<void> {
  console.clear();
  console.log("🔍 Diffson - 交互式 JSON Diff 工具\n");

  while (true) {
    try {
      // Step 1: Get first JSON
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("步骤 1/6: 输入第一个 JSON");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      let json1 = await getJsonInput("请粘贴第一个 JSON");
      while (!validateJson(json1)) {
        console.log("❌ JSON 格式错误，请重新输入\n");
        json1 = await getJsonInput("请粘贴第一个 JSON");
      }

      // Step 2: Get second JSON
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("步骤 2/6: 输入第二个 JSON");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      let json2 = await getJsonInput("请粘贴第二个 JSON");
      while (!validateJson(json2)) {
        console.log("❌ JSON 格式错误，请重新输入\n");
        json2 = await getJsonInput("请粘贴第二个 JSON");
      }

      // Step 3: Choose preset
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("步骤 3/6: 选择比较预设");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      const preset = await getPreset();

      // Step 4: Parse nested JSON
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("步骤 4/6: 选择是否解析嵌套 JSON");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      const parseNestedJson = await getNestedJsonChoice();

      // Step 5: Noise paths
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("步骤 5/6: 输入要忽略的路径（可选）");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      const noisePaths = await getPaths("输入要忽略的路径（逗号分隔，直接回车跳过）");

      // Step 6: Special paths
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("步骤 6/6: 输入特殊路径（可选）");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      const config: Config = {
        json1,
        json2,
        preset,
        parseNestedJson,
        noisePaths,
        specialPaths: [],
      };

      // Show loading
      console.log("⏳ 正在比较...\n");
      await runGumCommand("gum spin --spinner dot --title '正在比较 JSON...' -- sleep 0.5");

      // Perform diff
      const left = JSON.parse(config.json1);
      const right = JSON.parse(config.json2);

      const diffService = new DiffService(config.preset);
      const results = diffService.diffElement(left, right, {
        noisePath: config.noisePaths,
        specialPath: config.specialPaths,
      });

      console.clear();
      console.log("🔍 Diffson - 比较结果\n");

      // Show results and handle user action
      let action = await showResults(results);

      if (action === "🔄 重新开始") {
        console.clear();
        console.log("🔍 Diffson - 交互式 JSON Diff 工具\n");
        continue;
      } else if (action === "📋 复制结果到剪贴板") {
        await copyToClipboard(results);
        continue;
      } else if (action === "💾 保存结果到文件") {
        await saveResults(results);
        continue;
      } else if (action === "🚪 退出") {
        console.log("👋 再见！");
        break;
      }
    } catch (error) {
      console.log(`❌ 发生错误: ${error}\n`);
      const cmd = `gum confirm "是否重试？" --affirmative="是" --negative="否"`;
      const result = await runGumCommand(cmd);
      if (result.trim() !== "true") {
        console.log("👋 再见！");
        break;
      }
      console.clear();
    }
  }
}

main();
