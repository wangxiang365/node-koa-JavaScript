import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)
const state = {
  personalData: ''                      // 个人资料
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
