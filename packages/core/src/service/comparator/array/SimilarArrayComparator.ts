import { AbstractArray } from "./AbstractArray";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import type { JsonArray } from "../../../contract/type";
import { SingleNodeDifference } from "../../../contract/type";

export class SimilarArrayComparator extends AbstractArray {
  private readonly USEABLE = false;
  private readonly USED = true;

  diffArray(a: JsonArray, b: JsonArray, pathTracker: PathTracker): DiffContext {
    let diffContext: DiffContext;

    if (a.length <= b.length) {
      diffContext = this.diff(a, b, pathTracker);
    } else {
      this.exchangeLeftAndRightPath(pathTracker);
      diffContext = this.diff(b, a, pathTracker);
      this.exchangeLeftAndRightPath(pathTracker);
      this.exchangeResult(diffContext);
    }
    return diffContext;
  }

  private exchangeResult(diffContext: DiffContext): void {
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

  private exchangeLeftAndRightPath(pathTracker: PathTracker): void {
    const tempA = pathTracker.getLeftPath();
    pathTracker.setLeftPath(pathTracker.getRightPath());
    pathTracker.setRightPath(tempA);
  }

  diff(a: JsonArray, b: JsonArray, pathTracker: PathTracker): DiffContext {
    const rowlength = a.length;
    const linelength = b.length;

    const similarMatrix: number[][] = Array.from({ length: rowlength }, () =>
      Array(linelength).fill(0)
    );

    const row: boolean[] = Array(rowlength).fill(false);
    const line: boolean[] = Array(linelength).fill(false);

    for (let i = 0; i < rowlength; i++) {
      pathTracker.addLeftPath(this.constructArrayPath(i));
      this.constructSimilarMatrix(a, b, i, pathTracker, similarMatrix, row, line);
      pathTracker.removeLastLeftPath();
    }
    return this.obtainDiffResult(a, b, pathTracker, row, line, similarMatrix);
  }

  private obtainDiffResult(
    a: JsonArray,
    b: JsonArray,
    pathTracker: PathTracker,
    row: boolean[],
    line: boolean[],
    similarMatrix: number[][]
  ): DiffContext {
    const arrayDiffContext = new DiffContext();
    this.obtainModifyDiffResult(a, b, pathTracker, row, line, similarMatrix, arrayDiffContext);
    this.obtainAddDiffResult(b, pathTracker, line, arrayDiffContext);
    return arrayDiffContext;
  }

  private obtainAddDiffResult(
    b: JsonArray,
    pathTracker: PathTracker,
    line: boolean[],
    arrayDiffContext: DiffContext
  ): void {
    for (let j = 0; j < line.length; j++) {
      if (line[j] === this.USED) {
        continue;
      }
      const addOrDeleteDiffContext = this.constructAddContext(b, j, pathTracker);
      this.parentContextAddChildContext(arrayDiffContext, addOrDeleteDiffContext);
    }
  }

  private obtainModifyDiffResult(
    a: JsonArray,
    b: JsonArray,
    pathTracker: PathTracker,
    row: boolean[],
    line: boolean[],
    similarMatrix: number[][],
    arrayDiffContext: DiffContext
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
        pathTracker
      );
      row[bestRowIndex] = this.USED;
      line[bestLineIndex] = this.USED;
      this.parentContextAddChildContext(arrayDiffContext, modifyDiffContext);
    }
  }

  private constructAddContext(
    b: JsonArray,
    index: number,
    pathTracker: PathTracker
  ): DiffContext {
    pathTracker.addAllpath(this.constructArrayPath(index));
    const diffContext = this.diffElement(undefined, b[index], pathTracker);
    pathTracker.removeAllLastPath();
    return diffContext;
  }

  private constructModifyContext(
    a: JsonArray,
    b: JsonArray,
    i: number,
    bestLineIndex: number,
    pathTracker: PathTracker
  ): DiffContext {
    pathTracker.addLeftPath(this.constructArrayPath(i));
    pathTracker.addRightPath(this.constructArrayPath(bestLineIndex));
    const diffContext = this.diffElement(a[i], b[bestLineIndex], pathTracker);
    pathTracker.removeAllLastPath();
    return diffContext;
  }

  private constructSimilarMatrix(
    arrayA: JsonArray,
    arrayB: JsonArray,
    rowIndex: number,
    pathTracker: PathTracker,
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
        pathTracker.addRightPath(this.constructArrayPath(j));
        const diffContext = this.diffElement(arrayA[rowIndex], arrayB[j], pathTracker);
        pathTracker.removeLastRightPath();

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
