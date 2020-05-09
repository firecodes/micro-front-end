import { getRedeemDetail, getRedeemComponentId } from '@/utils/auth'
const redemption = {
  state: {
    redeem_detail: JSON.parse(getRedeemDetail()) || {},
    redeem_component_id: getRedeemComponentId() || '0'
  },
  mutations: {
    SET_REDEEM_DETAIL: (state, redeem_detail) => {
      state.redeem_detail = redeem_detail
    },
    SET_REDEEM_COMPONENT_ID: (state, redeem_component_id) => {
      state.redeem_component_id = redeem_component_id
    }
  },
  actions: {
    setRedeemDetail({
      commit
    }, redeem_detail) {
      commit('SET_REDEEM_DETAIL', redeem_detail)
    },
    setRedeemComponentId({ commit }, redeem_component_id) {
      commit('SET_REDEEM_COMPONENT_ID', redeem_component_id)
    }
  }
}

export default redemption
