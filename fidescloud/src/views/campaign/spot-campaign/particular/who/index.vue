<template>
  <div class="spot_campaign__who">
    <ed-form>
      <el-form :model="form" :rules="rules" label-position="left" label-width="280px" ref="when">
        <!--Select the audience-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_who_audience_label')">
          <el-select v-model="form.target_type">
            <el-option :key="item.value" :label="$t(`campaign.${item.label}`)" :value="item.value" v-for="item in audience_list" />
          </el-select>
        </el-form-item>
        <component :campaign_wizard_id="campaign_wizard_id" :is="handleComponent()" :ref="handleComponent()" :target="target" v-if="form.target_type !== '4'"/>
        <!--Estimated audience-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_who_estimated_label')">
          <div class="calculate">
            <el-input :disabled="true" v-model="estimated_audience" />
            <!--Calculate-->
            <el-button :loading="calc_loading" @click="handleCalc" type="primary">{{$t('campaign.fc_campaign_spot_create_who_calculate_label')}}</el-button>
          </div>
        </el-form-item>
        <!--Control group-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_who_control_label')" v-if="form.target_type !== '4'">
          <div class="control_group">
            <el-input-number :max="100" :min="0" :precision="2" v-model="form.control_group" />
            <!--%-->
            <label>{{$t('campaign.fc_campaign_spot_create_who_percent_label')}}</label>
          </div>
          <div class="hint">
            <svg-icon icon-class="info" />
            <label>{{$t('campaign.fc_campaign_spot_create_who_control_tips_label', { '0': (form.control_group ? form.control_group.toFixed(2) : 0) })}}</label>
          </div>
        </el-form-item>
      </el-form>
    </ed-form>
  </div>
