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
      this.$confirm('Are you sure you want to delete this gift? <br /> This operation may affect your redemption catalogue and ongoing campaigns ', 'Please confirm', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
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
        this.$message({
          type: 'success',
          message: 'Success!'
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
