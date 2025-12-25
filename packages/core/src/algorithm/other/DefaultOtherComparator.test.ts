import { describe, expect, test } from "bun:test";
import { DefaultOtherComparator } from "./DefaultOtherComparator";
import { PathModule } from "../../model/PathModule";

describe("DefaultOtherComparator", () => {
  test("diff string and null", () => {
    const comparator = new DefaultOtherComparator();
    const diff = comparator.diff("a", null, new PathModule());
    expect(diff.getDiffResultModels()[0].left).toBe("a");
    expect(diff.getDiffResultModels()[0].right).toBe("null");
  });

  test("diff null and string", () => {
    const comparator = new DefaultOtherComparator();
    const diff = comparator.diff(null, "b", new PathModule());
    expect(diff.getDiffResultModels()[0].left).toBe("null");
    expect(diff.getDiffResultModels()[0].right).toBe("b");
  });

  test("diff object and array", () => {
    const comparator = new DefaultOtherComparator();
    const diff = comparator.diff({ a: 1 }, [1, 2, 3], new PathModule());
    expect(diff.getDiffResultModels()[0].left).toBe("{省略内部字段}");
    expect(diff.getDiffResultModels()[0].right).toBe("[省略内部元素]");
  });

  test("diff undefined and value", () => {
    const comparator = new DefaultOtherComparator();
    const diff = comparator.diff(undefined, "value", new PathModule());
    expect(diff.getDiffResultModels()[0].left).toBe(null);
    expect(diff.getDiffResultModels()[0].right).toBe("value");
  });

  test("diff always returns different", () => {
    const comparator = new DefaultOtherComparator();
    const diff = comparator.diff("a", null, new PathModule());
    expect(diff.isSame()).toBe(false);
  });
});
