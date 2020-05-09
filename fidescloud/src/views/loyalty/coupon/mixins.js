// delete
import { batchDeleteCoupon } from '@/api/loyalty'
export const deleteCategoryMixin = {
  data() {
    return {
      delete: {
        loading: false,
        params: {}
      }
    }
  },
  methods: {
    deleteCoupon() {
      this.$confirm(this.$t('loyalty.fc_coupon_delete_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
        cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
        confirmButtonClass: 'new_confirm_confirm',
        cancelButtonClass: 'new_confirm_cancel'
      }).then(() => {
        // success
        this.handleDelete()
      }).catch(() => {
        // cancel
      })
    },
    handleDelete() {
      this.delete.loading = true
      batchDeleteCoupon(this.delete.params).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('configuration.fc_operation_feedback_notification_label')
        })
        this.getList()
        this.delete.loading = false
      }).catch(res => {
        this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
      })
    },
    // 一行的删除
    lineDeleteCoupon(row) {
      this.delete.params = {
        codes: [row.coupon_code]
      }
      this.deleteCoupon()
    },
    // 选择多行的删除
    selectMultipleLinesDeleteCoupon(row) {
      this.delete.params = {
        codes: []
      }
      row.forEach(item => {
        this.delete.params.codes.push(item.coupon_code)
      })
      this.deleteCoupon()
    }
  }
}
