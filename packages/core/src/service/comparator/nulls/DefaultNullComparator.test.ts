import { describe, it, expect } from "bun:test";
import { Diff } from "../../diff/Diff";

describe("DefaultNullComparator", () => {
  it("should not report differences for null vs null", () => {
    const left = { value: null };
    const right = { value: null };

    const results = Diff.of(left, right).compare();

    expect(results).toEqual([]);
  });

  it("should detect null to value changes", () => {
    const left = { value: null };
    const right = { value: 1 };

    const results = Diff.of(left, right).compare();

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("null");
    expect(results[0].right).toBe("1");
  });

  it("should detect value to null changes", () => {
    const left = { value: 1 };
    const right = { value: null };

    const results = Diff.of(left, right).compare();

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("1");
    expect(results[0].right).toBe("null");
  });
});
