<template>
  <div class="home">
    <van-button type="primary">主要按钮</van-button>ggg
    <div class="add">
      {{151254512 | money}}
    </div>
    <van-button type="info" @click="area">选择城市</van-button>
    <van-popup
      v-model="show"
      position="bottom"
    ><van-area :area-list="areaList" @confirm="getData" @cancel="show = false"/></van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import { Button, Dialog, Popup, Area } from 'vant'
import areaList from '../assets/js/area'
export default {
  name: 'home',
  components: {
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    [Popup.name]: Popup,
    [Area.name]: Area
  },
  data () {
    return {
      show: false,
      areaList: areaList
    }
  },
  mounted () {
    // Dialog.alert({
    //   title: '标题',
    //   message: '代码是写出来给人看的，附带能在机器上运行代码是写出来给人看的，附带能在机器上运行'
    // }).then(() => {
    //   // on close
    // })
  },
  methods: {
    area () {
      this.show = true
    },
    getData (val) {
      this.show = false
      var str = ''
      val.forEach((item) => {
        str += `${item.name},`
      })
      console.log(str.substring(str, str.length - 1))
    }
  }
}
</script>
<style>
.add{
  color: red;
  width: 75px;
  height: 100px; /*no*/
  background: #ccc;
}
</style>
