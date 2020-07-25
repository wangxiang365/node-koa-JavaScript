<template>
  <div class="register-wrap">
    <div class="content">
    <template v-if="curStep === 0">
      <div class="bg">
        <img src="../assets/images/register-bg.png">
      </div>
      <div class="box">
        <ul>
          <li>
            <div class="">
              手机号归属地
            </div>
            <div class="place">
              <span>中国大陆</span>
              <van-icon name="arrow" />
            </div>
          </li>
          <li>
            <div class="ico">
              +86
            </div>
            <div class="inp">
              <input type="tel" placeholder="请输入手机号" maxlength="11" autocomplete="off" v-model="formData.phone" @blur="inputBlur">
            </div>
          </li>
          <li>
            <div class="ico">
              * 邀请人手机
            </div>
            <div class="inp">
              <input type="text" placeholder="请输入邀请人手机" v-model="formData.inviter" @input ="checkInviter" maxlength="11" @blur="inputBlur">
            </div>
            <div v-if="invitCodeFlag">{{formData.invitName}}</div>
          </li>
        </ul>
        <div class="submit">
          <van-button type="primary" :disabled="!subActive" @click="subActive?register():''">注册</van-button>
        </div>
        <div class="forget">
          <span>注册即表示同意<i @click="showAgreement = true">注册协议</i></span>
        </div>
      </div>
    </template>
    <!-- 第二步 -->
    <sendCode v-if="curStep===1" :phone="formData.phone" @next="next"></sendCode>
    <!-- 第三步 -->
    <div class="set-pwd" v-if="curStep===2">
      <div class="tit">请为您的账号{{formData.phone}} 设置一个密码</div>
      <ul>
        <li>
          <div>输入密码</div>
          <div class="inp">
            <input type="password" placeholder="请输入新密码" v-model="formData.password">
          </div>
        </li>
        <li>
          <div>确认密码</div>
          <div class="inp">
            <input type="password" placeholder="请确认新密码" v-model="formData.passwordAgain">
          </div>
        </li>
      </ul>
      <van-button type="primary" class="btn" @click="handleSavePassword">保存密码</van-button>
    </div>
    <!-- 注册协议 -->
      <van-dialog
        v-model="showAgreement"
        title="注册协议"
        width="330px"
        cancelButtonText="不同意协议"
        confirmButtonText="同意协议"
        show-cancel-button
        className="agreement"
        @cancel="$router.replace('login')"
      >
      <div>
        <p>注册协议</p>
        【审慎阅读】您在申请注册流程中点击同意前，应当认真阅读以下协议。请您务必审慎阅读、充分理解协议中相关条款内容，其中包括：
        1、与您约定免除或限制责任的条款；
        2、与您约定法律适用和管辖的条款；
        3、其他以粗体下划线标识的重要条款。
        如您对协议有任何疑问，可向平台客服咨询。
        【特别提示】当您按照注册页面提示填写信息、阅读并同意协议且完成全部注册程序后，即表示您已充分阅读、理解并接受协议的全部内容。如您因平台服务与淘宝发生争议的，适用《淘宝平台服务协议》处理。如您在使用平台服务过程中与其他用户发生争议的，依您与其他用户达成的协议处理。
        阅读协议的过程中，如果您不同意相关协议或其中任何条款约定，您应立即停止注册程序。
        《xx服务协议》
        不同意
      </div>
      </van-dialog>
      <!-- 注册弹窗 -->
      <van-dialog
        v-model="showToast"
        :showConfirmButton="false"
        :showCancelButton="false"
        show-cancel-button
        className="registerConf"
        @cancel="$router.replace('login')"
      >
        <div class="register-confirm-box">
          <div class="confirm-header">
            <h3 class="ta-l">确认您的邀请人信息</h3>
            <span class="fl-r" @click="showToast = false">×</span>
          </div>
          <div class="confirm-body">
            <p>请确认您的邀请人，一旦确认将无法修改</p>
            <div>
              <dl>
                <dt>邀请人ID号</dt>
                <dd>{{formData.inviter}}</dd>
              </dl>
              <dl>
                <dt>邀请人姓名</dt>
                <dd>{{formData.invitName | filterEmpty}}</dd>
              </dl>
              <dl>
                <dt>邀请人手机</dt>
                <dd>{{formData.invitPhone}}</dd>
              </dl>
            </div>
          </div>
          <div class="confirm-footer">
            <div @click="showToast = false">修改邀请人</div>
            <div @click="getIsRegister">确认</div>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { Checkbox, Button, Toast, Icon, Dialog } from 'vant'
