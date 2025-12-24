import { AbstractArray } from "./AbstractArray";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonArray } from "../types";

export class SimpleArrayComparator extends AbstractArray {
  diffArray(a: JsonArray, b: JsonArray, pathModule: PathModule): DiffContext {
    const arrayDiffContext = new DiffContext();
    const maxLength = Math.max(a.length, b.length);

    for (let i = 0; i < maxLength; i++) {
      pathModule.addAllpath(this.constructArrayPath(i));
      const diffContext = this.generateDiffResult(a, b, i, pathModule);
      this.parentContextAddChildContext(arrayDiffContext, diffContext);
    }
    return arrayDiffContext;
  }

  private generateDiffResult(
    a: JsonArray,
    b: JsonArray,
    i: number,
    pathModule: PathModule
  ): DiffContext {
    if (i >= a.length && i >= b.length) {
      throw new Error("数组索引号入参超过数组长度。 索引号:" + i + " 数组a:" + a + "数组b：" + b);
    }

    let diffContext: DiffContext;
    if (i < a.length && i < b.length) {
      diffContext = this.diffElement(a[i], b[i], pathModule);
    } else if (i >= a.length) {
      diffContext = this.diffElement(undefined, b[i], pathModule);
    } else {
      diffContext = this.diffElement(a[i], undefined, pathModule);
    }
    return diffContext;
  }
}
