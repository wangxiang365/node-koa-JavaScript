<template>
  <div class="message-wrap">
    <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <ul>
       <li v-for="(item, index) in messageList" :key="index">
         <div class="img">
           <img src="../../assets/images/messge-ico.png">
         </div>
         <div class="con">
           <p>{{item.infoTime | filterDate('YYYY-MM-DD HH:mm')}}</p>
           <p>{{item.content}}</p>
         </div>
       </li>
       <van-loading size="24px" v-if="showLoading">加载中...</van-loading>
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
      busy: false,
      start: 1,
      pageSize: 10,
      messageList: [],
      totalPage: 0,
      noData: false,
      noDataObj: {
        icon: require('../../assets/images/no-mesg.png'),
        txt: '暂无消息'
      },
      showLoading: false                      // 是否显示加载loading
    }
  },
  mounted () {
    this.getInfomationList()
  },
  methods: {
    /**
     * 获取列表
    */
    async getInfomationList () {
      let result = await this.$http.post(this.api.getInfomationList, {
        start: this.start,
        pageSize: this.pageSize
      })
      if (result.data.status === this.api.ERR_OK) {
        this.busy = false // 重置busy状态
        this.messageList = this.messageList.concat(result.data.data.list)
        this.totalPage = result.data.data.pages
        this.start = this.start + 1 // 当前页数
        this.noData = result.data.data.list.length > 0 ? 0 : 1
        return
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
      this.getInfomationList()    // 分页数据
    }
  }
}
</script>
<style lang="less" scoped>
.message-wrap{
  min-height: calc(100vh - 1rem);
  background: #1c1e3a;
  padding: 0.33rem 0.32rem 0.33rem 0.29rem;
  box-sizing: border-box;
  .list{
    ul{
      li{
        display: flex;
        background: rgba(42, 49, 84, 0.6);
        padding: 33px 45px;
        text-align: left;
        align-items: center;
        margin-bottom: 16px;
        .img{
          width: 66px;
          height: 66px;
          margin-right: 36px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .con{
          flex: 1;
          p:nth-child(1){
            color: #fff;
            font-size: 28px;
            margin-bottom: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p:nth-child(2){
            font-size: 26px;
            color: #9294BB;
            display: -webkit-box;
            display: -moz-box;
            display: box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            span{
              color: #E12727;
            }
          }
        }
      }
    }
  }
}
</style>
