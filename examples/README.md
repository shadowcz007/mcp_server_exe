# 使用示例

本目录包含了 MCP Server 的各种使用示例，帮助你快速上手和了解不同场景下的使用方法。

## 📁 示例文件说明

### 🚀 库 API 使用示例

#### `library-usage.js`
- **用途**: CommonJS 方式使用库 API
- **运行**: `npm run build && node examples/library-usage.js`
- **特点**: 展示基本的 SSE 模式服务器启动

#### `library-usage.ts`
- **用途**: TypeScript/ESM 方式使用库 API
- **运行**: `npm run build && npx tsx examples/library-usage.ts`
- **特点**: 展示 stdio 模式服务器启动，带类型检查

#### `integration-example.js`
- **用途**: 完整的集成示例，包含自定义工具
- **运行**: `npm run build && node examples/integration-example.js`
- **特点**: 
  - 封装了 `McpIntegration` 类
  - 包含自定义工具注册
  - 优雅关闭处理
  - 配置文件加载

### 🖥️ CLI 使用示例

#### `cli-usage.sh`
- **用途**: 展示各种命令行用法
- **运行**: `chmod +x examples/cli-usage.sh && ./examples/cli-usage.sh`
- **特点**: 包含 10 种不同的 CLI 使用场景

### ⚙️ 配置文件示例

#### `mcp.json`
- **用途**: 基础 MCP 配置，组合 SSE 和 stdio 服务
- **使用**: `npx mcp_exe --mcp-config ./examples/mcp.json`

#### `mcp-sse.json`
- **用途**: WebSocket 模式配置
- **使用**: `npx mcp_exe --ws <url> --mcp-config ./examples/mcp-sse.json`

#### `custom-mcp-config.js`
- **用途**: 自定义工具配置示例
- **使用**: `npx mcp_exe --mcp-js ./examples/custom-mcp-config.js`

#### `test-config.js`
- **用途**: 测试用工具配置
- **使用**: `npx mcp_exe --mcp-js ./examples/test-config.js`

### 🔗 工具链示例

#### `product-hunt/mcp-tools.json`
- **用途**: Product Hunt 工具链配置
- **使用**: `npx mcp_exe --mcp-config ./examples/product-hunt/mcp-tools.json`

#### `tools-chain/mcp-tools.json`
- **用途**: 内容仓库工具链配置
- **使用**: `npx mcp_exe --mcp-config ./examples/tools-chain/mcp-tools.json`

### ⏰ 定时任务示例

#### `cronjob.json`
- **用途**: 基础定时任务配置
- **使用**: `npx mcp_exe --cronjob ./examples/cronjob.json`

#### `notify-database/`
- **用途**: 数据库通知示例
- **使用**: `npx mcp_exe --mcp-js examples/notify-database/database.js --cronjob examples/notify-database/cronjob.json`

## 🎯 快速开始

### 1. 库 API 方式
```bash
# 构建项目
npm run build

# 运行基础示例
node examples/library-usage.js

# 运行集成示例
node examples/integration-example.js
```

### 2. CLI 方式
```bash
# 基础启动
npx mcp_exe

# 使用配置文件
npx mcp_exe --mcp-config ./examples/mcp.json

# 查看所有 CLI 示例
./examples/cli-usage.sh
```

## 📋 注意事项

1. **构建要求**: 运行库 API 示例前必须先执行 `npm run build`
2. **端口冲突**: 示例使用不同端口（3000-3005），避免冲突
3. **配置文件**: 确保配置文件路径正确，相对于项目根目录
4. **依赖**: 某些示例可能需要额外的 MCP 服务运行

## 🔧 自定义开发

参考 `integration-example.js` 了解如何：
- 封装 MCP 服务器类
- 注册自定义工具
- 处理配置文件加载
- 实现优雅关闭
- 错误处理

## 📚 更多信息

- 详细文档请查看项目根目录的 `README.md`
- API 类型定义在 `dist/index.d.ts`
- 源码在 `src/` 目录 