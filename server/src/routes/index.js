const Router = require('koa-router')
const config = require('../config')
const auth = require('../api/auth')
const router = new Router({
  prefix: config.api.prefix
})

// module.exports = (app) => {
// 	app.use(config.api.prefix, auth.routes()).use(auth.allowedMethods())
// }

// 引入自动引入插件
// const requireDirectory = require('require-directory')
// module.exports = (app) => {
// 	requireDirectory(module, './api', { visit: (obj) => {
// 		if (obj instanceof Router) {
// 			// app.use(config.api.prefix, obj.routes(), obj.allowedMethods())
// 			router.use(obj.routes(), obj.allowedMethods())
// 		}
// 	}})
// }
router.use(auth.routes())
module.exports = router;
