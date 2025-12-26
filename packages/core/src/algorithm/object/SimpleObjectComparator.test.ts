import { describe, expect, test } from "bun:test";
import { Diff } from "../../Diff";
import { AlgorithmEnum } from "../../AlgorithmEnum";

describe("SimpleObjectComparator", () => {
  test("diff objects with added key in right", () => {
    const case1Left = '[{"a":1,"b":2,"c":3}]';
    const case1Right = '[{"a":7,"b":5,"c":6,"d":9}]';
    const noiseList = ["msg", "cost"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case1Left, case1Right);

    expect(diff.length).toBe(4);
  });

  test("diff objects with missing key in right", () => {
    const case2Left = '[{"a":1,"b":2,"c":3}]';
    const case2Right = '[{"a":7,"b":5}]';
    const noiseList = ["msg", "cost"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case2Left, case2Right);

    expect(diff.length).toBe(3);
  });

  test("diff objects with noise filtering", () => {
    const case1Left = '[{"a":1,"b":2,"c":3}]';
    const case1Right = '[{"a":7,"b":5,"c":6,"d":9}]';
    const noiseList = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case1Left, case1Right);

    expect(diff.length).toBe(3);
  });

  test("diff objects with nested objects", () => {
    const case4Left = '[{"a":{"a":1,"b":2,"c":3},"b":5,"c":6}]';
    const case4Right = '[{"a":{"a":1,"b":5,"c":4},"b":2,"c":3}]';
    const noiseList = ["msg", "cost"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withSpecialPath([])
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case4Left, case4Right);

    expect(diff.length).toBe(4);
  });

  test("diff empty array with object array", () => {
    const case5Left = "[]";
    const case5Right = '[{"a":{"a":1,"b":5,"c":4},"b":2,"c":3}]';

    const diff = new Diff()
      .withNoisePahList(null)
      .withSpecialPath([])
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case5Left, case5Right);

    expect(diff.length).toBe(1);
  });

  test("diff arrays with matching elements", () => {
    const case6Left = '[{"a":1,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const case6Right = '[{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]';

    const diff = new Diff()
      .withNoisePahList(null)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case6Left, case6Right);

    expect(diff.length).toBe(3);
  });

  test("diff with special path", () => {
    const case3Left = '[{"a":7,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const case3Right = '[{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]';
    const noiseList = ["msg", "cost"];
    const specialPath = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withSpecialPath(specialPath)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case3Left, case3Right);

    expect(diff.length).toBe(4);
  });
});
