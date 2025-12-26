import { SingleNodeDifference } from "../../contract/type";

export class DiffContext {
  private _isSame: boolean;
  private singleNodeDifferences: SingleNodeDifference[];
  private specialPathResult: string[] | null;

  constructor(isSame: boolean = true) {
    this._isSame = isSame;
    this.singleNodeDifferences = [];
    this.specialPathResult = null;
  }

  isSame(): boolean {
    return this._isSame;
  }

  setSame(same: boolean): void {
    this._isSame = same;
  }

  getDiffResultModels(): SingleNodeDifference[] {
    return this.singleNodeDifferences;
  }

  setDiffResultModels(singleNodeDifferences: SingleNodeDifference[]): void {
    this.singleNodeDifferences = singleNodeDifferences;
  }

  getSpecialPathResult(): string[] | null {
    return this.specialPathResult;
  }

  setSpecialPathResult(specialPathResult: string[]): void {
    this.specialPathResult = specialPathResult;
  }
}
