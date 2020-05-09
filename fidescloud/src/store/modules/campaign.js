import { getLifecycleConfiguration, setLifecycleInfo as setTokenLifecycle, getLifecycleInfo } from '@/utils/auth'
const campaign = {
  state: {
    edit: {
      state: false,
      id: null,
      detail: {}
    },
    add: {},
    performance_params: {},
    lifecycle_configuration: JSON.parse(getLifecycleConfiguration()) || [],
    lifecycle_info: (getLifecycleInfo()) || {},
    update_state: false
  },
  mutations: {
    SET_EDIT: (state, edit) => {
      state.edit = edit
    },
    SET_ADD: (state, add) => {
      state.add = add
    },
    SET_PERFORMANCE_PARAMS: (state, performance_params) => {
      state.performance_params = performance_params
    },
    SET_LIFECYCLE_CONFIGURATION: (state, lifecycle_configuration) => {
      state.lifecycle_configuration = lifecycle_configuration
    },
    SET_LIFECYCLE_WHEN: (state, data) => {
      state.lifecycle_info.wave_list[data.nonius_id - 1].when_definition = data.info
      setTokenLifecycle(state.lifecycle_info)
    },
    SET_LIFECYCLE_WHO: (state, data) => {
      state.lifecycle_info.wave_list[data.nonius_id - 1].who_definition_list[0] = data.info
      setTokenLifecycle(state.lifecycle_info)
    },
    SET_LIFECYCLE_WHAT: (state, data) => {
      state.lifecycle_info.wave_list[data.nonius_id - 1].what_reward_definition_list[0] = data.info
      setTokenLifecycle(state.lifecycle_info)
    },
    SET_LIFECYCLE_HOW: (state, data) => {
      state.lifecycle_info.wave_list[data.nonius_id - 1].communication_definition_list[0] = data.info
      setTokenLifecycle(state.lifecycle_info)
    },
    SET_LIFECYCLE_INFO: (state, info) => {
      setTokenLifecycle(info)
      state.lifecycle_info = info
    },
    SET_UPDATE_STATE: (state, bool) => {
      state.update_state = bool
    }
  },
  actions: {
    setEdit({ commit }, edit) {
      commit('SET_EDIT', edit)
    },
    setAdd({ commit }, add) {
      commit('SET_ADD', add)
    },
    setPerformanceParams({ commit }, performance_params) {
      commit('SET_PERFORMANCE_PARAMS', performance_params)
    },
    setLifecycleConfiguration({ commit }, lifecycle_configuration) {
      commit('SET_LIFECYCLE_CONFIGURATION', lifecycle_configuration)
    },
    setUpdateState({ commit }, update_state) {
      commit('SET_UPDATE_STATE', update_state)
    }
  }
}

export default campaign
