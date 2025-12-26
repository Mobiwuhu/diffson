import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import type { JsonArray, JsonValue } from "../../../contract/type";
import type { ComparatorOrchestrator } from "../ComparatorOrchestrator";

export interface ArrayComparator extends Comparator {
  diffArray(a: JsonArray, b: JsonArray, pathTracker: PathTracker): DiffContext;
  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathTracker: PathTracker): DiffContext;
  constructComparatorOrchestrator(orchestrator: ComparatorOrchestrator): void;
}
