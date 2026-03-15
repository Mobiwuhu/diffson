import { Inject } from "@wendellhu/redi";
import {
  type ICompareContext,
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
    context: ICompareContext
  ): ICompareContext {
    if (isJsonObject(a) && isJsonObject(b)) {
      return this.objectComparator.diff(a, b, context);
    } else if (isJsonArray(a) && isJsonArray(b)) {
      return this.arrayComparator.diffArray(a, b, context);
    } else if (isJsonPrimitive(a) && isJsonPrimitive(b)) {
      return this.primitiveComparator.diff(a, b, context);
    } else if (isJsonNull(a) && isJsonNull(b)) {
      return this.nullComparator.diff(a, b, context);
    } else {
      return this.otherComparator.diff(a, b, context);
    }
  }

  getArrayComparator(): IArrayComparator {
    return this.arrayComparator;
  }
}
