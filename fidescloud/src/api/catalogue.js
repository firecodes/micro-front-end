/*
*  2019/10/28
* */

import request from '@/utils/request'
import {
  catalogue
} from './api'

export function queryRedeemCatalogRelGifts(paramsObj) {
  return request({
    url: catalogue.queryRedeemCatalogRelGifts,
    method: 'post',
    data: paramsObj
  })
}

export function queryRedeemCatalogRelCoupons(paramsObj) {
  return request({
    url: catalogue.queryRedeemCatalogRelCoupons,
    method: 'post',
    data: paramsObj
  })
}

export function editRedeemCatalogRelGift(paramsObj) {
  return request({
    url: catalogue.editRedeemCatalogRelGift,
    method: 'post',
    data: paramsObj
  })
}

export function editRedeemCatalogRelCoupon(paramsObj) {
  return request({
    url: catalogue.editRedeemCatalogRelCoupon,
    method: 'post',
    data: paramsObj
  })
}

export function addRedeemCatalogRelCoupon(paramsObj) {
  return request({
    url: catalogue.addRedeemCatalogRelCoupon,
    method: 'post',
    data: paramsObj
  })
}

export function addRelRedeemCatalogGift(paramsObj) {
  return request({
    url: catalogue.addRelRedeemCatalogGift,
    method: 'post',
    data: paramsObj
  })
}

export function disableRedemptionCoupon(paramsObj) {
  return request({
    url: catalogue.disableRedemptionCoupon,
    method: 'post',
    data: paramsObj
  })
}

export function disableRedemptionGift(paramsObj) {
  return request({
    url: catalogue.disableRedemptionGift,
    method: 'post',
    data: paramsObj
  })
}
