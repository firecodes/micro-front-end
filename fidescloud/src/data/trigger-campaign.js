export const data = {
  'greetings': [{
    campaign_wizard_id: '1',
    trigger_name: 'Member registration',
    trigger_id: 1,
    category: 'Greetings',
    desc: 'Welcome your new Members with a message or a reward.',
    status: 1,
    icon_name: 'member_registration',
    limit_by: '1'
  }, {
    campaign_wizard_id: '2',
    trigger_name: 'Birthday greeting',
    trigger_id: 2,
    category: 'Greetings',
    desc: 'Congratulate your Members with a treat or a friendly note.',
    status: 2,
    icon_name: 'birthday_greeting',
    limit_by: '2'
  }, {
    campaign_wizard_id: '3',
    trigger_name: 'Member Anniversary',
    trigger_id: 3,
    category: 'Greetings',
    desc: 'Congratulate your Members with a treat or a friendly note.',
    status: 3,
    icon_name: 'member_anniversary',
    limit_by: '3'
  }],
  'reminders': [{
    campaign_wizard_id: '4',
    trigger_name: 'Expiring coupons',
    trigger_id: 4,
    category: 'Reminders',
    desc: 'Remind your Members of a coupon that is expiring soon.',
    status: 1,
    icon_name: 'expiring_coupons',
    limit_by: '1'
  }, {
    campaign_wizard_id: '5',
    trigger_name: 'Expiring points',
    trigger_id: 5,
    category: 'Reminders',
    desc: 'Remind your Members of their points that are expiring soon.',
    status: 1,
    icon_name: 'expiring_points',
    limit_by: '2'
  }, {
    campaign_wizard_id: '6',
    trigger_name: 'Calendar Reminder',
    trigger_id: 6,
    category: 'Reminders',
    desc: 'Remind your Members of their points that are expiring soon.',
    status: 3,
    icon_name: 'calendar_reminder',
    limit_by: '3'
  }, {
    campaign_wizard_id: '7',
    trigger_name: 'Trip Reminder',
    trigger_id: 7,
    category: 'Reminders',
    desc: 'Remind your Members of their points that are expiring soon.',
    status: 3,
    icon_name: 'trip_reminder',
    limit_by: '4'
  }],
  'notifications': [{
    campaign_wizard_id: '8',
    trigger_name: 'Points redemption',
    trigger_id: 8,
    category: 'Notifications',
    desc: 'Notify your Members when they have redeemed their points.',
    status: 1,
    icon_name: 'points_redemption',
    limit_by: '1'
  }, {
    campaign_wizard_id: '9',
    trigger_name: 'Points update',
    trigger_id: 9,
    category: 'Notifications',
    desc: 'Notify your Members when they receive points.',
    status: 2,
    icon_name: 'points_update',
    limit_by: '2'
  }, {
    campaign_wizard_id: '10',
    trigger_name: 'Transaction confirmation',
    trigger_id: 10,
    category: 'Notifications',
    desc: 'Notify your Members when they demote to a lower tier.',
    status: 2,
    icon_name: 'transaction_confirmation',
    limit_by: '3'
  }, {
    campaign_wizard_id: '11',
    trigger_name: 'Member tier upgrade',
    trigger_id: 11,
    category: 'Notifications',
    desc: 'Notify your Members when they reach a higher tier.',
    status: 2,
    icon_name: 'member_tier_upgrade',
    limit_by: '4'
  }, {
    campaign_wizard_id: '12',
    trigger_name: 'Member tier downgrade',
    trigger_id: 12,
    category: 'Notifications',
    desc: 'Notify your Members when they demote to a lower tier.',
    status: 2,
    icon_name: 'member_tier_downgrade',
    limit_by: '5'
  }]
}
export const who_target_1 = [
  {
    criteria_group: 'profile',
    criteria_field: [
      {
        criteria_field_name: 'tiers',
        criteria_field_code: 'tiers'
      }, {
        criteria_field_name: 'age',
        criteria_field_code: 'age'
      }, {
        criteria_field_name: 'birthday',
        criteria_field_code: 'birthday'
      }, {
        criteria_field_name: 'join date',
        criteria_field_code: 'join_date'
      }, {
        criteria_field_name: 'register store',
        criteria_field_code: 'register_store'
      }, {
        criteria_field_name: 'register channel',
        criteria_field_code: 'register_channel'
      }]
  }, {
    criteria_group: 'transaction',
    criteria_field: [
      {
        criteria_field_name: 'lastest purchase date',
        criteria_field_code: 'lastest_purchase_date'
      }, {
        criteria_field_name: 'average basket',
        criteria_field_code: 'average_basket'
      }, {
        criteria_field_name: 'average items',
        criteria_field_code: 'average_items'
      }, {
        criteria_field_name: 'purchased product',
        criteria_field_code: 'purchased_product'
      }, {
        criteria_field_name: 'purchased brand',
        criteria_field_code: 'purchased_brand'
      }, {
        criteria_field_name: 'purchased category',
        criteria_field_code: 'purchased_category'
      }]
  }, {
    criteria_group: 'point',
    criteria_field: [
      {
        criteria_field_name: 'available point',
        criteria_field_code: 'available_point'
      }, {
        criteria_field_name: 'campaign respondent',
        criteria_field_code: 'campaign_respondent'
      }
    ]
  }
]
export const who_target = [
  {
    criteria_group: 'Socio-demographic profile',
    criteria_field: [
      {
        criteria_field_name: 'Gender',
        criteria_field_code: 'gender'
      }, {
        criteria_field_name: 'Age',
        criteria_field_code: 'age'
      }, {
        criteria_field_name: 'Country',
        criteria_field_code: 'country'
      }, {
        criteria_field_name: 'City/Province',
        criteria_field_code: 'city'
      }]
  }, {
    criteria_group: 'Loyalty profile',
    criteria_field: [
      {
        criteria_field_name: 'Available Points>=',
        criteria_field_code: 'available_points_1'
      }, {
        criteria_field_name: 'Available Points<=',
        criteria_field_code: 'available_points_2'
      }, {
        criteria_field_name: 'Tier',
        criteria_field_code: 'tier'
      }, {
        criteria_field_name: 'Registration date',
        criteria_field_code: 'registration_date'
      }]
  }, {
    criteria_group: 'Transaction',
    criteria_field: [
      {
        criteria_field_name: 'Lastest Purchase Date',
        criteria_field_code: 'lastest_purchase_date'
      }, {
        criteria_field_name: 'Member Average Basket',
        criteria_field_code: 'member_average_basket'
      }, {
        criteria_field_name: 'Transaction channel',
        criteria_field_code: 'transaction_channel'
      }
    ]
  }
]

