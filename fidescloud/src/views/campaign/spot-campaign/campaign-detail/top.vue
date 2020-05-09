<!--
  spot campaign detail
  2020/01/07
-->
<template>
  <div class="spot_campaign_detail_sub_top">
    <svg-icon class="logo" icon-class="spot-campaign-logo" />
    <!--campaign name-->
    <h1>{{info.campaign_name || table_placeholder}}</h1>
    <!--edit button-->
    <div @click="dialog = true" class="cursor-pointer">
      <svg-icon class="i" icon-class="spot-campaign-detail-modify" v-if="campaign_wizard_status === 1" />
    </div>
    <div class="operation_button">
      <!--Ask for approval-->
      <!--<el-button class="ask_for_approval">Ask for approval</el-button>-->
      <!--Launch-->
      <!--1 draft 2 ongoing 3 past 4 schedule- -->
      <template v-if="campaign_wizard_status === 1">
        <!--Test campaign-->
        <el-button @click="handleClickTestCampaign" class="test">{{$t('campaign.fc_campaign_spot_btn_test_label')}}</el-button>
        <!--launch-->
        <el-button :loading="loading" @click="handleRelease" class="button" v-if="campaign_wizard_status === 1">{{$t('campaign.fc_campaign_spot_btn_launch_label')}}</el-button>
      </template>
      <!--stop this campaign-->
      <el-button :loading="loading" @click="handleDisable" class="stop" v-else-if="campaign_wizard_status === 2">{{$t('campaign.fc_campaign_spot_btn_stop_campaign_label')}}</el-button>
      <!--cancel this campaign-->
      <el-button :loading="loading" @click="handleDisable" class="cancel" v-else-if="campaign_wizard_status === 4">{{$t('campaign.fc_campaign_spot_btn_cancel_campaign_label')}}</el-button>
    </div>
    <!--modify campaign-->
    <div class="modify-campaign">
      <ed-dialog>
        <!--Modify campaign-->
        <el-dialog :title="$t('campaign.fc_campaign_spot_modify_title_label')" :visible.sync="dialog" @close="clear()" center class="dialog" width="700px">
          <ed-form>
            <el-form :model="form" :rules="rules" label-position="left" label-width="170px" ref="campaign_info">
              <!--Campaign name-->
              <el-form-item :label="$t('campaign.fc_campaign_spot_modify_name_label')" prop = 'campaign_name'>
                <el-input maxlength="64" v-model="form.campaign_name" />
              </el-form-item>
              <!--Campaign description-->
              <el-form-item :label="$t('campaign.fc_campaign_spot_modify_desc_label')" prop = 'campaign_description'>
                <el-input
                  :rows="10"
                  maxlength="400"
                  type="textarea"
                  v-model="form.campaign_description">
                </el-input>
              </el-form-item>
              <!--Confirm-->
              <div style="text-align: center;">
                <el-button :loading="confirm_loading" @click="saveCampaignInfo" class="confirm-button" type="primary">{{$t('campaign.fc_campaign_spot_modify_btn_confirm_label')}}</el-button>
              </div>
            </el-form>
          </ed-form>
        </el-dialog>
      </ed-dialog>
    </div>
    <!--show test campaign dialog-->
    <test-campaign-dialog-component :communication_channels="communication_channels" :id="id" :test_dialog="test_dialog" @handleClickTestDialog="handleClickTestDialog" @refreshTestList="refreshTestList" />
  </div>
</template>
<script>
  import TestCampaignDialogComponent from './test-campaign-dialog'
  import { addOrUpdateCampaignInfo } from '@/api/campaign'
  import { submitCampaign, disableCampaign } from '@/api/campaign'
  export default {
    components: {
      TestCampaignDialogComponent
    },
    props: {
      campaign_wizard_status: {
        type: Number | String,
        default: null
      },
      info: {
        type: Object | String
      },
      id: {
        type: Number | String
      },
      communication_info: {
        type: Object
      },
      communication_channels: {
        type: Object
      }
    },
    data() {
      return {
        test_dialog: false,
        rules: {
          campaign_name: [{ required: true, message: 'Campaign name can not be empty!', trigger: 'change' }]
        },
        loading: false,
        dialog: false,
        form: {
          compaign_wizard_id: '',
          campaign_type_code: '',
          campaign_name: '',
          campaign_description: ''
        },
        confirm_loading: false
      }
    },
    created() {
      this.form = {
        compaign_wizard_id: this.id,
        campaign_type_code: this.info.campaign_type_code,
        campaign_name: this.info.campaign_name,
        campaign_description: this.info.campaign_description
      }
    },
    methods: {
      refreshTestList(val) {
        this.$emit('refreshTestList', val)
      },
      handleClickTestDialog(value) {
        this.test_dialog = value
      },
      handleClickTestCampaign() {
        // 验证条件（选择了EDM或者SMS）
        if (!this.communication_info || !this.communication_info.content) {
          this.$message.error(this.$t('campaign.fc_campaign_test_error_tips'))
          return true
        }
        // 弹出选择框
        this.test_dialog = true
      },
      clear() {
        this.$refs['campaign_info'].clearValidate()
      },
      saveCampaignInfo() {
        this.$refs['campaign_info'].validate((valid) => {
          if (valid) {
            this.confirm_loading = true
            addOrUpdateCampaignInfo(this.form).then(() => {
              this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
              this.confirm_loading = false
              this.dialog = false
              this.$emit('handleRefer')
            }).catch(() => {
              this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
              this.confirm_loading = false
            })
          }
        })
      },
      handleRelease() {
        // 如果是launch
        const campaign_type = (this.info || this.info.campaign_type) ? this.info.campaign_type.toLowerCase() : ''
        // 验证条件（选择了EDM或者SMS）
        if (campaign_type.indexOf('communication') > -1 && (!this.communication_info || !this.communication_info.content)) {
          this.$message.error(this.$t('campaign.fc_campaign_test_how_not_set_tips'))
          return true
        }
        this.loading = true
        submitCampaign({ compaign_wizard_id: parseInt(this.id) }).then(() => {
          this.loading = false
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.$router.push('/campaign/campaign-setting')
        }).catch(_ => {
          this.loading = false
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
        })
      },
      handleDisable() {
        disableCampaign({ campaign_wizard_id: parseInt(this.id) }).then(() => {
          this.loading = false
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.$router.push('/campaign/campaign-setting')
        }).catch(() => {
          this.loading = false
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spot_campaign_detail_sub_top{
    width: 100%;
    height: 60px;
    background: rgba(255,255,255,1);
    display: flex;
    align-items: center;
    position: relative;
    .logo{
      font-size: 20px;
      margin: 0 16px;
      color: $new-primary;
    }
    .modify-campaign{
      .confirm-button{
        min-width:88px;
        height:36px;
        background: $new-primary;
        border-color: $new-primary;
        text-align: center;
      }
    }
    h1{
      font-size:18px;
      font-family: HelveticaNeue1-Bold;
      font-weight:bold;
      color: rgba(51,51,51,1);
      margin-right: 8px;
    }
    .i{
      font-size: 14px;
      color: rgba(51,51,51,1);
    }
    .operation_button{
      position: absolute;
      right: 50px;
      .el-button{
        min-width: 88px;
        border-color: $new-primary;
      }
      .test, .ask_for_approval, .stop, .cancel {
        background-color: #ffffff;
        color: $new-primary;
      }
      .button{
        background-color: $new-primary;
        color: #ffffff;
      }
    }
  }
</style>
