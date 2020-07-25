<template>
  <div class="bindWeChat">
    <div class="authenticated">
      <div class="authenticated-user">
        <img src="../../../../assets/images/real-name.png" v-if="!personalData.ifSetWechat">
        <img :src="personalData.wechatHeadimgurl" v-else>
      </div>
      <div class="unbind" v-if="personalData.ifSetWechat" @click="unbindConform">解除绑定</div>
      <ul>
        <li>
          <span>微信昵称：</span>
          <span v-if="personalData.ifSetWechat">{{personalData.wechatNickname}}</span>
          <span v-else>未获取</span>
        </li>
        <li><span>授权ID：</span><span>{{personalData.wechatOpenid | filterCard}}</span></li>
      </ul>
    </div>
    <van-button type="primary" class="btn" @click="bindWechat">{{!personalData.ifSetWechat ? '授权绑定微信': '返回'}}</van-button>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Button, Toast, Dialog } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog
  },
  data () {
    return {
      userInfo: {},
      realName: '',                // 真实姓名
      idCard: ''                   // 身份证
    }
  },
  mounted: function () {
    this.token = JSON.parse(localStorage.getItem('LZWLUSERINFO')) ? JSON.parse(localStorage.getItem('LZWLUSERINFO')).token : ''
    if (localStorage.getItem('redirectUrl') === '/bindWeChat' && this.$route.query.ifSetWechat) {
      localStorage.removeItem('redirectUrl')
      this.$router.replace('/my/cashWithdrawal')
    }
    // 监测浏览器后退
    if (window.history && window.history.pushState) {
      // history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  computed: {
    ...mapState(['personalData'])
  },
  destroyed () {
    window.removeEventListener('popstate', this.goBack, false)
  },
  methods: {
    goBack () {
      if (this.$route.query.hasOwnProperty('ifSetWechat')) {
        this.$router.go(-2)
      } else {
        this.$router.back()
      }
    },
    /**
     * 解绑微信
    */
    async unbindWechat () {
      let result = await this.$http.post(`${this.api.unbindWechat}`, {
      })
      this.$toast(result.data.msg)
      if (result.data.status === this.api.ERR_OK) {
        this.$router.replace('/my/setting')
      }
    },
    /**
     * 解绑弹窗
    */
    unbindConform () {
      Dialog.confirm({
        title: '解除绑定',
        message: '确定是否解除微信账号绑定？'
      }).then(() => {
        this.unbindWechat()
      }).catch(() => {
      })
    },
    /**
     * 绑定微信
    */
    async bindWechat () {
      if (this.personalData.ifSetWechat) {                        // 已绑定
        this.$router.replace('/my/setting')
      } else {                                                    // 微信授权
        window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.api.appid}&redirect_uri=${window.location.protocol.split(':')[0]}%3A%2F%2F${this.api.paySuccessUrl}%2Flzwlbehindpoints%2FwxAuthor%2Fuserinfo&response_type=code&scope=snsapi_userinfo&state=${this.token}#wechat_redirect`)
      }
    }
  }
}
</script>
<style lang=less>
  .bindWeChat{
    height: calc(100vh);
    overflow: auto;
    background: #1c1e3a;
    .authenticated{
      position: relative;
      .authenticated-user{
        height: 2.6rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: .2rem;
        img{
          width:1.2rem;
          height:1.2rem;
          border:.05rem solid #96684d;
          border-radius: 1.2rem;
        }
        div{
          font-size: .28rem;
          color:#666666;
          margin-top: .1rem;
        }
      }
      .unbind{
        position: absolute;
        top:25px;
        right: 35px;
        font-size: 26px;
        color: #6981fb;
        cursor: pointer;
      }
      ul {
        li{
          text-align: left;
          height: .88rem;
          line-height: .88rem;
          border-bottom: .02rem solid #2A3154;
          font-size: .24rem;
          color:rgba(223,226,244,1);
          span{
            display: inline-block;
          }
          span:nth-child(1){
            width: 150px;
            text-align: right;
          }
        }
      }
    }
     .btn{
      width: 90%;
      height: 0.81rem;
      line-height: 0.81rem;
      background: #6981fb;
      border-radius: 0.1rem;
      font-size: 0.28rem;
      border: none;
      margin: 0 auto;
      cursor: pointer;
      margin: 80px 0;
    }
  }
</style>
