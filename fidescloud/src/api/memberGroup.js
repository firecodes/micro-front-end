import request from '@/utils/request'
import { memberGroup } from './api'
export function queryMemberGroupList(data) {
  return request({
    url: memberGroup.queryMemberGroupList,
    method: 'post',
    data: data
  })
}
export function addMemberGroup(data) {
  return request({
    url: memberGroup.addMemberGroup,
    method: 'post',
    data: data
  })
}
export function calc(data) {
  return request({
    url: memberGroup.calc,
    method: 'post',
    data: data
  })
}
export function deleteMemberGroup(id) {
  return request({
    url: memberGroup.deleteMemberGroup + `/${id}`,
    method: 'post'
  })
}
export function updateMemberGroup(data) {
  return request({
    url: memberGroup.updateMemberGroup,
    method: 'post',
    data
  })
}
export function getMemberGroupInfo(id) {
  return request({
    url: memberGroup.getMemberGroupInfo + `/${id}`,
    method: 'get'
  })
}
export function addRecommendMemberGroup(id) {
  return request({
    url: memberGroup.addRecommendMemberGroup + `/${id}`,
    method: 'post'
  })
}
