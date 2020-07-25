<template>
  <div class="performanceStatistics-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <div class="cntent">
      <div>
        <p>￥{{achievementTotal | money}}</p>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconqiandai1"></use>
          </svg>
          业绩总数
        </p>
      </div>
      <div class="screen">
        <div @click="filterType = 1, showFilter = true, filterList = achievementTypeList">
          <p>{{selectAchievementType.name || '请选择'}}</p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconshangxiajiantou"></use>
          </svg>
        </div>
        <div @click="filterType = 2, showFilter = true, filterList = timeTypeList">
          <p>{{selectTimeType.name || '请选择'}}</p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconshangxiajiantou"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="list">
      <h2>业绩明细</h2>
      <ul>
        <li v-for="(item, index) in achievementList" :key="index">
          <div>
            <p>{{item.orderTime | filterDateTime}}</p>
            <p>{{item.phone | filterPhone}}</p>
          </div>
          <div>{{item.setMealName}}</div>
          <div>+{{item.orderAmount}}</div>
        </li>
        <van-loading size="24px" v-if="showLoading" class="listLoading">加载中...</van-loading>
        <!-- 无数据 -->
        <no-data v-if="noData" :data="noDataObj"></no-data>
      </ul>
    </div>
    <!-- 性别选择 -->
    <van-action-sheet v-model="showFilter" :actions="filterList" @select="selectFilter" title="请选择" :round="false"/>
  </div>
</template>
<script>
import { Loading, Dialog, ActionSheet } from 'vant'
import noData from '../../../components/noData'
export default {
  components: {
    [Loading.name]: Loading,
    [Dialog.name]: Dialog,
    [ActionSheet.name]: ActionSheet,
    noData
  },
  data () {
    return {
      achievementType: 1,                   // 业绩类型1个人 2 团队
      selectAchievementType: {
        name: '我的业绩',
        val: 1
      },
      timeType: 1,                          // 时长(1：15天、2：一个月、3：三个月、4：半年、5：一年)
      selectTimeType: {
        name: '最近15天',
        val: 1
      },
      busy: false,
      achievementList: [],
      start: 1,
      pageSize: 10,
      achievementTotal: 0,                    // 业绩总数
      totalPage: 0,
      noData: false,
      noDataObj: {
        icon: require('../../../assets/images/my/no-data.png'),
        txt: '暂无数据'
      },
      showLoading: false,                     // 是否显示加载loading
      showFilter: false,
      filterList: [],
      filterType: '',                         // 1 业绩类型 2 时长
      achievementTypeList: [                  // 统计type列表
        {
          name: '我的业绩',
          val: '1'
        },
        {
          name: '团队业绩',
          val: '2'
        }
      ],
      timeTypeList: [                      // 统计时间列表
        {
          name: '最近15天',
          val: '1'
        },
        {
          name: '近一个月',
          val: '2'
        },
        {
          name: '近三个月',
          val: '3'
        },
        {
          name: '近半年',
          val: '4'
        },
        {
          name: '近一年',
          val: '5'
        }
      ]
    }
  },
  mounted () {
    this.getOrderAchievementForUmbrellaSum()
    this.getOrderAchievementForUmbrella()
  },
  methods: {
    /**
     * 业绩总数
    */
    async getOrderAchievementForUmbrellaSum () {
      let result = await this.$http.post(`${this.api.getOrderAchievementForUmbrellaSum}`, {
        achievementType: this.selectAchievementType.val,
        timeType: this.selectTimeType.val
      })
      if (result.data.status === this.api.ERR_OK) {
        this.achievementTotal = result.data.data
      }
    },
    /**
     * 业绩统计列表
    */
    async getOrderAchievementForUmbrella () {
      let result = await this.$http.post(`${this.api.getOrderAchievementForUmbrella}`, {
        start: this.start,
        pageSize: this.pageSize,
        achievementType: this.selectAchievementType.val,
        timeType: this.selectTimeType.val
      })
      if (result.data.status === this.api.ERR_OK) {
        this.busy = false // 重置busy状态
        this.achievementList = this.achievementList.concat(result.data.data.list)
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
     * 列表筛选
    */
    selectFilter (val) {
      if (this.filterType === 1) {
        this.selectAchievementType = val
      } if (this.filterType === 2) {
        this.selectTimeType = val
      }
      this.start = 1
      this.achievementList = []
      this.getOrderAchievementForUmbrellaSum()
      this.getOrderAchievementForUmbrella()
      this.showFilter = false
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
      this.getOrderAchievementForUmbrella()    // 分页数据
    }
  }
}
</script>
<style lang="less" scoped>
.performanceStatistics-wrap{
  min-height: calc(100vh - 1rem);
  overflow: hidden;
  background: #1c1e3a;
  .cntent{
    padding: 102px 0 79px 0;
    width:750px;
    background:linear-gradient(-53deg,rgba(85,117,176,1),rgba(180,219,224,1));
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
    .screen{
      position: absolute;
      top: 34px;
      left: 26px;
      font-size: 24px;
      color: #fff;
      cursor: pointer;
      display: flex;
      div{
        width: 160px;
        height: 41px;
        position: relative;
        margin-right:18px;
        background: #fff;
        border-radius: 10px;
        p{
          background: #fff;
          border-radius: 10px;
          width: 130px;
          height: 41px;
          color: #7092BD;
          /* width: 26px; */
          border: none;
          appearance: none;
          -webkit-appearance:none;
          -moz-appearance:none;
          -ms-appearance:none;
          cursor: pointer;
          font-size: 22px;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        svg{
          width: 20px;
          height: 30px;
          fill: #7092BD;
          position: absolute;
          right: 11px;
          top: 0;
          bottom: 0;
          margin: auto;
          margin-left: 10px;
        }
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
          &:nth-child(1){
            p:nth-child(1){
              margin-bottom: 10px;
            }
          }
          &:nth-child(3){
            color: #E12727
          }
        }
      }
    }
  }
}
</style>
