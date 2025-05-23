import WebSocket from 'ws'
import { McpRouterServer } from './mcpRouterServer'
import { WebSocketServerTransport } from './webSocketTransport'

// 重连设置
const INITIAL_BACKOFF = 1000 // 初始等待时间（毫秒）
const MAX_BACKOFF = 600000 // 最大等待时间（毫秒）

export class WebSocketServer {
  private reconnectAttempt = 0
  private backoff = INITIAL_BACKOFF
  private routerServer: McpRouterServer | null = null
  private logger: any

  constructor (
    private uri: string,
    private serverInfo: any,
    private configureMcp: Function | null,
    private mcpConfig: any,
    logger?: any
  ) {
    this.logger = logger || {
      info: (msg: string) =>
        console.log(`${new Date().toISOString()} - INFO - ${msg}`),
      error: (msg: string) =>
        console.error(`${new Date().toISOString()} - ERROR - ${msg}`),
      warning: (msg: string) =>
        console.warn(`${new Date().toISOString()} - WARN - ${msg}`),
      debug: (msg: string) =>
        console.debug(`${new Date().toISOString()} - DEBUG - ${msg}`)
    }
  }

  private async sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  public async start (): Promise<void> {
    while (true) {
      try {
        if (this.reconnectAttempt > 0) {
          const waitTime = this.backoff * (1 + Math.random() * 0.1)
          this.logger.info(
            `等待 ${(waitTime / 1000).toFixed(2)} 秒后进行第 ${
              this.reconnectAttempt
            } 次重连...`
          )
          await this.sleep(waitTime)
        }

        await this.connect()
      } catch (e) {
        this.reconnectAttempt++
        this.logger.warning(
          `连接关闭 (尝试次数: ${this.reconnectAttempt}): ${e}`
        )
        this.backoff = Math.min(this.backoff * 2, MAX_BACKOFF)
      }
    }
  }

  private async connect (): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.info('正在连接到WebSocket服务器...')
      const ws = new WebSocket(this.uri)

      ws.on('open', async () => {
        this.logger.info('成功连接到WebSocket服务器')

        // 重置重连计数器
        this.reconnectAttempt = 0
        this.backoff = INITIAL_BACKOFF

        try {
          this.logger.info('正在启动MCP服务器...')

          // 创建WebSocket传输层
          const transport = new WebSocketServerTransport(ws)

          // 设置消息处理
          ws.on('message', (data: WebSocket.Data) => {
            try {
              const message = data.toString('utf-8')
              this.logger.debug(`<< ${message.slice(0, 320)}...`)

              const jsonMessage = JSON.parse(message)

              const tryProcessMessage = (
                message: any,
                attempt: number = 0,
                maxAttempts: number = 120
              ) => {
                if (transport.onmessage) {
                  transport.onmessage(message)
                } else if (attempt < maxAttempts) {
                  this.logger.debug(
                    `等待onmessage可用，尝试次数: ${attempt + 1}`
                  )
                  setTimeout(() => {
                    tryProcessMessage(message, attempt + 1, maxAttempts)
                  }, 500)
                } else {
                  this.logger.error('达到最大重试次数，消息处理失败')
                }
              }

              tryProcessMessage(jsonMessage)
            } catch (error) {
              this.logger.error(`处理消息时出错: ${error}`)
            }
          })

          // 创建路由服务器实例
          this.routerServer = new McpRouterServer(this.serverInfo, {})

          // 配置MCP服务器
          if (this.configureMcp) {
            this.configureMcp(this.routerServer.server)
          }

          // 导入MCP配置
          await this.routerServer.importMcpConfig(this.mcpConfig)

          // 连接MCP服务器到传输层
          await this.routerServer.server.connect(transport)

          this.logger.info('MCP服务器启动成功')
        } catch (error) {
          this.logger.error(`启动MCP服务器失败: ${error}`)
          ws.close()
          return
        }
      })

      ws.on('close', () => {
        this.logger.error('WebSocket连接已关闭')
        if (this.routerServer) {
          this.logger.info('清理MCP服务器资源')
        }
        reject(new Error('WebSocket连接已关闭'))
      })

      ws.on('error', (error: Error) => {
        this.logger.error(`WebSocket错误: ${error}`)
        if (this.routerServer) {
          this.logger.info('清理MCP服务器资源')
        }
        reject(error)
      })
    })
  }
}
