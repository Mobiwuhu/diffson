import type { ArrayComparator } from "./ArrayComparator";
import type { AlgorithmModule } from "../AlgorithmModule";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonArray, JsonValue } from "../types";
import { DIFFERENT } from "../../model/Constants";

export abstract class AbstractArray implements ArrayComparator {
  protected algorithmModule!: AlgorithmModule;

  abstract diffArray(a: JsonArray, b: JsonArray, pathModule: PathModule): DiffContext;

  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathModule: PathModule): DiffContext {
    return this.algorithmModule.diffElement(a, b, pathModule);
  }

  constructAlgorithmModule(algorithmModule: AlgorithmModule): void {
    this.algorithmModule = algorithmModule;
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
