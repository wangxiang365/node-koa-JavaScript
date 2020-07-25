<template>
  <div class="my-wrap">
    <!-- user -->
    <div class="user">
      <img :src="memberCashPointsAndcoupon.ruleIcon" v-if="memberCashPointsAndcoupon.rand"/>
      <div v-if="memberCashPointsAndcoupon.agentRand && memberCashPointsAndcoupon.agentRand !== '' && memberCashPointsAndcoupon.agentRand !== 1" class="address">({{memberCashPointsAndcoupon.agentAddress}})</div>
      <svg class="icon setting" aria-hidden="true" @click="$router.push('/my/setting')">
        <use xlink:href="#iconsetting"></use>
      </svg>
      <div class="btn upgrade" @click="$router.push('/index')" v-if="memberCashPointsAndcoupon.rand === 1">升级</div>
      <div class="btn share" v-else @click="showCode = true">
        <p>
          <svg class="icon" aria-hidden="true" v-if="memberCashPointsAndcoupon.rand !== 1">
            <use xlink:href="#iconerweima"></use>
          </svg>
        </p>
        <p>邀请好友</p>
      </div>
    </div>
    <!-- 钱包 -->
    <div class="wallet">
      <ul>
        <li @click="$router.push('/my/myIncome')">
          <p>￥{{memberCashPointsAndcoupon.cashPoints | money}}</p>
          <p>余额</p>
        </li>
        <li @click="$router.push('/my/cashCoupon')">
          <p>{{memberCashPointsAndcoupon.amountCoupon}}元</p>
          <p>代金券</p>
        </li>
        <li>
          <p>
            <svg class="icon setting" aria-hidden="true">
              <use xlink:href="#icontixian"></use>
            </svg>
          </p>
          <p>我的钱包</p>
        </li>
      </ul>
    </div>
    <!-- 业务 -->
    <div class="myBusiness">
      <div class="title">我的业务</div>
      <ul>
        <li @click="$router.push('/my/myReferrals')">
          <svg class="icon setting" aria-hidden="true">
            <use xlink:href="#icontuijian"></use>
          </svg>
          <p>我的推荐</p>
        </li>
        <li @click="$router.push('/my/teamManage')">
          <svg class="icon setting" aria-hidden="true">
            <use xlink:href="#icontuanduiguanli"></use>
          </svg>
          <p>团队管理</p>
        </li>
        <li @click="$router.push('/my/performanceStatistics')">
          <svg class="icon setting" aria-hidden="true">
            <use xlink:href="#iconyeji"></use>
          </svg>
          <p>业绩统计</p>
        </li>
        <li @click="$router.push('/my/myIncome')">
          <svg class="icon setting" aria-hidden="true">
            <use xlink:href="#iconshouyi"></use>
          </svg>
          <p>我的收益</p>
        </li>
      </ul>
    </div>
    <!-- 分享二维码 -->
    <van-dialog
      v-model="showCode"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
      className="sharePop"
    >
    <div class="qrcode-box">
      <div id="qrcode" ref="qrcode" style="width:3.32rem;height:3.32rem;margin:0 auto;">
      </div>
      <div class="code-msg">
        <p>{{userInfo.invicationCode}}</p>
        <p>{{userInfo.phone | filterPhone}}</p>
      </div>
    </div>
      <div class="link" v-bind:data-clipboard-text="codeUrl"><span>链接推荐: {{codeUrl}}</span><span>复制连接</span></div>
      <van-button type="primary" @click="showCode = false" class="btn">确定</van-button>
    </van-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import Clipboard from 'clipboard' // 复制
