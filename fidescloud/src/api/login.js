import request from '@/utils/request'
import qs from 'qs'
var sha1 = require('sha1')
import {
  login as loginUrl,
  getUserInfo as getUserInfoUrl
} from '@/api/api'
// 新的
export function login(company, username, password) {
  return request({
    url: loginUrl,
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      // FC: 'Basic ZmVkaXM6MQ=='
      // MP:  bWVtYmVyUG9ydGFsOkVkZW5yZWQ=
      // SMIC: c21pYzox
      // ZmlkZXM6YWJjMTIzJA==
      'Authorization': 'Basic ZmlkZXM6YWJjMTIzJA=='
    },
    data: qs.stringify({
      grant_type: 'custom',
      company: company,
      login_name: username,
      password: sha1(password)
    })
  })
}

export function getInfo() {
  return request({
    url: getUserInfoUrl,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
