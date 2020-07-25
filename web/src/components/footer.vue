<template>
  <div>
    <div style="height: 1rem;"></div>
    <div class="footer">
      <ul>
        <li>
          <router-link to="/index">
            <img src="../assets/images/home.png">
            <img src="../assets/images/home_active.png">
            <div>首页</div>
          </router-link>
        </li>
        <li>
          <router-link to="/message">
            <img src="../assets/images/message.png">
            <img src="../assets/images/message_active.png">
            <div>消息</div>
          </router-link>
        </li>
        <li>
          <router-link to="/order">
            <p>
              <img src="../assets/images/order.png">
              <img src="../assets/images/order_active.png">
            </p>
            <div>订单</div>
          </router-link>
        </li>
        <li>
          <router-link to="/my">
            <img src="../assets/images/perCenter.png">
            <img src="../assets/images/perCenter_active.png">
            <div>我的</div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['route'],
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
.footer{
  width:7.5rem;
  height: 1rem;
  background:#1c1e3a;
  font-size:.22rem;
  font-family:"微软雅黑";
  position:fixed;
  bottom:0;
  z-index:2000;
  box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
  box-shadow:0px 0 13px 0px rgba(0, 0, 0, 0.45);
  ul{
    display:box;
    display:-webkit-box;
    display:-moz-box;
    display:-ms-box;
    display:-o-box;
    color:#fff;
    background:none;
    li{
      box-flex:1;
      -webkit-box-flex:1;
      -moz-box-flex:1;
      -ms-box-flex:1;
      -o-box-flex:1;
      text-align:center;
      list-style: none;
      a{
        color:#fff;
        display:block;
        img:nth-child(1){
          display: block;
        }
        img:nth-child(2){
          display: none;
        }
        &.active img:nth-child(1){
          display: none;
        }
        &.active img:nth-child(2){
          display: block;
        }
        &.active div{
          color: #8DD2D6;
        }
      }
      p{
        width:.45rem;
        height:.45rem;
        margin: 0 auto;
        position: relative;
        i{
          display: block;
          text-align: center;
          background: #fff;
          border: 1px solid #f23030;
          color: #f23030;
          font-size: .22rem;
          height: .26rem;
          line-height: .26rem;
          border-radius: .18rem;
          padding: 0 .07rem;
          background-clip: padding-box;
          position: absolute;
          top: 0;
          left: .3rem;
        }
      }
      img{
        width:.45rem;
        height:.45rem;
        margin: 0 auto;
        margin-top:.08rem;
        margin-bottom:1px;
        vertical-align:top;
      }
      @media screen and (max-width: 320px) {
        img{
          margin-bottom:0px;
        }
      }
      @media screen and (min-width:321px) and (max-width:375px) {
        img{
          margin-bottom:2px;
        }
      }
    }
  }
}
.footer_d{
  height:1.03rem;
}
</style>