export const reserved_field_list = [{ 'id': 5, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'first name', 'display_name': 'first name', 'code': 'first name' }, { 'id': 6, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Last name', 'display_name': 'Last name', 'code': 'Last name' }, { 'id': 7, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Birthday', 'display_name': 'Birthday', 'code': 'Birthday' }, { 'id': 8, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Regsitered_date', 'display_name': 'Regsitered_date', 'code': 'Regsitered_date' }, { 'id': 9, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Regsitered_store_name', 'display_name': 'Regsitered_store_name', 'code': 'Regsitered_store_name' }, { 'id': 10, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Registered_employee_name', 'display_name': 'Registered_employee_name', 'code': 'Registered_employee_name' }, { 'id': 11, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Current_tier_name', 'display_name': 'Current_tier_name', 'code': 'Current_tier_name' }, { 'id': 12, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Point_balance', 'display_name': 'Point_balance', 'code': 'Point_balance' }, { 'id': 13, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Coupon_code', 'display_name': 'Coupon_code', 'code': 'Coupon_code' }, { 'id': 14, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Coupon_type', 'display_name': 'Coupon_type', 'code': 'Coupon_type' }, { 'id': 15, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Coupon_amount', 'display_name': 'Coupon_amount', 'code': 'Coupon_amount' }, { 'id': 16, 'create_by': null, 'create_date': null, 'modify_by': null, 'modify_date': null, 'active_flag': 'ACTIVE', 'name': 'Coupon_expiry_date', 'display_name': 'Coupon_expiry_date', 'code': 'Coupon_expiry_date' }]

export const when_options = [
  { value: 1, label: 'instantly', name: 'fc_campaign_trigger_edit_when_timing_menu1_label' },
  { value: 5, label: 'delayed', name: 'fc_campaign_trigger_edit_when_timing_menu2_label' },
  { value: 3, label: 'specific_date', name: 'fc_campaign_trigger_edit_when_timing_menu3_label' }
]

export const who_options = [
  { value: 'everyone', label: 'all_members', name: 'fc_campaign_trigger_edit_who_audience_menu1_label' },
  { value: 'filter', label: 'targeted_members', name: 'fc_campaign_trigger_edit_who_audience_menu2_label' }
]

