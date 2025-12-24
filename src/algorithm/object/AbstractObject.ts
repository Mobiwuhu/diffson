import type { ObjectComparator } from "./ObjectComparator";
import type { AlgorithmModule } from "../AlgorithmModule";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonObject, JsonValue } from "../types";
import { DIFFERENT, MERGE_PATH } from "../../model/Constants";

export abstract class AbstractObject implements ObjectComparator {
  protected algorithmModule!: AlgorithmModule;

  abstract diff(a: JsonObject, b: JsonObject, pathModule: PathModule): DiffContext;

  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathModule: PathModule): DiffContext {
    return this.algorithmModule.diffElement(a, b, pathModule);
  }

  constructAlgorithmModule(algorithmModule: AlgorithmModule): void {
    this.algorithmModule = algorithmModule;
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
    pathModule: PathModule
  ): DiffContext {
    const objectDiffContext = new DiffContext();
    const specialPathResult: string[] = [];

    for (const key of keySet) {
      pathModule.addAllpath(key);

      if (!this.needDiff(pathModule.getNoisePahList(), pathModule.getLeftPath())) {
        pathModule.removeAllLastPath();
        continue;
      }

      const diffContext = this.diffElement(a[key], b[key], pathModule);
      this.parentContextAddChildContext(objectDiffContext, diffContext);

      this.specialPathHandle(diffContext.isSame(), specialPathResult, pathModule);
      pathModule.removeAllLastPath();
    }
    objectDiffContext.setSpecialPathResult(specialPathResult);
    return objectDiffContext;
  }

  private specialPathHandle(
    isSame: boolean,
    specialPathResult: string[],
    pathModule: PathModule
  ): void {
    if (!isSame) {
      return;
    }
    const specialPath = this.getSpecialPath(pathModule);
    if (this.existPath(specialPath)) {
      specialPathResult.push(specialPath!);
    }
  }

  private existPath(specialPath: string | null): boolean {
    return specialPath !== null;
  }

  protected getSpecialPath(pathModule: PathModule): string | null {
    if (!pathModule || !pathModule.getSpecialPath() || pathModule.getSpecialPath()!.length === 0) {
      return null;
    }
    const currentPath = this.listJoin(pathModule.getLeftPath());
    if (pathModule.getSpecialPath()!.includes(currentPath)) {
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
