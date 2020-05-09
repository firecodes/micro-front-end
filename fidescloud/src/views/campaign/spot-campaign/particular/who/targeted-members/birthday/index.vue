<!--
  Birthday
  2020/01/11
-->
<template>
  <div :class="{'check': birthday_data.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="birthday_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Birthday
    </p>
    <by-profile :data="birthday_data" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Birthday" width="350px">
        <div class="dialog_body_height">
          <el-form :model="dialog_data" :rules="rules" label-position="top" ref="dialog">
            <el-form-item label="From" prop="birthday_from">
              <el-date-picker  format="MM-dd" popper-class="ed-data-table" style="width: 300px" type="date" v-model="dialog_data.birthday_from" value-format="MMdd" />
            </el-form-item>
            <el-form-item label="To"  prop="birthday_to">
              <el-date-picker :picker-options="pickerOptions1" format="MM-dd" popper-class="ed-data-table" style="width: 300px" type="date" v-model="dialog_data.birthday_to" value-format="MMdd" />
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
        birthday_data: [],
        dialog: false,
        dialog_data: {
          birthday_from: '',
          birthday_to: ''
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.target) {
          var list = this.target.target_profiles && this.target.target_profiles[0].criteria_fields ? this.target.target_profiles[0].criteria_fields : []
          if (list.length <= 0) {
            return true
          }
          for (var item of list) {
            var code = ''
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
              code = item.criteria_field_option.criteria_field_option_code
            }
            if (item.criteria_field_code === 'birthday_from') {
              this.dialog_data.birthday_from = code || ''
            }
            if (item.criteria_field_code === 'birthday_to') {
              this.dialog_data.birthday_to = code || ''
            }
          }
          if (this.dialog_data.birthday_from && this.dialog_data.birthday_to) {
            this.birthday_data = []
            this.birthday_data.push(`${this.dialog_data.birthday_from} / ${this.dialog_data.birthday_to}`)
          }
        }
      },
      handleDelete(tag) {
        this.birthday_data.splice(this.birthday_data.indexOf(tag), 1)
        this.dialog_data.birthday_from = ''
        this.dialog_data.birthday_to = ''
      },
      closeDialog() {
        if (this.dialog_data.birthday_from) {
          this.$set(this.birthday_data, 0, `${this.dialog_data.birthday_from}-${this.dialog_data.birthday_to}`)
        }
        this.dialog = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../common';
</style>
