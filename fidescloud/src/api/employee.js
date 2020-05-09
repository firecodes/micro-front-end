import request from '@/utils/request'

// employee list
export function employeeList(data) {
  return request({
    url: '/admin/employee/queryList',
    method: 'post',
    data
  })
}

// employee disable
export function employeeDisable(id, active_flag) {
  return request({
    url: '/admin/employee/setEmployeeEnable',
    method: 'post',
    data: { id, active_flag }
  })
}

// employee delete
export function employeeDelete(id, active_flag) {
  return request({
    url: '/admin/employee/setEmployeeActive',
    method: 'post',
    data: { id, active_flag }
  })
}

// employee detail
export function employeeDetail(id) {
  return request({
    url: '/admin/employee/getDetail',
    method: 'post',
    data: { id }
  })
}

// store employee list
export function storeEmployeeList(data) {
  return request({
    url: '/admin/employee/queryEmployeeListByStoreId',
    method: 'post',
    data
  })
}

// employee by store code and employee name
export function storeEmployeeListBystore(data) {
  return request({
    url: '/admin/employee/queryEmployeeListByCodeAndStore',
    method: 'post',
    data
  })
}

// employee by role
export function employeeListByRole(data) {
  return request({
    url: '/admin/employee/queryEmployeeByRoleLevel',
    method: 'post',
    data
  })
}

// add employee
export function addEmployee(data) {
  return request({
    url: '/admin/employee/insertEmployee',
    method: 'post',
    data
  })
}

// edit employee
export function editEmployee(data) {
  return request({
    url: '/admin/employee/updateEmployee',
    method: 'post',
    data
  })
}

// 验证email,phone不能重复
export function employeeDetection(data) {
  return request({
    url: '/admin/employee/getEmployeeParameterCount',
    method: 'post',
    data
  })
}

// employee role list
export function employeeRoleList(data) {
  return request({
    url: '/admin/employee/role/queryEmployeeRole',
    method: 'post',
    data
  })
}

// employee role add
export function employeeRoleAdd(name) {
  return request({
    url: '/admin/employee/role/insertEmployeeRole',
    method: 'post',
    data: { name }
  })
}

// employee role edit
export function employeeRoleEdit(id, name) {
  return request({
    url: '/admin/employee/role/updateEmployeeRole',
    method: 'post',
    data: { id, name }
  })
}

// employee role delete
export function employeeRoleDelete(id, active_flag) {
  return request({
    url: '/admin/employee/role/updateEmployeeRoleWithActiveFlag',
    method: 'post',
    data: { id, active_flag }
  })
}

// employee template download
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

// export all employees
export function exportAllEmployees(data) {
  return request({
    url: '/admin/employee/excel/exportEmployeeExcel',
    method: 'post',
    data
  })
}

// 获取员工总数
export function employeeSum() {
  return request({
    url: '/admin/employee/activeSum',
    method: 'post'
  })
}

// 忘记密码发送验证码
export function sendPasswordVerificationCode(data) {
  return request({
    url: '/admin/employee/sendPasswordVerificationCode',
    method: 'post',
    data
  })
}

// forgetPassword
export function forgetPassword(data) {
  return request({
    url: '/admin/employee/forgetPassword',
    method: 'post',
    data
  })
}
