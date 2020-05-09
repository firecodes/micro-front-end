import request from '@/utils/request'
import { uploadImgUrl } from './api'
import {
  common,
  employee
} from './api'

export function getTenantInfo(user_id, tenant_id) {
  return request({
    url: common.getTenantInfo,
    method: 'get',
    headers: {
      'user_id': user_id,
      'tenant_id': tenant_id
    }
  })
}
// file upload
export function fileUpload(data) {
  return request({
    url: uploadImgUrl,
    method: 'post',
    FormData: 'FormData',
    data
  })
}
// store & employee
export function queryEmployeeByRoleLevel(data) {
  return request({
    url: '/employee/queryEmployeeByRoleLevel',
    method: 'post',
    FormData: 'FormData',
    data
  })
}
// state/city dictionary
export function regionDictionary(data) {
  return request({
    url: '/masterdata/queryDictionary',
    method: 'post',
    data
  })
}
// countryPhonePrefix
export function countryPhonePrefix(data) {
  return request({
    url: employee.countryPhonePrefix,
    method: 'post',
    data
  })
}
