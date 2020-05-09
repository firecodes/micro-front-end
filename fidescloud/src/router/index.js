import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
const Layout = (resolve) => {
  import('../views/layout/Layout').then((module) => {
    resolve(module)
  })
}

const Dashboard = (resolve) => {
  import('../views/dashboard/index').then((module) => {
    resolve(module)
  })
}

const MemberView = (resolve) => {
  import('../views/member/member-view/index').then((module) => {
    resolve(module)
  })
}

const UploadHistory = (resolve) => {
  import('../views/configuration/upload-history/index1').then((module) => {
    resolve(module)
  })
}

const ConfigurationTransactionListIndex = (resolve) => {
  import('../views/configuration/transaction/index').then((module) => {
    resolve(module)
  })
}

const ConfigurationTransactionDetail = (resolve) => {
  import('../views/configuration/transaction/details').then((module) => {
    resolve(module)
  })
}

const UploadHistoryDetail = (resolve) => {
  import('../views/configuration/upload-history/components/detail').then((module) => {
    resolve(module)
  })
}
const ConfigurationStoreList = (resolve) => {
  import('../views/configuration/storelist/storelist').then((module) => {
    resolve(module)
  })
}
const TermsAndConditions = (resolve) => {
  import('../views/configuration/terms-conditions/index').then((module) => {
    resolve(module)
  })
}
// const LegalPageIndex = (resolve) => {
//   import('../views/legal/index').then((module) => {
//     resolve(module)
//   })
// }
const ConfigurationStoreListIndex = (resolve) => {
  import('../views/configuration/storelist/index').then((module) => {
    resolve(module)
  })
}

const ConfigurationEmployeeIndex = (resolve) => {
  import('../views/configuration/employee/employeelist').then((module) => {
    resolve(module)
  })
}

const ConfigurationEmployeeListIndex = (resolve) => {
  import('../views/configuration/employee/index').then((module) => {
    resolve(module)
  })
}

const ConfigurationEmployeeListAdd = (resolve) => {
  import('../views/configuration/employee/components/add').then((module) => {
    resolve(module)
  })
}

const ConfigurationEmployeeListImport = (resolve) => {
  import('../views/configuration/employee/components/import').then((module) => {
    resolve(module)
  })
}

const ConfigurationEmployeeListDetails = (resolve) => {
  import('../views/configuration/employee/components/details').then((module) => {
    resolve(module)
  })
}

const ConfigurationStoreListDetail = (resolve) => {
  import('../views/configuration/storelist/components/details').then((module) => {
    resolve(module)
  })
}

const ConfigurationStoreListEdit = (resolve) => {
  import('../views/configuration/storelist/components/edit').then((module) => {
    resolve(module)
  })
}

const ConfigurationProductListIndex = (resolve) => {
  import('../views/configuration/product/index').then((module) => {
    resolve(module)
  })
}

const ConfigurationProductListAdd = (resolve) => {
  import('../views/configuration/product/addproduct').then((module) => {
    resolve(module)
  })
}

const ConfigurationProductDetail = (resolve) => {
  import('../views/configuration/product/details').then((module) => {
    resolve(module)
  })
}

const Recuritment = (resolve) => {
  import('../views/member/recuritment/index').then((module) => {
    resolve(module)
  })
}

const MemberDashboard = (resolve) => {
  import('../views/member/dashboard/list_index').then((module) => {
    resolve(module)
  })
}

const MemberLifecycle = (resolve) => {
  import('../views/member/lifecycle/index').then((module) => {
    resolve(module)
  })
}

const MemberLifecycleAnalysis = (resolve) => {
  import('../views/member/lifecycle/analysis/index').then((module) => {
    resolve(module)
  })
}

const EditMemberLifecycleAnalysis = (resolve) => {
  import('../views/member/lifecycle/edit/index').then((module) => {
    resolve(module)
  })
}

const MemberTag = (resolve) => {
  import('../views/member/member-tag/index').then((module) => {
    resolve(module)
  })
}

const MemberTagAdd = (resolve) => {
  import('../views/member/member-tag/edit/index').then((module) => {
    resolve(module)
  })
}

const MemberTagEdit = (resolve) => {
  import('../views/member/member-tag/edit/index').then((module) => {
    resolve(module)
  })
}

const MemberTagDetails = (resolve) => {
  import('../views/member/member-tag/details/index').then((module) => {
    resolve(module)
  })
}

const MemberGroup = (resolve) => {
  import('../views/member/member-group/index').then((module) => {
    resolve(module)
  })
}

const MemberGroupAdd = (resolve) => {
  import('../views/member/member-group/add/index').then((module) => {
    resolve(module)
  })
}

const MemberGroupDetails = (resolve) => {
  import('../views/member/member-group/details/index').then((module) => {
    resolve(module)
  })
}

const CampaignEditOrView = (resolve) => {
  import('../views/campaign/campaign-setting/history-index').then((module) => {
    resolve(module)
  })
}

const CampaignRedemption = (resolve) => {
  import('../views/campaign/redemption-campaign/index').then((module) => {
    resolve(module)
  })
}

const Memberdetails = (resolve) => {
  import('../views/member/member-view/member-details/index').then((module) => {
    resolve(module)
  })
}

const Point = (resolve) => {
  import('../views/loyalty/point/index').then((module) => {
    resolve(module)
  })
}

const Tier = (resolve) => {
  import('../views/loyalty/tier/index').then((module) => {
    resolve(module)
  })
}

const LoyaltyEvent = (resolve) => {
  import('../views/loyalty/event/index').then((module) => {
    resolve(module)
  })
}

const LoyaltyCatalogue = (resolve) => {
  import('../views/loyalty/catalogue/list-index').then((module) => {
    resolve(module)
  })
}

const AddEvent = (resolve) => {
  import('../views/loyalty/catalogue/add-event/index').then((module) => {
    resolve(module)
  })
}

const LoyaltyRedemption = (resolve) => {
  import('../views/loyalty/redemption/index').then((module) => {
    resolve(module)
  })
}

// 去除campaign history
const CampaignList = (resolve) => {
  import('../views/campaign/campaign-list/index').then((module) => {
    resolve(module)
  })
}

const ImproveInfo = (resolve) => {
  import('../views/member/recuritment/improve-info/index').then((module) => {
    resolve(module)
  })
}

