const koasLoader = require('./koa')
const mysqlUtil = require('../utils/mysqlUtil')
const logger = require('../utils/logUtil')('koasLoader')
module.exports = async(koaApp) => {
  console.log('loaders 入口')
  // let sequelize = await mysql();                                        // mysql链接
  // sequelize.query('SELECT * FROM `user`', { raw: true, type: sequelize.QueryTypes.SELECT })
  // .then(projects => {
  //   console.log(projects[0].user_name)
  // })
  await koasLoader(koaApp);                    // koa加载器
  logger.info('koa loaded!');
};
