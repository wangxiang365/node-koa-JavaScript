<template>
  <div class="pay-wrap">
    <div class="amount">
      <p>支付金额</p>
      <p>{{orderAmount | money}}元</p>
      <p>待支付</p>
    </div>
    <div class="pay-bg"></div>
    <!-- 支付方式 -->
    <div class="way">
      <h2>请选择支付方式</h2>
      <ul>
        <template v-for="(item, key) in payList">
          <li v-if="item.isShow" :key="key" @click="selectedPayFun(item, key)">
            <div>
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#' + item.icon"></use>
              </svg>
            </div>
            <div>{{item.name}}</div>
            <svg class="icon" aria-hidden="true" v-if="key === currentPayType">
              <use xlink:href="#iconiconfontoptionbutton"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#iconradio2"></use>
            </svg>
          </li>
        </template>
      </ul>
    </div>
    <van-button type="primary" class="pay-btn" @click="goPay">
      确认支付 ¥{{orderAmount | money}}
    </van-button>
  </div>
</template>
<script>
import { Button, Toast } from 'vant'
import {wexinPay} from '../../assets/js/wxpay'
export default {
  components: {
    [Button.name]: Button,
    [Toast.name]: Toast
  },
  data () {
    return {
      payList: {                             // 支付方式列表
        weChat: {
          icon: 'iconweixinzhifu',
          name: '微信',
          isDisabled: false,
          isShow: true
        },
        aliPay: {
          icon: 'iconiconzhi01',
          name: '支付宝',
          isDisabled: false,
          isShow: true
        }
      },
      currentPayType: 'weChat',              // 选择的支付方式
      token: '',                             // token
      orderAmount: '',                        // 订单金额
      orderNo: '',                           // 订单号
      orderId: ''                            // 订单号
    }
  },
  mounted: function () {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') > -1) {
      this.payList.aliPay.isShow = false
    } else {
      this.payList.aliPay.isShow = true
    }
    // this.orderNo = this.$route.query.orderNo
    this.token = JSON.parse(localStorage.getItem('LZWLUSERINFO')).token
    this.orderNo = localStorage.getItem('orderNo')                                 // 订单orderNo
    this.orderId = localStorage.getItem('orderId')                                 // 订单orderId
    this.orderAmount = localStorage.getItem('orderAmount')
    // 授权后自动支付
    if (!this.$route.query.redirect && localStorage.getItem('PAYTYPE')) {
      this.isWeiXin()
    }
    // this.getPayAmount()
  },
  methods: {
    /**
     * 获取支付金额
    */
    async getPayAmount () {
      let result = await this.$http.get(this.api.getOrderAmount, {
        params: {
          orderId: this.orderId
        }
      })
      if (result.data.status === this.api.ERR_OK) {
        this.orderAmount = result.data.data
      }
    },
    /**
     * 判断是否是微信浏览器
    */
    isWeiXin () {
      localStorage.setItem('PAYTYPE', '1')
      var ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') > -1) {
        this.wechatPay()
      } else {
        this.wechatWebPay()
      }
    },
    /**
     * 微信web支付
    */
    wechatWebPay () {
      this.$http.post(this.api.wxPay, {
        orderNo: this.orderNo,
        clientType: 2
      }).then((res) => {
        this.$toast(res.data.msg)
        if (res.data.status === this.api.ERR_OK) {
          window.location.href = `${res.data.data.mweb_url}&redirect_url=${window.location.protocol.split(':')[0]}%3A%2F%2F${this.api.paySuccessUrl}%2Flzwl-points%2Fpay%2FpaySuccess`
          localStorage.removeItem('PAYTYPE')
        }
      })
    },
    /**
     * 微信内部支付
    */
    wechatPay () {
      this.$http.post(this.api.wxPay, {
        orderNo: this.orderNo,
        clientType: 1
      }).then((res) => {
        let resData = res.data
        if (!resData.status) {
          this.$toast(resData.status)
        }
        if (resData.status === this.api.ERR_OK) {
          wexinPay(resData.data)
        } else if (parseInt(resData.status) === 302) {
          // 授权
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.api.appid}&redirect_uri=${window.location.protocol.split(':')[0]}%3A%2F%2F${this.api.paySuccessUrl}%2Flzwlbehindpoints%2FwxAuthor%2Fdefault&response_type=code&scope=snsapi_base&state=${this.token}&connect_redirect=1#wechat_redirect`
        }
      })
    },
    /**
     * 支付宝支付
    */
    aliPay () {
      window.open(`${this.api.aliPay}?orderNo=${this.orderNo}&clientType=1&token=${this.token}`)
    },
    /**
     * 选择支付方式
    */
    selectedPayFun (val, key) {
      if (val.isDisabled) {
        this.$toast('订单不支持此方式支付')
        return false
      }
      this.currentPayType = key
    },
    /**
     * 立即支付
    */
    goPay () {
      if (this.currentPayType === 'weChat') {
        // this.isWeiXin()
        localStorage.setItem('PAYTYPE', '1')
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.api.appid}&redirect_uri=${window.location.protocol.split(':')[0]}%3A%2F%2F${this.api.paySuccessUrl}%2Flzwlbehindpoints%2FwxAuthor%2Fdefault&response_type=code&scope=snsapi_base&state=${this.token}&connect_redirect=1#wechat_redirect`
      } if (this.currentPayType === 'aliPay') {
        this.aliPay()
      }
    }
  }
}
</script>
<style lang=less>
  .pay-wrap{
    height: calc(100vh);
    overflow: auto;
    background: #1C1E3A;
    .amount {
      width:750px;
      height:314px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #fff;
      background:#2A3154;
      p{
        &:nth-child(1){
          font-size: 28px;
        }
        &:nth-child(2){
          font-size: 60px;
          margin: 15px 0;
        }
        &:nth-child(3){
          font-size: 28px;
          color: #DFE2F4;
        }
      }
    }
    .pay-bg{
      width: 100%;
      height: 19px;
      background: url('../../assets/images/pay-bg.png') no-repeat;
      background-size: 100% 100%;
    }
    .way{
      h2{
        font-size: 26px;
        color: #fff;
        text-align: left;
        margin: 36px 0 36px 31px;
      }
      ul{
        li{
          height: 124px;
          display: flex;
          align-items: center;
          margin: 0 17px;
          padding: 0 14px;
          background: none;
          text-align: left;
          box-sizing: border-box;
          /* margin: 0 auto; */
          margin-bottom: 25px;
          font-size: 36px;
          color: #fff;
          cursor: pointer;
          border-bottom: 1px solid #D2D2D2;
          div:nth-child(1){
            margin-right: 45px;
            svg{
              width: 57px;
              height: 49px;
              display: block;
            }
          }
          div:nth-child(2){
            flex: 1;
          }
          svg{
            width: 44px;
            height: 44px;
          }
        }
      }
    }
    .pay-btn{
      width:683px;
      height:81px;
      margin: 0 auto;
      margin-top: 50px;
      border: none;
      background:rgba(105,129,251,1);
      border-radius:10px;
      .van-button__text{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
      }
      svg{
        width: 40px;
        height: 40px;
        margin-right: 21px;
      }
    }
  }
</style>
