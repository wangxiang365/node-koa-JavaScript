<template>
  <div class="cashWithdrawalSuccess-wrap">
    <img src="../../assets/images/paySuccess.png">
    <div class="tip">订单支付成功</div>
    <div class="goOrder">查看，<span @click="$router.replace('/order')">我的订单</span></div>
  </div>
</template>

<script>
import { Button } from 'vant'
export default {
  components: {
    [Button.name]: Button
  },
  data () {
    return {
    }
  },
  computed: {
  },
  async mounted () {
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
.cashWithdrawalSuccess-wrap{
  height: calc(100vh);
  overflow: auto;
  background: #1C1E3A;
  img{
    width:254px;
    height:242px;
    margin-top: 35%;
  }
  .tip{
    font-size: 28px;
    color: #fff;
    margin: 54px 0 16px 0;
  }
  button{
    width:622px;
    height:81px;
    background:rgba(105,129,251,1);
    border-radius:10px;
    border: none;
    font-size: 28px;
  }
  .goOrder{
    color: #fff;
    font-size: 28px;
    margin-bottom: 50px;
    span{
      color: #6981FB;
      cursor: pointer;
    }
  }
}
</style>
