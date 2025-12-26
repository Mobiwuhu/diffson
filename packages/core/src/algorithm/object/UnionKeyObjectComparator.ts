import { AbstractObject } from "./AbstractObject";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonObject } from "../types";

export class UnionKeyObjectComparator extends AbstractObject {
  diff(a: JsonObject, b: JsonObject, pathModule: PathModule): DiffContext {
    const unionSet = new Set<string>([...Object.keys(a), ...Object.keys(b)]);
    return this.diffValueByKey(a, b, unionSet, pathModule);
  }
}
