const KoaBody = require('koa-body')
const jwt = require('koa-jwt')
const routes = require('../routes')
const config = require('../config')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
module.exports = async (app) => {
  app.use(bodyParser())
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
 app.on('error', (error, ctx) => {
   console.log('something error ' + JSON.stringify(ctx.onerror));
   ctx.redirect('/500.httml');
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