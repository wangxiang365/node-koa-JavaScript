<template>
  <div>
    <div class="manger-card-wrap">
      <div>
        <div v-for="(item, index) in cardList" class="item-box"
        @touchstart="showDeleteButton(index)"
        :style="{ background: 'linear-gradient(-45deg,' + backgrundGradient[index = index <= 3 ? index : index % 4].after + ',' + backgrundGradient[index = index <= 3 ? index : index % 4].front + ')'}" :key="index">
          <p>
            {{item.bankName}}
          </p>
          <p class="card-type">{{item.cardType | cardTypeFilter}}</p>
          <p>{{item.cardNo | cardNoFilter}}</p>
        </div>
      </div>
      <!-- 无数据 -->
      <no-data v-if="cardList.length <= 0"></no-data>
      <div class="add-card">
        <van-button type="primary"  @click="addCard" class="add-btn">添加银行卡</van-button>
      </div>
      <!-- 密码、键盘框弹窗 -->
      <numberKeyboard :show="showPasswordPop" @finish="finish" @close="showPasswordPop = false"></numberKeyboard>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import noData from '../../../../components/noData'
import numberKeyboard from '../../../../components/numberKeyboard'
import { Checkbox, Button, Toast, Dialog, PasswordInput, NumberKeyboard, Popup } from 'vant'
export default {
  components: {
    noData,
    numberKeyboard,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Dialog.Component.name]: Dialog.Component,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Popup.name]: Popup
  },
  data () {
    return {
      userInfo: {},                         // 用户信息
      cardList: [],                         // 银行卡列表
      curId: '',                            // 删除当前银行卡id
      backgrundGradient: [{
        front: '#A61F23',
        after: '#A61F23',
        visible: false
      }, {
        front: '#0061A5',
        after: '#0061A5',
        visible: false
      }, {
        front: '#414150',
        after: '#5e5e76',
        visible: false
      }, {
        front: '#53507a',
        after: '#ac85e7',
        visible: false
      }],                                  // 渐变背景色
      Loop: null,
      clearFlag: true,
      showToast: false,
      confirmVisible: false,
      showPasswordPop: false,             // 密码框弹框
      passwordVal: '',                    // 输入的密码
      isPayPasswordSte: null              // 是否设置交易密码 0：未设置， 1：已设置
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
    this.isSetPaymentPassword()            // 是否设置了支付密码
    this.getCardList()
  },
  computed: {
    ...mapState(['personalData'])
  },
  methods: {
    /**
     * 获取银行卡列表
     */
    getCardList () {
      this.$http.post(`${this.api.getCardList}`, {}).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) return false
        this.cardList = res.data.data
        this.cardList = this.cardList.filter(row => row.accountType === 1)
      })
    },
    /**
     * 长按事件
     */
    showDeleteButton (index) {
      this.curId = index
      clearInterval(this.Loop)
      this.Loop = setTimeout(() => {
        Dialog.confirm({
          title: '解绑银行卡',
          message: '确认将该银行卡解除绑定吗？'
        }).then(() => {
          this.$http.get(this.api.delCard, {
            params: {
              id: this.cardList[this.curId].id
            }
          }).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
              this.getCardList()
            }
          })
        })
      }, 1000)
    },
    clearLoop () {
      clearInterval(this.Loop)
    },
    /**
     * 获取是否设置支付密码
    */
    isSetPaymentPassword () {
      this.$http.get(this.api.isSetPayPassword).then((res) => {
        let resData = res.data
        if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
          this.isPayPasswordSte = resData.data
        }
      })
    },
    /**
     * 添加银行卡
    */
    addCard () {
      if (this.personalData.cardStatus) {                                                                 // 未实名认证(实名+设置支付密码)
        localStorage.setItem('redirectUrl', '/my/setting/addBankCard')                // 重定向url
        this.$router.push('/my/setting/realNameAuth')
      } if (!this.personalData.cardStatus && this.isPayPasswordSte === 0) {                               // 已实名认证未设置密码
        localStorage.setItem('redirectUrl', '/my/setting/bankCard')                   // 重定向url
        this.$router.push('/my/setting/resetPayPwd')
      } if (!this.personalData.cardStatus && this.isPayPasswordSte === 1) {                               // 已实名认证已设置密码
        this.showPasswordPop = true
      }
    },
    /**
     * 校验支付密码是否正确
    */
    checkPassword (val) {
      return new Promise((resolve, reject) => {
        this.$http.post(this.api.checkPassword, {
          id: this.userInfo.userId,
          paymentPassword: val
        }).then((res) => {
          let resData = res.data
          if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
            resolve(resData)
          } else {
            this.$toast(resData.msg)
          }
        })
      })
    },
    /**
     * 输入完成
    */
    async finish (val) {
      let result = await this.checkPassword(val)
      if (parseInt(result.status) === 1) {
        this.showPasswordPop = false
        this.$router.push('/my/setting/addBankCard')
      }
    }
  }
}
</script>

<style scoped lang="less">
.manger-card-wrap{
  height: 100vh;
  background: #eee;
  padding: .2rem;
  height: calc(100vh);
  box-sizing: border-box;
  overflow: auto;
  background: #1c1e3a;
  .item-box{
    width: 6.4rem;
    height: 142px;
    margin: 0 auto .3rem;
    padding: .3rem .2rem .3rem .36rem;
    border-radius: 20px;
    text-align: left;
    p{
      color: #fff;
      font-weight: 600;
      letter-spacing: 5px;
      margin-bottom: .1rem;

      .fast-pay{
        font-size: .22rem;
        font-style: italic;
        letter-spacing: 1px;

        .pay{
          // color: transparent;
          transform: skewX(-45deg);
          // background: #fff;
          position: relative;
        }
        .pay:before{
            content: '';
            position: absolute;
            top: 0;
            right: -2px;
            bottom: 0;
            left: 2px;
            background-color: #fff;
            transform: skewX(-15deg);
            z-index: -1;
        }
      }
    }

    .card-type{
      display: inline-block;
      width: 1.5rem;
      font-size: .26rem;
      font-weight: normal;
      margin-bottom: .16rem;
      opacity: .5;
    }
  }
  .add-card{
    padding: .4rem .2rem;
    .add-btn{
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
  }
  // 支付密码弹窗
  .password-keyboard{
    left: 0;
    right: 0;
    max-width: 750px;
    margin: 0 auto;
    // tip
    .tip{
      margin-top: 35px;
      font-size: 28px;
    }
    // 密码框
    .van-password-input{
      margin-top: 50px;
      padding: 0 3%;
      li{
        border: 1px solid #ccc;
      }
    }
    // 忘记密码
    .forgetPwd{
      font-size: 28px;
      margin: 35px 0;
      color: #0099CC;
      cursor: pointer;
    }
    // 键盘
    .van-number-keyboard{
      max-width: 750px;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
}
</style>
