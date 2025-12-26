import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import type { JsonObject, JsonValue } from "../../../contract/type";
import type { ComparatorOrchestrator } from "../ComparatorOrchestrator";

export interface ObjectComparator extends Comparator {
  diff(a: JsonObject, b: JsonObject, pathTracker: PathTracker): DiffContext;
  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathTracker: PathTracker): DiffContext;
  constructComparatorOrchestrator(orchestrator: ComparatorOrchestrator): void;
}
