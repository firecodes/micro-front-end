<!--
  Latest purchase
  2020/01/11
-->
<template>
  <div :class="{'check': latest_purchase_data.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="latest_purchase_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Latest purchase
    </p>
    <by-profile :data="latest_purchase_data" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Latest purchase" width="350px">
        <div class="dialog_body_height">
          <el-form :model="dialog_data" :rules="rules" label-position="top" ref="dialog">
            <el-form-item label="From" prop="latest_purchase_from">
              <el-date-picker  :format="globalData.value.date_format" :picker-options="pickerOptions1" popper-class="ed-data-table" style="width: 300px" type="date" v-model="dialog_data.latest_purchase_from" value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item label="To"  prop="latest_purchase_to">
              <el-date-picker :format="globalData.value.date_format" :picker-options="pickerOptions1" popper-class="ed-data-table" style="width: 300px" type="date" v-model="dialog_data.latest_purchase_to" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-footer" slot="footer">
          <el-button @click="dialog = false" class="cancel">Cancel</el-button>
          <el-button @click="closeDialog" class="save" type="primary">Save</el-button>
        </div>
      </el-dialog>
    </ed-dialog>
  </div>
</template>
<script>
  import ByProfile from '../by-profile'
  export default {
    props: {
      campaign_respondent_state: {
        type: Boolean,
        default: false
      },
      target: {
        type: Object
      }
    },
    components: {
      ByProfile
    },
    data() {
      return {
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        rules: {},
        latest_purchase_data: [],
        dialog: false,
        dialog_data: {
          latest_purchase_from: '',
          latest_purchase_to: ''
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.target) {
          var list = this.target.target_profiles && this.target.target_profiles[1].criteria_fields ? this.target.target_profiles[1].criteria_fields : []
          if (list.length <= 0) {
            return true
          }
          for (var item of list) {
            var code = []
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
              code = item.criteria_field_option.criteria_field_option_code
            }
            if (item.criteria_field_code === 'lastest_purchase_date_from') {
              this.dialog_data.latest_purchase_from = code.length ? code : ''
            }
            if (item.criteria_field_code === 'lastest_purchase_date_to') {
              this.dialog_data.latest_purchase_to = code.length ? code : ''
            }
            if (this.dialog_data.latest_purchase_from && this.dialog_data.latest_purchase_to) {
              this.latest_purchase_data = []
              this.latest_purchase_data.push(`${this.dialog_data.latest_purchase_from} / ${this.dialog_data.latest_purchase_to}`)
            }
          }
        }
      },
      handleDelete(tag) {
        this.latest_purchase_data.splice(this.latest_purchase_data.indexOf(tag), 1)
        this.dialog_data.latest_purchase_from = ''
        this.dialog_data.latest_purchase_to = ''
      },
      closeDialog() {
        if (this.dialog_data.latest_purchase_from) {
          this.$set(this.latest_purchase_data, 0, `${this.dialog_data.latest_purchase_from} / ${this.dialog_data.latest_purchase_to}`)
        }
        this.dialog = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../common';
</style>
