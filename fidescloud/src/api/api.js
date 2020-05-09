import { getUrlHost } from '../utils'

var host = getUrlHost()

export const RETURNCODE = '2000'

export const MEMEBERCODEDUPLICATED = '1101'

export const pageLimit = 10

export const projectName = 'Fides'

export const view404 = '/view/404'

export const PUBLICPATH = '/generic/member'

export const dictionaryTypeCode = {
  country: 'COUNTRY ',
  province: 'PROVINCE',
  city: 'CITY',
  district: 'DISTRICT'
}
export const login = host + '/security/oauth/token'

export const getUserInfo = host + '/user/getUser'

// export const uploadImgUrl = process.env.BASE_URL + '/oss/image/master/files/upload'
export const uploadImgUrl = host + '/oss/image/master/files/upload'
export const uploadFileUrl = host + '/oss/file/master/file/upload'
export const uploadTmpImgUrl = host + '/oss/file/tmp/upload'

export const oss = {
  str2html: host + '/oss/file/str2html',
  html2Str: host + '/oss/file/html2Str'
}
export const configuration = {
  // configuration: process.env.BASE_URL + '/cct/config/get'
  configuration: host + '/cct/config/get',
  importQuery: host + '/batch/patterns/query',
  patternStatus: host + '/batch/pattern/status',
  patternEdit: host + '/batch/pattern/edit',
  fieldEdit: host + '/batch/field/edit',
  fieldAdd: host + '/batch/field/add',
  fieldDelete: host + '/batch/field/delete',
  remoteEdit: host + '/batch/pattern/remote/edit',
  scheduleEdit: host + '/batch/pattern/schedule/edit',
  fileQuery: host + '/batch/file/query',
  executionQuery: host + '/batch/file/execution/query',
  queryAll: host + '/batch/patterns/query/all',
  saveCondition: '/member/condition/save',
  getCondition: '/member/condition/get'
}

export const member = {
  checkMemberFieldUsing: '/member/checkMemberField',
  createMember: '/member/createMember',
  checkMemberCode: '/member/checkMemberCode',
  updateMember: '/member/updateMember',
  getMemberInfo: '/member/getMemberInfo',
  queryMemberListBySearch: '/member/queryMemberBySearch',
  getMemberSegmentationList: '/member/getMemberSegmentationList',
  getMemberTierList: '/member/getMemberTierList',
  getMemberAccountType: '/member/getMemberAccountType',
  getMemberPoint: '/member/getMemberPoint',
  queryMemberPointHistoryByAccount: '/member/queryMemberPointHistory',
  getMemberTransactionList: '/member/getMemberTransactionList',
  getMemberTransactionDetailList: '/member/getMemberTransactionDetailList',
  getMemberAvailableCampaign: '/member/getMemberAvailableCampaign',
  queryMemberCouponListBySearch: '/member/queryMemberCouponBySearch',
  queryMemberCampaignListBySearch: '/member/queryMemberCampaignListBySearch',
  getMemberSNSList: '/member/getMemberSNSList',
  quickQueryMemberBySearch: '/member/quickQueryMemberBySearch',
  getMemberTransactionDetail: '/member/getMemberTransactionDetail',
  queryMemberGiftListBySearch: '/member/queryMemberGiftListBySearch',
  updateMemberTier: '/member/updateMemberTier',
  adjustMemberPointWithHistory: '/member/adjustMemberPointWithHistory',
  export: '/member/export',
  getMemberDynamicInfo: '/member/getMemberDynamicInfo',
  saveOrUpdateMemberDynamicInfo: '/member/saveOrUpdateMemberDynamicInfo',
  getMemberDynamicFields: '/member/getMemberDynamicFields',
  queryMemberGroupList: host + '/generic/member/memberGroup/queryMemberGroupList',
  queryAllTags: host + '/generic/member//member/tag/all',
  queryMemberNumAndDetailByTag: host + '/generic/member/member/tag/queryMemberNumAndDetailByTag',
  quickQueryMemberNumByGroup: host + '/generic/member/memberGroup/quickQueryMemberNumByGroup'
}

