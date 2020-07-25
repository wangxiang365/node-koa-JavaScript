<template>
  <div class="sendCode-wrap">
    <div class="user">
      我们已向 {{phone}} 发送验证码短信，请查看短信并输入验证码
    </div>
    <van-password-input
      :value="passwordVal"
      :length="4"
      :gutter="15"
      :mask="false"
      :focused="showKeyboard"
      @focus="showKeyboard = true"
    />
    <van-number-keyboard
      :show="showKeyboard"
      @blur="showKeyboard = false"
      @input="keyboardEntry($event, 1)"
      @delete="keyboardEntry($event, 2)"
    />
    <div class="tip" @click="repeatSte = true">收不到验证码短信？</div>
    <!-- 重发验证码弹窗 -->
    <van-action-sheet v-model="repeatSte" :actions="repeatList" @select="selectrepeat" cancel-text="取消" @cancel="repeatSte = false" :round="false"/>
    <van-button type="primary" class="next" @click="handlevValidateCode">下一步</van-button>
  </div>
</template>
<script>
import { Button, Toast,  PasswordInput, NumberKeyboard, ActionSheet } from 'vant'
export default {
  props: ['phone'],
  components: {
    [Button.name]: Button,
    [Toast.name]: Toast,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [ActionSheet.name]: ActionSheet
  },
  data () {
    return {
      repeatList: [
        { name: '重新获取验证短信', val: '1' }
      ],
      length: 4,
      repeatSte: false,                            // 重发
      passwordVal: '',                             // 验证码
      showKeyboard: false                          // 显示数字键盘
    }
  },
  mounted: function () {
  },
  methods: {
    /**
     * 键盘输入
     * @param type 1: 输入 2 ：删除
    */
    keyboardEntry (key, type) {
      if (type === 1) {
        this.passwordVal = (this.passwordVal + key).slice(0, this.length)
      } if (type === 2) {
        this.passwordVal = this.passwordVal.slice(0, this.passwordVal.length - 1)
      }
    },
    /**
     * 重发下拉选择
    */
    selectrepeat (val) {
      this.repeatSte = false
      this.handleSendCode()
    },
    /**
     * 发送验证码
     */
    handleSendCode () {
      this.$http.post(this.api.getValidWord, {
        phone: this.phone
      }).then((res) => {
        this.$toast(res.data.msg)
      })
    },
    /**
     * 校验验证码
     */
    handlevValidateCode () {
      if (!this.passwordVal || this.passwordVal.length < 4) {
        this.$toast('请输入正确的验证码')
        return
      }
      this.$http.post(`${this.api.checkVerifyCode}`, {
        phone: this.phone,
        verifyCode: this.passwordVal
      }).then((res) => {
        if (res.data.status !== this.api.ERR_OK || !res) {
          this.$toast(res.data.msg)
          return false
        } else {
          this.$emit('next', this.passwordVal)
        }
      })
    }
  }
}
</script>
<style lang=less>
  .sendCode-wrap{
    .user{
      padding: 60px 30px;
      color: #fff;
    }
    .van-password-input{
      padding: 35px 10%;
      ul{
        justify-content: center;
      }
      li{
        height: 1rem;
        width: 1rem;
        justify-content: center;
        font-size: 28px;
        flex: unset;
      }
    }
    .tip{
      text-align: center;
      color: #6981fb;
      margin-top: 100px;
      cursor: pointer;
    }
    .next{
      &.van-button{
        width:622px;
        height:81px;
        line-height: 81px;
        background:rgba(105,129,251,1);
        border-radius:10px;
        font-size: 0.28rem;
        cursor: pointer;
        border: none;
        margin: 0 auto;
        cursor: pointer;
        margin-top: 30px;
      }
    }
  }
</style>
