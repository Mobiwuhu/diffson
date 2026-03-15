import { describe, expect, it } from "bun:test";
import { parseArgs } from "./parseArgs";

describe("parseArgs", () => {
  it("should parse renamed path rule flags", () => {
    const parsed = parseArgs([
      "--ignore-path",
      "items.name, metadata.timestamp",
      "--array-identity-path",
      "items.id, users.email",
    ]);

    expect(parsed.ignorePaths).toEqual(["items.name", "metadata.timestamp"]);
    expect(parsed.arrayIdentityPaths).toEqual(["items.id", "users.email"]);
  });
});
