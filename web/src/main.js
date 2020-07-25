import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import './assets/css/common.less'                                      // 公共css
import './assets/js/common.js'                                         // 公共js
import * as utils from './assets/js/utils'                             // 工具函数
import axios from 'axios'                                              // 引入axios
import api from './assets/js/api'                                      // 配置api接口文件
import './assets/js/httpres'                                           // 配置axios请求拦截
import infiniteScroll from 'vue-infinite-scroll'                       // 无限加载
import * as filters from './filters/filters.js' // 全局过滤器
import { Toast } from 'vant'
Vue.use(require('vue-wechat-title'))
Vue.use(Toast)
Vue.prototype.api = api
Vue.prototype.$http = axios
Vue.prototype.$utils = utils
Vue.use(infiniteScroll)
/**
 * 全局过滤器
 */
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// require('promise.prototype.finally').shim()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
