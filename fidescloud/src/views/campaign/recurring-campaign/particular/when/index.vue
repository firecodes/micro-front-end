<template>
  <div class="spot_campaign__when" ref="when" v-loading="when_loading">
    <ed-form>
      <el-form :model="form" :rules="rules" label-position="left" label-width="280px" ref="form">
        <!--------------------------------------------------------------------------------------------------------------------->
        <!--Recurrence pattern-->
        <el-form-item label-width="0" prop="recurrence_pattern">
          <el-form-item label="Recurrence pattern:" >
          <el-select v-model="form.recurrence_pattern">
            <el-option :disabled="item.disabled" :key="item.value" :label="item.label" :value="item.value" v-for="item in notification_date_list" />
          </el-select>
        </el-form-item>
          <!--Recur-->
          <el-radio-group style="display: block" v-model="radio">
            <el-form-item label=" " prop="">
              <label class="margin-right-10">Recur</label>
              <el-radio :label="1">
                <label class="margin-right-10">day</label>
                <el-input class="input-width-80" v-model="day" />
                <label class="margin-left-10">of every 1 month</label>
              </el-radio>
            </el-form-item>
            <el-form-item label=" " prop="">
              <el-radio :label="2" style="margin-left: 50px;">
                <label class="margin-right-10">the</label>
                <el-select class="input-width-80 margin-right-10" v-model="select1">
                  <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in select1_option_list" />
                </el-select>
                <el-select class="input-width-110" v-model="select2">
                  <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in select2_option_list" />
                </el-select>
                <label class="margin-left-10">of every 1 month</label>
              </el-radio>
            </el-form-item>
          </el-radio-group>
        </el-form-item>
        <!--------------------------------------------------------------------------------------------------------------------->
        <!--Range of recurrence-->
        <el-form-item label=" " label-width="0" prop="range_recurrence">
          <el-radio-group style="display: block" v-model="radio1">
          <el-form-item label="Range of recurrence:">
            <label class="margin-right-10">Start</label>
            <el-date-picker
              :format = 'globalData.value.date_format'
              :picker-options="pickerOptions"
              :placeholder="$t('campaign.fc_campaign_spot_create_when_specific_input_label')"
              popper-class="ed-data-table"
              style="width: 180px;"
              type="date"
              v-model="form.send_date"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-radio :label="1" class="margin-left-10">No end date</el-radio>
          </el-form-item>
          <el-form-item label=" ">
            <el-radio :label="2" style="margin-left: 238px;">
              <label class="margin-right-10">End after</label>
              <el-input class="input-width-80" v-model="value2" />
              <label class="margin-left-10">occurrences</label>
            </el-radio>
          </el-form-item>
          <el-form-item label=" ">
            <el-radio :label="3" style="margin-left: 238px;">
              <label class="margin-right-10">End by</label>
              <el-date-picker
                :placeholder="$t('campaign.fc_campaign_spot_create_when_specific_input_label')"
              :format = 'globalData.value.date_format'
              :picker-options="pickerOptions"
              style="width: 180px;"
              popper-class="ed-data-table"
              type="date"
              v-model="form.send_date"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            </el-radio>
          </el-form-item>
        </el-radio-group>
        </el-form-item>
        <!--------------------------------------------------------------------------------------------------------------------->
        <!--Notification time-->
        <el-form-item label="Notification time:" prop="campaign_period">
          <el-time-select
            :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '23:59'
            }"
            placeholder="Please select"
            v-model="time" />
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
        value2: '',
        radio1: 1,
        time: '',
        select2_option_list: [{ label: 'weekday', value: 1 }, { label: 'weekend day', value: 2 }, { label: 'Sunday', value: 3 }, { label: 'Monday', value: 4 }, { label: 'Tuesday', value: 5 }, { label: 'Wednesday', value: 6 }, { label: 'Thursday', value: 7 }, { label: 'Friday', value: 8 }, { label: 'Saturday', value: 9 }],
        select2: '',
        select1_option_list: [{ label: 'first', value: 1 }, { label: 'second', value: 1 }, { label: 'third', value: 1 }, { label: 'fourth', value: 1 }, { label: 'last', value: 1 }],
        select1: '',
        day: 1,
        radio: 1,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        when_loading: true,
        notification_date_list: [{ label: 'Daily', value: 1, disabled: true }, { label: 'Weekly', value: 2, disabled: true }, { label: 'Monthly', value: 3 }, { label: 'Yearly', value: 4, disabled: true }],
        form: {
          send_date: '',
          notification_date_type: 3,
          recurrence_pattern: 3,
          campaign_period: '',
          limit_flag: false
        },
        rules: {
          send_date: [{ validator: this.validatorSendDate, trigger: ['blur', 'change'] }],
          campaign_period: [{ validator: this.validatorCampaignPeriod, trigger: ['blur', 'change'] }],
          recurrence_pattern: [{ required: true, trigger: ['blur', 'change'] }]
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
          callback(new Error('can be not empty'))
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
        var generate_time = DateTime.local().toISO()
        this.form.notification_date_type = (this.form_data.when_type === null || this.form_data.when_type === 0 || Object.keys(this.form_data).value <= 0) ? 3 : parseInt(this.form_data.when_type)
        this.form.campaign_period = [this.form_data.campaign_start_date ? this.form_data.campaign_start_date.substring(0, 10) : `${generate_time.substring(0, 10)}`, this.form_data.campaign_end_date ? this.form_data.campaign_end_date.substring(0, 10) : `${generate_time.substring(0, 10)}`]
        var period = this.form_data.period || '{}'
        if (period !== null) {
          var period_obj = JSON.parse(period)
          this.form.limit_flag = period_obj.limitFlag
          this.form.campaign_period = this.form.limit_flag ? '' : this.form.campaign_period
          this.form.send_date = this.form.notification_date_type === 1 ? this.formatTimeStamp(period_obj.sendDate) : ''
        }
        this.when_loading = false
      },
      // 保存WHEN
      saveData() {
        var generate_time = DateTime.local().toISO()
        return new Promise((resolve, reject) => {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.when_loading = true
              addOrUpdateCampaignInfo({
                compaign_wizard_id: this.campaign_wizard_id,
                campaign_name: this.form_data.campaign_name,
                campaign_type_code: this.form_data.campaign_type_code,
                when_type: this.form.notification_date_type,
                campaign_start_date: this.form.limit_flag ? generate_time.substring(0, 10) : this.form.campaign_period[0],
                campaign_end_date: this.form.limit_flag ? null : this.form.campaign_period[1],
                campaign_description: this.form_data.campaign_description,
                send_date: this.form.notification_date_type === '1' ? `${this.form.send_date} ${generate_time.substring(11, 19)}` : `${generate_time.substring(0, 10)} ${generate_time.substring(11, 19)}`,
                limit_flag: this.form.limit_flag
              }).then(res => {
                this.when_loading = false
                // 保存成功
                this.$message({
                  message: this.handleGlobalI18n('campaign', 'success'),
                  type: 'success'
                })
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
<style lang="scss" rel="stylesheet/scss" scoped>
  .input-width-80{
    width: 80px;
  }
  .input-width-110{
    width: 110px;
  }
  .margin-left-10 {
    margin-left: 10px;
  }
  .margin-right-10 {
    margin-right: 10px;
  }
  .spot_campaign__when{
    padding: 0 20px;
    /deep/ .el-radio__label{
      color: #333!important;
    }
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
