import request from '@/utils/request'
import {
  appApi
} from './api'

export function pageQueryApp(obj = {}) {
  return request({
    url: appApi.pageQueryApp,
    method: 'post',
    data: obj
  })
}
