import request from '@/utils/request'
import { lifecycleStudio } from './api'

export function getLifeCycleCampaignWarzdList() {
  return request({
    url: lifecycleStudio.getLifeCycleCampaignWarzdList,
    method: 'post',
    data: {}
  })
}

export function getLifeCycleCampaignWarzd(paramsObj) {
  return request({
    url: lifecycleStudio.getLifeCycleCampaignWarzd,
    method: 'post',
    data: paramsObj
  })
}

export function createLifecycleCampaign(paramsObj) {
  return request({
    url: lifecycleStudio.createLifecycleCampaign,
    method: 'post',
    data: paramsObj
  })
}

export function getLifeCycleTemplateListByType(paramsObj) {
  return request({
    url: lifecycleStudio.getLifeCycleTemplateListByType,
    method: 'post',
    data: paramsObj
  })
}

export function cancelLifecycleCampaign(paramsObj) {
  return request({
    url: lifecycleStudio.cancelLifecycleCampaign,
    method: 'post',
    data: paramsObj
  })
}

