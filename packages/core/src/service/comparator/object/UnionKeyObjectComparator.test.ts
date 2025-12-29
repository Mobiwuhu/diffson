import { describe, it, expect } from "bun:test";
import { createDiffService } from "../../injector";

describe("UnionKeyObjectComparator", () => {
  it("should compare all keys from both objects", () => {
    const left = { a: 1, b: 2 };
    const right = { b: 2, c: 3 };

    const diffService = createDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(2);

    const deleteResult = results.find((r) => r.diffType === "DELETE");
    const addResult = results.find((r) => r.diffType === "ADD");

    expect(deleteResult?.leftPath).toBe("a");
    expect(addResult?.rightPath).toBe("c");
  });
});
