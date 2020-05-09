import Mock from 'mockjs'

const timestamp = new Date().getTime()
var kpiMonthly
const getKPIMonthly = (year) => {
  kpiMonthly = []
  for (let i = 1; i <= 12; i++) {
    kpiMonthly.push(Mock.mock({
      year: year,
      month: i,
      member_sales: '@float(100000, 500000, 0, 2)'
    }))
  }
}

const tierKPI = []
const tierList = ['tier1', 'tier2', 'tier3', 'tier4']
for (let i = 0; i < 4; i++) {
  tierKPI.push(Mock.mock({
    member_tier_code: '@increment()',
    member_tier_name: tierList[i],
    'tier_level|1': [1, 2],
    active_rate: 0.25
  }))
}
export default {
  getTenantKPIYearly: config => {
    const { year } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        'KPIs': Mock.mock({
          year: year,
          total_sales: '@float(666666, 100000000, 0, 2)',
          total_sales_vs_last_month: '@float(0, 0, 0, 4)',
          total_sales_vs_last_year: '@float(0, 0, 0, 4)',
          member_sales: '@float(333333, 777777, 0, 2)',
          member_sales_vs_last_month: '@float(0, 0, 0, 4)',
          member_sales_vs_last_year: '@float(0, 0, 0, 4)',
          average_basket: '@float(1000, 8888, 0, 2)',
          average_basket_vs_last_month: '@float(0, 0, 0, 4)',
          average_basket_vs_last_year: '@float(0, 0, 0, 4)',
          average_items: '@float(1, 8, 0, 2)',
          average_items_vs_last_month: '@float(0, 0, 0, 4)',
          average_items_vs_last_year: '@float(0, 0, 0, 4)'
        })
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getTenantKPIByTier: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        'KPIs': tierKPI
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getTenantKPIMonthly: config => {
    const { year } = JSON.parse(config.body).bu_content
    getKPIMonthly(year)
    return {
      code: '2000',
      msg: 'suc',
      result: {
        'KPIs': kpiMonthly
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getTenantCampaignKPIYearly: config => {
    const { year } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        'KPIs': Mock.mock({
          year: year,
          campaign_sales: '@integer(2000000,5000000)',
          campaign_number: '@integer(100,500)',
          campaign_participants: '@integer(10000,100000)',
          campaign_response_rate: '@float(0, 0, 0, 2)'
        })
      },
      signature: '',
      timestamp: timestamp
    }
  }
}
