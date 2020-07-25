import * as types from './mutation_type'
export default {
  // 设置个人资料
  setPersonalData ({ commit }, payload) {
    commit(types.personalData, payload)
  }
}
