<template>
  <div class="cashWithdrawal-wrap">
  <ul class="form">
    <li class="account">
      <div>到账账户</div>
      <div @click="withdrawPop = true">
        <span v-if="withdrawalsAccount">{{withdrawalsAccount.bankName || '微信'}}({{withdrawalsAccount.showAccount}})</span>
        <van-icon name="arrow" />
        </div>
    </li>
    <li class="amount">
      <div>
        <p>可提现金额：<span>{{(memberCashPointsAndcoupon.cashPoints - amountCash).toFixed(2)}}</span></p>
      </div>
      <div>
        <p>提现金额</p>
        <input type="number" placeholder="请输入提现金额" v-model="amountCash" ref="amountCash">
      </div>
    </li>
    <li class="procedures">
      <div class="procedures-red" v-if="amountCash > memberCashPointsAndcoupon.cashPoints">输入的金额超过可提现金额</div>
      <div v-else>
        <template v-if="WithdrawMes.cycleNumber !== -1">
          {{cashWithTip.split('|')[0]}}提现次数剩<span style="color:red;">{{WithdrawMes.cycleNumber - cycleNumber}}</span>次,
        </template>
        扣除¥<span style="color:red;">{{(amountCash * WithdrawMes.conditionValue / 100).toFixed(2)}}</span>手续费（费率{{WithdrawMes.conditionValue}}%）
        </div>
    </li>
  </ul>
  <van-button type="primary" class="withdrawal-btn" @click="cashWithdrawal">提现</van-button>
  <!-- 提现方式弹窗 -->
  <van-popup
    v-model="withdrawPop"
    :style="{ height: '40%' }"
    position="bottom" class="withdraw-pop"
  >
    <h2 class="title">选择到账账户</h2>
    <!-- 银行卡、支付宝 -->
    <div class="withdraw-way">
      <ul>
        <van-radio-group v-model="withdrawWay">
          <li v-if="WithdrawMes.withdrawalAli === 1">
            <div>
              <img src="../../../assets/images/withdraw-alipay.png">
            </div>
            <div>
              <van-radio name="1">支付宝</van-radio>
            </div>
          </li>
          <li v-if="WithdrawMes.withdrawalWx === 1">
            <div>
              <img src="../../../assets/images/wechat.png">
            </div>
            <div>
              <van-radio name="3">微信</van-radio>
            </div>
          </li>
          <li v-if="WithdrawMes.withdrawalBank === 1">
            <div>
              <img src="../../../assets/images/withdraw-bank.png">
            </div>
            <div>
              <van-radio name="2">银行卡</van-radio>
            </div>
          </li>
        </van-radio-group>
      </ul>
    </div>
    <!-- 列表 -->
    <ul class="cart-list" v-if="parseInt(withdrawWay) === 2">
      <li v-for="(item, index) in cardList" :key="index" @click="selectAcount(item)">
        <span class="l">{{item.bankName}}({{item.cardNo.substring(item.cardNo.length-4)}})</span>
        <van-icon name="passed"  v-if="item.active"/>
      </li>
    </ul>
    <ul class="cart-list" v-if="parseInt(withdrawWay) === 1">
      <li v-for="(item, index) in aliPayList" :key="index" @click="selectAcount(item)">
        <span class="l">{{item.bankName}}({{item.alipayNum | filterPhone}})</span>
        <van-icon name="passed" v-if="item.active"/>
      </li>
    </ul>
     <ul class="cart-list" v-if="parseInt(withdrawWay) === 3">
      <li v-for="(item, index) in weChatList" :key="index" @click="selectAcount(item)">
        <span class="l">微信({{personalData.wechatNickname}})</span>
        <van-icon name="passed" v-if="item.active"/>
      </li>
    </ul>
    <van-button type="primary" class="add-account" @click="addAccount" v-if="parseInt(withdrawWay) === 1 && aliPayList.length <= 0">添加支付宝账户</van-button>
    <van-button type="primary" class="add-account" @click="addAccount" v-if="parseInt(withdrawWay) === 3 && weChatList.length <= 0">添加微信账户</van-button>
    <van-button type="primary" class="add-account" @click="addAccount" v-if="parseInt(withdrawWay) === 2">添加银行卡</van-button>
  </van-popup>
  <!-- 密码、键盘框弹窗 -->
  <numberKeyboard :show="showPasswordPop" @finish="finish" @close="showPasswordPop = false"></numberKeyboard>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Button, Toast, Icon, Popup, RadioGroup, Radio, Dialog } from 'vant'
