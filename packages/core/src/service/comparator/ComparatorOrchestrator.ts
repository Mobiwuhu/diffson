import { Inject } from "@wendellhu/redi";
import {
  type IComparatorOrchestrator,
  type IObjectComparator,
  IObjectComparator as IObjectComparatorToken,
  type IArrayComparator,
  IArrayComparator as IArrayComparatorToken,
  type IPrimitiveComparator,
  IPrimitiveComparator as IPrimitiveComparatorToken,
  type INullComparator,
  INullComparator as INullComparatorToken,
  type IOtherComparator,
  IOtherComparator as IOtherComparatorToken,
  type JsonValue,
} from "../../contract/type";
import { DiffContext } from "../diff/DiffContext";
import type { PathTracker } from "../diff/PathTracker";
import { isJsonObject, isJsonArray, isJsonPrimitive, isJsonNull } from "../../util";

export class ComparatorOrchestrator implements IComparatorOrchestrator {
  constructor(
    @Inject(IObjectComparatorToken) protected objectComparator: IObjectComparator,
    @Inject(IArrayComparatorToken) protected arrayComparator: IArrayComparator,
    @Inject(IPrimitiveComparatorToken) protected primitiveComparator: IPrimitiveComparator,
    @Inject(INullComparatorToken) protected nullComparator: INullComparator,
    @Inject(IOtherComparatorToken) protected otherComparator: IOtherComparator
  ) {}

  diffElement(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    pathTracker: PathTracker
  ): DiffContext {
    if (isJsonObject(a) && isJsonObject(b)) {
      return this.objectComparator.diff(a, b, pathTracker);
    } else if (isJsonArray(a) && isJsonArray(b)) {
      return this.arrayComparator.diffArray(a, b, pathTracker);
    } else if (isJsonPrimitive(a) && isJsonPrimitive(b)) {
      return this.primitiveComparator.diff(a, b, pathTracker);
    } else if (isJsonNull(a) && isJsonNull(b)) {
      return this.nullComparator.diff(a, b, pathTracker);
    } else {
      return this.otherComparator.diff(a, b, pathTracker);
    }
  }

  getArrayComparator(): IArrayComparator {
    return this.arrayComparator;
  }
}
