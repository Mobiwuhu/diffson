import { createIdentifier } from "@wendellhu/redi";
import type { DiffContext } from "../../service/diff/DiffContext";
import type { PathTracker } from "../../service/diff/PathTracker";

export interface IPrimitiveComparator {
  diff(
    a: string | number | boolean,
    b: string | number | boolean,
    pathTracker: PathTracker
  ): DiffContext;
}

export const IPrimitiveComparator = createIdentifier<IPrimitiveComparator>("IPrimitiveComparator");