export const what_options = [
  { value: 'Communication', label: 'communication_only_type', name: 'fc_campaign_trigger_edit_what_reward_menu1_label' },
  { value: 'Coupon', label: 'coupon', name: 'fc_campaign_trigger_edit_what_reward_menu2_label' },
  { value: 'General Points', label: 'points', name: 'fc_campaign_trigger_edit_what_reward_menu3_label' }
]

export const how_options = [
  { value: 'SMS', label: 'SMS' },
  { value: 'EDM', label: 'EDM' }
]

export const coupon_list = [{
  'coupon_name': 'Downgrade Tier',
  'coupon_code': '0d3d78c6',
  'coupon_type_code': 'cash',
  'coupon_type_name': 'Cash coupon',
  'effective_type': 2,
  'relative_unit': null,
  'relative_value': null,
  'active_flag': 1,
  'specific_effective_date_from': '2019-04-04T00:00:00.000+08:00',
  'specific_effective_date_to': '2020-04-22T00:00:00.000+08:00',
  'description': 'Downgrade Tier coupon',
  'amount': 200.0,
  'product_code': null,
  'product_name': null
},
{ 'coupon_name': 'Birthday Greeting',
  'coupon_code': '34343ceere',
  'coupon_type_code':
      'discount',
  'coupon_type_name': 'Discount coupon',
  'effective_type': 2,
  'relative_unit': 1,
  'relative_value': null,
  'active_flag': 1,
  'specific_effective_date_from': '2019-04-04T00:00:00.000+08:00',
  'specific_effective_date_to': '2020-04-22T00:00:00.000+08:00',
  'description': 'Birthday Greeting coupon',
  'amount': 50.0,
  'product_code': null,
  'product_name': null
}, { 'coupon_name': 'Expiring Points',
  'coupon_code': '8597d481c1',
  'coupon_type_code': 'cash',
  'coupon_type_name': 'Cash coupon',
  'effective_type': 2,
  'relative_unit': null,
  'relative_value': null,
  'active_flag': 1,
  'specific_effective_date_from': '2019-04-04T00:00:00.000+08:00',
  'specific_effective_date_to': '2020-04-22T00:00:00.000+08:00',
  'description': 'Expiring Points coupon',
  'amount': 20.0,
  'product_code': null,
  'product_name': null
}, { 'coupon_name': '756756756',
  'coupon_code': 'bdb8fe0cf1',
  'coupon_type_code': 'cash',
  'coupon_type_name': 'Cash coupon',
  'effective_type': 2,
  'relative_unit': 1,
  'relative_value': null,
  'active_flag': 1,
  'specific_effective_date_from': '2019-04-24T00:00:00.000+08:00',
  'specific_effective_date_to': '2019-05-23T23:59:59.999+08:00',
  'description': null,
  'amount': 1.0,
  'product_code': null,
  'product_name': null
}, { 'coupon_name': 'Apple',
  'coupon_code': '57079bcc55',
  'coupon_type_code': 'discount',
  'coupon_type_name': 'Discount coupon',
  'effective_type': 2,
  'relative_unit': 1,
  'relative_value': null,
  'active_flag': 1,
  'specific_effective_date_from': '2019-03-12T00:00:00.000+08:00',
  'specific_effective_date_to': '2019-03-31T23:59:59.999+08:00',
  'description': null,
  'amount': 0.5,
  'product_code': null,
  'product_name': null
}, { 'coupon_name': 'yyx2019-03-11',
  'coupon_code': '81d6e7801c',
  'coupon_type_code': 'cash',
  'coupon_type_name': 'Cash coupon',
  'effective_type': 2,
  'relative_unit': 1,
  'relative_value': 1,
  'active_flag': 1,
  'specific_effective_date_from': '2019-03-21T00:00:00.000+08:00',
  'specific_effective_date_to': '2019-04-27T23:59:59.999+08:00',
  'description': 'yyx 2019-03-11 test',
  'amount': 1000.0,
  'product_code': null,
  'product_name': null
}]

