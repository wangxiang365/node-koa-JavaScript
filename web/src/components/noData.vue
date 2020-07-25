<template>
  <div class="noData">
    <template v-if="Object.keys(data).length > 0">
      <div>
        <img :src="data.icon">
      </div>
      <div>{{data.txt}}</div>
    </template>
    <template v-else>
      <div>暂无数据</div>
    </template>
  </div>
</template>
<style scoped lang="less">
.noData{
  text-align: center;
  font-size: 28px;
  padding: 30% 0;
  color:rgba(131,132,160,1);
}
</style>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {},
  methods: {}
}
</script>
<style scoped lang="less">
.noData{
  img{
    width: 235px;
  }
  div{
    &:nth-child(2){
      margin-top: 43px;
    }
  }
}
</style>
