// import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+sessionStorage.getItem('sidebarStatus')
    },
    ccstyle: sessionStorage.getItem('ccstyle') || 1
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        sessionStorage.setItem('sidebarStatus', 1)
      } else {
        sessionStorage.setItem('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_CCSTYLE: (state, ccstyle) => {
      state.ccstyle = ccstyle
      sessionStorage.setItem('ccstyle', ccstyle)
    },
    SET_OPEN: (state, flag = 0) => {
      state.sidebar.opened = flag
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    setCcstyle({ commit }, ccstyle) {
      commit('SET_CCSTYLE', ccstyle)
    },
    setOpen({ commit }, flag) {
      commit('SET_OPEN', flag)
    }
  }
}

export default app
