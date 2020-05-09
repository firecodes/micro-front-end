/**
 * operation
 *  2020/01/10
 */
import { deleteTemplate } from '@/api/campaign'

export const operationMixin = {
  methods: {
    // 删除模板
    handleDeleteTemplate(obj) {
      return new Promise((resolve, reject) => {
        this.$confirm('Are you sure you want to delete this template?', 'Please confirm', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          deleteTemplate(obj).then(res => {
            this.$message.success('Success')
            resolve()
          }).catch(res => {
            this.$message.error('Fail')
            reject()
          })
        }).catch(() => {
          reject()
        })
      })
    }
  }
}
