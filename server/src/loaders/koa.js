const koaBody = require('koa-body')
const fs = require('fs')
const jwt = require('koa-jwt')
const routes = require('../routes')
const config = require('../config')
const path = require('path')
// const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
module.exports = async (app) => {
  // app.use(bodyParser())
  app.use(koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      uploadDir: path.join(__dirname, '../public/upload/'), // 设置文件上传目录
      keepExtensions: true,    // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name,file) => { // 文件上传前的设置
        const fp = path.join(__dirname, '../public/upload/')
        if (!fs.existsSync(fp)) { // 检查是否有“public/upload/”文件夹
          fs.mkdirSync(fp); // 没有就创建
        }
        console.log(`bodyparse: name:${name}`)
      }
    }
  }))
  // 跨域
  app.use(cors({
    origin: function (ctx) {
      return "*";
    },
    maxAge: 1000,          // 无需发送预请求(浏览器两次请求)
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  }));
  // 路由
  app.use(routes.routes(), routes.allowedMethods());
  // jwt验证
  app.use(
    jwt({ secret: config.jwtSecret }).unless(
      {
        path: [/^\/public|\/user\/login|\/assets/]
      }
    )
  )
  // set cookies
  // app.use(async ctx => {
  //   ctx.cookies.set('username','lisa', {
  //     domain:'localhost',
  //     path:'/index',              //cookie写入的路径
  //     maxAge:1000*60*60*1,
  //     expires:new Date('2018-07-06'),
  //     httpOnly:false,
  //     overwrite:false
  //   })
  // })
  // 错误处理中间件, 洋葱最外层
  app.use(async (ctx, next)=>{
    try {
      await next()
    } catch (error) {
      ctx.response.status = error.statusCode || error.status || 500
      ctx.response.body = {
        message: error.message
      };
      // 手动释放error事件
      ctx.app.emit('error', err, ctx)
    }
  })
  // 全局错误监听
  app.on('error', (error, ctx) => {
    console.log('错误信息: ' + error)
    // ctx.redirect('/500.httml')
  })
  // catch 404 and forward to error handler
  // app.use((req, res, next) => {
  //   const err = new Error('Not Found');
  //   err['status'] = 404;
  //   next(err);
  // });
  // // error handlers
  // app.use((err, req, res, next) => {
  //   /**
  //    * Handle 401 thrown by express-jwt library
  //    */
  //   if (err.name === 'UnauthorizedError') {
  //     return res
  //       .status(err.status)
  //       .send({ message: err.message })
  //       .end();
  //   }
  //   return next(err);
  // });
  // app.use((err, req, res, next) => {
  //   res.status(err.status || 500);
  //   res.json({
  //     errors: {
  //       message: err.message,
  //     },
  //   });
  // });
}