import { AbstractArray } from "./AbstractArray";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "#service/diff/PathTracker";
import type { JsonArray } from "../../../contract/type";

export class SequentialArrayComparator extends AbstractArray {
  diffArray(a: JsonArray, b: JsonArray, pathTracker: PathTracker): DiffContext {
    const arrayDiffContext = new DiffContext();
    const maxLength = Math.max(a.length, b.length);

    for (let i = 0; i < maxLength; i++) {
      pathTracker.addAllpath(this.constructArrayPath(i));
      const diffContext = this.generateDiffResult(a, b, i, pathTracker);
      this.parentContextAddChildContext(arrayDiffContext, diffContext);
      pathTracker.removeAllLastPath();
    }
    return arrayDiffContext;
  }

  private generateDiffResult(
    a: JsonArray,
    b: JsonArray,
    i: number,
    pathTracker: PathTracker
  ): DiffContext {
    if (i >= a.length && i >= b.length) {
      throw new Error("数组索引号入参超过数组长度。 索引号:" + i + " 数组a:" + a + "数组b：" + b);
    }

    let diffContext: DiffContext;
    if (i < a.length && i < b.length) {
      diffContext = this.diffElement(a[i], b[i], pathTracker);
    } else if (i >= a.length) {
      diffContext = this.diffElement(undefined, b[i], pathTracker);
    } else {
      diffContext = this.diffElement(a[i], undefined, pathTracker);
    }
    return diffContext;
  }
}
