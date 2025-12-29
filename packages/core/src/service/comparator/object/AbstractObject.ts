import { Inject } from "@wendellhu/redi";
import type { IObjectComparator, IComparatorOrchestrator, JsonObject, JsonValue } from "../../../contract/type";
import { IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import { DIFFERENT, MERGE_PATH } from "../../../contract/constant";

export abstract class AbstractObject implements IObjectComparator {
  constructor(
    @Inject(IComparatorOrchestratorToken) protected orchestrator: IComparatorOrchestrator
  ) {}

  abstract diff(a: JsonObject, b: JsonObject, pathTracker: PathTracker): DiffContext;

  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathTracker: PathTracker): DiffContext {
    return this.orchestrator.diffElement(a, b, pathTracker);
  }

  protected parentContextAddChildContext(parentResult: DiffContext, childResult: DiffContext): void {
    if (childResult.isSame() === DIFFERENT) {
      for (const singleNodeDifference of childResult.getDiffResultModels()) {
        parentResult.getDiffResultModels().push(singleNodeDifference);
      }
      parentResult.setSame(false);
    }
  }

  protected diffValueByKey(
    a: JsonObject,
    b: JsonObject,
    keySet: Set<string>,
    pathTracker: PathTracker
  ): DiffContext {
    const objectDiffContext = new DiffContext();
    const specialPathResult: string[] = [];

    for (const key of keySet) {
      pathTracker.addAllpath(key);

      if (!this.needDiff(pathTracker.getNoisePahList(), pathTracker.getLeftPath())) {
        pathTracker.removeAllLastPath();
        continue;
      }

      const diffContext = this.diffElement(a[key], b[key], pathTracker);
      this.parentContextAddChildContext(objectDiffContext, diffContext);

      this.specialPathHandle(diffContext.isSame(), specialPathResult, pathTracker);
      pathTracker.removeAllLastPath();
    }
    objectDiffContext.setSpecialPathResult(specialPathResult);
    return objectDiffContext;
  }

  private specialPathHandle(
    isSame: boolean,
    specialPathResult: string[],
    pathTracker: PathTracker
  ): void {
    if (!isSame) {
      return;
    }
    const specialPath = this.getSpecialPath(pathTracker);
    if (this.existPath(specialPath)) {
      specialPathResult.push(specialPath!);
    }
  }

  private existPath(specialPath: string | null): boolean {
    return specialPath !== null;
  }

  protected getSpecialPath(pathTracker: PathTracker): string | null {
    if (!pathTracker || !pathTracker.getSpecialPath() || pathTracker.getSpecialPath()!.length === 0) {
      return null;
    }
    const currentPath = this.listJoin(pathTracker.getLeftPath());
    if (pathTracker.getSpecialPath()!.includes(currentPath)) {
      return currentPath;
    }
    return null;
  }

  protected needDiff(noisePahList: string[] | null, pathList: string[]): boolean {
    if (!noisePahList || !pathList || noisePahList.length === 0 || pathList.length === 0) {
      return true;
    }
    const path = this.listJoin(pathList);
    if (noisePahList.includes(path)) {
      return false;
    }
    return true;
  }

  protected listJoin(path: string[]): string {
    if (!path) {
      throw new Error("当前路径不能为空");
    }
    const filtered = path.filter((e) => e.charAt(0) !== "[");
    return filtered.join(MERGE_PATH);
  }
}
