<template>
  <div class="cashWithdrawalSuccess-wrap">
    <img src="../../../assets/images/cashWithdrawalSuccess.png">
    <div class="tip">您已提交申请，系统审核中......</div>
    <van-button type="primary" @click="$router.replace('/my/myIncome')">确定</van-button>
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
  background: #1c1e3a;
  img{
    width:191px;
    height:140px;
    margin-top: 70px;
  }
  .tip{
    font-size: 36px;
    color: #DFE2F4;
    margin: 54px 0 64px 0;
  }
  button{
    width:622px;
    height:81px;
    background:rgba(105,129,251,1);
    border-radius:10px;
    border: none;
    font-size: 28px;
  }
}
</style>
