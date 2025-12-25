import { describe, expect, test } from "bun:test";
import { Diff } from "../../Diff";
import { AlgorithmEnum } from "../../AlgorithmEnum";

describe("AbstractObject", () => {
  test("listJoin filters out array indices from path", () => {
    // Test that array indices like [1] are filtered from path when generating result
    const left = '[{"a":{"b":1}}]';
    const right = '[{"a":{"b":2}}]';

    const diff = new Diff()
      .withAlgorithmEnum(AlgorithmEnum.MOST_COMMONLY_USED)
      .diff(left, right);

    // Path should be "a.b" not "[0].a.b"
    expect(diff[0].leftPath).toBe("[0].a.b");
    expect(diff[0].rightPath).toBe("[0].a.b");
  });

  test("specialPathHandle adds matching special path to result", () => {
    const left = '{"a":{"b":1},"c":2}';
    const right = '{"a":{"b":1},"c":3}';
    const specialPath = ["a.b"];

    const diff = new Diff()
      .withSpecialPath(specialPath)
      .withAlgorithmEnum(AlgorithmEnum.DEFAULT)
      .diff(left, right);

    // Only c is different, a.b is same and marked as special
    expect(diff.length).toBe(1);
    expect(diff[0].leftPath).toBe("c");
  });

  test("needDiff returns false when path is in noise list", () => {
    const left = '{"a":1,"b":2}';
    const right = '{"a":2,"b":3}';
    const noiseList = ["a"];

    const diff = new Diff()
      .withNoisePahList(noiseList)
      .withAlgorithmEnum(AlgorithmEnum.DEFAULT)
      .diff(left, right);

    // Only b is compared, a is filtered
    expect(diff.length).toBe(1);
    expect(diff[0].leftPath).toBe("b");
  });

  test("getSpecialPath returns null when no special path configured", () => {
    const left = '{"a":1}';
    const right = '{"a":2}';

    const diff = new Diff()
      .withAlgorithmEnum(AlgorithmEnum.DEFAULT)
      .diff(left, right);

    expect(diff.length).toBe(1);
  });

  test("getSpecialPath returns null for empty special path list", () => {
    const left = '{"a":1}';
    const right = '{"a":2}';

    const diff = new Diff()
      .withSpecialPath([])
      .withAlgorithmEnum(AlgorithmEnum.DEFAULT)
      .diff(left, right);

    expect(diff.length).toBe(1);
  });
});
