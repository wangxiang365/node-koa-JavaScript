<template>
  <div class="modifyPhone-wrap">
    <template v-if="step === 1">
      <ul>
        <li>
          <div>手机号</div>
          <div>{{personalData.phone | filterPhone}}</div>
        </li>
      </ul>
      <van-button type="primary" class="unverified-btn" @click="step = 2">更换手机号</van-button>
      <div class="tip">手机号只能作为一个账号的登录名</div>
    </template>
    <!-- 下一步 -->
    <template v-if="step === 2">
      <ul>
        <li>
          <div>手机号</div>
          <div class="inp">
            <input type="tel" placeholder="请输入手机号" v-model="modifyForm.phone">
          </div>
        </li>
        <li>
          <div>验证码</div>
          <div class="inp">
            <input type="text" placeholder="请输入验证码" v-model="modifyForm.code">
          </div>
          <van-button type="primary" class="getCode" :disabled="getCodeNoTap" :class="{disabled:getCodeNoTap}" @click="!getCodeNoTap?getCode():''">{{CodeText}}</van-button>
        </li>
      </ul>
      <van-button type="primary" class="unverified-btn" @click="modify">确认修改</van-button>
      </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Button, Toast } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [Toast.name]: Toast
  },
  data () {
    return {
      step: 1,                                                 // 修改手机号步骤 1 默认 2 下一步
      name: '',
      modifyForm: {
        phone: '',                                             // 手机号
        code: '',                                              // 验证码
        codeVal: ''                                             // 获取的验证码值
      },
      Time: 60,                                                // 倒计时时间
      getCodeNoTap: false,                                     // 获取验证码按钮是否允许点击
      CodeText: '获取证码',                                     // 验证码文字
      timer: null                                              // 定时器
    }
  },
  mounted: function () {
  },
  computed: {
    ...mapState(['personalData'])
  },
  methods: {
    /**
     * 倒计时
    */
    countDown () {
      if (this.Time > 0) {
        this.getCodeNoTap = true
        this.CodeText = this.Time + 's'
        --this.Time
      } else {
        clearInterval(this.timer)
        this.Time = 60
        this.getCodeNoTap = false
        this.CodeText = '重新获取'
      }
    },
    /**
     * 获取验证码
    */
    getCode () {
      if (!this.modifyForm.phone) {
        Toast('请输入手机号')
        return false
      } if (!this.modifyForm.phone.match(/^1\d{10}$/g)) {
        Toast('请输入正确的手机号')
        return false
      }
      // 倒计时
      this.sendCode()
      this.countDown()
      this.timer = setInterval(() => {
        this.countDown()
      }, 1000)
    },
    /**
     * 发送验证码
     */
    sendCode () {
      this.$http.post(`${this.api.getValidWord}`, {
        phone: this.modifyForm.phone
      }).then((res) => {
        Toast(res.data.msg)
        if (res.data.status) {
          this.modifyForm.codeVal = res.data.data
          return
        }
        clearInterval(this.timer)
        this.Time = 60
        this.getCodeNoTap = false
        this.CodeText = '重新获取'
      })
    },
    /**
     * 检测验证码是否一致
    */
    checkCode (fun) {
      return new Promise((resolve, reject) => {
        this.$http.post(`${this.api.checkVerifyCode}`, {
          phone: this.modifyForm.phone,
          verifyCode: this.modifyForm.code
        }).then((res) => {
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            Toast(res.data.msg)
            return false
          }
          resolve()
        })
      })
    },
    /**
     * 确认修改
    */
    async modify () {
      if (!this.modifyForm.phone) {
        Toast('请输入手机号')
        return false
      } else if (!this.modifyForm.phone.match(/^1\d{10}$/g)) {
        Toast('请输入正确的手机号')
        return false
      } else if (!this.modifyForm.code) {
        Toast('请输入验证码')
        return false
      } else if (this.modifyForm.code.length !== 4) {
        Toast('验证码限4个字符')
        return false
      }
      await this.checkCode()         // 校验验证码是否正确
      // 调用修改手机号接口
      this.$router.back()
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
          font-size: 26px;
          padding: 0;
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
      padding: 0;
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
