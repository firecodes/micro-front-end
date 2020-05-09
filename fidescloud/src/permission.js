import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
// getAgreePrivacy
import { getToken } from '@/utils/auth' // 验权
const whiteList = ['/login', '/login/forgot-password', '/legal', '/legal/terms', '/legal/terms/CN', '/legal/terms/JP', '/legal/terms/IN', '/legal/terms/SG', '/legal/terms/HK', '/legal/terms/TW', '/legal/privacy', '/legal/privacy/CN', '/legal/privacy/JP', '/legal/privacy/IN', '/legal/privacy/SG', '/legal/privacy/HK', '/legal/privacy/TW'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // && +getAgreePrivacy === 0
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (Object.keys(store.getters.permission_routers).length <= 5) {
        var role_data = store.getters.role_data
        store.dispatch('FETCH_PERMISSION', role_data).then(res => {
          var asyncRouterMap = []
          // console.log('走进来了')
          // asyncRouterMap.push({ path: '*', redirect: '/404', hidden: true, meta: { title: '' }})
          router.addRoutes([...store.getters.addRouters, ...asyncRouterMap]) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      }
      if (store.getters.userInfo.length !== 0) {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
