<template>
  <div class="resetLoginPwd-wrap">
      <ul>
        <li>
          <div>旧密码</div>
          <div class="inp">
            <input type="password" placeholder="请输入旧密码" v-model="formData.passwordOld">
          </div>
        </li>
        <li>
          <div>新密码</div>
          <div class="inp">
            <input type="password" placeholder="请输入新密码" v-model="formData.passwordNew">
          </div>
        </li>
        <li>
          <div>确认密码</div>
          <div class="inp">
            <input type="password" placeholder="请确认新密码" v-model="formData.passwordConfirm">
          </div>
        </li>
        <div class="tip">密码必须至少6个字符，而且同时包含字母和数字。</div>
      </ul>
      <van-button type="primary" class="unverified-btn" @click="savePwd">保存新密码</van-button>
  </div>
</template>
<script>
import { Button, Toast, Icon } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast
  },
  data () {
    return {
      formData: {
        passwordOld: '',        // 旧密码
        passwordNew: '',        // 新密码
        passwordConfirm: ''     // 确认密码
      },
      rePwd: /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,20}$/,
      matchTips: '密码必须至少6-20个字符，而且同时包含字母和数字。'
    }
  },
  mounted: function () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
  },
  methods: {
    /**
     * 保存密码
    */
    async savePwd () {
      if (!this.formData.passwordOld) {
        Toast('请输入旧密码')
        return false
      } if (!this.formData.passwordNew) {
        Toast('请输入新密码')
        return false
      } else if (!this.formData.passwordNew.match(this.rePwd)) {
        Toast(this.matchTips)
        return false
      }
      if (!this.formData.passwordConfirm) {
        Toast('请输入确认密码')
        return false
      } else if (this.formData.passwordConfirm !== this.formData.passwordNew) {
        Toast('新密码不一致')
        return false
      }
      let result = await this.$http.post(`${this.api.updatePass}`, {
        id: this.userInfo.userId,
        password: this.formData.passwordOld,
        newPassword: this.formData.passwordNew,
        subNewPassword: this.formData.passwordConfirm
      })
      if (result.data.status === this.api.ERR_OK) {
        this.$router.back()
        return
      }
      this.$toast(result.data.msg)
    }
  }
}
</script>
<style lang=less>
  .resetLoginPwd-wrap{
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
            text-align: right;
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
