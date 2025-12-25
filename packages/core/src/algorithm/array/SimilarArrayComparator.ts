import { AbstractArray } from "./AbstractArray";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonArray } from "../types";
import { SingleNodeDifference } from "../../model/SingleNodeDifference";

export class SimilarArrayComparator extends AbstractArray {
  private readonly USEABLE = false;
  private readonly USED = true;

  diffArray(a: JsonArray, b: JsonArray, pathModule: PathModule): DiffContext {
    let diffContext: DiffContext;

    if (a.length <= b.length) {
      diffContext = this.diff(a, b, pathModule);
    } else {
      this.exchangeLeftAndRightPath(pathModule);
      diffContext = this.diff(b, a, pathModule);
      this.exchangeLeftAndRightPath(pathModule);
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

  private exchangeLeftAndRightPath(pathModule: PathModule): void {
    const tempA = pathModule.getLeftPath();
    pathModule.setLeftPath(pathModule.getRightPath());
    pathModule.setRightPath(tempA);
  }

  diff(a: JsonArray, b: JsonArray, pathModule: PathModule): DiffContext {
    const rowlength = a.length;
    const linelength = b.length;

    const similarMatrix: number[][] = Array.from({ length: rowlength }, () =>
      Array(linelength).fill(0)
    );

    const row: boolean[] = Array(rowlength).fill(false);
    const line: boolean[] = Array(linelength).fill(false);

    for (let i = 0; i < rowlength; i++) {
      pathModule.addLeftPath(this.constructArrayPath(i));
      this.constructSimilarMatrix(a, b, i, pathModule, similarMatrix, row, line);
      pathModule.removeLastLeftPath();
    }
    return this.obtainDiffResult(a, b, pathModule, row, line, similarMatrix);
  }

  private obtainDiffResult(
    a: JsonArray,
    b: JsonArray,
    pathModule: PathModule,
    row: boolean[],
    line: boolean[],
    similarMatrix: number[][]
  ): DiffContext {
    const arrayDiffContext = new DiffContext();
    this.obtainModifyDiffResult(a, b, pathModule, row, line, similarMatrix, arrayDiffContext);
    this.obtainAddDiffResult(b, pathModule, line, arrayDiffContext);
    return arrayDiffContext;
  }

  private obtainAddDiffResult(
    b: JsonArray,
    pathModule: PathModule,
    line: boolean[],
    arrayDiffContext: DiffContext
  ): void {
    for (let j = 0; j < line.length; j++) {
      if (line[j] === this.USED) {
        continue;
      }
      const addOrDeleteDiffContext = this.constructAddContext(b, j, pathModule);
      this.parentContextAddChildContext(arrayDiffContext, addOrDeleteDiffContext);
    }
  }

  private obtainModifyDiffResult(
    a: JsonArray,
    b: JsonArray,
    pathModule: PathModule,
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
        pathModule
      );
      row[bestRowIndex] = this.USED;
      line[bestLineIndex] = this.USED;
      this.parentContextAddChildContext(arrayDiffContext, modifyDiffContext);
    }
  }

  private constructAddContext(
    b: JsonArray,
    index: number,
    pathModule: PathModule
  ): DiffContext {
    pathModule.addAllpath(this.constructArrayPath(index));
    const diffContext = this.diffElement(undefined, b[index], pathModule);
    pathModule.removeAllLastPath();
    return diffContext;
  }

  private constructModifyContext(
    a: JsonArray,
    b: JsonArray,
    i: number,
    bestLineIndex: number,
    pathModule: PathModule
  ): DiffContext {
    pathModule.addLeftPath(this.constructArrayPath(i));
    pathModule.addRightPath(this.constructArrayPath(bestLineIndex));
    const diffContext = this.diffElement(a[i], b[bestLineIndex], pathModule);
    pathModule.removeAllLastPath();
    return diffContext;
  }

  private constructSimilarMatrix(
    arrayA: JsonArray,
    arrayB: JsonArray,
    rowIndex: number,
    pathModule: PathModule,
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
        pathModule.addRightPath(this.constructArrayPath(j));
        const diffContext = this.diffElement(arrayA[rowIndex], arrayB[j], pathModule);
        pathModule.removeLastRightPath();

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
