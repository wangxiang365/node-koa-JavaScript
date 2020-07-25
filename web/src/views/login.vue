<template>
  <div class="login-wrap">
    <div class="content">
      <div class="bg">
        <img src="../assets/images/login-title.png">
      </div>
      <div class="name">推广大使系统</div>
      <div class="box">
        <ul>
          <li>
            <div class="ico">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconwodedangxuan"></use>
              </svg>
            </div>
            <div class="inp">
              <input type="tel" placeholder="请输入手机号" maxlength="11" autocomplete="off" v-model="loginForm.phone">
            </div>
          </li>
          <li v-if="loginForm.loginType === 1">
            <div class="ico">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconmima"></use>
              </svg>
            </div>
            <div class="inp">
              <input type="password" placeholder="请输入登录密码" v-model="loginForm.password">
            </div>
          </li>
        </ul>
        <div class="submit">
          <van-button type="primary" @click="login()">登录</van-button>
        </div>
      </div>
      <div class="forget">
        <span @click="$router.push('/forgotPassword')">忘记密码？</span>
        <span @click="$router.push({path: '/register', query: {invitationCode: $route.query.invitationCode}})">没有账号，去注册</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Checkbox, Button, Toast } from 'vant'
export default {
  components: {
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    [Toast.name]: Toast
  },
  data () {
    return {
      loginForm: {
        loginType: 1,                                          // 登录类型1：账号密码 2：手机验证码
        loginTypeTxt: '用短信验证码登录',
        rememberPwd: false,                                    // 是否记住密码 默认否
        phone: '18765235786',                                              // 手机号
        password: '125a854',                                          // 密码
        code: '',                                              // 验证码
        codeVal: ''                                            // 获取的验证码值
      }
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  methods: {
    /**
     * 登录
    */
    async login () {
      // Toast.loading({
      //   message: '登录中...',
      //   forbidClick: true,
      //   duration: 0
      // })
      this.$http.post(`http://localhost:8081/nodeapi/auth/signup`, {
        phone: '18765235786',
        password: '125a854'
      }).then((res) => {
        console.log(res.data)
      })
    }
  }
}
</script>
<style lang="less">
.login-wrap{
  height: calc(100vh);
  overflow: auto;
  background: url('../assets/images/login-bg.png') no-repeat;
  background-size: cover;
  .content{
    width: 100%;
    height: 100%;
    overflow: auto;
    background:rgba(28,30,58,0.8);
  }
  .bg{
    padding-top: 175px;
    img{
      width: 551px;
      height: 164px;
    }
  }
  .name{
    color: #fff;
    font-size: 40px;
    text-align: right;
    padding-right: 109px;
    margin-top: 21px;
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
      .ico{
        margin-right: 30px;
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
          color: #fff;
        }
      }
      .getCode{
        width:203px;
        height:65px;
        font-size: 26px;
        padding: 0;
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
  }
  // 改变登录方式
  .change-mode{
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    cursor: pointer;
    .short-letter{
      font-size: 24px;
      color: #fff;
    }
    .remember-pwd{
      display: flex;
      font-size: 24px;
      color: #fff;
      .van-checkbox__icon{
        height: 30px;
        line-height: 30px;
      }
      .van-icon{
        width: 30px;
        height: 30px;
        border: 1px solid #fff;
        overflow: hidden;
      }
      .van-checkbox__label{
        font-size: 24px;
        color: #ffffff;
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
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
