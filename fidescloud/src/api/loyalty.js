import request from '@/utils/request'
import {
  loyalty
} from './api'

export function addOrUpdatePointRule(paramsObj) {
  return request({
    url: loyalty.addOrUpdatePointRule,
    method: 'post',
    data: paramsObj
  })
}

export function addPointRule(paramsObj) {
  return request({
    url: loyalty.addPointRule,
    method: 'post',
    data: paramsObj
  })
}

export function updatePointRule(paramsObj) {
  return request({
    url: loyalty.updatePointRule,
    method: 'post',
    data: paramsObj
  })
}

export function queryPointRule() {
  return request({
    url: loyalty.queryPointRule,
    method: 'post',
    data: {}
  })
}

export function queryPointTypeList(paramsObj) {
  return request({
    url: loyalty.queryPointTypeList,
    method: 'post',
    data: paramsObj
  })
}

export function addPointType(paramsObj) {
  return request({
    url: loyalty.addPointType,
    method: 'post',
    data: paramsObj
  })
}

export function updatePointType(paramsObj) {
  return request({
    url: loyalty.updatePointType,
    method: 'post',
    data: paramsObj
  })
}

export function addOrUpdatePointType(paramsObj) {
  return request({
    url: loyalty.addOrUpdatePointType,
    method: 'post',
    data: paramsObj
  })
}

export function checkPointTypeCode(code) {
  return request({
    url: loyalty.checkPointTypeCode,
    method: 'post',
    data: { point_type_code: code }
  })
}

export function addOrUpdateAccountType(paramsObj) {
  return request({
    url: loyalty.addOrUpdateAccountType,
    method: 'post',
    data: paramsObj
  })
}

export function checkAccountTypeCode(code) {
  return request({
    url: loyalty.checkAccountTypeCode,
    method: 'post',
    data: { code: code }
  })
}

export function queryAccountTypeList(paramsObj) {
  return request({
    url: loyalty.queryAccountTypeList,
    method: 'post',
    data: paramsObj
  })
}

export function queryCouponListBy(paramsObj) {
  return request({
    url: loyalty.queryCouponListBy,
    method: 'post',
    data: paramsObj
  })
}

export function addOrUpdateCoupon(paramsObj) {
  return request({
    url: loyalty.addOrUpdateCoupon,
    method: 'post',
    data: paramsObj
  })
}

export function saveCoupon(paramsObj) {
  return request({
    url: loyalty.saveCoupon,
    method: 'post',
    data: paramsObj
  })
}

export function updateCoupon(paramsObj) {
  return request({
    url: loyalty.updateCoupon,
    method: 'post',
    data: paramsObj
  })
}

export function checkCouponCode(coupon_code) {
  return request({
    url: loyalty.checkCouponCode,
    method: 'post',
    data: { coupon_code: coupon_code }
  })
}

export function queryCouponTypeList(paramsObj) {
  return request({
    url: loyalty.queryCouponTypeList,
    method: 'post',
    data: paramsObj
  })
}

export function queryMemberTierList(paramsObj) {
  return request({
    url: loyalty.queryMemberTierList,
    method: 'post',
    data: paramsObj
  })
}

export function addOrUpdateMemberTier(paramsObj) {
  return request({
    url: loyalty.addOrUpdateMemberTier,
    method: 'post',
    data: { tiers: paramsObj }
  })
}

export function queryPointRuleSpecByStore(paramsObj) {
  return request({
    url: loyalty.queryPointRuleSpecByStore,
    method: 'post',
    data: paramsObj
  })
}

export function checkMemberCouponCode(obj) {
  return request({
    url: loyalty.checkMemberCouponCode,
    method: 'post',
    data: obj
  })
}

export function addLoyaltyProcessCfg(obj) {
  return request({
    url: loyalty.addLoyaltyProcessCfg,
    method: 'post',
    data: obj
  })
}

export function queryLoyaltyProcessCfg(obj) {
  return request({
    url: loyalty.queryLoyaltyProcessCfg,
    method: 'post',
    data: obj
  })
}

export function updateLoyaltyProcessCfg(obj) {
  return request({
    url: loyalty.updateLoyaltyProcessCfg,
    method: 'post',
    data: obj
  })
}

export function searchGift(obj) {
  return request({
    url: loyalty.searchGift,
    method: 'post',
    data: obj
  })
}

export function queryGiftCategory(obj) {
  return request({
    url: loyalty.queryGiftCategory,
    method: 'post',
    data: obj
  })
}

export function createGiftCategory(obj) {
  return request({
    url: loyalty.createGiftCategory,
    method: 'post',
    data: obj
  })
}

export function deleteGiftCategoryByCode(obj) {
  return request({
    url: loyalty.deleteGiftCategoryByCode,
    method: 'post',
    data: obj
  })
}

export function updateGiftCategoryByCode(obj) {
  return request({
    url: loyalty.updateGiftCategoryByCode,
    method: 'post',
    data: obj
  })
}

export function batchDeleteGift(obj) {
  return request({
    url: loyalty.batchDeleteGift,
    method: 'post',
    data: obj
  })
}

export function checkGiftCode(obj) {
  return request({
    url: loyalty.checkGiftCode,
    method: 'post',
    data: obj
  })
}

export function newGift(obj) {
  return request({
    url: loyalty.newGift,
    method: 'post',
    data: obj
  })
}

export function editGift(obj) {
  return request({
    url: loyalty.editGift,
    method: 'post',
    data: obj
  })
}

export function batchDeleteCoupon(obj) {
  return request({
    url: loyalty.batchDeleteCoupon,
    method: 'post',
    data: obj
  })
}

export function getCouponInfoByCode(obj) {
  return request({
    url: loyalty.getCouponInfoByCode,
    method: 'post',
    data: obj
  })
}

export function getGiftByCode(obj) {
  return request({
    url: loyalty.getGiftByCode,
    method: 'post',
    data: obj
  })
}

export function isEnableCouponTools(obj) {
  return request({
    url: loyalty.isEnableCouponTools,
    method: 'post',
    data: obj
  })
}

export function obtainAddCouponPage(obj) {
  return request({
    url: loyalty.obtainAddCouponPage,
    method: 'post',
    data: obj
  })
}

export function obtainEditCouponPage(obj) {
  return request({
    url: loyalty.obtainEditCouponPage,
    method: 'post',
    data: obj
  })
}
