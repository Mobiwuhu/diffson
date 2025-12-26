import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";

export interface PrimitiveComparator extends Comparator {
  diff(a: string | number | boolean, b: string | number | boolean, pathTracker: PathTracker): DiffContext;
}
