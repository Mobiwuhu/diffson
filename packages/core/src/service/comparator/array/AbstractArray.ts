import { Inject } from "@wendellhu/redi";
import type { IArrayComparator, IComparatorOrchestrator, JsonArray, JsonValue } from "../../../contract/type";
import { IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import { DIFFERENT } from "../../../contract/constant";

export abstract class AbstractArray implements IArrayComparator {
  constructor(
    @Inject(IComparatorOrchestratorToken) protected orchestrator: IComparatorOrchestrator
  ) {}

  abstract diffArray(a: JsonArray, b: JsonArray, pathTracker: PathTracker): DiffContext;

  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathTracker: PathTracker): DiffContext {
    return this.orchestrator.diffElement(a, b, pathTracker);
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
