import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import type { JsonValue } from "../../../contract/type";

export interface OtherComparator extends Comparator {
  diff(a: JsonValue | undefined, b: JsonValue | undefined, pathTracker: PathTracker): DiffContext;
}
