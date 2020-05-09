import request from '@/utils/request'
import {
  roleApi
} from './api'

export function deleteRole(obj = {}) {
  return request({
    url: roleApi.deleteRole,
    method: 'post',
    data: obj
  })
}

export function detail(obj = {}) {
  return request({
    url: roleApi.detail,
    method: 'post',
    data: obj
  })
}

export function edit(obj = {}) {
  return request({
    url: roleApi.edit,
    method: 'post',
    data: obj
  })
}

export function insert(obj = {}) {
  return request({
    url: roleApi.insert,
    method: 'post',
    data: obj
  })
}

export function list(obj = {}) {
  return request({
    url: roleApi.list,
    method: 'post',
    data: obj
  })
}
