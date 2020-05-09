import Mock from 'mockjs'
import loginAPI from './login'
import configurationAPI from './configuration'
// import memberAPI from './member'
// import memberPointAPI from './memberPoint'
// import masterAPI from './master'
// import kpiAPI from './kpi'
// import loyaltyAPI from './loyalty'
// import tierAPI from './tier'
// import campaignAPI from './campaign'
// import homepageAPI from './homepage'
// Mock.setup({
//   timeout: '350-600'
// })

// configuration 相关http://172.31.212.64:8053/test/json
Mock.mock(/http:\/\/172.31.212.64:8053\/test\/json/, 'post', configurationAPI.getConfiguration)
// Login相关
// Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// Member 相关
// Mock.mock(/\/member\/createMember/, 'post', memberAPI.createMember)
// Mock.mock(/\/member\/checkMemberCode/, 'post', memberAPI.checkMemberCode)
// Mock.mock(/\/member\/updateMember/, 'post', memberAPI.updateMember)
// Mock.mock(/\/member\/getMemberInfo/, 'post', memberAPI.getMemberInfo)
// Mock.mock(/\/member\/queryMemberBySearch/, 'post', configurationAPI.getConfiguration)
// Mock.mock(/\/member\/getMemberTransactionList/, 'post', memberAPI.getMemberTransactionList)
// Mock.mock(/\/member\/getMemberTransactionDetailList/, 'post', memberAPI.getMemberTransactionDetailList)
// Mock.mock(/\/member\/getMemberTierList/, 'post', memberAPI.getMemberTierList)
// Mock.mock(/\/member\/getMemberSegmentationList/, 'post', memberAPI.getMemberSegmentationList)
// Mock.mock(/\/member\/getMemberAvailableCampaign/, 'post', memberAPI.getMemberAvailableCampaign)
// Mock.mock(/\/member\/getMemberAccountType/, 'post', memberPointAPI.getMemberAccountType)
// Mock.mock(/\/member\/getMemberPointByAccount/, 'post', memberPointAPI.getMemberPointByAccount)
// Mock.mock(/\/member\/queryMemberPointHistory/, 'post', memberPointAPI.queryMemberPointHistory)
// Mock.mock(/\/member\/queryMemberCouponListBySearch/, 'post', memberPointAPI.queryMemberCouponListBySearch)
// Mock.mock(/\/member\/queryMemberCampaignListBySearch/, 'post', memberPointAPI.queryMemberCampaignListBySearch)
// Mock.mock(/\/member\/getMemberSNSList/, 'post', memberPointAPI.getMemberSNSList)

// Master Data 相关
// Mock.mock(/\/masterdata\/getDictionaryListByType/, 'post', masterAPI.getDictionaryListByType)
// Mock.mock(/\/masterdata\/getChildDictionaryList/, 'post', masterAPI.getChildDictionaryList)
// Mock.mock(/\/masterdata\/queryBrandList/, 'post', masterAPI.queryBrandList)
// Mock.mock(/\/masterdata\/queryChannelList/, 'post', masterAPI.queryChannelList)
// Mock.mock(/\/masterdata\/queryStoreList/, 'post', masterAPI.queryStoreList)
// Mock.mock(/\/masterdata\/queryEmployeeList/, 'post', masterAPI.queryEmployeeList)

// // dashboard&kpi 相关
// Mock.mock(/\/kpi\/getMemberKPI/, 'post', kpiAPI.getMemberKPI)
// Mock.mock(/\/kpi\/getTenantKPIYearly/, 'post', homepageAPI.getTenantKPIYearly)
// Mock.mock(/\/kpi\/getTenantKPIByTier/, 'post', homepageAPI.getTenantKPIByTier)
// Mock.mock(/\/kpi\/getTenantKPIMonthly/, 'post', homepageAPI.getTenantKPIMonthly)
// Mock.mock(/\/kpi\/getTenantCampaignKPIYearly/, 'post', homepageAPI.getTenantCampaignKPIYearly)
// Mock.mock(/\/kpi\/getTenantKPI/, 'post', kpiAPI.getTenantKPI)
// Mock.mock(/\/kpi\/getMemberChannelKPI/, 'post', kpiAPI.getMemberChannelKPI)
// Mock.mock(/\/kpi\/getMemberMonthlyKPI/, 'post', kpiAPI.getMemberMonthlyKPI)

// loyalty 相关
// Mock.mock(/\/loyalty\/queryPointRule/, 'post', loyaltyAPI.queryPointRule)
// Mock.mock(/\/loyalty\/addOrUpdatePointRule/, 'post', loyaltyAPI.addOrUpdatePointRule)
// Mock.mock(/\/loyalty\/queryPointTypeList/, 'post', loyaltyAPI.queryPointTypeList)
// Mock.mock(/\/loyalty\/addOrUpdatePointType/, 'post', loyaltyAPI.addOrUpdatePointType)
// Mock.mock(/\/loyalty\/checkPointTypeCode/, 'post', loyaltyAPI.checkPointTypeCode)
// Mock.mock(/\/loyalty\/addOrUpdateAccountType/, 'post', loyaltyAPI.addOrUpdateAccountType)
// Mock.mock(/\/loyalty\/checkAccountTypeCode/, 'post', loyaltyAPI.checkAccountTypeCode)
// Mock.mock(/\/loyalty\/queryAccountTypeList/, 'post', loyaltyAPI.queryAccountTypeList)
// Mock.mock(/\/loyalty\/queryCouponListBy/, 'post', loyaltyAPI.queryCouponListBy)
// Mock.mock(/\/loyalty\/addOrUpdateCoupon/, 'post', loyaltyAPI.addOrUpdateCoupon)
// Mock.mock(/\/loyalty\/checkCouponCode/, 'post', loyaltyAPI.checkCouponCode)
// Mock.mock(/\/loyalty\/queryCouponTypeList/, 'post', loyaltyAPI.queryCouponTypeList)
// Mock.mock(/\/loyalty\/queryMemberTierList/, 'post', tierAPI.queryMemberTierList)
// Mock.mock(/\/loyalty\/addOrUpdateMemberTier/, 'post', tierAPI.addOrUpdateMemberTier)

// campaign 相关
// Mock.mock(/\/campaign\/addOrUpdateCampaignInfo/, 'post', campaignAPI.addOrUpdateCampaignInfo)
// Mock.mock(/\/campaign\/addOrUpdateCampaignTarget/, 'post', campaignAPI.addOrUpdateCampaignTarget)
// Mock.mock(/\/campaign\/addOrUpdateCampaignReward/, 'post', campaignAPI.addOrUpdateCampaignReward)
// Mock.mock(/\/campaign\/addOrUpdateCampaignCommunication/, 'post', campaignAPI.addOrUpdateCampaignCommunication)
// Mock.mock(/\/campaign\/queryCommunicationTemplateByChannel/, 'post', campaignAPI.queryCommunicationTemplateByChannel)
// Mock.mock(/\/campaign\/addOrUpdateCommunicationChannelTemplate/, 'post', campaignAPI.addOrUpdateCommunicationChannelTemplate)
// Mock.mock(/\/campaign\/getCampaignWizardInfo/, 'post', campaignAPI.getCampaignWizardInfo)
// Mock.mock(/\/campaign\/submitCampaign/, 'post', campaignAPI.submitCampaign)
// Mock.mock(/\/campaign\/queryCampaignListBySearch/, 'post', campaignAPI.queryCampaignListBySearch)

