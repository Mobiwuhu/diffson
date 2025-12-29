import { Inject } from "@wendellhu/redi";
import { AbstractObject } from "./AbstractObject";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import type { JsonObject, IComparatorOrchestrator } from "../../../contract/type";
import { IComparatorOrchestrator as IComparatorOrchestratorToken } from "../../../contract/type";

export class UnionKeyObjectComparator extends AbstractObject {
  constructor(
    @Inject(IComparatorOrchestratorToken) orchestrator: IComparatorOrchestrator
  ) {
    super(orchestrator);
  }

  diff(a: JsonObject, b: JsonObject, pathTracker: PathTracker): DiffContext {
    const unionSet = new Set<string>([...Object.keys(a), ...Object.keys(b)]);
    return this.diffValueByKey(a, b, unionSet, pathTracker);
  }
}
