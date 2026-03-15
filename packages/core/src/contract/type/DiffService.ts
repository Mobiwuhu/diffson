import { createIdentifier } from "@wendellhu/redi";
import type { JsonValue } from "./JsonTypes";
import type { Result } from "./Result";

export interface DiffArrayMatchingOptions {
  identityPaths?: string[];
}

export interface DiffOptions {
  ignorePaths?: string[];
  arrayMatching?: DiffArrayMatchingOptions;
  parseNestedJson?: boolean;
}

export interface IDiffService {
  /**
   * Diff two JSON strings
   * @param leftJson - Left JSON string
   * @param rightJson - Right JSON string
   * @returns Array of differences
   */
  diffJson(leftJson: string, rightJson: string, options?: DiffOptions): Result[];

  /**
   * Diff two JSON objects directly
   * @param left - Left JSON value
   * @param right - Right JSON value
   * @returns Array of differences
   */
  diffElement(left: JsonValue, right: JsonValue, options?: DiffOptions): Result[];
}

export const IDiffService = createIdentifier<IDiffService>("IDiffService");