</template>
<script>
  import { spotCampaignWhoCalcMixin } from './calc'
  import { addOrUpdateCampaignTarget } from '@/api/campaign'
  import MemberGroups from './member-groups'
  import TargetedMember from './targeted-members'
  import TaggedMembers from './tagged-members'
  import UploadMembers from './upload-members'
  export default {
    components: {
      MemberGroups,
      TargetedMember,
      TaggedMembers,
      UploadMembers
    },
    mixins: [spotCampaignWhoCalcMixin],
    props: {
      form_data: {
        type: Object
      },
      campaign_wizard_id: {
        type: String | Number
      }
    },
    watch: {
      'form.target_type': {
        handler() {
          this.estimated_audience = null
        }
      },
      'form_data': {
        handler() {
          this.init()
        }
      }
    },
    data() {
      return {
        calc_loading: false,
        estimated_audience: null,
        /*
        * 4 All members
        * 1 Targeted members
        * 5 Tagged members
        * 6 Member groups
        * 3 Upload members
        * */
        audience_list: [{ label: 'fc_campaign_spot_create_who_audience_menu1_label', value: '4' }, { label: 'fc_campaign_spot_create_who_audience_menu2_label', value: '1' }, { label: 'fc_campaign_spot_create_who_audience_menu3_label', value: '5' }, { label: 'fc_campaign_spot_create_who_audience_menu4_label', value: '6' }, { label: 'fc_campaign_spot_create_who_audience_menu5_label', value: '3' }],
        form: {
          target_type: '4',
          notification_date: '',
          campaign_period: '',
          is_limited_date: false,
          control_group: 0
        },
        target: null,
        rules: {}
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        // 初始化 target_type
        this.form.target_type = this.form_data.target_type ? this.form_data.target_type : '4'
        // 初始化 Targeted members
        this.target = this.form_data.target ? JSON.parse(this.form_data.target) : null
        if (this.target === null) {
          return true
        }
        //  初始化 control_group
        this.form.control_group = 100 - parseFloat(this.target.control_group)
      },
      // 点击计算
      handleCalc() {
        this.calc_loading = true
        var params = {
          target_code: null,
          campaign_id: parseInt(this.campaign_wizard_id),
          kpi_flag: 0,
          import_file_name: null,
          tags_content: null,
          criteria_values: null,
          target_type: this.form.target_type
        }
        var obj = {}
        switch (this.form.target_type) {
          // member group
          case '6':
            obj = {
              tags_content: this.$refs['MemberGroups'].handleSelectGroupIds()
            }
            break
          // Targeted members
          case '1':
            obj = this.$refs['TargetedMember'].handleParentGetCalcValue()
            break
          // Upload file
          case '3':
            obj = this.$refs['UploadMembers'].handleCalcParams()
            break
          // Tagged members
          case '5':
            obj = {
              tags_content: this.$refs['TaggedMembers'].handleSelectTaggedMembers()
            }
            break
          default:
        }
        if (!obj) {
          this.calc_loading = false
          return true
        }
        this.calcTargetMemberOrMemberGroupOrTaggedMembers(Object.assign({}, params, obj)).then(res => {
          this.calc_loading = false
          this.estimated_audience = res.calc_value
        }).catch(res => {
          this.calc_loading = false
          this.$message.error(res)
        })
      },
      // 处理显示组件
      handleComponent() {
        if (this.form.target_type === '6') {
          // member group
          return 'MemberGroups'
        } else if (this.form.target_type === '1') {
          // targeted member
          return 'TargetedMember'
        } else if (this.form.target_type === '5') {
          // Tagged members
          return 'TaggedMembers'
        } else if (this.form.target_type === '3') {
          // Upload members
          return 'UploadMembers'
        }
      },
      // 保存数据
      saveData() {
        var obj = {
          compaign_wizard_id: this.campaign_wizard_id,
          target_type: this.form.target_type,
          kpi_flag: 0,
          import_reference_no: null,
          import_file_name: null,
          control_group: 100 - parseFloat(this.form.control_group),
          target_content: null,
          target_profiles: null,
          tags_content: null
        }
        var c_obj = {}
        // Targeted members
        if (this.form.target_type === '1') {
          c_obj = this.$refs['TargetedMember'].handleSaveValue()
        } else if (this.form.target_type === '4') {
          // All members
          c_obj = {
            control_group: 100
          }
        } else if (this.form.target_type === '3') {
          c_obj = this.$refs['UploadMembers'].handleSaveValue()
        } else if (this.form.target_type === '6') {
          c_obj = {
            tags_content: this.$refs['MemberGroups'].handleSelectGroupIds()
          }
        } else if (this.form.target_type === '5') {
          c_obj = {
            tags_content: this.$refs['TaggedMembers'].handleSelectTaggedMembers()
          }
        }
        // 为了处理Upload members 没有上传数据----临时处理（正确还是promise）
        if (!c_obj) {
          return Promise.reject()
        }
        return new Promise((resolve, reject) => {
          addOrUpdateCampaignTarget(Object.assign({}, obj, c_obj)).then(() => {
            // 清除定时器
            clearInterval(this.timer)
            this.calc_loading = false
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            resolve()
          }).catch(res => {
            this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
            reject()
          })
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spot_campaign__who{
    padding: 0 20px;
    /deep/ .el-form-item{
      margin-bottom: 0;
      line-height: 66px;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(230,230,230,1);
      }
    }
    /deep/ .ed-form .el-form-item__label {
      line-height: 66px;
    }
    /deep/ .el-form-item__content {
      margin-top: 15px;
    }
    .calculate{
      .el-input{
        width: 95px;
      }
      /deep/ .el-input.is-disabled .el-input__inner{
        text-align: center;
        background-color: #ffffff;
        color: #333333;
      }
      .el-button{
        margin-left: 6px;
        background-color: $new-primary;
        border-color: $new-primary;
      }
    }
    .specific_date_div{
      margin: 30px 0 15px 0;
    }
    .control_group{
      label{
        margin-left: 10px;
        font-size:14px;
        font-family: HelveticaNeue1;
        color:rgba(51,51,51,1);
      }
    }
    .hint{
      margin-top: 15px;
      display: flex;
      align-items: center;
      .svg-icon{
        font-size: 20px;
        color: $new-primary;
        margin-right: 8px;
      }
      label{
        font-size:14px;
        font-family: HelveticaNeue1;
        color:rgba(51,51,51,1);
      }
    }
  }
</style>
