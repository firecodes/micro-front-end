import 'babel-polyfill'
import Vue from 'vue'
import '@/styles/style1/index.scss'
// import '../theme/index.css'
import ElementUI from 'element-ui'
import '@/utils/property'
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang'
import '@/icons' // icon
import '@/permission' // permission control
// import './mock'
import util from './utils/util'
import common from './utils/common'
import * as filters from './filters'
// import 'element-ui/lib/theme-chalk/index.css'

import VueCron from 'vue-cron'

// 自定义全局组件
import './custom-component'

Vue.use(VueCron)
Vue.use(util)
Vue.use(ElementUI, {
  size: 'medium'
})
Vue.prototype.common = common
Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 导入乾坤函数
import {
  registerMicroApps, // 注册子应用方法
  // setDefaultMountApp, // 设默认启用的子应用
  runAfterFirstMounted, // 有个子应用加载完毕回调
  start, // 启动qiankun
  addGlobalUncaughtErrorHandler // 添加全局未捕获异常处理器
  // initGlobalState, // 官方应用间通信
} from 'qiankun'

let app = null
function render({ appContent, loading } = {}) {
  if (!app) {
    app = new Vue({
      el: '#app',
      i18n,
      router,
      store,
      data() {
        return {
          content: appContent,
          loading
        }
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading
          }
        })
      }
    })
  } else {
    app.content = appContent
    app.loading = loading
  }
}

render()

registerMicroApps(
  [
    {
      name: 'portal',
      entry: '//localhost:6652',
      render,
      activeRule: '/portal'
    }
  ],
  {
    beforeLoad: [
      app => {
        window.sessionStorage.setItem('crossRoute', true)
        console.log('before load', app)
      }
    ],
    beforeMount: [
      app => {
        console.log('before mount', app)
      }
    ],
    afterUnmount: [
      app => {
        window.sessionStorage.removeItem('crossRoute')
        console.log('after unload', app)
      }
    ]
  }
)

start({ prefetch: true })

runAfterFirstMounted(() => {
  console.log('[MainApp] first app mounted')
})

addGlobalUncaughtErrorHandler(event => console.log(event))

export default app

// export default new Vue({
//   el: '#app',
//   router,
//   store,
//   i18n,
//   template: '<App/>',
//   components: { App }
// })
