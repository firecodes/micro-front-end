import request from '@/utils/request'
import { memberTag, masterdata } from './api'

export function queryAllTags(data) {
  return request({
    url: memberTag.queryAllTags,
    method: 'post',
    data: data
  })
}
export function memberTagDetail(id) {
  return request({
    url: memberTag.memberTagDetail + `/${id}`,
    method: 'get'
  })
}
export function deleteMemberTag(id) {
  return request({
    url: memberTag.deleteMemberTag + `/${id}`,
    method: 'post'
  })
}
export function queryTagGroup() {
  return request({
    url: memberTag.queryTagGroup,
    method: 'get'
  })
}
export function queryCategory() {
  return request({
    url: memberTag.queryCategory,
    method: 'get'
  })
}
export function addMemberTagGroup(data) {
  return request({
    url: memberTag.addMemberTagGroup,
    method: 'post',
    data
  })
}
export function editMemberTagGroup(data) {
  return request({
    url: memberTag.editMemberTagGroup,
    method: 'post',
    data
  })
}
export function deleteMemberTagGroup(data) {
  return request({
    url: `${memberTag.deleteMemberTagGroup}/${data}`,
    method: 'post'
  })
}
export function addMemberTag(data) {
  return request({
    url: memberTag.addMemberTag,
    method: 'post',
    data
  })
}
export function detailMemberTag(id) {
  return request({
    url: memberTag.detailMemberTag + `/${id}`,
    method: 'get'
  })
}
export function editMemberTag(data) {
  return request({
    url: memberTag.editMemberTag,
    method: 'post',
    data
  })
}
export function batchQueryProductList(data) {
  return request({
    url: memberTag.batchQueryProductList,
    method: 'post',
    data
  })
}
export function queryAllTag() {
  return request({
    url: memberTag.queryAllTag,
    method: 'get'
  })
}
export function queryChannelList(data) {
  return request({
    url: memberTag.queryChannelList,
    method: 'post',
    data
  })
}
export function listMemberTier(data) {
  return request({
    url: memberTag.listMemberTier,
    method: 'post',
    data
  })
}
export function getDictionary(data) {
  return request({
    url: memberTag.getDictionary,
    method: 'post',
    data
  })
}
export function queryStoreList(form) {
  return request({
    url: masterdata.queryBatchStoreList,
    method: 'post',
    data: form
  })
}
export function getOptionType(data) {
  return request({
    url: memberTag.getOptionType,
    method: 'post',
    data: data
  })
}
export function getDictionaryListByType(data) {
  return request({
    url: memberTag.getDictionaryListByType,
    method: 'post',
    data: data
  })
}
export function getDictionaryById(data, code) {
  return request({
    url: memberTag.getDictionaryById + `?id=${data}&lang_type_code=${code}`,
    method: 'get'
  })
}

