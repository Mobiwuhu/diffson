import { createIdentifier } from "@wendellhu/redi";
import type { ICompareContext } from "./ICompareContext";
import type { JsonValue } from "./JsonTypes";
import type { IArrayComparator } from "./ArrayComparator";

export interface IComparatorOrchestrator {
  diffElement(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    context: ICompareContext
  ): ICompareContext;
  getArrayComparator(): IArrayComparator;
}

export const IComparatorOrchestrator = createIdentifier<IComparatorOrchestrator>("IComparatorOrchestrator");
