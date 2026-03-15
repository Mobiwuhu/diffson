import { createIdentifier } from "@wendellhu/redi";
import type { ICompareContext } from "./ICompareContext";
import type { JsonArray, JsonValue } from "./JsonTypes";

export interface IArrayComparator {
  diffArray(a: JsonArray, b: JsonArray, context: ICompareContext): ICompareContext;
  diffElement(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    context: ICompareContext
  ): ICompareContext;
}

export const IArrayComparator = createIdentifier<IArrayComparator>("IArrayComparator");
