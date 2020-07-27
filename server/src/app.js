const http = require('http')
const koa = require('koa')
const config = require('./config')
const logger = require('./utils/logUtil')('app')
const loaders = require('./loaders')
const socketio = require('./utils/socketio')
const redisTool = require('./utils/redisTool')
async function startServer() {
  const app = new koa()
  await loaders(app)                                      // 加载koa配置
  const server = http.createServer(app.callback())        // 创建server
  server.listen(config.port, err => {                     // 监听服务启动
    if (err) {
      logger.error(err)
      process.exit(1)
      return;
    }
    logger.info(`Server listening on port: ${config.port}`)
  });
  await socketio(server)                                 // 初始化websocket
}
startServer()
/redisTool.set('addddadddddddddssssss', {name: '张三', age: '25'}, 5000)