import isJSON from "is-json";
import { Injector } from "@wendellhu/redi";
import {
  type ICompareContext,
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
  PresetName,
} from "#contract";
import { SPLIT_PATH, OBJECT_NULL, TYPE_MODIFY, TYPE_ADD, TYPE_DELETE } from "#contract";
import { CompareContext } from "../internal/CompareContext";
import { ComparatorOrchestrator } from "../comparator/ComparatorOrchestrator";
import { UnionKeyObjectComparator } from "../comparator/object/UnionKeyObjectComparator";
import { LeftJoinObjectComparator } from "../comparator/object/LeftJoinObjectComparator";
import { SimilarArrayComparator } from "../comparator/array/SimilarArrayComparator";
import { SequentialArrayComparator } from "../comparator/array/SequentialArrayComparator";
import { DefaultPrimitiveComparator } from "../comparator/primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "../comparator/nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "../comparator/other/DefaultOtherComparator";

export class DiffService implements IDiffService {
  private config: {
    objectComparator: new (orchestrator: IComparatorOrchestrator) => IObjectComparator;
    arrayComparator: new (orchestrator: IComparatorOrchestrator) => IArrayComparator;
    primitiveComparator: new () => IPrimitiveComparator;
    nullComparator: new () => INullComparator;
    otherComparator: new () => IOtherComparator;
  };

  constructor(preset: PresetName = PresetName.FullSmart) {
    this.config = {
      objectComparator: UnionKeyObjectComparator,
      arrayComparator: SimilarArrayComparator,
      primitiveComparator: DefaultPrimitiveComparator,
      nullComparator: DefaultNullComparator,
      otherComparator: DefaultOtherComparator,
    };

    switch (preset) {
      case PresetName.FullOrdered:
        this.config.arrayComparator = SequentialArrayComparator;
        break;
      case PresetName.LeftSmart:
        this.config.objectComparator = LeftJoinObjectComparator;
        break;
      case PresetName.LeftOrdered:
        this.config.objectComparator = LeftJoinObjectComparator;
        this.config.arrayComparator = SequentialArrayComparator;
        break;
      case PresetName.FullSmart:
      default:
        this.config.objectComparator = UnionKeyObjectComparator;
        this.config.arrayComparator = SimilarArrayComparator;
        break;
    }
  }

  withObjectComparator(cls: new (orchestrator: IComparatorOrchestrator) => IObjectComparator): this {
    this.config.objectComparator = cls;
    return this;
  }

  withArrayComparator(cls: new (orchestrator: IComparatorOrchestrator) => IArrayComparator): this {
    this.config.arrayComparator = cls;
    return this;
  }

  withPrimitiveComparator(cls: new () => IPrimitiveComparator): this {
    this.config.primitiveComparator = cls;
    return this;
  }

  withNullComparator(cls: new () => INullComparator): this {
    this.config.nullComparator = cls;
    return this;
  }

  withOtherComparator(cls: new () => IOtherComparator): this {
    this.config.otherComparator = cls;
    return this;
  }

  diffJson(leftJson: string, rightJson: string, options?: {
    noisePath?: string[];
    specialPath?: string[];
    parseNestedJson?: boolean;
  }): Result[] {
    let left: JsonValue;
    let right: JsonValue;

    try {
      left = JSON.parse(leftJson);
    } catch (error) {
      throw new Error(`Failed to parse left JSON string: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      right = JSON.parse(rightJson);
    } catch (error) {
      throw new Error(`Failed to parse right JSON string: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 将解析后的对象和选项传递给 diffElement
    return this.diffElement(left, right, options);
  }

  diffElement(
    left: JsonValue,
    right: JsonValue,
    options?: {
      noisePath?: string[];
      specialPath?: string[];
      parseNestedJson?: boolean;
    }
  ): Result[] {
    // 如果启用递归解析嵌套 JSON
    if (options?.parseNestedJson) {
      left = this.parseNestedJsonStrings(left);
      right = this.parseNestedJsonStrings(right);
    }

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

  private constructResult(compareContext: ICompareContext): Result[] {
    const list: Result[] = [];

    for (const resultModel of compareContext.getDiffResultModels()) {
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
  ): ICompareContext {
    const compareContext = new CompareContext();

    if (options?.noisePath) {
      compareContext.setNoisePathList(this.splitPath(options.noisePath));
    }
    if (options?.specialPath) {
      compareContext.setSpecialPath(this.splitPath(options.specialPath));
    }

    return orchestrator.diffElement(left, right, compareContext);
  }

  private splitPath(pathList: string[]): string[] {
    const result: string[] = [];
    for (const path of pathList) {
      const parts = path.split(SPLIT_PATH);
      result.push(parts.join("."));
    }
    return result;
  }

  private parseNestedJsonStrings(value: JsonValue): JsonValue {
    // 如果是字符串，尝试解析为 JSON
    if (typeof value === "string") {
      if (isJSON(value)) {
        try {
          const parsed = JSON.parse(value);
          // 递归处理解析后的值
          return this.parseNestedJsonStrings(parsed);
        } catch {
          // 如果解析失败，返回原字符串
          return value;
        }
      }
      return value;
    }

    // 如果是数组，递归处理每个元素
    if (Array.isArray(value)) {
      return value.map(item => this.parseNestedJsonStrings(item));
    }

    // 如果是对象，递归处理每个属性值
    if (typeof value === "object" && value !== null) {
      const result: Record<string, JsonValue> = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          result[key] = this.parseNestedJsonStrings(value[key]);
        }
      }
      return result;
    }

    // 其他类型（number, boolean, null）直接返回
    return value;
  }
}
