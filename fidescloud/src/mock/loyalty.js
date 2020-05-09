import Mock from 'mockjs'
const pointTypeList = []
for (let i = 0; i <= 30; i++) {
  pointTypeList.push(Mock.mock({
    name: '@string(10)',
    code: '@id',
    'is_default|1': [1, 0],
    description: '@string(30)',
    create_date: '@date'
  }))
}
const accountTypeList = []
for (let i = 0; i <= 5; i++) {
  accountTypeList.push(Mock.mock({
    name: '@string(10)',
    code: '@id',
    'is_default|1': [1, 0],
    description: '@string(30)',
    create_date: '@date'
  }))
}
const couponList = []
for (let i = 0; i < 100; i++) {
  couponList.push(Mock.mock({
    coupon_name: '@string(10)',
    coupon_code: '@id',
    'coupon_type_code|1': ['cash', 'discount', 'GWP'],
    amount: '@float(10, 20, 2, 2)',
    coupon_type_name: '@string(10)',
    'effective_type|1': [1, 2],
    'relative_unit|1': [1, 2, 3],
    'active_flag|1': [1, 0],
    relative_value: '@float(10, 20)',
    specific_effective_date_from: '@date',
    specific_effective_date_to: '@date',
    description: '@string(30)'
  }))
}
const couponTypeList = []
couponTypeList.push(Mock.mock({
  coupon_type_name: 'cash',
  coupon_type_code: 'cash',
  create_date: '@date',
  description: '@string(10)'
}))
couponTypeList.push(Mock.mock({
  coupon_type_name: 'discount',
  coupon_type_code: 'discount',
  create_date: '@date',
  description: '@string(10)'
}))
couponTypeList.push(Mock.mock({
  coupon_type_name: 'GWP',
  coupon_type_code: 'GWP',
  create_date: '@date',
  description: '@string(10)'
}))
export default {
  queryPointRule: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        name: '@string(10)',
        code: '@id',
        ratio: '@float(0,0,2,2)',
        expiry_type: '02',
        relative_unit: '01',
        relative_value: '@integer(10,20)',
        fixed_after_year: '@integer(1,4)',
        fixed_after_month: '@integer(1,12)',
        fixed_after_day: '@integer(1,30)',
        remark: '@string(30)'
      }),
      signature: '',
      timestamp: '11111111'
    }
  },
  addOrUpdatePointRule: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        code: '@id'
      }),
      signature: '',
      timestamp: '11111111'
    }
  },
  queryPointTypeList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(pointTypeList.length / page_size),
        total_count: pointTypeList.length,
        point_types: pointTypeList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: '11111111'
    }
  },
  addOrUpdatePointType: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        code: '@id'
      }),
      signature: '',
      timestamp: '11111111'
    }
  },
  checkPointTypeCode: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        code: '@id'
      }),
      signature: '',
      timestamp: '11111111'
    }
  },
  addOrUpdateAccountType: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        code: '@id'
      }),
      signature: '',
      timestamp: '11111111'
    }
  },
  checkAccountTypeCode: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        code: '@id'
      }),
      signature: '',
      timestamp: '11111111'
    }
  },
  queryAccountTypeList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(accountTypeList.length / page_size),
        total_count: accountTypeList.length,
        account_types: accountTypeList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: '11111111'
    }
  },
  queryCouponListBy: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(couponList.length / page_size),
        total_count: couponList.length,
        coupons: couponList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: '11111111'
    }
  },
  addOrUpdateCoupon: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        coupon_code: '@id'
      }),
      signature: '',
      timestamp: '11111111'
    }
  },
  checkCouponCode: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        coupon_code: '@id'
      }),
      signature: '',
      timestamp: '11111111'
    }
  },
  queryCouponTypeList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(couponTypeList.length / page_size),
        total_count: couponTypeList.length,
        coupon_types: couponTypeList.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: '11111111'
    }
  }
}
