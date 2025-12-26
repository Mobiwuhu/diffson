import { describe, it, expect } from "bun:test";
import { Diff } from "./Diff";
import { UnionKeyObjectComparator } from "../comparator/object/UnionKeyObjectComparator";

describe("Diff", () => {
  describe("compare", () => {
    it("should return empty array for identical objects", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test", value: 1 };

      const results = Diff.of(left, right).compare();

      expect(results).toEqual([]);
    });

    it("should detect modified values", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test", value: 2 };

      const results = Diff.of(left, right).compare();

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("MODIFY");
      expect(results[0].leftPath).toBe("value");
      expect(results[0].left).toBe("1");
      expect(results[0].right).toBe("2");
    });

    it("should detect added fields", () => {
      const left = { name: "test" };
      const right = { name: "test", value: 1 };

      const results = Diff.of(left, right).compare();

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("ADD");
      expect(results[0].rightPath).toBe("value");
    });

    it("should detect deleted fields", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test" };

      const results = Diff.of(left, right).compare();

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("DELETE");
      expect(results[0].leftPath).toBe("value");
    });
  });

  describe("withNoisePath", () => {
    it("should ignore specified paths", () => {
      const left = { name: "test", timestamp: 1000 };
      const right = { name: "test", timestamp: 2000 };

      const results = Diff.of(left, right)
        .withNoisePath(["timestamp"])
        .compare();

      expect(results).toEqual([]);
    });
  });

  describe("withObjectComparator", () => {
    it("should use custom object comparator", () => {
      const left = { a: 1, b: 2 };
      const right = { a: 1, b: 3 };

      const results = Diff.of(left, right)
        .withObjectComparator(new UnionKeyObjectComparator())
        .compare();

      expect(results.length).toBe(1);
      expect(results[0].leftPath).toBe("b");
    });
  });

  describe("nested objects", () => {
    it("should handle nested objects", () => {
      const left = { user: { name: "Alice", age: 30 } };
      const right = { user: { name: "Bob", age: 30 } };

      const results = Diff.of(left, right).compare();

      expect(results.length).toBe(1);
      expect(results[0].leftPath).toBe("user.name");
      expect(results[0].left).toBe("Alice");
      expect(results[0].right).toBe("Bob");
    });
  });
});
