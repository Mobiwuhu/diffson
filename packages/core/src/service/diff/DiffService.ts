import { Injector } from "@wendellhu/redi";
import {
  type JsonValue,
  Result,
  SingleNodeDifference,
  type IDiffService,
  IComparatorOrchestrator,
  IObjectComparator,
  IArrayComparator,
  IPrimitiveComparator,
  INullComparator,
  IOtherComparator,
  type IComparatorOrchestrator as IComparatorOrchestratorType,
} from "#contract";
import { SPLIT_PATH, OBJECT_NULL, TYPE_MODIFY, TYPE_ADD, TYPE_DELETE } from "#contract";
import { DiffContext } from "./DiffContext";
import { PathTracker } from "./PathTracker";
import { ComparatorOrchestrator } from "../comparator/ComparatorOrchestrator";
import { UnionKeyObjectComparator } from "../comparator/object/UnionKeyObjectComparator";
import { LeftJoinObjectComparator } from "../comparator/object/LeftJoinObjectComparator";
import { SimilarArrayComparator } from "../comparator/array/SimilarArrayComparator";
import { SequentialArrayComparator } from "../comparator/array/SequentialArrayComparator";
import { DefaultPrimitiveComparator } from "../comparator/primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "../comparator/nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "../comparator/other/DefaultOtherComparator";

export type PresetName = "default" | "similar" | "sequential" | "leftJoin" | "leftJoinSequential";

export class DiffService implements IDiffService {
  private config: {
    objectComparator: new (...args: any[]) => any;
    arrayComparator: new (...args: any[]) => any;
    primitiveComparator: new (...args: any[]) => any;
    nullComparator: new (...args: any[]) => any;
    otherComparator: new (...args: any[]) => any;
  } = {
      objectComparator: UnionKeyObjectComparator,
      arrayComparator: SimilarArrayComparator,
      primitiveComparator: DefaultPrimitiveComparator,
      nullComparator: DefaultNullComparator,
      otherComparator: DefaultOtherComparator,
    };

  preset(name: PresetName): this {
    switch (name) {
      case "sequential":
        this.config.arrayComparator = SequentialArrayComparator;
        break;
      case "leftJoin":
        this.config.objectComparator = LeftJoinObjectComparator;
        break;
      case "leftJoinSequential":
        this.config.objectComparator = LeftJoinObjectComparator;
        this.config.arrayComparator = SequentialArrayComparator;
        break;
      case "similar":
      case "default":
      default:
        this.config.objectComparator = UnionKeyObjectComparator;
        this.config.arrayComparator = SimilarArrayComparator;
        break;
    }
    return this;
  }

  withObjectComparator(cls: new (...args: any[]) => any): this {
    this.config.objectComparator = cls;
    return this;
  }

  withArrayComparator(cls: new (...args: any[]) => any): this {
    this.config.arrayComparator = cls;
    return this;
  }

  withPrimitiveComparator(cls: new (...args: any[]) => any): this {
    this.config.primitiveComparator = cls;
    return this;
  }

  withNullComparator(cls: new (...args: any[]) => any): this {
    this.config.nullComparator = cls;
    return this;
  }

  withOtherComparator(cls: new (...args: any[]) => any): this {
    this.config.otherComparator = cls;
    return this;
  }

  compare(left: JsonValue, right: JsonValue): Result[] {
    return this.compareWithOptions(left, right);
  }

  compareWithOptions(
    left: JsonValue,
    right: JsonValue,
    options?: {
      noisePath?: string[];
      specialPath?: string[];
    }
  ): Result[] {
    const orchestrator = this.getOrCreateOrchestrator();
    const diffContext = this.compareInternal(left, right, orchestrator, options);
    return this.constructResult(diffContext);
  }

  private getOrCreateOrchestrator(): IComparatorOrchestratorType {
    const injector = new Injector([
      [IComparatorOrchestrator, { useClass: ComparatorOrchestrator, lazy: true }],
      [IObjectComparator, { useClass: this.config.objectComparator }],
      [IArrayComparator, { useClass: this.config.arrayComparator }],
      [IPrimitiveComparator, { useClass: this.config.primitiveComparator }],
      [INullComparator, { useClass: this.config.nullComparator }],
      [IOtherComparator, { useClass: this.config.otherComparator }],
    ]);
    return injector.get(IComparatorOrchestrator);
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

  private compareInternal(
    left: JsonValue,
    right: JsonValue,
    orchestrator: IComparatorOrchestratorType,
    options?: {
      noisePath?: string[];
      specialPath?: string[];
    }
  ): DiffContext {
    const pathTracker = new PathTracker(null, null);

    if (options?.noisePath) {
      pathTracker.setNoisePahList(this.splitPath(options.noisePath));
    }
    if (options?.specialPath) {
      pathTracker.setSpecialPath(this.splitPath(options.specialPath));
    }

    return orchestrator.diffElement(left, right, pathTracker);
  }

  private splitPath(pathList: string[]): string[] {
    const result: string[] = [];
    for (const path of pathList) {
      const parts = path.split(SPLIT_PATH);
      result.push(parts.join("."));
    }
    return result;
  }
}
