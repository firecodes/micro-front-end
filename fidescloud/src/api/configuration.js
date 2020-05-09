import request from '@/utils/request'
import { getUrlHost } from '../utils'
var host = getUrlHost()
import { configuration as c } from './api'
export function configuration(form) {
  return request({
    url: c.configuration,
    method: 'post',
    data: form
  })
}
export function importQuery(param) {
  return request({
    url: c.importQuery,
    method: 'post',
    data: param
  })
}
export function patternStatus(params) {
  return request({
    url: c.patternStatus,
    method: 'post',
    data: params
  })
}
export function patternEdit(params) {
  return request({
    url: c.patternEdit,
    method: 'post',
    data: params
  })
}
export function downloadStandTmp(url) {
  return request({
    url: host + url,
    method: 'get'
  })
}
export function templateDetail(url) {
  return request({
    url: host + url,
    method: 'get'
  })
}
export function fieldEditStatus(params) {
  return request({
    url: c.fieldEdit,
    method: 'post',
    data: params
  })
}
export function fieldAdd(params) {
  return request({
    url: c.fieldAdd,
    method: 'post',
    data: params
  })
}
export function fieldDelete(params) {
  return request({
    url: c.fieldDelete,
    method: 'post',
    data: params
  })
}
export function remoteEdit(params) {
  return request({
    url: c.remoteEdit,
    method: 'post',
    data: params
  })
}
export function scheduleEdit(params) {
  return request({
    url: c.scheduleEdit,
    method: 'post',
    data: params
  })
}
export function fileQuery(params) {
  return request({
    url: c.fileQuery,
    method: 'post',
    data: params
  })
}
export function queryAll(params) {
  return request({
    url: c.queryAll,
    method: 'post',
    data: params
  })
}
export function executionQuery(params) {
  return request({
    url: c.executionQuery,
    method: 'post',
    data: params
  })
}
export function downloadFile(url) {
  return request({
    url: host + url,
    method: 'get'
  })
}
export function getRemoteInfo(url) {
  return request({
    url: host + url,
    method: 'get'
  })
}
export function saveCondition(data) {
  return request({
    url: c.saveCondition,
    method: 'post',
    data
  })
}
export function getCondition() {
  return request({
    url: c.getCondition,
    method: 'post'
  })
}
