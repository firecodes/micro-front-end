import { allRouterMap, initRouterMap } from '@/router'
import { getRoute, setRoute } from '@/utils/auth'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(asyncRouterMap, roles) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(roles, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }
function recursionRouter(userRouter = [], allRouter = []) {
  return new Promise((resolve) => {
    // return allRouter
    userRouter = JSON.parse(JSON.stringify(userRouter).toLowerCase())
    var realRoutes = []
    // 如果返回的是{} 则显示所有
    if (Object.keys(userRouter).length === 0) {
      realRoutes.push({
        path: '',
        redirect: '/null/index'
      })
      resolve(realRoutes)
    }
    const has = Object.prototype.hasOwnProperty
    // 如果不存在main 显示所有
    if (!has.call(userRouter, 'main')) {
      realRoutes.push({
        path: '',
        redirect: '/null/index'
      })
      resolve(realRoutes)
    }
    var i = 0
    var n = 0
    for (var v of allRouter) {
      if (v.meta.title === '') {
        realRoutes.push(v)
      } else {
        if (has.call(userRouter.main, v.meta.title)) {
          v.hidden = false
          var children = v.children
          if (has.call(v, 'children')) {
            if (children.length > 0) {
              for (var item of children) {
                if (has.call(userRouter.main[v.meta.title], item.meta.title || '')) {
                  if (userRouter.main[v.meta.title][item.meta.title].hasOwnProperty('nopermission')) {
                    item.meta.noPermission = userRouter.main[v.meta.title][item.meta.title].nopermission
                  }
                  if (userRouter.main[v.meta.title][item.meta.title].hasOwnProperty('hidden')) {
                    item.hidden = userRouter.main[v.meta.title][item.meta.title].hidden
                  } else {
                    item.hidden = false
                  }
                }
              }
            }
          }
          realRoutes.push(v)
          if (i === 0) {
            for (var index in userRouter.main) {
              if (n === 1 && index !== 'homepage') {
                for (var c_item of v.children) {
                  if (c_item.hidden === false) {
                    realRoutes.push({
                      path: '',
                      redirect: v.path + '/' + c_item.path
                    })
                  }
                }
              }
              n++
            }
          }
          i++
        }
      }
    }
    // return has.call(role_data.main, title)
    // allRouter.forEach((v, i) => {
    //   userRouter.forEach((item, index) => {
    //     if (item.name === v.meta.name) {
    //       if (item.children && item.children.length > 0) {
    //         v.children = recursionRouter(item.children, v.children)
    //       }
    //       realRoutes.push(v)
    //     }
    //   })
    // })
    // })
    resolve(realRoutes)
  })
}
const permission = {
  state: {
    routers: initRouterMap,
    addRouters: JSON.parse(getRoute()) || []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = initRouterMap.concat(routers)
      setRoute(JSON.stringify(routers))
    }
  },
  actions: {
    FETCH_PERMISSION({ commit, state }, data) {
      recursionRouter(data, allRouterMap).then(res => {
        commit('SET_ROUTERS', res)
      })
    }
    // GenerateRoutes({ commit }, data) {
    //   return new Promise(resolve => {
    //     const { roles } = data
    //     let accessedRouters
    //     if (roles.indexOf('admin') >= 0) {
    //       accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
    //     } else {
    //       accessedRouters = asyncRouterMap
    //     }
    //     commit('SET_ROUTERS', accessedRouters)
    //     resolve()
    //   })
    // }
  }
}

export default permission
