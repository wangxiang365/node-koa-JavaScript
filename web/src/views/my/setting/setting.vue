<template>
    <div class="setting-wrap">
      <!--表单-->
      <ul class="ul">
        <li>
          <div class="left">账号(手机号)</div>
          <div class="center" @click="$router.push('/my/setting/modifyPhone')">{{personalData.phone | filterPhone}}</div>
          <van-icon name="arrow" />
        </li>
        <li>
          <div class="left">用户名</div>
          <div class="center" @click="$router.push('/my/setting/modifyName')">{{personalData.userName}}</div>
          <van-icon name="arrow" />
        </li>
        <li>
          <div class="left">地区</div>
          <div class="center" @click="showArea = true">{{userForm.selectCity.map(row => row.name).join(' ')}}</div>
          <van-icon name="arrow" />
        </li>
        <li>
          <div class="left">性别</div>
          <div class="center" @click="showGender = true">
            <template v-if="userForm.selectGender.val">{{userForm.selectGender.val | sexStatusFilter}}</template>
            <template v-else>未设置</template>
          </div>
          <van-icon name="arrow" />
        </li>
        <li>
          <div class="left">实名认证</div>
          <div class="center" @click="$router.push('/my/setting/realNameAuth')">{{personalData.cardStatus !== undefined ? personalData.cardStatus ? '去认证' : personalData.cardName + '（已实名）' : '去认证'}}</div>
          <van-icon name="arrow" />
        </li>
        <li @click="$router.push('/my/setting/setPwd')">
          <div class="left">密码设置</div>
          <div class="center"></div>
          <van-icon name="arrow" />
        </li>
        <li @click="$router.push('/my/setting/bankCard')">
          <div class="left">银行卡</div>
          <div class="center"></div>
          <van-icon name="arrow" />
        </li>
        <li @click="addAccount(1)">
          <div class="left">绑定支付宝</div>
          <div class="center" v-if="personalData.alipayNum">{{personalData.alipayNum | filterPhone}}</div>
          <div class="center" v-else>未设置</div>
          <van-icon name="arrow" />
        </li>
        <li @click="addAccount(2)">
          <div class="left">绑定微信</div>
          <div class="center" v-if="personalData.ifSetWechat">{{personalData.wechatNickname | filterName}}</div>
          <div class="center" v-else>未设置</div>
          <van-icon name="arrow" />
        </li>
      </ul>
      <!-- 城市选择 -->
      <van-popup
        v-model="showArea"
        position="bottom"
      >
        <van-area :area-list="areaList" :value="userForm.selectCityCode" @confirm="getAreaData" @cancel="showArea = false"/>
      </van-popup>
      <!-- 性别选择 -->
      <van-action-sheet v-model="showGender" :actions="genderList" @select="selectGender" title="请选择" :round="false"/>
      <van-button type="primary" class="loginout" @click="exitFun">退出登录</van-button>
      <!-- 密码、键盘框弹窗 -->
      <numberKeyboard :show="showPasswordPop" @finish="finish" @close="showPasswordPop = false"></numberKeyboard>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { Icon, Button, Popup, Area, ActionSheet, Toast } from 'vant'
