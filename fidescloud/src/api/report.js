import request from '@/utils/request'
import {
  report
} from './api'

export function memberRecruitmentReport(form) {
  return request({
    url: report.memberRecruitmentReport,
    method: 'post',
    data: form
  })
}

export function memberTransactionReport(form) {
  return request({
    url: report.memberTransactionReport,
    method: 'post',
    data: form
  })
}

export function memberPointReport(form) {
  return request({
    url: report.memberPointReport,
    method: 'post',
    data: form
  })
}

export function memberCouponReport(form) {
  return request({
    url: report.memberCouponReport,
    method: 'post',
    data: form
  })
}

export function memberRedemptionReport(form) {
  return request({
    url: report.memberRedemptionReport,
    method: 'post',
    data: form
  })
}

export function pointReport(form) {
  return request({
    url: report.pointReport,
    method: 'post',
    data: form
  })
}

export function transactionReport(form) {
  return request({
    url: report.transactionReport,
    method: 'post',
    data: form
  })
}

export function getMemberRecruitment(obj) {
  return request({
    url: report.getMemberRecruitment,
    method: 'post',
    data: obj
  })
}

export function getNewMembers(obj) {
  return request({
    url: report.getNewMembers,
    method: 'post',
    data: obj
  })
}

export function associationReport(obj) {
  return request({
    url: report.associationReport,
    method: 'post',
    data: obj
  })
}

export function getMemberTier(obj) {
  return request({
    url: report.getMemberTier,
    method: 'post',
    data: obj
  })
}

export function memberSalesRanking(obj) {
  return request({
    url: report.memberSalesRanking,
    method: 'post',
    data: obj
  })
}

export function businessTransactionReport(obj) {
  return request({
    url: report.businessTransactionReport,
    method: 'post',
    data: obj
  })
}

export function memberTypeTransactionReport(obj) {
  return request({
    url: report.memberTypeTransactionReport,
    method: 'post',
    data: obj
  })
}

export function memberTierSalesTransReport(obj) {
  return request({
    url: report.memberTierSalesTransReport,
    method: 'post',
    data: obj
  })
}

export function channelSales(obj) {
  return request({
    url: report.channelSales,
    method: 'post',
    data: obj
  })
}

export function channelTransaction(obj) {
  return request({
    url: report.channelTransaction,
    method: 'post',
    data: obj
  })
}

export function skuContribution(obj) {
  return request({
    url: report.skuContribution,
    method: 'post',
    data: obj
  })
}

export function pointsLiabilityTier(obj) {
  return request({
    url: report.pointsLiabilityTier,
    method: 'post',
    data: obj
  })
}

export function tierUpgrade(obj) {
  return request({
    url: report.tierUpgrade,
    method: 'post',
    data: obj
  })
}

export function tierDowngrade(obj) {
  return request({
    url: report.tierDowngrade,
    method: 'post',
    data: obj
  })
}

export function pointsIssuance(obj) {
  return request({
    url: report.pointsIssuance,
    method: 'post',
    data: obj
  })
}