export const trigger_detail = { 'campaign_wizard_id': 208, 'trigger_id': 18, 'name': 'Expiring coupons', 'code': 'Expiring coupons', 'status': 'SAVE', 'when_definition': { 'code': 'Expiring coupons', 'name': 'Expiring coupons', 'type': 1, 'delay_value': 0, 'exec_date': '10' }, 'who_definition_list': [{ 'name': 'Expiring coupons', 'code': 'Expiring coupons', 'select_type': 'filter', 'target_criteria': [{ 'criteria_field_code': 'tiers', 'criteria_field_name': 'tiers', 'criteria_code': 'Silver,Gold', 'criteria_value': 'Silver,Gold' }, { 'criteria_field_code': 'age_from', 'criteria_field_name': 'age', 'criteria_code': 21, 'criteria_value': 21 }, { 'criteria_field_code': 'age_to', 'criteria_field_name': 'age', 'criteria_code': 51, 'criteria_value': 51 }, { 'criteria_field_code': 'birthday_from', 'criteria_field_name': 'birthday', 'criteria_code': '0501', 'criteria_value': '0501' }, { 'criteria_field_code': 'birthday_to', 'criteria_field_name': 'birthday', 'criteria_code': '0515', 'criteria_value': '0515' }, { 'criteria_field_code': 'join_date_from', 'criteria_field_name': 'join_date', 'criteria_code': '01-05-2019', 'criteria_value': '01-05-2019' }, { 'criteria_field_code': 'join_date_to', 'criteria_field_name': 'join_date', 'criteria_code': '15-05-2019', 'criteria_value': '15-05-2019' }, { 'criteria_field_code': 'register_store', 'criteria_field_name': 'register_store', 'criteria_code': 'testStoreCode21190319001,preferredStoreCode,testStoreCode20190319001,testStoreCode20190319002', 'criteria_value': 'testStoreName20190319001,preferredStoreName,testStoreName20190319001,testStoreName20190319002' }, { 'criteria_field_code': 'register_channel', 'criteria_field_name': 'register_channel', 'criteria_code': 'default,EC,WeChat,POS', 'criteria_value': 'default,ecommerce,WeChat,POS' }, { 'criteria_field_code': 'lastest_purchase_date_from', 'criteria_field_name': 'lastest_purchase_date', 'criteria_code': '01-05-2019', 'criteria_value': '01-05-2019' }, { 'criteria_field_code': 'lastest_purchase_date_to', 'criteria_field_name': 'lastest_purchase_date', 'criteria_code': '22-05-2019', 'criteria_value': '22-05-2019' }, { 'criteria_field_code': 'average_basket_from', 'criteria_field_name': 'average_basket', 'criteria_code': 50, 'criteria_value': 50 }, { 'criteria_field_code': 'average_basket_to', 'criteria_field_name': 'average_basket', 'criteria_code': 500, 'criteria_value': 500 }, { 'criteria_field_code': 'average_items_from', 'criteria_field_name': 'average_item', 'criteria_code': 50, 'criteria_value': 50 }, { 'criteria_field_code': 'average_items_to', 'criteria_field_name': 'average_item', 'criteria_code': 100, 'criteria_value': 100 }, { 'criteria_field_code': 'purchased_product', 'criteria_field_name': 'purchased_product', 'criteria_code': '', 'criteria_value': '' }, { 'criteria_field_code': 'purchased_brand', 'criteria_field_name': 'purchased_brand', 'criteria_code': '', 'criteria_value': '' }, { 'criteria_field_code': 'purchased_category', 'criteria_field_name': 'purchased_category', 'criteria_code': '', 'criteria_value': '' }, { 'criteria_field_code': 'available_point_from', 'criteria_field_name': 'available_point', 'criteria_code': 500, 'criteria_value': 500 }, { 'criteria_field_code': 'available_point_to', 'criteria_field_name': 'available_point', 'criteria_code': 1000, 'criteria_value': 1000 }, { 'criteria_field_code': 'campaign_respondent', 'criteria_field_name': 'campaign_respondent', 'criteria_code': '', 'criteria_value': '' }] }], 'what_reward_definition_list': [{ 'code': 'Expiring coupons', 'max_points': '', 'multi_coefficient': '', 'points': 5, 'coupon_code': '57079bcc55', 'purchase_amount_restriction_from': '', 'purchase_amount_restriction_to': '', 'times': '', 'product_list': [], 'kind': 'Coupon' }], 'communication_definition_list': { 'code': 'Expiring coupons', 'name': 'Expiring coupons', 'kind': 'SMS', 'communication_channel_code': 'SMS', 'communication_template_id': 51, 'content': '今天是{Regsitered_date}，您的注册日期。12' }}
