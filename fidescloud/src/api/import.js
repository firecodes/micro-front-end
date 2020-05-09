/* eslint-disable */
import request from '@/utils/request'
import {
  importService,
  uploadImgUrl
} from './api'

export function listImportType() {
  return request({
    url: importService.listImportType,
    method: 'post',
    data: {}
  })
}
export function importFile(code, file) {
  return request({
    url: importService.importFile,
    method: 'post',
    data: {code, file}
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

export function queryImportStatus(queryParams) {
  return request({
    url: importService.queryImportStatus,
    method: 'post',
    data: {...queryParams}
  })
}

export function queryImportDetail(queryParams) {
  return request({
    url: importService.queryImportDetail,
    method: 'post',
    data: {...queryParams}
  })
}

export function employeetTemplateDownload(data) {
  return request({
    url: '/admin/employee/excel/exportEmployeeTemplate',
    // 'responseType': 'blob',
    method: 'post',
    data
  })
}

// employee upload
export function employeeUpload(excelInfo, data) {
  return request({
    url: '/admin/employee/excel/uploadEmployeeExcel',
    method: 'post',
    headers: { excelInfo },
    FormData: 'FormData',
    data
  })
}
