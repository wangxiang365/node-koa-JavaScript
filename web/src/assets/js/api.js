let baseUrl, paySuccessUrl, appid
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://192.168.31.82:8081/nodeapi/'
} else if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_TITLE === 'testing') {
    baseUrl = 'http://pay.py-link.com/lzwlbehindpoints/'
    paySuccessUrl = 'pay.py-link.com'
    appid = 'wx7912b6aa135b6df5'   // 测试
  } else {
    baseUrl = 'https://www.lzmalls.cn/lzwlbehindpoints/'
    paySuccessUrl = 'www.lzmalls.cn'
    appid = 'wx4b3d7441eec24625'  // 正式
    // baseUrl = 'http://pay.py-link.com/lzwlbehindpoints/'
    // paySuccessUrl = 'pay.py-link.com'
    // appid = 'wx7912b6aa135b6df5'   // 测试
  }
}
export default {
  baseUrl: baseUrl,                                                                                           // 域名地址
  ERR_OK: '1',                                                                                                // 请求成功状态码
  login: `${baseUrl}auth/signup`,                                                                             // 登录
  paySuccessUrl: paySuccessUrl,                                                                               // 支付成功页面
  appid: appid,                                                                                               // appid
  logout: `${baseUrl}login/logout`,                                                                           // 退出登录
  register: `${baseUrl}login/register`,                                                                       // 注册
  getInvicationCodeByPhone: `${baseUrl}login/getInvicationCodeByPhone`,                                       // 根据手机号获取邀请码
  isRegister: `${baseUrl}login/checkPhoneExist`,                                                              // 判断是否重复注册
  checkInvicationCode: `${baseUrl}login/checkInvicationCode`,
  checkInvitCode: `${baseUrl}login/getInvitationInfo`,                                                        // 校验邀请码
  personalInfo: `${baseUrl}accountSetController/viewUser`,                                                    // 获取个人信息
  checkVerifyCode: `${baseUrl}login/checkVerifyCode`,                                                         // 校验验证码
  getValidWord: `${baseUrl}accountSetController/getValidWord`,                                                // 获取登录的验证码
  updatePass: `${baseUrl}accountSetController/updatePass`,                                                    // 修改密码
  resetPassword: `${baseUrl}login/resetPassword`,                                                             // 重置登录密码
  isSetPayPassword: `${baseUrl}offlinePay/isSetPaymentPassword`,                                              // 判断是否设置了交易密码
  setPayPassword: `${baseUrl}accountSetController/setPaymentPassword`,                                        // 设置支付密码
  resetPayPassword: `${baseUrl}accountSetController/updatePaymentPassword`,                                   // 重置支付密码
  checkPassword: `${baseUrl}accountSetController/checkPaymentPassword`,                                       // 校验支付密码
  getSetMealIndex: `${baseUrl}points/setMeal/getSetMealIndex`,                                                // 首页套餐列表
  getSetMealwhetherNeetGift: `${baseUrl}points/setMeal/getSetMealwhetherNeetGift`,                            // 是否需要先购买关联的套餐
  getSetMealDetails: `${baseUrl}points/setMeal/getSetMealDetails`,                                            // 套餐详情页
  addSetMealOrder: `${baseUrl}points/setMeal/addSetMealOrder`,                                                // 添加套餐订单
  getSetMealOrderList: `${baseUrl}points/setMeal/getSetMealOrderList`,                                        // 订单列表
  confirmRecieveGoods: `${baseUrl}points/setMeal/confirmRecieveGoods`,                                        // 确认收货
  closeGoods: `${baseUrl}points/setMeal/closeGoods`,                                                          // 关闭订单
  cancelOrder: `${baseUrl}points/setMeal/alreadyCancelSetMealOrder`,                                          // 取消订单
  getRecommendRelationList: `${baseUrl}points/recommend/getRecommendRelationList`,                            // 我的推荐列表
  getRecommendCountTotal: `${baseUrl}points/recommend/getRecommendCountTotal`,                                // 我的推荐、团队统计
  getMemberPointsDetailList: `${baseUrl}points/achievement/getMemberPointsDetailList`,                        // 我的收益列表
  getMemberPointsDetaiNum: `${baseUrl}points/achievement/getMemberPointsDetaiNum`,                            // 我的收益-余额
  getSysDictionaryList: `${baseUrl}points/dictionary/getSysDictionaryList`,                                   // 引起资金账户变动的明细类别
  getOrderAchievementForUmbrella: `${baseUrl}points/achievement/getOrderAchievementForUmbrella`,              // 业绩统计-列表
  getOrderAchievementForUmbrellaSum: `${baseUrl}points/achievement/getOrderAchievementForUmbrellaSum`,        // 业绩统计-总数
  updatePhone: `${baseUrl}points/accountSetController/updatePhone`,                                           // 修改手机号
  saveUser: `${baseUrl}accountSetController/saveUser`,                                                        // 修改用户信息
  validCard: `${baseUrl}accountSetController/validCard`,                                                      // 实名认证
  getCardList: `${baseUrl}points/card/getCardList`,                                                           // 获取银行卡列表
  delCard: `${baseUrl}points/card/delCard`,                                                                   // 删除银行卡
  saveCard: `${baseUrl}points/card/saveCard`,                                                                 // 保存银行卡
  saveAlipay: `${baseUrl}points/card/saveAlipay`,                                                             // 保存支付宝
  getSettleSet: `${baseUrl}points/disWithdrawalManageController/getWithdrawalSetting`,                        // 提现比例
  getWithdrawalCycleNumber: `${baseUrl}points/disWithdrawalManageController/getWithdrawalCycleNumber`,        // 用户周期内提现次数
  getInfomationList: `${baseUrl}points/info/getInfomationList`,                                               // 消息列表
  getMemberCashPointsAndcoupon: `${baseUrl}points/setMeal/getMemberCashPointsAndcoupon`,                      // 会员余额
  getMemberCouponList: `${baseUrl}points/setMeal/getMemberCouponList`,                                        // 代金券列表
  deleteMemberCoupon: `${baseUrl}points/setMeal/deleteMemberCoupon`,                                          // 删除代金券
  withdrawalApply: `${baseUrl}points/disWithdrawalManageController/withdrawalApply`,                          // 提现申请
  getOrderAmount: `${baseUrl}points/setMeal/getSetMealOrderByOrderAmount`,                                    // 获取支付金额
  aliPay: `${baseUrl}aliPay/pay`,                                                                             // 支付宝支付
  wxPay: `${baseUrl}wxPay/pay`,                                                                               // 微信支付
  unbindWechat: `${baseUrl}points/card/unbindWechat`,                                                          // 解绑微信授权
  unbindAlipay: `${baseUrl}points/card/unbindAlipay`                                                          // 解绑支付宝
}
