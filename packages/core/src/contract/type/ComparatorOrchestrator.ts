import { createIdentifier } from "@wendellhu/redi";
import type { JsonValue } from "./JsonTypes";
import type { DiffContext } from "../../service/diff/DiffContext";
import type { PathTracker } from "../../service/diff/PathTracker";
import type { IArrayComparator } from "./ArrayComparator";

export interface IComparatorOrchestrator {
  diffElement(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    pathTracker: PathTracker
  ): DiffContext;
  getArrayComparator(): IArrayComparator;
}

export const IComparatorOrchestrator = createIdentifier<IComparatorOrchestrator>("IComparatorOrchestrator");
