import { Inject } from "@wendellhu/redi";
import { AbstractArray } from "./AbstractArray";
import type { ICompareContext, JsonArray, IComparatorOrchestrator } from "../../../contract/type";
import { IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";

export class SequentialArrayComparator extends AbstractArray {
  constructor(
    @Inject(IComparatorOrchestratorToken) orchestrator: IComparatorOrchestrator
  ) {
    super(orchestrator);
  }

  diffArray(a: JsonArray, b: JsonArray, context: ICompareContext): ICompareContext {
    const arrayDiffContext = context.fork();
    const maxLength = Math.max(a.length, b.length);

    for (let i = 0; i < maxLength; i++) {
      arrayDiffContext.addAllPath(this.constructArrayPath(i));
      const diffContext = this.generateDiffResult(a, b, i, arrayDiffContext);
      this.parentContextAddChildContext(arrayDiffContext, diffContext);
      arrayDiffContext.removeAllLastPath();
    }
    return arrayDiffContext;
  }

  private generateDiffResult(
    a: JsonArray,
    b: JsonArray,
    i: number,
    context: ICompareContext
  ): ICompareContext {
    if (i >= a.length && i >= b.length) {
      throw new Error("数组索引号入参超过数组长度。 索引号:" + i + " 数组a:" + a + "数组b：" + b);
    }

    let diffContext: ICompareContext;
    if (i < a.length && i < b.length) {
      diffContext = this.diffElement(a[i], b[i], context);
    } else if (i >= a.length) {
      diffContext = this.diffElement(undefined, b[i], context);
    } else {
      diffContext = this.diffElement(a[i], undefined, context);
    }
    return diffContext;
  }
}
