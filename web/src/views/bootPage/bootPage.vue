<template>
  <div class="bootPage-wrap">
    <!-- banner -->
    <div class="swipe">
      <!-- <van-swipe :autoplay="5000" indicator-color="white" :show-indicators="false" :immediate="true">
        <van-swipe-item v-for="(item, index) in bootPageArr" :key="index">
          <img :src="item">
        </van-swipe-item>
      </van-swipe> -->
      <swipers :options="swiperOption" class="banner">
        <swiper-slides v-for="(item,index) in bootPageArr" class="banner-slide" :key="index">
          <img :src="item">
        </swiper-slides>
      </swipers>
    </div>
    <div class="btn">
      <van-button type="primary" @click="$router.replace('/login')">进入系统</van-button>
    </div>
    <div class="record">
      <p>版权@2019 深圳市亮知物联科技有限公司</p>
      <p>All rights reserved <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=19148794" target="_blank">粤ICP备19148794号-1</a></p>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Button } from 'vant'
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
  name: 'home',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Button.name]: Button,
    swipers: swiper,
    swiperSlides: swiperSlide
  },
  data () {
    return {
      swiperOption: {
        autoplay: 2000,
        loop: true,
        effect: 'fade',
        autoplayDisableOnInteraction: false,
        slidesPerView: 'auto',
        initialSlide: 0,
        centeredSlides: true,
        watchSlidesProgress: true,
        paginationClickable: true
      },
      bootPageArr: [
        require('../../assets/images/bootPage1.png'),
        require('../../assets/images/bootPage2.png')
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.bootPage-wrap{
  min-height: calc(100vh);
  background: #1c1e3a;
  .swipe{
    width: 100%;
    height: calc(100vh);
    img{
      width: 100%;
      height: calc(100vh);
      display: block;
      overflow: hidden;
    }
  }
  .btn{
    display: flex;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 137px;
    margin: auto;
    cursor: pointer;
    z-index: 2000;
    button{
      width:486px;
      height:78px;
      cursor: pointer;
      border: none;
      background:rgba(0,0,2,0.4);
      border-radius:10px;
      margin-right: 32px;
      font-size: 30px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  .record{
    text-align: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 37px;
    margin: auto;
    cursor: pointer;
    z-index: 2000;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    letter-spacing:3px;
    font-weight: normal;
    a{
      color: #6981fb;
    }
  }
}
</style>