const PersonInfo = (resolve) => {
  import('../views/member/member-view/member-details/person-info/index').then((module) => {
    resolve(module)
  })
}
const ConfigurationImportEdit = (resolve) => {
  import('../views/configuration/import/components/edit').then((module) => {
    resolve(module)
  })
}

const MemberDetailImport = (resolve) => {
  import('../views/member/member-view/member-details/import/index').then((module) => {
    resolve(module)
  })
}

const ReportingAdvanced = (resolve) => {
  import('../views/reporting/advanced/index').then((module) => {
    resolve(module)
  })
}

const ReportingOneClick = (resolve) => {
  import('../views/reporting/one-click/index').then((module) => {
    resolve(module)
  })
}

const ConfigurationImport = (resolve) => {
  import('../views/configuration/import/index1').then((module) => {
    resolve(module)
  })
}

const CampaignAdvancedQuery = (resolve) => {
  import('../views/campaign/campaign-list/advanced-query/index').then((module) => {
    resolve(module)
  })
}

const CampaignEffect = (resolve) => {
  import('../views/campaign/campaign-list/campaign-effect/index').then((module) => {
    resolve(module)
  })
}

const AddGift = (resolve) => {
  import('../views/loyalty/redemption/gift-library/add-gift/index').then((module) => {
    resolve(module)
  })
}

const EditSementation = (resolve) => {
  import('../views/member/member-view/member-details/person-info/edit-segmentation/index').then((module) => {
    resolve(module)
  })
}

const MemberDetailsloyaltyInfo = (resolve) => {
  import('../views/member/member-view/member-details/loyalty-info/index').then((module) => {
    resolve(module)
  })
}

const MemberDetailsCampaignInfo = (resolve) => {
  import('../views/member/member-view/member-details/campaign/index').then((module) => {
    resolve(module)
  })
}

const MemberDetailsSocialMediaInfo = (resolve) => {
  import('../views/member/member-view/member-details/social-media/index').then((module) => {
    resolve(module)
  })
}

const CampaignDetail = (resolve) => {
  import('../views/member/member-view/member-details/campaign/campaign-detail/index').then((module) => {
    resolve(module)
  })
}

const MemberRedeemDetail = (resolve) => {
  import('../views/loyalty/redemption/redemption-list/member_redeem_detail/index').then((module) => {
    resolve(module)
  })
}

const LoyaltyGiftTile = (resolve) => {
  import('../views/loyalty/gift/tile-index').then((module) => {
    resolve(module)
  })
}

const LoyaltyGiftOperation = (resolve) => {
  import('../views/loyalty/gift/edit-add-detail').then((module) => {
    resolve(module)
  })
}

const LoyaltyCouponOperation = (resolve) => {
  import('../views/loyalty/coupon/edit-add-detail').then((module) => {
    resolve(module)
  })
}

const TriggerCampaignDetail = (resolve) => {
  import('../views/campaign/trigger-campaigns/campaign-detail').then((module) => {
    resolve(module)
  })
}

const PublishCampaign = (resolve) => {
  import('../views/campaign/lifecycle-studio/publish/index').then((module) => {
    resolve(module)
  })
}

const TriggerCampaignIndex = (resolve) => {
  import('../views/campaign/trigger-campaigns/index').then((module) => {
    resolve(module)
  })
}

const TriggerCampaignEdit = (resolve) => {
  import('../views/campaign/trigger-campaigns/edit/index').then((module) => {
    resolve(module)
  })
}

const MemberQuery = (resolve) => {
  import('../views/member/member-query/index').then((module) => {
    resolve(module)
  })
}

const Null = (resolve) => {
  import('../views/null/index').then((module) => {
    resolve(module)
  })
}

const LifecycleCampaign = (resolve) => {
  import('../views/campaign/lifecycle-campaign/index').then((module) => {
    resolve(module)
  })
}

const LifecycleCampaignDetail = (resolve) => {
  import('../views/campaign/lifecycle-campaign/detail').then((module) => {
    resolve(module)
  })
}

const LifecycleCampaignEdit = (resolve) => {
  import('../views/campaign/lifecycle-campaign/edit').then((module) => {
    resolve(module)
  })
}

// const SpotCampaign = (resolve) => {
//   import('../views/campaign/spot-campaign').then((module) => {
//     resolve(module)
//   })
// }

// const SpotCampaignDetail = (resolve) => {
//   import('../views/campaign/spot-campaign/detail').then((module) => {
//     resolve(module)
//   })
// }

const VoucherRedeem = (resolve) => {
  import('../views/member/voucher-redemption/index').then((module) => {
    resolve(module)
  })
}

const VoucherRedemptionPoint = (resolve) => {
  import('../views/member/voucher-redemption/point').then((module) => {
    resolve(module)
  })
}

const VoucherRedemptionRedeem = (resolve) => {
  import('../views/member/voucher-redemption/redeem').then((module) => {
    resolve(module)
  })
}

// const SpotCampaignEdit = (resolve) => {
//   import('../views/campaign/spot-campaign/edit').then((module) => {
//     resolve(module)
//   })
// }

const Appointlist = (resolve) => {
  import('../views/appointlist/index').then((module) => {
    resolve(module)
  })
}

const Orderview = (resolve) => {
  import('../views/orderview/index').then((module) => {
    resolve(module)
  })
}

const Blacklist = (resolve) => {
  import('../views/otherlist/blacklist/index').then((module) => {
    resolve(module)
  })
}

const OrderviewReima = (resolve) => {
  import('../views/orderview-reima/index').then((module) => {
    resolve(module)
  })
}

const UserManagement = (resolve) => {
  import('../views/configuration-center/user-role/user-management/index').then((module) => {
    resolve(module)
  })
}

const RoleManagement = (resolve) => {
  import('../views/configuration-center/user-role/role-management/index').then((module) => {
    resolve(module)
  })
}

