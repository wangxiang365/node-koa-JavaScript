const dotenv = require('dotenv')

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config({ path: process.env.NODE_ENV === 'development' ? '.devEnv' : '.proEnv' });    // 加载本地env配置 和 线上env配置
if (!envFound) {
  // This error should crash whole process
  throw new Error("Couldn't find .env file");
}
module.exports = {
  /**
   * mysql
  */
  mysql: {
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    connectionLimit: process.env.MYSQL_CONNECTLIMIT,
    multipleStatements: process.env.MYSQL_MULTP   // 允许多条sql同时执行
  },
  /**
   * redis
  */
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    db: process.env.REDIS_DB,
    password: process.env.REDIS_PWD,
    options: {
      return_buffers: process.env.REDIS_BUFFERS,
      auth_pass: process.env.REDIS_AUTH
    }
  },

  /**
   * 端口
  */
  port: parseInt(process.env.PORT, 10),

  /**
   * jwt key
  */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * winston logger
  */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
    logPath: './app_log/'
  },

  /**
   * API configs
  */
  api: {
    prefix: '/nodeapi',
  },

  /**
   * Mailgun email credentials
  */
  emails: {
    apiKey: 'API key from mailgun',
    domain: 'Domain Name from mailgun'
  },

  /**
   * socketioPath
  */
  socketioPath: '/testsocketiopath'
};
