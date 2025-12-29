import { describe, it, expect } from "bun:test";
import { DiffService } from "./DiffService";

describe("DiffService", () => {
  describe("diffElement", () => {
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

    it("should detect added fields", () => {
      const left = { name: "test" };
      const right = { name: "test", value: 1 };

      const diffService = new DiffService();
      const results = diffService.diffElement(left, right);

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("ADD");
      expect(results[0].rightPath).toBe("value");
    });

    it("should detect deleted fields", () => {
      const left = { name: "test", value: 1 };
      const right = { name: "test" };

      const diffService = new DiffService();
      const results = diffService.diffElement(left, right);

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("DELETE");
      expect(results[0].leftPath).toBe("value");
    });
  });

  describe("diffJson", () => {
    it("should parse JSON strings and diff them", () => {
      const leftJson = '{"name":"test","value":1}';
      const rightJson = '{"name":"test","value":2}';

      const diffService = new DiffService();
      const results = diffService.diffJson(leftJson, rightJson);

      expect(results.length).toBe(1);
      expect(results[0].diffType).toBe("MODIFY");
      expect(results[0].leftPath).toBe("value");
      expect(results[0].left).toBe("1");
      expect(results[0].right).toBe("2");
    });

    it("should return empty array for identical JSON strings", () => {
      const leftJson = '{"name":"test","value":1}';
      const rightJson = '{"name":"test","value":1}';

      const diffService = new DiffService();
      const results = diffService.diffJson(leftJson, rightJson);

      expect(results).toEqual([]);
    });

    it("should throw error for invalid left JSON string", () => {
      const leftJson = '{invalid json}';
      const rightJson = '{"name":"test"}';

      const diffService = new DiffService();

      expect(() => diffService.diffJson(leftJson, rightJson)).toThrow("Failed to parse left JSON string");
    });

    it("should throw error for invalid right JSON string", () => {
      const leftJson = '{"name":"test"}';
      const rightJson = '{invalid json}';

      const diffService = new DiffService();

      expect(() => diffService.diffJson(leftJson, rightJson)).toThrow("Failed to parse right JSON string");
    });
  });

  describe("nested objects", () => {
    it("should handle nested objects", () => {
      const left = { user: { name: "Alice", age: 30 } };
      const right = { user: { name: "Bob", age: 30 } };

      const diffService = new DiffService();
      const results = diffService.diffElement(left, right);

      expect(results.length).toBe(1);
      expect(results[0].leftPath).toBe("user.name");
      expect(results[0].left).toBe("Alice");
      expect(results[0].right).toBe("Bob");
    });
  });
});
