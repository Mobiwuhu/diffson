import { Inject } from "@wendellhu/redi";
import { AbstractObject } from "./AbstractObject";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import { type JsonObject, IComparatorOrchestrator } from "#contract";


export class LeftJoinObjectComparator extends AbstractObject {
  constructor(
    @Inject(IComparatorOrchestrator) orchestrator: IComparatorOrchestrator
  ) {
    super(orchestrator);
  }

  diff(a: JsonObject, b: JsonObject, pathTracker: PathTracker): DiffContext {
    return this.diffValueByKey(a, b, new Set(Object.keys(a)), pathTracker);
  }
}
