<template>
  <div class="forgotPassword-wrap">
    <!-- 第一步 -->
    <div class="set-pwd" v-if="curStep===0">
      <div class="tit">请填写您要找回密码的账号</div>
      <ul>
        <li>
          <div class="inp">
            <input type="tel" placeholder="请输入手机号" v-model="formData.phone" maxlength="11">
          </div>
        </li>
      </ul>
      <van-button type="primary" class="btn" @click="secondStep">下一步</van-button>
    </div>
    <!-- 第二步 -->
    <sendCode v-if="curStep===1" :phone="formData.phone" @next="thirdStep"></sendCode>
    <!-- 第三步 -->
    <div class="set-pwd" v-if="curStep===2">
      <div class="tit">请为您的账号{{formData.phone}}设置一个新密码</div>
      <ul>
        <li>
          <div class="inp">
            <input type="password" placeholder="6-20个字符" v-model="formData.password">
          </div>
        </li>
      </ul>
      <van-button type="primary" class="btn" @click="handleSavePassword">保存新密码</van-button>
    </div>
  </div>
</template>

<script>
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
  methods: {
    /**
     * 发送验证码
    */
    handleSendCode () {
      if (!this.formData.phone.match(/^1\d{10}$/)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      this.$http.post(this.api.getValidWord, {
        phone: this.formData.phone
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) this.curStep = 1
        this.$toast(res.data.msg)
      })
    },
    /**
     * 是否注册
     */
    getIsRegister () {
      return new Promise((resolve, reject) => {
        this.$http.post(this.api.isRegister, {
          phone: this.formData.phone
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK) {
            resolve(true)
          } else {
            this.$toast('该用户尚未注册')
            return false
          }
        })
      })
    },
    /**
     * 第二步
    */
    async secondStep () {
      if (!this.formData.phone) {
        Toast('请输入手机号')
        return false
      } else if (!this.formData.phone.match(/^1\d{10}$/g)) {
        Toast('请输入正确的手机号')
        return false
      }
      let result = await this.getIsRegister()            // 是否注册
      if (result) {
        this.handleSendCode()                             // 发送验证码
      }
    },
    /**
     * 第三步
    */
    thirdStep (val) {
      this.formData.code = val
      this.curStep = 2
    },
    /**
     * 保存新密码
     */
    async handleSavePassword () {
      let pwd = this.formData.password
      if (!pwd) {
        this.$toast('请输入密码')
        return false
      } else if (pwd.length < 6 || pwd.length > 20) {
        this.$toast('密码6-20位')
        return false
      }
      let result = await this.$http.post(`${this.api.resetPassword}`, {
        phone: this.formData.phone,
        password: this.formData.password,
        confirmPwd: this.formData.password,
        verifyCode: this.formData.code
      })
      this.$toast(result.data.msg)
      if (result.data.status === this.api.ERR_OK) {
        this.$router.replace('/login')
      }
    }
  }
}
</script>
<style lang="less">
.forgotPassword-wrap{
  height: calc(100vh);
  overflow: auto;
  background: #1c1e3a;
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
