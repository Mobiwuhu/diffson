# Diffson CLI 使用文档

## 概述

Diffson 是一个功能强大的 JSON 差异比较工具，支持多种比较策略和输出格式。

## 安装

```bash
# 从项目根目录
cd apps/cli
bun run build

# 安装 gum（交互模式需要）
# macOS
brew install gum

# Linux (Ubuntu/Debian)
sudo apt-get install gum

# Arch Linux
sudo pacman -S gum
```

## 基本用法

### 使用 JSON 字符串

```bash
bun apps/cli/dist/src/index.js '{"a":1,"b":2}' '{"a":1,"b":3}'
```

### 使用文件

```bash
bun apps/cli/dist/src/index.js --file1 data1.json --file2 data2.json
# 或使用短选项
bun apps/cli/dist/src/index.js -f1 data1.json -f2 data2.json
```

## 命令行选项

### 基本选项

- `-h, --help` - 显示帮助信息
- `-v, --version` - 显示版本号
- `-I, --interactive` - 进入交互模式（推荐使用 diffson-interactive）

### 输入选项

- `--file1 <path>, -f1 <path>` - 从文件读取第一个 JSON
- `--file2 <path>, -f2 <path>` - 从文件读取第二个 JSON

### 比较选项

- `--preset <name>, -p <name>` - 选择比较预设（见下方预设说明）
  - `fullSmart` (默认) - 智能比较所有字段
  - `fullOrdered` - 顺序敏感的比较
  - `leftSmart` - 仅比较左侧对象中的字段，智能模式
  - `leftOrdered` - 仅比较左侧对象中的字段，顺序敏感

### 输出选项

- `--format <type>` - 输出格式
  - `text` (默认) - 文本输出
  - `json` - JSON 格式输出

- `--filter <type>` - 过滤特定类型的差异
  - `add` - 只显示新增的项
  - `delete` - 只显示删除的项
  - `modify` - 只显示修改的项
  - 可以组合使用：`--filter add,delete`

- `--output <path>, -o <path>` - 将结果输出到文件（仅适用于 JSON 格式）

- `--color, --no-color` - 启用或禁用彩色输出

## 示例

### 基本比较

```bash
bun apps/cli/dist/src/index.js '{"name":"John","age":30}' '{"name":"John","age":31}'
```

输出：
```
Found 1 difference:

~ age
    - 30
    + 31
```

### 比较文件

```bash
bun apps/cli/dist/src/index.js --file1 old-config.json --file2 new-config.json
```

### 使用不同预设

```bash
# 使用顺序敏感的比较
bun apps/cli/dist/src/index.js --preset fullOrdered --file1 data1.json --file2 data2.json

# 仅比较左侧字段
bun apps/cli/dist/src/index.js --preset leftSmart --file1 base.json --file2 update.json
```

### 过滤差异类型

```bash
# 只查看新增的字段
bun apps/cli/dist/src/index.js --file1 old.json --file2 new.json --filter add

# 只查看删除的字段
bun apps/cli/dist/src/index.js --file1 old.json --file2 new.json --filter delete

# 只查看修改的字段
bun apps/cli/dist/src/index.js --file1 old.json --file2 new.json --filter modify

# 查看新增和删除的字段
bun apps/cli/dist/src/index.js --file1 old.json --file2 new.json --filter add,delete
```

### JSON 格式输出

```bash
bun apps/cli/dist/src/index.js --format json --file1 data1.json --file2 data2.json
```

输出：
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

### 输出到文件

```bash
bun apps/cli/dist/src/index.js --format json --file1 data1.json --file2 data2.json --output diff-result.json
```

## 交互模式（使用 Gum）

Diffson 提供了两种交互模式：

### 1. 命令行交互模式

```bash
bun apps/cli/dist/src/index.js --interactive
```

在交互模式中，您可以：
- 逐步输入两个 JSON 字符串
- 查看比较结果
- 重新开始或退出

### 2. Gum 增强交互模式（推荐）

```bash
bun apps/cli/dist/src/interactive.js
```

这个模式使用 Charmbracelet Gum 提供更美观、现代的终端界面。

#### 交互流程

1. **输入第一个 JSON**
   - 使用多行输入框
   - 按 Ctrl+D 完成输入
   - 自动验证 JSON 格式

2. **输入第二个 JSON**
   - 同样的输入界面
   - 按 Ctrl+D 完成输入

3. **选择比较预设**
   - Full Smart (智能比较 - 推荐)
   - Full Ordered (顺序敏感)
   - Left Smart (仅比较左侧)
   - Left Ordered (仅左侧顺序)
   - 使用上下键选择，按回车确认

4. **选择是否解析嵌套 JSON**
   - 确认对话框
   - 默认为 No
   - 按 Enter 选择 No，按 y 选择 Yes

5. **输入要忽略的路径（可选）**
   - 单行输入框
   - 路径示例：field.nested, array.[0]
   - 直接按 Enter 跳过

6. **输入特殊路径（可选）**
   - 单行输入框
   - 直接按 Enter 跳过

7. **查看 Diff 结果**
   - 清晰的差异显示
   - 支持 4 种差异类型
   - 可以重新开始、复制结果、保存文件或退出

#### 差异类型

- `+` (绿色) - 新增的项
- `-` (红色) - 删除的项
- `~` (黄色) - 修改的项

#### 后续操作

- 🔄 重新开始
- 📋 复制结果到剪贴板
- 💾 保存结果到文件
- 🚪 退出

#### 主题配置

Gum 支持通过环境变量配置主题：

```bash
export GUM_BORDER_FOREGROUND="#00ff00"
export GUM_FOREGROUND="#ffffff"
export GUM_BACKGROUND="#000000"
```

## 输出说明

### 路径表示

- `field` - 对象字段
- `array.[0]` - 数组索引
- `parent.child` - 嵌套路径

## 错误处理

### 文件读取错误

```
Error: Failed to read file "data.json": ENOENT: no such file or directory
```

### JSON 解析错误

```
Error: JSON Parse error: Expected '}'
```

## 开发

### 构建项目

```bash
cd apps/cli
bun run build
```

### 运行测试

```bash
cd apps/cli
bun run test
```

### 类型检查

```bash
bun run typecheck
```

## Gum 依赖

交互模式需要安装 [Charmbracelet Gum](https://github.com/charmbracelet/gum)：

```bash
# macOS
brew install gum

# Linux (Ubuntu/Debian)
sudo apt-get install gum

# Arch Linux
sudo pacman -S gum

# Nix
nix-env -iA nixpkgs.gum

# 从源码安装
go install github.com/charmbracelet/gum@latest
```

## 许可证

MIT

