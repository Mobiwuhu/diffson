import { Inject } from "@wendellhu/redi";
import type { IArrayComparator, ICompareContext, IComparatorOrchestrator, JsonArray, JsonValue } from "../../../contract/type";
import { IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";
import { DIFFERENT } from "../../../contract/constant";

export abstract class AbstractArray implements IArrayComparator {
  constructor(
    @Inject(IComparatorOrchestratorToken) protected orchestrator: IComparatorOrchestrator
  ) {}

  abstract diffArray(a: JsonArray, b: JsonArray, context: ICompareContext): ICompareContext;

  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, context: ICompareContext): ICompareContext {
    return this.orchestrator.diffElement(a, b, context);
  }

  protected parentContextAddChildContext(parentResult: ICompareContext, childResult: ICompareContext): void {
    if (childResult.isSame() === DIFFERENT) {
      parentResult.merge(childResult);
    }
  }

  protected constructArrayPath(i: number): string {
    if (i === null || i === undefined || i < 0) {
      throw new Error("数组索引号入参为空或者为负。 入参:" + i);
    }
    return "[" + i + "]";
  }
}
