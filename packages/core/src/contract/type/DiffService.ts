import { createIdentifier } from "@wendellhu/redi";
import type { JsonValue } from "./JsonTypes";
import type { Result } from "./Result";

export interface IDiffService {
  compare(left: JsonValue, right: JsonValue): Result[];
}

export const IDiffService = createIdentifier<IDiffService>("IDiffService");
