import request from '@/utils/request'
// store detail
export function storeDetail(obj = {}) {
  return request({
    url: '/store/getDetail',
    method: 'post',
    data: obj
  })
}
// store list
export function storeList(data) {
  return request({
    url: '/store/queryList',
    method: 'post',
    data
  })
}
// store delete
export function storeDelete(data) {
  return request({
    url: '/store/setStoreActive',
    method: 'post',
    data
  })
}
// store add
export function storeInsert(data) {
  return request({
    url: '/store/insertStore',
    method: 'post',
    data
  })
}
// store location
export function getChildDictionaryListType(data) {
  return request({
    url: '/masterdata/getDictionaryListByType',
    method: 'post',
    data
  })
}
// store child dictionary list
export function getChildDictionaryList(data) {
  return request({
    url: '/masterdata/getChildDictionaryList',
    method: 'post',
    data
  })
}
// store edit update
export function storeUpdate(data) {
  return request({
    url: '/store/updateStore',
    method: 'post',
    data
  })
}
