
const emptyTips = '--'            // 为空显示
const dateFns = require('date-fns')
let money = (v, isThousand, isW) => {                                                     // 金额过滤
  if (!v && v !== 0) return 0
  if (isW) {
    return parseFloat(v) >= 10000 ? (v / 10000).toFixed(1) + '万' : (v * 100 / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  } if (isThousand) { // 千分位并保留两位小数)
    return (v * 100 / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  } else { // 正常保留两位小数
    return (v * 100 / 100).toFixed(2)
  }
}
let thousandBit = (v) => {                                                          // 千分位
  if ((!v && v !== 0) || v === 0) return 0
  return v.toString().replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
}
let filterPhone = (val) => {                                                       // 手机号码过滤
  if (!val) return emptyTips
  return val.toString().replace(/(.{3}).*(.{3})/, '$1*****$2')
}
let orderStatus = (v) => {                                                          // 订单状态过滤  1待付款 2 待发货 3 待收货 4 待评价 5已完成 6平台关闭 7 取消订单
  let statusArr = ['付款', '催单', '确认收货', '评价', '关闭', '平台关闭', '已取消']
  return statusArr[v - 1]
}
let filterCard = (val) => {                                                          // 身份证号码过滤
  if (!val) return emptyTips
  return val.toString().replace(/(.{2}).*(.{2})/, '$1************$2')
}

let sexStatusFilter = (v) => {                                                       // 性别过滤
  let statusArr = ['男', '女']
  return statusArr[Number(v - 1)]
}
let idcardIsPassFilter = (v) => {                                                    // 身份是否认证
  let statusArr = ['已认证', '未认证']
  return statusArr[v]
}
let filterName = (val) => {                                                          // 姓名只留一个汉字过滤
  if (!val) return emptyTips
  var name = ''
  for (var i = 0; i < val.length - 1; i++) {
    name += '*'
  }
  return val.replace(/(.{1}).*(.{0})/, '$1' + name)
}

let cardNoFilter = (val) => {                                                         // 银行卡过滤
  if (!val) return emptyTips
  return val.replace(/(\d{4})\d{1,}(\d{4})/, '$1  ****  ****  $2')
}

let cardTypeFilter = (v) => {                                                         // 银行卡类型
  // if (!v) return '未认证'
  let statusArr = ['储蓄卡', '借记卡']
  return statusArr[v - 1]
}
let filterEmpty = (value, unit = '') => {                                             // 校验是否为空
  if (!value) return emptyTips
  return value + unit
}
let filterDateTime = (date) => {                                                       // 时间格式化
  var tt = new Date(parseInt(date))
  var days = parseInt((new Date().getTime() - date) / 86400000)
  var today = new Date().getDate()
  // var year = tt.getFullYear()
  // var mouth = tt.getMonth() + 1
  var day = tt.getDate()
  var time = tt.getHours() < 10 ? '0' + tt.getHours() : tt.getHours()
  var min = tt.getMinutes() < 10 ? '0' + tt.getMinutes() : tt.getMinutes()
  var result
  var offset
  offset = Math.abs(today - day)
  if (days < 2 && offset < 2) {
    if (offset === 0) {
      result = '今天' + time + ':' + min
    } else if (offset === 1) {
      result = '昨天' + time + ':' + min
    }
    return result
  } else {
    return filterDate(date, 'YYYY-MM-DD')
  }
}
let filterDate = (value, type) => {
  if (!value) return emptyTips
  let filterType = type || 'YYYY-MM-DD HH:mm:ss'
  return dateFns.format(parseInt(value), filterType)
}
let integralSourceFilter = (val) => {                                                     // 积分来源
  let statusArr = [
    {
      code: 101,
      val: '推荐奖'
    },
    {
      code: 102,
      val: '大使管理奖'
    },
    {
      code: 103,
      val: '区域管理奖'
    },
    {
      code: 104,
      val: '市级管理奖'
    },
    {
      code: 105,
      val: '跨区管理奖'
    },
    {
      code: 106,
      val: '大使提货奖'
    },
    {
      code: 107,
      val: '区县提货奖'
    },
    {
      code: 108,
      val: '市级提货奖'
    },
    {
      code: 109,
      val: '跨区提货奖'
    },
    {
      code: 15,
      val: '提现'
    },
    {
      code: 41,
      val: '提现回退'
    }
  ]
  var res = statusArr.filter(row => row.code === val)
  return res[0] ? res[0].val : '--'
}
export {
  money,
  filterPhone,
  orderStatus,
  filterCard,
  thousandBit,
  sexStatusFilter,
  idcardIsPassFilter,
  filterName,
  cardNoFilter,
  cardTypeFilter,
  filterEmpty,
  filterDateTime,
  filterDate,
  integralSourceFilter
}
