import { createIdentifier } from "@wendellhu/redi";
import type { JsonArray, JsonValue } from "./JsonTypes";
import type { DiffContext } from "../../service/diff/DiffContext";
import type { PathTracker } from "../../service/diff/PathTracker";

export interface IArrayComparator {
  diffArray(a: JsonArray, b: JsonArray, pathTracker: PathTracker): DiffContext;
  diffElement(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    pathTracker: PathTracker
  ): DiffContext;
}

export const IArrayComparator = createIdentifier<IArrayComparator>("IArrayComparator");
