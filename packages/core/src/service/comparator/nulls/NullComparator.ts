import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";

export interface NullComparator extends Comparator {
  diff(a: null, b: null, pathTracker: PathTracker): DiffContext;
}
