<template>
  <div class="trigger-campaign-when-item" ref="when">
    <el-form label-width="142px" >
      <p class="p">{{$t('campaign.fc_campaign_lifecycle_edit_when_title_label')}}</p>
      <!--选择模式-->
      <div class="select-mode">
        <el-form-item :label="$t('campaign.fc_campaign_lifecycle_edit_when_timing_label')">
          <el-select v-model="type">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="$t(`campaign.${item.name}`)"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 类型为prospect 和 new buyer -->
      <div class="delay-mode" v-if="form.type === 2">
        <el-form-item label="">
          <el-input-number :min="0" v-model.number="form.delay_value" maxlength="32"></el-input-number>
          <label class="tip">{{$t('campaign.fc_campaign_lifecycle_edit_when_specific_desc_label')}}</label>
        </el-form-item>
      </div>
      <!-- report customer 和 sleeping customer 类型为-->
      <div class="monthly-mode" v-if="form.type === 3">
        <el-form-item label="">
          <label>{{handleGlobalI18n('campaign', 'last_purchase_happened_before')}}</label>
          <el-input-number :min="0" v-model="form.exec_date" maxlength="32"></el-input-number>
          <label class="tip">{{handleGlobalI18n('campaign', 'month')}}</label>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
  import { when_options } from '@/data/lifecycle-campaign'
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
        options: when_options,
        form: {},
        cam_info: {},
        type: 1
      }
    },
    methods: {
      init() {
        const info = this.form_data
        const when_definition = info.when_definition
        this.form = { ...when_definition }
        const has = Object.prototype.hasOwnProperty
        if (has.call(when_definition, 'exec_date')) {
          this.form.exec_date = parseInt(when_definition.exec_date)
        }
        if (this.cam_info.lifecycle_campaign_type === 'PROSPECT' || this.cam_info.lifecycle_campaign_type === 'NEW BUYER') {
          this.form.type = 2
        } else {
          this.form.type = 3
        }
      }
    },
    watch: {
      nonius_id: {
        handler(val) {
          this.cam_info = JSON.parse(window.localStorage.lifecycle_cam_info)
          this.init()
        },
        immediate: true
      },
      form_data: {
        handler(val) {
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
    .select-mode{
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