// var public_prefix = '/fcbo'
var public_prefix = ''
export const initRouterMap = [
  { path: public_prefix + '/login', component: () => import('@/views/login/index'), hidden: true, meta: { title: '' }},
  { path: public_prefix + '/login/forgot-password', component: () => import('@/views/login/forgot'), hidden: true, meta: { title: '' }},
  {
    path: public_prefix + '/legal',
    component: () => import('@/views/legal/index'),
    redirect: '/legal/terms',
    hidden: true,
    meta: { title: '' },
    children: [
      {
        path: 'terms',
        component: () => import('@/views/legal/terms/index'),
        name: 'termscondition',
        meta: {
          title: 'terms',
          name: 'International'
        }
      },
      {
        path: 'terms/CN',
        component: () => import('@/views/legal/terms/components/china'),
        name: 'termscncondition',
        meta: {
          title: 'terms',
          name: 'China'
        }
      },
      {
        path: 'terms/JP',
        component: () => import('@/views/legal/terms/components/japan'),
        name: 'termsjpcondition',
        meta: {
          title: 'terms',
          name: 'Japan'
        }
      },
      {
        path: 'terms/IN',
        component: () => import('@/views/legal/terms/index'),
        name: 'termsincondition',
        meta: {
          title: 'terms',
          name: 'India'
        }
      },
      {
        path: 'terms/SG',
        component: () => import('@/views/legal/terms/index'),
        name: 'termssgcondition',
        meta: {
          title: 'terms',
          name: 'Singapore'
        }
      },
      {
        path: 'terms/HK',
        component: () => import('@/views/legal/terms/components/international'),
        name: 'termssgcondition',
        meta: {
          title: 'terms',
          name: 'Hong Kong'
        }
      },
      {
        path: 'terms/TW',
        component: () => import('@/views/legal/terms/components/international'),
        name: 'termssgcondition',
        meta: {
          title: 'terms',
          name: 'Taiwan'
        }
      },
      {
        path: 'privacy',
        component: () => import('@/views/legal/privacy/index'),
        name: 'privacycondition',
        meta: {
          title: 'privacy',
          name: 'International'
        }
      },
      {
        path: 'privacy/HK',
        component: () => import('@/views/legal/privacy/components/international'),
        name: 'privacycondition',
        meta: {
          title: 'privacy',
          name: 'Hong Kong'
        }
      },
      {
        path: 'privacy/TW',
        component: () => import('@/views/legal/privacy/components/international'),
        name: 'privacycondition',
        meta: {
          title: 'privacy',
          name: 'Taiwan'
        }
      },
      {
        path: 'privacy/CN',
        component: () => import('@/views/legal/privacy/components/china'),
        name: 'privacycncondition',
        meta: {
          title: 'privacy',
          name: 'China'
        }
      },
      {
        path: 'privacy/JP',
        component: () => import('@/views/legal/privacy/components/japan'),
        name: 'privacyjpcondition',
        meta: {
          title: 'privacy',
          name: 'Japan'
        }
      },
      {
        path: 'privacy/IN',
        component: () => import('@/views/legal/privacy/index'),
        name: 'privacyincondition',
        meta: {
          title: 'privacy',
          name: 'India'
        }
      },
      {
        path: 'privacy/SG',
        component: () => import('@/views/legal/privacy/index'),
        name: 'privacysgcondition',
        meta: {
          title: 'privacy',
          name: 'Singapore'
        }
      }
    ]
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true, meta: { title: '' }},
  { path: '/null',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    children: [{
      path: 'index',
      component: Null,
      hidden: true,
      name: 'index'
    }]
  }
]

