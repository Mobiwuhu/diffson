import { describe, it, expect } from "bun:test";
import { Diff } from "../../diff/Diff";
import { SequentialArrayComparator } from "./SequentialArrayComparator";

describe("SequentialArrayComparator", () => {
  it("should compare arrays by index", () => {
    const left = { items: [1, 2, 3] };
    const right = { items: [1, 4, 3] };

    const results = Diff.of(left, right)
      .withArrayComparator(new SequentialArrayComparator())
      .compare();

    expect(results.length).toBe(1);
    expect(results[0].leftPath).toBe("items.[1]");
    expect(results[0].left).toBe("2");
    expect(results[0].right).toBe("4");
  });

  it("should detect added elements", () => {
    const left = { items: [1, 2] };
    const right = { items: [1, 2, 3] };

    const results = Diff.of(left, right)
      .withArrayComparator(new SequentialArrayComparator())
      .compare();

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("ADD");
    expect(results[0].rightPath).toBe("items.[2]");
  });

  it("should detect deleted elements", () => {
    const left = { items: [1, 2, 3] };
    const right = { items: [1, 2] };

    const results = Diff.of(left, right)
      .withArrayComparator(new SequentialArrayComparator())
      .compare();

    expect(results.length).toBe(1);
    expect(results[0].diffType).toBe("DELETE");
    expect(results[0].leftPath).toBe("items.[2]");
  });
});
