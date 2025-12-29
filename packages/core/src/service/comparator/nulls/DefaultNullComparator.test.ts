import { describe, it, expect } from "bun:test";
import { DiffService } from "../../diff/DiffService";

describe("DefaultNullComparator", () => {
  it("should not report differences for null vs null", () => {
    const left = { value: null };
    const right = { value: null };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results).toEqual([]);
  });

  it("should detect null to value changes", () => {
    const left = { value: null };
    const right = { value: 1 };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("null");
    expect(results[0].right).toBe("1");
  });

  it("should detect value to null changes", () => {
    const left = { value: 1 };
    const right = { value: null };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("1");
    expect(results[0].right).toBe("null");
  });
});
