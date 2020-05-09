import { configuration as c } from '@/api/configuration'
import { checkObjHasOwnProperty } from '@/utils'
// import business from '@/data/business.json'
// import global from '@/data/global.json'
import lang_cn from '@/data/lang_cn.json'
import lang_en from '@/data/lang_en.json'
import lang_ja from '@/data/lang_ja.json'
// import role from '@/data/role.json'
import {
  // getI18nData,
  getI18nGlobalData,
  getI18nBusinessData,
  getI18nRoleData,
  getI18nApp,
  setI18nApp,
  setI18nGlobalData,
  setI18nBusinessData,
  setI18nRoleData
  // setI18nData
} from '@/utils/auth'
// JSON.parse(getI18nData()) || {}
var _bowerLanguage = ''

var JsSrc = (navigator.language || navigator.browserLanguage).toLowerCase()
if (JsSrc.indexOf('zh') >= 0) {
  _bowerLanguage = 'lang_zh'
} else if (JsSrc.indexOf('en') >= 0) {
  _bowerLanguage = 'lang_en'
} else if (JsSrc.indexOf('ja') >= 0) {
  _bowerLanguage = 'lang_ja'
} else {
  _bowerLanguage = 'lang_en'
}
const configuration = {
  state: {
    app: JSON.parse(getI18nApp()) || {},
    // i18n_data: JSON.parse(getI18nData()) || {},
    global_data: JSON.parse(getI18nGlobalData()) || {},
    role: JSON.parse(getI18nRoleData()) || {},
    business: JSON.parse(getI18nBusinessData()) || {},
    language: sessionStorage.getItem('language') || _bowerLanguage,
    i18n_data: { lang_zh: lang_cn, lang_en: lang_en, lang_ja: lang_ja }
    // global_data: global,
    // role: role,
    // business: business,
    // language: sessionStorage.getItem('language') || business.business.common.default_language
  },
  mutations: {
    SET_I18N_DATA: (state, i18n_data) => {
      state.i18n_data = i18n_data
    },
    SET_GLOBAL_DATA: (state, global_data) => {
      state.global_data = global_data
    },
    SET_APP: (state, obj) => {
      state.app = obj
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_BUSINESS: (state, business) => {
      state.business = business
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      sessionStorage.setItem('language', language)
    }
  },
  actions: {
    // 根据参数获取配置
    // 包含app, country, role, business, language
    getConfiguration({ commit }, obj) {
      return new Promise((resolve, reject) => {
        c(obj).then(response => {
          const data_config = JSON.parse(response.return_result.config)
          // const has = Object.prototype.hasOwnProperty
          // app {app_version: '1.0.0', app_id: 3}
          if (checkObjHasOwnProperty(data_config, 'app')) {
            const app = data_config.app
            setI18nApp(JSON.stringify(app))
            commit('SET_APP', app)
          }
          // global
          if (checkObjHasOwnProperty(data_config, 'country')) {
            const global = data_config.country
            setI18nGlobalData(JSON.stringify(global))
            commit('SET_GLOBAL_DATA', global)
            // // 设置默认语言
            // if (has.call(global, 'language')) {
            //   if (has.call(global.language, 'default')) {
            //     commit('SET_LANGUAGE', global.language.default)
            //   }
            // }
          }
          // role
          if (checkObjHasOwnProperty(data_config, 'role')) {
            const role = data_config.role
            setI18nRoleData(JSON.stringify(role))
            commit('SET_ROLE', role)
          }
          // business
          if (checkObjHasOwnProperty(data_config, 'business')) {
            const business = data_config.business
            setI18nBusinessData(JSON.stringify(business))
            commit('SET_BUSINESS', business)
            // // 如果设置了默认语言  则设置
            // if (has.call(business, 'common')) {
            //   if (has.call(business.common, 'default_language')) {
            //     commit('SET_LANGUAGE', business.common.default_language)
            //   }
            // }
          }
          // // language
          // if (checkObjHasOwnProperty(data_config, 'language')) {
          //   const language = data_config.language
          //   // setI18nData(JSON.stringify(language))
          //   commit('SET_I18N_DATA', language)
          // }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default configuration
