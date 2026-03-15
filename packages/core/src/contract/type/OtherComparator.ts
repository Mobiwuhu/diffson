import { createIdentifier } from "@wendellhu/redi";
import type { ICompareContext } from "./ICompareContext";
import type { JsonValue } from "./JsonTypes";

export interface IOtherComparator {
  diff(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    context: ICompareContext
  ): ICompareContext;
}

export const IOtherComparator = createIdentifier<IOtherComparator>("IOtherComparator");
