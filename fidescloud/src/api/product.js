import request from '@/utils/request'
import { product } from './api'

// get product list
export function getProductList(data) {
  return request({
    url: product.productList,
    method: 'post',
    data
  })
}

// delete product
export function deleteProduct(data) {
  return request({
    url: product.productInactive,
    method: 'post',
    data
  })
}

// get product detail
export function productDetail(data) {
  return request({
    url: product.productDetail,
    method: 'post',
    data
  })
}

// get brand list
export function getBrandList(data) {
  return request({
    url: product.brandList,
    method: 'post',
    data
  })
}

// get category list
export function getCategoryList(data) {
  return request({
    url: product.categoryList,
    method: 'post',
    data
  })
}

// click advanced search
export function advancedSearch(data) {
  return request({
    url: product.productSearch,
    method: 'post',
    data
  })
}

// brand delete
export function deleteBrand(data) {
  return request({
    url: product.brandInactive,
    method: 'post',
    data
  })
}

// brand edit
export function editBrand(data) {
  return request({
    url: product.brandEdit,
    method: 'post',
    data
  })
}

// brand add
export function addBrand(data) {
  return request({
    url: product.brandInsert,
    method: 'post',
    data
  })
}

// category delete
export function deleteCategory(data) {
  return request({
    url: product.categoryInactive,
    method: 'post',
    data
  })
}

// category edit
export function editCategory(data) {
  return request({
    url: product.categoryEdit,
    method: 'post',
    data
  })
}

// category add
export function addCategory(data) {
  return request({
    url: product.categoryInsert,
    method: 'post',
    data
  })
}

// product add
export function addProduct(data) {
  return request({
    url: product.productInsert,
    method: 'post',
    data
  })
}

// product export
export function productExport(data) {
  return request({
    url: product.productExport,
    method: 'post',
    data
  })
}

// product edit
export function editProduct(data) {
  return request({
    url: product.productEdit,
    method: 'post',
    data
  })
}

// product check code
export function productCheckCode(data) {
  return request({
    url: product.productCheckCode,
    method: 'post',
    data
  })
}
