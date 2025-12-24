import { describe, expect, test } from "bun:test";
import { DefaultPrimitiveComparator } from "./DefaultPrimitiveComparator";
import { PathModule } from "../../model/PathModule";

describe("DefaultPrimitiveComparator", () => {
  test("diff string and number", () => {
    const comparator = new DefaultPrimitiveComparator();
    const diff = comparator.diff("a", 1, new PathModule());
    expect(diff.getDiffResultModels()[0].left).toBe("a");
    expect(diff.getDiffResultModels()[0].right).toBe("1");
  });

  test("diff same strings returns same", () => {
    const comparator = new DefaultPrimitiveComparator();
    const diff = comparator.diff("test", "test", new PathModule());
    expect(diff.isSame()).toBe(true);
    expect(diff.getDiffResultModels().length).toBe(0);
  });

  test("diff different strings", () => {
    const comparator = new DefaultPrimitiveComparator();
    const diff = comparator.diff("hello", "world", new PathModule());
    expect(diff.isSame()).toBe(false);
    expect(diff.getDiffResultModels()[0].left).toBe("hello");
    expect(diff.getDiffResultModels()[0].right).toBe("world");
  });

  test("diff same numbers returns same", () => {
    const comparator = new DefaultPrimitiveComparator();
    const diff = comparator.diff(42, 42, new PathModule());
    expect(diff.isSame()).toBe(true);
  });

  test("diff different numbers", () => {
    const comparator = new DefaultPrimitiveComparator();
    const diff = comparator.diff(1, 2, new PathModule());
    expect(diff.isSame()).toBe(false);
    expect(diff.getDiffResultModels()[0].left).toBe("1");
    expect(diff.getDiffResultModels()[0].right).toBe("2");
  });

  test("diff booleans", () => {
    const comparator = new DefaultPrimitiveComparator();
    const diff = comparator.diff(true, false, new PathModule());
    expect(diff.isSame()).toBe(false);
    expect(diff.getDiffResultModels()[0].left).toBe("true");
    expect(diff.getDiffResultModels()[0].right).toBe("false");
  });
});
