import request from '@/utils/request'
import {
  oss
} from './api'

export function str2html(content, pack_html) {
  return request({
    url: oss.str2html,
    method: 'post',
    data: {
      content: content,
      pack_html: pack_html
    }
  })
}

export function html2Str(fileUrl) {
  return request({
    url: oss.html2Str,
    method: 'post',
    params: {
      fileUrl: fileUrl
    }
  })
}
