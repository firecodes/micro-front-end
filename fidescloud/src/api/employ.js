import request from '@/utils/request'
import { employee } from '@/api/api'
// employee query list
export function employeeList(data) {
  return request({
    url: '/employee/queryList',
    method: 'post',
    data
  })
}
// employee delete
export function employeeDelete(data) {
  return request({
    url: '/employee/setEmployeeActive',
    method: 'post',
    data
  })
}
// employee detail
export function employeeDetail(data) {
  return request({
    url: employee.employeeDetail,
    method: 'post',
    data
  })
}
// employee query position role
export function queryEmployeeRole(data) {
  return request({
    url: employee.queryEmployeeRole,
    method: 'post',
    data
  })
}
// employee delete position role
export function setEmployeeRoleActive(data) {
  return request({
    url: employee.setEmployeeRoleActive,
    method: 'post',
    data
  })
}
// employee update position role
export function updateEmployeeRole(data) {
  return request({
    url: employee.updateEmployeeRole,
    method: 'post',
    data
  })
}
// employee add position type
export function insertEmployeeRole(data) {
  return request({
    url: employee.insertEmployeeRole,
    method: 'post',
    data
  })
}
// add employee
export function insertEmployee(data) {
  return request({
    url: employee.insertEmployee,
    method: 'post',
    data
  })
}
// edit employee
export function updateEmployee(data) {
  return request({
    url: '/employee/updateEmployee',
    method: 'post',
    data
  })
}
