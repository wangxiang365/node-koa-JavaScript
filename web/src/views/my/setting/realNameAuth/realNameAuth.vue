<template>
  <div class="realNameAuth">
    <!--未认证-->
    <div class="unverified" v-if="personalData.cardStatus">
      <ul>
        <li>
          <input type="text" placeholder="请输入真实姓名" v-model="realName">
        </li>
        <li>
          <input type="text" placeholder="请输入证件号码" v-model="idCard" @blur="inpBlur">
        </li>
      </ul>
      <van-button type="primary" class="unverified-btn" @click="authentica">实名认证</van-button>
    </div>
    <!--已认证-->
    <div class="authenticated" v-else>
      <div class="authenticated-user">
        <img src="../../../../assets/images/real-name.png" >
        <div>已实名</div>
      </div>
      <ul>
        <li><span>姓名：</span><span>{{personalData.cardName | filterName}}</span></li>
        <li><span>证件号：</span><span>{{personalData.idCard | filterCard}}</span></li>
      </ul>
    </div>
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
      userInfo: {},
      realName: '',                // 真实姓名
      idCard: ''                   // 身份证
    }
  },
  mounted: function () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
  },
  computed: {
    ...mapState(['personalData'])
  },
  methods: {
    /**
     * 证件输入验证
    */
    inpBlur () {
      if (parseInt(this.cardType) === 1) {
      }
    },
    /**
     * 获取是否设置支付密码
    */
    isSetPaymentPassword () {
      return new Promise((resolve, reject) => {
        this.$http.get(this.api.isSetPayPassword).then((res) => {
          let resData = res.data
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            resolve(resData.data)
          }
        })
      })
    },
    /**
     * 提交认证
    */
    authentica () {
      var cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (this.realName === '') {
        Toast('请输入真实姓名')
        return false
      } if (this.idCard === '') {
        Toast('请输入证件号')
        return false
      } if (!cP.test(this.idCard)) {
        Toast('请输入正确的证件号')
        return
      }
      this.$http.post(this.api.validCard, {
        cardName: this.realName,
        idCard: this.idCard,
        cardType: 1,
        id: this.userInfo.userId
      }).then(async (res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          Toast('认证成功')
          if (!localStorage.getItem('redirectUrl')) {                // 个人中心设置进入
            this.$router.back()
          } else {                                                   // 添加银行卡、支付宝、提现设置银行卡、支付宝进入
            // 判断是否设置支付密码
            let result = await this.isSetPaymentPassword()
            if (result === 0) {
              this.$router.replace('/my/setting/resetPayPwd')
              // localStorage.removeItem('redirectUrl')             // 清空从定向
              // this.$router.replace(localStorage.getItem('redirectUrl'))
            } else {
              this.$router.back()
            }
          }
          // 设置进入-进行实名认证
          // 设置支付密码-未实名认证
        } else {
          Toast(resData.msg)
        }
      })
    }
  }
}
</script>
<style lang=less>
  .realNameAuth{
    height: calc(100vh);
    overflow: auto;
    background: #1c1e3a;
    /**未认证**/
    .unverified{
      ul {
        width: 700px;
        margin: 34px auto;
        background: rgba(42, 49, 84, 0.6);
        padding: 0 40px;
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
          input{
            width: 100%;
            height: .88rem;
            font-size: .24rem;
            color:rgba(223,226,244,1);
            background: none;
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
    /**已认证**/
    .authenticated{
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
  }
</style>
