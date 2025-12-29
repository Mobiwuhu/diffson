import { describe, it, expect } from "bun:test";
import { createDiffService } from "../injector";

describe("DiffService", () => {
  describe("compare", () => {
    it("should return empty array for identical objects", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test", value: 1 };

      const diffService = createDiffService();
      const results = diffService.compare(left, right);

      expect(results).toEqual([]);
    });

    it("should detect modified values", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test", value: 2 };

      const diffService = createDiffService();
      const results = diffService.compare(left, right);

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("MODIFY");
      expect(results[0].leftPath).toBe("value");
      expect(results[0].left).toBe("1");
      expect(results[0].right).toBe("2");
    });

    it("should detect added fields", () => {
      const left = { name: "test" };
      const right = { name: "test", value: 1 };

      const diffService = createDiffService();
      const results = diffService.compare(left, right);

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("ADD");
      expect(results[0].rightPath).toBe("value");
    });

    it("should detect deleted fields", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test" };

      const diffService = createDiffService();
      const results = diffService.compare(left, right);

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("DELETE");
      expect(results[0].leftPath).toBe("value");
    });
  });

  describe("nested objects", () => {
    it("should handle nested objects", () => {
      const left = { user: { name: "Alice", age: 30 } };
      const right = { user: { name: "Bob", age: 30 } };

      const diffService = createDiffService();
      const results = diffService.compare(left, right);

      expect(results.length).toBe(1);
      expect(results[0].leftPath).toBe("user.name");
      expect(results[0].left).toBe("Alice");
      expect(results[0].right).toBe("Bob");
    });
  });
});
