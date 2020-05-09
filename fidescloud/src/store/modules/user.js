import { login, getInfo, logout } from '@/api/login'
// import { getToken, setToken, removeToken, setExpireIn } from '@/utils/auth'
import { getToken, setToken, removeToken, removeI18nData, removeI18nRoleData, removeI18nBusinessData, removeI18nGlobalData, removeI18nApp, removeAgreePrivacy, removeRoleUserInfo, setRoleUserInfo, getRoleUserInfo } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userInfo: JSON.parse(getRoleUserInfo()) || [],
    roles: [],
    sidebar_item_state: true
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SIDERBAR_ITEM_STATE: (state, type) => {
      state.sidebar_item_state = type
    }
  },

  actions: {
    setSidebarItemState({ commit }, bool) {
      commit('SET_SIDERBAR_ITEM_STATE', bool)
    },
    // 登录
    Login({ commit }, userInfo) {
      const user_name = userInfo.user_name.trim()
      const company_code = userInfo.company_code.trim()
      return new Promise((resolve, reject) => {
        login(company_code, user_name, userInfo.password).then(response => {
          setToken(response.access_token)
          commit('SET_TOKEN', response.access_token)
          resolve(response.access_token)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          commit('SET_USERINFO', response.return_result)
          setRoleUserInfo(JSON.stringify(response.return_result))
          resolve(response.return_result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeI18nData()
          removeI18nRoleData()
          removeI18nBusinessData()
          removeI18nGlobalData()
          removeI18nApp()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        // sessionStorage.removeItem('language')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeI18nData()
        removeI18nRoleData()
        removeI18nBusinessData()
        removeI18nGlobalData()
        removeI18nApp()
        // commit('SET_USERINFO', '')
        removeAgreePrivacy()
        removeRoleUserInfo()
        removeToken()
        resolve()
      })
    }
  }
}

export default user