export const masterdata = {
  getDictionaryListByType: '/masterdata/getDictionaryListByType',
  getChildDictionaryList: '/masterdata/getChildDictionaryList',
  queryBrandList: '/masterdata/queryBrandList',
  queryChannelList: '/masterdata/queryChannelList',
  queryStoreList: '/masterdata/queryStoreList',
  queryBatchStoreList: '/masterdata/queryStoreListMoreInfo',
  queryProductCategoryList: '/masterdata/queryProductCategoryList',
  queryEmployeeList: '/masterdata/queryEmployeeList',
  queryProductList: '/masterdata/queryProductList',
  uploadImage: '/oss/image/tmp/upload',
  storeDistinctCity: '/masterdata/storeDistinctCity'
}

export const kpi = {
  getMemberKPI: '/kpi/getMemberKPI',
  getMemberChannelKPI: '/kpi/getMemberChannelKPI',
  getMemberMonthlyKPI: '/kpi/getMemberKPIMonthly',
  getTenantKPI: '/kpi/getTenantKPI',
  getTenantKPIYearly: '/kpi/getTenantKPIYearly',
  getTenantKPIByTier: '/kpi/getTenantKPIByTier',
  getTenantKPIMonthly: '/kpi/getTenantKPIMonthly',
  getTenantCampaignKPIYearly: '/kpi/getTenantCampaignKPIYearly',
  listTenantKPIMonthly: '/kpi/listTenantKPIMonthly'
}

export const loyalty = {
  addPointRule: '/loyalty/addPointRule',
  updatePointRule: '/loyalty/updatePointRule',
  addOrUpdatePointRule: '/loyalty/addOrUpdatePointRule',
  queryPointRule: '/loyalty/queryPointRule',
  queryPointTypeList: '/loyalty/queryPointTypeList',
  addPointType: '/loyalty/addPointType',
  updatePointType: '/loyalty/updatePointType',
  addOrUpdatePointType: '/loyalty/addOrUpdatePointType',
  checkPointTypeCode: '/loyalty/checkPointTypeCode',
  addOrUpdateAccountType: '/loyalty/addOrUpdateAccountType',
  checkAccountTypeCode: '/loyalty/checkAccountTypeCode',
  queryAccountTypeList: '/loyalty/queryAccountTypeList',
  queryCouponListBy: '/loyalty/queryCouponListBySearch',
  addOrUpdateCoupon: '/loyalty/addOrUpdateCoupon',
  saveCoupon: '/coupon/saveCoupon',
  updateCoupon: '/coupon/updateCoupon',
  checkCouponCode: '/loyalty/checkCouponCode',
  queryCouponTypeList: '/loyalty/queryCouponTypeList',
  queryMemberTierList: '/loyalty/queryMemberTierList',
  addOrUpdateMemberTier: '/loyalty/addOrUpdateMemberTier',
  queryPointRuleSpecByStore: '/loyalty/queryPointRuleSpecByStore',
  checkMemberCouponCode: '/loyalty/checkMemberCouponCode',
  addLoyaltyProcessCfg: '/loyalty/addLoyaltyProcessCfg',
  queryLoyaltyProcessCfg: '/loyalty/queryLoyaltyProcessCfg',
  updateLoyaltyProcessCfg: '/loyalty/updateLoyaltyProcessCfg',
  searchGift: '/redemption/searchGift',
  queryGiftCategory: '/redemption/queryGiftCategory',
  createGiftCategory: '/redemption/createGiftCategory',
  deleteGiftCategoryByCode: '/redemption/deleteGiftCategoryByCode',
  updateGiftCategoryByCode: '/redemption/updateGiftCategoryByCode',
  batchDeleteGift: '/redemption/batchDeleteGift',
  checkGiftCode: '/redemption/checkGiftCode',
  newGift: '/redemption/newGift',
  editGift: '/redemption/editGift',
  batchDeleteCoupon: '/loyalty/batchDeleteCoupon',
  getCouponInfoByCode: '/loyalty/getCouponInfoByCode',
  getGiftByCode: '/redemption/getGiftByCode',
  isEnableCouponTools: '/loyalty/isEnableCouponTools',
  obtainAddCouponPage: '/loyalty/obtainAddCouponPage',
  obtainEditCouponPage: '/loyalty/obtainEditCouponPage'
}

