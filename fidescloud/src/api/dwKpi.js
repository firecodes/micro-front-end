import request from '@/utils/request'
import {
  dwFcKpiController
} from './api'

export function getDwFcKpi(obj) {
  return request({
    url: dwFcKpiController.getDwFcKpi,
    method: 'post',
    data: obj
  })
}

export function getCampaignKpi(obj) {
  return request({
    url: dwFcKpiController.getDwFcKpi,
    method: 'post',
    data: obj
  })
}

export function getMemberKpi(obj) {
  return request({
    url: dwFcKpiController.getMemberKpi,
    method: 'post',
    data: obj
  })
}

export function getFcHomepageMember(obj) {
  return request({
    url: dwFcKpiController.getFcHomepageMember,
    method: 'post',
    data: obj
  })
}

export function getFcHomepageSales(obj) {
  return request({
    url: dwFcKpiController.getFcHomepageSales,
    method: 'post',
    data: obj
  })
}

export function getFcHomepageCampaign(obj) {
  return request({
    url: dwFcKpiController.getFcHomepageCampaign,
    method: 'post',
    data: obj
  })
}
