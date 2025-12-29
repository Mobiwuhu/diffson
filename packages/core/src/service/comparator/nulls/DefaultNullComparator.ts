import type { INullComparator } from "../../../contract/type";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";

export class DefaultNullComparator implements INullComparator {
  diff(_a: null, _b: null, _pathTracker: PathTracker): DiffContext {
    return new DiffContext();
  }
}
