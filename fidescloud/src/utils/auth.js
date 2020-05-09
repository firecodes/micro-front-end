// import Cookies from 'js-cookie'

const TokenKey = 'access-token'
const ExpiresIn = 'expire_date'
const RedeemDetail = 'redeem_detail'
const RedeemComponentId = 'redeem_component_id'
const LifecycleConfiguration = 'lifecycle_configuration'
const LifecycleInfo = 'lifecycle_info'
const I18nData = 'i18n_data'
const GlobalData = 'global_data'
const BusinessData = 'business_data'
const RoleData = 'role'
const App = 'app'
const Route = 'route'
const AgreePrivacy = 'agree_privacy'
const RoleUserInfo = 'role_user_info'

export function getI18nApp() {
  return sessionStorage.getItem(App)
}

export function setI18nApp(data) {
  return sessionStorage.setItem(App, data)
}

export function getRoute(data) {
  return sessionStorage.getItem(Route)
}

export function setRoute(data) {
  return sessionStorage.setItem(Route, data)
}

export function removeI18nApp() {
  return sessionStorage.removeItem(App)
}

export function getI18nGlobalData() {
  return sessionStorage.getItem(GlobalData)
}

export function setI18nGlobalData(data) {
  return sessionStorage.setItem(GlobalData, data)
}

export function removeI18nGlobalData() {
  return sessionStorage.removeItem(GlobalData)
}

export function getI18nBusinessData() {
  return sessionStorage.getItem(BusinessData)
}

export function setI18nBusinessData(data) {
  return sessionStorage.setItem(BusinessData, data)
}

export function removeI18nBusinessData() {
  return sessionStorage.removeItem(BusinessData)
}

export function getI18nRoleData() {
  return sessionStorage.getItem(RoleData)
}

export function setI18nRoleData(data) {
  return sessionStorage.setItem(RoleData, data)
}

export function removeI18nRoleData() {
  return sessionStorage.removeItem(RoleData)
}

export function getI18nData() {
  return sessionStorage.getItem(I18nData)
}

export function setI18nData(data) {
  return sessionStorage.setItem(I18nData, data)
}

export function removeI18nData() {
  return sessionStorage.removeItem(I18nData)
}

export function getLifecycleInfo() {
  return sessionStorage.getItem(LifecycleInfo)
}

export function setLifecycleInfo(data) {
  return sessionStorage.setItem(LifecycleInfo, data)
}

export function removeLifecycleInfo() {
  return sessionStorage.removeItem(LifecycleInfo)
}

export function getLifecycleConfiguration() {
  return sessionStorage.getItem(LifecycleConfiguration)
}

export function setLifecycleConfiguration(data) {
  return sessionStorage.setItem(LifecycleConfiguration, data)
}

export function removeLifecycleConfiguration() {
  return sessionStorage.removeItem(LifecycleConfiguration)
}

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function getExpireIn() {
  return sessionStorage.getItem(ExpiresIn)
}

export function setExpireIn(date) {
  return sessionStorage.setItem(ExpiresIn, date)
}

export function removeExpireIn() {
  return sessionStorage.removeItem(ExpiresIn)
}

export function getRedeemDetail() {
  return sessionStorage.getItem(RedeemDetail)
}

export function setRedeemDetail(detail) {
  return sessionStorage.setItem(RedeemDetail, detail)
}

export function getRedeemComponentId() {
  return sessionStorage.getItem(RedeemComponentId)
}

export function setRedeemComponentId(id) {
  return sessionStorage.setItem(RedeemComponentId, id)
}

export function setAgreePrivacy(data) {
  return sessionStorage.setItem(AgreePrivacy, data)
}

export function getAgreePrivacy() {
  return sessionStorage.getItem(AgreePrivacy)
}

export function removeAgreePrivacy() {
  return sessionStorage.removeItem(AgreePrivacy)
}

export function setRoleUserInfo(data) {
  return sessionStorage.setItem(RoleUserInfo, data)
}

export function getRoleUserInfo() {
  return sessionStorage.getItem(RoleUserInfo)
}

export function removeRoleUserInfo() {
  return sessionStorage.removeItem(RoleUserInfo)
}