export const campaign = {
  cancelLifecycleCampaign: '/campaign/cancelLifecycleCampaign',
  addOrUpdateCampaignInfo: '/campaign/addOrUpdateCampaignInfo',
  addOrUpdateCampaignTarget: '/campaign/addOrUpdateCampaignTarget',
  addOrUpdateCampaignReward: '/campaign/addOrUpdateCampaignReward',
  getCommunicationChannelTypeList: '/communicationChannelType/getCommunicationChannelTypeList',
  getReservedFieldListByCommunicationChannelType: '/communicationReservedField/getReservedFieldListByCommunicationChannelType',
  addOrUpdateCampaignCommunication: '/campaign/addOrUpdateCampaignCommunication',
  getTemplateListByCommunicationChannelType: '/communicationTemplate/getTemplateListByCommunicationChannelType',
  addOrUpdateCommunicationChannelTemplate: '/campaign/addOrUpdateCommunicationChannelTemplate',
  getCampaignWizardInfo: '/campaign/getCampaignWizardInfo',
  submitCampaign: '/campaign/createCampaign',
  queryCampaignListBySearch: '/campaign/queryCampaignListBySearch',
  addTemplate: '/communicationTemplate/addTemplate',
  updateTemplate: '/communicationTemplate/updateTemplate',
  addCommunicationChannel: '/communicationChannel/addCommunicationChannel',
  calcTarget: '/campaign/calcTarget',
  queryCalcTarget: '/campaign/queryCalcTarget',
  getPerformanceByCampaignCode: '/campaign/getPerformanceByCampaignCode',
  queryTriggerCampaignList: '/campaign/queryTriggerCampaignList',
  submitTriggerCampaignFeedback: '/campaign/submitTriggerCampaignFeedback',
  queryTriggerCampaignById: '/campaign/queryTriggerCampaginById',
  sendCommunication: '/communicationTemplate/sendCommunication',
  submitTriggerCampaign: '/campaign/submitTriggerCampaign',
  getCampaignWizardList: '/campaign/getCampaignWizardList',
  getTesterGroupList: '/communicationTemplate/getTesterGroupList',
  getCampaignTypeInfo: '/campaign/getCampaignTypeInfo',
  sendTesterGroupCommunication: '/communicationTemplate/sendTesterGroupCommunication',
  disableCampaign: '/campaign/disableCampaign',
  deleteTemplate: '/communicationTemplate/deleteTemplate',
  getCampaignBudgeInfo: '/campaign/getCampaignBudgeInfo'
}

export const report = {
  memberSalesRanking: host + '/openapi/dw/fc/report/memberSalesRanking',
  memberRecruitmentReport: host + '/openapi/dw/fc/report/getMemberRecruitment', // DW
  memberTransactionReport: host + '/openapi/dw/fc/report/getMemberTransaction', // DW
  memberPointReport: '/report/memberPointReport', // 暂时用不到
  memberCouponReport: host + '/openapi/dw/fc/report/getMemberCoupon', // DW
  memberRedemptionReport: host + '/openapi/dw/fc/report/getMemberRedemption', // DW
  pointReport: host + '/fides/bhg/v1/bhg/pointReport', // 只针对bhg
  transactionReport: host + '/fides/bhg/v1/bhg/transactionReport', // 只针对bhg
  getMemberRecruitment: host + '/openapi/dw/fc/report/getMemberRecruitment2', // DW
  getNewMembers: host + '/openapi/dw/fc/report/getNewMembers', // DW
  getMemberTier: host + '/openapi/dw/fc/report/getMemberTier', // DW
  associationReport: host + '/fides/customization/v1/brotzeit/associationReport', // 只针对brotzeit
  businessTransactionReport: host + '/openapi/dw/fc/report/businessTransactionReport',
  memberTypeTransactionReport: host + '/openapi/dw/fc/report/memberTypeTransactionReport',
  memberTierSalesTransReport: host + '/openapi/dw/fc/report/memberTierSalesTransReport',
  channelSales: host + '/openapi/dw/fc/report/channelSales',
  channelTransaction: host + '/openapi/dw/fc/report/channelTransaction',
  skuContribution: host + '/openapi/dw/fc/report/skuContribution',
  pointsLiabilityTier: host + '/openapi/dw/fc/report/pointsLiabilityTier',
  tierUpgrade: host + '/openapi/dw/fc/report/tierUpgrade',
  tierDowngrade: host + '/openapi/dw/fc/report/tierDowngrade',
  pointsIssuance: host + '/openapi/dw/fc/report/pointsIssuance'
}

