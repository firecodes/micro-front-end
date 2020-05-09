import request from '@/utils/request'
import {
  masterdata,
  uploadImgUrl,
  uploadTmpImgUrl,
  uploadFileUrl
} from './api'

export function getDictionaryListByType(form) {
  return request({
    url: masterdata.getDictionaryListByType,
    method: 'post',
    data: form
  })
}

export function getChildDictionaryList(form) {
  return request({
    url: masterdata.getChildDictionaryList,
    method: 'post',
    data: form
  })
}

export function queryBrandList(form) {
  return request({
    url: masterdata.queryBrandList,
    method: 'post',
    data: form
  })
}

export function queryChannelList(form) {
  return request({
    url: masterdata.queryChannelList,
    method: 'post',
    data: form
  })
}

export function queryStoreList(form) {
  return request({
    url: masterdata.queryStoreList,
    method: 'post',
    data: form
  })
}

export function queryEmployeeList(form) {
  return request({
    url: masterdata.queryEmployeeList,
    method: 'post',
    data: form
  })
}

export function queryProductList(form) {
  return request({
    url: masterdata.queryProductList,
    method: 'post',
    data: form
  })
}

export function queryProductCategoryList(form) {
  return request({
    url: masterdata.queryProductCategoryList,
    method: 'post',
    data: form
  })
}

export function uploadImage(form) {
  return request({
    url: uploadImgUrl,
    method: 'post',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: form
  })
}

export function uploadFileNew(form) {
  return request({
    url: uploadFileUrl,
    method: 'post',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: form
  })
}

export function uploadFile(form) {
  return request({
    url: uploadTmpImgUrl,
    method: 'post',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: form
  })
}

export function storeDistinctCity(obj) {
  return request({
    url: masterdata.storeDistinctCity,
    method: 'post',
    data: obj
  })
}