import { Button, Dialog } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component
  },
  data () {
    return {
      userInfo: '',                                                    // 用户信息
      codeUrl: '',
      showCode: false,
      memberCashPointsAndcoupon: ''                                     // 会员余额等
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
    this.codeUrl = `${window.location.href.match(/.*lzwl-points/gi)[0]}/register?invitationCode=${this.userInfo.phone}`
    this.getMemberCashPointsAndcoupon()
    /**
     * 复制链接到粘贴板
     */
    const clipboard = new Clipboard('.link')
    clipboard.on('success', (e) => {
      this.$toast('复制成功')
    })
  },
  watch: {
    showCode (val) {
      if (val) {
        this.$nextTick(() => {
          document.getElementById('qrcode').innerHTML = ''
          this.qrcode()
        })
      }
    }
  },
  methods: {
    /**
     * 会员余额等
    */
    async getMemberCashPointsAndcoupon () {
      let result = await this.$http.get(this.api.getMemberCashPointsAndcoupon)
      if (result.data.status === this.api.ERR_OK) {
        this.memberCashPointsAndcoupon = result.data.data
      }
    },
    /**
     * 生成二维码
    */
    qrcode () {
      return new QRCode(document.getElementById('qrcode'), {
        width: 300,  // 设置宽度
        height: 300, // 设置高度
        colorDark: '#6981FB', //二维码颜色
        text: this.codeUrl
      })
    }
  }
}
</script>
<style lang="less">
.my-wrap{
  min-height: calc(100vh - 1rem);
  overflow: auto;
  background: #1c1e3a;
  // user
  .user{
    width: 658px;
    height: 369px;
    margin: 0 auto;
    margin-top: 43px;
    margin-bottom: 24px;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    .address{
      position: absolute;
      top: 47px;
      left: 280px;
      font-size: 26px;
      color: #fff;
    }
    .setting{
      width: 40px;
      height: 40px;
      fill: #fff;
      position: absolute;
      right: 22px;
      top: 22px;
      cursor: pointer;
    }
    .btn{
      position: absolute;
      right: 25px;
      bottom: 75px;
    }
    .upgrade{
      width:95px;
      height:37px;
      line-height: 37px;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background:rgba(248,249,250,1);
      border-radius:10px;
      font-size: 22px;
      color: #A975FC;
      cursor: pointer;
    }
    .share{
      cursor: pointer;
      user-select: none;
      bottom: 50px;
      svg{
        width: 49px;
        height: 49px;
        fill: #fff;
      }
      color: #ffffff;
      font-size: 18px;
    }
  }
  // 钱包
  .wallet{
    background: rgba(42, 49, 84, 0.6);
    height: 109px;
    padding: 19px 0 26px 0;
    ul{
      display: flex;
      align-items: center;
      li{
        flex: 1;
        cursor: pointer;
        svg{
          width:69px;
          height:57px;
          fill: #67B5B9
        }
        &:nth-child(1){
          color: #E12727;
          font-size: 32px;
        }
        &:nth-child(2){
          color: #FFA247;
          font-size: 32px;
        }
        &:nth-child(3){
          border-left: 1px solid #2A3154;
          color: #67B5B9;
          font-size: 28px;
        }
      }
    }
  }
  // 业务
  .myBusiness{
    width: 7rem;
    margin: 0.2rem auto;
    background: rgba(42, 49, 84, 0.6);
    border-radius: 0.07rem;
    padding: 0 36px;
    box-sizing: border-box;
    text-align: left;
    .title{
      font-size: 0.28rem;
      color: #fff;
      padding: 0.26rem 0;
      border-bottom: 0.01rem solid #2A3154;
    }
    ul{
      background: rgba(42, 49, 84, 0.6);
      height: auto;
      overflow: hidden;
      margin: 20px 0;
      li{
        float: left;
        width: 158px;
        height: 158px;
        border-radius:20px;
        margin-right: 76px;
        text-align: center;
        margin-bottom: 45px;
        cursor: pointer;
        &:nth-child(1){
          background:linear-gradient(-53deg,rgba(98,213,92,1),rgba(104,220,97,1));
        }
        &:nth-child(2){
          background:linear-gradient(-53deg,rgba(229,39,121,1),rgba(227,40,123,1));
        }
        &:nth-child(3){
          background:linear-gradient(-53deg,rgba(73,187,215,1),rgba(73,187,213,1));
        }
        &:nth-child(4){
          background: #697be7;
        }
        p{
          font-size: 26px;
          color: #fff;
        }
        svg{
          width: 85px;
          height: 85px;
          margin-top: 16px;
          fill: #fff;
        }
        &:nth-child(3n){
          margin-right: 0;
        }
      }
    }
  }
  // 二维码分享
  .sharePop{
    width: 494px;
    display: flex;
    justify-content: center;
    .van-dialog__content{
      // width: 300px;
    }
    .qrcode-box{
      width: 332px;
      height: 332px;
      margin: 0 auto;
      margin-top: 0.46rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      .code-msg{
        padding: 5px 7px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 3px 0px rgba(60,80,184,0.34);
        border-radius:10px;
        position: relative;
        z-index: 2000;
        p{
          color: #0E0E0E;
          font-size: 20px;
          &:nth-child(1){
            margin-top: 10px;
          }
        }
      }
    }
    #qrcode{
      width: 332px;
      height: 332px;
      position: absolute;
      left: 0;
      top: 0;
      margin: 0 auto;
      canvas{
        width: 332px;
        height: 332px;
      }
      img{
        width: 332px;
        height: 332px;
        display: block;
        overflow: hidden;
      }
    }
    img{
      width: 256px;
      height: 256px;
      margin: 0 auto 23px auto;
    }
    .link{
      width:332px;
      height:40px;
      margin: 0 auto;
      cursor: pointer;
      margin-top: 25px;
      line-height: 40px;
      padding-left: 10px;
      background:linear-gradient(90deg,rgba(119,141,255,1),rgba(105,129,251,1));
      border-radius:20px;
      font-size: 20px;
      color: #fff;
      display: flex;
      span{
        &:nth-child(1){
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-child(2){
          position: relative;
          z-index: 3000;
          background: #fff;
          color: #03111d;
          border-radius: 20px;
          font-size: 20px;
          width: 110px;
          height: 40px;
          border: 1px solid #6981fb;
        }
      }
    }
    button{
      width:118px;
      height:40px;
      font-size: 22px;
      line-height: 40px;
      background:rgba(105,129,251,1);
      border-radius:20px;
      margin: 24px 0 39px 0;
    }
  }
}
</style>
