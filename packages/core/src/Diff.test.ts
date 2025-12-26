import { describe, expect, test } from "bun:test";
import { Diff } from "./Diff";
import { AlgorithmEnum } from "./AlgorithmEnum";
import { TYPE_MODIFY } from "./model/ResultConvertUtil";
import { UnionKeyObjectComparator } from "./algorithm/object/UnionKeyObjectComparator";
import { SimilarArrayComparator } from "./algorithm/array/SimilarArrayComparator";
import { DefaultPrimitiveComparator } from "./algorithm/primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "./algorithm/nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "./algorithm/other/DefaultOtherComparator";

describe("Diff", () => {
  test("diff basic comparison", () => {
    const str1 = '{"a":null}';
    const str2 = '{"a":""}';
    const diff = new Diff().diff(str1, str2);
    expect(diff[0].diffType).toBe(TYPE_MODIFY);
  });

  test("diff with noise path list", () => {
    const str1 = '{"a":null}';
    const str2 = '{"a":""}';
    const noiseList = ["a"];
    const diff = new Diff().withNoisePahList(noiseList).diff(str1, str2);
    expect(diff.length).toBe(0);
  });

  test("diff with null algorithm enum", () => {
    const str1 = '{"a":null}';
    const str2 = '{"a":""}';
    const noiseList = ["a"];
    const diff = new Diff().withNoisePahList(noiseList).withAlgorithmEnum(null).diff(str1, str2);
    expect(diff.length).toBe(0);
  });

  test("diff with special path and algorithm enum", () => {
    const str1 = '{"a":null}';
    const str2 = '{"a":""}';
    const a = JSON.parse(str1);
    const b = JSON.parse(str2);
    const specialPath: string[] = [];
    const diff = new Diff()
      .withNoisePahList(null)
      .withSpecialPath(specialPath)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY_LEFT_FIELDS_ONLY)
      .diffElement(a, b);
    console.log(diff);
    expect(diff[0].diffType).toBe(TYPE_MODIFY);
  });

  test("diff with custom comparators - same values", () => {
    const str1 = '{"a":null}';
    const str2 = '{"a":null}';
    const a = JSON.parse(str1);
    const b = JSON.parse(str2);
    const specialPath: string[] = [];
    const diff = new Diff()
      .withNoisePahList(null)
      .withSpecialPath(specialPath)
      .withObjectComparator(new UnionKeyObjectComparator())
      .withArrayComparator(new SimilarArrayComparator())
      .withPrimitiveAlgorithm(new DefaultPrimitiveComparator())
      .withNullComparator(new DefaultNullComparator())
      .withOtheComparator(new DefaultOtherComparator())
      .diffElement(a, b);
    expect(diff.length).toBe(0);
  });

  test("diff with custom comparators - different types", () => {
    const str1 = '{"a":null}';
    const str2 = '{"a":[1,2,3]}';
    const a = JSON.parse(str1);
    const b = JSON.parse(str2);
    const specialPath: string[] = [];
    const diff = new Diff()
      .withNoisePahList(null)
      .withSpecialPath(specialPath)
      .withObjectComparator(new UnionKeyObjectComparator())
      .withArrayComparator(new SimilarArrayComparator())
      .withPrimitiveAlgorithm(new DefaultPrimitiveComparator())
      .withNullComparator(new DefaultNullComparator())
      .withOtheComparator(new DefaultOtherComparator())
      .diffElement(a, b);
    expect(diff[0].diffType).toBe(TYPE_MODIFY);
  });

  test("diff with partial custom comparators", () => {
    const str1 = '{"a":null}';
    const str2 = '{"a":[1,2,3]}';
    const a = JSON.parse(str1);
    const b = JSON.parse(str2);
    const specialPath: string[] = [];
    const diff1 = new Diff()
      .withNoisePahList(null)
      .withSpecialPath(specialPath)
      .withObjectComparator(new UnionKeyObjectComparator())
      .diffElement(a, b);
    const diff2 = new Diff()
      .withNoisePahList(null)
      .withSpecialPath(specialPath)
      .withArrayComparator(new SimilarArrayComparator())
      .diffElement(a, b);
    expect(diff1[0].diffType).toBe(TYPE_MODIFY);
    expect(diff2[0].diffType).toBe(TYPE_MODIFY);
  });
});
