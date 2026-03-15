import { createIdentifier } from "@wendellhu/redi";
import type { ICompareContext } from "./ICompareContext";

export interface IPrimitiveComparator {
  diff(
    a: string | number | boolean,
    b: string | number | boolean,
    context: ICompareContext
  ): ICompareContext;
}

export const IPrimitiveComparator = createIdentifier<IPrimitiveComparator>("IPrimitiveComparator");
