<template>
  <div class="teamManage-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <div class="num">
      <p>{{teamTotal.recommendCountTotal | thousandBit}}<span>人</span></p>
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconzongrenshu"></use>
        </svg>
        团队总人数
      </p>
    </div>
    <div class="list">
      <h2>
        我邀请的成员</h2>
      <ul>
        <li v-for="(item, index) in teamList" :key="index">
          <div>{{item.cardName || '未实名'}}</div>
          <div>{{item.phone}}</div>
          <div>
            <a :href="'tel:' + item.phone">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconphone_1"></use>
              </svg>
            </a>
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
      teamList: [],
      start: 1,
      pageSize: 10,
      teamTotal: 0,
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
    this.getRecommendCountTotal()
    this.getRecommendRelationList()
  },
  methods: {
    /**
     * 团队-统计
    */
    async getRecommendCountTotal () {
      let result = await this.$http.get(`${this.api.getRecommendCountTotal}`)
      if (result.data.status === this.api.ERR_OK) {
        this.teamTotal = result.data.data
      }
    },
    /**
     * 我的推荐列表
    */
    async getRecommendRelationList () {
      let result = await this.$http.post(`${this.api.getRecommendRelationList}`, {
        start: this.start,
        pageSize: this.pageSize
      })
      if (result.data.status === this.api.ERR_OK) {
        this.busy = false // 重置busy状态
        this.teamList = this.teamList.concat(result.data.data.list)
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
      this.getRecommendRelationList()    // 分页数据
    }
  }
}
</script>
<style lang="less" scoped>
.teamManage-wrap{
  min-height: calc(100vh - 1rem);
  overflow: hidden;
  background: #1c1e3a;
  .num{
    width:750px;
    height:296px;
    background:linear-gradient(-53deg,rgba(208,61,121,1),rgba(233,105,157,1));
    p:nth-child(1){
      padding: 102px 0 34px 0;
      font-size: 60px;
      color: #fff;
      span{
        font-size: 24px;
      }
    }
    p:nth-child(2){
      padding-bottom: 79px;
      color: #fff;
      font-size: 28px;
      svg{
        width: 34px;
        height: 32px;
        vertical-align: text-top;
        fill: #fff;
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
        padding: 30px;
        border-bottom: 1px solid #2A3154;
        div{
          color: #fff;
          font-size: 28px;
          &:nth-child(1){
            margin-right: 66px;
          }
          &:nth-child(2){
            flex: 1;
          }
        }
        svg{
          width: 41px;
          height: 41px;
          fill: #D2417C;
        }
      }
    }
  }
}
</style>
