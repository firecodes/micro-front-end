import Mock from 'mockjs'
const memberAccountTypes = []
for (let i = 0; i < 4; i++) {
  memberAccountTypes.push(Mock.mock({
    account_type_code: '@id',
    account_type_name: '@string(5)',
    account_code: i
  }))
}
const historyPointList = []
for (let i = 0; i < 30; i++) {
  historyPointList.push(Mock.mock({
    account_code: '@id',
    create_date: '@date',
    point_type_code: '@id',
    point_type_name: '@string(5)',
    point_amount: '@integer(1000,2000)',
    effective_date: '@date',
    expired_date: '@date',
    channel_code: '@id',
    brand_code: '@id',
    remark: '@string(15)'

  }))
}
const couponList = []
for (let i = 0; i < 30; i++) {
  couponList.push(Mock.mock({
    coupon_serial_no: '@id',
    coupon_code: '@id',
    coupon_name: '@string(8)',
    coupon_type_code: '@id',
    amount: '@float(0, 0, 1,1)',
    product_code: '@id',
    product_name: '@string(10)',
    coupon_type_name: '@string(8)',
    effective_date: '@date',
    expired_date: '@date',
    'status|1': ['inActive', 'Normal', 'Used', 'Expired'],
    used_date: '@date',
    used_channel_code: '@id',
    used_channel_name: '@string(8)',
    external_transaction_id: '@id'
  }))
}
const campaignList = []
for (let i = 0; i < 25; i++) {
  campaignList.push(Mock.mock({
    campaign_id: '@id',
    campaign_name: '@string(8)',
    campaign_code: '@id',
    campaign_from_date: '@date',
    campaign_to_date: '@date',
    campaign_type_code: '@id',
    campaign_type_name: '@string(8)',
    participate_date: '@date'
  }))
}
const snsList = []
snsList.push(Mock.mock({
  sns_type_code: '@id',
  sns_type_name: 'WeChat',
  'binding_status|1': ['1', '0'],
  sns_member_account: '@string(10)',
  binding_date: '@date',
  unbinding_date: '@date'
}))
snsList.push(Mock.mock({
  sns_type_code: '@id',
  sns_type_name: 'Facebook',
  'binding_status|1': ['1', '0'],
  sns_member_account: '@string(10)',
  binding_date: '@date',
  unbinding_date: '@date'
}))
snsList.push(Mock.mock({
  sns_type_code: '@id',
  sns_type_name: 'Line',
  'binding_status|1': ['0', '1'],
  sns_member_account: '@string(10)',
  binding_date: '@date',
  unbinding_date: '@date'
}))
export default {
  getMemberAccountType: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        member_code: '22222',
        member_account_types: memberAccountTypes
      },
      signature: '',
      timestamp: 1111111111
    }
  },
  getMemberPointByAccount: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        member_code: '22222',
        point_account_balances: Mock.mock({
          account_code: '@id',
          account_type_code: '@id',
          account_type_name: '@string(5)',
          point_balance: '@integer(1000,2000)',
          used_point: '@integer(100,500)',
          expired_point: function() {
            return this.point_balance - this.used_point
          }
        })
      },
      signature: '',
      timestamp: 1111111111
    }
  },
  queryMemberPointHistory: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(historyPointList.length / 10),
        total_count: historyPointList.length,
        points: historyPointList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: 1111111111
    }
  },
  queryMemberCouponListBySearch: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(couponList.length / 10),
        total_count: couponList.length,
        member_coupons: couponList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: 1111111111
    }
  },
  queryMemberCampaignListBySearch: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(campaignList.length / 10),
        total_count: campaignList.length,
        member_campaigns: campaignList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: 1111111111
    }
  },
  getMemberSNSList: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(snsList.length / 10),
        total_count: snsList.length,
        sns_bindings: snsList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: 1111111111
    }
  }
}
