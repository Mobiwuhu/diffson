import { AbstractObject } from "./AbstractObject";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonObject } from "../types";

export class LeftJoinObjectComparator extends AbstractObject {
  diff(a: JsonObject, b: JsonObject, pathModule: PathModule): DiffContext {
    return this.diffValueByKey(a, b, new Set(Object.keys(a)), pathModule);
  }
}
