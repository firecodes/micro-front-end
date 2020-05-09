const memberTag = {
  state: {
    addRecommend: null
  },
  mutations: {
    setAddRecommand(state, id) {
      state.addRecommend = id
    }
  },
  actions: {
    setAddRecommand({ commit }, id) {
      commit('setAddRecommand', id)
    }
  }
}
export default memberTag