import numberKeyboard from '../../../components/numberKeyboard'
export default {
  components: {
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    numberKeyboard,
    [Dialog.name]: Dialog
  },
  data () {
    return {
      userInfo: {},
      cardList: [],                                                 // 银行卡列表
      aliPayList: [],                                               // 支付宝列表
      weChatList: [],                                               // 微信列表
      radio: '',
      withdrawPop: false,                                           // 提现方式弹窗
      withdrawWay: '',                                              // 选择的提现方式 1 支付宝 2 银行卡
      addBtnTxt: '添加支付宝账户',
      showPasswordPop: false,
      pwdType: '',                                                  // 输入密码功能 'add': 添加账户 'cash': 提现
      withdrawalsAccount: '',                                       // 提现账户
      amountCash: '',                                               // 提现金额
      WithdrawMes: {},                                              // 提现费率信息
      memberCashPointsAndcoupon: '',                                // 可提现额度
      cycleNumber: 0,                                               // 提现次数
      cashWithTip: ''                                               // 提现周期信息
    }
  },
  watch: {
    amountCash (val) {
      if (val > this.memberCashPointsAndcoupon.cashPoints) {
        this.amountCash = this.memberCashPointsAndcoupon.cashPoints
      } else {
        this.amountCash = this.amountCash
      }
    }
  },
  mounted: function () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
    this.getCardList()                                   // 获取银行卡、支付宝列表
    this.getMemberCashPointsAndcoupon()                  // 可提现额度
    this.getSettleSet()                                  // 提现比例
    this.getWithdrawalCycleNumber()                      // 提现次数
  },
  computed: {
    ...mapState(['personalData'])
  },
  methods: {
    /**
     * 会员余额等
    */
    async getMemberCashPointsAndcoupon () {
      let result = await this.$http.get(this.api.getMemberCashPointsAndcoupon)
      if (result.data.status === this.api.ERR_OK) {
        this.memberCashPointsAndcoupon = result.data.data
      }
    },
    /**
     * 获取银行卡列表
     */
    getCardList () {
      this.$http.post(`${this.api.getCardList}`, {}).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) return false
        res.data.data.forEach((item) => {
          this.$set(item, 'active', false)
          if (item.accountType === 1) {
            this.cardList.push(item)
          } if (item.accountType === 2) {
            this.aliPayList.push(item)
          } if (item.accountType === 3) {
            this.weChatList.push(item)
          }
        })
        // if (this.aliPayList.length > 0) {
        //   this.withdrawWay = '3'
        // }
        // if (this.aliPayList.length > 0 && parseInt(this.WithdrawMes.withdrawalAli) === 1) {
        //   this.withdrawWay = '1'
        //   this.aliPayList[0].active = true
        //   this.withdrawalsAccount = this.aliPayList[0]
        //   this.withdrawalsAccount.showAccount = this.withdrawalsAccount.alipayNum.toString().replace(/(.{3}).*(.{3})/, '$1*****$2')
        // } else if (this.cardList.length > 0 && parseInt(this.WithdrawMes.withdrawalBank === 1)) {
        //   this.withdrawWay = '2'
        //   this.withdrawalsAccount = this.cardList[0]
        //   this.withdrawalsAccount[0].active = true
        //   this.withdrawalsAccount.showAccount = this.withdrawalsAccount.cardNo.substring(this.withdrawalsAccount.cardNo.length - 4)
        // } else if (this.weChatList.length > 0 && parseInt(this.WithdrawMes.withdrawalWx === 1)) {
        //   this.withdrawWay = '3'
        //   this.withdrawalsAccount = this.weChatList[0]
        //   this.withdrawalsAccount[0].active = true
        //   this.withdrawalsAccount.showAccount = this.personalData.phone.toString().replace(/(.{3}).*(.{3})/, '$1*****$2')
        // }
      })
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
            return
          }
          this.$toast(resData.msg)
        })
      })
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
            return
          }
          this.$toast(resData.msg)
        })
      })
    },
    /**
     * 添加账户
    */
    async addAccount () {
      let isPayPasswordSte = await this.isSetPaymentPassword()
      if (parseInt(this.withdrawWay) === 1) {
        if (this.personalData.cardStatus) {                                                                 // 未实名认证(实名+设置支付密码)
          localStorage.setItem('redirectUrl', '/my/setting/addAlipay')               // 重定向url
          this.$router.push('/my/setting/realNameAuth')
        } if (!this.personalData.cardStatus && isPayPasswordSte === 0) {                                    // 已实名认证未设置密码
          localStorage.setItem('redirectUrl', '/my/setting/addAlipay')               // 重定向url
          this.$router.push('/my/setting/resetPayPwd')
        } if (!this.personalData.cardStatus && isPayPasswordSte === 1) {                                    // 已实名认证已设置密码
          this.showPasswordPop = true
          this.pwdType = 'add'
        }
      } if (parseInt(this.withdrawWay) === 2) {
        if (this.personalData.cardStatus) {                                                                 // 未实名认证(实名+设置支付密码)
          localStorage.setItem('redirectUrl', '/my/setting/addBankCard')                // 重定向url
          this.$router.push('/my/setting/realNameAuth')
        } if (!this.personalData.cardStatus && parseInt(isPayPasswordSte) === 0) {                               // 已实名认证未设置密码
          localStorage.setItem('redirectUrl', '/my/setting/bankCard')                   // 重定向url
          this.$router.push('/my/setting/resetPayPwd')
        } if (this.personalData.cardStatus === 0 && parseInt(isPayPasswordSte) === 1) {                               // 已实名认证已设置密码
          this.showPasswordPop = true
          this.pwdType = 'add'
        }
      } if (parseInt(this.withdrawWay) === 3) {
        if (this.personalData.cardStatus) {                                                                 // 未实名认证(实名+设置支付密码)
          localStorage.setItem('redirectUrl', '/bindWeChat')               // 重定向url
          this.$router.push('/my/setting/realNameAuth')
        } if (!this.personalData.cardStatus && isPayPasswordSte === 0) {                                    // 已实名认证未设置密码
          localStorage.setItem('redirectUrl', '/bindWeChat')               // 重定向url
          this.$router.push('/my/setting/resetPayPwd')
        } if (!this.personalData.cardStatus && isPayPasswordSte === 1) {                                    // 已实名认证已设置密码
          this.showPasswordPop = true
          localStorage.setItem('redirectUrl', '/bindWeChat')
          this.pwdType = 'add'
        }
      }
    },
    /**
     * 选择账户
    */
    selectAcount (item) {
      this.aliPayList.forEach((item) => {
        item.active = false
      })
      this.weChatList.forEach((item) => {
        item.active = false
      })
      this.cardList.forEach((item) => {
        item.active = false
      })
      item.active = true
      this.withdrawalsAccount = item
      if (parseInt(this.withdrawWay) === 1) {
        this.withdrawalsAccount.showAccount = this.withdrawalsAccount.alipayNum.toString().replace(/(.{3}).*(.{3})/, '$1*****$2')
      } if (parseInt(this.withdrawWay) === 2) {
        this.withdrawalsAccount.showAccount = this.withdrawalsAccount.cardNo.substring(this.withdrawalsAccount.cardNo.length - 4)
      } if (parseInt(this.withdrawWay) === 3) {
        this.withdrawalsAccount.showAccount = this.personalData.wechatNickname
      }
      this.withdrawPop = false
    },
    /**
     * 提现比例
    */
    getSettleSet () {
      this.$http.get(this.api.getSettleSet).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          this.WithdrawMes = resData.data
          this.cashWithTip = parseInt(this.WithdrawMes.withdrawalCycle) === 1 ? '今天|明天' : parseInt(this.WithdrawMes.withdrawalCycle) === 2 ? '本周|下周' : parseInt(this.WithdrawMes.withdrawalCycle) === 3 ? '本月|下月' : ''
        }
      })
    },
    /**
     * 提现次数
    */
    getWithdrawalCycleNumber () {
      return new Promise((resolve, reject) => {
        this.$http.get(this.api.getWithdrawalCycleNumber, {
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            this.cycleNumber = resData.data
            resolve(resData)
          } else {
            this.$toast(resData.msg)
          }
        })
      })
    },
    /**
     * 提现
    */
    async cashWithdrawal () {
      var tips = this.cashWithTip
      if (this.WithdrawMes.cycleNumber !== -1) {                       // -1为不限提现次数
        if (this.cycleNumber >= this.WithdrawMes.cycleNumber) {
          Dialog.confirm({
            title: '提现提醒',
            message: `您${tips.split('|')[0]}的提现次数已经用完，请在${tips.split('|')[1]}再尝试操作。`,
            showCancelButton: false,
            confirmButtonText: '确定'
          }).then(() => {
          }).catch(() => {
          })
          return
        }
      }
      if (!this.withdrawalsAccount) {
        this.$toast('请先选择提现账户')
        return
      } if (this.memberCashPointsAndcoupon.cashPoints <  this.WithdrawMes.withdrawalMinamount) {
        this.$toast(`很抱歉，${this.WithdrawMes.withdrawalMinamount}元起提现，您当前账户不足${this.WithdrawMes.withdrawalMinamount}元!`)
        return false
      } if (this.amountCash < this.WithdrawMes.withdrawalMinamount) {
        this.$toast(`很抱歉，${this.WithdrawMes.withdrawalMinamount}元起提现！`)
        return false
      } if (this.amountCash > this.memberCashPointsAndcoupon.cashPoints) {
        this.$toast('可提现金额不足')
        return false
      } if (this.amountCash < this.WithdrawMes.withdrawalMinamount) {
        this.$toast('最低提现金额为' + this.WithdrawMes.withdrawalMinamount)
        return false
      }
      this.pwdType = 'cash'
      this.showPasswordPop = true
    },
    /**
     * 金额输入
    */
    inputFunc () {
      if (this.amountCash > this.memberCashPointsAndcoupon.cashPoints) {
        var amountCashLen = this.amountCash.length
        this.$refs.amountCash.setAttribute('maxlength', amountCashLen)
      } else {
        this.$refs.amountCash.removeAttribute('maxlength')
      }
    },
    /**
     * 输入完成
    */
    async finish (val) {
      let result = await this.checkPassword(val)
      if (parseInt(result.status) === 1) {
        this.showPasswordPop = false
        if (this.pwdType === 'add') {              // 添加账户
          if (parseInt(this.withdrawWay) === 2) {
            this.$router.push('/my/setting/addBankCard')
          } if (parseInt(this.withdrawWay) === 1) {
            this.$router.push('/my/setting/addAlipay')
          } if (parseInt(this.withdrawWay) === 3) {
            this.$router.push('/bindWeChat')
          }
        } if (this.pwdType === 'cash') {           // 提现
          // ajax提现
          let withdrawalFees = this.amountCash * this.WithdrawMes.conditionValue / 100
          let withdrawalApply = await this.$http.post(this.api.withdrawalApply, {
            bankName: this.withdrawalsAccount.accountType === 1 ? this.withdrawalsAccount.bankName : '',
            cardholder: this.withdrawalsAccount.accountType === 1 ? this.personalData.cardName : '',
            cardNum: this.withdrawalsAccount.accountType === 1 ? this.withdrawalsAccount.cardNo : '',
            withdrawalAmount: this.amountCash,
            withdrawalFees: withdrawalFees,
            accountType: this.withdrawalsAccount.accountType,
            alipayNum: this.withdrawalsAccount.accountType === 2 ? this.withdrawalsAccount.alipayNum : ''
          })
          this.$toast(withdrawalApply.data.msg)
          if (withdrawalApply.data.status === this.api.ERR_OK) {
            this.$router.replace('/my/cashWithdrawalSuccess')
          }
        }
      }
    }
  }
}
</script>
<style lang=less>
  .cashWithdrawal-wrap{
    height: calc(100vh);
    overflow: auto;
    background: #1c1e3a;
    .form {
      width: 700px;
      margin: 34px auto;
      background: rgba(42, 49, 84, 0.6);
      padding: 0 40px;
      box-sizing: border-box;
      li{
        text-align: left;
        padding: 23px 0;
        border-bottom:1px solid rgba(46, 46, 82, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28px;
        color: #fff;
        &:last-child{
          border:none;
        }
        &.account{
          div:nth-child(2){
            color: #6981FB;
            font-size:24px;
            display: flex;
            flex: 1;
            justify-content: flex-end;
            align-items: center;
            i{
              color: #fff;
              margin-left: 20px;
            }
          }
        }
        &.amount{
          flex-direction: column;
          align-items: start;
          div:nth-child(1){
            p:nth-child(1){
              font-size: 24px;
              color: #7E7F9B;
              margin-bottom: 17px;
              span{
                color: #e12727;
              }
            }
            p:nth-child(2){
              font-size: 28px;
              color: #DFE2F4;
            }
          }
          div:nth-child(2){
            display: flex;
            align-items: center;
            width: 100%;
            p{
              flex: 1;
            }
            input{
              flex: 2;
              height: 55px;
              text-align: right;
              box-sizing: border-box;
              background: none;
              outline: none;
              font-size: 24px;
              color: rgba(131, 132, 160, 1);
              padding-left: 50px;
              padding-right: 20px;
              &::-webkit-input-placeholder {
                color:#8384A0;
              }
            }
          }
        }
        &.procedures{
          font-size: 24px;
          color: #7E7F9B;
          .procedures-red{
            color: red;
          }
        }
      }
    }
    .withdrawal-btn{
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
    /* 提现弹窗 */
    .withdraw-pop{
      box-sizing: border-box;
      max-height: 50%;
      h2{
        padding: 30px 0;
        font-size: 30px;
        color: #434343;
      }
      .withdraw-way{
        padding: 0 30px;
        ul{
          .van-radio-group{
            display: flex;
          }
          li{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            img{
              width: 50px;
              height: 50px;
              margin-right: 15px;
            }
            /* i{
              font-size: 40px;
            } */
          }
        }
      }
      .add-account{
        width:358px;
        height:65px;
        line-height: 65px;
        background:rgba(105,129,251,1);
        border-radius:10px;
        font-size: 26px;
        color: #fff;
        border: none;
        margin: 42px 0;
      }
      .cart-list{
        padding: 20px 50px;
        li{
          display: flex;
          color: #434343;
          text-align: left;
          height: 80px;
          font-size: 26px;
          align-items: center;
          border-bottom: 1px solid #eee;
          &:last-child{
            border-bottom: none;
          }
          .l{
            flex: 1;
          }
          i{
            color: #6981fb;
            font-size: 35px;
          }
        }
    }
    }
  }
</style>
