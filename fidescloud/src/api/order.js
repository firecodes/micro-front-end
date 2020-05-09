import request from '@/utils/request'
import {
  orderList
} from './api'
export function allOrderInfo(paramsObj) {
  return request({
    url: orderList.allOrder,
    method: 'post',
    data: paramsObj
  })
}

export function exportallOrderInfo(paramsObj) {
  return request({
    url: orderList.exportallOrder,
    method: 'post',
    data: paramsObj
  })
}

export function approveOrderInfo(paramsObj) {
  return request({
    url: orderList.approveOrder,
    method: 'post',
    data: paramsObj
  })
}

export function reima_allOrderInfo(paramsObj) {
  return request({
    url: orderList.reima_allOrder,
    method: 'post',
    data: paramsObj
  })
}

export function reima_exportallOrderInfo(paramsObj) {
  return request({
    url: orderList.reima_exportallOrder,
    method: 'post',
    data: paramsObj
  })
}

export function reima_approveOrderInfo(paramsObj) {
  return request({
    url: orderList.reima_approveOrder,
    method: 'post',
    data: paramsObj
  })
}

export function allReservation(paramsObj) {
  return request({
    url: orderList.allReservation,
    method: 'post',
    data: paramsObj
  })
}

export function updateReservation(paramsObj) {
  return request({
    url: orderList.updateReservation,
    method: 'post',
    data: paramsObj
  })
}
export function exportdateReservation(paramsObj) {
  return request({
    url: orderList.exportdateReservation,
    method: 'post',
    data: paramsObj
  })
}
export function queryBlacklist(paramsObj) {
  return request({
    url: orderList.queryBlacklist,
    method: 'post',
    data: paramsObj
  })
}

export function insertBlack(paramsObj) {
  return request({
    url: orderList.insertBlack,
    method: 'post',
    data: paramsObj
  })
}

export function removeBlack(paramsObj) {
  return request({
    url: orderList.removeBlack,
    method: 'post',
    data: paramsObj
  })
}

export function queryBlackByMobile(paramsObj) {
  return request({
    url: orderList.queryBlackByMobile,
    method: 'post',
    data: paramsObj
  })
}

