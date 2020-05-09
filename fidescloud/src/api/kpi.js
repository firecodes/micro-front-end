import request from '@/utils/request'
import {
  kpi
} from './api'

export function getMemberKPI(member_code) {
  return request({
    url: kpi.getMemberKPI,
    method: 'post',
    data: { member_code: member_code }
  })
}
export function getMemberChannelKPI(member_code) {
  return request({
    url: kpi.getMemberChannelKPI,
    method: 'post',
    data: { member_code: member_code }
  })
}

export function getMemberMonthlyKPI(obj) {
  return request({
    url: kpi.getMemberMonthlyKPI,
    method: 'post',
    data: obj
  })
}

export function getTenantKPI() {
  return request({
    url: kpi.getTenantKPI,
    method: 'post',
    data: {}
  })
}

export function getTenantKPIYearly(year) {
  return request({
    url: kpi.getTenantKPIYearly,
    method: 'post',
    data: { year: year }
  })
}

export function getTenantKPIByTier() {
  return request({
    url: kpi.getTenantKPIByTier,
    method: 'post',
    data: {}
  })
}

export function getTenantKPIMonthly(year) {
  return request({
    url: kpi.getTenantKPIMonthly,
    method: 'post',
    data: { year: year }
  })
}

export function getTenantCampaignKPIYearly(year) {
  return request({
    url: kpi.getTenantCampaignKPIYearly,
    method: 'post',
    data: { year: year }
  })
}

export function listTenantKPIMonthly(obj) {
  return request({
    url: kpi.listTenantKPIMonthly,
    method: 'post',
    data: obj
  })
}

// 获取雇员kpi
export function employeeMonthlyKpi(data) {
  return request({
    url: '/admin/kpi/getEmployeeMonthlyKpi',
    method: 'post',
    data
  })
}