import sendCode from '../components/sendCode'
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
        phone: '',
        invitName: '',                                        // 手机号
        invitPhone: '',
        inviter: '',                                          // 邀请人
        beInvitationCode: '',
        code: '',                                             // 验证码
        password: '',                                         // 密码
        passwordAgain: ''                                     // 确认密码
      },
      curStep: 0,
      Time: 60,                                                // 倒计时时间
      getCodeNoTap: false,                                     // 获取验证码按钮是否允许点击
      CodeText: '发送验证码',                                   // 验证码文字
      timer: null,                                             // 定时器
      subActive: false,                                        // 提交按钮选中效果
      invitCodeFlag: false,                                    // 确认注册信息弹框
      showToast: false,                                        // 是否注册弹窗
      showAgreement: false                                     // 注册协议
    }
  },
  watch: {
    'formData': {
      handler () {
        this.subActive = (this.formData.phone && this.formData.inviter) ? !!true : !!false
      },
      deep: true
    }
  },
  mounted () {
    this.formData.inviter = this.$route.query.invitationCode
    if (this.formData.inviter) {
      this.checkInvCode(this.formData.inviter)
    }
    document.body.addEventListener('focusout', () => {
      this.inputBlur()
    })
  },
  methods: {
    /**
     * 验证邀请码
     */
    checkInvCode (code) {
      this.$http.post(`${this.api.checkInvitCode}`, {
        recommendCode: code
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.invitCodeFlag = false
          this.$toast(resData.msg)
          return false
        } else {
          this.formData.invitName = resData.data.beCardName
          this.formData.invitPhone = resData.data.bePhone
          this.formData.beInvitationCode = resData.data.beInvitationCode
          this.invitCodeFlag = true
        }
      })
    },
    /**
     * 校验邀请人
    */
    async checkInviter () {
      if (this.formData.inviter && this.formData.phone) {
        this.subActive = true
      } else {
        this.subActive = false
      }
      if (!this.formData.inviter.match(/\D/)) {      // 判断是不是字母开头
        if (this.formData.inviter.length === 11) {
          let result = await this.$http.post(this.api.getInvicationCodeByPhone, {
            phone: this.formData.inviter
          })
          this.$toast(result.data.msg)
          if (result.data.status === this.api.ERR_OK) {
            this.checkInvCode(result.data.data.invitationCode)
          } else {
            this.formData.invitName = ''
            this.formData.invitPhone = ''
            this.invitCodeFlag = false
          }
        } else {
          this.formData.invitName = ''
          this.formData.invitPhone = ''
          this.invitCodeFlag = false
        }
      } else {
        if (this.formData.inviter.length === 5) {       // 输入验证码够5位是请求接口验证
          this.checkInvCode(this.formData.inviter)
        } else {
          this.formData.invitName = ''
          this.formData.invitPhone = ''
          this.invitCodeFlag = false
        }
      }
    },
    /**
     * 校验注册
     */
    registerCheck () {
      return new Promise((resolve, reject) => {
        if (!this.formData.phone) {
          this.$toast('请输入手机号')
          return false
        } else if (!this.formData.phone.match(/^1\d{10}$/)) {
          this.$toast('请输入正确的手机号')
          return false
        } else if (!this.formData.inviter) {
          this.$toast('请输入邀请人ID号')
          return false
        } else if (!this.formData.beInvitationCode.match(/^[A-Z]\d{4,}$/)) {
          this.$toast('邀请码对应用户不存在')
          return false
        }
        resolve(true)
      })
    },
    /**
     * 是否注册
     */
    getIsRegister () {
      this.$http.post(this.api.isRegister, {
        phone: this.formData.phone
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          this.isRegister = false
          this.showToast = false
          this.handleCheckInvitcode()
        } else {
          this.isRegister = true
          this.$toast(resData.msg)
          return false
        }
      })
    },
    /**
     * 注册
    */
    async register () {
      let check = await this.registerCheck()
      if (!this.invitCodeFlag) {
        this.$toast('邀请码对应用户不存在')
        return
      }
      if (check && this.invitCodeFlag) {
        this.showToast = true
      }
    },
    /**
     * 校验邀请码
     */
    handleCheckInvitcode () {
      this.$http.post(this.api.checkInvicationCode, {
        invicationCode: this.formData.beInvitationCode,
        recommendCode: this.formData.beInvitationCode
      }).then((res) => {
        let resData = res.data
        if (resData.status !== this.api.ERR_OK) {
          this.$toast(resData.msg)
          return false
        }
        this.handleSendCode()
      })
    },
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
        if (resData.status === this.api.ERR_OK) {
          this.showToast = false
          this.curStep = 1
        }
        this.$toast(res.data.msg)
      })
    },
    /**
     * 下一步
    */
    next (val) {
      this.formData.code = val
      this.curStep = 2
    },
    /**
     * 保存密码
     */
    handleSavePassword () {
      let pwd = this.formData.password
      let pwdAgain = this.formData.passwordAgain
      if (!pwd) {
        this.$toast('请输入密码')
        return false
      } else if (pwd.length < 6 || pwd.length > 20) {
        this.$toast('密码6-20位')
        return false
      }
      if (!pwdAgain) {
        this.$toast('请输入确认密码')
        return false
      } else if (pwdAgain.length < 6 || pwdAgain.length > 20) {
        this.$toast('确认密码6-20位')
        return false
      }
      if (pwd !== pwdAgain) {
        this.$toast('密码输入不一致')
        return false
      }
      this.handleRegister()
    },

    /**
     * 注册
     */
    handleRegister () {
      this.$http.post(`${this.api.register}`, {
        phone: this.formData.phone,
        password: this.formData.password,
        confirmPwd: this.formData.passwordAgain,
        verifyCode: this.formData.code,
        recommendCode: this.formData.beInvitationCode,
        invitationCode: this.formData.beInvitationCode
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          this.$toast(res.data.msg)
          return false
        } else {
          this.$toast('注册成功')
          this.$router.replace('/login')
        }
      })
    },
    /**
     * input 失去焦点
    */
    inputBlur () {
      var u = navigator.userAgent
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (isIOS) {
        alert('ios')
        this.$utils.blurAdjust()
      }
    }
  }
}
</script>
<style lang="less">
.register-wrap{
  max-width: 750px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  overflow: hidden;
  z-index: 2000;
  background: #1c1e3a;
  .content{
    position: relative;
    z-index: 3000;
    height: 100%;
    overflow-y: scroll;
  }
  .bg{
    img{
      width: 100%;
      height: 100%;
    }
  }
  .box{
    padding: 0 60px;
  }
  // form
  ul{
    li{
      display: flex;
      height: 127px;
      align-items: center;
      border-bottom: 1px solid rgba(105, 106, 134, 1);
      color: #8384A0;
      font-size: 28px;
      .ico{
        width: 170px;
        margin-right: 30px;
        text-align: left;
        svg{
          width: 35px;
          height: 34px;
          fill: rgba(131, 132, 160, 1);
        }
      }
      .inp{
        flex: 1;
        input{
          width: 100%;
          height: 127px;
          background: none;
          outline: none;
          font-size: 28px;
          color: rgba(131, 132, 160, 1);
        }
      }
      .place{
        flex: 1;
        text-align: right;
        span{
          vertical-align: middle;
        }
        i{
          vertical-align: middle;
          margin-left: 15px;
        }
      }
      .getCode{
        width:203px;
        height:65px;
        line-height: 65px;
        border: none;
        background:rgba(105,129,251,1);
        border-radius:10px;
        cursor: pointer;
        &.disabled{
          background: #ccc;
        }
      }
    }
    input::-webkit-input-placeholder {
      color:#8384A0;
    }
  }
  // 改变登录方式
  .change-mode{
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    cursor: pointer;
    .short-letter{
      font-size: 24px;
      color: rgba(105, 129, 251, 1);
    }
    .remember-pwd{
      display: flex;
      font-size: 24px;
      color: rgba(105, 129, 251, 1);
      .van-checkbox__icon{
        height: 25px;
        line-height: 25px;
      }
      .van-icon{
        width: 25px;
        height: 25px;
        border: 1px solid rgba(105, 129, 251, 1);
      }
      .van-checkbox__label{
        font-size: 24px;
        color: rgba(105, 129, 251, 1);
      }
    }
  }
  // 登录
  .submit{
    .van-button{
      width:622px;
      height:81px;
      line-height: 81px;
      background:rgba(105,129,251,1);
      border-radius:10px;
      font-size: 0.28rem;
      cursor: pointer;
      border: none;
      margin: 0 auto;
      cursor: pointer;
      margin-top: 59px;
    }
    .active{
      opacity: 1;
    }
  }
  // 忘记密码、注册
  .forget{
    display: flex;
    justify-content: space-between;
    margin: 33px 0;
    span{
      font-size: 24px;
      color: rgba(131, 132, 160, 1);
      cursor: pointer;
    }
    i{
      color: #6981FB;
      cursor: pointer;
    }
  }
  .agreement{
    .van-dialog__content{
      padding: 0 30px;
      text-align: left;
      max-height: calc(50vh);
      overflow: auto;
    }
  }
  // 注册弹窗
  .registerConf{
    width: 85%;
    border-radius: 6px;
    .register-confirm-box{
      /*padding: .2rem .3rem;*/
      border-radius: .05rem;

      .confirm-header{
        padding: .2rem .3rem;
        border-bottom: 1px solid #d9d9d9;
        display: flex;
        justify-content: space-between;
        span{
          font-size: .4rem;
          line-height: .44rem;
        }
      }

      .confirm-body{
        font-size: .2rem;
        margin: 0 .3rem;

        p{
          margin: .2rem 0;
          text-align: left;
          color: #f74d4d;
        }

        dl{
          display: flex;
          border: 1px solid #d9d9d9;
          height: .6rem;
          line-height: .6rem;

          dt{
            width: 40%;
            border-right: 1px solid #d9d9d9;
            background: #ebeef5;
          }

          dd{
            width: 60%;
            text-align: center;
          }

        }

        dl:nth-child(2) {
          border-top: 0;
          border-bottom: 0;
        }
      }
      .confirm-footer{
        display: flex;
        margin-top: .2rem;
        border-top: 1px solid #d9d9d9;
        div{
          width: 50%;
          /*color: #f74d4d;*/
          padding: .2rem 0;
          font-size: .24rem;
        }

        div:last-child{
          color: #fff;
          background: #f74d4d;
        }
      }
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
            padding-left: 50px;
            text-align: right;
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
