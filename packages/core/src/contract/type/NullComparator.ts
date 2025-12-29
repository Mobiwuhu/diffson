import { createIdentifier } from "@wendellhu/redi";
import type { DiffContext } from "../../service/diff/DiffContext";
import type { PathTracker } from "../../service/diff/PathTracker";

export interface INullComparator {
  diff(a: null, b: null, pathTracker: PathTracker): DiffContext;
}

export const INullComparator = createIdentifier<INullComparator>("INullComparator");
