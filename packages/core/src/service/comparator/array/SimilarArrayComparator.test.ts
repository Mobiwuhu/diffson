import { describe, it, expect } from "bun:test";
import { Diff } from "../../diff/Diff";
import { SimilarArrayComparator } from "./SimilarArrayComparator";

describe("SimilarArrayComparator", () => {
  it("should match similar elements", () => {
    const left = { items: [{ id: 1, name: "a" }, { id: 2, name: "b" }] };
    const right = { items: [{ id: 2, name: "b" }, { id: 1, name: "a" }] };

    const results = Diff.of(left, right)
      .withArrayComparator(new SimilarArrayComparator())
      .compare();

    expect(results).toEqual([]);
  });

  it("should detect modifications in matched elements", () => {
    const left = { items: [{ id: 1, name: "a" }] };
    const right = { items: [{ id: 1, name: "b" }] };

    const results = Diff.of(left, right)
      .withArrayComparator(new SimilarArrayComparator())
      .compare();

    expect(results.length).toBe(1);
    expect(results[0].left).toBe("a");
    expect(results[0].right).toBe("b");
  });

  it("should detect added elements", () => {
    const left = { items: [{ id: 1 }] };
    const right = { items: [{ id: 1 }, { id: 2 }] };

    const results = Diff.of(left, right)
      .withArrayComparator(new SimilarArrayComparator())
      .compare();

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("ADD");
  });
});
