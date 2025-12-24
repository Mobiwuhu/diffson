import type { ObjectComparator } from "./object/ObjectComparator";
import type { ArrayComparator } from "./array/ArrayComparator";
import type { PrimitiveComparator } from "./primitive/PrimitiveComparator";
import type { NullComparator } from "./nulls/NullComparator";
import type { OtherComparator } from "./other/OtherComparator";
import { DiffContext } from "../model/DiffContext";
import type { PathModule } from "../model/PathModule";
import {
  type JsonValue,
  isJsonObject,
  isJsonArray,
  isJsonPrimitive,
  isJsonNull,
} from "./types";

export class AlgorithmModule {
  protected objectAlgorithm: ObjectComparator;
  protected arrayAlgorithm: ArrayComparator;
  protected primitiveComparator: PrimitiveComparator;
  protected nullComparator: NullComparator;
  protected otherComparator: OtherComparator;

  constructor(
    objectAlgorithm: ObjectComparator,
    arrayAlgorithm: ArrayComparator,
    primitiveComparator: PrimitiveComparator,
    nullComparator: NullComparator,
    otherComparator: OtherComparator
  ) {
    this.objectAlgorithm = objectAlgorithm;
    this.arrayAlgorithm = arrayAlgorithm;
    this.primitiveComparator = primitiveComparator;
    this.nullComparator = nullComparator;
    this.otherComparator = otherComparator;
    objectAlgorithm.constructAlgorithmModule(this);
    arrayAlgorithm.constructAlgorithmModule(this);
  }

  diffElement(
    a: JsonValue | undefined,
    b: JsonValue | undefined,
    pathModule: PathModule
  ): DiffContext {
    if (isJsonObject(a) && isJsonObject(b)) {
      return this.objectAlgorithm.diff(a, b, pathModule);
    } else if (isJsonArray(a) && isJsonArray(b)) {
      return this.arrayAlgorithm.diffArray(a, b, pathModule);
    } else if (isJsonPrimitive(a) && isJsonPrimitive(b)) {
      return this.primitiveComparator.diff(a, b, pathModule);
    } else if (isJsonNull(a) && isJsonNull(b)) {
      return this.nullComparator.diff(a, b, pathModule);
    } else {
      return this.otherComparator.diff(a, b, pathModule);
    }
  }

  getArrayAlgorithm(): ArrayComparator {
    return this.arrayAlgorithm;
  }
}
