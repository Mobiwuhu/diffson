import { describe, it, expect } from "bun:test";
import { Injector } from "@wendellhu/redi";
import {
  IComparatorOrchestrator,
  IObjectComparator,
  IArrayComparator,
  IPrimitiveComparator,
  INullComparator,
  IOtherComparator,
  IDiffService,
} from "../../../contract/type";
import { ComparatorOrchestrator } from "../ComparatorOrchestrator";
import { LeftJoinObjectComparator } from "./LeftJoinObjectComparator";
import { SimilarArrayComparator } from "../array/SimilarArrayComparator";
import { DefaultPrimitiveComparator } from "../primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "../nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "../other/DefaultOtherComparator";
import { DiffService } from "../../diff/DiffService";

function createLeftJoinDiffService(): IDiffService {
  const injector = new Injector([
    [IComparatorOrchestrator, { useClass: ComparatorOrchestrator, lazy: true }],
    [IObjectComparator, { useClass: LeftJoinObjectComparator }],
    [IArrayComparator, { useClass: SimilarArrayComparator }],
    [IPrimitiveComparator, { useClass: DefaultPrimitiveComparator }],
    [INullComparator, { useClass: DefaultNullComparator }],
    [IOtherComparator, { useClass: DefaultOtherComparator }],
    [IDiffService, { useClass: DiffService }],
  ]);
  return injector.get(IDiffService);
}

describe("LeftJoinObjectComparator", () => {
  it("should only compare keys from left object", () => {
    const left = { a: 1, b: 2 };
    const right = { a: 1, b: 2, c: 3 };

    const diffService = createLeftJoinDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toEqual(1);
    expect(results[0].rightPath).toBe("c");
    expect(results[0].diffType).toBe("ADD");
  });

  it("should detect changes in left keys", () => {
    const left = { a: 1, b: 2 };
    const right = { a: 2, b: 2, c: 3 };

    const diffService = createLeftJoinDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(2);
    expect(results[0].leftPath).toBe("a");
    expect(results[0].diffType).toBe("MODIFY");
    expect(results[1].rightPath).toBe("c");
    expect(results[1].diffType).toBe("ADD");
  });

  it("should detect missing keys in right object", () => {
    const left = { a: 1, b: 2 };
    const right = { a: 1 };

    const diffService = createLeftJoinDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(1);
    expect(results[0].leftPath).toBe("b");
    expect(results[0].diffType).toBe("DELETE");
  });
});
