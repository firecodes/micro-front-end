import axios from 'axios'
// import Vue from 'vue'
import { RETURNCODE } from '@/api/api'
// import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { newGuid, getTimestamp } from './request_common'
import { login, uploadImgUrl, user, uploadFileUrl } from '@/api/api'
import md5 from 'js-md5'
import { getUrlHost } from './index'
export { getUrlHost } from '@/utils'
var host = getUrlHost()
const tstamp = getTimestamp()
const guid = newGuid()
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API,
  baseURL: `${host}/fides/backend/v1`,
  timeout: 0
})
// const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout))

// 请求拦截器
service.interceptors.request.use((config) => {
  // await delay(500)
  if (store.getters.token) {
    config.headers['access_token'] = getToken()
  } else if (config.url.indexOf(user.sendEmail) > -1 || config.url.indexOf(user.changeForgot) > -1) {
    config.headers['access_token'] = sessionStorage.getItem('temporary_access_token')
  } else if (config.url !== login && config.url.indexOf(user.temporaryAccessToken) === -1) {
    this.$router.push({
      path: '/login'
    })
  }
  if (config.data && config.url !== uploadImgUrl && config.url !== uploadFileUrl && config.url.indexOf(login) === -1) {
    config.data = { 'bu_content': config.data }
  }
  if (config.url !== login) {
    config.headers['timestamp'] = tstamp
    config.headers['request_id'] = guid
    config.headers['signature'] = md5(`${guid}&${tstamp}&` + (config.method.toUpperCase() === 'GET' ? '&' : `${JSON.stringify(config.data)}&`))
  }
  return config
}, error => {
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.headers['content-type'].indexOf('application/octet-stream;charset=UTF-8') > -1) {
      return response.data
    }
    const res = response.data
    if (res.code === '67105') {
      return Promise.reject("Can't find privacy policy")
    }
    // MP不能登录FC后台
    if (res.scope === 'memberPortal') {
      return Promise.reject(res.msg)
    }
    // token
    if (res.hasOwnProperty('access_token') && res.access_token !== '') {
      return res
    }
    // 失效
    if (res.hasOwnProperty('code') && res.code === '40002') {
      store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
    }
    // checkMemberCouponCode 50114
    if (res.code !== RETURNCODE || res.code === '50114') {
      return Promise.reject(res.msg)
    } else {
      return { 'return_message': res.msg, 'return_code': res.code, 'return_result': res.hasOwnProperty('result') ? res.result : null }
    }
  },
  error => {
    // 用户名密码错误错误时
    if (error.response && error.response.status === 401) {
      return Promise.reject(error)
    } else {
      // do something
    }
    return Promise.reject(error)
  }
)

export default service
