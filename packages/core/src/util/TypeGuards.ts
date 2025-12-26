import type { JsonValue, JsonObject, JsonArray } from "../contract/type";

export function isJsonObject(value: JsonValue | undefined): value is JsonObject {
  return value !== null && value !== undefined && typeof value === "object" && !Array.isArray(value);
}

export function isJsonArray(value: JsonValue | undefined): value is JsonArray {
  return Array.isArray(value);
}

export function isJsonPrimitive(value: JsonValue | undefined): value is string | number | boolean {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

export function isJsonNull(value: JsonValue | undefined): value is null {
  return value === null;
}

export function jsonElement2Str(element: JsonValue | undefined): string | null {
  if (element === undefined) {
    return null;
  } else if (isJsonObject(element)) {
    return "{省略对象内部字段}";
  } else if (isJsonArray(element)) {
    return "[省略数组内部元素]";
  } else if (isJsonPrimitive(element)) {
    return String(element);
  } else if (isJsonNull(element)) {
    return "null";
  } else {
    throw new Error("异常");
  }
}