export const catalogue = {
  queryRedeemCatalogRelGifts: '/redemption/queryRedemCatalogRelGifts',
  queryRedeemCatalogRelCoupons: '/redemption/queryRedemCatalogRelCoupons',
  editRedeemCatalogRelGift: '/redemption/editRedemCatalogRelGift',
  editRedeemCatalogRelCoupon: '/redemption/editRedemCatalogRelCoupon',
  addRedeemCatalogRelCoupon: '/redemption/addRedemCatalogRelCoupon',
  addRelRedeemCatalogGift: '/redemption/addRelRedemCatalogGift',
  disableRedemptionCoupon: '/redemption/disableRedemCatalogRelCoupon',
  disableRedemptionGift: '/redemption/disableRedemCatalogRelGift'
}

export const redemption = {
  checkGiftCode: '/redemption/checkGiftCode',
  newGift: '/redemption/newGift',
  editGift: '/redemption/editGift',
  searchGift: '/redemption/searchGift',
  newRedemptionEvent: '/redemption/newRedemptionEvent',
  editRedemptionEventBasicInfo: '/redemption/editRedemptionEventBasicInfo',
  addGiftForRedemptionEvent: '/redemption/addGiftForRedemptionEvent',
  editGiftForRedemptionEvent: '/redemption/editGiftForRedemptionEvent',
  removeGiftForRedemptionEvent: '/redemption/removeGiftForRedemptionEvent',
  addCouponForRedemptionEvent: '/redemption/addCouponForRedemptionEvent',
  editCouponForRedemptionEvent: '/redemption/editCouponForRedemptionEvent',
  removeCouponForRedemptionEvent: '/redemption/removeCouponForRedemptionEvent',
  getRedemptionEventDetail: '/redemption/getRedemptionEventDetail',
  searchRedemptionEvent: '/redemption/searchRedemptionEvent',
  queryRedemptionOrder: '/redemption/queryRedemptionOrder',
  queryValidRedemptionEvent: '/redemption/queryValidRedemptionEvent',
  exportRedemptionList: '/redemption/exportRedemptionOrder',
  cancelRedemptionOrder: '/redemption/cancelRedemptionOrder',
  memberRedeemOrderByTotalPointAndCouponCodes: '/redemption/memberRedeemOrderByTotalPointAndCouponCodes'
}

export const lifecycleStudio = {
  getLifeCycleCampaignWarzdList: '/campaign/getLifeCycleCampaignWarzdList',
  getLifeCycleCampaignWarzd: '/campaign/getLifeCycleCampaignWarzd',
  createLifecycleCampaign: '/campaign/createLifecycleCampaign',
  getLifeCycleTemplateListByType: '/communicationTemplate/getLifeCycleTemplateListByType',
  cancelLifecycleCampaign: '/campaign/cancelLifecycleCampaign'
}

export const dwFcKpiController = {
  getDwFcKpi: host + '/openapi/dw/fc/kpi/getTenantKpi',
  getMemberKpi: host + '/openapi/dw/fc/kpi/getDwFcMemberKpi',
  getCampaignKpi: host + '/openapi/dw/fc/kpi/getCampaginKpi',
  getFcHomepageMember: host + '/openapi/dw/fc/kpi/getFcHomepageMember',
  getFcHomepageSales: host + '/openapi/dw/fc/kpi/getFcHomepageSales',
  getFcHomepageCampaign: host + '/openapi/dw/fc/kpi/getFcHomepageCampaign'
}

