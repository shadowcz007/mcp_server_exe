/**
 * 库 API 使用示例 - TypeScript/ESM
 * 
 * 运行方式：
 * npm run build
 * npx tsx examples/library-usage.ts
 */

import { McpRouterServer } from '../dist/index.js';

interface McpConfig {
  mcpServers: Record<string, { url?: string; command?: string; args?: string[] }>;
  serverInfo: { name: string; version: string; description?: string };
  tools: string[];
  namespace: string;
}

async function main() {
  console.log('🚀 启动 MCP 路由服务器 (TypeScript)...');

  // 创建服务器实例
  const server = new McpRouterServer(
    { 
      name: 'example-library-server-ts',
      version: '1.0.0',
      description: 'TypeScript 库 API 使用示例'
    }, 
    { 
      transportType: 'stdio',
      cursorLink: false
    }
  );

  // MCP 配置
  const mcpConfig: McpConfig = {
    mcpServers: {
      "stdio-server": {
        command: "echo",
        args: ["hello"]
      }
    },
    serverInfo: {
      name: "typescript-example",
      version: "1.0.0",
      description: "TypeScript 示例"
    },
    tools: [],
    namespace: "::"
  };

  try {
    // 导入配置
    await server.importMcpConfig(mcpConfig, null);
    
    // 启动服务器
    await server.start();
    
    console.log('✅ 服务器启动成功！');
    console.log('📡 运行在 stdio 模式');
    
    // 保持服务器运行
    process.on('SIGINT', async () => {
      console.log('\n🛑 正在关闭服务器...');
      await server.close();
      console.log('✅ 服务器已关闭');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ 启动失败:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main(); 