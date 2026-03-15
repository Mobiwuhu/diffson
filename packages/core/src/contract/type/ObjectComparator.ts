import { createIdentifier } from "@wendellhu/redi";
import type { ICompareContext } from "./ICompareContext";
import type { JsonObject, JsonValue } from "./JsonTypes";

export interface IObjectComparator {
  diff(a: JsonObject, b: JsonObject, context: ICompareContext): ICompareContext;
  diffElement(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    context: ICompareContext
  ): ICompareContext;
}

export const IObjectComparator = createIdentifier<IObjectComparator>("IObjectComparator");
