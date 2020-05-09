import Mock from 'mockjs'
const memberTierList = []
for (let i = 1; i <= 4; i++) {
  memberTierList.push(Mock.mock({
    member_tier_name: '@string(5)',
    member_tier_code: '@id',
    default_tier: function() {
      return this.tier_level === 4 ? 1 : 0
    },
    tier_level: i,
    create_date: '@date',
    multiple_point_ratio: '@float(0, 0,2,2)',
    upgrade_type: 2,
    upgrade_value_from: '@float(60, 100,0,0)',
    upgrade_value_to: '@float(100, 200,0,0)',
    'expired_type|1': [1, 2, 3],
    expired_fixed_after_year: '@float(1, 12,0,0)',
    expired_fixed_specific_month: '@float(1, 12,0,0)',
    expired_fxied_specific_date: '@float(1, 30,0,0)',
    'expired_relative_unit|1': [1, 2, 3],
    expired_relative_value: '@float(10, 30,0,0)'
  }))
}
export default {
  queryMemberTierList: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(memberTierList.length / page_size),
        total_count: memberTierList.length,
        tiers: memberTierList.slice(page_no - 1, page_no + page_size - 1)
      },
      signature: '',
      timestamp: 1111111111
    }
  },
  addOrUpdateMemberTier: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: 1111
      },
      signature: '',
      timestamp: 1111111111
    }
  }
}
