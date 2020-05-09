// delete
import { batchDeleteGift } from '@/api/loyalty'
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
    deleteGift() {
      this.$confirm(this.$t('loyalty.fc_gift_delete_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
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
      batchDeleteGift(this.delete.params).then(res => {
        var _this = this
        this.$message({
          type: 'success',
          message: _this.$t('loyalty.fc_gift_delete_notification_label')
        })
        this.getList()
        this.delete.loading = false
      }).catch(res => {
        this.$message.error(res)
      })
    },
    // 一行的删除
    lineDeleteGift(row) {
      this.delete.params = {
        gift_codes: [row.gift_code]
      }
      this.deleteGift()
    },
    // 选择多行的删除
    selectMultipleLinesDeleteGift(row) {
      this.delete.params = {
        gift_codes: []
      }
      row.forEach(item => {
        this.delete.params.gift_codes.push(item.gift_code)
      })
      this.deleteGift()
    }
  }
}
