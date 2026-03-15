import type { SingleNodeDifference } from "./SingleNodeDifference";

export interface ICompareContext {
  isSame(): boolean;
  setSame(same: boolean): void;
  getDiffResultModels(): SingleNodeDifference[];
  setDiffResultModels(singleNodeDifferences: SingleNodeDifference[]): void;
  getIdentityMatchPaths(): string[] | null;
  setIdentityMatchPaths(identityMatchPaths: string[]): void;
  getIgnorePaths(): string[] | null;
  setIgnorePaths(ignorePaths: string[]): void;
  getIdentityPaths(): string[] | null;
  setIdentityPaths(identityPaths: string[]): void;
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
