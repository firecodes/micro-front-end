import request from '@/utils/request'
import { agreePrivacy } from './api'

export function userCheck(data, country) {
  return request({
    url: agreePrivacy.userCheck,
    method: 'post',
    data,
    headers: {
      employee_id: country
    }
  })
}

export function userConfirm(data, country) {
  return request({
    url: agreePrivacy.userConfirm,
    method: 'post',
    data,
    headers: {
      employee_id: country
    }
  })
}
