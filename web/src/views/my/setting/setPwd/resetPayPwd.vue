<template>
  <div class="resetPayPwd-wrap">
      <ul>
        <li @click="isShow = true, pwdType = 1">
          <div class="inp">
            <input type="password" disabled placeholder="请填写支付密码（限6个数字）" v-model="formData.password"/>
          </div>
        </li>
        <li @click="isShow = true, pwdType = 2">
          <div class="inp">
            <input type="password" disabled placeholder="确认支付密码（限6个数字）" v-model="formData.passwordConfirm"/>
          </div>
        </li>
      </ul>
      <van-button type="primary" class="unverified-btn" @click="savePwd">保存</van-button>
      <!-- 数字键盘 -->
      <van-number-keyboard
        :show="isShow"
        :maxlength="6"
        @blur="isShow = false, pwdType = ''"
        close-button-text="完成"
        @input="keyboardEntry($event, 1)"
        @delete="keyboardEntry($event, 2)"
      />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Button, Toast, Icon, PasswordInput, NumberKeyboard, Popup } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Popup.name]: Popup
  },
  data () {
    return {
      isShow: false,
      userInfo: {},
      pwdType: '',              // 1 新密码 2 确认新密码
      length: 6,
      formData: {
        password: '',           // 新密码
        passwordConfirm: ''     // 确认密码
      },
      rePwd: /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,20}$/,
      matchTips: '密码必须至少6-20个字符，而且同时包含字母和数字。',
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
     * 键盘输入
     * @param type 1: 输入 2 ：删除
    */
    async keyboardEntry (key, type) {
      if (type === 1) {
        if (this.pwdType === 1) {
          this.formData.password = (this.formData.password + key).slice(0, this.length)
        } if (this.pwdType === 2) {
          this.formData.passwordConfirm = (this.formData.passwordConfirm + key).slice(0, this.length)
        }
      } if (type === 2) {
        if (this.pwdType === 1) {
          this.formData.password = this.formData.password.slice(0, this.formData.password.length - 1)
        } if (this.pwdType === 2) {
          this.formData.passwordConfirm = this.formData.passwordConfirm.slice(0, this.formData.passwordConfirm.length - 1)
        }
      }
      this.$emit('onInput', this.passwordVal)
    },
    /**
     * 获取是否设置支付密码
    */
    isSetPaymentPassword () {
      this.$http.get(this.api.isSetPayPassword).then((res) => {
        let resData = res.data
        if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
          this.isPayPasswordSte = resData.data
          if (this.isPayPasswordSte === 1) {
            document.title = '重置支付密码'
          } else {
            document.title = '设置支付密码'
          }
        }
      })
    },
    /**
     * 保存密码
    */
    savePwd () {
      var reg = /^[0-9]+?[0-9]*$/
      if (this.formData.password.length < 6 || !reg.test(this.formData.password)) {
        Toast('支付密码为6位数字')
        return false
      }
      if (this.formData.passwordConfirm < 6 || !reg.test(this.formData.passwordConfirm)) {
        Toast('确认支付密码为6位数字')
        return false
      } if (this.formData.password !== this.formData.passwordConfirm) {
        Toast('密码不一致')
        return false
      }
      let url = this.isPayPasswordSte === 1 ? this.api.resetPayPassword : this.api.setPayPassword
      this.$http.post(url, {
        paymentPassword: this.formData.password,
        subPaymentPassword: this.formData.passwordConfirm,
        id: this.userInfo.userId
      }).then((res) => {
        let resData = res.data
        this.$toast(resData.msg)
        if (resData.status === this.api.ERR_OK) {
          if (localStorage.getItem('redirectUrl')) {
            this.$router.replace(localStorage.getItem('redirectUrl'))
            if (localStorage.getItem('redirectUrl') !== '/bindWeChat') {
              localStorage.removeItem('redirectUrl')      // 清空认证来源
            }
          } else {
            this.$router.back()
          }
        }
      })
    }
  }
}
</script>
<style lang=less>
  .resetPayPwd-wrap{
    height: calc(100vh);
    overflow: hidden;
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
      text-align: left;
      padding: 30px 0;
    }
  }
</style>
