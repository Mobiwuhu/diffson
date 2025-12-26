import { describe, it, expect } from "bun:test";
import { Diff } from "../../diff/Diff";

describe("DefaultPrimitiveComparator", () => {
  it("should detect string changes", () => {
    const left = { value: "hello" };
    const right = { value: "world" };

    const results = Diff.of(left, right).compare();

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("hello");
    expect(results[0].right).toBe("world");
  });

  it("should detect number changes", () => {
    const left = { value: 1 };
    const right = { value: 2 };

    const results = Diff.of(left, right).compare();

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("1");
    expect(results[0].right).toBe("2");
  });

  it("should detect boolean changes", () => {
    const left = { value: true };
    const right = { value: false };

    const results = Diff.of(left, right).compare();

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("true");
    expect(results[0].right).toBe("false");
  });

  it("should not report identical primitives", () => {
    const left = { value: "same" };
    const right = { value: "same" };

    const results = Diff.of(left, right).compare();

    expect(results).toEqual([]);
  });
});
