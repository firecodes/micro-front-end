<!--create campaign-->
<template>
  <div class="create-campaign">
    <el-button @click="dialog = true" class="create_button" type="primary">{{$t('campaign.fc_campaign_spot_btn_creat_label')}}</el-button>
    <ed-dialog>
      <el-dialog :title="$t('campaign.fc_campaign_spot_create_title')" :visible.sync="dialog" @close="clear()" center class="dialog" width="700px">
        <ed-form>
          <el-form :model="form" :rules="rules" label-position="left" label-width="170px" ref="campaign_info">
            <!--Campaign name-->
            <el-form-item :label="$t('campaign.fc_campaign_spot_create_name_label')" prop = 'campaign_name'>
              <el-input maxlength="64" v-model="form.campaign_name" />
            </el-form-item>
            <!--Campaign description-->
            <el-form-item :label="$t('campaign.fc_campaign_spot_create_desc_label')" prop = 'campaign_description'>
              <el-input
                :rows="10"
                maxlength="400"
                type="textarea"
                v-model="form.campaign_description">
              </el-input>
            </el-form-item>
            <!--Confirm-->
            <div style="text-align: center">
              <el-button :loading="confirm_loading" @click="saveCampaignInfo" class="confirm-button" type="primary">{{$t('campaign.fc_campaign_spot_create_btn_next_label')}}</el-button>
            </div>
          </el-form>
        </ed-form>
      </el-dialog>
    </ed-dialog>
  </div>
</template>
<script>
  import { addOrUpdateCampaignInfo } from '@/api/campaign'
  import { operationMixin } from './operation'
  export default {
    mixins: [operationMixin],
    data() {
      return {
        rules: {
          campaign_name: [{ required: true, message: 'Campaign name can not be empty!', trigger: 'change' }]
        },
        dialog: false,
        confirm_loading: false,
        form: {
          campaign_name: '',
          campaign_description: '',
          campaign_type_code: '1'
        }
      }
    },
    methods: {
      clear() {
        this.$refs['campaign_info'].clearValidate()
      },
      saveCampaignInfo() {
        this.$refs['campaign_info'].validate((valid) => {
          if (valid) {
            this.confirm_loading = true
            addOrUpdateCampaignInfo(this.form).then(res => {
              this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
              this.confirm_loading = false
              this.dialog = false
              // 跳转到编辑页面
              this.editRouter(res.return_result.compaign_wizard_id)
            }).catch(() => {
              this.$message.error('Fail')
              this.confirm_loading = false
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .create-campaign{
    .confirm-button{
      min-width:88px;
      height:36px;
      text-align: center;
    }
  }
</style>

