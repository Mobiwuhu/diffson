import { Injector } from "@wendellhu/redi";
import {
  IComparatorOrchestrator,
  IObjectComparator,
  IArrayComparator,
  IPrimitiveComparator,
  INullComparator,
  IOtherComparator,
  type IComparatorOrchestrator as IComparatorOrchestratorType,
} from "../../contract/type";
import { ComparatorOrchestrator } from "../comparator/ComparatorOrchestrator";
import { UnionKeyObjectComparator } from "../comparator/object/UnionKeyObjectComparator";
import { LeftJoinObjectComparator } from "../comparator/object/LeftJoinObjectComparator";
import { SimilarArrayComparator } from "../comparator/array/SimilarArrayComparator";
import { SequentialArrayComparator } from "../comparator/array/SequentialArrayComparator";
import { DefaultPrimitiveComparator } from "../comparator/primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "../comparator/nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "../comparator/other/DefaultOtherComparator";

function createPresetInjector(
  objectComparatorClass: new (...args: any[]) => any,
  arrayComparatorClass: new (...args: any[]) => any
): IComparatorOrchestratorType {
  const injector = new Injector([
    [IComparatorOrchestrator, { useClass: ComparatorOrchestrator, lazy: true }],
    [IObjectComparator, { useClass: objectComparatorClass }],
    [IArrayComparator, { useClass: arrayComparatorClass }],
    [IPrimitiveComparator, { useClass: DefaultPrimitiveComparator }],
    [INullComparator, { useClass: DefaultNullComparator }],
    [IOtherComparator, { useClass: DefaultOtherComparator }],
  ]);
  return injector.get(IComparatorOrchestrator);
}

export const SIMILAR_COMPARE = createPresetInjector(
  UnionKeyObjectComparator,
  SimilarArrayComparator
);

export const SEQUENTIAL_COMPARE = createPresetInjector(
  UnionKeyObjectComparator,
  SequentialArrayComparator
);

export const LEFT_JOIN_SIMILAR_COMPARE = createPresetInjector(
  LeftJoinObjectComparator,
  SimilarArrayComparator
);

export const LEFT_JOIN_SEQUENTIAL_COMPARE = createPresetInjector(
  LeftJoinObjectComparator,
  SequentialArrayComparator
);

export const DEFAULT = createPresetInjector(
  UnionKeyObjectComparator,
  SimilarArrayComparator
);
