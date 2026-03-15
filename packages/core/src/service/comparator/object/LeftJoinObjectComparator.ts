import { Inject } from "@wendellhu/redi";
import { AbstractObject } from "./AbstractObject";
import { type ICompareContext, type JsonObject, IComparatorOrchestrator } from "#contract";


export class LeftJoinObjectComparator extends AbstractObject {
  constructor(
    @Inject(IComparatorOrchestrator) orchestrator: IComparatorOrchestrator
  ) {
    super(orchestrator);
  }

  diff(a: JsonObject, b: JsonObject, context: ICompareContext): ICompareContext {
    return this.diffValueByKey(a, b, new Set(Object.keys(a)), context);
  }
}
