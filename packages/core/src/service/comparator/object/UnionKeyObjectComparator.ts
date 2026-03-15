import { Inject } from "@wendellhu/redi";
import { AbstractObject } from "./AbstractObject";
import type { ICompareContext, JsonObject, IComparatorOrchestrator } from "../../../contract/type";
import { IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";

export class UnionKeyObjectComparator extends AbstractObject {
  constructor(
    @Inject(IComparatorOrchestratorToken) orchestrator: IComparatorOrchestrator
  ) {
    super(orchestrator);
  }

  diff(a: JsonObject, b: JsonObject, context: ICompareContext): ICompareContext {
    const unionSet = new Set<string>([...Object.keys(a), ...Object.keys(b)]);
    return this.diffValueByKey(a, b, unionSet, context);
  }
}
