<template>
  <div class="cashCoupon-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <ul>
      <li v-for="(item, index) in couponList" :key="index" @click="delCoypon(item, index)">
        <div class="amount" :class="{'disabled':(item.now > item.effectiveEndTime || item.couponStatus === 1|| item.couponStatus === 2)}">
          <p><span>￥</span>{{item.amount}}</p>
          <p>抵扣现金</p>
        </div>
        <div class="use">
          <p>可用于订购套餐使用</p>
          <p v-if="item.now <= item.effectiveEndTime && item.couponStatus !== 2">{{item.effectiveStartTime | filterDate('YYYY年MM月DD日')}}-{{item.effectiveEndTime | filterDate('YYYY年MM月DD日')}}</p>
          <p v-if="item.couponStatus === 2">已使用</p>
          <p v-if="item.now > item.effectiveEndTime" class="overdue">已过期</p>
        </div>
      </li>
      <van-loading size="24px" v-if="showLoading" class="listLoading">加载中...</van-loading>
      <!-- 无数据 -->
      <no-data v-if="noData" :data="noDataObj"></no-data>
    </ul>
  </div>
</template>

<script>
import { Loading, Dialog } from 'vant'
import noData from '../../../components/noData'
export default {
  components: {
    [Loading.name]: Loading,
    [Dialog.name]: Dialog,
    noData
  },
  data () {
    return {
      busy: false,
      couponList: [],
      start: 1,
      pageSize: 10,
      messageList: [],
      totalPage: 0,
      noData: false,
      noDataObj: {
        icon: require('../../../assets/images/my/no-data.png'),
        txt: '暂无数据'
      },
      showLoading: false                      // 是否显示加载loading
    }
  },
  mounted () {
    this.getMemberCouponList()                // 代金券列表
  },
  methods: {
    /**
     * 代金券列表
    */
    async getMemberCouponList () {
      let result = await this.$http.post(this.api.getMemberCouponList, {
        start: this.start,
        pageSize: this.pageSize
      })
      if (result.data.status === this.api.ERR_OK) {
        this.busy = false // 重置busy状态
        this.couponList = this.couponList.concat(result.data.data.list)
        this.totalPage = result.data.data.pages
        this.start = this.start + 1 // 当前页数
        this.noData = result.data.data.list.length > 0 ? 0 : 1
        return
      } else {
        this.noData = 1
      }
      this.$toast(result.data.msg)
    },
    /**
     * 删除优惠券
    */
    delCoypon (item, index) {
      if (item.now > item.effectiveEndTime || item.couponStatus === 2) {
        Dialog.confirm({
          title: '确认删除',
          message: '确认删除代金券?'
        }).then(async () => {
          let result = await this.$http.post(this.api.deleteMemberCoupon, {
            cuserId: item.id
          })
          if (result.data.status === this.api.ERR_OK) {
            this.couponList.splice(index, 1)
            return
          }
          this.$toast(result.data.msg)
        }).catch(() => {
        })
      }
    },
    /**
     * 分页
    */
    async loadMore () {
      this.busy = true // 加载状态
      this.showLoading = true
      if (parseInt(this.start) > parseInt(this.totalPage)) {
        this.showLoading = false
        return
      }
      this.getMemberCouponList()    // 分页数据
    }
  }
}
</script>
<style lang="less" scoped>
.cashCoupon-wrap{
  padding-bottom: 20px;
  min-height: calc(100vh);
  background: #1c1e3a;
  box-sizing: border-box;
  overflow: hidden;
  ul{
    li{
      position: relative;
      width:700px;
      height:131px;
      background:rgba(33,38,67,1);
      border-radius:10px;
      margin: 0 auto;
      display: flex;
      margin-top: 26px;
      .amount{
        width:194px;
        height:131px;
        background:linear-gradient(0deg,rgba(252,193,66,1),rgba(226,115,154,1));
        border-radius:10px;
        margin-right: 26px;
        p:nth-child(1){
          font-size: 50px;
          color: #fff;
          margin-top: 22px;
          span{
            font-size: 24px;
          }
        }
        p:nth-child(2){
          font-size: 26px;
          color: #fff;
        }
        &.disabled{
          background: #B7B7B7;
        }
      }
      .use{
        padding-right: 27px;
        flex: 1;
        overflow: hidden;
        text-align: left;
        p{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p:nth-child(1){
          font-size: 26px;
          color: #fff;
          border-bottom: 1px solid #2A3154;
          padding: 20px 0;
        }
        p:nth-child(2){
          font-size: 24px;
          color: #fff;
          margin-top: 13px;
          &.overdue{
            color: #E12727;
          }
        }
      }
    }
  }
}
</style>
