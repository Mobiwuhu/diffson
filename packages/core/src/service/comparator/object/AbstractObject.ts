import { Inject } from "@wendellhu/redi";
import type { ICompareContext, IObjectComparator, IComparatorOrchestrator, JsonObject, JsonValue } from "../../../contract/type";
import { IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";
import { DIFFERENT, MERGE_PATH } from "../../../contract/constant";

export abstract class AbstractObject implements IObjectComparator {
  constructor(
    @Inject(IComparatorOrchestratorToken) protected orchestrator: IComparatorOrchestrator
  ) {}

  abstract diff(a: JsonObject, b: JsonObject, context: ICompareContext): ICompareContext;

  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, context: ICompareContext): ICompareContext {
    return this.orchestrator.diffElement(a, b, context);
  }

  protected parentContextAddChildContext(parentResult: ICompareContext, childResult: ICompareContext): void {
    if (childResult.isSame() === DIFFERENT) {
      parentResult.merge(childResult);
    }
  }

  protected diffValueByKey(
    a: JsonObject,
    b: JsonObject,
    keySet: Set<string>,
    context: ICompareContext
  ): ICompareContext {
    const objectDiffContext = context.fork();
    const specialPathResult: string[] = [];

    for (const key of keySet) {
      objectDiffContext.addAllPath(key);

      if (!this.needDiff(objectDiffContext.getNoisePathList(), objectDiffContext.getLeftPath())) {
        objectDiffContext.removeAllLastPath();
        continue;
      }

      const diffContext = this.diffElement(a[key], b[key], objectDiffContext);
      this.parentContextAddChildContext(objectDiffContext, diffContext);

      this.specialPathHandle(diffContext.isSame(), specialPathResult, objectDiffContext);
      objectDiffContext.removeAllLastPath();
    }
    objectDiffContext.setSpecialPathResult(specialPathResult);
    return objectDiffContext;
  }

  private specialPathHandle(
    isSame: boolean,
    specialPathResult: string[],
    context: ICompareContext
  ): void {
    if (!isSame) {
      return;
    }
    const specialPath = this.getSpecialPath(context);
    if (this.existPath(specialPath)) {
      specialPathResult.push(specialPath!);
    }
  }

  private existPath(specialPath: string | null): boolean {
    return specialPath !== null;
  }

  protected getSpecialPath(context: ICompareContext): string | null {
    if (!context.getSpecialPath() || context.getSpecialPath()!.length === 0) {
      return null;
    }
    const currentPath = this.listJoin(context.getLeftPath());
    if (context.getSpecialPath()!.includes(currentPath)) {
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
