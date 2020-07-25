const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basePathG = path.join(__dirname, '../models')
let files = fs.readdirSync(basePathG)
const config = require('../config')
const logger = require('./logUtil')('mysql')
var email = require('./email.js')
class MysqlUtil {
  constructor () {
    this.sequelize = {}
    this.models = {}
    this.initSequelize()      // 初始化
  }
  /**
    * 初始化 sequelize mysql链接
  */
  initSequelize () {
    this.sequelize = new Sequelize({
      host: config.mysql.host,
      database: config.mysql.database,
      username: config.mysql.user,
      password: config.mysql.password,
      dialect: 'mysql',
      define: {
        timestamps: false,       // 开启时间戳 create_at delete_at update_at
        paranoid: true,          // 开启假删除
        underscored: false,      // 下划线
        charset: 'utf8',
        freezeTableName: true    // 固定表名为单数  默认表名是xxxs
      },
      pool: {
        // 连接池的一些相关配置
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      // true会在控制台打印每次sequelize操作时对应的SQL命令
      logging: (msg) => logger.info(msg)         // 使用自定义记录器(Winston), 显示第一个参数
    })
    files.forEach((file) => {
      let name = file.substr(0, file.length - 3)
      name = name.substring(0, 1).toUpperCase() + name.substring(1)   //首字母大写
      this.models[name] = require(basePathG + `/${file}`)(this.sequelize, Sequelize)
    })
    // mysql连接监控
    this.sequelize.authenticate().then(() => {
      logger.info("mysql connect start!")
    }).catch(err => {
      logger.error("Unable to connect to the database:", JSON.stringify(err))
      email.sendEmail('1213976107@qq.com', 'mysql-error', "1213976107@qq.com",
        'Mysql 连接失败', '<p>错误信息: </p>' + JSON.stringify(err) + '<p>请你及时处理</p >'
      ).then(() => {
        logger.info("mysql错误邮箱提示发送成功！")
      }).catch(er => {
        logger.error("mysql错误邮箱提示发送失败！", er)
      })
    })
  }
  /**
   * 获取 this.sequelize 方便后续使用
  */
  getDB () {
    return this.sequelize
  }
  /**
   * 获取models
  */
  getMmodels () {
    return this.models
  }
  /**
   * 原生sql查询
   * @param sql sql语句
  */
  query (sql) {
    return new Promise((resolve, reject) => {
      this.getDB().query(sql, { raw: true, type: this.sequelize.QueryTypes.SELECT })
      .then(projects => {
        resolve(projects)
      })
    })
  }
}
module.exports = new MysqlUtil()