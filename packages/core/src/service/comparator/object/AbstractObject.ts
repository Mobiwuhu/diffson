import { Inject } from "@wendellhu/redi";
import type { ICompareContext, IObjectComparator, IComparatorOrchestrator, JsonObject, JsonValue } from "../../../contract/type";
import { IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";
import { findMatchingLogicalPath } from "../../internal/CompareContext";

export abstract class AbstractObject implements IObjectComparator {
  constructor(
    @Inject(IComparatorOrchestratorToken) protected orchestrator: IComparatorOrchestrator
  ) {}

  abstract diff(a: JsonObject, b: JsonObject, context: ICompareContext): ICompareContext;

  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, context: ICompareContext): ICompareContext {
    return this.orchestrator.diffElement(a, b, context);
  }

  protected parentContextAddChildContext(parentResult: ICompareContext, childResult: ICompareContext): void {
    if (childResult.isSame() === false) {
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
    const identityMatchPaths: string[] = [];

    for (const key of keySet) {
      objectDiffContext.addAllPath(key);

      if (this.shouldIgnorePath(objectDiffContext.getIgnorePaths(), objectDiffContext.getLeftPath())) {
        objectDiffContext.removeAllLastPath();
        continue;
      }

      const diffContext = this.diffElement(a[key], b[key], objectDiffContext);
      this.parentContextAddChildContext(objectDiffContext, diffContext);

      this.recordIdentityMatch(diffContext.isSame(), identityMatchPaths, objectDiffContext);
      objectDiffContext.removeAllLastPath();
    }
    objectDiffContext.setIdentityMatchPaths(identityMatchPaths);
    return objectDiffContext;
  }

  private recordIdentityMatch(
    isSame: boolean,
    identityMatchPaths: string[],
    context: ICompareContext
  ): void {
    if (!isSame) {
      return;
    }

    const identityPath = findMatchingLogicalPath(context.getIdentityPaths(), context.getLeftPath());
    if (identityPath !== null) {
      identityMatchPaths.push(identityPath);
    }
  }

  protected shouldIgnorePath(ignorePaths: string[] | null, pathList: string[]): boolean {
    return findMatchingLogicalPath(ignorePaths, pathList) !== null;
  }
}
