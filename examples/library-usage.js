/**
 * 库 API 使用示例 - CommonJS
 * 
 * 运行方式：
 * npm run build
 * node examples/library-usage.js
 */

const { McpRouterServer } = require('../dist/index.js');

async function main() {
  console.log('🚀 启动 MCP 路由服务器...');

  // 创建服务器实例
  const server = new McpRouterServer(
    { 
      name: 'example-library-server',
      version: '1.0.0',
      description: '库 API 使用示例'
    }, 
    { 
      transportType: 'sse',
      port: 3001,
      cursorLink: true
    }
  );

  // MCP 配置
  const mcpConfig = {
    mcpServers: {
      "inner_server": {
        url: "http://127.0.0.1:3000/mcp"
      }
    },
    serverInfo: {
      name: "library-example",
      version: "1.0.0"
    },
    tools: [],
    namespace: "."
  };

  try {
    // 导入配置
    await server.importMcpConfig(mcpConfig, null);
    
    // 启动服务器
    await server.start();
    
    console.log('✅ 服务器启动成功！');
    console.log('📡 SSE 端点: http://localhost:3001/');
    console.log('🔗 Cursor 链接已生成（如果支持）');
    
    // 保持服务器运行
    process.on('SIGINT', async () => {
      console.log('\n🛑 正在关闭服务器...');
      await server.close();
      console.log('✅ 服务器已关闭');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ 启动失败:', error.message);
    process.exit(1);
  }
}

main(); 