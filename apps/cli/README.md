# Diffson CLI

A powerful JSON diff tool with multiple comparison strategies and output formats.

## Installation

Install globally via npm:

```bash
npm install -g @diffson/cli
```

Or use with npx (no installation required):

```bash
npx @diffson/cli [options]
```

## Quick Start

### Interactive Mode (Default)

Simply run `diffson` without arguments to enter interactive mode:

```bash
diffson
```

### Compare JSON Strings

```bash
diffson '{"a":1,"b":2}' '{"a":1,"b":3}'
```

### Compare JSON Files

```bash
diffson --file1 data1.json --file2 data2.json
# Or use short options
diffson -f1 data1.json -f2 data2.json
```

## Command Line Options

### Basic Options

- `-h, --help` - Show help information
- `-v, --version` - Show version number
- `--interactive` - Enter interactive mode (default when no arguments provided)

### Input Options

- `--file1 <path>, -f1 <path>` - Read first JSON from file
- `--file2 <path>, -f2 <path>` - Read second JSON from file
- `--json1 <string>` - First JSON string (or use positional argument)
- `--json2 <string>` - Second JSON string (or use positional argument)

### Comparison Options

- `--preset <name>, -p <name>` - Choose comparison preset:
  - `fullSmart` or `smart` (default) - Smart comparison of all fields
  - `fullOrdered` or `ordered` - Order-sensitive comparison
  - `leftSmart` - Compare only fields in left object, smart mode
  - `leftOrdered` - Compare only fields in left object, order-sensitive

### Advanced Options

- `--parse-nested-json` - Parse nested JSON strings recursively
- `--ignore-path <paths>` - Ignore logical paths (comma-separated)
  - Example: `items.name` (matches `items.[0].name`, `items.[1].name`, etc.)
- `--array-identity-path <paths>` - Help smart array matching pair logical items by identity (comma-separated)

### Output Options

- `--format <type>` - Output format:
  - `text` (default) - Human-readable text output
  - `json` - JSON format output

- `--filter <type>` - Filter by diff type (comma-separated):
  - `add` - Show only added items
  - `delete` - Show only deleted items
  - `modify` - Show only modified items
  - Example: `--filter add,delete`

- `--output <path>, -o <path>` - Write output to file
- `--color, --no-color` - Enable or disable colored output

## Usage Examples

### Basic Comparison

```bash
diffson '{"name":"John","age":30}' '{"name":"John","age":31}'
```

Output:
```
Found 1 difference:

~ age
    - 30
    + 31
```

### Compare Files

```bash
diffson --file1 old-config.json --file2 new-config.json
```

### Using Different Presets

```bash
# Order-sensitive comparison
diffson --preset fullOrdered --file1 data1.json --file2 data2.json

# Compare only left-side fields
diffson --preset leftSmart --file1 base.json --file2 update.json
```

### Filter by Diff Type

```bash
# Show only added fields
diffson --file1 old.json --file2 new.json --filter add

# Show only deleted fields
diffson --file1 old.json --file2 new.json --filter delete

# Show only modified fields
diffson --file1 old.json --file2 new.json --filter modify

# Show added and deleted fields
diffson --file1 old.json --file2 new.json --filter add,delete
```

### Parse Nested JSON

```bash
diffson '{"data":"{\"nested\":\"value\"}"}' '{"data":"{\"nested\":\"value2\"}"}' --parse-nested-json
```

### Ignore Specific Paths

```bash
# Ignore timestamp fields in array items
diffson --file1 data1.json --file2 data2.json --ignore-path items.timestamp

# Ignore multiple paths
diffson --file1 data1.json --file2 data2.json --ignore-path items.name,metadata.createdAt
```

### Array Identity Paths

```bash
# Help smart array matching pair items by id
diffson --file1 data1.json --file2 data2.json --array-identity-path items.id
```

### JSON Format Output

```bash
diffson --format json --file1 data1.json --file2 data2.json
```

Output:
```json
[
  {
    "leftPath": "age",
    "rightPath": "age",
    "left": "30",
    "right": "31",
    "diffType": "MODIFY"
  }
]
```

### Save Output to File

```bash
diffson --format json --file1 data1.json --file2 data2.json --output diff-result.json
```

## Interactive Mode

When you run `diffson` without arguments, it enters interactive mode where you can:
- Input two JSON strings step by step
- Choose comparison options interactively
- View results immediately

```bash
diffson
# or explicitly
diffson --interactive
```

## Path Format

Paths use dot notation to reference nested fields:

- `field` - Object field
- `array.[0]` - Array index (specific element)
- `items.name` - Matches `items.[0].name`, `items.[1].name`, etc. (auto-filters array indices)
- `parent.child.grandchild` - Nested path

## Output Format

### Text Output (Default)

```
Found 3 differences:

+ newField
    + "new value"

- removedField
    - "old value"

~ modifiedField
    - "old value"
    + "new value"
```

### Diff Type Symbols

- `+` (green) - Added items
- `-` (red) - Deleted items
- `~` (yellow) - Modified items

### JSON Output

```json
[
  {
    "leftPath": "field.path",
    "rightPath": "field.path",
    "left": "old value",
    "right": "new value",
    "diffType": "MODIFY"
  }
]
```

Diff types: `ADD`, `DELETE`, `MODIFY`

## Error Handling

### File Not Found

```
Error: Failed to read file "data.json": ENOENT: no such file or directory
```

### Invalid JSON

```
Error: JSON Parse error: Expected '}'
```

Make sure your JSON is valid before comparing.

## Development

### Build from Source

```bash
git clone <repository-url>
cd json-diff-ts
bun install
bun run build
```

### Run Tests

```bash
bun test
```

### Type Check

```bash
bun run typecheck
```

## License

MIT
