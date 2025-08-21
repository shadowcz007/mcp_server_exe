export { McpRouterServer } from './mcpRouterServer'

/**
 * 对外暴露的路由服务器启动选项（稳定 API）
 */
export interface RouterServerOptions {
  port?: number
  host?: string
  transportType?: 'sse' | 'stdio'
  cursorLink?: boolean
}

/**
 * 典型用法：
 *
 * const { McpRouterServer } = require('mcp_exe')
 * const server = new McpRouterServer({ name: 'my-app' }, { transportType: 'sse', port: 3000 })
 * await server.importMcpConfig(mcpJson, null)
 * await server.start()
 */ 