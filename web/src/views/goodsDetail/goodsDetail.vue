<template>
  <div class="goodsDetail-wrap">
    <!-- banner -->
    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
        <van-swipe-item v-for="(item, index) in detailData.appendImageUri" :key="index">
          <img :src="item">
        </van-swipe-item>
        <div class="custom-indicator" slot="indicator" v-if="detailData.appendImageUri && detailData.appendImageUri.length > 0">
          {{ current + 1 }} / {{detailData.appendImageUri.length}}
        </div>
      </van-swipe>
    </div>
    <!-- 内容 -->
    <div class="introduce">
      <div class="amount">
        <span>¥{{detailData.setMealPrice}}</span>
        <span v-if="detailData.amount">赠{{detailData.amount}}优惠券</span>
        <span v-if="detailData.couponDeduction">代金券抵扣</span>
      </div>
      <div class="title">{{detailData.setMealName}}</div>
      <div class="txt">{{detailData.simpleDescription}}</div>
    </div>
    <!-- 详情 -->
    <div class="detail">
      <h2>详情说明</h2>
      <div v-html="detailData.textDescription" class="con"></div>
    </div>
    <!-- 底部 -->
    <div class="submit-barseize"></div>
    <div class="submit-bar">
      <div class="box">
        <div class="amount">
          <p v-if="checked">¥{{(detailData.setMealPrice - detailData.couponAmount).toFixed(2)}}</p>
          <p v-else>¥{{detailData.setMealPrice}}</p>
        </div>
        <!-- " -->
        <div class="coupon" v-if="detailData.couponDeduction && detailData.whetherUserCoupon">
          <p>
            <van-checkbox v-model="checked" shape="square" checked-color="#6981FB"></van-checkbox>
          </p>
          <p>
            <span class="t">代金券抵扣</span>
            <span class="num">{{detailData.couponAmount}}</span>
          </p>
        </div>
      </div>
      <div class="btn">
        <van-button type="primary" @click="judgeOrder">立即订购</van-button>
      </div>
    </div>
    <!-- 购买弹窗 -->
     <van-popup class="by-pop" v-model="showPop" position="bottom">
       <div class="amount">
         <span>实际付款金额：</span>
         <span v-if="checked">￥{{(detailData.setMealPrice - detailData.couponAmount).toFixed(2)}}</span>
         <span v-else>￥{{detailData.setMealPrice}}</span>
       </div>
       <div class="form">
         <ul>
           <li>
             <div class="l">收货人</div>
             <div class="r">
               <input type="text" placeholder="姓名（限20个字）" v-model="formData.userName">
             </div>
           </li>
           <li>
             <div class="l">联系电话</div>
             <div class="r">
               <input type="tel" placeholder="手机号码（限11个数字）" v-model="formData.phone" maxlength="11">
             </div>
           </li>
           <li>
             <div class="l">所在地区</div>
             <div class="r" @click="showArea = true">{{formData.area.map(row => row.name).join(' ').trim() || '请选择'}}</div>
           </li>
           <li>
             <div class="l">详细地址</div>
             <div class="r">
               <input type="text" placeholder="门牌号或房间号（限50个字）" v-model="formData.address">
             </div>
           </li>
         </ul>
       </div>
       <van-button type="primary" class="binding" @click="disabled ? '' : submit()">立即订购</van-button>
     </van-popup>
     <!-- 城市选择 -->
    <van-popup
      v-model="showArea"
      position="bottom"
    >
      <van-area :area-list="areaList" :value="formData.selectCityCode" @confirm="getAreaData" @cancel="showArea = false"/>
    </van-popup>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Checkbox, Button, Popup, Toast, Area, Dialog } from 'vant'
