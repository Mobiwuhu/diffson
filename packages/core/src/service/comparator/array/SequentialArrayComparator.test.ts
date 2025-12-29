import { describe, it, expect } from "bun:test";
import { DiffService } from "../../diff/DiffService";
import { SequentialArrayComparator } from "./SequentialArrayComparator";

function createSequentialDiffService(): DiffService {
  return new DiffService().withArrayComparator(SequentialArrayComparator);
}

describe("SequentialArrayComparator", () => {
  it("should compare arrays by index", () => {
    const left = { items: [1, 2, 3] };
    const right = { items: [1, 4, 3] };

    const diffService = createSequentialDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(1);
    expect(results[0].leftPath).toBe("items.[1]");
    expect(results[0].left).toBe("2");
    expect(results[0].right).toBe("4");
  });

  it("should detect added elements", () => {
    const left = { items: [1, 2] };
    const right = { items: [1, 2, 3] };

    const diffService = createSequentialDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("ADD");
    expect(results[0].rightPath).toBe("items.[2]");
  });

  it("should detect deleted elements", () => {
    const left = { items: [1, 2, 3] };
    const right = { items: [1, 2] };

    const diffService = createSequentialDiffService();
    const results = diffService.compare(left, right);

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("DELETE");
    expect(results[0].leftPath).toBe("items.[2]");
  });
});
