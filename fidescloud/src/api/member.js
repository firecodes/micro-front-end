import request from '@/utils/request'
import {
  member,
  loyalty
} from './api'

export function createMember(form) {
  return request({
    url: member.createMember,
    method: 'post',
    data: form
  })
}

export function getConfiguration() {
  return request({
    url: '/member/queryMemberBySearch123',
    method: 'post'
  })
}

export function updateMember(form) {
  return request({
    url: member.updateMember,
    method: 'post',
    data: form
  })
}

export function checkMemberCode(member_code) {
  return request({
    url: member.checkMemberCode,
    method: 'post',
    data: { member_code: member_code }
  })
}

export function getMemberInfo(member_code) {
  return request({
    url: member.getMemberInfo,
    method: 'post',
    data: { member_code: member_code }
  })
}

export function queryMemberListBySearch(paramsObj) {
  return request({
    url: member.queryMemberListBySearch,
    method: 'post',
    data: paramsObj
  })
}

export function getMemberTransactionList(paramsObj) {
  return request({
    url: member.getMemberTransactionList,
    method: 'post',
    data: paramsObj
  })
}

export function getMemberTransactionDetailList(paramsObj) {
  return request({
    url: member.getMemberTransactionDetailList,
    method: 'post',
    data: paramsObj
  })
}

export function getMemberTierList(paramsObj) {
  return request({
    url: member.getMemberTierList,
    method: 'post',
    data: paramsObj
  })
}

export function getMemberSegmentationList(member_code) {
  return request({
    url: member.getMemberSegmentationList,
    method: 'post',
    data: { member_code: member_code }
  })
}

export function getMemberAvailableCampaign(obj) {
  return request({
    url: member.getMemberAvailableCampaign,
    method: 'post',
    data: obj
  })
}

export function getMemberAccountType(member_code) {
  return request({
    url: member.getMemberAccountType,
    method: 'post',
    data: { member_code: member_code }
  })
}

export function getMemberPoint(paramsObj) {
  return request({
    url: member.getMemberPoint,
    method: 'post',
    data: paramsObj
  })
}

export function queryMemberPointHistoryByAccount(paramsObj) {
  return request({
    url: member.queryMemberPointHistoryByAccount,
    method: 'post',
    data: paramsObj
  })
}

export function queryMemberCouponListBySearch(paramsObj) {
  return request({
    url: member.queryMemberCouponListBySearch,
    method: 'post',
    data: paramsObj
  })
}

export function queryMemberCampaignListBySearch(paramsObj) {
  return request({
    url: member.queryMemberCampaignListBySearch,
    method: 'post',
    data: paramsObj
  })
}

export function getMemberSNSList(paramsObj) {
  return request({
    url: member.getMemberSNSList,
    method: 'post',
    data: paramsObj
  })
}

export function quickQueryMemberBySearch(obj) {
  return request({
    url: member.quickQueryMemberBySearch,
    method: 'post',
    data: obj
  })
}

export function getMemberTransactionDetail(obj) {
  return request({
    url: member.getMemberTransactionDetail,
    method: 'post',
    data: obj
  })
}

export function queryMemberGiftListBySearch(obj) {
  return request({
    url: member.queryMemberGiftListBySearch,
    method: 'post',
    data: obj
  })
}

export function updateMemberTier(obj) {
  return request({
    url: member.updateMemberTier,
    method: 'post',
    data: obj
  })
}

export function queryMemberTierList(obj) {
  return request({
    url: loyalty.queryMemberTierList,
    method: 'post',
    data: obj
  })
}

export function adjustMemberPointWithHistory(obj) {
  return request({
    url: member.adjustMemberPointWithHistory,
    method: 'post',
    data: obj
  })
}

export function getMemberDynamicInfo(member_code) {
  return request({
    url: `${member.getMemberDynamicInfo}/${member_code}`,
    method: 'get'
  })
}

export function saveOrUpdateMemberDynamicInfo(obj) {
  return request({
    url: member.saveOrUpdateMemberDynamicInfo,
    method: 'post',
    data: obj
  })
}

export function exportMember(obj) {
  return request({
    url: member.export,
    method: 'post',
    data: obj
  })
}

export function getMemberDynamicFields() {
  return request({
    url: member.getMemberDynamicFields,
    method: 'get'
  })
}

export function queryMemberGroupList(obj) {
  return request({
    url: member.queryMemberGroupList,
    method: 'post',
    data: obj
  })
}

export function queryAllTags() {
  return request({
    url: member.queryAllTags,
    method: 'get'
  })
}

export function queryMemberNumAndDetailByTag(obj) {
  return request({
    url: member.queryMemberNumAndDetailByTag,
    method: 'post',
    data: obj
  })
}

export function quickQueryMemberNumByGroup(obj) {
  return request({
    url: member.quickQueryMemberNumByGroup,
    method: 'post',
    data: obj
  })
}

export function checkMemberFieldUsing(obj) {
  return request({
    url: member.checkMemberFieldUsing,
    method: 'post',
    data: obj
  })
}