import areaList from '../../assets/js/area'
export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Toast.name]: Toast,
    [Area.name]: Area,
    [Dialog.name]: Dialog
  },
  data () {
    return {
      detailData: {},                          // 详情页数据
      showPop: false,
      current: 0,
      html: '',
      checked: false,
      showArea: false,
      areaList: areaList,                      // 城市选择数据源
      formData: {
        userName: '',
        phone: '',
        area: [],
        selectCityCode: '',
        address: ''
      },
      disabled: false
    }
  },
  mounted () {
    this.getSetMealDetails()                 // 获取详情数据
  },
  methods: {
    onChange (index) {
      this.current = index
    },
    /**
     * 获取订单列表
    */
    async getOrderList () {
      let result = await this.$http.post(`${this.api.getSetMealOrderList}`, {
        start: 1,
        pageSize: 20,
        orderStatus: 1
      })
      if (result.data.status === this.api.ERR_OK) {
        return result.data.data.list
      }
    },
    /**
     * 获取城市选中数据
    */
    getAreaData (val) {
      this.formData.area = val
      this.showArea = false
    },
    /**
     * 获取套餐详情
    */
    async getSetMealDetails () {
      let result = await this.$http.get(`${this.api.getSetMealDetails}`, {
        params: {
          mealId: this.$route.query.id
        }
      })
      if (result.data.status === this.api.ERR_OK) {
        this.detailData = result.data.data
        this.detailData.appendImageUri = this.detailData.appendImageUri.split(',')
        this.formData.area = [
          {
            name: this.detailData.province || '',
            code: this.detailData.provinceCode || ''
          },
          {
            name: this.detailData.city || '',
            code: this.detailData.cityCode || ''
          },
          {
            name: this.detailData.zone || '',
            code: this.detailData.zoneCode || ''
          }
        ]
        if (this.formData.area[0].code && this.formData.area[1].code) {
          this.formData.selectCityCode = `${this.formData.area[0].code}, ${this.formData.area[1].code}, ${this.formData.area[2].code}`
        } else {
          this.formData.selectCityCode = '110000,110100,110101'
        }
        this.formData.userName = this.detailData.customerName
        this.formData.phone = this.detailData.customerPhone
        this.formData.address = this.detailData.address
      }
    },
    /**
     * 判断是否有未支付订单
    */
    async judgeOrder () {
      let orderList = await this.getOrderList()
      if (orderList && orderList.length > 0) {
        Dialog.confirm({
          title: '付款提醒',
          message: '您存在待付款的订单，是否继续完成支付?',
          confirmButtonText: '去付款'
        }).then(() => {
          localStorage.setItem('orderNo', orderList[0].orderNo)
          localStorage.setItem('orderId', orderList[0].orderId)
          localStorage.setItem('orderAmount', orderList[0].orderAmount)
          window.location.href = window.location.href.match(/.*lzwl-points/gi)[0] + '/pay/orderPay?redirect=gopay'
        }).catch(() => {
        })
        return
      }
      this.showPop = true
    },
    /**
     * 提交
    */
    async submit () {
      if (!this.formData.userName || this.formData.userName.length > 20) {
        Toast('姓名（限20个字）')
        return false
      } if (!this.formData.phone) {
        Toast('联系电话')
        return false
      } if (!this.formData.phone.match(/^1\d{10}$/g)) {
        Toast('请输入正确的手机号')
        return false
      } if (!this.formData.area[0].code || !this.formData.area[1].code) {
        Toast('请填写所在地区')
        return false
      } if (!this.formData.address) {
        Toast('请填写详细地址')
        return false
      }
      // 提交订单
      this.disabled = true
      let result = await this.$http.post(`${this.api.addSetMealOrder}`, {
        mealId: this.$route.query.id,
        whetherCoupon: this.checked ? 1 : 2,
        customerName: this.formData.userName,
        customerPhone: this.formData.phone,
        province: this.formData.area[0].name,
        provinceCode: this.formData.area[0].code,
        city: this.formData.area[1].name,
        cityCode: this.formData.area[1].code,
        zone: this.formData.area[2].name,
        zoneCode: this.formData.area[2].code,
        address: this.formData.address
      })
      if (result.data.status === this.api.ERR_OK) {
        this.disabled = false
        // this.$router.push({path: '/pay/orderPay', query: {orderNo: result.data.data.orderNo}})
        localStorage.setItem('orderNo', result.data.data.orderNo)
        localStorage.setItem('orderId', result.data.data.orderId)
        localStorage.setItem('orderAmount', result.data.data.orderAmount)
        window.location.href = window.location.href.match(/.*lzwl-points/gi)[0] + '/pay/orderPay?redirect=gopay'
      } else {
        this.disabled = false
        this.$toast(result.data.msg)
      }
    }
  }
}
</script>
<style lang="less">
.goodsDetail-wrap{
  min-height: calc(100vh);
  overflow: auto;
  background: #fff;
  // banner
  .banner{
    width: 750px;
    height: 750px;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    .van-swipe{
      height: 750px;
    }
    .custom-indicator{
      position: absolute;
      padding: 9px 27px;
      background:rgba(43,43,43,.48);
      border-radius:23px;
      color: #fff;
      right: 76px;
      bottom: 37px;
    }
  }
  // introduce
  .introduce{
    text-align: left;
    padding: 39px 23px;
    .amount{
      display: flex;
      align-items: center;
      span:nth-child(1){
        font-size: 36px;
        color: rgba(195, 22, 22, 1);
      }
      span:nth-child(2){
        padding: 0 12px;
        height: 28px;
        line-height: 28px;
        font-size: 16px;
        color: #fff;
        background: rgba(255, 162, 71, 1);
        margin-left: 43px;
        margin-right: 20px;
        position: relative;
        &::before{
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-top: 14px solid transparent;
          border-bottom:14px solid transparent;
          border-right:28px solid rgba(255, 162, 71, 1);
          position: absolute;
          left: -28px;
          top: 0;
        }
      }
      span:nth-child(3){
        padding: 0 12px;
        height: 28px;
        line-height: 28px;
        font-size: 16px;
        color: #fff;
        background: rgba(255, 162, 71, 1);
      }
    }
    .title{
      font-size: 36px;
      color: rgba(58, 58, 58, 1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 30px 0;
    }
    .txt{
      font-size: 28px;
      color: rgba(97, 97, 97, 1);
      display: -webkit-box;
      display: box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
  // detail
  .detail{
    border-top: 5px solid #f3f3f3;
    h2{
      height: 90px;
      line-height: 90px;
      font-size: 28px;
      color: rgba(163, 162, 162, 1);
      &::after{
        content: '';
        display: block;
        width: 125px;
        height: 4px;
        background: rgba(163, 162, 162, 1);
        margin: 0 auto;
        margin-top: -20px;
      }
    }
    .con{
      text-align: left;
      padding: 0 30px;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
      word-break: break-all;
      font-size: 28px;
      white-space: normal;
    }
  }
  // 底部
  .submit-barseize{
    height: 115px;
  }
  .submit-bar{
    height: 115px;
    padding: 0 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    box-shadow: 0 0 5px 0 hsla(0,6%,58%,.6);
    -webkit-box-shadow: 0 0 5px 0 hsla(0,6%,58%,.6);
    .box{
      display: flex;
      align-items: center;
    }
    .amount{
      text-align: left;
      p:nth-child(1){
        font-size: 36px;
        color: rgba(195, 22, 22, 1);
      }
      p:nth-child(2){
        display: flex;
        align-items: center;
        line-height: 25px;
        .van-checkbox__icon{
          height: 25px;
          line-height: 25px;
        }
        .van-icon{
          width: 25px;
          height: 25px;
        }
        .t{
          font-size: 22px;
          color: rgba(121, 121, 121, 1);
          margin: 0 12px;
        }
        .num{
          font-size: 22px;
          color: rgba(195, 22, 22, 1);
        }
      }
    }
    .coupon{
      display: flex;
      align-items: center;
      margin-left: 30px;
      p{
        &:nth-child(2){
          margin-left: 20px;
          span{
            display: block;
            text-align: left;
            font-size: 22px;
            color: #797979;
            &:nth-child(2){
              color: #C31616;
              font-size: 22px;
              margin-top: 5px;
            }
          }
        }
      }
    }
    .btn .van-button{
      width:289px;
      height:68px;
      line-height: 68px;
      background:#6981FB;
      border: none;
      border-radius:10px;
      font-size: 28px;
      cursor: pointer;
    }
  }
  // 弹窗
  .by-pop{
    padding: 27px;
    text-align: left;
    height: 598px;
    .amount{
      color: #E12727;
      span:nth-child(1){
        font-size: 22px;
      }
      span:nth-child(2){
        font-size: 36px;
      }
    }
    .form{
      ul{
        li{
          display: flex;
          align-items: center;
          height: 94px;
          border-bottom: 1px solid #BEBEBE;
          .l{
            font-size: 26px;
            color: #797979;
            width: 137px;
          }
          .r{
            flex: 1;
            height: 100%;
            line-height: 94px;
            font-size: 22px;
            input{
              width: 100%;
              font-size: 22px;
              background: none;
              color: #797979;
              &::-webkit-input-placeholder {
                color:#797979;
              }
            }
          }
        }
      }
    }
    .binding{
      width:702px;
      height:68px;
      line-height: 68px;
      background:rgba(225,39,39,1);
      border-radius:10px;
      font-size: 28px;
      color: #fff;
      border: none;
      margin-top: 80px;
    }
  }
}
</style>
