#!/usr/bin/env bun
import { parseArgs } from "./parseArgs";
import { writeFileSync } from "fs";
import { formatJsonOutput } from "./utils";
import { getJsonContent, filterResults } from "./utils";
import { DiffService, PresetName, type Result } from "@diffson/core";

const args = process.argv.slice(2);
const parsed = parseArgs(args);

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

 Usage: diffson <json1> <json2> [options]

 Positional Arguments:
   json1                  First JSON string (or use --file1)
   json2                  Second JSON string (or use --file2)

 Options:
   -f1, --file1 <path>     Read first JSON from file
   -f2, --file2 <path>     Read second JSON from file
   -p, --preset <name>     Comparison preset (fullSmart, fullOrdered, leftSmart, leftOrdered)
   --format <type>         Output format: text or json (default: text)
   --filter <type>        Filter by diff type: add, delete, modify (comma-separated)
   -o, --output <path>    Write output to file
   --color, --no-color     Enable or disable colored output
   -I, --interactive       Interactive mode
   -v, --version           Show version number
   -h, --help              Show help

 Examples:
   diffson '{"a":1}' '{"a":2}'
   diffson --file1 data1.json --file2 data2.json
   diffson '{"a":1}' '{"b":1}' --filter add
   diffson --format json --file1 data.json --file2 new.json
   diffson --preset fullOrdered file1.json file2.json
   diffson --interactive
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
    let results = diffService.diffElement(left, right);

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

if (parsed.interactive) {
  // Interactive mode is handled by interactive.ts
  console.log("Interactive mode is available via 'diffson-interactive' command\n");
  console.log("Run: diffson-interactive\n");
  process.exit(0);
}

performDiff();
