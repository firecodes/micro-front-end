// campaign targets by tags
export const byTags = [
  {
    segmentation_type_code: "age_group",
    segmentation_type_name: "age group",
    list: [
      { segmentation_value_name: "<18", segmentation_value_code: "<18" },
      { segmentation_value_name: "18-25", segmentation_value_code: "18-25" },
      { segmentation_value_name: "25-35", segmentation_value_code: "25-35" },
      { segmentation_value_name: "35-45", segmentation_value_code: "35-45" },
      { segmentation_value_name: "45-55", segmentation_value_code: "45-55" },
      { segmentation_value_name: "55-65", segmentation_value_code: "55-65" },
      { segmentation_value_name: ">65", segmentation_value_code: ">65" }
    ]
  },
  {
    segmentation_type_code: "lapsed_member_alert",
    segmentation_type_name: "lapsed member alert",
    list: [
      { segmentation_value_name: "lapsed", segmentation_value_code: "lapsed" },
      { segmentation_value_name: "yellow", segmentation_value_code: "yellow" },
      { segmentation_value_name: "red", segmentation_value_code: "red" }
    ]
  },
  {
    segmentation_type_code: "new_member_after_register",
    segmentation_type_name: "new member after register",
    list: [
      {
        segmentation_value_name: "no purchase",
        segmentation_value_code: "no_purchase"
      },
      {
        segmentation_value_name: "only 1 time purchase",
        segmentation_value_code: "only_1_time_purchase"
      },
      {
        segmentation_value_name: "purchase more than 2 times",
        segmentation_value_code: "purchase_more_than_2_times"
      }
    ]
  },
  {
    segmentation_type_code: "purchase_frequency",
    segmentation_type_name: "purchase frequency in current year",
    list: [
      { segmentation_value_name: "none", segmentation_value_code: "none" },
      {
        segmentation_value_name: "1 times",
        segmentation_value_code: "1_times"
      },
      {
        segmentation_value_name: "2 times",
        segmentation_value_code: "2_times"
      },
      {
        segmentation_value_name: "3-6 times",
        segmentation_value_code: "3_6_times"
      },
      {
        segmentation_value_name: "above 6 times",
        segmentation_value_code: "above_6_times"
      }
    ]
  },
  {
    segmentation_type_code: "lastest_purchase_date",
    segmentation_type_name: "lastest purchase date",
    list: [
      {
        segmentation_value_name: "with 1 month",
        segmentation_value_code: "within_1_month"
      },
      {
        segmentation_value_name: "1-3 month",
        segmentation_value_code: "1_3_month"
      },
      {
        segmentation_value_name: "4-6 month",
        segmentation_value_code: "4_6_month"
      },
      {
        segmentation_value_name: "6-12 month",
        segmentation_value_code: "6_12_month"
      },
      {
        segmentation_value_name: "more than 1 year",
        segmentation_value_code: "more_than_1_year"
      }
    ]
  },
  {
    segmentation_type_code: "coupon_perference",
    segmentation_type_name: "coupon perference",
    list: [
      { segmentation_value_name: "cash", segmentation_value_code: "cash" },
      {
        segmentation_value_name: "discount",
        segmentation_value_code: "discount"
      },
      { segmentation_value_name: "GWP", segmentation_value_code: "GWP" }
    ]
  }
];
// campaign targets by profile
export const by_profile = [
  {
    criteria_group: "profile",
    criteria_field: [
      {
        criteria_field_name: "tiers",
        criteria_field_code: "tiers"
      },
      {
        criteria_field_name: "age",
        criteria_field_code: "age"
      },
      {
        criteria_field_name: "birthday",
        criteria_field_code: "birthday"
      },
      {
        criteria_field_name: "join date",
        criteria_field_code: "join_date"
      },
      {
        criteria_field_name: "registration store",
        criteria_field_code: "register_store"
      },
      {
        criteria_field_name: "registration channel",
        criteria_field_code: "register_channel"
      }
    ]
  },
  {
    criteria_group: "transaction",
    criteria_field: [
      {
        criteria_field_name: "latest purchase",
        criteria_field_code: "lastest_purchase_date"
      },
      {
        criteria_field_name: "average basket",
        criteria_field_code: "average_basket"
      },
      {
        criteria_field_name: "average basket size",
        criteria_field_code: "average_basket_size"
      },
      {
        criteria_field_name: "purchased product",
        criteria_field_code: "purchased_product"
      },
      {
        criteria_field_name: "purchased brand",
        criteria_field_code: "purchased_brand"
      },
      {
        criteria_field_name: "purchased category",
        criteria_field_code: "purchased_category"
      }
    ]
  },
  {
    criteria_group: "point",
    criteria_field: [
      {
        criteria_field_name: "available point",
        criteria_field_code: "available_point"
      },
      {
        criteria_field_name: "campaign respondent",
        criteria_field_code: "campaign_respondent"
      }
    ]
  }
];
