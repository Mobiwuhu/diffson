import { describe, it, expect } from "bun:test";
import { DiffService } from "../../diff/DiffService";

describe("DefaultPrimitiveComparator", () => {
  it("should detect string changes", () => {
    const left = { value: "hello" };
    const right = { value: "world" };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("hello");
    expect(results[0].right).toBe("world");
  });

  it("should detect number changes", () => {
    const left = { value: 1 };
    const right = { value: 2 };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("1");
    expect(results[0].right).toBe("2");
  });

  it("should detect boolean changes", () => {
    const left = { value: true };
    const right = { value: false };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("true");
    expect(results[0].right).toBe("false");
  });

  it("should not report identical primitives", () => {
    const left = { value: "same" };
    const right = { value: "same" };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results).toEqual([]);
  });
});
