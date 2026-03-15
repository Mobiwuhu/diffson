import type { SingleNodeDifference } from "./SingleNodeDifference";

export interface ICompareContext {
  isSame(): boolean;
  setSame(same: boolean): void;
  getDiffResultModels(): SingleNodeDifference[];
  setDiffResultModels(singleNodeDifferences: SingleNodeDifference[]): void;
  getSpecialPathResult(): string[] | null;
  setSpecialPathResult(specialPathResult: string[]): void;
  getNoisePathList(): string[] | null;
  setNoisePathList(noisePathList: string[]): void;
  getSpecialPath(): string[] | null;
  setSpecialPath(specialPath: string[]): void;
  getLeftPath(): string[];
  setLeftPath(leftPath: string[]): void;
  getRightPath(): string[];
  setRightPath(rightPath: string[]): void;
  addAllPath(lastPath: string): void;
  addLeftPath(lastPath: string): void;
  addRightPath(lastPath: string): void;
  removeAllLastPath(): void;
  removeLastLeftPath(): void;
  removeLastRightPath(): void;
  fork(): ICompareContext;
  merge(childContext: ICompareContext): void;
}
