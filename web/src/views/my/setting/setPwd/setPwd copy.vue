<template>
  <div class="modifyPhone-wrap">
      <ul>
        <li @click="$router.push('/my/setting/resetLoginPwd')">
          <div>重置登录密码</div>
          <van-icon name="arrow" />
        </li>
        <li @click="setPayPwd">
          <div>重置支付密码</div>
          <van-icon name="arrow" />
        </li>
      </ul>
      <van-button type="primary" class="unverified-btn" @click="$router.back()">返回</van-button>
      <!-- 密码、键盘框弹窗 -->
      <numberKeyboard :show="showPasswordPop" @finish="finish" @close="showPasswordPop = false"></numberKeyboard>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Icon, Button, Popup, Area, ActionSheet, Toast } from 'vant'
import numberKeyboard from '../../../../components/numberKeyboard'
export default {
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Area.name]: Area,
    [ActionSheet.name]: ActionSheet,
    numberKeyboard,
    [Toast.name]: Toast
  },
  data () {
    return {
      showPasswordPop: false,
      userInfo: {},
      isPayPasswordSte: ''                 // 是否设置密码状态
    }
  },
  mounted: function () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
    this.isSetPaymentPassword()            // 是否设置的支付密码
  },
  computed: {
    ...mapState(['personalData'])
  },
  methods: {
    /**
     * 校验支付密码是否正确
    */
    checkPassword (val) {
      return new Promise((resolve, reject) => {
        this.$http.post(this.api.checkPassword, {
          id: this.userInfo.userId,
          paymentPassword: val
        }).then((res) => {
          let resData = res.data
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            resolve(resData)
            return
          }
          this.$toast(resData.msg)
        })
      })
    },
    /**
     * 获取是否设置支付密码
    */
    isSetPaymentPassword () {
      this.$http.get(this.api.isSetPayPassword).then((res) => {
        let resData = res.data
        if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
          this.isPayPasswordSte = resData.data
        }
      })
    },
    /**
     * 输入完成
    */
    async finish (val) {
      let result = await this.checkPassword(val)
      if (parseInt(result.status) === 1) {
        this.showPasswordPop = false
        this.$router.push('/my/setting/resetPayPwd')
      }
    },
    /**
     * 设置支付密码
    */
    setPayPwd () {
      if (this.personalData.cardStatus) {              // 未实名认证
        localStorage.setItem('redirectUrl', '/my/setting')                   // 进入实名认证源
        this.$router.push('/my/setting/realNameAuth')
        this.showPasswordPop = true
      } else {                                         // 已实名认证
        this.showPasswordPop = true
      }
    }
  }
}
</script>
<style lang=less>
  .modifyPhone-wrap{
    height: calc(100vh);
    overflow: auto;
    background: #1c1e3a;
    ul {
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
        .getCode{
          width:159px;
          height:51px;
          line-height: 51px;
          border: none;
          background:rgba(105,129,251,1);
          border-radius:10px;
          cursor: pointer;
          &.disabled{
            background: #ccc;
          }
        }
      }
    }
    .unverified-btn{
      width: 622px;
      height: 81px;
      line-height: 0.81rem;
      background: #6981fb;
      border-radius: 0.1rem;
      font-size: 0.28rem;
      border: none;
      margin: 0 auto;
      cursor: pointer;
      margin-top: 41px;
    }
    .tip{
      font-size: 24px;
      color: rgba(126, 127, 155, 1);
      margin-top: 18px;
      text-align: left;
      margin-left: 68px;
    }
  }
</style>
