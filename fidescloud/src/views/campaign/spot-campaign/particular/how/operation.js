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
        this.$confirm(this.$t('campaign.fc_campaign_template_delete_content_label'), this.$t('campaign.fc_operation_confirm_title_label'), {
          confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
          cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          deleteTemplate(obj).then(res => {
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            resolve()
          }).catch(res => {
            this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
            reject()
          })
        }).catch(() => {
          reject()
        })
      })
    }
  }
}
