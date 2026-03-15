import { MERGE_PATH } from "../../contract/constant";
import type { ICompareContext, SingleNodeDifference } from "../../contract/type";

type CompareContextOptions = {
  ignorePaths?: string[] | null;
  identityPaths?: string[] | null;
  leftPath?: string[];
  rightPath?: string[];
  same?: boolean;
  diffResultModels?: SingleNodeDifference[];
  identityMatchPaths?: string[] | null;
};

function stripArrayIndexSegments(pathParts: string[]): string[] {
  return pathParts.filter((part) => part.length > 0 && part.charAt(0) !== "[");
}

export function normalizeLogicalPath(path: string): string {
  return stripArrayIndexSegments(path.split(MERGE_PATH)).join(MERGE_PATH);
}

export function normalizeLogicalPaths(paths: string[]): string[] {
  return paths.map(normalizeLogicalPath);
}

export function toLogicalPath(pathParts: string[]): string {
  return stripArrayIndexSegments(pathParts).join(MERGE_PATH);
}

export function findMatchingLogicalPath(paths: string[] | null, pathParts: string[]): string | null {
  if (!paths || paths.length === 0 || pathParts.length === 0) {
    return null;
  }

  const currentPath = toLogicalPath(pathParts);
  if (currentPath.length === 0) {
    return null;
  }

  return paths.includes(currentPath) ? currentPath : null;
}

export class CompareContext implements ICompareContext {
  private leftPath: string[];
  private rightPath: string[];
  private identityPaths: string[] | null;
  private ignorePaths: string[] | null;
  private same: boolean;
  private diffResultModels: SingleNodeDifference[];
  private identityMatchPaths: string[] | null;

  constructor(options: CompareContextOptions = {}) {
    this.leftPath = [...(options.leftPath ?? [])];
    this.rightPath = [...(options.rightPath ?? [])];
    this.identityPaths = options.identityPaths ? [...options.identityPaths] : null;
    this.ignorePaths = options.ignorePaths ? [...options.ignorePaths] : null;
    this.same = options.same ?? true;
    this.diffResultModels = [...(options.diffResultModels ?? [])];
    this.identityMatchPaths = options.identityMatchPaths ? [...options.identityMatchPaths] : null;
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

  getIdentityMatchPaths(): string[] | null {
    return this.identityMatchPaths;
  }

  setIdentityMatchPaths(identityMatchPaths: string[]): void {
    this.identityMatchPaths = [...identityMatchPaths];
  }

  getIgnorePaths(): string[] | null {
    return this.ignorePaths;
  }

  setIgnorePaths(ignorePaths: string[]): void {
    this.ignorePaths = [...ignorePaths];
  }

  getIdentityPaths(): string[] | null {
    return this.identityPaths;
  }

  setIdentityPaths(identityPaths: string[]): void {
    this.identityPaths = [...identityPaths];
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
      ignorePaths: this.ignorePaths,
      identityPaths: this.identityPaths,
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
