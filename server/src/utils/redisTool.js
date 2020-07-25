const Redis = require('ioredis')
const config = require('../config')
class redisTool {
  constructor () {
    this.redis = new Redis(config.redis);
    this.redis.on('error', function (channel, message) {
      console.log('redis链接失败:', message, channel);
    })
  }
  // 获取redis值
  async get (key) {
    let data = await this.redis.get(key);
    return JSON.parse(data);
  }
  // 设置redis值
  async set (key, data, maxAge = 7 * 24 * 60 * 60 * 1000) {
    try {
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(key, JSON.stringify(data), 'EX', maxAge / 1000);
    } catch (e) {}
    return 'success';
  }
  // 删除redis值
  async destroy (key) {
    return await this.redis.del(key);
  }
}

module.exports = new redisTool();
