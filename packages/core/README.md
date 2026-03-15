# @diffson/core

A powerful TypeScript library for comparing JSON objects with multiple comparison strategies.

## Installation

```bash
npm install @diffson/core
```

## Quick Start

```typescript
import { DiffService, PresetName } from '@diffson/core';

// Create a diff service
const diffService = new DiffService();

// Compare two JSON objects
const left = { name: 'John', age: 30 };
const right = { name: 'John', age: 31 };

const results = diffService.diffElement(left, right);

console.log(results);
// [
//   {
//     leftPath: 'age',
//     rightPath: 'age',
//     left: '30',
//     right: '31',
//     diffType: 'MODIFY'
//   }
// ]
```

## API Reference

### DiffService

The main class for comparing JSON objects.

#### Constructor

```typescript
new DiffService(preset?: PresetName)
```

**Parameters:**
- `preset` (optional): Comparison strategy preset. Default: `PresetName.FullSmart`

**Presets:**
- `PresetName.FullSmart` - Smart comparison of all fields (default)
- `PresetName.FullOrdered` - Order-sensitive comparison
- `PresetName.LeftSmart` - Compare only fields in left object, smart mode
- `PresetName.LeftOrdered` - Compare only fields in left object, order-sensitive

#### Methods

##### `diffElement(left, right, options?)`

Compare two JSON values directly.

```typescript
diffElement(
  left: JsonValue,
  right: JsonValue,
  options?: {
    ignorePaths?: string[];
    arrayMatching?: {
      identityPaths?: string[];
    };
    parseNestedJson?: boolean;
  }
): Result[]
```

**Parameters:**
- `left`: First JSON value
- `right`: Second JSON value
- `options` (optional):
  - `ignorePaths`: Array of logical paths to skip during comparison
  - `arrayMatching.identityPaths`: Logical identity paths used by smart array matching
  - `parseNestedJson`: Parse nested JSON strings recursively

**Returns:** Array of `Result` objects representing differences.

##### `diffJson(leftJson, rightJson, options?)`

Compare two JSON strings.

```typescript
diffJson(
  leftJson: string,
  rightJson: string,
  options?: {
    ignorePaths?: string[];
    arrayMatching?: {
      identityPaths?: string[];
    };
    parseNestedJson?: boolean;
  }
): Result[]
```

**Parameters:**
- `leftJson`: First JSON string
- `rightJson`: Second JSON string
- `options`: Same as `diffElement`

**Returns:** Array of `Result` objects representing differences.

### Result Object

Each difference is represented by a `Result` object:

```typescript
{
  leftPath: string | null;   // Path in left object
  rightPath: string | null;  // Path in right object
  left: unknown;             // Value in left object
  right: unknown;            // Value in right object
  diffType: string;          // 'ADD' | 'DELETE' | 'MODIFY'
}
```

**Diff Types:**
- `ADD`: Field exists in right but not in left
- `DELETE`: Field exists in left but not in right
- `MODIFY`: Field exists in both but with different values

## Usage Examples

### Basic Comparison

```typescript
import { DiffService } from '@diffson/core';

const diffService = new DiffService();

const left = { a: 1, b: 2 };
const right = { a: 1, b: 3, c: 4 };

const results = diffService.diffElement(left, right);
// Results: [
//   { leftPath: 'b', rightPath: 'b', left: '2', right: '3', diffType: 'MODIFY' },
//   { leftPath: null, rightPath: 'c', left: null, right: '4', diffType: 'ADD' }
// ]
```

### Using Presets

```typescript
import { DiffService, PresetName } from '@diffson/core';

// Order-sensitive comparison
const orderedDiff = new DiffService(PresetName.FullOrdered);
const results1 = orderedDiff.diffElement([1, 2, 3], [1, 3, 2]);
// Detects order changes

// Left-only comparison (ignore fields only in right)
const leftDiff = new DiffService(PresetName.LeftSmart);
const left = { a: 1, b: 2 };
const right = { a: 1, b: 2, c: 3 };
const results2 = leftDiff.diffElement(left, right);
// Results: [] (ignores 'c' since it's not in left)
```

### Ignoring Paths

```typescript
const diffService = new DiffService();

const left = { name: 'John', timestamp: 1000 };
const right = { name: 'John', timestamp: 2000 };

// Ignore timestamp field
const results = diffService.diffElement(left, right, {
  ignorePaths: ['timestamp']
});
// Results: [] (timestamp is ignored)
```

### Array Identity Paths

```typescript
const diffService = new DiffService();

const left = {
  items: [{ id: "a", label: "x" }, { id: "b", label: "y" }],
};

const right = {
  items: [{ id: "b", label: "x" }, { id: "a", label: "y" }],
};

const results = diffService.diffElement(left, right, {
  arrayMatching: {
    identityPaths: ["items.id"],
  },
});
// Smart array matching uses items.id to pair logical items before diffing labels
```

### Nested Objects

```typescript
const left = {
  user: { name: 'Alice', age: 30 },
  items: [{ id: 1, name: 'Item 1' }]
};

const right = {
  user: { name: 'Bob', age: 30 },
  items: [{ id: 1, name: 'Item 1' }]
};

const results = diffService.diffElement(left, right);
// Results: [
//   { leftPath: 'user.name', rightPath: 'user.name', left: 'Alice', right: 'Bob', diffType: 'MODIFY' }
// ]
```

### Parsing Nested JSON Strings

```typescript
const left = { data: '{"nested":"value1"}' };
const right = { data: '{"nested":"value2"}' };

// Without parseNestedJson
const results1 = diffService.diffElement(left, right);
// Compares strings: '{"nested":"value1"}' vs '{"nested":"value2"}'

// With parseNestedJson
const results2 = diffService.diffElement(left, right, {
  parseNestedJson: true
});
// Parses and compares: { nested: 'value1' } vs { nested: 'value2' }
// Results: [{ leftPath: 'data.nested', rightPath: 'data.nested', ... }]
```

### Comparing JSON Strings

```typescript
const leftJson = '{"name":"John","age":30}';
const rightJson = '{"name":"John","age":31}';

const results = diffService.diffJson(leftJson, rightJson);
// Same as diffElement but accepts JSON strings
```

### Fluent API (Advanced)

```typescript
import { DiffService, SequentialArrayComparator, LeftJoinObjectComparator } from '@diffson/core';

const diffService = new DiffService()
  .withArrayComparator(SequentialArrayComparator)
  .withObjectComparator(LeftJoinObjectComparator);

const results = diffService.diffElement(left, right);
// Uses custom comparators
```

## Path Format

Paths use dot notation to reference nested fields:

- `field` - Object field
- `array.[0]` - Array element at index 0
- `parent.child` - Nested object field
- `items.[0].name` - Field in array element

When using `ignorePaths` or `arrayMatching.identityPaths`, array indices are auto-filtered:
- `items.name` matches `items.[0].name`, `items.[1].name`, etc.

## TypeScript Support

This library is written in TypeScript and includes full type definitions.

```typescript
import type { JsonValue, Result, PresetName } from '@diffson/core';
```

## License

MIT

