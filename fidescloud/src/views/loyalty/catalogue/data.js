export const redemption_status_list = [{ name: 'fc_redemption_coupon_advanced_status_1st_label', value: 1 }, { name: 'fc_redemption_coupon_advanced_status_2nd_label', value: 2 }, { name: 'fc_redemption_coupon_advanced_status_3rd_label', value: 0 }]
export const coupon_type_list = [{ name: 'fc_redemption_coupon_advanced_type_1st_label', value: 'cash' }, { name: 'fc_redemption_coupon_advanced_type_2nd_label', value: 'discount' }, { name: 'fc_redemption_coupon_advanced_type_3rd_label', value: 'gwp' }]
export const activate_list = [{ name: 'Disable', value: 0 }, { name: 'Enable', value: 1 }]
export const redemption_state_mixin = {
  methods: {
    handleRedemptionStatus(state, value) {
      if (state === 0) {
        return 'Inactive'
      } else if (state === 1) {
        return 'Active'
      } else if (state === 2) {
        return 'Planned'
      }
    },
    handleCouponStatus(state, effective_type, value) {
      if (state === 0) {
        return 'Deleted'
      } else if (effective_type === 1 && state === 1) {
        return 'Available'
      } else if (effective_type === 2 && state === 1 && effective_type !== null) {
        // 当前时间 与 过期时间比较
        var start_time = new Date().getTime()
        var end_time = new Date(value).getTime()
        return start_time > end_time ? 'Expired' : 'Available'
      } else {
        return 'Expired'
      }
    },
    handleGiftStatus(state, value, is_limited_inventory) {
      if (state === 0) {
        return 'Deleted'
      } else if ((value <= 0 || value === null) && !is_limited_inventory) {
        return 'Out of stock'
      } else {
        return 'Available'
      }
    }
  }
}
