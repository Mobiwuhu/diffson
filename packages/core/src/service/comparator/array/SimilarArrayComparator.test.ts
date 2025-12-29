import { describe, it, expect } from "bun:test";
import { DiffService } from "../../diff/DiffService";

describe("SimilarArrayComparator", () => {
  it("should match similar elements", () => {
    const left = { items: [{ id: 1, name: "a" }, { id: 2, name: "b" }] };
    const right = { items: [{ id: 2, name: "b" }, { id: 1, name: "a" }] };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results).toEqual([]);
  });

  it("should detect modifications in matched elements", () => {
    const left = { items: [{ id: 1, name: "a" }] };
    const right = { items: [{ id: 1, name: "b" }] };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("a");
    expect(results[0].right).toBe("b");
  });

  it("should detect added elements", () => {
    const left = { items: [{ id: 1 }] };
    const right = { items: [{ id: 1 }, { id: 2 }] };

    const diffService = new DiffService();
    const results = diffService.diffElement(left, right);

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("ADD");
  });
});
