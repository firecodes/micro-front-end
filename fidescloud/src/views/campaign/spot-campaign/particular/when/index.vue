<template>
  <div class="spot_campaign__when" ref="when" v-loading="when_loading">
    <ed-form>
      <el-form :model="form" :rules="rules" label-position="left" label-width="280px" ref="form">
        <!--Notification date-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_when_date_label')" prop="notification_date_type">
          <el-select v-model="form.notification_date_type">
            <el-option :key="item.value" :label="$t(`campaign.${item.label}`)" :value="item.value" v-for="item in notification_date_list" />
          </el-select>
          <!--Specific date-->
            <el-form-item class="specific_date_div" label=" "  prop="send_date" v-if="form.notification_date_type === 1">
              <el-date-picker
                :format = 'globalData.value.date_format'
                :picker-options="pickerOptions"
                :placeholder="$t('campaign.fc_campaign_spot_create_when_specific_input_label')"
                popper-class="ed-data-table"
                type="date"
                v-model="form.send_date"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
        </el-form-item>
        <!--Campaign period-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_when_period_label')" prop="campaign_period">
          <div class="list">
            <el-date-picker
              :disabled="form.limit_flag"
              :format = 'globalData.value.date_format'
              :picker-options="pickerOptions"
              popper-class="ed-data-table"
              range-separator="-"
              type="daterange"
              v-model="form.campaign_period"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <div class="no-limited">
              <!--No limit-->
              <el-checkbox class="margin-left-20" style="margin-right: 0;" v-model="form.limit_flag">{{$t('campaign.fc_campaign_spot_create_when_no_limit_label')}}</el-checkbox>
              <el-tooltip :content="$t('campaign.fc_campaign_spot_create_when_no_limit_desc_label')" effect="light" placement="bottom">
                <svg-icon class-name='shuoming-icon' icon-class="shuoming-icon"/>
              </el-tooltip>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </ed-form>
  </div>
</template>
<script>
  import { DateTime } from 'luxon'
  import { addOrUpdateCampaignInfo } from '@/api/campaign'
  const moment = require('moment')
  export default {
    props: {
      form_data: {
        type: Object
      },
      campaign_wizard_id: {
        type: String | Number
      }
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        when_loading: true,
        notification_date_list: [{ label: 'fc_campaign_spot_create_when_date_menu1_label', value: 2 }, { label: 'fc_campaign_spot_create_when_date_menu2_label', value: 1 }],
        form: {
          send_date: '',
          notification_date_type: 2,
          campaign_period: '',
          limit_flag: false
        },
        rules: {
          send_date: [{ validator: this.validatorSendDate, trigger: ['blur', 'change'] }],
          campaign_period: [{ validator: this.validatorCampaignPeriod, trigger: ['blur', 'change'] }]
        }
      }
    },
    watch: {
      form_data() {
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {
      formatTimeStamp(dataStr) {
        if (dataStr) {
          return moment(dataStr).format('YYYY-MM-DD')
        } else {
          return '-'
        }
      },
      validatorSendDate(rule, value, callback) {
        if (!this.form.send_date) {
          callback(new Error(this.$t('campaign.fc_campaign_spot_create_when_period_warning_label')))
          return true
        }
        callback()
      },
      validatorCampaignPeriod(rule, value, callback) {
        if (this.form.limit_flag) {
          callback()
        } else {
          if (!value) {
            callback(new Error(this.$t('campaign.fc_campaign_spot_create_when_period_warning_label')))
            return true
          }
        }
        callback()
      },
      // 初始化数据
      init() {
        const generate_time = DateTime.local().toISO()
        this.form.notification_date_type = (this.form_data.when_type === null || this.form_data.when_type === 0 || Object.keys(this.form_data).value <= 0) ? 2 : parseInt(this.form_data.when_type)
        this.form.campaign_period = [this.form_data.campaign_start_date ? this.form_data.campaign_start_date.substring(0, 10) : `${generate_time.substring(0, 10)}`, this.form_data.campaign_end_date ? this.form_data.campaign_end_date.substring(0, 10) : `${generate_time.substring(0, 10)}`]
        const period = this.form_data.period || '{}'
        if (period !== null) {
          const period_obj = JSON.parse(period)
          this.form.limit_flag = period_obj.limitFlag
          this.form.campaign_period = this.form.limit_flag ? '' : this.form.campaign_period
          this.form.send_date = this.form.notification_date_type === 1 ? this.formatTimeStamp(period_obj.sendDate) : ''
        }
        this.when_loading = false
      },
      // 保存WHEN
      saveData() {
        const generate_time = DateTime.local().toISO()
        return new Promise((resolve, reject) => {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.when_loading = true
              addOrUpdateCampaignInfo({
                compaign_wizard_id: this.campaign_wizard_id,
                campaign_name: this.form_data.campaign_name,
                campaign_type_code: this.form_data.campaign_type_code,
                when_type: this.form.notification_date_type,
                campaign_start_date: this.form.limit_flag ? generate_time.substring(0, 10) + ' 00:00:000' : this.form.campaign_period[0] + ' 00:00:00',
                campaign_end_date: this.form.limit_flag ? null : this.form.campaign_period[1] + ' 23:59:59',
                campaign_description: this.form_data.campaign_description,
                send_date: this.form.notification_date_type === 1 ? `${this.form.send_date} 00:00:00` : `${generate_time.substring(0, 10)} ${generate_time.substring(11, 19)}`,
                limit_flag: this.form.limit_flag
              }).then(() => {
                this.when_loading = false
                // 保存成功
                this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
                resolve()
              }).catch(() => {
                this.$message.error('Error')
                this.when_loading = false
                reject()
              })
            } else {
              reject()
            }
          })
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spot_campaign__when{
    padding: 0 20px;
    /deep/ .el-form-item{
      margin-bottom: 0;
      padding-bottom: 20px;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(230,230,230,1);
      }
    }
    /deep/ .ed-form .el-form-item__label {
      padding-top: 15px;
      line-height: 36px;
    }
    /deep/ .el-form-item__content {
      margin-top: 15px;
    }
    .list{
      display: flex;
      align-items: center;
      .no-limited{
        margin-left: 20px;
        display: flex;
        align-items: center;
      }
      .svg-icon{
        cursor: pointer;
        margin-left: 8px;
        font-size: 14px;
      }
    }
    .specific_date_div{
      margin: 15px 0 -20px -280px;
    }
  }
</style>
