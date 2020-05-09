import request from '@/utils/request'
import {
  dictionary
} from './api'

export function getDictionaryListByName(paramsObj) {
  return request({
    url: dictionary.getDictionaryListByName,
    method: 'post',
    data: paramsObj
  })
}

export function getChildDictionaryList(paramsObj) {
  return request({
    url: dictionary.getChildDictionaryList,
    method: 'post',
    data: paramsObj
  })
}
