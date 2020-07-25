<template>
  <div class="add-card-wrap">
    <!-- <p class="msg-tip">*支行信息需输入完整，否则无法完成提现行</p> -->
    <div class="msg-box">
      <div class="item-box">
        <p>持卡人</p>
        <span class="r">{{personalData.cardName | filterName}}</span>
      </div>
      <div class="item-box">
        <p>证件号</p>
        <span class="r">{{personalData.idCard | filterCard}}</span>
      </div>
    </div>
    <div class="msg-box">
      <div class="item-box">
        <p>*所属地区</p>
        <span class="r" @click="showArea = true">{{formData.selectCity.map(row => row.name).join(' ') || '请选择地址'}}</span>
      </div>
      <div class="item-box">
        <p>*银行卡号</p>
        <input type="text" placeholder="请输入银行卡号" maxlength="28" v-model="formData.cardNo" @blur="inputBlur">
      </div>
      <div class="item-box">
        <p>*开户银行</p>
        <input type="text" placeholder="请输入开户行信息" v-model="formData.bankName" maxlength="20">
      </div>
      <div class="item-box">
        <p>*支行信息</p>
        <input type="text" placeholder="请输入完整的支行信息" v-model="formData.branchBankName" maxlength="50">
      </div>
      <div class="item-box">
        <p>*预留手机</p>
        <input type="text" placeholder="请输入手机号" maxlength="11" v-model="formData.phone">
      </div>
    </div>
    <div class="submit-box">
      <div class="submit-btn" @click="cardInfoSubmit">保存</div>
    </div>
     <!-- 城市选择 -->
    <van-popup
      v-model="showArea"
      position="bottom"
    >
      <van-area :area-list="areaList" @confirm="getAreaData" @cancel="showArea = false"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Icon, Button, Popup, Area, ActionSheet, Toast } from 'vant'
import areaList from '../../../../../assets/js/area'
import BIN from 'bankcardinfo'
export default {
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Area.name]: Area,
    [ActionSheet.name]: ActionSheet,
    [Toast.name]: Toast
  },
  data () {
    return {
      userInfo: {},
      areaList: areaList,
      showArea: false,
      addressCode: [], // 省市区code集合
      title: '所属地区',
      cityName: '',
      branchBankInfo: '',
      addressData: '',
      flag: false,          // 银行卡输入正确标志
      formData: {
        cardNo: '',
        bankName: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        zone: '',
        zoneCode: '',
        branchBankName: '',
        registerName: '',
        cardType: '',
        phone: '',
        selectCity: []
      }
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
  },
  computed: {
    ...mapState(['personalData'])
  },
  methods: {
    /**
     * 获取城市选中数据
    */
    getAreaData (val) {
      this.showArea = false
      this.formData.selectCity = val
    },
    /**
     * 地址选择
     */
    saveAddress (flag) {
      if (flag) {
        this.cityName = this.getName(this.addressCode).split(' ')
        this.formData.province = this.cityName[0]
        this.formData.provinceCode = this.addressCode[0]
        this.formData.city = this.cityName[1]
        this.formData.cityCode = this.addressCode[1]
        this.formData.zone = this.cityName[2]
        this.formData.zoneCode = this.addressCode[2]
      }
    },
    /**
     * 通过code获取省市区名称
     */
    getName (value) {
    },
    /**
    * 输入银行卡号
    */
    inputBlur () {
      this.formData.bankName = ''
      this.identifyCard()
    },
    /**
    * 解析银行卡
    */
    cardInfoSubmit () {
      this.identifyCard()
      if (!this.flag) {
        return false
      }
      if (this.formData.selectCity.length <= 0) {
        Toast('请选择所属地区')
        return false
      } if (this.formData.cardNo === '') {
        Toast('请填写银行卡号')
        return false
      } if (this.formData.bankName === '') {
        Toast('请输入开户行信息')
        return false
      } if (this.formData.branchBankName === '') {
        Toast('请输入完整的支行信息')
        return false
      }
      if (this.formData.phone === '') {
        Toast('请输入预留手机号')
        return false
      }
      if (!this.formData.phone.match(/1\d{10}/)) {
        Toast('手机输入格式错误')
        return false
      }
      this.$http.post(`${this.api.saveCard}`, this.formData).then((res) => {
        this.$toast(res.data.msg)
        if (res.data.status !== this.api.ERR_OK || !res) {
          return false
        }
        this.$router.back()
      })
    },
    /**
      * 调取银行卡识别
    */
    identifyCard () {
      if (this.formData.cardNo === '') {
        this.$toast('请输入银行卡号')
        return false
      }
      let reg = /^\d+$/
      if (!reg.test(this.formData.cardNo)) {
        this.$toast('银行卡号格式错误')
        return false
      }
      BIN.getBankBin(this.formData.cardNo).then(data => {
        this.flag = true
        if (data.cardType === 'CC') {
          this.$toast('不能添加信用卡类型！')
          return false
        }
        this.formData.bankName = data.bankName
        this.formData.cardType = data.cardType === 'DC' ? 1 : 2
      }).catch(() => {
        this.$toast('请查验卡号输入是否正确')
        this.flag = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.add-card-wrap{
  text-align: left;
  height: calc(100vh);
  overflow: auto;
  background: #1c1e3a;

  .msg-tip{
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #FF0000;
    font-size: .28rem;
  }

  .msg-box{
    margin-bottom: .2rem;
    width: 7rem;
    margin: 0.34rem auto;
    background: rgba(42, 49, 84, 0.6);
    padding: 0 0.4rem;
    box-sizing: border-box;

    .item-box{
      display: flex;
      height: 1rem;
      line-height: 1rem;
      border-bottom: 1px solid #2A3154;
      &:last-child{
        border-bottom: none;
      }
      p{
        display: inline-block;
        width: 1.4rem;
        font-size: 24px;
        color: #DFE2F4;
      }
      .r{
        color: #DFE2F4;
      }
      input, .r{
        flex: 1;
        background: none;
        text-align: right;
        font-size: 24px;
        color: #8384A0;
      }
      input{
        &::-webkit-input-placeholder {
          color:#8384A0;
        }
      }
    }
  }

  .submit-box{
    padding: .4rem .2rem;
    .submit-btn{
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
      text-align: center;
      color: #fff;
    }
  }
}
</style>
