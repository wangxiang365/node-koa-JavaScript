<template>
  <div class="home-wrap">
    <!-- banner -->
    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="white" :show-indicators="false">
        <van-swipe-item v-for="(item, index) in 5" :key="index">
          <img src="../assets/images/banner.png">
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- title -->
    <div class="tit">
      <img src="../assets/images/ind-tit.png">
    </div>
    <!-- list -->
    <div class="list">
      <ul>
        <li v-for="(item, index) in 2" :key="index">
          <div class="img">
            <!-- <img src="../assets/images/ind-tit.png"> -->
            <img src="../assets/images/banner1.png" v-if="index == 0">
            <img src="../assets/images/banner2.png" v-if="index === 1">
          </div>
          <div class="content">
            <p><span>代金券抵扣</span>初级推广大使升级礼包</p>
            <p>订购获三重好礼：获得超值大礼包+享初级推广大使特权+赠等额的代金券</p>
          </div>
          <div class="price">
            <div>
              ￥30000
              <span><img src="../assets/images/couponIco.png"> 赠{{item.amount}}元代金券</span>
            </div>
            <div @click="$router.push('/goodsDetail')">立即订购</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
export default {
  name: 'home',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  },
  data () {
    return {
      mealList: []                                         // 套餐列表
    }
  },
  mounted () {
    // this.getSetMealIndex()
  },
  methods: {
    /**
     * 获取套餐列表
    */
    async getSetMealIndex () {
      // let result = await this.$http.get(`${this.api.getSetMealIndex}`)
      // if (result.data.status === this.api.ERR_OK) {
      //   this.mealList = result.data.data
      // }
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
  }
  // title
  .tit{
    img{
      width: 100%;
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
