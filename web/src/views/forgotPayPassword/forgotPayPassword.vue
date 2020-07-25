<template>
  <div class="forgotPassword-wrap">
    <!-- 第一步 -->
    <div class="firstStep" v-if="curStep===0">
      <div class="account">
        <p>发送<span>验证码</span>到您的手机号</p>
        <p>{{personalData.phone | filterPhone}}</p>
      </div>
      <van-button type="primary" class="btn" @click="secondStep">发送验证码</van-button>
    </div>
    <!-- 第二步 -->
    <sendCode v-if="curStep===1" :phone="personalData.phone" @next="thirdStep"></sendCode>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Checkbox, Button, Toast, Icon, Dialog } from 'vant'
import sendCode from '../../components/sendCode'
export default {
  components: {
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component,
    sendCode
  },
  data () {
    return {
      formData: {
        phone: '',                                            // 手机号码
        code: '',                                             // 验证码
        password: ''                                          // 密码
      },
      curStep: 0
    }
  },
  watch: {
  },
  mounted () {
  },
  computed: {
    ...mapState(['personalData'])
  },
  methods: {
    /**
     * 发送验证码
    */
    handleSendCode () {
      this.$http.post(this.api.getValidWord, {
        phone: this.personalData.phone
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) this.curStep = 1
        this.$toast(res.data.msg)
      })
    },
    /**
     * 第二步
    */
    async secondStep () {
      this.handleSendCode()                             // 发送验证码
    },
    /**
     * 第三步
    */
    thirdStep (val) {
      // 跳转到设置支付密码页面
      localStorage.setItem('redirectUrl', this.$route.query.redirect)               // 重定向url
      this.$router.replace('/my/setting/resetPayPwd')
    }
  }
}
</script>
<style lang="less">
.forgotPassword-wrap{
  height: calc(100vh);
  overflow: auto;
  background: #1c1e3a;
  // 第一步
  .firstStep{
    .account{
      padding: 200px 0;
      p{
        &:nth-child(1){
          font-size: 30px;
          color: #fff;
          span{
            color: #6981FB;
          }
        }
        &:nth-child(2){
          color: #6981FB;
          margin-top: 25px;
        }
      }
    }
    .btn{
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
  }
  // 第三步设置密码
  .set-pwd{
    .tit{
      padding-top: 30px;
      color: #fff;
      font-size: 26px;
    }
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
          }
        }
      }
    }
    .btn{
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
  }
}
</style>
