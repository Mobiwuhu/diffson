import { describe, it, expect } from "bun:test";
import { createDiffService } from "../../injector";

describe("DefaultOtherComparator", () => {
  it("should detect type changes from object to array", () => {
    const left = { value: { a: 1 } };
    const right = { value: [1, 2, 3] };

    const diffService = createDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("MODIFY");
  });

  it("should detect type changes from array to primitive", () => {
    const left = { value: [1, 2, 3] };
    const right = { value: 123 };

    const diffService = createDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("MODIFY");
  });

  it("should detect undefined to value", () => {
    const left = {};
    const right = { value: 1 };

    const diffService = createDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("ADD");
  });

  it("should detect value to undefined", () => {
    const left = { value: 1 };
    const right = {};

    const diffService = createDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("DELETE");
  });
});