export const allRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: public_prefix + '/homepage',
    hidden: true,
    meta: { title: 'homepage', module: 'portal', icon: 'left_column_homepage' },
    children: [{
      path: 'homepage',
      component: Dashboard,
      name: 'homepage',
      meta: { title: 'homepage', module: 'portal', transaction_key: 'fc_left_nav_home', icon: 'left_column_homepage' }
    }]
  },
  {
    path: public_prefix + '/member',
    component: Layout,
    name: 'member',
    hidden: true,
    redirect: 'noredirect',
    meta: { title: 'member', transaction_key: 'fc_left_nav_member', icon: 'left_column_member' },
    children: [
      {
        path: 'voucher-redeem/point',
        name: 'voucher_redeem_point',
        hidden: true,
        component: VoucherRedemptionPoint,
        meta: { title: 'point', icon: 'table',
          parents: [
            { path: 'voucher-redeem', name: 'redemption' }
          ]
        }
      },
      {
        path: 'voucher-redeem/redeem',
        name: 'redeem',
        hidden: true,
        component: VoucherRedemptionRedeem,
        meta: { title: 'point', icon: 'table',
          parents: [
            { path: 'voucher-redeem', name: 'redemption' }
          ]
        }
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        hidden: true,
        component: MemberDashboard,
        meta: { title: 'dashboard' }
      },
      {
        path: 'member-query',
        name: 'member_query',
        hidden: true,
        component: MemberQuery,
        meta: { title: 'member_query', transaction_key: 'fc_left_nav_member_query' }
      },
      {
        path: 'member-view',
        name: 'member_view',
        hidden: true,
        component: MemberView,
        meta: { title: 'member_view', transaction_key: 'fc_left_nav_member_view', noCache: false }
      },
      {
        path: 'member-lifecycle',
        name: 'member_lifecycle',
        hidden: true,
        component: MemberLifecycle,
        meta: { title: 'member_lifecycle' }
      },
      {
        path: 'member-lifecycle/analysis',
        name: 'member_analysis',
        hidden: true,
        component: MemberLifecycleAnalysis,
        meta: { title: 'member_analysis',
          parents: [
            { path: 'member-lifecycle', name: 'member_lifecycle' }
          ]
        }
      },
      {
        path: 'member-lifecycle/edit',
        name: 'member_analysis',
        hidden: true,
        component: EditMemberLifecycleAnalysis,
        meta: { title: 'edit_member_analysis',
          parents: [
            { path: 'member-lifecycle', name: 'member_lifecycle' }
          ]
        }
      },
      {
        path: 'member-tag',
        name: 'member_tag',
        hidden: true,
        component: MemberTag,
        meta: { title: 'member_tag', transaction_key: 'fc_left_nav_member_tags', noCache: true }
      },
      {
        path: 'member-tag/add',
        name: 'member_analysis_add',
        hidden: true,
        component: MemberTagAdd,
        meta: { title: 'member_tag_add',
          parents: [
            { path: 'member-tag', name: 'member_tag' }
          ]
        }
      },
      {
        path: 'member-tag/details/:id',
        name: 'member_analysis_details',
        hidden: true,
        component: MemberTagDetails,
        meta: { title: 'member_tag_details',
          parents: [
            { path: 'member-tag', name: 'member_tag' }
          ]
        }
      },
      {
        path: 'member-tag/edit/:id',
        name: 'member_analysis_edit',
        hidden: true,
        component: MemberTagEdit,
        meta: { title: 'member_tag_edit',
          parents: [
            { path: 'member-tag', name: 'member_tag' }
          ]
        }
      },
      {
        path: 'member-group',
        name: 'member_group',
        hidden: true,
        component: MemberGroup,
        meta: { title: 'member_group', transaction_key: 'fc_left_nav_member_groups' }
      },
      {
        path: 'member-group/add',
        name: 'member_group_add',
        hidden: true,
        component: MemberGroupAdd,
        meta: { title: 'member_group_add',
          parents: [
            { path: 'member-group', name: 'member_group' }
          ]
        }
      },
      {
        path: 'member-group/edit/:id',
        name: 'member_group_edit',
        hidden: true,
        component: MemberGroupAdd,
        meta: { title: 'member_group_edit',
          parents: [
            { path: 'member-group', name: 'member_group' }
          ]
        }
      },
      {
        path: 'member-group/copy/:id',
        name: 'member_group_copy',
        hidden: true,
        component: MemberGroupAdd,
        meta: { title: 'member_group_copy',
          parents: [
            { path: 'member-group', name: 'member_group' }
          ]
        }
      },
      {
        path: 'member-group/details/:id',
        name: 'member_group_details',
        hidden: true,
        component: MemberGroupDetails,
        meta: { title: 'member_group_details',
          parents: [
            { path: 'member-group', name: 'member_group' }
          ]
        }
      },
      {
        path: 'improve-info/:member_code',
        name: 'improve_info',
        component: ImproveInfo,
        meta: { title: 'improve_info' },
        hidden: true
      },
      {
        path: 'recruitment',
        name: 'recruitment',
        hidden: true,
        component: Recuritment,
        meta: { title: 'recruitment', transaction_key: 'fc_left_nav_member_recruitment' }
      },
      {
        path: 'member-view/member-details/:id',
        name: 'member_view_details',
        component: Memberdetails,
        meta: { title: 'member_details', icon: 'table',
          parents: [
            { path: 'member-view', name: 'member_view' }
          ]
        },
        hidden: true
      },
      {
        path: 'member-query/member-details/:id',
        name: 'member_query_details',
        component: Memberdetails,
        meta: { title: 'member_details', icon: 'table',
          parents: [
            { path: 'member-query', name: 'member_query' }
          ]
        },
        hidden: true
      },
      {
        path: 'member-view/person-info',
        name: 'member_view_person_info',
        component: PersonInfo,
        meta: {
          title: 'person_info'
        },
        hidden: true
      },
      {
        path: 'member-query/person-info',
        name: 'member_query_person_info',
        component: PersonInfo,
        meta: {
          title: 'person_info'
        },
        hidden: true
      },
      {
        path: 'import',
        name: 'import',
        component: MemberDetailImport,
        meta: { title: 'import' },
        hidden: true
      },
      {
        path: 'edit-segmentation',
        name: 'edit_segmentation',
        component: EditSementation,
        meta: { title: 'edit_segmentation' },
        hidden: true
      },
      {
        path: 'loyalty-info',
        name: 'loyalty_info',
        component: MemberDetailsloyaltyInfo,
        meta: { title: 'loyalty_info' },
        hidden: true
      },
      {
        path: 'campaign-info',
        name: 'campaign_info',
        component: MemberDetailsCampaignInfo,
        meta: { title: 'campaign_info' },
        hidden: true
      },
      {
        path: 'campaign-detail',
        name: 'campaign_detail',
        component: CampaignDetail,
        meta: { title: 'campaign_detail' },
        hidden: true
      },
      {
        path: 'social-media-info',
        name: 'social_media_info',
        component: MemberDetailsSocialMediaInfo,
        meta: { title: 'social_media_info' },
        hidden: true
      },
      {
        path: 'voucher-redeem',
        component: VoucherRedeem,
        name: 'member_redeem_center',
        hidden: true,
        meta: { title: 'member_redeem_center', icon: 'member_2' }
      },
      {
        path: 'member-redemption',
        name: 'member_redemption',
        component: CampaignRedemption,
        hidden: true,
        meta: { title: 'member_redemption' }
      }
    ]
  },
  {
    path: public_prefix + '/loyalty',
    component: Layout,
    name: 'loyalty',
    hidden: true,
    redirect: 'noredirect',
    meta: { title: 'loyalty', transaction_key: 'fc_left_nav_loyalty', icon: 'left_column_loyalty' },
    children: [
      {
        path: 'point',
        name: 'point',
        hidden: true,
        component: Point,
        meta: { title: 'point', transaction_key: 'fc_left_nav_loyalty_point' }
      },
      {
        path: 'tier',
        name: 'tier',
        component: Tier,
        hidden: true,
        meta: { title: 'tier', transaction_key: 'fc_left_nav_loyalty_tier' }
      },
      {
        path: 'coupon', name: 'coupon', hidden: true, component: () => import('@/views/loyalty/coupon/list-index'), meta: { title: 'coupon', transaction_key: 'fc_left_nav_loyalty_coupon' }
      },
      {
        path: 'coupon/tile', name: 'coupon1', hidden: true, component: () => import('@/views/loyalty/coupon/tile-index'), meta: { title: 'coupon1' }
      },
      {
        path: 'coupon/add', name: 'coupon_add', hidden: true, component: LoyaltyCouponOperation, meta: { title: 'coupon_add', icon: 'table', parents: [{ path: 'coupon', name: 'coupon' }] }
      },
      {
        path: 'coupon/detail', name: 'coupon_detail', hidden: true, component: LoyaltyCouponOperation, meta: { title: 'coupon_detail', icon: 'table', parents: [{ path: 'coupon', name: 'coupon' }] }
      },
      {
        path: 'coupon/edit',
        name: 'coupon_edit',
        hidden: true,
        component: LoyaltyCouponOperation,
        meta: {
          title: 'coupon_edit', icon: 'table',
          parents: [
            { path: 'coupon', name: 'coupon' }
          ]
        }
      },
      {
        path: 'coupon/copy',
        name: 'coupon_copy',
        hidden: true,
        component: LoyaltyCouponOperation,
        meta: {
          title: 'coupon_copy', icon: 'table',
          parents: [
            { path: 'coupon', name: 'coupon' }
          ]
        }
      },
      {
        path: 'coupon/guide',
        name: 'coupon_guide',
        hidden: true,
        component: () => import('@/views/loyalty/coupon/operate-guide'),
        meta: {
          title: 'coupon_guide', icon: 'table',
          parents: [
            { path: 'coupon', name: 'coupon' }
          ]
        }
      },
      {
        path: 'gift',
        name: 'gift',
        hidden: true,
        component: () => import('@/views/loyalty/gift/list-index'),
        meta: { title: 'gift', transaction_key: 'fc_left_nav_loyalty_gift' }
      },
      {
        path: 'gift/tile',
        name: 'gift1',
        hidden: true,
        component: LoyaltyGiftTile,
        meta: { title: 'gift1' }
      },
      {
        path: 'gift/add',
        name: 'gift_add',
        hidden: true,
        component: LoyaltyGiftOperation,
        meta: {
          title: 'gift_add', icon: 'table',
          parents: [
            { path: 'gift', transaction_key: 'fc_left_nav_loyalty_gift', name: 'gift' }
          ]
        }
      },
      {
        path: 'gift/detail',
        name: 'gift_detail',
        hidden: true,
        component: LoyaltyGiftOperation,
        meta: {
          title: 'gift_detail', icon: 'table',
          parents: [
            { path: 'gift', transaction_key: 'fc_left_nav_loyalty_gift', name: 'gift' }
          ]
        }
      },
      {
        path: 'gift/edit',
        name: 'gift_edit',
        hidden: true,
        component: LoyaltyGiftOperation,
        meta: {
          title: 'gift_edit', icon: 'table',
          parents: [
            { path: 'gift', transaction_key: 'fc_left_nav_loyalty_gift', name: 'gift' }
          ]
        }
      },
      {
        path: 'gift/copy',
        name: 'gift_copy',
        hidden: true,
        component: LoyaltyGiftOperation,
        meta: {
          title: 'gift_copy', icon: 'table',
          parents: [
            { path: 'gift', transaction_key: 'fc_left_nav_loyalty_gift', name: 'gift' }
          ]
        }
      },
      {
        path: 'event',
        name: 'event',
        hidden: true,
        component: LoyaltyEvent,
        meta: { title: 'event' }
      },
      // 去除catalogue
      {
        path: 'catalogue',
        name: 'catalogue',
        hidden: true,
        component: LoyaltyCatalogue,
        meta: { title: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption' }
      },
      // 添加 redemption
      {
        path: 'redemption',
        name: 'redemption',
        hidden: true,
        component: LoyaltyRedemption,
        meta: { title: 'redemption', transaction_key: 'fc_left_nav_loyalty_redemption' }
      },
      {
        path: 'catalogue/add-gift',
        name: 'add_a_gift',
        hidden: true,
        component: () => import('@/views/loyalty/catalogue/gift/add-a-gift'),
        meta: {
          title: 'add_a_gift', icon: 'table',
          parents: [
            { path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }
          ]
        }
      },
      {
        path: 'catalogue/add-coupon', name: 'add_a_coupon', hidden: true, component: () => import('@/views/loyalty/catalogue/coupon/add-a-coupon'), meta: { title: 'add_a_coupon', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }
      },
      { path: 'catalogue/config-coupon', name: 'config_a_coupon', hidden: true, component: () => import('@/views/loyalty/catalogue/coupon/add-a-coupon'), meta: { title: 'config_a_coupon', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }
      },
      {
        path: 'catalogue/config-gift', name: 'config_a_gift', hidden: true, component: () => import('@/views/loyalty/catalogue/gift/add-a-gift'), meta: { title: 'config_a_gift', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }
      },
      {
        path: 'catalogue/redemption-details', name: 'redemption_details', hidden: true, component: () => import('@/views/loyalty/catalogue/redemption-details'), meta: { title: 'redemption_details', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }
      },
      {
        path: 'catalogue/overall-analysis', name: 'overall_analysis_gift', hidden: true, component: () => import('@/views/loyalty/catalogue/gift/overall-analysis'), meta: { title: 'overall_analysis', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }
      },
      {
        path: 'catalogue/redemption-analysis', name: 'redemption_analysis_gift', hidden: true, component: () => import('@/views/loyalty/catalogue/gift/redemption-analysis'), meta: { title: 'redemption_analysis', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }
      },
      {
        path: 'catalogue/overall-analysis-coupon', name: 'overall_analysis_coupon', hidden: true, component: () => import('@/views/loyalty/catalogue/coupon/overall-analysis'), meta: { title: 'overall_analysis', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }
      },
      {
        path: 'catalogue/redemption-analysis-coupon', name: 'redemption_analysis_coupon', hidden: true, component: () => import('@/views/loyalty/catalogue/coupon/redemption-analysis'), meta: { title: 'redemption_analysis', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }
      },
      {
        path: 'catalogue/add-event/:id', name: 'add_event', component: AddEvent, meta: { title: 'add_event', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }, hidden: true
      },
      {
        path: 'catalogue/edit-event/:id/:rid', name: 'edit_event_catalogue', component: AddEvent, meta: { title: 'edit_event', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }, hidden: true
      },
      {
        path: 'catalogue/view-event/:id/:rid', name: 'view_event_catalogue', component: AddEvent, meta: { title: 'view_event', icon: 'table', parents: [{ path: 'catalogue', transaction_key: 'fc_left_nav_loyalty_redemption', name: 'catalogue' }] }, hidden: true
      },
      {
        path: 'redemption/add-event/:id',
        name: 'add_event_redemption',
        component: AddEvent,
        meta: {
          title: 'add_event', icon: 'table',
          parents: [
            { path: 'redemption', name: 'redemption' }
          ]
        },
        hidden: true
      },
      {
        path: 'redemption/edit-event/:id/:rid',
        name: 'edit_event',
        component: AddEvent,
        meta: {
          title: 'edit_event', icon: 'table',
          parents: [
            { path: 'redemption', name: 'redemption' }
          ]
        },
        hidden: true
      },
      {
        path: 'redemption/view-event/:id/:rid',
        name: 'view_event',
        component: AddEvent,
        meta: {
          title: 'view_event', icon: 'table',
          parents: [
            { path: 'redemption', name: 'redemption' }
          ]
        },
        hidden: true
      },
      {
        path: 'redemption/member-redeem-detail',
        name: 'redeem_details',
        component: MemberRedeemDetail,
        meta: {
          title: 'redeem_details', icon: 'table',
          parents: [
            { path: 'redemption', name: 'redemption' }
          ]
        },
        hidden: true
      },
      {
        path: 'add-gift',
        name: 'add_gift',
        component: AddGift,
        meta: { title: 'add_gift' },
        hidden: true
      }
    ]
  },
  {
    path: public_prefix + '/campaign',
    component: Layout,
    name: 'campaign',
    hidden: true,
    redirect: 'noredirect',
    meta: { title: 'campaign', icon: 'left_column_campaign', roles: ['admin'], transaction_key: 'fc_left_nav_campaign' },
    children: [
      {
        path: 'campaign-setting',
        name: 'campaign_setting',
        component: () => import('@/views/campaign/spot-campaign'),
        hidden: true,
        meta: { title: 'campaign_setting', transaction_key: 'fc_left_nav_campaign_spot' }
      },
      // {
      //   path: 'recurring-campaign',
      //   name: 'recurring_campaign',
      //   component: () => import('@/views/campaign/recurring-campaign'),
      //   hidden: true,
      //   meta: { title: 'recurring_campaign', transaction_key: 'fc_left_nav_campaign_recurring' }
      // },
      {
        path: 'recurring-campaign/create',
        name: 'recurring_campaign_create',
        component: () => import('@/views/campaign/recurring-campaign/particular'),
        hidden: true,
        meta: {
          title: 'create', icon: 'table',
          parents: [
            { path: 'recurring-campaign', name: 'recurring_campaign' }
          ]
        }
      },
      {
        path: 'recurring-campaign/edit',
        name: 'recurring_campaign_edit',
        component: () => import('@/views/campaign/recurring-campaign/particular'),
        hidden: true,
        meta: {
          title: 'edit', icon: 'table',
          parents: [
            { path: 'recurring-campaign', name: 'recurring_campaign' }
          ]
        }
      },
      {
        path: 'recurring-campaign/detail',
        name: 'recurring_campaign_detail',
        component: () => import('@/views/campaign/recurring-campaign/campaign-detail'),
        hidden: true,
        meta: {
          title: 'view', icon: 'table',
          parents: [
            { path: 'recurring-campaign', name: 'recurring_campaign' }
          ]
        }
      },
      {
        path: 'recurring-campaign/copy',
        name: 'recurring_campaign_copy',
        component: () => import('@/views/campaign/recurring-campaign/particular'),
        hidden: true,
        meta: {
          title: 'view', icon: 'table',
          parents: [
            { path: 'recurring-campaign', name: 'recurring_campaign' }
          ]
        }
      },
      {
        path: 'spot-campaign/create',
        name: 'spot_campaign_create',
        // component: SpotCampaignEdit,
        component: () => import('@/views/campaign/spot-campaign/particular'),
        hidden: true,
        meta: {
          title: 'create', icon: 'table',
          parents: [
            { path: 'campaign-setting', name: 'spot_campaign' }
          ]
        }
      },
      {
        path: 'spot-campaign/edit',
        name: 'spot_campaign_edit',
        component: () => import('@/views/campaign/spot-campaign/particular'),
        hidden: true,
        meta: {
          title: 'edit', icon: 'table',
          parents: [
            { path: 'campaign-setting', name: 'spot_campaign' }
          ]
        }
      },
      {
        path: 'spot-campaign/detail',
        name: 'spot_campaign_detail',
        // component: SpotCampaignDetail,
        component: () => import('@/views/campaign/spot-campaign/campaign-detail'),
        hidden: true,
        meta: {
          title: 'view', icon: 'table',
          parents: [
            { path: 'campaign-setting', name: 'spot_campaign' }
          ]
        }
      },
      {
        path: 'spot-campaign/copy',
        name: 'spot_campaign_copy',
        component: () => import('@/views/campaign/spot-campaign/particular'),
        hidden: true,
        meta: {
          title: 'view', icon: 'table',
          parents: [
            { path: 'campaign-setting', name: 'spot_campaign' }
          ]
        }
      },
      {
        path: 'campaign-edit',
        name: 'campaign_edit',
        component: CampaignEditOrView,
        hidden: true,
        meta: { title: 'campaign_edit' }
      },
      {
        path: 'campaign-view',
        name: 'campaign_view',
        component: CampaignEditOrView,
        hidden: true,
        meta: { title: 'campaign_view' }
      },
      {
        path: 'advanced-query',
        name: 'advanced_query',
        component: CampaignAdvancedQuery,
        meta: { title: 'advanced_query' },
        hidden: true
      },
      {
        path: 'campaign-effect/:code/:id',
        name: 'campaign_effect',
        component: CampaignEffect,
        meta: { title: 'campaign_effect' },
        hidden: true
      },
      {
        path: 'lifecycle-studio/prospect/:id',
        name: 'prospect',
        component: PublishCampaign,
        meta: {
          title: 'PROSPECT', icon: 'table',
          parents: [
            { path: 'lifecycle-studio', name: 'lifecycle_studio' }
          ]
        },
        hidden: true
      },
      {
        path: 'lifecycle-studio/new-buyer/:id',
        name: 'new-buyer',
        component: PublishCampaign,
        meta: {
          title: 'NEW BUYER', icon: 'table',
          parents: [
            { path: 'lifecycle-studio', name: 'lifecycle_studio' }
          ]
        },
        hidden: true
      },
      {
        path: 'lifecycle-studio/repeat-customer/:id',
        name: 'repeat-customer',
        component: PublishCampaign,
        meta: {
          title: 'REPEAT CUSTOMER', icon: 'table',
          parents: [
            { path: 'lifecycle-studio', name: 'lifecycle_studio' }
          ]
        },
        hidden: true
      },
      {
        path: 'lifecycle-studio/sleeping-customer/:id',
        name: 'sleeping-customer',
        component: PublishCampaign,
        meta: {
          title: 'SLEEPING CUSTOMER', icon: 'table',
          parents: [
            { path: 'lifecycle-studio', name: 'lifecycle_studio' }
          ]
        },
        hidden: true
      },
      {
        path: 'trigger-studio',
        name: 'trigger_studio',
        hidden: true,
        component: TriggerCampaignIndex,
        meta: { title: 'trigger_studio', transaction_key: 'fc_left_nav_campaign_trigger' }
      },
      {
        path: 'trigger-studio/detail/:id',
        name: 'trigger_studio_detail',
        component: TriggerCampaignDetail,
        hidden: true,
        meta: {
          title: 'view', icon: 'table',
          parents: [
            { path: 'trigger-studio', name: 'trigger_studio' }
          ]
        }
      },
      {
        path: 'trigger-studio/edit',
        name: 'trigger_studio_edit',
        component: TriggerCampaignEdit,
        hidden: true,
        meta: {
          title: 'edit', icon: 'table',
          parents: [
            { path: 'trigger-studio', name: 'trigger_studio' }
          ]
        }
      },
      {
        path: 'lifecycle-studio',
        name: 'lifecycle_studio',
        // component: lifecycleStudio,
        component: LifecycleCampaign,
        hidden: true,
        meta: { title: 'lifecycle_studio', transaction_key: 'fc_left_nav_campaign_lifecycle' }
      },
      {
        path: 'lifecycle-studio/detail/:id',
        name: 'lifecycle_studio_detail',
        component: LifecycleCampaignDetail,
        hidden: true,
        meta: {
          title: 'view', icon: 'table',
          parents: [
            { path: 'lifecycle-studio', name: 'lifecycle_studio' }
          ]
        }
      },
      {
        path: 'lifecycle-studio/edit',
        name: 'lifecycle_studio_edit',
        component: LifecycleCampaignEdit,
        hidden: true,
        meta: {
          title: 'edit', icon: 'table',
          parents: [
            { path: 'lifecycle-studio', name: 'lifecycle_studio' }
          ]
        }
      },
      // 去除campaign history
      {
        path: 'campaign-list',
        name: 'campaign_list',
        hidden: true,
        component: CampaignList,
        meta: { title: 'campaign_list' }
      }
    ]
  },
  {
    path: public_prefix + '/reporting',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    name: 'reporting',
    meta: { title: 'reporting', icon: 'left_column_reporting', transaction_key: 'fc_left_nav_reporting' },
    children: [
      {
        path: 'one-click',
        name: 'one_click',
        hidden: true,
        component: ReportingOneClick,
        meta: { title: 'one_click', icon: 'report', transaction_key: 'fc_left_nav_reporting_one_click' }
      },
      {
        path: 'advanced',
        name: 'advanced',
        hidden: true,
        component: ReportingAdvanced,
        meta: { title: 'advanced', icon: 'report' }
      }
    ]
  },
  {
    path: public_prefix + '/configuration',
    component: Layout,
    name: 'configuration',
    redirect: 'noredirect',
    hidden: true,
    meta: { title: 'configuration', icon: 'left_column_tools', transaction_key: 'fc_left_nav_configuration', bottom: true },
    children: [
      {
        path: 'test-group-management',
        name: 'test-group-management',
        hidden: true,
        component: () => import('@/views/configuration/test-group-management'),
        meta: { title: 'test_group_management', transaction_key: 'fc_left_nav_configuration_test' }
      },
      {
        path: 'test-group-management/add',
        name: 'add_test_group',
        hidden: true,
        component: () => import('@/views/configuration/test-group-management/edit-add-detail'),
        meta: { title: 'add_test_group', parents: [
          { path: 'test-group-management', name: 'test_group_management' }
        ] }
      }, {
        path: 'test-group-management/edit',
        name: 'edit_test_group',
        hidden: true,
        component: () => import('@/views/configuration/test-group-management/edit-add-detail'),
        meta: { title: 'edit_test_group', parents: [
          { path: 'test-group-management', name: 'test_group_management' }
        ] }
      }, {
        path: 'test-group-management/detail',
        name: 'detail_test_group',
        hidden: true,
        component: () => import('@/views/configuration/test-group-management/edit-add-detail'),
        meta: { title: 'detail_test_group', parents: [
          { path: 'test-group-management', name: 'test_group_management' }
        ] }
      },
      {
        path: 'import1',
        name: 'import1',
        hidden: true,
        component: ConfigurationImport,
        meta: { title: 'import1', transaction_key: 'fc_left_nav_configuration_import' }
      },
      {
        path: 'import1/edit',
        name: 'edit',
        component: ConfigurationImportEdit,
        hidden: true,
        meta: { title: 'edit' }
      },
      {
        path: 'upload-history',
        name: 'upload_history',
        hidden: true,
        component: UploadHistory,
        meta: { title: 'upload_history', transaction_key: 'fc_left_nav_configuration_upload' }
      },
      {
        path: 'product',
        name: 'product',
        component: ConfigurationProductListIndex,
        hidden: true,
        meta: {
          title: 'product', module: 'portal', transaction_key: 'fc_left_nav_configuration_product'
        }
      },
      {
        path: 'transaction',
        name: 'transaction',
        hidden: true,
        component: ConfigurationTransactionListIndex,
        meta: { title: 'transaction', module: 'portal', transaction_key: 'fc_left_nav_configuration_transaction' }
      },
      {
        path: 'transaction/detail/:id',
        name: 'transaction-detail',
        hidden: true,
        component: ConfigurationTransactionDetail,
        meta: {
          title: 'transaction_detail',
          parents: [
            { path: 'transaction', name: 'transaction' }
          ]
        }
      },
      {
        path: 'terms-conditions',
        name: 'terms_conditions',
        hidden: true,
        component: TermsAndConditions,
        meta: { title: 'terms_conditions', transaction_key: 'fc_left_nav_configuration_terms' }
      },
      {
        path: 'upload-history/detail/:id',
        name: 'detail',
        hidden: true,
        component: UploadHistoryDetail,
        meta: { title: 'edit' }
      },
      {
        path: 'store/list/',
        name: 'store_list',
        hidden: true,
        component: ConfigurationStoreList,
        meta: { title: 'store_list_configuration' }
      },
      {
        path: 'store/list/details/:id',
        name: 'store-details',
        component: ConfigurationStoreListDetail,
        meta: {
          title: 'mgt_store_details_page_title',
          parents: [
            { path: 'store/list/index', name: 'store_list_configuration' }
          ]
        },
        hidden: true
      },
      {
        path: 'store/list/edit/:id',
        name: 'store-edit',
        component: ConfigurationStoreListEdit,
        meta: {
          title: 'mgt_store_edit_page_title',
          parents: [
            { path: 'store/list/index', name: 'store_list_configuration' }
          ]
        },
        hidden: true
      },
      {
        path: 'store/list/add',
        name: 'store-add',
        component: ConfigurationStoreListEdit,
        meta: {
          title: 'mgt_store_add_page_title',
          parents: [
            { path: 'store/list/index', name: 'store_list_configuration' }
          ]
        },
        hidden: true
      },
      {
        path: 'employee/list/',
        name: 'employee-list-1',
        component: ConfigurationEmployeeIndex,
        hidden: true,
        meta: {
          title: 'employee_list_add'
        }
      },
      {
        path: 'employee/list/edit/:id',
        name: 'employee-list-edit',
        component: ConfigurationEmployeeListAdd,
        meta: {
          title: 'employee_edit',
          parents: [
            { path: 'employee/list/index', name: 'employee_list' }
          ]
        },
        hidden: true
      },
      {
        path: 'employee/list/add',
        name: 'employee-list-add',
        component: ConfigurationEmployeeListAdd,
        meta: {
          title: 'employee_add',
          parents: [
            { path: 'employee/list/index', name: 'employee_list' }
          ]
        },
        hidden: true
      },
      {
        path: 'employee/list/import',
        name: 'employee-list-import',
        component: ConfigurationEmployeeListImport,
        meta: {
          title: 'employee_import',
          parents: [
            { path: 'employee/list/index', name: 'employee_list' }
          ]
        },
        hidden: true
      },
      {
        path: 'employee/list/detail/:id',
        name: 'employee-details',
        component: ConfigurationEmployeeListDetails,
        meta: {
          title: 'employee_details',
          parents: [
            { path: 'employee/list/index', name: 'employee_list' }
          ]
        },
        hidden: true
      },
      {
        path: 'store/list/index',
        name: 'store-list',
        component: ConfigurationStoreListIndex,
        hidden: true,
        meta: {
          title: 'store_list'
        }
      },
      {
        path: 'employee/list/index',
        name: 'employee-list',
        component: ConfigurationEmployeeListIndex,
        hidden: true,
        meta: {
          title: 'employee_list'
        }
      },
      {
        path: 'product/add',
        name: 'product_add',
        component: ConfigurationProductListAdd,
        hidden: true,
        meta: {
          title: 'product_add',
          parents: [
            { path: 'product', name: 'product' }
          ]
        }
      },
      {
        path: 'product/edit/:id',
        name: 'product_edit',
        component: ConfigurationProductListAdd,
        hidden: true,
        meta: {
          title: 'product_edit',
          parents: [
            { path: 'product', name: 'product' }
          ]
        }
      },
      {
        path: 'product/detail/:id',
        name: 'product-detail',
        component: ConfigurationProductDetail,
        hidden: true,
        meta: {
          title: 'product_detail',
          parents: [
            { path: 'product', name: 'product' }
          ]
        }
      }
    ]
  },
  {
    path: public_prefix + '/appointlist',
    component: Layout,
    redirect: '/index',
    hidden: true,
    meta: { title: 'appointlist', icon: 'AppiontList' },
    children: [
      {
        path: 'index',
        name: 'appointlist',
        hidden: true,
        component: Appointlist,
        meta: { title: 'appointlist', icon: 'AppiontList' }
      }
    ]
  },
  {
    path: public_prefix + '/orderview',
    component: Layout,
    redirect: '/index',
    hidden: true,
    meta: { title: 'orderview', icon: 'Orderview' },
    children: [
      {
        path: 'index',
        name: 'orderview',
        hidden: true,
        component: Orderview,
        meta: { title: 'orderview', icon: 'Orderview' }
      }
    ]
  },
  {
    path: public_prefix + '/otherlist',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    name: 'otherlist',
    meta: { title: 'otherlist', icon: 'left_column_reporting', transaction_key: 'fc_left_nav_otherlist' },
    children: [
      {
        path: 'blacklist',
        name: 'blacklist',
        hidden: true,
        component: Blacklist,
        meta: { title: 'blcklist', icon: 'left_column_reporting', transaction_key: 'fc_left_nav_blacklist' }
      }
    ]
  },
  {
    path: public_prefix + '/orderview-reima',
    component: Layout,
    redirect: '/index',
    hidden: true,
    meta: { title: 'orderviewreima', icon: 'Orderview' },
    children: [
      {
        path: 'index',
        name: 'orderviewreima',
        hidden: true,
        component: OrderviewReima,
        meta: { title: 'orderviewreima', icon: 'Orderview' }
      }
    ]
  },
  {
    path: public_prefix + '/user-role',
    component: Layout,
    hidden: true,
    name: 'user_role',
    redirect: 'noredirect',
    meta: { title: 'user_role', transaction_key: 'fc_left_nav_user', icon: 'campaign' },
    children: [
      {
        path: 'user-management',
        name: 'user_management',
        component: UserManagement,
        hidden: true,
        meta: { title: 'user_management', transaction_key: 'fc_left_nav_user_user' }
      },
      {
        path: 'role-management',
        name: 'role_management',
        component: RoleManagement,
        hidden: true,
        meta: { title: 'role_management', transaction_key: 'fc_left_nav_user_role' }
      }
    ]
  },
  {
    path: public_prefix + '/kpi_definition',
    component: Layout,
    redirect: '/index',
    meta: { title: 'kpi_definition', icon: 'Orderview' },
    children: [
      {
        path: 'index',
        name: 'kpi_definition',
        component: () => import('@/views/custom/kpi-definition'),
        meta: { title: 'kpi_definition', icon: 'Orderview' }
      }
    ]
  }
]

const router = new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: initRouterMap
})

export default router
