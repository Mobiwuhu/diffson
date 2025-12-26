import { AbstractObject } from "./AbstractObject";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import type { JsonObject } from "../../../contract/type";

export class LeftJoinObjectComparator extends AbstractObject {
  diff(a: JsonObject, b: JsonObject, pathTracker: PathTracker): DiffContext {
    return this.diffValueByKey(a, b, new Set(Object.keys(a)), pathTracker);
  }
}
