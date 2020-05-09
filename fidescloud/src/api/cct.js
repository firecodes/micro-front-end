import request from '@/utils/request'
import {
  cct as cctApi
} from './api'

export function getMobileRegionCode() {
  return request({
    url: cctApi.getMobileRegionCode,
    method: 'post'
  })
}
