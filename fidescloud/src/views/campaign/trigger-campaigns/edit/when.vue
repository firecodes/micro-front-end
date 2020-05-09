<template>
  <div class="trigger-campaign-when-item" ref="when">
    <el-form label-width="182px" >
      <!--When will the message be sent ?-->
      <p class="p">{{$t('campaign.fc_campaign_trigger_edit_when_title_label')}}</p>
      <!---------------------------------------------------------------------------------->
      <!--选择模式-->
      <div class="select-mode">
        <el-form-item :label="$t('campaign.fc_campaign_trigger_edit_when_timing_label')">
          <el-select v-model="form.type">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="$t(`campaign.${item.name}`)"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!--Instantly-->
      <div class="delay-mode">
        <template  v-if="cam_info.category === 'Reminders'">
          <el-form-item label="">
            <el-input-number :max="31" :min="1" :step="1" v-model="form.delay_value" />
            <!--days before the occurrence-->
            <label class="tip">days before the occurrence</label>
          </el-form-item>
        </template>
      </div>
      <!--Delayed---------------------------------------------------------------------------->
      <div class="delay-mode" v-if="form.type === 5">
        <el-form-item label="">
          <el-input-number :min= "1" :step="1" v-model="form.delay_value" />
          <!--days after the occurrence-->
          <label class="tip">{{$t('campaign.fc_campaign_trigger_edit_when_delayed_content_label')}}</label>
        </el-form-item>
      </div>
      <!--before event------------------------------------------------------------------------>
      <div class="before-event" v-if="form.type === 4">
        <el-form-item label="">
          <el-input-number :min= "1" :step="1" v-model="form.delay_value" />
          <label class="tip">days before the occurrence</label>
        </el-form-item>
      </div>
      <!--Specific date----------------------------------------------------------------->
      <div class="monthly-mode" v-if="form.type === 3">
        <el-form-item :label="$t('campaign.fc_campaign_trigger_edit_when_specific_content1_label')">
          <el-input-number :max="31" :min="1" :step="1" v-model="form.delay_value" />
          <label class="tip">{{$t('campaign.fc_campaign_trigger_edit_when_specific_content2_label')}} <span>*</span></label>
        </el-form-item>
        <label class="hint"><span>*</span> {{$t('campaign.fc_campaign_trigger_edit_when_specific_desc_label')}}</label>
      </div>
    </el-form>
  </div>
</template>
<script>
  import { when_options } from '@/data/trigger-campaign'
  export default {
    props: {
      nonius_id: {
        type: Number,
        default: 1
      },
      form_data: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        member_anniversary_type: 'default', // 类型
        options: when_options,
        form: {},
        cam_info: {}
      }
    },
    methods: {
      checkOfMemberAnniversary() {
        const trigger_name = this.cam_info.trigger_name || ''
        return trigger_name.toLowerCase().indexOf('anniversary') > -1
      },
      checkOfBirthdayGreeting() {
        const trigger_name = this.cam_info.trigger_name || ''
        return trigger_name.toLowerCase().indexOf('birthday') > -1
      },
      init() {
        const info = JSON.parse(JSON.stringify(this.form_data))
        const when_definition = info.when_definition
        this.form = { ...when_definition }
        const has = Object.prototype.hasOwnProperty
        if (has.call(when_definition, 'exec_date')) {
          this.form.exec_date = parseInt(when_definition.exec_date)
        }
        if ((this.form.type === 4 && this.checkOfMemberAnniversary()) || this.form.type === 5) {
          // this.form.delay_value *= -1
          this.form.delay_value = Math.abs(this.form.delay_value)
        }
        if (this.cam_info.category === 'Reminders') {
          this.form.type = 1
        }
      }
    },
    watch: {
      nonius_id: {
        handler() {
          // 处理when的数据 跟据category
          /*
          * Greetings  Instantly /delayed/ specific date
          * Reminders specific date
          * Notifications Instantly /delayed/ specific date
          * */
          this.cam_info = JSON.parse(window.localStorage.trigger_cam_info)
          if (this.cam_info.category === 'Reminders') {
            this.options = [
              { value: 1, label: 'instantly', name: 'fc_campaign_trigger_edit_when_timing_menu1_label' }
            ]
          } else if (this.checkOfMemberAnniversary()) {
            // 会员纪念日member anniversary
            this.options = [
              { value: 1, label: 'instantly', name: 'fc_campaign_trigger_edit_when_timing_menu1_label' },
              { value: 5, label: 'delayed', name: 'fc_campaign_trigger_edit_when_timing_menu2_label' },
              { value: 3, label: 'specific_date', name: 'fc_campaign_trigger_edit_when_timing_menu3_label' },
              { value: 4, label: 'before_event', name: 'fc_campaign_trigger_edit_when_timing_menu4_label' }
            ]
          } else if (this.checkOfBirthdayGreeting()) {
            // birthday greeting
            this.options = [
              { value: 1, label: 'instantly', name: 'fc_campaign_trigger_edit_when_timing_menu1_label' },
              { value: 5, label: 'delayed', name: 'fc_campaign_trigger_edit_when_timing_menu2_label' },
              { value: 3, label: 'specific_date', name: 'fc_campaign_trigger_edit_when_timing_menu3_label' },
              { value: 4, label: 'before_event', name: 'fc_campaign_trigger_edit_when_timing_menu4_label' }
            ]
          }
          this.init()
        },
        immediate: true
      },
      form_data: {
        handler() {
          this.init()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .trigger-campaign-when-item{
    .el-input-number, .el-select{
      width: 150px;
    }
    .tip{
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      text-align: left;
      margin-left: 12px;
    }
    .p{
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .select-mode, .member-anniversary{
      margin-top: 17px;
    }
    .monthly-mode{
      span{
        color: red;
      }
      .hint{
        line-height: 20px;
        color: rgba(136, 136, 136, 1);
        font-size: 14px;
        text-align: left;
        padding-left: 130px;
      }
    }
  }
</style>
