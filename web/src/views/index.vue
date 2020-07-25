<template>
  <div class="home-wrap">
    <!-- banner -->
    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="white" :show-indicators="false">
        <van-swipe-item v-for="(item, index) in 1" :key="index">
          <img src="../assets/images/banner.png">
        </van-swipe-item>
        <div class="custom-indicator" slot="indicator">
          {{ current + 1 }} / 1
        </div>
      </van-swipe>
    </div>
    <!-- title -->
    <div class="tit">
      <!-- <img src="../assets/images/ind-tit.png" class="bg"> -->
      <img src="../assets/images/my/wave.gif" class="bg">
      <img src="../assets/images/my/title.png" class="title">
    </div>
    <!-- list -->
    <div class="list">
      <ul>
        <li v-for="(item, index) in mealList" :key="index" @click="goDetail(item)">
          <div class="img">
            <img :src="item.mainImageUrl">
          </div>
          <div class="content">
            <p><span v-if="item.couponDeduction">代金券抵扣</span>{{item.setMealName}}</p>
            <p>{{item.simpleDescription}}</p>
          </div>
          <div class="price">
            <div>
              ￥{{item.setMealPrice}}
              <span v-if="item.amount"><img src="../assets/images/couponIco.png"> 赠{{item.amount}}元代金券</span>
            </div>
            <div :class="{disabled: item.whetherNumberLimit === 2 && item.userBuyCount >= item.numberLimit}">{{item.whetherNumberLimit === 2 && item.userBuyCount >= item.numberLimit ? '已订购':'立即订购'}}</div>
          </div>
        </li>
      </ul>
      <!-- 无数据 -->
      <no-data v-if="this.mealList.length <= 0"></no-data>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Dialog } from 'vant'
import noData from '../components/noData'
export default {
  name: 'home',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Dialog.name]: Dialog,
    noData
  },
  data () {
    return {
      current: 0,
      mealList: []                                         // 套餐列表
    }
  },
  mounted () {
    this.getSetMealIndex()
  },
  methods: {
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
     * 获取套餐列表
    */
    async getSetMealIndex () {
      let result = await this.$http.get(`${this.api.getSetMealIndex}`)
      if (result.data.status === this.api.ERR_OK) {
        this.mealList = result.data.data
      }
    },
    /**
     * 是否需要先购买关联的套餐
    */
    getSetMealwhetherNeetGift (item) {
      return new Promise((resolve, reject) => {
        this.$http.get(this.api.getSetMealwhetherNeetGift, {
          params: {
            mealId: item.neetGiftMealId
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            resolve(res)
          } else {
            this.$toast(resData.msg)
          }
        })
      })
    },
    /**
     * 跳转详情页
    */
    async goDetail (item) {
      // let orderList = await this.getOrderList()
      // if (orderList && orderList.length > 0) {
      //   Dialog.confirm({
      //     title: '付款提醒',
      //     message: '您存在待款的订单，确定是否继续完成支付',
      //     confirmButtonText: '去付款'
      //   }).then(() => {
      //     localStorage.setItem('orderNo', orderList[0].orderNo)
      //     localStorage.setItem('orderId', orderList[0].orderId)
      //     localStorage.setItem('orderAmount', orderList[0].orderTotalAmount)
      //     window.location.href = window.location.href.match(/.*lzwl-points/gi)[0] + '/pay/orderPay?redirect=gopay'
      //   }).catch(() => {
      //   })
      //   return
      // }
      if (item.whetherNumberLimit === 2 && item.userBuyCount >= item.numberLimit) {      // 购买数量超过限制
        return
      } if (item.whetherNeetGift === 1) {
        let result = await this.getSetMealwhetherNeetGift(item)
        if (result.data.status === this.api.ERR_OK) {
          if (result.data.data <= 0) {    // 需要购买套餐
            Dialog.confirm({
              title: '温馨提示',
              message: '您可以先购买礼包后再进行提货，将享受更多的优惠喔～',
              confirmButtonText: '购买礼包'
            }).then(() => {
              this.$router.push({path: '/goodsDetail', query: {id: item.neetGiftMealId}})
            }).catch(() => {
            })
          } else {                        // 不需要购买套餐
            this.$router.push({path: '/goodsDetail', query: {id: item.mealId}})
          }
        } else {
          this.$toast(result.data.msg)
        }
      } else {
        this.$router.push({path: '/goodsDetail', query: {id: item.mealId}})
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home-wrap{
  min-height: calc(100vh - 1rem);
  background: #1c1e3a;
  /* banner */
  .banner{
    height: 282px;
    padding: 33px 32px 0 29px;
    img{
      width: 100%;
      height: 100%;
    }
    .custom-indicator{
      position: absolute;
      padding: 9px 27px;
      background:rgba(43,43,43,.48);
      border-radius:23px;
      color: #fff;
      right: 50px;
      bottom: 25px;
    }
  }
  // title
  .tit{
    width: 100%;
    height: 84px;
    position: relative;
    .bg{
      width: 100%;
      height: 85px;
    }
    .title{
      width: 350px;
      height: 42px;
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      margin: auto;
    }
  }
  // list
  .list{
    padding: 0 28px 28px 28px;
    ul{
      li{
        background: rgba(42, 49, 84, 0.6);
        border-radius: 15px;
        text-align: left;
        padding: 41px;
        margin-bottom: 16px;
        img{
          width: 100%;
          height: 257px;
        }
        .content{
          p:nth-child(1){
            color: #fff;
            font-size: 30px;
            font-weight: bold;
            margin: 17px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span{
              background:rgba(255,255,255,1);
              border-radius:14px;
              color: #FFA247;
              font-size: 16px;
              padding: 5px 22px;
              margin-right: 12px;
              vertical-align: middle;
            }
          }
          p:nth-child(2){
            color: #8DD2D6;
            font-size: 24px;
            display: -webkit-box;
            display: -moz-box;
            display: box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
        .price{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 23px;
          div:nth-child(1){
            font-size: 30px;
            color: #E12727;
            display: flex;
            align-items: center;
            span{
              display: flex;
              align-items: center;
              padding: 5px 22px;
              background:rgba(255,255,255,1);
              border-radius:14px;
              color: #FFA247;
              font-size: 16px;
              margin-left: 20px;
              img{
                width: 24px;
                height: 19px;
                margin-right: 8px;
              }
            }
          }
          div:nth-child(2){
            width:150px;
            height:57px;
            text-align: center;
            line-height: 57px;
            color: #fff;
            font-size: 28px;
            background:rgba(103,181,185,1);
            border-radius:10px;
            &.disabled{
              background: #999;
            }
          }
        }
      }
    }
  }
}
</style>
