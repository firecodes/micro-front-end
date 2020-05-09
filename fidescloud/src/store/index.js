import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import campaign from './modules/campaign'
import configuration from './modules/configuration'
import fileImport from './modules/fileImport'
import memberTag from './modules/memberTag'
import redemption from './modules/redemption'
import getters from './getters'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    tagsView,
    campaign,
    configuration,
    redemption,
    fileImport,
    memberTag
  },
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
