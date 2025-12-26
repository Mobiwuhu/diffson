import { describe, it, expect } from "bun:test";
import {
  isJsonObject,
  isJsonArray,
  isJsonPrimitive,
  isJsonNull,
  jsonElement2Str,
} from "./TypeGuards";

describe("TypeGuards", () => {
  describe("isJsonObject", () => {
    it("should return true for objects", () => {
      expect(isJsonObject({ a: 1 })).toBe(true);
      expect(isJsonObject({})).toBe(true);
    });

    it("should return false for non-objects", () => {
      expect(isJsonObject(null)).toBe(false);
      expect(isJsonObject(undefined)).toBe(false);
      expect(isJsonObject([1, 2])).toBe(false);
      expect(isJsonObject("string")).toBe(false);
      expect(isJsonObject(123)).toBe(false);
    });
  });

  describe("isJsonArray", () => {
    it("should return true for arrays", () => {
      expect(isJsonArray([1, 2, 3])).toBe(true);
      expect(isJsonArray([])).toBe(true);
    });

    it("should return false for non-arrays", () => {
      expect(isJsonArray({ a: 1 })).toBe(false);
      expect(isJsonArray(null)).toBe(false);
      expect(isJsonArray("string")).toBe(false);
    });
  });

  describe("isJsonPrimitive", () => {
    it("should return true for primitives", () => {
      expect(isJsonPrimitive("string")).toBe(true);
      expect(isJsonPrimitive(123)).toBe(true);
      expect(isJsonPrimitive(true)).toBe(true);
      expect(isJsonPrimitive(false)).toBe(true);
    });

    it("should return false for non-primitives", () => {
      expect(isJsonPrimitive(null)).toBe(false);
      expect(isJsonPrimitive(undefined)).toBe(false);
      expect(isJsonPrimitive({ a: 1 })).toBe(false);
      expect(isJsonPrimitive([1, 2])).toBe(false);
    });
  });

  describe("isJsonNull", () => {
    it("should return true for null", () => {
      expect(isJsonNull(null)).toBe(true);
    });

    it("should return false for non-null", () => {
      expect(isJsonNull(undefined)).toBe(false);
      expect(isJsonNull(0)).toBe(false);
      expect(isJsonNull("")).toBe(false);
    });
  });

  describe("jsonElement2Str", () => {
    it("should convert primitives to strings", () => {
      expect(jsonElement2Str("hello")).toBe("hello");
      expect(jsonElement2Str(123)).toBe("123");
      expect(jsonElement2Str(true)).toBe("true");
    });

    it("should return null for undefined", () => {
      expect(jsonElement2Str(undefined)).toBe(null);
    });

    it("should return 'null' for null", () => {
      expect(jsonElement2Str(null)).toBe("null");
    });

    it("should return placeholder for objects", () => {
      expect(jsonElement2Str({ a: 1 })).toBe("{省略对象内部字段}");
    });

    it("should return placeholder for arrays", () => {
      expect(jsonElement2Str([1, 2, 3])).toBe("[省略数组内部元素]");
    });
  });
});
