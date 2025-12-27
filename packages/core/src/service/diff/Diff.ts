import { type JsonObject, type JsonValue, Result, SingleNodeDifference } from "../../contract/type";
import { SPLIT_PATH, OBJECT_NULL, TYPE_MODIFY, TYPE_ADD, TYPE_DELETE } from "../../contract/constant";
import { isJsonObject } from "../../util";
import type { ObjectComparator } from "#service/comparator/object/ObjectComparator";
import type { ArrayComparator } from "../comparator/array/ArrayComparator";
import type { PrimitiveComparator } from "../comparator/primitive/PrimitiveComparator";
import type { NullComparator } from "../comparator/nulls/NullComparator";
import type { OtherComparator } from "../comparator/other/OtherComparator";
import { ComparatorOrchestrator } from "../comparator/ComparatorOrchestrator";
import { UnionKeyObjectComparator } from "../comparator/object/UnionKeyObjectComparator";
import { SimilarArrayComparator } from "../comparator/array/SimilarArrayComparator";
import { DefaultPrimitiveComparator } from "../comparator/primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "../comparator/nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "../comparator/other/DefaultOtherComparator";
import { DiffContext } from "./DiffContext";
import { PathTracker } from "./PathTracker";

export class Diff {
  private left: JsonValue;
  private right: JsonValue;
  private noisePath: string[] | null = null;
  private specialPath: string[] | null = null;
  private objectComparator: ObjectComparator | null = null;
  private arrayComparator: ArrayComparator | null = null;
  private primitiveComparator: PrimitiveComparator | null = null;
  private nullComparator: NullComparator | null = null;
  private otherComparator: OtherComparator | null = null;

  private constructor(left: JsonValue, right: JsonValue) {
    this.left = left;
    this.right = right;
  }

  static of(left: JsonValue, right: JsonValue): Diff {
    return new Diff(left, right);
  }

  withNoisePath(noisePath: string[]): Diff {
    this.noisePath = noisePath;
    return this;
  }

  withSpecialPath(specialPath: string[]): Diff {
    this.specialPath = specialPath;
    return this;
  }

  withObjectComparator(comparator: ObjectComparator): Diff {
    this.objectComparator = comparator;
    return this;
  }

  withArrayComparator(comparator: ArrayComparator): Diff {
    this.arrayComparator = comparator;
    return this;
  }

  withPrimitiveComparator(comparator: PrimitiveComparator): Diff {
    this.primitiveComparator = comparator;
    return this;
  }

  withNullComparator(comparator: NullComparator): Diff {
    this.nullComparator = comparator;
    return this;
  }

  withOtherComparator(comparator: OtherComparator): Diff {
    this.otherComparator = comparator;
    return this;
  }

  compare(): Result[] {
    const diffContext = this.compareInternal();
    return this.constructResult(diffContext);
  }

  private constructResult(diffContext: DiffContext): Result[] {
    const list: Result[] = [];

    for (const resultModel of diffContext.getDiffResultModels()) {
      const printModel = this.convert(resultModel);
      const leftAndRightBothNull =
        resultModel.left === OBJECT_NULL && resultModel.right === OBJECT_NULL;

      if (leftAndRightBothNull) {
        printModel.diffType = TYPE_MODIFY;
      } else if (resultModel.left === OBJECT_NULL) {
        printModel.diffType = TYPE_ADD;
        printModel.leftPath = null;
      } else if (resultModel.right === OBJECT_NULL) {
        printModel.diffType = TYPE_DELETE;
        printModel.rightPath = null;
      } else {
        printModel.diffType = TYPE_MODIFY;
      }
      list.push(printModel);
    }
    return list;
  }

  private convert(resultModel: SingleNodeDifference): Result {
    const printModel = new Result();
    printModel.left = resultModel.left;
    printModel.right = resultModel.right;
    printModel.leftPath = resultModel.leftPath;
    printModel.rightPath = resultModel.rightPath;
    return printModel;
  }

  private compareInternal(): DiffContext {
    const orchestrator = new ComparatorOrchestrator(
      this.objectComparator ?? this.getDefaultObjectComparator(),
      this.arrayComparator ?? new SimilarArrayComparator(),
      this.primitiveComparator ?? new DefaultPrimitiveComparator(),
      this.nullComparator ?? new DefaultNullComparator(),
      this.otherComparator ?? new DefaultOtherComparator()
    );

    const pathTracker = new PathTracker(this.noisePath, this.specialPath);

    if (isJsonObject(this.left) && isJsonObject(this.right)) {
      return this.diffObject(this.left, this.right, pathTracker, orchestrator);
    } else {
      return orchestrator.diffElement(this.left, this.right, pathTracker);
    }
  }

  private diffObject(
    leftObj: JsonObject,
    rightObj: JsonObject,
    pathTracker: PathTracker,
    orchestrator: ComparatorOrchestrator
  ): DiffContext {
    if (this.noisePath) {
      pathTracker.setNoisePahList(this.splitPath(this.noisePath));
    }
    if (this.specialPath) {
      pathTracker.setSpecialPath(this.splitPath(this.specialPath));
    }

    return orchestrator.diffElement(leftObj, rightObj, pathTracker);
  }

  private splitPath(pathList: string[]): string[] {
    const result: string[] = [];
    for (const path of pathList) {
      const parts = path.split(SPLIT_PATH);
      result.push(parts.join("."));
    }
    return result;
  }

  private getDefaultObjectComparator(): ObjectComparator {
    return new UnionKeyObjectComparator();
  }
}
