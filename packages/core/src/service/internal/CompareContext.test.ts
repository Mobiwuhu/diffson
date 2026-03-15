import { describe, expect, it } from "bun:test";
import { SingleNodeDifference } from "../../contract/type";
import { CompareContext } from "./CompareContext";

describe("CompareContext", () => {
  it("should track paths independently across forks", () => {
    const context = new CompareContext();
    context.setIgnorePaths(["items.name"]);
    context.setIdentityPaths(["items.id"]);
    context.addAllPath("items");
    context.addLeftPath("[0]");
    context.addRightPath("[1]");

    const childContext = context.fork();
    childContext.addAllPath("name");

    expect(context.getLeftPath()).toEqual(["items", "[0]"]);
    expect(context.getRightPath()).toEqual(["items", "[1]"]);
    expect(childContext.getLeftPath()).toEqual(["items", "[0]", "name"]);
    expect(childContext.getRightPath()).toEqual(["items", "[1]", "name"]);
    expect(childContext.getIgnorePaths()).toEqual(["items.name"]);
    expect(childContext.getIdentityPaths()).toEqual(["items.id"]);
  });

  it("should merge diff results without mutating identity matches", () => {
    const context = new CompareContext();
    const childContext = context.fork();
    childContext.setDiffResultModels([
      new SingleNodeDifference("items.[0].name", "items.[1].name", "a", "b"),
    ]);
    childContext.setIdentityMatchPaths(["items.id"]);
    childContext.setSame(false);

    context.merge(childContext);

    expect(context.isSame()).toBe(false);
    expect(context.getDiffResultModels()).toHaveLength(1);
    expect(context.getIdentityMatchPaths()).toBeNull();
  });
});
