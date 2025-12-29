import { describe, it, expect } from "bun:test";
import { DiffService } from "./DiffService";

describe("DiffService - parseNestedJson", () => {
  it("should parse nested JSON strings when parseNestedJson option is true", () => {
    const leftJson = JSON.stringify({
      user: '{"name": "Alice", "age": 30}',
      settings: '{"theme": "dark", "notifications": true}'
    });

    const rightJson = JSON.stringify({
      user: '{"name": "Bob", "age": 25}',
      settings: '{"theme": "light", "notifications": false}'
    });

    const diffService = new DiffService();
    const results = diffService.diffJson(leftJson, rightJson, {
      parseNestedJson: true
    });

    // 应该能检测到嵌套对象内部的差异
    expect(results.length).toBeGreaterThan(0);

    // 验证路径能正确指向嵌套对象的属性
    const nameDiff = results.find(r => r.leftPath === "user.name");
    expect(nameDiff).toBeDefined();
    expect(nameDiff?.left).toBe("Alice");
    expect(nameDiff?.right).toBe("Bob");

    const themeDiff = results.find(r => r.leftPath === "settings.theme");
    expect(themeDiff).toBeDefined();
    expect(themeDiff?.left).toBe("dark");
    expect(themeDiff?.right).toBe("light");
  });

  it("should not parse nested JSON strings when parseNestedJson option is false or undefined", () => {
    const leftJson = JSON.stringify({
      user: '{"name": "Alice", "age": 30}'
    });

    const rightJson = JSON.stringify({
      user: '{"name": "Bob", "age": 25}'
    });

    const diffService = new DiffService();
    const results = diffService.diffJson(leftJson, rightJson);

    // 不应该解析嵌套 JSON，应该把整个字符串当作一个值
    expect(results.length).toBe(1);
    expect(results[0].leftPath).toBe("user");
    expect(results[0].left).toBe('{"name": "Alice", "age": 30}');
    expect(results[0].right).toBe('{"name": "Bob", "age": 25}');
  });

  it("should handle deeply nested JSON strings", () => {
    const leftJson = JSON.stringify({
      data: '{"level1": {"level2": "value1"}}'
    });

    const rightJson = JSON.stringify({
      data: '{"level1": {"level2": "value2"}}'
    });

    const diffService = new DiffService();
    const results = diffService.diffJson(leftJson, rightJson, {
      parseNestedJson: true
    });

    // 应该能检测到多层嵌套的差异
    const deepDiff = results.find(r => r.leftPath === "data.level1.level2");
    expect(deepDiff).toBeDefined();
    expect(deepDiff?.left).toBe("value1");
    expect(deepDiff?.right).toBe("value2");
  });

  it("should handle arrays containing JSON strings", () => {
    const leftJson = JSON.stringify({
      items: ['{"id": 1, "name": "Item1"}', '{"id": 2, "name": "Item2"}']
    });

    const rightJson = JSON.stringify({
      items: ['{"id": 1, "name": "Item1"}', '{"id": 2, "name": "Item2Modified"}']
    });

    const diffService = new DiffService();
    const results = diffService.diffJson(leftJson, rightJson, {
      parseNestedJson: true
    });

    // 应该能检测到数组元素中嵌套对象的差异
    const itemDiff = results.find(r => r.leftPath === "items.[1].name");
    expect(itemDiff).toBeDefined();
    expect(itemDiff?.left).toBe("Item2");
    expect(itemDiff?.right).toBe("Item2Modified");
  });

  it("should handle mixed content with both JSON strings and regular strings", () => {
    const leftJson = JSON.stringify({
      regularString: "Hello",
      jsonString: '{"key": "value1"}',
      number: 42
    });

    const rightJson = JSON.stringify({
      regularString: "World",
      jsonString: '{"key": "value2"}',
      number: 42
    });

    const diffService = new DiffService();
    const results = diffService.diffJson(leftJson, rightJson, {
      parseNestedJson: true
    });

    expect(results.length).toBe(2);

    const regularDiff = results.find(r => r.leftPath === "regularString");
    expect(regularDiff?.left).toBe("Hello");
    expect(regularDiff?.right).toBe("World");

    const jsonDiff = results.find(r => r.leftPath === "jsonString.key");
    expect(jsonDiff?.left).toBe("value1");
    expect(jsonDiff?.right).toBe("value2");
  });

  it("should not fail on invalid JSON strings", () => {
    const leftJson = JSON.stringify({
      invalid: '{"not valid json'
    });

    const rightJson = JSON.stringify({
      invalid: '{"not valid json'
    });

    const diffService = new DiffService();
    const results = diffService.diffJson(leftJson, rightJson, {
      parseNestedJson: true
    });

    // 无效的 JSON 字符串应该保持原样
    expect(results.length).toBe(0);
  });
});
