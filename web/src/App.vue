<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"/>
    <!--footer-->
    <foote v-if="this.$route.meta.isShowFooter"></foote>
  </div>
</template>

<script>
import foote from './components/footer'             // 页脚

export default {
  name: 'app',
  components: {
    foote
  },
  data () {
    return {
    }
  },
  computed: {
    // 处理一个页面中的链接点击再次跳入当前页面(只是后面参数有变化)url变化页面不刷新问题
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  // min-height: calc(100vh - 1rem);
  // overflow: auto;
  // background: #1c1e3a;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
