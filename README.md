# Diffson - JSON 差异对比工具

[![CI](https://github.com/Mobiwuhu/diffson/actions/workflows/ci.yml/badge.svg)](https://github.com/Mobiwuhu/diffson/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

一个强大的 JSON 对比工具，支持多种比较策略。基于 **Bun** 运行时和 **TypeScript** 开发。

## 目录

- [特性](#特性)
- [项目结构](#项目结构)
- [安装](#安装)
- [Core 库使用](#core-库使用)
- [CLI 工具使用](#cli-工具使用)
- [路径格式](#路径格式)
- [开发指南](#开发指南)
- [许可证](#许可证)

## 特性

- 🚀 **多种比较策略** - 支持智能比较、顺序敏感比较、左侧优先比较（详见下表）

### 比较策略说明

假设对比以下两个 JSON：
```
左侧: { "name": "test", "items": [{id:1}, {id:2}] }
右侧: { "name": "test", "items": [{id:2}, {id:1}], "extra": true }
```

| 预设名称 | 对象字段范围 | 数组比较方式 | 结果 |
|----------|-------------|-------------|------|
| `FullSmart` | 比较两侧所有字段 | 按内容相似度匹配，忽略顺序 | 检测到新增 `extra`，数组无差异（id:1 匹配 id:1） |
| `FullOrdered` | 比较两侧所有字段 | 按索引顺序逐个比较 | 检测到新增 `extra`，数组索引 0,1 均有差异 |
| `LeftSmart` | 仅比较左侧存在的字段 | 按内容相似度匹配，忽略顺序 | 无差异（忽略 `extra`，数组智能匹配） |
| `LeftOrdered` | 仅比较左侧存在的字段 | 按索引顺序逐个比较 | 数组索引 0,1 有差异（忽略 `extra`） |

> **Smart 模式原理**：构建相似度矩阵，计算左右数组每对元素的差异数量，优先匹配差异最小的元素对。

- 🔍 **深度嵌套支持** - 递归比较嵌套对象和数组
- 🎯 **路径过滤** - 支持忽略指定路径（噪声路径）
- 📦 **嵌套 JSON 解析** - 自动解析字符串中的 JSON
- 💻 **CLI 工具** - 命令行工具，支持交互模式
- 📝 **多种输出格式** - 支持文本和 JSON 格式输出

## 项目结构

```
json-diff-ts/
├── packages/
│   └── core/          # 核心库 @diffson/core
├── apps/
│   └── cli/           # 命令行工具 @diffson/cli
├── package.json       # Monorepo 配置
└── turbo.json         # Turborepo 配置
```

## 安装

### Core 库

```bash
npm install @diffson/core
# 或
bun add @diffson/core
```

### CLI 工具

```bash
# 全局安装
npm install -g @diffson/cli

# 或使用 npx（无需安装）
npx @diffson/cli
```

---

## Core 库使用

### 快速开始

```typescript
import { DiffService, PresetName } from '@diffson/core';

const diffService = new DiffService();

const left = { name: 'John', age: 30 };
const right = { name: 'John', age: 31 };

const results = diffService.diffElement(left, right);
console.log(results);
// [{ leftPath: 'age', rightPath: 'age', left: '30', right: '31', diffType: 'MODIFY' }]
```

### API 参考

#### DiffService

```typescript
// 创建实例，可选预设模式
const diffService = new DiffService(preset?: PresetName);
```

**预设模式（PresetName）：**

| 预设 | 说明 |
|------|------|
| `FullSmart` | 智能比较所有字段（默认） |
| `FullOrdered` | 顺序敏感比较 |
| `LeftSmart` | 仅比较左侧存在的字段，智能模式 |
| `LeftOrdered` | 仅比较左侧存在的字段，顺序敏感 |

#### diffElement 方法

```typescript
diffService.diffElement(left, right, options?)
```

**参数：**
- `left` - 第一个 JSON 值
- `right` - 第二个 JSON 值
- `options` - 可选配置
  - `ignorePaths: string[]` - 忽略的逻辑路径列表
  - `arrayMatching.identityPaths: string[]` - 智能数组配对使用的 identity 路径
  - `parseNestedJson: boolean` - 是否解析嵌套 JSON 字符串

#### diffJson 方法

```typescript
diffService.diffJson(leftJson, rightJson, options?)
```

接受 JSON 字符串作为输入，其他同 `diffElement`。

#### 返回结果

```typescript
interface Result {
  leftPath: string | null;   // 左侧路径
  rightPath: string | null;  // 右侧路径
  left: unknown;             // 左侧值
  right: unknown;            // 右侧值
  diffType: 'ADD' | 'DELETE' | 'MODIFY';  // 差异类型
}
```

### 使用示例

#### 使用预设模式

```typescript
import { DiffService, PresetName } from '@diffson/core';

// 顺序敏感比较
const orderedDiff = new DiffService(PresetName.FullOrdered);
const results = orderedDiff.diffElement([1, 2, 3], [1, 3, 2]);

// 仅比较左侧字段
const leftDiff = new DiffService(PresetName.LeftSmart);
const results2 = leftDiff.diffElement({ a: 1 }, { a: 1, b: 2 });
// 结果: [] （忽略右侧多出的 b 字段）
```

#### 忽略路径

```typescript
const diffService = new DiffService();

const left = { name: 'John', timestamp: 1000 };
const right = { name: 'John', timestamp: 2000 };

const results = diffService.diffElement(left, right, {
  ignorePaths: ['timestamp']
});
// 结果: [] （timestamp 被忽略）
```

#### 数组 identity 路径

```typescript
const left = {
  items: [{ id: 'a', label: 'x' }, { id: 'b', label: 'y' }]
};
const right = {
  items: [{ id: 'b', label: 'x' }, { id: 'a', label: 'y' }]
};

const results = diffService.diffElement(left, right, {
  arrayMatching: {
    identityPaths: ['items.id']
  }
});
// 智能数组比较会优先按 items.id 配对，再比较其他字段
```

#### 解析嵌套 JSON

```typescript
const left = { data: '{"nested":"value1"}' };
const right = { data: '{"nested":"value2"}' };

const results = diffService.diffElement(left, right, {
  parseNestedJson: true
});
// 结果: [{ leftPath: 'data.nested', ... }]
```

---

## CLI 工具使用

### 快速开始

```bash
# 交互模式（默认）
diffson

# 比较 JSON 字符串
diffson '{"a":1,"b":2}' '{"a":1,"b":3}'

# 比较文件
diffson -f1 data1.json -f2 data2.json
```

### 命令行选项

#### 基本选项

| 选项 | 说明 |
|------|------|
| `-h, --help` | 显示帮助信息 |
| `-v, --version` | 显示版本号 |
| `--interactive` | 进入交互模式 |

#### 输入选项

| 选项 | 说明 |
|------|------|
| `-f1, --file1 <path>` | 从文件读取第一个 JSON |
| `-f2, --file2 <path>` | 从文件读取第二个 JSON |
| `--json1 <string>` | 第一个 JSON 字符串 |
| `--json2 <string>` | 第二个 JSON 字符串 |

#### 比较选项

| 选项 | 说明 |
|------|------|
| `-p, --preset <name>` | 预设模式：`fullSmart`(默认), `fullOrdered`, `leftSmart`, `leftOrdered` |
| `--parse-nested-json` | 递归解析嵌套 JSON 字符串 |
| `--ignore-path <paths>` | 忽略逻辑路径（逗号分隔） |
| `--array-identity-path <paths>` | 智能数组配对使用的 identity 路径（逗号分隔） |

#### 输出选项

| 选项 | 说明 |
|------|------|
| `--format <type>` | 输出格式：`text`(默认) 或 `json` |
| `--filter <type>` | 过滤类型：`add`, `delete`, `modify`（逗号分隔） |
| `-o, --output <path>` | 输出到文件 |
| `--color, --no-color` | 启用/禁用颜色 |

### 使用示例

#### 比较文件

```bash
diffson --file1 old-config.json --file2 new-config.json
```

#### 使用预设模式

```bash
# 顺序敏感比较
diffson --preset fullOrdered -f1 data1.json -f2 data2.json

# 仅比较左侧字段
diffson --preset leftSmart -f1 base.json -f2 update.json
```

#### 过滤差异类型

```bash
# 仅显示新增
diffson -f1 old.json -f2 new.json --filter add

# 仅显示删除和修改
diffson -f1 old.json -f2 new.json --filter delete,modify
```

#### 忽略路径

```bash
# 忽略 timestamp 字段
diffson -f1 data1.json -f2 data2.json --ignore-path timestamp

# 忽略数组元素的 name 字段
diffson -f1 data1.json -f2 data2.json --ignore-path items.name
```

#### 数组 identity 路径

```bash
# 智能数组比较时优先按 id 配对
diffson -f1 data1.json -f2 data2.json --array-identity-path items.id
```

#### JSON 格式输出

```bash
diffson --format json -f1 data1.json -f2 data2.json

# 输出到文件
diffson --format json -f1 data1.json -f2 data2.json -o result.json
```

#### 输出示例

**文本格式：**
```
Found 2 differences:

+ newField
    + "new value"

~ modifiedField
    - "old value"
    + "new value"
```

**JSON 格式：**
```json
[
  { "leftPath": null, "rightPath": "newField", "left": null, "right": "new value", "diffType": "ADD" },
  { "leftPath": "modifiedField", "rightPath": "modifiedField", "left": "old value", "right": "new value", "diffType": "MODIFY" }
]
```

---

## 路径格式

使用点号 `.` 分隔嵌套路径：

| 格式 | 说明 | 示例 |
|------|------|------|
| `field` | 对象字段 | `name`, `age` |
| `parent.child` | 嵌套字段 | `user.name` |
| `array.[0]` | 数组索引 | `items.[0]` |
| `array.field` | 数组元素字段（自动匹配所有索引） | `items.name` 匹配 `items.[0].name`, `items.[1].name` 等 |

---

## 开发指南

### 环境要求

- **Bun** >= 1.0.0
- **Node.js** >= 18（可选，用于发布）

### 本地开发

```bash
# 克隆项目
git clone <repository-url>
cd json-diff-ts

# 安装依赖
bun install

# 构建所有包
bun run build

# 运行测试
bun run test

# 类型检查
bun run typecheck
```

### 项目脚本

| 命令 | 说明 |
|------|------|
| `bun run build` | 构建所有包 |
| `bun run test` | 运行测试 |
| `bun run typecheck` | 类型检查 |
| `bun run clean` | 清理构建产物 |
| `bun run dev` | 开发模式 |

### 发布

```bash
bun run publish
```

---

## 许可证

MIT
