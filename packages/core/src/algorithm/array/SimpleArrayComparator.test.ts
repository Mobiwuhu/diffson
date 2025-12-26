import { describe, expect, test } from "bun:test";
import { Diff } from "../../Diff";
import { AlgorithmEnum } from "../../AlgorithmEnum";

describe("SimpleArrayComparator", () => {
  test("diff arrays by index order", () => {
    const left = '[{"a":1},{"a":2},{"a":3}]';
    const right = '[{"a":3},{"a":2},{"a":1}]';

    const diff = new Diff()
      .withAlgorithmEnum(AlgorithmEnum.BY_INDEX)
      .diff(left, right);

    expect(diff.length).toBe(2);
  });

  test("diff arrays with different lengths - left shorter", () => {
    const left = '[{"a":1}]';
    const right = '[{"a":1},{"a":2},{"a":3}]';

    const diff = new Diff()
      .withAlgorithmEnum(AlgorithmEnum.BY_INDEX)
      .diff(left, right);

    expect(diff.length).toBe(2);
  });

  test("diff arrays with different lengths - right shorter", () => {
    const left = '[{"a":1},{"a":2},{"a":3}]';
    const right = '[{"a":1}]';

    const diff = new Diff()
      .withAlgorithmEnum(AlgorithmEnum.BY_INDEX)
      .diff(left, right);

    expect(diff.length).toBe(2);
  });

  test("diff same arrays", () => {
    const left = '[{"a":1},{"a":2}]';
    const right = '[{"a":1},{"a":2}]';

    const diff = new Diff()
      .withAlgorithmEnum(AlgorithmEnum.BY_INDEX)
      .diff(left, right);

    expect(diff.length).toBe(0);
  });
});
