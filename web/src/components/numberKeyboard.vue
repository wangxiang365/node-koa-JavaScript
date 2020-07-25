<template>
  <div>
    <!-- 密码框弹窗 -->
      <van-popup class="password-keyboard"
      v-model="isShow"
      position="bottom"
      :style="{ height: '390px' }"
      :close-on-click-overlay="false"
      @click-overlay="close"
    >
      <p class="tip">请验证支付密码确认本人操作</p>
      <!-- 密码框 -->
      <van-password-input
        :value="passwordVal"
        :length="length"
        :gutter="15"
        :focused="true"
      />
      <!-- 忘记密码 -->
      <div class="forgetPwd" @click="forgetPwd">忘记密码?</div>
      <!-- 数字键盘 -->
      <van-number-keyboard
        :show="isShow"
        :transition="false"
        @input="keyboardEntry($event, 1)"
        @delete="keyboardEntry($event, 2)"
        safe-area-inset-bottom
      />
    </van-popup>
  </div>
</template>

<script>
import { PasswordInput, NumberKeyboard, Popup } from 'vant'
export default {
  model: {
    prop: 'show',
    event: 'change'
  },
  components: {
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Popup.name]: Popup
  },
  props: {
    show: {                  // 是否显示
      type: Boolean,
      default: false
    },
    length: {                // 密码长度
      type: [Number],
      default: 6
    }
  },
  data () {
    return {
      isShow: false,
      userInfo: '',
      passwordVal: ''                              // 输入的值
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('LZWLUSERINFO'))
  },
  watch: {
    show (val) {
      this.isShow = val
    }
  },
  methods: {
    /**
     * 键盘输入
     * @param type 1: 输入 2 ：删除
    */
    async keyboardEntry (key, type) {
      if (type === 1) {
        this.passwordVal = (this.passwordVal + key).slice(0, this.length)
        if (this.passwordVal.length === this.length) {
          this.$emit('close')
          this.$emit('finish', this.passwordVal)
          this.passwordVal = ''
        }
      } if (type === 2) {
        this.passwordVal = this.passwordVal.slice(0, this.passwordVal.length - 1)
      }
      this.$emit('onInput', this.passwordVal)
    },
    /**
     * 关闭
    */
    close () {
      this.passwordVal = ''
      this.$emit('close')
    },
    /**
     * 忘记密码
    */
    forgetPwd () {
      this.$emit('close')
      this.$router.push({path: '/forgotPayPassword', query: {redirect: this.$route.path}})
    }
  }
}
</script>

<style scoped lang="less">
// 支付密码弹窗
.password-keyboard{
  left: 0;
  right: 0;
  max-width: 750px;
  margin: 0 auto;
  // tip
  .tip{
    margin-top: 35px;
    font-size: 28px;
  }
  // 密码框
  .van-password-input{
    margin-top: 50px;
    padding: 0 3%;
    li{
      border: 1px solid #ccc;
    }
  }
  // 忘记密码
  .forgetPwd{
    font-size: 28px;
    margin: 35px 0;
    color: #0099CC;
    cursor: pointer;
  }
  // 键盘
  .van-number-keyboard{
    max-width: 750px;
    left: 0;
    right: 0;
    margin: auto;
  }
}
</style>
