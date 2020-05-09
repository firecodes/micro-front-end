export const data = {
  'activate': [{
    campaign_wizard_id: '1',
    trigger_name: 'Prospects',
    trigger_id: '1',
    category: 'Activate',
    desc: 'Members who registered in your Loyalty program but never purchased.',
    status: 1,
    icon_name: 'prospects-svg',
    limit_by: '1'
  }],
  'nurture': [{
    campaign_wizard_id: '4',
    trigger_name: 'New buyers',
    trigger_id: '4',
    category: 'Nurture',
    desc: 'Members who purchased one-time only.',
    status: 1,
    icon_name: 'new-buyers-svg',
    limit_by: '1'
  }],
  'energize': [{
    campaign_wizard_id: '8',
    trigger_name: 'Lapsed members',
    trigger_id: '8',
    category: 'Energize',
    desc: 'Active Members that are about to fall asleep. ',
    status: 1,
    icon_name: 'lapsed-members-svg',
    limit_by: '1'
  }],
  'awake': [{
    campaign_wizard_id: '8',
    trigger_name: 'Sleeping members',
    trigger_id: '8',
    category: 'Awake',
    desc: "Members that didn't purchase for a while.",
    status: 2,
    icon_name: 'sleeping-members-svg',
    limit_by: '1'
  }]
}

export const when_options = [
  { value: 1, label: 'specific_date', name: 'fc_campaign_lifecycle_edit_when_specific_label' }
]

export const who_options = [
  { value: 'everyone', label: 'all_members', name: 'fc_campaign_lifecycle_edit_who_all_label' },
  { value: 'filter', label: 'targeted_members', name: 'fc_campaign_lifecycle_edit_who_targeted_label' }
]

export const who_target_1 = [
  {
    criteria_group: 'demographic',
    criteria_field: [{
      criteria_field_name: 'age',
      criteria_field_code: 'age'
    }]
  }
]
export const who_target_2 = [
  {
    criteria_group: 'register channel',
    value: ['default', 'e-commerce', 'WeChat', 'POS', 'online', 'Back office']
  }
]

export const what_options = [
  // { value: 'General Points', label: 'points' },
  { value: 'Coupon', label: 'coupon' }
]
