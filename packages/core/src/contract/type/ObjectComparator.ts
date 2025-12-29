import { createIdentifier } from "@wendellhu/redi";
import type { JsonObject, JsonValue } from "./JsonTypes";
import type { DiffContext } from "../../service/diff/DiffContext";
import type { PathTracker } from "../../service/diff/PathTracker";

export interface IObjectComparator {
  diff(a: JsonObject, b: JsonObject, pathTracker: PathTracker): DiffContext;
  diffElement(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    pathTracker: PathTracker
  ): DiffContext;
}

export const IObjectComparator = createIdentifier<IObjectComparator>("IObjectComparator");
