<!--活动发布测试消息-->
<template>
  <div class="send-test-message">
    <el-form ref="form" :model="form" style="display: flex; height: 36px;" :rules="rules">
      <el-form-item label=" " v-if="channel_type === '1'" prop="mobile_phone">
        <el-input :placeholder="$t('campaign.fc_campaign_lifecycle_edit_how_sms_mobile_label')" v-model="form.mobile_phone" />
      </el-form-item>
      <el-form-item label=" " prop="email" v-else>
        <el-input :placeholder="$t('campaign.fc_campaign_lifecycle_edit_how_edm_email_label')" v-model="form.email" />
      </el-form-item>
      <el-button :loading="send_test_message_statue" @click="send_test" style="margin-left:5px; min-width: 80px;" type="primary">{{$t('campaign.fc_campaign_lifecycle_edit_how_edm_send_label')}}</el-button>
    </el-form>
  </div>
</template>
<script>
  import { sendCommunication } from '@/api/campaign'
  import { RegExp } from '@/utils/RegExp'
  export default {
    props: {
      channel_type: {
        type: String,
        default: '1'
      },
      content: {
        type: String,
        default: ''
      },
      email_subject: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        form: {
          mobile_phone: '',
          email: ''
        },
        send_test_message_statue: false,
        rules: {
          mobile_phone: [{ validator: this.checkIsMobilePhone, trigger: 'blur' }],
          email: [{ validator: this.checkIsEmail, trigger: 'blur' }]
        }
      }
    },
    watch: {
      channel_type: {
        handler() {
          this.$refs['form'].clearValidate()
        }
      }
    },
    methods: {
      checkIsMobilePhone(rule, value, callback) {
        // 验证非空 验证手机格式
        if (!value) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        } else {
          this.globalData.validateMobile(value) ? callback() : callback(new Error(this.handleGlobalI18n('validation', 'mobile_error')))
        }
      },
      checkIsEmail(rule, value, callback) {
        // 验证非空 验证邮件格式
        if (!value) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        } else if (!RegExp.email.test(value)) {
          callback(new Error(this.$t('validation.email_error')))
        } else {
          callback()
        }
      },
      send_test() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.content === '') {
              this.$message({
                message: 'Please select the message content',
                type: 'warning'
              })
              return false
            }
            this.send_test_message_statue = true
            var obj = { channel_type: parseInt(this.channel_type), content: this.content, mobile_phone: this.form.mobile_phone, email_subject: '', email: this.form.email }
            if (this.channel_type === '2') {
              obj.email_subject = this.email_subject
            }
            sendCommunication(obj).then(res => {
              this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
              this.send_test_message_statue = false
            }).catch(_ => {
              this.send_test_message_statue = false
            })
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
