<template>
  <div class="modifyName-wrap">
    <ul>
      <li>
        <input type="text" placeholder="请输入用户名" v-model="name">
      </li>
    </ul>
    <van-button type="primary" class="unverified-btn" @click="save">保存</van-button>
  </div>
</template>
<script>
import { Button, Toast } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [Toast.name]: Toast
  },
  data () {
    return {
      name: ''
    }
  },
  mounted: function () {
  },
  methods: {
    /**
     * 保存
    */
    save () {
      if (!this.name) {
        Toast('请输入姓名')
        return
      }
      this.$http.post(this.api.saveUser, {
        userName: this.name
      }).then((res) => {
        let resData = res.data
        if (resData.status === this.api.ERR_OK) {
          Toast('修改成功')
          this.$router.back()
        } else {
          Toast(resData.msg)
        }
      })
    }
  }
}
</script>
<style lang=less>
  .modifyName-wrap{
    height: calc(100vh);
    overflow: auto;
    background: #1c1e3a;
    ul {
      width: 700px;
      margin: 34px auto;
      background: rgba(42, 49, 84, 0.6);
      padding: 0 40px;
      box-sizing: border-box;
      li{
        text-align: left;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: .24rem;
        color:rgba(223,226,244,1);
        background: none;
        input{
          width: 100%;
          height: 100px;
          font-size: 28px;
          color:rgba(223,226,244,1);
          background: none;
        }
      }
    }
    .unverified-btn{
      width: 90%;
      height: 0.81rem;
      line-height: 0.81rem;
      background: #6981FB;
      border-radius: 0.1rem;
      font-size: 0.28rem;
      border: none;
      margin: 0 auto;
      cursor: pointer;
      margin: 80px 0;
    }
  }
</style>
