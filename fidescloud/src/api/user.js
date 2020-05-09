import request from '@/utils/request'
import {
  userApi,
  user
} from './api'

export function list(obj = {}) {
  return request({
    url: userApi.list,
    method: 'post',
    data: obj
  })
}

export function insert(obj = {}) {
  return request({
    url: userApi.insert,
    method: 'post',
    data: obj
  })
}

export function detail(obj = {}) {
  return request({
    url: userApi.detail,
    method: 'post',
    data: obj
  })
}

export function edit(obj = {}) {
  return request({
    url: userApi.edit,
    method: 'post',
    data: obj
  })
}

export function status(obj = {}) {
  return request({
    url: userApi.status,
    method: 'post',
    data: obj
  })
}

export function deleteUser(obj = {}) {
  return request({
    url: userApi.deleteUser,
    method: 'post',
    data: obj
  })
}

export function roleList(obj = {}) {
  return request({
    url: userApi.roleList,
    method: 'post',
    data: obj
  })
}

export function assign(obj = {}) {
  return request({
    url: userApi.assign,
    method: 'post',
    data: obj
  })
}

export function sendEmail(obj = {}) {
  return request({
    url: user.sendEmail,
    method: 'post',
    data: obj
  })
}

export function changeForgot(obj = {}) {
  return request({
    url: user.changeForgot,
    method: 'post',
    data: obj
  })
}

// 获取临时token
export function temporaryAccessToken() {
  return request({
    url: user.temporary_access_token,
    method: 'get',
    headers: {
      'Authorization': 'Basic ZmlkZXM6YWJjMTIzJA=='
    },
    params: {
      grant_type: 'client_credentials', // 固定值
      company: 'fides'
    }
  })
}

