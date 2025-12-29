import { describe, it, expect } from "bun:test";
import { DiffService } from "./DiffService";
import { LeftJoinObjectComparator, SequentialArrayComparator } from "#service";
import { PresetName } from "#contract";

describe("DiffService", () => {
  describe("basic comparison", () => {
    it("should return empty array for identical objects", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test", value: 1 };

      const diffService = new DiffService();
      const results = diffService.diffElement(left, right);

      expect(results).toEqual([]);
    });

    it("should detect modified values", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test", value: 2 };

      const diffService = new DiffService();
      const results = diffService.diffElement(left, right);

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("MODIFY");
      expect(results[0].leftPath).toBe("value");
      expect(results[0].left).toBe("1");
      expect(results[0].right).toBe("2");
    });
  });

  describe("withArrayComparator", () => {
    it("should use sequential array comparator when configured", () => {
      const left = { items: [1, 2, 3] };
      const right = { items: [1, 4, 3] };

      const diffService = new DiffService().withArrayComparator(SequentialArrayComparator);
      const results = diffService.diffElement(left, right);
      console.log(results);

      expect(results.length).toBe(1);
      expect(results[0].leftPath).toBe("items.[1]");
      expect(results[0].left).toBe("2");
      expect(results[0].right).toBe("4");
    });

    it("should reuse injector when configuration changes", () => {
      const diffService = new DiffService();

      // First comparison with default comparator
      const left1 = { items: [1, 2] };
      const right1 = { items: [2, 1] };
      const results1 = diffService.diffElement(left1, right1);

      // Should match similar elements (default behavior)
      expect(results1).toEqual([]);

      // Change to sequential comparator
      diffService.withArrayComparator(SequentialArrayComparator);

      // Second comparison with sequential comparator
      const results2 = diffService.diffElement(left1, right1);

      // Should detect differences at each index
      expect(results2.length).toBe(2);
    });
  });

  describe("preset", () => {
    it("should use sequential preset", () => {
      const left = { items: [1, 2, 3] };
      const right = { items: [1, 4, 3] };

      const diffService = new DiffService().preset(PresetName.Sequential);
      const results = diffService.diffElement(left, right);

      expect(results.length).toBe(1);
      expect(results[0].leftPath).toBe("items.[1]");
    });

    it("should use leftJoin preset", () => {
      const left = { a: 1, b: 2 };
      const right = { a: 1, b: 2, c: 3 };

      const diffService = new DiffService().preset(PresetName.LeftJoin);
      const results = diffService.diffElement(left, right);

      // LeftJoin only compares keys from left object
      expect(results).toEqual([]);
    });

    it("should use leftJoinSequential preset", () => {
      const left = { a: 1, items: [1, 2] };
      const right = { a: 1, b: 2, items: [2, 1] };

      const diffService = new DiffService().preset(PresetName.LeftJoinSequential);
      const results = diffService.diffElement(left, right);

      // Should use leftJoin for objects and sequential for arrays
      expect(results.length).toBe(2); // Two array differences
      expect(results[0].leftPath).toBe("items.[0]");
      expect(results[1].leftPath).toBe("items.[1]");
    });
  });

  describe("compareWithOptions", () => {
    it("should ignore noise paths", () => {
      const left = { name: "test", timestamp: 1000 };
      const right = { name: "test", timestamp: 2000 };

      const diffService = new DiffService();
      const results = diffService.diffElementWithOptions(left, right, {
        noisePath: ["timestamp"],
      });

      expect(results).toEqual([]);
    });

    it("should handle special paths", () => {
      const left = { name: "test", special: "value1" };
      const right = { name: "test", special: "value2" };

      const diffService = new DiffService();
      const results = diffService.diffElementWithOptions(left, right, {
        specialPath: ["special"],
      });

      // Special paths are tracked differently
      expect(results.length).toBe(1);
    });
  });

  describe("fluent API", () => {
    it("should support method chaining", () => {
      const diffService = new DiffService()
        .withArrayComparator(SequentialArrayComparator)
        .withObjectComparator(LeftJoinObjectComparator);

      const left = { a: 1, items: [1, 2] };
      const right = { a: 1, b: 2, items: [2, 1] };

      const results = diffService.diffElement(left, right);

      // Should use both custom comparators
      expect(results.length).toBeGreaterThan(0);
    });
  });
});

