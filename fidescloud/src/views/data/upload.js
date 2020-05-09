/**
 * 所有上传
 * 2020/01/13
 * */
import { uploadImage, uploadFileNew } from '@/api/master'
export const uploadMixin = {
  methods: {
    handleUpload(file, poject, module = 'fides') {
      return new Promise((resolve, reject) => {
        var formData = new FormData()
        formData.append('file', file)
        formData.append('project', poject)
        formData.append('module', module)
        uploadImage(formData).then(res => {
          resolve(res.return_result.url[0])
          this.$message.success('Success')
        }).catch(() => {
          this.$message.error('Upload fail')
          reject()
        })
      })
    },
    handleUploadFile(file, poject, module = 'fides') {
      return new Promise((resolve, reject) => {
        var formData = new FormData()
        formData.append('file', file)
        formData.append('project', poject)
        formData.append('module', module)
        uploadFileNew(formData).then(res => {
          resolve(res.return_result.url)
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
        }).catch(() => {
          this.$message.error(this.$t('configuration.fc_campaign_spot_create_who_upload_failed_label'))
          reject()
        })
      })
    }
  }
}
