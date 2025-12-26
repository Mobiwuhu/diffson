import type { ObjectComparator } from "./object/ObjectComparator";
import type { ArrayComparator } from "./array/ArrayComparator";
import type { PrimitiveComparator } from "./primitive/PrimitiveComparator";
import type { NullComparator } from "./nulls/NullComparator";
import type { OtherComparator } from "./other/OtherComparator";
import { DiffContext } from "../diff/DiffContext";
import type { PathTracker } from "../diff/PathTracker";
import type { JsonValue } from "../../contract/type";
import {
  isJsonObject,
  isJsonArray,
  isJsonPrimitive,
  isJsonNull,
} from "../../util";

export class ComparatorOrchestrator {
  protected objectComparator: ObjectComparator;
  protected arrayComparator: ArrayComparator;
  protected primitiveComparator: PrimitiveComparator;
  protected nullComparator: NullComparator;
  protected otherComparator: OtherComparator;

  constructor(
    objectComparator: ObjectComparator,
    arrayComparator: ArrayComparator,
    primitiveComparator: PrimitiveComparator,
    nullComparator: NullComparator,
    otherComparator: OtherComparator
  ) {
    this.objectComparator = objectComparator;
    this.arrayComparator = arrayComparator;
    this.primitiveComparator = primitiveComparator;
    this.nullComparator = nullComparator;
    this.otherComparator = otherComparator;
    objectComparator.constructComparatorOrchestrator(this);
    arrayComparator.constructComparatorOrchestrator(this);
  }

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

  getArrayComparator(): ArrayComparator {
    return this.arrayComparator;
  }
}
