import Mock from 'mockjs'
const List = []
const transactionList = []
const transactionDetailList = []
const tierList = []
const member_segmentations = []
const count = 100
const timestamp = new Date().getTime()
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    member_code: '@id',
    full_name: '@cname',
    mobile: /^1[0-9]{10}$/,
    birthday: '@date',
    register_date: '@date',
    'member_tier_name|1': ['Bronze', 'Silver', 'Gold'],
    'register_store_name|1': ['store1', 'store2', 'store3'],
    'register_channel_name|1': ['AMD', 'CMD', 'UMD'],
    'register_employee_name|1': ['employee1', 'employee2', 'employee3']
  }))
}
for (let i = 0; i < count; i++) {
  transactionList.push(Mock.mock({
    purchase_date: '@date',
    invoice_no: '@id',
    channel_code: '@increment(1000)',
    'channel_name|1': ['channel1', 'channel2', 'channel3'],
    store_code: '@id',
    'transaction_type_name|1': ['pos', 'wechat', 'alipay'],
    'store_name|1': ['store1', 'store2', 'store3'],
    employee_code: '@guid',
    'employee_name|1': ['employee1', 'employee2', 'employee3'],
    total_amount: '@float(11600, 110000, 2, 2)',
    total_quantity: '@float(60, 100, 2, 2)'
  }))
}
for (let i = 0; i < 5; i++) {
  transactionDetailList.push(Mock.mock({
    product_code: '@date',
    product_name: '@string( 5 )',
    brand_code: '@increment(1000)',
    brand_name: '@string( 5 )',
    transaction_type_code: '@id',
    transaction_type_name: '@string( 5 )',
    original_price: '@float(500, 2000, 2, 2)',
    real_price: '@float(100, 1000, 2, 2)',
    quantity: '@integer(10,100)',
    total_amount: '@float(2000, 7000, 2, 2)'
  }))
}
for (let i = 0; i < count; i++) {
  tierList.push(Mock.mock({
    from_member_tier_code: '@id',
    from_member_tier_name: '@string( 5 )',
    to_member_tier_code: '@id',
    to_member_tier_name: '@string( 5 )',
    update_date: '@date',
    effective_from_date: '@date',
    effective_to_date: '@date'
  }))
}
for (let i = 0; i < 4; i++) {
  member_segmentations.push(Mock.mock({
    segmentation_type_code: '@id',
    segmentation_type_name: '@string( 5 )',
    segmentation_values: segmentation_values
  }))
}
const segmentation_values = []
for (let i = 0; i < 5; i++) {
  segmentation_values.push(Mock.mock({
    segmentation_value_code: '@id',
    segmentation_value_name: '@string( 5 )',
    create_date: '@date'
  }))
}

const memberInfo = Mock.mock({
  member_code: '@id',
  first_name: '@first',
  last_name: '@last',
  full_name: 'Taylor swift',
  mobile: /^1[0-9]{10}$/,
  'gender|1': [0, 1, 2], // 1 male 2 female 0 unknown
  email: '@email',
  member_tier_code: '@id',
  member_tier_name: 'Bronze',
  register_date: '2018-07-19T03:53+08:00',
  birthday: '1994-09-24',
  zip_code: '200000',
  location: 'ShangHai PuTuoQu',
  address: 'ShangHai PuTuoQu JiaoJiLu',
  options: [{
    option_value: 1,
    option_type_code: 'sms',
    option_type_name: 'sms'
  }, {
    option_value: 2,
    option_type_code: 'email',
    option_type_name: 'email'
  }, {
    option_value: 1,
    option_type_code: 'mobile',
    option_type_name: 'mobile'
  }],
  register_brand_code: '@id',
  register_brand_name: '@string(5)',
  register_channel_code: '@id',
  'register_channel_name|1': ['Wechat', 'QQ'],
  register_store_code: '@id',
  register_store_name: '@string(5)',
  register_employee_code: '@id',
  register_employee_name: '@string(5)',
  prefered_store_code: '@id',
  prefered_store_name: '@string(5)',
  country_dictionary_code: '@id',
  country_dictionary_name: '@string(5)',
  province_dictionary_code: '@id',
  province_dictionary_name: '@string(5)',
  city_dictionary_code: '@id',
  city_dictionary_name: '@string(5)',
  district_dictionary_code: '@id',
  district_dictionary_name: '@string(5)',
  member_icon_url: 'http://img3.duitang.com/uploads/item/201510/17/20151017131622_JT4cH.jpeg'
})
const availableCampaignList = []
const template_m_point = {
  campaign_id: '@id',
  campaign_name: '@string(5)',
  campaign_code: '@id',
  campaign_from_date: '@date',
  campaign_to_date: '@date',
  campaign_type_name: '@string(5)',
  'campaign_type_code|1': ['multiple_points', 'coupon', 'gwp']
}
for (let i = 0; i < 0; i++) {
  availableCampaignList.push(Mock.mock(template_m_point))
}
const segmentationValuesList = []
for (let i = 0; i < 30; i++) {
  segmentationValuesList.push(Mock.mock({
    segmentation_value_code: '@id',
    segmentation_value_name: '@string(10)',
    create_date: '@date'
  }))
}
export default {
  queryMemberListBySearch: config => {
    // const { title, page = 1, limit = 10, sort } = param2Obj(config.url)
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(List.length / page_size),
        total_count: List.length,
        members: List.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  createMember: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        member_code: '2222'
      },
      signature: '',
      timestamp: timestamp
    }
  },
  updateMember: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        member_code: '2222'
      },
      signature: '',
      timestamp: timestamp
    }
  },
  checkMemberCode: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        member_code: '2222'
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getMemberInfo: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: memberInfo,
      signature: '',
      timestamp: timestamp
    }
  },
  getMemberTransactionList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(transactionList.length / 10),
        total_count: transactionList.length,
        transactions: transactionList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getMemberTransactionDetailList: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).bu_content

    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(transactionDetailList.length / page_size),
        total_count: transactionDetailList.length,
        transaction_detail: transactionDetailList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getMemberTierList: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(tierList.length / page_size),
        total_count: tierList.length,
        member_tier_histories: tierList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getMemberSegmentationList: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        member_code: '',
        member_segmentations: [
          Mock.mock({
            segmentation_type_code: '@id',
            segmentation_type_name: '@string(10)',
            segmentation_values: segmentationValuesList
          }),
          Mock.mock({
            segmentation_type_code: '@id',
            segmentation_type_name: '@string(10)',
            segmentation_values: segmentationValuesList
          })
        ]
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getMemberAvailableCampaign: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        member_code: '1111111',
        member_available_campaign: availableCampaignList
      },
      signature: '',
      timestamp: timestamp
    }
  }
}
