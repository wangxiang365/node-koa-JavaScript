import axios from 'axios'
import router from '../../router'

// http request 拦截器
axios.interceptors.request.use(config => {
  // let userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO')) || {}
  /**
   * 请求发出前,在接口后面拼接参数
   */
  // let params = (config.url.indexOf('?') === -1 ? '?' : '&') + 'belongSystem=9&token=' + (userInfo.token ? userInfo.token : '')
  // if (config.url.indexOf('token') === -1) {
  //   config.url = config.url + params
  // }
  return config
}, error => {
  return Promise.reject(error)
})
// http response 拦截器
axios.interceptors.response.use(res => {
  let resData = res.data
  if (parseInt(resData.status) === 9997) {                                       // 登录超时 - 返回登录
    localStorage.setItem('REDIRECT_URL', router.currentRoute.fullPath)           // 保存页面重定向url
    router.replace({
      path: '/login'
    })
  }
  return res
}, error => {
  return Promise.reject(error)
})
