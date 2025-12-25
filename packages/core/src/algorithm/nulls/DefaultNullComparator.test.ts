import { describe, expect, test } from "bun:test";
import { DefaultNullComparator } from "./DefaultNullComparator";
import { PathModule } from "../../model/PathModule";

describe("DefaultNullComparator", () => {
  test("diff null and null returns same", () => {
    const comparator = new DefaultNullComparator();
    const diff = comparator.diff(null, null, new PathModule());
    expect(diff.isSame()).toBe(true);
  });

  test("diff null values through Diff class", () => {
    const { Diff } = require("../../Diff");
    const left = '{"a":null}';
    const right = '{"a":null}';

    const diff = new Diff().diff(left, right);
    expect(diff.length).toBe(0);
  });
});
