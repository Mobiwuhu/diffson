import { createIdentifier } from "@wendellhu/redi";
import type { ICompareContext } from "./ICompareContext";

export interface INullComparator {
  diff(a: null, b: null, context: ICompareContext): ICompareContext;
}

export const INullComparator = createIdentifier<INullComparator>("INullComparator");