export const common = {
  getTenantInfo: host + '/openapi/tenant/getTenant'
}

export const importApi = {
  getTenantInfo: host + '/openapi/tenant/getTenant'
}

export const importService = {
  listImportType: '/import/listImportType',
  importFile: '/import/importFile',
  queryImportStatus: '/import/queryImportStatus',
  queryImportDetail: '/import/queryImportDetail'
}
export const orderList = {
  allOrder: host + '/v1/mlilyback/allOrderUpload',
  exportallOrder: host + '/v1/mlilyback/exportUploadList',
  approveOrder: host + '/v1/mlilyback/approveOrderUpload',
  reima_allOrder: host + '/v1/reimaApp/back/allOrderUpload',
  reima_exportallOrder: host + '/v1/reimaApp/back/exportUploadList',
  reima_approveOrder: host + '/v1/reimaApp/back/approveOrderUpload',
  allReservation: host + '/v1/mlilyback/allReservation',
  updateReservation: host + '/v1/mlilyback/updateReservation',
  exportdateReservation: host + '/v1/mlilyback/exportReservationList',
  queryBlacklist: host + '/v1/mlilyback/queryBlacklist',
  insertBlack: host + '/v1/mlilyback/insertBlack',
  removeBlack: host + '/v1/mlilyback/removeBlack',
  queryBlackByMobile: host + '/v1/mlilyback/queryBlackByMobile'
}
export const store = {
  storeList: '/store/queryList'
}
export const employee = {
  countryPhonePrefix: host + '/cct/country/config/mobile_region_code',
  queryEmployeeByRoleLevel: '/employee/queryEmployeeByRoleLevel',
  queryEmployeeRole: '/employee/role/queryEmployeeRole',
  insertEmployeeRole: '/employee/role/insertEmployeeRole',
  setEmployeeRoleActive: '/employee/role/setEmployeeRoleActive',
  updateEmployeeRole: '/employee/role/updateEmployeeRole',
  insertEmployee: '/employee/insertEmployee',
  employeeDetail: '/employee/getDetail'
}

export const userApi = {
  list: host + '/cct/user/list', // 查询用户列表
  deleteUser: host + '/cct/user/delete', // 删除用户
  detail: host + '/cct/user/detail', // 获取用户信息
  edit: host + '/cct/user/edit', // 编辑用户信息
  insert: host + '/cct/user/insert', // 新增用户信息
  assign: host + '/cct/user/role/assign', // 分配规则到用户
  roleList: host + '/cct/user/role/list', // 查询用户规则列表
  status: host + '/cct/user/status' // 操作用户状态
}

export const user = {
  sendEmail: '/user/password/forgot/send',
  changeForgot: '/user/password/forgot/change',
  temporary_access_token: host + '/security/oauth/token'
}

export const roleApi = {
  deleteRole: host + '/cct/role/delete', // 删除权限规则
  detail: host + '/cct/role/detail', // 获取权限规则信息
  edit: host + '/cct/role/edit', // 修改权限规则
  insert: host + '/cct/role/insert', // 新增权限规则
  list: host + '/cct/role/list' // 查询权限规则列表
}

export const appApi = {
  pageQueryApp: host + '/cct/app/list' // 查询app列表
}

export const dictionary = {
  getDictionaryListByName: host + '/dictionary/getDictionaryListByName',
  getChildDictionaryList: host + '/dictionary/getChildDictionaryList'
}

export const cct = {
  getMobileRegionCode: host + '/cct/country/config/mobile_region_code'
}

