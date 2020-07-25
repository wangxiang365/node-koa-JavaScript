<template>
  <div class="myIncome-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <div class="cntent">
      <div>
        <p>{{profitTotal | money(true)}}</p>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconqiandai1"></use>
          </svg>
          账户余额
        </p>
      </div>
      <div class="withdrawal">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icontixian"></use>
        </svg>
        <span @click="withdrawal">提现</span>
      </div>
    </div>
    <div class="list">
      <h2>交易明细</h2>
      <ul>
        <li v-for="(item, index) in profitList" :key="index">
          <div>
            <p>{{item.addTime | filterDate}}</p>
            <p>{{item.dataName}}</p>
          </div>
          <div>余额</div>
          <div>{{item.propertyAmount}}</div>
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
      profitList: [],
      start: 1,
      pageSize: 12,
      profitTotal: 0,
      totalPage: 0,
      noData: false,
      noDataObj: {
        icon: require('../../../assets/images/my/no-data.png'),
        txt: '暂无数据'
      },
      showLoading: false                      // 是否显示加载loading
    }
  },
  async mounted () {
    await this.getSysDictionaryList()
    this.getMemberPointsDetaiNum()
    this.getMemberPointsDetailList()
  },
  methods: {
    /**
     * 提现设置
    */
    getSettleSet () {
      return new Promise((resolve, reject) => {
        this.$http.get(this.api.getSettleSet, {
        }).then((res) => {
          let resData = res.data
          if (resData.status === this.api.ERR_OK) {
            resolve(resData)
          } else {
            this.$toast(resData.msg)
          }
        })
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
            resolve(resData)
          } else {
            this.$toast(resData.msg)
          }
        })
      })
    },
    /**
     * 余额
    */
    async getMemberPointsDetaiNum () {
      let result = await this.$http.get(`${this.api.getMemberPointsDetaiNum}`)
      if (result.data.status === this.api.ERR_OK) {
        this.profitTotal = result.data.data
      }
    },
    /**
     * 引起资金账户变动的明细类别
    */
    async getSysDictionaryList () {
      let result = await this.$http.get(`${this.api.getSysDictionaryList}`, {
        params: {
          dataType: 1
        }
      })
      if (result.data.status === this.api.ERR_OK) {
        this.sysDictionaryList = result.data.data
      }
    },
    /**
     * 我的收益列表
    */
    async getMemberPointsDetailList () {
      let result = await this.$http.post(`${this.api.getMemberPointsDetailList}`, {
        start: this.start,
        pageSize: this.pageSize
      })
      if (result.data.status === this.api.ERR_OK) {
        this.busy = false // 重置busy状态
        this.profitList = this.profitList.concat(result.data.data.list)
        this.profitList.forEach((item) => {
          let data = this.sysDictionaryList.filter(row => parseInt(row.dataCode) === parseInt(item.addSource))
          this.$set(item, 'dataName', data.length > 0 ? data[0].dataValue : '--')
          if (item.propertyAmount.toString().includes('-') || item.propertyAmount.toString().includes('+')) {
          } else {
            item.propertyAmount = '+' + item.propertyAmount
          }
        })
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
     * 分页
    */
    async loadMore () {
      this.busy = true // 加载状态
      this.showLoading = true
      if (parseInt(this.start) > parseInt(this.totalPage)) {
        this.showLoading = false
        return
      }
      this.getMemberPointsDetailList()    // 分页数据
    },
    /**
     * 提现
    */
    async withdrawal () {
      let cycleNumber = await this.getWithdrawalCycleNumber()     // 提现次数
      let cycSet = await this.getSettleSet()                      // 提现设置
      var tips = parseInt(cycSet.data.withdrawalCycle) === 1 ? '今天|明天' : parseInt(cycSet.data.withdrawalCycle) === 2 ? '本周|下周' : parseInt(cycSet.data.withdrawalCycle) === 3 ? '本月|下月' : ''
      if (cycSet.data.cycleNumber !== -1) {                       // -1为不限提现次数
        if (cycleNumber.data >= cycSet.data.cycleNumber) {
          Dialog.confirm({
            title: '提现提醒',
            message: `您${tips.split('|')[0]}的提现次数已经用完，请在${tips.split('|')[1]}再尝试操作。`,
            showCancelButton: false,
            confirmButtonText: '确定'
          }).then(() => {
          }).catch(() => {
          })
        } else {
          this.$router.push('/my/cashWithdrawal')
        }
      } else {
        this.$router.push('/my/cashWithdrawal')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.myIncome-wrap{
  min-height: calc(100vh - 1rem);
  overflow: hidden;
  background: #1c1e3a;
  .cntent{
    padding: 102px 0 79px 0;
    width:750px;
    background:linear-gradient(-53deg,rgba(220,135,113,1),rgba(225,39,39,1));
    display: flex;
    justify-content: center;
    position: relative;
    div{
      flex: 1;
      text-align: center;
      p:nth-child(1){
        font-size: 60px;
        color: #fff;
        span{
          font-size: 24px;
        }
      }
      p:nth-child(2){
        color: #fff;
        font-size: 28px;
        margin-top: 40px;
        svg{
          width: 34px;
          height: 32px;
          vertical-align: text-top;
          fill: #fff;
        }
      }
    }
    .withdrawal{
      position: absolute;
      top: 35px;
      right: 31px;
      font-size: 24px;
      color: #fff;
      cursor: pointer;
      svg{
        width: 28px;
        height: 27px;
        fill: #fff;
        margin-right: 12px;
        vertical-align: text-top;
      }
      span{
        vertical-align: middle;
      }
    }
  }
  // list
  .list{
    width: 700px;
    margin: 20px auto;
    background: rgba(42, 49, 84, 0.6);
    border-radius: 7px;
    padding: 0 26px;
    box-sizing: border-box;
    text-align: left;
    h2{
      font-size: 28px;
      color: #67B5B9;
      padding: 26px;
      border-bottom: 1px solid #2A3154;
    }
    ul{
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px;
        border-bottom: 1px solid #2A3154;
        div{
          color: #fff;
          font-size: 28px;
          &:nth-child(3){
            color: #E12727;
          }
        }
      }
    }
  }
}
</style>
