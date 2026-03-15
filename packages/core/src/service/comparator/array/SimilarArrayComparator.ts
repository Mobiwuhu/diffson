import { Inject } from "@wendellhu/redi";
import { AbstractArray } from "./AbstractArray";
import type { ICompareContext, JsonArray, IComparatorOrchestrator } from "../../../contract/type";
import { SingleNodeDifference, IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";

export class SimilarArrayComparator extends AbstractArray {
  private readonly USEABLE = false;
  private readonly USED = true;

  constructor(
    @Inject(IComparatorOrchestratorToken) orchestrator: IComparatorOrchestrator
  ) {
    super(orchestrator);
  }

  diffArray(a: JsonArray, b: JsonArray, context: ICompareContext): ICompareContext {
    let diffContext: ICompareContext;

    if (a.length <= b.length) {
      diffContext = this.diff(a, b, context);
    } else {
      this.exchangeLeftAndRightPath(context);
      diffContext = this.diff(b, a, context);
      this.exchangeLeftAndRightPath(context);
      this.exchangeResult(diffContext);
    }
    return diffContext;
  }

  private exchangeResult(diffContext: ICompareContext): void {
    const singleNodeDifferences = diffContext.getDiffResultModels();
    for (const singleNodeDifference of singleNodeDifferences) {
      this.exchangePathAndResult(singleNodeDifference);
    }
  }

  private exchangePathAndResult(singleNodeDifference: SingleNodeDifference): void {
    const tempStringA = singleNodeDifference.leftPath;
    const tempLeft = singleNodeDifference.left;
    singleNodeDifference.leftPath = singleNodeDifference.rightPath;
    singleNodeDifference.rightPath = tempStringA;
    singleNodeDifference.left = singleNodeDifference.right;
    singleNodeDifference.right = tempLeft;
  }

  private exchangeLeftAndRightPath(context: ICompareContext): void {
    const tempA = context.getLeftPath();
    context.setLeftPath(context.getRightPath());
    context.setRightPath(tempA);
  }

  diff(a: JsonArray, b: JsonArray, context: ICompareContext): ICompareContext {
    const arrayDiffContext = context.fork();
    const rowlength = a.length;
    const linelength = b.length;

    const similarMatrix: number[][] = Array.from({ length: rowlength }, () =>
      Array(linelength).fill(0)
    );

    const row: boolean[] = Array(rowlength).fill(false);
    const line: boolean[] = Array(linelength).fill(false);

    for (let i = 0; i < rowlength; i++) {
      arrayDiffContext.addLeftPath(this.constructArrayPath(i));
      this.constructSimilarMatrix(a, b, i, arrayDiffContext, similarMatrix, row, line);
      arrayDiffContext.removeLastLeftPath();
    }
    return this.obtainDiffResult(a, b, arrayDiffContext, row, line, similarMatrix);
  }

  private obtainDiffResult(
    a: JsonArray,
    b: JsonArray,
    context: ICompareContext,
    row: boolean[],
    line: boolean[],
    similarMatrix: number[][]
  ): ICompareContext {
    this.obtainModifyDiffResult(a, b, context, row, line, similarMatrix, context);
    this.obtainAddDiffResult(b, context, line, context);
    return context;
  }

  private obtainAddDiffResult(
    b: JsonArray,
    context: ICompareContext,
    line: boolean[],
    arrayDiffContext: ICompareContext
  ): void {
    for (let j = 0; j < line.length; j++) {
      if (line[j] === this.USED) {
        continue;
      }
      const addOrDeleteDiffContext = this.constructAddContext(b, j, context);
      this.parentContextAddChildContext(arrayDiffContext, addOrDeleteDiffContext);
    }
  }

  private obtainModifyDiffResult(
    a: JsonArray,
    b: JsonArray,
    context: ICompareContext,
    row: boolean[],
    line: boolean[],
    similarMatrix: number[][],
    arrayDiffContext: ICompareContext
  ): void {
    let counts = 0;
    for (const value of row) {
      if (value === this.USEABLE) {
        counts++;
      }
    }

    for (let n = 0; n < counts; n++) {
      let bestLineIndex = 0;
      let bestRowIndex = 0;
      let minDiffPair = Number.MAX_SAFE_INTEGER;

      for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < line.length; j++) {
          if (row[i] === this.USED || line[j] === this.USED) {
            continue;
          }
          if (similarMatrix[i][j] < minDiffPair) {
            bestRowIndex = i;
            bestLineIndex = j;
            minDiffPair = similarMatrix[i][j];
          }
        }
      }

      const modifyDiffContext = this.constructModifyContext(
        a,
        b,
        bestRowIndex,
        bestLineIndex,
        context
      );
      row[bestRowIndex] = this.USED;
      line[bestLineIndex] = this.USED;
      this.parentContextAddChildContext(arrayDiffContext, modifyDiffContext);
    }
  }

  private constructAddContext(
    b: JsonArray,
    index: number,
    context: ICompareContext
  ): ICompareContext {
    context.addAllPath(this.constructArrayPath(index));
    const diffContext = this.diffElement(undefined, b[index], context);
    context.removeAllLastPath();
    return diffContext;
  }

  private constructModifyContext(
    a: JsonArray,
    b: JsonArray,
    i: number,
    bestLineIndex: number,
    context: ICompareContext
  ): ICompareContext {
    context.addLeftPath(this.constructArrayPath(i));
    context.addRightPath(this.constructArrayPath(bestLineIndex));
    const diffContext = this.diffElement(a[i], b[bestLineIndex], context);
    context.removeAllLastPath();
    return diffContext;
  }

  private constructSimilarMatrix(
    arrayA: JsonArray,
    arrayB: JsonArray,
    rowIndex: number,
    context: ICompareContext,
    similarArray: number[][],
    row: boolean[],
    line: boolean[]
  ): void {
    if (rowIndex < 0 || rowIndex >= arrayB.length) {
      throw new Error(
        "索引号入参超出数组长度。 索引号：" + rowIndex + " 数组B:" + JSON.stringify(arrayB)
      );
    }

    for (let j = 0; j < arrayB.length; j++) {
      if (line[j] === this.USEABLE) {
        context.addRightPath(this.constructArrayPath(j));
        const diffContext = this.diffElement(arrayA[rowIndex], arrayB[j], context);
        context.removeLastRightPath();

        if (diffContext.isSame()) {
          row[rowIndex] = this.USED;
          line[j] = this.USED;
          return;
        } else if (this.existSpecialPath(diffContext.getSpecialPathResult())) {
          similarArray[rowIndex][j] = 0;
        } else {
          similarArray[rowIndex][j] = diffContext.getDiffResultModels().length;
        }
      }
    }
  }

  private existSpecialPath(specialPathResult: string[] | null): boolean {
    return specialPathResult !== null && specialPathResult.length > 0;
  }
}
