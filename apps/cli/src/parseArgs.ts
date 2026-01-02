import type { CliOptions } from "./types";

export function parseArgs(args: string[]): CliOptions {
  const result: CliOptions = {};
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    switch (arg) {
      case "--help":
      case "-h":
        result.help = true;
        break;

      case "--version":
      case "-v":
        result.version = true;
        break;

      case "--interactive":
      case "-I":
        result.interactive = true;
        break;

      case "--file1":
      case "-f1":
        if (i + 1 < args.length) {
          result.file1 = args[i + 1];
          i++;
        }
        break;

      case "--file2":
      case "-f2":
        if (i + 1 < args.length) {
          result.file2 = args[i + 1];
          i++;
        }
        break;

      case "--preset":
      case "-p":
        if (i + 1 < args.length) {
          result.preset = args[i + 1];
          i++;
        }
        break;

      case "--format":
        if (i + 1 < args.length) {
          result.format = args[i + 1] as "json" | "text";
          i++;
        }
        break;

      case "--output":
      case "-o":
        if (i + 1 < args.length) {
          result.output = args[i + 1];
          i++;
        }
        break;

      case "--filter":
        if (i + 1 < args.length) {
          result.filter = args[i + 1];
          i++;
        }
        break;

      case "--color":
        result.color = true;
        break;

      case "--no-color":
        result.color = false;
        break;

      case "--parse-nested-json":
        result.parseNestedJson = true;
        break;

      case "--noise-path":
        if (i + 1 < args.length) {
          result.noisePath = args[i + 1].split(",").map(p => p.trim());
          i++;
        }
        break;

      case "--special-path":
        if (i + 1 < args.length) {
          result.specialPath = args[i + 1].split(",").map(p => p.trim());
          i++;
        }
        break;

      default:
        // Positional arguments for JSON strings
        if (!result.json1) {
          result.json1 = arg;
        } else if (!result.json2) {
          result.json2 = arg;
        }
        break;
    }

    i++;
  }

  return result;
}
