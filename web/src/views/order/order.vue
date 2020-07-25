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
            <div class="amount">
              ¥{{item.orderTotalAmount}}
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
            <div class="address">
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icondizhi"></use>
                </svg>
              </div>
              <div>{{item.customerAddress}}</div>
            </div>
            <div class="btn">
              <!-- <div :class="{gray: item.orderStatus === 5}" @click="orderAction(item)">{{item.orderStatus | orderStatus}}</div> -->
              <div  @click="cancelOrder(item)" v-if="item.orderStatus === 1" class="gray">取消订单</div>
              <div  @click="viewLogistics(item)" v-if="item.orderStatus === 3">查看物流</div>
              <div  @click="orderAction(item)" v-if="parseInt(item.orderStatus) !== 5" :class="{nobg: parseInt(item.orderStatus) === 7}">{{item.orderStatus | orderStatus}}</div>
            </div>
          </div>
        </li>
        <van-loading size="24px" v-if="showLoading" class="listLoading">加载中...</van-loading>
        <!-- 无数据 -->
        <no-data v-if="noData" :data="noDataObj"></no-data>
        <!-- 查看物流 -->
        <van-dialog
          v-model="showLogistics"
          show-cancel-button
          className="logisticsBox"
          :showConfirmButton="false"
          :showCancelButton="false"
        >
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconkuaidi"></use>
          </svg>
          <div class="logis-title">您的快递信息</div>
          <div class="logis-msg">{{logisticsData.logisticsName}}: {{logisticsData.logisticsNumber}}</div>
          <div class="logis-btn">
            <van-button type="default" v-bind:data-clipboard-text="logisticsData.logisticsNumber" class="OddNumber">复制单号</van-button>
            <van-button type="primary" @click="showLogistics = false">确定</van-button>
          </div>
        </van-dialog>
      </ul>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard' // 复制
import { Loading, Dialog, Button } from 'vant'
import noData from '../../components/noData'
export default {
  components: {
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    noData,
    [Button.name]: Button
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
          name: '已取消',
          id: '7'
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
      cover: false,
      showLogistics: false,
      logisticsData: {}                         // 物流信息
    }
  },
  mounted () {
    this.getOrderList()
    /**
     * 复制链接到粘贴板
     */
    const clipboard = new Clipboard('.OddNumber')
    clipboard.on('success', (e) => {
      this.$toast('物流单号复制成功!')
      setTimeout(() => {
        this.showLogistics = false
      }, 200)
    })
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
        localStorage.setItem('orderAmount', item.orderAmount)
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
        // Dialog.confirm({
        //   title: '确认关闭',
        //   message: '确认关闭订单'
        // }).then(() => {
        //   this.closeGoods(item)
        // }).catch(() => {
        // })
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
     * 取消订单
    */
    async cancelOrder (item) {
      Dialog.confirm({
        title: '确认取消',
        message: '确认取消订单'
      }).then(async () => {
        let result = await this.$http.post(`${this.api.cancelOrder}`, {
          orderId: item.orderId
        })
        if (result.data.status === this.api.ERR_OK) {
          this.$toast('取消订单成功')
          this.start = 1
          this.cover = true
          this.getOrderList() // 重新加载数据
          return
        }
        this.$toast(result.data.msg)
      }).catch(() => {
      })
    },
    /**
     * 查看物流
    */
    viewLogistics (item) {
      this.showLogistics = true
      this.logisticsData = item
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
        font-size: 28px;
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
          .amount{
            color: #E12727;
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
          .btn{
            display: flex;
            div{
              color: #fff;
              width:144px;
              height:47px;
              line-height: 47px;
              text-align: center;
              font-size: 26px;
              background:#6981FB;
              border-radius:8px;
              cursor: pointer;
              margin-left: 19px;
              &.gray{
                background: #A8A7A7;
              }
              &.nobg{
                background: none;
                color: #A8A7A7;
              }
            }
          }
          .address{
            display: flex;
            flex: 0.6;
            align-items: center;
            color: #A5A5A5;
            font-size: 22px;
            svg{
              width: 32px;
              height: 44px;
              fill: #A5A5A5;
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
  // 查看物流
  .logisticsBox{
    width: 354px;
    border-radius: 10px;
    padding: 43px 70px;
    svg{
      width:147px;
      height:147px;
      fill:#6981FB;
    }
    .logis-title{
      font-size: 30px;
      color: #434343;
      margin: 32px 0;
    }
    .logis-msg{
      font-size: 24px;
      color: #6981FB;
      margin-bottom: 40px;
    }
    .logis-btn{
      display: flex;
      justify-content: space-between;
      button{
        line-height: 65px;
        color: #fff;
        border: none;
        cursor: pointer;
        &:nth-child(1){
          width:157px;
          height:65px;
          background:rgba(149,149,149,1);
          border-radius:10px;
        }
        &:nth-child(2){
          width:157px;
          height:65px;
          background:rgba(105,129,251,1);
          border-radius:10px;
        }
      }
    }
  }
}
</style>
