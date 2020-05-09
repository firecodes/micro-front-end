import Mock from 'mockjs'

const timestamp = new Date().getTime()

const memberKpi = Mock.mock({
  average_itmes: '@float(1, 10, 0, 2)',
  average_basketsize: '@float(2000, 5000, 0, 2)',
  accumulative_payment: '@float(8000, 20000, 0, 2)',
  lastest_purchase_date: '@date',
  total_purchase_times: '3',
  rfm_lastest_purchase_time: 20,
  rfm_lasetet_purchase_frequence: 3,
  rfm_total_spend: '@float(8000, 20000, 0, 2)'
})

const tenantKpi = Mock.mock({
  total_member: 19999,
  new_member: 3000,
  existing_member: 16999,
  active_rate: '@float(0, 0, 0, 2)',
  frequency_last_year: '@float(2, 15, 0, 2)',
  frequency_p12m: '@float(2, 15, 0, 2)',
  rfm_lastest_purchase_time: '@float(2, 15, 0, 2)',
  rfm_purchase_frequency: '@float(2, 15, 0, 2)',
  rfm_total_spend: '@float(2000, 9000, 0, 2)'
})

const memberChannelKpi = Mock.mock({
  KPIs: [{
    channel_code: '@id',
    channel_name: 'Tmall',
    purchase_times: '@natural(0, 100)'
  }, {
    channel_code: '@id',
    channel_name: 'POS',
    purchase_times: '@natural(0, 100)'
  }, {
    channel_code: '@id',
    channel_name: 'WeChat mall',
    purchase_times: '@natural(0, 100)'
  }, {
    channel_code: '@id',
    channel_name: 'EC',
    purchase_times: '@natural(0, 100)'
  }]
})
const monthlyKpi = []
for (let i = 1; i <= 12; i++) {
  monthlyKpi.push(Mock.mock({
    month: i,
    total_purchase_times: '@natural(0, 100)',
    accumulative_payment: '@natural(1000, 3000)'
  }))
}
const memberMonthlyKpi = Mock.mock({
  KPIs: monthlyKpi
})
export default {
  getMemberKPI: config => {
    return {
      code: '2000',
      message: 'suc',
      result: memberKpi,
      signature: '',
      timestamp: timestamp
    }
  },
  getTenantKPI: config => {
    return {
      code: '2000',
      message: 'suc',
      result: tenantKpi,
      signature: '',
      timestamp: timestamp
    }
  },
  getMemberChannelKPI: config => {
    return {
      code: '2000',
      message: 'suc',
      result: memberChannelKpi,
      signature: '',
      timestamp: timestamp
    }
  },
  getMemberMonthlyKPI: config => {
    return {
      code: '2000',
      message: 'suc',
      result: memberMonthlyKpi,
      signature: '',
      timestamp: timestamp
    }
  }
}
