const fileImport = {
  state: {
    itemValue: {}
  },
  // 修改state数据值
  mutations: {
    SET_EDIT_ITEM: (state, obj) => {
      state.itemValue = obj
    }
  },
  actions: {
    setItemValue({ commit }, obj) {
      console.log('test', commit, obj)
    }
  }
}
export default fileImport
