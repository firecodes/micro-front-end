import request from '@/utils/request'
import { transaction } from './api'

// get transaction list
export function transactionList(data) {
  return request({
    url: transaction.transactionList,
    method: 'post',
    data
  })
}

// transaction detail
export function transactionDetail(data) {
  return request({
    url: transaction.transactionDetail,
    method: 'post',
    data
  })
}

// transaction export
export function transactionExport(data) {
  return request({
    url: transaction.transactionExport,
    method: 'post',
    data
  })
}

// transaction type
export function transactionType(data) {
  return request({
    url: transaction.transactionType,
    method: 'post',
    data
  })
}

// transaction search
export function transactionSearch(data) {
  return request({
    url: transaction.transactionSearch,
    method: 'post',
    data
  })
}
