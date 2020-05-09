import request from '@/utils/request'

// communication list by employee
export function employeeHistoryList(data) {
  return request({
    url: '/admin/communication/queryEmployeeHistoryList',
    method: 'post',
    data
  })
}

// communication list by member
export function memberHistoryList(data) {
  return request({
    url: '/admin/communication/queryMemberHistoryList',
    method: 'post',
    data
  })
}

// communication history messageList
export function communicationMessageList(data) {
  return request({
    url: '/admin/communication/queryMessageList',
    method: 'post',
    data
  })
}

// export communication list
export function exportTenantHistory(data) {
  return request({
    url: '/admin/communication/exportTenantHistory',
    method: 'post',
    data
  })
}

// export communication employee history
export function exportEmployeeHistory(data) {
  return request({
    url: '/admin/communication/exportEmployeeHistory',
    method: 'post',
    data
  })
}

// export communication session history
export function exportSessionHistory(data) {
  return request({
    url: '/admin/communication/exportSessionHistory',
    method: 'post',
    data
  })
}
