<!--
  recurring campaign detail
  2020/02/24
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
      <!--Test-->
      <!--<el-button class="test">Test</el-button>-->
      <!--Ask for approval-->
      <!--<el-button class="ask_for_approval">Ask for approval</el-button>-->
      <!--Launch-->
      <!--1 draft 2 ongoing 3 past 4 schedule-->
      <!--launch-->
      <el-button :loading="loading" @click="handleRelease" class="button" v-if="campaign_wizard_status === 1">{{$t('campaign.fc_campaign_spot_btn_launch_label')}}</el-button>
      <!--stop this campaign-->
      <el-button :loading="loading" @click="handleDisable" class="stop" v-else-if="campaign_wizard_status === 2">{{$t('campaign.fc_campaign_spot_btn_stop_campaign_label')}}</el-button>
      <!--cancel this campaign-->
      <el-button :loading="loading" @click="handleDisable" class="cancel" v-else-if="campaign_wizard_status === 4">{{$t('campaign.fc_campaign_spot_btn_cancel_campaign_label')}}</el-button>
    </div>
    <div class="modify-campaign">
       <ed-dialog>
         <!--Modify campaign-->
        <el-dialog :title="$t('campaign.fc_campaign_spot_modify_title_label')" :visible.sync="dialog" @close="clear()" center class="dialog" width="700px">
          <ed-form>
            <el-form :model="form" :rules="rules" label-position="left" label-width="170px" ref="campaign_info">
              <!--Campaign name-->
              <el-form-item :label="$t('campaign.fc_campaign_spot_modify_name_label')" prop = 'campaign_name'>
                <el-input maxlength="64" v-model="form.campaign_name"></el-input>
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
              <div style="text-align: center">
                <el-button :loading="confirm_loading" @click="saveCampaignInfo" class="confirm-button" type="primary">{{$t('campaign.fc_campaign_spot_modify_btn_confirm_label')}}</el-button>
              </div>
            </el-form>
          </ed-form>
        </el-dialog>
      </ed-dialog>
    </div>
  </div>
</template>
<script>
  import { addOrUpdateCampaignInfo } from '@/api/campaign'
  import { submitCampaign, disableCampaign } from '@/api/campaign'
  export default {
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
      }
    },
    data() {
      return {
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
              this.$emit('handleRefer')
            }).catch(() => {
              this.$message.error('Fail')
              this.confirm_loading = false
            })
          }
        })
      },
      handleRelease() {
        this.loading = true
        submitCampaign({ compaign_wizard_id: parseInt(this.id) }).then(res => {
          this.loading = false
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.$router.push('/campaign/campaign-setting')
        }).catch(_ => {
          this.loading = false
          this.$message.error('Fail')
        })
      },
      handleDisable() {
        disableCampaign({ campaign_wizard_id: parseInt(this.id) }).then(res => {
          this.loading = false
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.$router.push('/campaign/campaign-setting')
        }).catch(res => {
          this.loading = false
          this.$message.error('Fail')
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
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
