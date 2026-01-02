import { readFileSync } from "fs";

export function readJsonFile(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch (error) {
    throw new Error(`Failed to read file "${filePath}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function getJsonContent(options: {
  json?: string;
  file?: string;
  side: "first" | "second";
}): string {
  const { json, file, side } = options;

  if (file) {
    return readJsonFile(file);
  }

  if (json) {
    return json;
  }

  throw new Error(`No JSON content provided for the ${side} JSON. Use a JSON string or --file1/--file2 option.`);
}

export function formatJsonOutput(results: any[], format: "json" | "text"): string {
  if (format === "json") {
    return JSON.stringify(results, null, 2);
  }
  return ""; // Text format is handled by the React components
}

export function filterResults(results: any[], filter?: string): any[] {
  if (!filter) {
    return results;
  }

  const filters = filter.split(",").map((f) => f.trim().toLowerCase());

  return results.filter((result) => {
    const diffType = result.diffType?.toLowerCase();
    return filters.includes(diffType);
  });
}

export function getVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(process.cwd() + "/package.json", "utf-8"));
    return pkg.version || "1.0.0";
  } catch {
    return "1.0.0";
  }
}
