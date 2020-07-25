<template>
  <div class="addAlipay">
    <div class="unbind" v-if="personalData.alipayNum" @click="unbindConform">解除绑定</div>
    <div class="form">
      <ul>
        <li>
          <div class="l">姓名</div>
          <div class="r">{{personalData.cardName}}</div>
        </li>
        <li>
          <div class="l">证件号</div>
          <div class="r">{{personalData.idCard | filterCard}}</div>
        </li>
        <li>
          <div class="l">*支付宝账号</div>
          <div class="r">
            <input type="text" placeholder="请输入完整的支付宝账号" v-model.trim="alipayAcount" :disabled="personalData.alipayNum ? true:false">
          </div>
        </li>
      </ul>
      <div class="tip">支付宝账户姓名须与实名一致，否则将无法正常通过该支付宝提现！</div>
      <van-button type="primary" class="unverified-btn" @click="save">{{personalData.alipayNum?'返回':'保存'}}</van-button>
    </div>
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
      alipayAcount: ''              // 支付宝账号
    }
  },
  watch: {
    personalData () {
      this.alipayAcount = this.personalData.alipayNum
    }
  },
  mounted: function () {
    this.alipayAcount = this.personalData.alipayNum
  },
  computed: {
    ...mapState(['personalData'])
  },
  methods: {
    /**
     * 解绑支付宝
    */
    async unbindAlipay () {
      let result = await this.$http.post(`${this.api.unbindAlipay}`, {
      })
      this.$toast(result.data.msg)
      if (result.data.status === this.api.ERR_OK) {
        setTimeout(() => {
          this.$router.replace('/my/setting')
        }, 150)
      }
    },
    /**
     * 解绑弹窗
    */
    unbindConform () {
      Dialog.confirm({
        title: '解除绑定',
        message: '确定是否解除支付宝账号绑定？'
      }).then(async () => {
        this.unbindAlipay()
      }).catch(() => {
      })
    },
    /**
     * 提交认证
    */
    save () {
      if (this.personalData.alipayNum) {            // 已绑定
        this.$router.back()
        return
      }
      // 绑定支付宝
      if (this.alipayAcount === this.personalData.alipayNum && this.alipayAcount) {
        this.$router.back()
        return
      } if (!this.alipayAcount) {
        Toast('请输入支付宝账号')
        return false
      } else if (!this.alipayAcount.match(/^1[34578]\d{9}$/g) && this.alipayAcount.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/g)) {
        if (this.personalData.alipayNum === null) {
        } else if (this.alipayAcount === this.personalData.alipayNum) {
          Toast('当前支付宝账号在系统中已存在')
          return false
        }
      } else if (!this.alipayAcount.match(/^1[34578]\d{9}$/g) && !this.alipayAcount.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/g)) {
        Toast('请输入正确的手机号或邮箱')
        return false
      }
      this.$http.post(this.api.saveAlipay, {
        alipayNum: this.alipayAcount
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          Toast('绑定支付宝账号成功')
          this.$router.back()
        } else {
          Toast(resData.msg)
        }
      })
    }
  }
}
</script>
<style lang=less>
  .addAlipay{
    height: calc(100vh);
    overflow: auto;
    background: #1c1e3a;
    .tip{
      font-size: 24px;
      color: red;
      text-align: left;
      margin-left: 25px;
      margin-top: 25px;
      padding: 0 15px;
    }
    .unbind{
      font-size: 26px;
      color: #6981fb;
      cursor: pointer;
      text-align: right;
      cursor: pointer;
      padding: 25px 35px 0 0;
    }
    .form{
      ul {
        width: 700px;
        margin: 34px auto;
        background: rgba(42, 49, 84, 0.6);
        padding: 0 30px;
        box-sizing: border-box;
        li{
          text-align: left;
          height: .88rem;
          border-bottom: .02rem solid #2A3154;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: .24rem;
          color:rgba(223,226,244,1);
          &:last-child{
            border:none;
          }
          .l{
            width: 160px;
            text-align: right;
            margin-right: 50px;
          }
          .r{
            flex: 1;
            input{
              width: 100%;
              height: .88rem;
              font-size: .24rem;
              color:rgba(223,226,244,1);
              background: none;
            }
          }
        }
      }
      .unverified-btn{
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
  }
</style>
