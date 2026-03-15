import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

describe("contract/type boundaries", () => {
  it("should not import service internals", () => {
    const files = readdirSync(import.meta.dir).filter(
      file => file.endsWith(".ts") && !file.endsWith(".test.ts")
    );

    for (const file of files) {
      const source = readFileSync(join(import.meta.dir, file), "utf8");
      expect(source).not.toContain('from "../../service/');
      expect(source).not.toContain('from "../service/');
      expect(source).not.toContain('from "#service');
    }
  });
});
