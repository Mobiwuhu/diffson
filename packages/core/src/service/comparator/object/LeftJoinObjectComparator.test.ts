import { describe, it, expect } from "bun:test";
import { Diff } from "../../diff/Diff";
import { LeftJoinObjectComparator } from "./LeftJoinObjectComparator";

describe("LeftJoinObjectComparator", () => {
  it("should only compare keys from left object", () => {
    const left = { a: 1, b: 2 };
    const right = { a: 1, b: 2, c: 3 };

    const results = Diff.of(left, right)
      .withObjectComparator(new LeftJoinObjectComparator())
      .compare();

    expect(results).toEqual([]);
  });

  it("should detect changes in left keys", () => {
    const left = { a: 1, b: 2 };
    const right = { a: 2, b: 2, c: 3 };

    const results = Diff.of(left, right)
      .withObjectComparator(new LeftJoinObjectComparator())
      .compare();

    expect(results.length).toBe(1);
    expect(results[0].leftPath).toBe("a");
    expect(results[0].diffType).toBe("MODIFY");
  });

  it("should detect missing keys in right object", () => {
    const left = { a: 1, b: 2 };
    const right = { a: 1 };

    const results = Diff.of(left, right)
      .withObjectComparator(new LeftJoinObjectComparator())
      .compare();

    expect(results.length).toBe(1);
    expect(results[0].leftPath).toBe("b");
    expect(results[0].diffType).toBe("DELETE");
  });
});
