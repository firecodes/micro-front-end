import request from '@/utils/request'
import {
  test_group
} from './api'

export function groupList(obj = {}) {
  return request({
    url: test_group.groupList,
    method: 'post',
    data: obj
  })
}

export function groupAdd(obj = {}) {
  return request({
    url: test_group.groupAdd,
    method: 'post',
    data: obj
  })
}

export function groupEdit(obj = {}) {
  return request({
    url: test_group.groupEdit,
    method: 'post',
    data: obj
  })
}

export function groupDetail(params = {}) {
  return request({
    url: test_group.groupDetail,
    method: 'get',
    params
  })
}

export function groupDelete(obj = {}) {
  return request({
    url: test_group.groupDelete,
    method: 'post',
    params: obj
  })
}

export function campaignTestHistoryList(obj = {}) {
  return request({
    url: test_group.campaignTestHistoryList,
    method: 'post',
    data: obj
  })
}

export function campaignTestHistoryDetail(obj = {}) {
  return request({
    url: test_group.campaignTestHistoryDetail,
    method: 'post',
    data: obj
  })
}

export function campaignTestHistorySend(obj = {}) {
  return request({
    url: test_group.campaignTestHistorySend,
    method: 'post',
    data: obj
  })
}
