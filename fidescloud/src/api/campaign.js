import request from '@/utils/request'
import {
  campaign
} from './api'

export function addOrUpdateCampaignInfo(paramsObj) {
  return request({
    url: campaign.addOrUpdateCampaignInfo,
    method: 'post',
    data: paramsObj
  })
}

export function addOrUpdateCampaignTarget(paramsObj) {
  return request({
    url: campaign.addOrUpdateCampaignTarget,
    method: 'post',
    data: paramsObj
  })
}

export function addOrUpdateCampaignReward(paramsObj) {
  return request({
    url: campaign.addOrUpdateCampaignReward,
    method: 'post',
    data: paramsObj
  })
}

export function addOrUpdateCampaignCommunication(paramsObj) {
  return request({
    url: campaign.addOrUpdateCampaignCommunication,
    method: 'post',
    data: paramsObj
  })
}

export function getTemplateListByCommunicationChannelType(paramsObj) {
  return request({
    url: campaign.getTemplateListByCommunicationChannelType,
    method: 'post',
    data: paramsObj
  })
}

export function addOrUpdateCommunicationChannelTemplate(paramsObj) {
  return request({
    url: campaign.addOrUpdateCommunicationChannelTemplate,
    method: 'post',
    data: paramsObj
  })
}

export function getCampaignWizardInfo(paramsObj) {
  return request({
    url: campaign.getCampaignWizardInfo,
    method: 'post',
    data: paramsObj
  })
}

export function submitCampaign(paramsObj) {
  return request({
    url: campaign.submitCampaign,
    method: 'post',
    data: paramsObj
  })
}

export function queryCampaignListBySearch(paramsObj) {
  return request({
    url: campaign.queryCampaignListBySearch,
    method: 'post',
    data: paramsObj
  })
}

export function getCommunicationChannelTypeList() {
  return request({
    url: campaign.getCommunicationChannelTypeList,
    method: 'post',
    data: {}
  })
}

export function getReservedFieldListByCommunicationChannelType(paramsObj) {
  return request({
    url: campaign.getReservedFieldListByCommunicationChannelType,
    method: 'post',
    data: paramsObj
  })
}

export function addTemplate(paramsObj) {
  return request({
    url: campaign.addTemplate,
    method: 'post',
    data: paramsObj
  })
}

export function updateTemplate(paramsObj) {
  return request({
    url: campaign.updateTemplate,
    method: 'post',
    data: paramsObj
  })
}

export function addCommunicationChannel(paramsObj) {
  return request({
    url: campaign.addCommunicationChannel,
    method: 'post',
    data: paramsObj
  })
}

export function calcTarget(paramsObj) {
  return request({
    url: campaign.calcTarget,
    method: 'post',
    data: paramsObj
  })
}

export function queryCalcTarget(paramsObj) {
  return request({
    url: campaign.queryCalcTarget,
    method: 'post',
    data: paramsObj
  })
}

export function getPerformanceByCampaignCode(paramsObj) {
  return request({
    url: campaign.getPerformanceByCampaignCode,
    method: 'post',
    data: paramsObj
  })
}

export function queryTriggerCampaignList() {
  return request({
    url: campaign.queryTriggerCampaignList,
    method: 'post',
    data: {}
  })
}

export function submitTriggerCampaignFeedback(obj = {}) {
  return request({
    url: campaign.submitTriggerCampaignFeedback,
    method: 'post',
    data: obj
  })
}

export function queryTriggerCampaignById(obj = {}) {
  return request({
    url: campaign.queryTriggerCampaignById,
    method: 'post',
    data: obj
  })
}

export function sendCommunication(obj = {}) {
  return request({
    url: campaign.sendCommunication,
    method: 'post',
    data: obj
  })
}

export function submitTriggerCampaign(obj = {}) {
  return request({
    url: campaign.submitTriggerCampaign,
    method: 'post',
    data: obj
  })
}

export function getCampaignWizardList(obj = {}) {
  return request({
    url: campaign.getCampaignWizardList,
    method: 'post',
    data: obj
  })
}

export function getTesterGroupList() {
  return request({
    url: campaign.getTesterGroupList,
    method: 'post'
  })
}

export function getCampaignTypeInfo(obj) {
  return request({
    url: campaign.getCampaignTypeInfo,
    method: 'post',
    data: obj
  })
}

export function sendTesterGroupCommunication(obj) {
  return request({
    url: campaign.sendTesterGroupCommunication,
    method: 'post',
    data: obj
  })
}

export function disableCampaign(obj) {
  return request({
    url: campaign.disableCampaign,
    method: 'post',
    data: obj
  })
}

export function cancelLifecycleCampaign(obj) {
  return request({
    url: campaign.cancelLifecycleCampaign,
    method: 'post',
    data: obj
  })
}

export function deleteTemplate(obj) {
  return request({
    url: campaign.deleteTemplate,
    method: 'post',
    data: obj
  })
}

export function getCampaignBudgeInfo(obj) {
  return request({
    url: campaign.getCampaignBudgeInfo,
    method: 'post',
    data: obj
  })
}
