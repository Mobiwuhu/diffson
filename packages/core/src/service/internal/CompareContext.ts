import type { ICompareContext, SingleNodeDifference } from "../../contract/type";

type CompareContextOptions = {
  noisePathList?: string[] | null;
  specialPath?: string[] | null;
  leftPath?: string[];
  rightPath?: string[];
  same?: boolean;
  diffResultModels?: SingleNodeDifference[];
  specialPathResult?: string[] | null;
};

export class CompareContext implements ICompareContext {
  private leftPath: string[];
  private rightPath: string[];
  private specialPath: string[] | null;
  private noisePathList: string[] | null;
  private same: boolean;
  private diffResultModels: SingleNodeDifference[];
  private specialPathResult: string[] | null;

  constructor(options: CompareContextOptions = {}) {
    this.leftPath = [...(options.leftPath ?? [])];
    this.rightPath = [...(options.rightPath ?? [])];
    this.specialPath = options.specialPath ? [...options.specialPath] : null;
    this.noisePathList = options.noisePathList ? [...options.noisePathList] : null;
    this.same = options.same ?? true;
    this.diffResultModels = [...(options.diffResultModels ?? [])];
    this.specialPathResult = options.specialPathResult ? [...options.specialPathResult] : null;
  }

  isSame(): boolean {
    return this.same;
  }

  setSame(same: boolean): void {
    this.same = same;
  }

  getDiffResultModels(): SingleNodeDifference[] {
    return this.diffResultModels;
  }

  setDiffResultModels(singleNodeDifferences: SingleNodeDifference[]): void {
    this.diffResultModels = [...singleNodeDifferences];
  }

  getSpecialPathResult(): string[] | null {
    return this.specialPathResult;
  }

  setSpecialPathResult(specialPathResult: string[]): void {
    this.specialPathResult = [...specialPathResult];
  }

  getNoisePathList(): string[] | null {
    return this.noisePathList;
  }

  setNoisePathList(noisePathList: string[]): void {
    this.noisePathList = [...noisePathList];
  }

  getSpecialPath(): string[] | null {
    return this.specialPath;
  }

  setSpecialPath(specialPath: string[]): void {
    this.specialPath = [...specialPath];
  }

  getLeftPath(): string[] {
    return this.leftPath;
  }

  setLeftPath(leftPath: string[]): void {
    this.leftPath = [...leftPath];
  }

  getRightPath(): string[] {
    return this.rightPath;
  }

  setRightPath(rightPath: string[]): void {
    this.rightPath = [...rightPath];
  }

  addAllPath(lastPath: string): void {
    this.leftPath.push(lastPath);
    this.rightPath.push(lastPath);
  }

  addLeftPath(lastPath: string): void {
    this.leftPath.push(lastPath);
  }

  addRightPath(lastPath: string): void {
    this.rightPath.push(lastPath);
  }

  removeAllLastPath(): void {
    this.leftPath.pop();
    this.rightPath.pop();
  }

  removeLastLeftPath(): void {
    this.leftPath.pop();
  }

  removeLastRightPath(): void {
    this.rightPath.pop();
  }

  fork(): ICompareContext {
    return new CompareContext({
      noisePathList: this.noisePathList,
      specialPath: this.specialPath,
      leftPath: this.leftPath,
      rightPath: this.rightPath,
    });
  }

  merge(childContext: ICompareContext): void {
    if (childContext.isSame()) {
      return;
    }

    this.diffResultModels.push(...childContext.getDiffResultModels());
    this.same = false;
  }
}
