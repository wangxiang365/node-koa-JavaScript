import * as types from './mutation_type'
export default {
  // 获取个人资料
  [types.personalData] (state, payload) {
    state.personalData = payload
  }
}
