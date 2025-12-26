import { describe, expect, test } from "bun:test";
import { Diff } from "../../Diff";
import { AlgorithmEnum } from "../../AlgorithmEnum";

describe("SimilarArrayComparator", () => {
  test("diff arrays with similarity matching - case 1", () => {
    const case1Left = '[{"a":7,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const case1Right = '[{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]';
    const noiseList = ["msg", "cost"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case1Left, case1Right);

    const leftResult = diff.map((r) => r.left ?? "null").join(" ") + " ";
    const rightResult = diff.map((r) => r.right ?? "null").join(" ") + " ";

    expect(diff.length).toBe(3);
    expect(leftResult).toBe("7 6 null ");
    expect(rightResult).toBe("4 1 {省略内部字段} ");
  });

  test("diff arrays with similarity matching - case 2 (reversed)", () => {
    const case2Left = '[{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]';
    const case2Right = '[{"a":7,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const noiseList = ["msg", "cost"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case2Left, case2Right);

    const leftResult = diff.map((r) => r.left ?? "null").join(" ") + " ";
    const rightResult = diff.map((r) => r.right ?? "null").join(" ") + " ";

    expect(diff.length).toBe(3);
    expect(leftResult).toBe("4 1 {省略内部字段} ");
    expect(rightResult).toBe("7 6 null ");
  });

  test("diff with noise path filtering", () => {
    const case1Left = '[{"a":7,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const case1Right = '[{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]';
    const noiseList = ["a"];
    const specialPath = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withSpecialPath(specialPath)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case1Left, case1Right);

    expect(diff.length).toBe(1);
  });

  test("diff with special path", () => {
    const case1Left = '[{"a":7,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const case1Right = '[{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]';
    const noiseList = ["msg", "cost"];
    const specialPath = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withSpecialPath(specialPath)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case1Left, case1Right);

    expect(diff.length).toBe(4);
  });

  test("diff empty array with non-empty array", () => {
    const case3Left = "[]";
    const case3Right = '[{"a":7,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const noiseList = ["a"];
    const specialPath = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withSpecialPath(specialPath)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case3Left, case3Right);

    expect(diff.length).toBe(2);
  });

  test("diff non-empty array with empty array", () => {
    const case4Left = '[{"a":7,"b":5,"c":6},{"a":6,"b":2,"c":3}]';
    const case4Right = "[]";
    const noiseList = ["a"];
    const specialPath = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withSpecialPath(specialPath)
      .withAlgorithmEnum(AlgorithmEnum.BY_SIMILARITY)
      .diff(case4Left, case4Right);

    expect(diff.length).toBe(2);
  });
});
