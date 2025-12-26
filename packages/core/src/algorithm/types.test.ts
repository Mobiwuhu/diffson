import { describe, expect, test } from "bun:test";
import { Diff } from "../Diff";
import { TYPE_DELETE, TYPE_MODIFY } from "../model/ResultConvertUtil";

describe("jsonElement2Str (AbstractPrimitiveAndOther)", () => {
  test("null vs empty string - different types", () => {
    const str1 = '{"a":null}';
    const str2 = '{"a":""}';

    const diff = new Diff().diff(str1, str2);

    expect(diff[0].left).toBe("null");
    expect(diff[0].right).toBe("");
    expect(diff[0].diffType).toBe(TYPE_MODIFY);
  });

  test("missing key in right object", () => {
    const str1 = '{"a":null}';
    const str3 = "{}";

    const diff = new Diff().diff(str1, str3);

    expect(diff[0].left).toBe("null");
    expect(diff[0].right).toBe(null);
    expect(diff[0].diffType).toBe(TYPE_DELETE);
  });

  test("object value converts to placeholder string", () => {
    const str1 = '{"a":{"nested":1}}';
    const str2 = '{"a":1}';

    const diff = new Diff().diff(str1, str2);

    expect(diff[0].left).toBe("{省略对象内部字段}");
    expect(diff[0].right).toBe("1");
  });

  test("array value converts to placeholder string", () => {
    const str1 = '{"a":[1,2,3]}';
    const str2 = '{"a":1}';

    const diff = new Diff().diff(str1, str2);

    expect(diff[0].left).toBe("[省略数组内部元素]");
    expect(diff[0].right).toBe("1");
  });

  test("boolean values", () => {
    const str1 = '{"a":true}';
    const str2 = '{"a":false}';

    const diff = new Diff().diff(str1, str2);

    expect(diff[0].left).toBe("true");
    expect(diff[0].right).toBe("false");
  });

  test("number values", () => {
    const str1 = '{"a":123}';
    const str2 = '{"a":456}';

    const diff = new Diff().diff(str1, str2);

    expect(diff[0].left).toBe("123");
    expect(diff[0].right).toBe("456");
  });
});
