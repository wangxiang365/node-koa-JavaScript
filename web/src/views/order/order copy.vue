<template>
  <div class="order-wrap">
    <!-- tab -->
    <div class="tab">
      <ul>
        <li :class="{'active':index===activeTabIndex}" v-for="(item, index) in tabBar" :key="index" @click="tabTap(index, item.id)">{{item.name}}</li>
      </ul>
    </div>
    <!-- list -->
    <div class="list">
      <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
        <li v-for="(item, index) in orderList" :key="index">
          <div class="order-no">
            <div class="no">订单号：{{item.orderNo}}</div>
            <div class="ste">
              ¥{{item.orderTotalAmount}}
              <!-- <div :class="{gray: item.orderStatus === 5}" @click="orderAction(item)">{{item.orderStatus | orderStatus}}</div> -->
              <!-- <div  @click="orderAction(item)" v-if="item.orderStatus !== 5">{{item.orderStatus | orderStatus}}</div> -->
            </div>
          </div>
          <div class="order-con" @click="orderAction(item)">
            <div class="img">
              <img :src="item.mainImageUrl">
            </div>
            <div class="content">
              <p>{{item.setMealName}}</p>
              <p>{{item.simpleDescription}}</p>
            </div>
          </div>
          <div class="order-msg">
            <div class="amount">
              <p>¥{{item.orderTotalAmount}}</p>
              <p>实付金额：<span>{{item.orderAmount}}</span></p>
            </div>
            <div class="address">
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icondizhi"></use>
                </svg>
              </div>
              <div>{{item.customerAddress}}</div>
            </div>
          </div>
        </li>
        <van-loading size="24px" v-if="showLoading" class="listLoading">加载中...</van-loading>
        <!-- 无数据 -->
        <no-data v-if="noData" :data="noDataObj"></no-data>
      </ul>
    </div>
  </div>
</template>

