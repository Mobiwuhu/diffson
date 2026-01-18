#!/usr/bin/env bun
import "./suppress-errors";
import { parseArgs } from "./parseArgs";
import { writeFileSync } from "fs";
import { formatJsonOutput } from "./utils";
import { getJsonContent, filterResults } from "./utils";
import { DiffService, PresetName, type Result } from "@diffson/core";
import { runInteractiveMode } from "./interactive";

const args = process.argv.slice(2);
const parsed = parseArgs(args);

/**
 * 判断是否应该进入交互模式
 * 如果有实际的操作参数（file1/file2/json1/json2），走命令行模式
 * 否则默认进入交互模式
 */
function shouldRunInteractiveMode(): boolean {
  // 如果显式指定 --interactive，走交互模式
  if (parsed.interactive) return true;

  // 如果有实际的操作参数，走命令行模式
  if (parsed.file1 || parsed.file2 || parsed.json1 || parsed.json2) return false;

  // 否则默认进入交互模式
  return true;
}

function parsePreset(preset: string): PresetName {
  switch (preset.toLowerCase()) {
    case "fullsmart":
    case "smart":
      return PresetName.FullSmart;
    case "fullordered":
    case "ordered":
      return PresetName.FullOrdered;
    case "leftsmart":
      return PresetName.LeftSmart;
    case "leftordered":
      return PresetName.LeftOrdered;
    default:
      return PresetName.FullSmart;
  }
}

function showHelp(): void {
  console.log(`
 🔍 Diffson - JSON Diff Tool

 Usage:
   diffson                        Interactive mode (default)
   diffson <json1> <json2>        Compare two JSON strings
   diffson [options]               Compare JSON from files or with options

 Positional Arguments:
   json1                  First JSON string (or use --file1)
   json2                  Second JSON string (or use --file2)

 Options:
   -f1, --file1 <path>     Read first JSON from file
   -f2, --file2 <path>     Read second JSON from file
   -p, --preset <name>     Comparison preset (fullSmart, fullOrdered, leftSmart, leftOrdered)
   --format <type>         Output format: text or json (default: text)
   --filter <type>        Filter by diff type: add, delete, modify (comma-separated)
   --parse-nested-json     Parse nested JSON strings (recursive)
   --noise-path <paths>    Ignore specific paths (comma-separated, array indices auto-filtered)
   --special-path <paths>  Mark special paths even if values match (comma-separated)
   -o, --output <path>    Write output to file
   --color, --no-color     Enable or disable colored output
   -v, --version           Show version number
   -h, --help              Show help

 Path Format:
   Use '.' to separate object fields. Array indices [0], [1] are auto-filtered in matching:
   - Object field:       data.timestamp
   - Array element field: items.name  (matches items.[0].name, items.[1].name, etc.)

 Examples:
   # Interactive mode
   diffson

   # Compare JSON strings
   diffson '{"a":1}' '{"a":2}'
   diffson '{"a":1}' '{"b":1}' --filter add

   # Compare JSON files
   diffson --file1 data1.json --file2 data2.json

   # With noise paths (ignore array elements' name fields)
   diffson --file1 data1.json --file2 data2.json --noise-path items.name

   # With special paths
   diffson --file1 data1.json --file2 data2.json --special-path config.settings

   # With nested JSON parsing
   diffson '{"data":"{\\"nested\\":\\"value\\"}"}' '{"data":"{\\"nested\\":\\"value2\\"}"}' --parse-nested-json

   # With options
   diffson --format json --file1 data.json --file2 new.json
   diffson --preset fullOrdered file1.json file2.json
`);
}

function showVersion(): void {
  console.log("diffson version 1.0.0\n");
}

function renderTextResults(results: Result[]): void {
  if (results.length === 0) {
    console.log("No differences found\n");
    return;
  }

  console.log(`Found ${results.length} difference${results.length > 1 ? "s" : ""}:\n`);

  for (const item of results) {
    const symbol = item.diffType === "ADD" ? "+" : item.diffType === "DELETE" ? "-" : "~";
    const path = item.leftPath ?? item.rightPath ?? "(root)";

    console.log(`${symbol} ${path}`);

    if (item.diffType === "DELETE") {
      console.log(`    - ${String(item.left)}`);
    } else if (item.diffType === "ADD") {
      console.log(`    + ${String(item.right)}`);
    } else if (item.diffType === "MODIFY") {
      console.log(`    - ${String(item.left)}`);
      console.log(`    + ${String(item.right)}`);
    }

    console.log("");
  }
}

function performDiff(): void {
  try {
    const json1Content = getJsonContent({
      json: parsed.json1,
      file: parsed.file1,
      side: "first",
    });
    const json2Content = getJsonContent({
      json: parsed.json2,
      file: parsed.file2,
      side: "second",
    });

    const left = JSON.parse(json1Content);
    const right = JSON.parse(json2Content);

    const presetName = parsed.preset ? parsePreset(parsed.preset) : PresetName.FullSmart;
    const diffService = new DiffService(presetName);
    let results = diffService.diffElement(left, right, {
      noisePath: parsed.noisePath || [],
      specialPath: parsed.specialPath || [],
      parseNestedJson: parsed.parseNestedJson,
    });

    if (parsed.filter) {
      results = filterResults(results, parsed.filter);
    }

    if (parsed.format === "json") {
      const output = formatJsonOutput(results, "json");
      if (parsed.output) {
        writeFileSync(parsed.output, output, "utf-8");
        console.log(`Output written to ${parsed.output}\n`);
      } else {
        console.log(output);
      }
    } else {
      renderTextResults(results);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

// Main logic
if (parsed.help) {
  showHelp();
  process.exit(0);
}

if (parsed.version) {
  showVersion();
  process.exit(0);
}

// 判断运行模式
if (shouldRunInteractiveMode()) {
  // 交互模式
  await runInteractiveMode();
} else {
  // 命令行模式
  performDiff();
}
