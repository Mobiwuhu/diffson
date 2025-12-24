import { describe, expect, test } from "bun:test";
import { Diff } from "../../Diff";
import { AlgorithmEnum } from "../../AlgorithmEnum";

describe("LeftJoinObjectComparator", () => {
  test("diff objects - only compares keys from left object", () => {
    const case1Left = '[{"a":1,"b":2,"c":3}]';
    const case1Right = '[{"a":7,"b":5,"c":6,"d":9}]';
    const noiseList = ["msg", "cost"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.SIMLAR_ARRAY_AND_LEFTJOIN_OBJECT)
      .diff(case1Left, case1Right);

    // LeftJoin only compares a, b, c (keys from left), not d
    expect(diff.length).toBe(3);
  });

  test("diff objects - missing key in right", () => {
    const case2Left = '[{"a":1,"b":2,"c":3}]';
    const case2Right = '[{"a":7,"b":5}]';
    const noiseList = ["msg", "cost"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.SIMLAR_ARRAY_AND_LEFTJOIN_OBJECT)
      .diff(case2Left, case2Right);

    // Compares a, b, c from left - c is missing in right
    expect(diff.length).toBe(3);
  });

  test("diff objects with noise filtering", () => {
    const case1Left = '[{"a":1,"b":2,"c":3}]';
    const case1Right = '[{"a":7,"b":5,"c":6,"d":9}]';
    const noiseList = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.SIMLAR_ARRAY_AND_LEFTJOIN_OBJECT)
      .diff(case1Left, case1Right);

    // Compares b, c (a is filtered out by noise)
    expect(diff.length).toBe(2);
  });

  test("diff with special path", () => {
    const case3Left = '[{"a":7,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const case3Right = '[{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]';
    const noiseList = ["msg", "cost"];
    const specialPath = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withSpecialPath(specialPath)
      .withAlgorithmEnum(AlgorithmEnum.SIMLAR_ARRAY_AND_LEFTJOIN_OBJECT)
      .diff(case3Left, case3Right);

    expect(diff.length).toBe(4);
  });
});
