#!/bin/bash

# CLI 使用示例脚本
# 运行方式：chmod +x examples/cli-usage.sh && ./examples/cli-usage.sh

echo "🚀 MCP Server CLI 使用示例"
echo "=========================="

# 1. 基础启动（SSE 模式）
echo ""
echo "1️⃣ 基础启动（SSE 模式，端口 3000）"
echo "npx mcp_exe"
echo "访问: http://localhost:3000/"
echo ""

# 2. 指定端口启动
echo "2️⃣ 指定端口启动"
echo "npx mcp_exe --port 3001"
echo "访问: http://localhost:3001/"
echo ""

# 3. 使用 MCP 配置文件
echo "3️⃣ 使用 MCP 配置文件"
echo "npx mcp_exe --mcp-config ./examples/mcp.json"
echo ""

# 4. 使用自定义工具配置
echo "4️⃣ 使用自定义工具配置"
echo "npx mcp_exe --mcp-js ./examples/custom-mcp-config.js"
echo ""

# 5. WebSocket 模式
echo "5️⃣ WebSocket 模式"
echo "npx mcp_exe --ws wss://api.xiaozhi.me/mcp/?token=YOUR_TOKEN --mcp-config ./examples/mcp-sse.json"
echo ""

# 6. 定时任务模式
echo "6️⃣ 定时任务模式"
echo "npx mcp_exe --cronjob ./examples/cronjob.json --mcp-js ./examples/product-hunt/custom-mcp-config.js"
echo ""

# 7. 工具链模式
echo "7️⃣ 工具链模式"
echo "npx mcp_exe --mcp-config ./examples/product-hunt/mcp-tools.json"
echo ""

# 8. 启用 Cursor 链接
echo "8️⃣ 启用 Cursor 链接"
echo "npx mcp_exe --cursor-link --port 3002"
echo ""

# 9. 设置日志级别
echo "9️⃣ 设置日志级别"
echo "npx mcp_exe --log-level DEBUG --port 3003"
echo ""

# 10. 完整示例
echo "🔟 完整示例（组合多个选项）"
echo "npx mcp_exe \\"
echo "  --port 3004 \\"
echo "  --server-name 'my-custom-server' \\"
echo "  --mcp-config ./examples/mcp.json \\"
echo "  --cursor-link \\"
echo "  --log-level INFO"
echo ""

echo "📝 注意事项："
echo "- 确保先运行 'npm run build' 生成 dist 目录"
echo "- 配置文件路径相对于当前工作目录"
echo "- 使用 Ctrl+C 停止服务器"
echo "- 查看 README.md 获取更多详细信息" 