<script>
import { Loading, Dialog } from 'vant'
import noData from '../../components/noData'
export default {
  components: {
    [Loading.name]: Loading,
    [Dialog.name]: Dialog,
    noData
  },
  data () {
    return {
      activeTabIndex: 0,
      tabBar: [                                             // tabBar
        {
          name: '全部',
          id: ''
        },
        {
          name: '待付款',
          id: '1'
        },
        {
          name: '待发货',
          id: '2'
        },
        {
          name: '待收货',
          id: '3'
        },
        {
          name: '已完成',
          id: '5'
        }
      ],
      busy: false,
      noData: false,                            // 无数据状态
      noDataObj: {
        icon: require('../../assets/images/no-order.png'),
        txt: '暂无订单'
      },
      showLoading: false,                       // 是否显示加载loading
      orderList: [],
      orderStatus: '',
      start: 1,
      pageSize: 10,
      totalPage: 0,
      cover: false
    }
  },
  mounted () {
    this.getOrderList()
  },
  methods: {
    /**
     * tab 点击
    */
    tabTap (index, id) {
      this.cover = true
      this.showLoading = false
      this.start = 1
      this.activeTabIndex = index
      this.orderStatus = id
      this.orderList = []
      this.getOrderList()
    },
    /**
     * 订单状态点击
    */
    orderAction (item) {
      if (parseInt(item.orderStatus) === 1) {                   // 待付款
        // this.$router.push({path: '/pay/orderPay', query: {orderNo: item.orderNo}})
        localStorage.setItem('orderNo', item.orderNo)
        localStorage.setItem('orderId', item.orderId)
        localStorage.setItem('orderAmount', item.orderTotalAmount)
        // this.$router.push({path: '/pay/orderPay', query: {redirect: 'gopay'}})
        window.location.href = window.location.href.match(/.*lzwl-points/gi)[0] + '/pay/orderPay?redirect=gopay'
      } if (parseInt(item.orderStatus) === 2) {                 // 待发货
        Dialog.confirm({
          title: '发货提醒',
          message: '您好，已帮您通知客服尽快发货。'
        }).then(() => {
          this.$toast('催单成功')
        }).catch(() => {
        })
      } if (parseInt(item.orderStatus) === 3) {                 // 待收货
        Dialog.confirm({
          title: '确认收货',
          message: '确认已收到货，完成此订单'
        }).then(() => {
          this.confirmRecieveGoods(item)
        }).catch(() => {
        })
      } if (parseInt(item.orderStatus) === 5) {                 // 已完成
        Dialog.confirm({
          title: '确认关闭',
          message: '确认关闭订单'
        }).then(() => {
          this.closeGoods(item)
        }).catch(() => {
        })
      }
    },
    /**
     * 确认收货
    */
    async confirmRecieveGoods (item) {
      let result = await this.$http.post(`${this.api.confirmRecieveGoods}`, {
        orderId: item.orderId
      })
      if (result.data.status === this.api.ERR_OK) {
        this.$toast('确认收货成功')
        this.start = 1
        this.cover = true
        this.getOrderList() // 重新加载数据
        return
      }
      this.$toast(result.data.msg)
    },
    /**
     * 关闭订单
    */
    async closeGoods (item) {
      let result = await this.$http.post(`${this.api.closeGoods}`, {
        orderId: item.orderId
      })
      if (result.data.status === this.api.ERR_OK) {
        this.$toast('关闭订单成功')
        this.start = 1
        this.cover = true
        this.getOrderList() // 重新加载数据
        return
      }
      this.$toast(result.data.msg)
    },
    /**
     * 获取订单列表
    */
    async getOrderList () {
      let result = await this.$http.post(`${this.api.getSetMealOrderList}`, {
        start: this.start,
        pageSize: this.pageSize,
        orderStatus: this.orderStatus
      })
      if (result.data.status === this.api.ERR_OK) {
        this.busy = false // 重置busy状态
        this.orderList = this.cover ? result.data.data.list : this.orderList.concat(result.data.data.list)
        this.totalPage = result.data.data.pages
        this.start = this.start + 1 // 当前页数
        this.noData = result.data.data.list.length > 0 ? 0 : 1
        return
      }
      this.noData = true
    },
    /**
     * 分页
    */
    async loadMore () {
      this.cover = false
      this.busy = true // 加载状态
      this.showLoading = true
      if (parseInt(this.start) > parseInt(this.totalPage)) {
        this.showLoading = false
        return
      }
      this.getOrderList()    // 分页数据
    }
  }
}
</script>
<style lang="less" scoped>
.order-wrap{
  height: calc(100vh - 1rem);
  overflow: auto;
  background: #1c1e3a;
  // tab切换
  .tab{
    ul{
      display: flex;
      li{
        height: 75px;
        line-height: 75px;
        flex: 1;
        text-align: center;
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        &.active{
          border-bottom:2px solid #67B5B9;
          color: #67B5B9;
        }
      }
    }
  }
  // list
  .list{
    ul{
      height: calc(100vh - 77px - 100px - 20px);
      padding-bottom: 20px;
      overflow: auto;
      li{
        width: 7rem;
        margin: 0.2rem auto;
        background: rgba(42, 49, 84, 0.6);
        border-radius: 0.07rem;
        padding: 0 0.26rem;
        box-sizing: border-box;
        text-align: left;
        .order-no{
          display: flex;
          justify-content: space-between;
          height: 96px;
          color: #fff;
          font-size: 30px;
          align-items: center;
          .no{
            font-size: 26px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 75%;
          }
          .ste{
            div{
              width:144px;
              height:47px;
              line-height: 47px;
              text-align: center;
              font-size: 26px;
              background:rgba(103,181,185,1);
              border-radius:24px;
              cursor: pointer;
              &.gray{
                background: #A8A7A7;
              }
            }
          }
        }
        .order-con{
          display: flex;
          align-items: center;
          .img{
            width: 104px;
            height: 104px;
            margin-right: 21px;
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .content{
            flex: 1;
            overflow: hidden;
            color: #fff;
            border-bottom: 1px solid #2A3154;
            padding: 0 0 30px 0;
            p:nth-child(1){
              font-size: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            p:nth-child(2){
              font-size: 22px;
              margin-top: 12px;
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
        }
        .order-msg{
          display: flex;
          justify-content: space-between;
          padding: 19px 0;
          .amount{
            flex: 1;
            p:nth-child(1){
              font-size: 30px;
              color: #E12727;
              margin-bottom: 5px;
            }
            p:nth-child(2){
              font-size: 30px;
              color: #fff;
              span{
                color:#E12727;
              }
            }
          }
          .address{
            display: flex;
            flex: 1;
            align-items: center;
            color: #fff;
            font-size: 22px;
            svg{
              width: 32px;
              height: 44px;
              fill: #fff;
              margin-right: 15px;
            }
            div:nth-child(2){
              display: -webkit-box;
              display: box;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }
    }
  }
}
</style>
