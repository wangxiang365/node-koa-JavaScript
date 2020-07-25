<template>
  <div class="pay-wrap">
    <ul class="amount">
      <li>
        <div>支付金额</div>
        <div></div>
      </li>
      <li>
        <div>待支付：<span>{{orderAmount | money}}</span></div>
        <div></div>
      </li>
    </ul>
    <!-- 支付方式 -->
    <div class="way">
      <ul>
        <li @click="isWeiXin">
          <div>
            <img src="../../assets/images/wechat.png">
          </div>
          <div>微信</div>
        </li>
        <li @click="aliPay" v-if="showAliPay">
          <div>
            <img src="../../assets/images/alipay.png">
          </div>
          <div>支付宝</div>
        </li>
      </ul>
    </div>
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
      showAliPay: false,                     // 是否显示支付宝支付
      token: '',                             // token
      orderAmount: 0,                        // 订单金额
      orderNo: '',                           // 订单号
      orderId: ''                            // 订单号
    }
  },
  mounted: function () {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') > -1) {
      this.showAliPay = false
    } else {
      this.showAliPay = true
    }
    // this.orderNo = this.$route.query.orderNo
    this.token = JSON.parse(localStorage.getItem('LZWLUSERINFO')).token
    this.orderNo = localStorage.getItem('orderNo')                                 // 订单orderNo
    this.orderId = localStorage.getItem('orderId')                                 // 订单orderId
    // this.orderAmount = localStorage.getItem('orderAmount')
    // 授权后自动支付
    if (!this.$route.query.redirect && localStorage.getItem('PAYTYPE')) {
      this.isWeiXin()
    }
    this.getPayAmount()
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
        // this.wechatPay()
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
          window.location.href = res.data.data.mweb_url + '&redirect_url=https%3A%2F%2F' + this.api.paySuccessUrl + '%2Flzwl-points%2Fpay%2FpaySuccess'
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
        if (resData.status !== this.api.ERR_OK) {
          this.$toast(resData.msg)
        }
        if (resData.status === this.api.ERR_OK) {
          wexinPay(resData.data)
        } else if (parseInt(resData.status) === 302) {
          // 授权
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4b3d7441eec24625&redirect_uri=https%3A%2F%2F${this.api.paySuccessUrl}%2Flzwlbehindpoints%2FwxAuthor%2Fdefault&response_type=code&scope=snsapi_base&state=${this.token}&connect_redirect=1#wechat_redirect`
        }
      })
    },
    /**
     * 支付宝支付
    */
    aliPay () {
      window.open(`${this.api.aliPay}?orderNo=${this.orderNo}&clientType=1&token=${this.token}`)
    }
  }
}
</script>
<style lang=less>
  .pay-wrap{
    height: calc(100vh);
    overflow: auto;
    background: #1c1e3a;
    .amount {
      width: 700px;
      margin: 34px auto;
      background: rgba(42, 49, 84, 0.6);
      padding: 0 40px;
      box-sizing: border-box;
      li{
        text-align: left;
        height: 95px;
        border-bottom:1px solid rgba(46, 46, 82, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28px;
        color: #fff;
        &:last-child{
          border:none;
        }
        .inp{
          flex: 1;
          input{
            width: 100%;
            height: 127px;
            box-sizing: border-box;
            background: none;
            outline: none;
            font-size: 28px;
            color: rgba(131, 132, 160, 1);
            padding-left: 50px;
            padding-right: 20px;
          }
        }
        span{
          color: #E12727;
        }
      }
    }
    .way{
      ul{
        li{
          width: 622px;
          height: 110px;
          display: flex;
          align-items: center;
          padding: 0 65px;
          background: #fff;
          text-align: left;
          box-sizing: border-box;
          margin: 0 auto;
          margin-bottom: 25px;
          border-radius:10px;
          font-size: 36px;
          color: #404040;
          cursor: pointer;
          div:nth-child(1){
            margin-right: 21px;
            img{
              width: 51px;
              height: 51px;
              display: block;
            }
          }
          div:nth-child(2){
            flex: 1;
          }
        }
      }
    }
  }
</style>
