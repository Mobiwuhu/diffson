import type { NullComparator } from "./NullComparator";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";

export class DefaultNullComparator implements NullComparator {
  diff(_a: null, _b: null, _pathTracker: PathTracker): DiffContext {
    return new DiffContext();
  }
}
