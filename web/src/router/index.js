import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../vuex/store'
import { Toast } from 'vant'
import goodsDetail from '@/views/goodsDetail/goodsDetail'
import index from '@/views/index'
import message from '@/views/message/message'
import order from '@/views/order/order'
import my from '@/views/my/my'
import pay from '@/views/pay/pay'
Vue.use(Toast)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/bootPage'
  },
  {
    path: '/bootPage',
    name: 'bootPage',
    meta: { title: '亮知物联', isShowFooter: false },
    component: r => require(['@/views/bootPage/bootPage'], r)
  },
  {
    path: '/index',
    name: 'index',
    meta: { title: '亮知物联', isShowFooter: true },
    component: index
  },
  {
    path: '/goodsDetail',
    name: 'goodsDetail',
    meta: { title: '详情', isShowFooter: false },
    component: goodsDetail
  },
  {
    path: '/message',
    name: 'message',
    meta: { title: '消息', isShowFooter: true },
    component: message
  },
  {
    path: '/order',
    name: 'order',
    meta: { title: '订单', isShowFooter: true, isLogin: true },
    component: order
  },
  {
    path: '',
    name: '',
    component: () => import('@/views/my/layout'),
    redirect: '/my',
    children: [
      {
        path: '/my',
        name: 'my',
        meta: { title: '我的', isShowFooter: true, isLogin: true },
        component: my
      },
      {
        path: '/my/setting',
        name: 'setting',
        meta: { title: '设置', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/setting')
      },
      {
        path: '/my/setting/realNameAuth',
        name: 'realNameAuth',
        meta: { title: '实名认证', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/realNameAuth/realNameAuth')
      },
      {
        path: '/my/setting/setPwd',
        name: 'setPwd',
        meta: { title: '密码设置', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/setPwd/setPwd')
      },
      {
        path: '/my/setting/resetLoginPwd',
        name: 'resetLoginPwd',
        meta: { title: '重置登录密码', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/setPwd/resetLoginPwd')
      },
      {
        path: '/my/setting/resetPayPwd',
        name: 'resetPayPwd',
        meta: { title: '重置支付密码', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/setPwd/resetPayPwd')
      },
      {
        path: '/my/setting/bankCard',
        name: 'bankCard',
        meta: { title: '银行卡', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/bankCard/cardList')
      },
      {
        path: '/my/setting/addAlipay',
        name: 'addAlipay',
        meta: { title: '添加支付宝', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/addAlipay/addAlipay')
      },
      {
        path: 'bindWeChat',
        name: 'bindWeChat',
        meta: { title: '绑定微信', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/bindWeChat/bindWeChat')
      },
      {
        path: '/my/setting/addBankCard',
        name: 'addBankCard',
        meta: { title: '添加银行卡', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/bankCard/addBankCard/addBankCard')
      },
      {
        path: '/my/setting/modifyName',
        name: 'modifyName',
        meta: { title: '修改用户名', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/modifyName/modifyName')
      },
      {
        path: '/my/setting/modifyPhone',
        name: 'modifyPhone',
        meta: { title: '修改手机号', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/setting/modifyPhone/modifyPhone')
      },
      {
        path: '/my/myReferrals',
        name: 'myReferrals',
        meta: { title: '我的推荐', isShowFooter: true, isLogin: true },
        component: () => import('@/views/my/myReferrals/myReferrals')
      },
      {
        path: '/my/teamManage',
        name: 'teamManage',
        meta: { title: '团队管理', isShowFooter: true, isLogin: true },
        component: () => import('@/views/my/teamManage/teamManage')
      },
      {
        path: '/my/performanceStatistics',
        name: 'performanceStatistics',
        meta: { title: '业绩统计', isShowFooter: true, isLogin: true },
        component: () => import('@/views/my/performanceStatistics/performanceStatistics')
      },
      {
        path: '/my/myIncome',
        name: 'myIncome',
        meta: { title: '我的收益', isShowFooter: true, isLogin: true },
        component: () => import('@/views/my/myIncome/myIncome')
      },
      {
        path: '/my/cashCoupon',
        name: 'cashCoupon',
        meta: { title: '代金券', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/cashCoupon/cashCoupon')
      },
      {
        path: '/my/cashWithdrawal',
        name: 'cashWithdrawal',
        meta: { title: '提现', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/cashWithdrawal/cashWithdrawal')
      },
      {
        path: '/my/cashWithdrawalSuccess',
        name: 'cashWithdrawalSuccess',
        meta: { title: '申请成功', isShowFooter: false, isLogin: true },
        component: () => import('@/views/my/cashWithdrawal/cashWithdrawalSuccess')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录', isShowFooter: false },
    component: () => import('@/views/login')
  },
  {
    path: '/register',
    name: 'register',
    meta: { title: '注册', isShowFooter: false },
    component: () => import('@/views/register')
  },
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    meta: { title: '找回登录密码', isShowFooter: false },
    component: () => import('@/views/forgotPassword/forgotPassword')
  },
  {
    path: '/forgotPayPassword',
    name: 'forgotPayPassword',
    meta: { title: '找回支付密码', isShowFooter: false },
    component: () => import('@/views/forgotPayPassword/forgotPayPassword')
  },
  {
    path: '/pay/orderPay',
    name: 'pay',
    meta: { title: '支付', isShowFooter: false, isLogin: true },
    component: pay
  },
  {
    path: '/pay/paySuccess',
    name: 'paySuccess',
    meta: { title: '支付成功', isShowFooter: false, isLogin: true },
    component: () => import('@/views/pay/paySuccess')
  }
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  // 匹配路由是否404
  if (to.matched.length === 0) {
    from.path && from.path !== '/' ? next({path: from.path}) : next('/index')
  } else {
    next()
  }
  if (to.path.indexOf('/my') > -1 || to.path === '/forgotPayPassword' || to.path === '/bindWeChat') {
    let personalData =  await Vue.prototype.$utils.getUserInfo()
    store.dispatch('setPersonalData', personalData)
  }
  Toast.clear()                                                                      // 全局清除系统toast loading
  if (to.meta.isLogin) {                                                             // 判断该路由是否需要登录权限
    var userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
    if (!userInfo || !userInfo.token) {                                              // 通过localStorage获取当前的token是否存在
      localStorage.setItem('REDIRECT_URL', router.currentRoute.fullPath)             // 保存页面重定向url
      router.push({
        path: '/login'
      })
      return false
    } else {
      next()
    }
  } else {
    next()
  }
  next()
})
/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
// router.onError((error) => {
//   const pattern = /Loading chunk/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   const targetPath = router.history.pending.fullPath
//   if (isChunkLoadFailed && error.type === 'missing') {
//     router.replace(targetPath)
//   }
// })
export default router
