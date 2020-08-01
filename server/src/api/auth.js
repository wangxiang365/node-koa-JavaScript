const router = require("koa-router")()
var path = require('path')
const send = require('koa-send')
const AuthService = require('../services/auth')
const Joi = require('@hapi/joi')
const logger = require("../utils/logUtil")("router")
const redisTool = require('../utils/redisTool')
const uploadUtil = require('../utils/uploadUtil')
const mysqlUtil = require('../utils/mysqlUtil')
router.prefix('/auth')          // 用户路由前缀
// 注册
router.post('/signup', async (ctx, next) => {
  const schema = Joi.object({
    phone: Joi.string().min(11).max(11).required().error(new Error('请输入正确的手机号')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('请输入正确的密码'))
    // email: Joi.string().email()
  })
  // 请求参数校验
  // console.log(ctx.query.token)                     获取请求地址后面拼接参数
  // console.log(ctx.request.header.authorization)    获取 Request Headers中的字段
  const resError = schema.validate(ctx.request.body)
  if (resError.error) {
    ctx.body = {
      data: {
        code: 9997,
        msg: resError.error.message
      }
    }
    return
  }
  // 请求参数校验通过
  logger.info(`rsp|requestId=${ctx.requestId}|body=${ctx.body}`);
  let data = await redisTool.get('addddadddddddddssssss')
  let userInfo = await mysqlUtil.models.User.findOne({where: {user_name: '张丹'}})
  // console.log(await mysqlUtil.query(`select * from user where user_name = '张丹'`))    // 原生sql查询
  ctx.body = {
    data: {
      args: data,
      table: userInfo,
      code: -1,
      msg: 'signup成功！！！',
      ret: 0
    }
  }
})
//  文件上传
router.post('/upload', async (ctx, next) => {
  let res = await uploadUtil.upload(ctx.request.files)
  ctx.body = {
    data: {
      code: 1,
      ...res,
      msg: '上传成功'
    }
  }
})
//  文件下载
router.get('/download', async (ctx, next) => {
  let res = await uploadUtil.download(ctx)
  console.log(res)
})
// 获取用户列表
router.post('/getUserList', async (ctx, next) => {
  let {currentPage, pageSize} = ctx.request.body
  let userList = await mysqlUtil.models.Usesr.findAndCountAll({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    // distinct: true,    // 去重
    order: [
      ['create_time', 'DESC']
    ]
  }).then(res => {
    let result = {}
    result.data = res.rows
    result.totalCount = res.count
    result.pageCount = parseInt((res.count + pageSize - 1) / pageSize)
    return result
  })
  ctx.body = userList
})
// 登录
router.post('/signin', async () => {}
);

/**
 * @TODO Let's leave this as a place holder for now
 * The reason for a logout route could be deleting a 'push notification token'
 * so the device stops receiving push notifications after logout.
 *
 * Another use case for advance/enterprise apps, you can store a record of the jwt token
 * emitted for the session and add it to a black list.
 * It's really annoying to develop that but if you had to, please use Redis as your data store
 */
router.post('/logout', () => {
})
module.exports = router