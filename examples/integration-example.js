/**
 * 完整集成示例 - 展示在实际项目中使用 MCP Server
 * 
 * 运行方式：
 * npm run build
 * node examples/integration-example.js
 */

const { McpRouterServer } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

class McpIntegration {
  constructor() {
    this.server = null;
    this.config = null;
  }

  // 加载配置文件
  loadConfig(configPath) {
    try {
      const configFile = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configFile);
      console.log('✅ 配置文件加载成功:', configPath);
      return true;
    } catch (error) {
      console.error('❌ 配置文件加载失败:', error.message);
      return false;
    }
  }

  // 创建自定义工具配置
  createCustomTools(server) {
    console.log('🔧 注册自定义工具...');
    
    // 示例：添加一个简单的工具
    server.tool(
      'integration-test',
      '集成测试工具',
      {},
      async () => {
        return {
          content: [
            {
              type: 'text',
              text: `集成测试成功！时间: ${new Date().toISOString()}`
            }
          ]
        };
      }
    );

    // 示例：添加一个带参数的工具
    server.tool(
      'greet',
      '问候工具',
      {
        name: { type: 'string', description: '要问候的名字' },
        language: { type: 'string', description: '语言', default: 'zh' }
      },
      async (args) => {
        const greetings = {
          zh: `你好，${args.name}！`,
          en: `Hello, ${args.name}!`,
          ja: `こんにちは、${args.name}さん！`
        };
        
        return {
          content: [
            {
              type: 'text',
              text: greetings[args.language] || greetings.zh
            }
          ]
        };
      }
    );

    console.log('✅ 自定义工具注册完成');
  }

  // 启动服务器
  async start(options = {}) {
    const {
      port = 3005,
      transportType = 'sse',
      configPath = './examples/mcp.json',
      enableCustomTools = true
    } = options;

    console.log('🚀 启动 MCP 集成服务器...');

    // 加载配置
    if (!this.loadConfig(configPath)) {
      throw new Error('配置加载失败');
    }

    // 创建服务器实例
    this.server = new McpRouterServer(
      {
        name: 'integration-example',
        version: '1.0.0',
        description: 'MCP 集成示例服务器'
      },
      {
        port,
        transportType,
        cursorLink: true
      }
    );

    try {
      // 导入 MCP 配置
      await this.server.importMcpConfig(this.config, null);

      // 添加自定义工具（如果启用）
      if (enableCustomTools) {
        this.createCustomTools(this.server);
      }

      // 启动服务器
      await this.server.start();

      console.log('✅ 集成服务器启动成功！');
      console.log(`📡 端点: http://localhost:${port}/`);
      console.log('🔗 Cursor 链接已生成');
      console.log('🛠️  可用工具: integration-test, greet');

      // 设置优雅关闭
      this.setupGracefulShutdown();

      return this.server;

    } catch (error) {
      console.error('❌ 服务器启动失败:', error.message);
      throw error;
    }
  }

  // 设置优雅关闭
  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      console.log(`\n🛑 收到 ${signal} 信号，正在关闭服务器...`);
      
      if (this.server) {
        try {
          await this.server.close();
          console.log('✅ 服务器已优雅关闭');
        } catch (error) {
          console.error('❌ 关闭服务器时出错:', error.message);
        }
      }
      
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  // 获取服务器状态
  getStatus() {
    if (!this.server) {
      return { status: 'not_started' };
    }

    return {
      status: 'running',
      server: this.server,
      config: this.config
    };
  }
}

// 使用示例
async function main() {
  const integration = new McpIntegration();

  try {
    await integration.start({
      port: 3005,
      transportType: 'sse',
      configPath: './examples/mcp.json',
      enableCustomTools: true
    });

    console.log('\n📋 服务器状态:', integration.getStatus().status);
    console.log('💡 提示: 使用 Ctrl+C 停止服务器');

  } catch (error) {
    console.error('❌ 集成示例运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

module.exports = { McpIntegration }; 