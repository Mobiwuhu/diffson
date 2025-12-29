import { createIdentifier } from "@wendellhu/redi";
import type { JsonValue } from "./JsonTypes";
import type { DiffContext } from "../../service/diff/DiffContext";
import type { PathTracker } from "../../service/diff/PathTracker";

export interface IOtherComparator {
  diff(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    pathTracker: PathTracker
  ): DiffContext;
}

export const IOtherComparator = createIdentifier<IOtherComparator>("IOtherComparator");