export const memberTag = {
  queryAllTags: host + PUBLICPATH + '/member/tag/query',
  memberTagDetail: host + PUBLICPATH + '/member/tag/detail',
  deleteMemberTag: host + PUBLICPATH + '/member/tag/del',
  queryTagGroup: host + PUBLICPATH + '/member/tagGroup/query',
  queryCategory: host + PUBLICPATH + '/member/tag/queryCategoryAndGroup',
  addMemberTagGroup: host + PUBLICPATH + '/member/tagGroup/add',
  editMemberTagGroup: host + PUBLICPATH + '/member/tagGroup/edit',
  deleteMemberTagGroup: host + PUBLICPATH + '/member/tagGroup/del',
  addMemberTag: host + PUBLICPATH + '/member/tag/add',
  detailMemberTag: host + PUBLICPATH + '/member/tag/detail',
  editMemberTag: host + PUBLICPATH + '/member/tag/edit',
  batchQueryProductList: '/masterdata/batchQueryProductList',
  queryAllTag: host + PUBLICPATH + '/member/tag/all',
  queryChannelList: '/masterdata/queryChannelList',
  listMemberTier: host + PUBLICPATH + '/tier/listMemberTier',
  getDictionary: host + '/generic' + '/dictionary/getChildDictionaryList',
  getOptionType: host + PUBLICPATH + '/member/option/type/list',
  getDictionaryListByType: host + '/dictionary/getDictionaryListByType',
  getDictionaryById: host + '/dictionary/getDictionaryById'
}

export const memberGroup = {
  queryMemberGroupList: host + PUBLICPATH + '/memberGroup/queryMemberGroupList',
  addMemberGroup: host + PUBLICPATH + '/memberGroup/saveMemberGroup',
  calc: host + PUBLICPATH + '/memberGroup/audience/calc',
  deleteMemberGroup: host + PUBLICPATH + '/memberGroup/delMemberGroupById',
  updateMemberGroup: host + PUBLICPATH + '/memberGroup/updateMemberGroupById',
  getMemberGroupInfo: host + PUBLICPATH + '/memberGroup/getMemberGroupInfoById',
  addRecommendMemberGroup: host + PUBLICPATH + '/memberGroup/addRecommendMemberGroup'
}

export const agreePrivacy = {
  userCheck: host + '/smic/admin/condition/user/check',
  userConfirm: host + '/smic/admin/condition/user/confirm',
  versionConfirm: host + '/smic/admin/condition/version/confirm',
  userInsert: host + '/smic/admin/condition/version/insert'
}

export const product = {
  productList: '/product/list',
  productDetail: '/product/detail',
  productEdit: '/product/edit',
  productInactive: '/product/inactive',
  productInsert: '/product/insert',
  productSearch: '/product/search',
  productCheckCode: '/product/checkCode',
  productExport: '/product/export',
  brandEdit: '/product/brand/edit',
  brandInactive: '/product/brand/inactive',
  brandInsert: '/product/brand/insert',
  brandList: '/product/brand/list',
  categoryEdit: '/product/category/edit',
  categoryInactive: '/product/category/inactive',
  categoryInsert: '/product/category/insert',
  categoryList: '/product/category/list'
}

export const transaction = {
  transactionList: '/transaction/list',
  transactionDetail: '/transaction/detail',
  transactionSearch: '/transaction/search',
  transactionExport: '/transaction/export',
  transactionType: '/transaction/type/list'
}

// 活动测试组
export const test_group = {
  groupList: host + '/openapi/v1/communication/test/list', // 获取测试组列表
  groupAdd: host + '/openapi/v1/communication/test/add', // 添加测试组
  groupEdit: host + '/openapi/v1/communication/test/edit', // 编辑测试组
  groupDetail: host + '/openapi/v1/communication/test/detail', // 获取测试组详情
  groupDelete: host + '/openapi/v1/communication/test/delete', // 删除测试组
  campaignTestHistoryList: host + '/openapi/v1/communication/test/history/list', // 获取活动测试组历史列表
  campaignTestHistoryDetail: host + '/openapi/v1/communication/test/history/detail', // 获取册数组历史记录详情
  campaignTestHistorySend: host + '/openapi/v1/communication/test/history/send' // 发送测试组
}
