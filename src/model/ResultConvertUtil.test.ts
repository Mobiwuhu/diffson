import { describe, expect, test } from "bun:test";
import { DiffContext } from "./DiffContext";
import { SingleNodeDifference } from "./SingleNodeDifference";
import { constructResult, TYPE_ADD, TYPE_DELETE, TYPE_MODIFY } from "./ResultConvertUtil";

describe("ResultConvertUtil", () => {
  test("constructResult with MODIFY type", () => {
    const diffContext = new DiffContext(false);
    diffContext.setDiffResultModels([
      new SingleNodeDifference("a.b", "a.b", "value1", "value2"),
    ]);

    const result = constructResult(diffContext);

    expect(result.length).toBe(1);
    expect(result[0].diffType).toBe(TYPE_MODIFY);
    expect(result[0].leftPath).toBe("a.b");
    expect(result[0].rightPath).toBe("a.b");
  });

  test("constructResult with ADD type (left is null)", () => {
    const diffContext = new DiffContext(false);
    diffContext.setDiffResultModels([
      new SingleNodeDifference("a.b", "a.b", null, "value2"),
    ]);

    const result = constructResult(diffContext);

    expect(result.length).toBe(1);
    expect(result[0].diffType).toBe(TYPE_ADD);
    expect(result[0].leftPath).toBe(null);
  });

  test("constructResult with DELETE type (right is null)", () => {
    const diffContext = new DiffContext(false);
    diffContext.setDiffResultModels([
      new SingleNodeDifference("a.b", "a.b", "value1", null),
    ]);

    const result = constructResult(diffContext);

    expect(result.length).toBe(1);
    expect(result[0].diffType).toBe(TYPE_DELETE);
    expect(result[0].rightPath).toBe(null);
  });

  test("constructResult with both null values", () => {
    const diffContext = new DiffContext(false);
    diffContext.setDiffResultModels([
      new SingleNodeDifference("a.b", "a.b", null, null),
    ]);

    const result = constructResult(diffContext);

    expect(result.length).toBe(1);
    expect(result[0].diffType).toBe(TYPE_MODIFY);
  });
});
