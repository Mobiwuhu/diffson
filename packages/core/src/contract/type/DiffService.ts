import { createIdentifier } from "@wendellhu/redi";
import type { JsonValue } from "./JsonTypes";
import type { Result } from "./Result";

export interface IDiffService {
  /**
   * Diff two JSON strings
   * @param leftJson - Left JSON string
   * @param rightJson - Right JSON string
   * @returns Array of differences
   */
  diffJson(leftJson: string, rightJson: string, options?: {
    noisePath?: string[];
    specialPath?: string[];
  }): Result[];

  /**
   * Diff two JSON objects directly
   * @param left - Left JSON value
   * @param right - Right JSON value
   * @returns Array of differences
   */
  diffElement(left: JsonValue, right: JsonValue, options?: {
    noisePath?: string[];
    specialPath?: string[];
  }): Result[];
}

export const IDiffService = createIdentifier<IDiffService>("IDiffService");
