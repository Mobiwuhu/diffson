import { Injector } from "@wendellhu/redi";
import {
  IComparatorOrchestrator,
  IObjectComparator,
  IArrayComparator,
  IPrimitiveComparator,
  INullComparator,
  IOtherComparator,
  IDiffService,
} from "../contract/type";
import { ComparatorOrchestrator } from "#service";
import { UnionKeyObjectComparator } from "./comparator/object/UnionKeyObjectComparator";
import { SimilarArrayComparator } from "./comparator/array/SimilarArrayComparator";
import { DefaultPrimitiveComparator } from "./comparator/primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "./comparator/nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "./comparator/other/DefaultOtherComparator";
import { DiffService } from "./diff/DiffService";

export function createDiffInjector(): Injector {
  return new Injector([
    [IComparatorOrchestrator, { useClass: ComparatorOrchestrator, lazy: true }],
    [IObjectComparator, { useClass: UnionKeyObjectComparator }],
    [IArrayComparator, { useClass: SimilarArrayComparator }],
    [IPrimitiveComparator, { useClass: DefaultPrimitiveComparator }],
    [INullComparator, { useClass: DefaultNullComparator }],
    [IOtherComparator, { useClass: DefaultOtherComparator }],
    [IDiffService, { useClass: DiffService }],
  ]);
}

export function createDiffService(): IDiffService {
  return new DiffService();
}

export { Injector };
