export interface CliOptions {
  json1?: string;
  json2?: string;
  file1?: string;
  file2?: string;
  help?: boolean;
  version?: boolean;
  interactive?: boolean;
  preset?: string;
  format?: "json" | "text";
  output?: string;
  filter?: string;
  color?: boolean;
  parseNestedJson?: boolean;
  ignorePaths?: string[];
  arrayIdentityPaths?: string[];
}