import areaList from '../../../assets/js/area'
import numberKeyboard from '../../../components/numberKeyboard'
export default {
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Area.name]: Area,
    [ActionSheet.name]: ActionSheet,
    numberKeyboard,
    [Toast.name]: Toast
  },
  data () {
    return {
      userInfo: '',                            // 用户信息
      showArea: false,                         // 是否显示城市选中下拉
      showGender: false,                       // 是否显示性别下拉列表
      areaList: areaList,                      // 城市选择数据源
      genderList: [
        { name: '男', val: '1' },
        { name: '女', val: '2' }
      ],
      userForm: {
        selectCity: [],                         // 选择的城市数据
        selectCityCode: '',                     // 选中的城市code
        selectGender: []                        // 选择的性别
      },
      showPasswordPop: false,
      isPayPasswordSte: null,                  // 是否设置交易密码 0：未设置， 1：已设置
      accountType: ''                          // 账号类型1 支付宝 2 微信
    }
  },
  computed: {
    ...mapState(['personalData'])
  },
  async mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
  },
  watch: {
    personalData: {
      handler () {
        this.userForm.selectCity = [
          {
            name: this.personalData.userProvince,
            code: this.personalData.userProvinceCode
          },
          {
            name: this.personalData.userCity,
            code: this.personalData.userCityCode
          },
          {
            name: this.personalData.userZone,
            code: this.personalData.userZoneCode
          }
        ]
        this.userForm.selectGender = {
          val: this.personalData.sex
        }
        if (this.userForm.selectCity[0].code && this.userForm.selectCity[1].code) {
          this.userForm.selectCityCode = `${this.userForm.selectCity[0].code}, ${this.userForm.selectCity[1].code}, ${this.userForm.selectCity[2].code}`
        } else {
          this.userForm.selectCityCode = '110000,110100,110101'
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /**
     * 获取城市选中数据
    */
    getAreaData (val) {
      this.showArea = false
      this.userForm.selectCity = val
      this.$http.post(`${this.api.saveUser}`, {
        userProvinceCode: this.userForm.selectCity[0].code,
        userProvince: this.userForm.selectCity[0].name,
        userCityCode: this.userForm.selectCity[1].code,
        userCity: this.userForm.selectCity[1].name,
        userZoneCode: this.userForm.selectCity[2].code,
        userZone: this.userForm.selectCity[2].name,
        id: this.userInfo.userId || ''
      }).then((res) => {
        this.$toast(res.data.msg)
      })
    },
    /**
     * 选择性别
    */
    selectGender (val) {
      this.showGender = false
      this.userForm.selectGender = val
      this.$http.post(this.api.saveUser, {
        sex: this.userForm.selectGender.val || ''
      }).then((res) => {
        let resData = res.data
        Toast(resData.msg)
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
     * 添加支付宝、微信
     * @param type 1 支付宝 2 微信
    */
    async addAccount (type) {
      this.accountType = type
      let isPayPasswordSte = await this.isSetPaymentPassword()
      if (this.personalData.cardStatus) {                                                                 // 未实名认证(实名+设置支付密码)
        if (type === 1) {
          localStorage.setItem('redirectUrl', '/my/setting/addAlipay')               // 重定向url
        } if (type === 2) {
          localStorage.setItem('redirectUrl', '/bindWeChat')               // 重定向url
        }
        this.$router.push('/my/setting/realNameAuth')
      } if (!this.personalData.cardStatus && isPayPasswordSte === 0) {                                    // 已实名认证未设置密码
        if (type === 1) {
          localStorage.setItem('redirectUrl', '/my/setting/addAlipay')               // 重定向url
        } if (type === 2) {
          localStorage.setItem('redirectUrl', '/bindWeChat')               // 重定向url
        }
        this.$router.push('/my/setting/resetPayPwd')
      } if (!this.personalData.cardStatus && isPayPasswordSte === 1) {                                    // 已实名认证已设置密码
        this.showPasswordPop = true
      }
      this.showPasswordPop = true
    },
    /**
     * 输入完成
    */
    async finish (val) {
      let result = await this.checkPassword(val)
      if (parseInt(result.status) === 1) {
        this.showPasswordPop = false
        if (this.accountType === 1) {
          this.$router.push('/my/setting/addAlipay')
        } if (this.accountType === 2) {
          this.$router.push({path: '/bindWeChat', query: {token: ''}})
        }
      }
    },
    /**
     * 退出登录
    */
    exitFun () {
      this.$http.post(`${this.api.logout}`, {
        phone: this.userInfo ? this.userInfo.phone : '',
        token: this.userInfo ? this.userInfo.token : ''
      }).then((res) => {
        if (res.data.status === this.api.ERR_OK || !res) {
          localStorage.removeItem('LZWLUSERINFO')        // 移除保存的用户信息
          // 移除保存的记住密码
          var accountMes = JSON.parse(localStorage.getItem('accountMes'))
          accountMes.password = ''
          accountMes.rememberPwd = true
          localStorage.setItem('accountMes', JSON.stringify(accountMes))
          Toast(res.data.msg)
          this.$router.replace({
            path: '/login'
          })
        }
      })
    }
  }
}
</script>

<style  lang=less>
.setting-wrap {
  height: calc(100vh);
  overflow: auto;
  background: #1c1e3a;
  .ul{
    width: 700px;
    margin: 34px auto;
    background: rgba(42, 49, 84, 0.6);
    padding: 0 40px;
    box-sizing: border-box;
    li{
      height: 89px;
      line-height: 89px;
      border-bottom: 1px solid #2A3154;
      display: flex;
      align-items:center;
      text-align: left;
      color:rgba(223,226,244,1);
      .left{
        width:2.1rem;
        font-size: 28px;
      }
      .center{
        height: 100%;
        flex: 1;
        white-space: nowrap;
        text-align: right;
        font-size: .28rem;
        color:rgba(223,226,244,1);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .van-icon-arrow{
        margin-left: 30px;
        color:rgba(223,226,244,1);
      }
    }
    li:first-child{
      /* padding-right: 0.25rem; */
      .right{
        color:#fff;
      }
    }
  }
  .loginout{
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
