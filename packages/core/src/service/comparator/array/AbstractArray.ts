import type { ArrayComparator } from "./ArrayComparator";
import type { ComparatorOrchestrator } from "../ComparatorOrchestrator";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import type { JsonArray, JsonValue } from "../../../contract/type";
import { DIFFERENT } from "../../../contract/constant";

export abstract class AbstractArray implements ArrayComparator {
  protected orchestrator!: ComparatorOrchestrator;

  abstract diffArray(a: JsonArray, b: JsonArray, pathTracker: PathTracker): DiffContext;

  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathTracker: PathTracker): DiffContext {
    return this.orchestrator.diffElement(a, b, pathTracker);
  }

  constructComparatorOrchestrator(orchestrator: ComparatorOrchestrator): void {
    this.orchestrator = orchestrator;
  }

  protected parentContextAddChildContext(parentResult: DiffContext, childResult: DiffContext): void {
    if (childResult.isSame() === DIFFERENT) {
      for (const singleNodeDifference of childResult.getDiffResultModels()) {
        parentResult.getDiffResultModels().push(singleNodeDifference);
      }
      parentResult.setSame(false);
    }
  }

  protected constructArrayPath(i: number): string {
    if (i === null || i === undefined || i < 0) {
      throw new Error("数组索引号入参为空或者为负。 入参:" + i);
    }
    return "[" + i + "]";
  }
}
