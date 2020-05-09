import request from '@/utils/request'
import {
  redemption
} from './api'

export function searchRedemptionEvent(form) {
  return request({
    url: redemption.searchRedemptionEvent,
    method: 'post',
    data: form
  })
}

export function checkGiftCode(gift_code) {
  return request({
    url: redemption.checkGiftCode,
    method: 'post',
    data: {
      gift_code: gift_code
    }
  })
}
export function newGift(form) {
  return request({
    url: redemption.newGift,
    method: 'post',
    data: form
  })
}
export function editGift(form) {
  return request({
    url: redemption.editGift,
    method: 'post',
    data: form
  })
}
export function searchGift(form) {
  return request({
    url: redemption.searchGift,
    method: 'post',
    data: form
  })
}
export function newRedemptionEvent(form) {
  return request({
    url: redemption.newRedemptionEvent,
    method: 'post',
    data: form
  })
}
export function editRedemptionEventBasicInfo(form) {
  return request({
    url: redemption.editRedemptionEventBasicInfo,
    method: 'post',
    data: form
  })
}
export function addGiftForRedemptionEvent(form) {
  return request({
    url: redemption.addGiftForRedemptionEvent,
    method: 'post',
    data: form
  })
}
export function editGiftForRedemptionEvent(form) {
  return request({
    url: redemption.editGiftForRedemptionEvent,
    method: 'post',
    data: form
  })
}
export function removeGiftForRedemptionEvent(form) {
  return request({
    url: redemption.removeGiftForRedemptionEvent,
    method: 'post',
    data: form
  })
}
export function addCouponForRedemptionEvent(form) {
  return request({
    url: redemption.addCouponForRedemptionEvent,
    method: 'post',
    data: form
  })
}
export function editCouponForRedemptionEvent(form) {
  return request({
    url: redemption.editCouponForRedemptionEvent,
    method: 'post',
    data: form
  })
}
export function removeCouponForRedemptionEvent(form) {
  return request({
    url: redemption.removeCouponForRedemptionEvent,
    method: 'post',
    data: form
  })
}
export function getRedemptionEventDetail(form) {
  return request({
    url: redemption.getRedemptionEventDetail,
    method: 'post',
    data: form
  })
}
export function queryRedemptionOrder(form) {
  return request({
    url: redemption.queryRedemptionOrder,
    method: 'post',
    data: form
  })
}
export function queryValidRedemptionEvent(form) {
  return request({
    url: redemption.queryValidRedemptionEvent,
    method: 'post',
    data: form
  })
}
export function exportRedemptionList(form) {
  return request({
    url: redemption.exportRedemptionList,
    method: 'post',
    data: form,
    responseType: 'blob'
  })
}

export function cancelRedemptionOrder(form) {
  return request({
    url: redemption.cancelRedemptionOrder,
    method: 'post',
    data: form
  })
}

export function memberRedeemOrderByTotalPointAndCouponCodes(obj) {
  return request({
    url: redemption.memberRedeemOrderByTotalPointAndCouponCodes,
    method: 'post',
    data: obj
  })
}
