<!--
  Available point
  2020/01/11
-->
<template>
  <div :class="{'check': available_point_data.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="available_point_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Available point
    </p>
    <by-profile :data="available_point_data" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Available point" width="350px">
        <div class="dialog_body_height">
          <el-form :model="dialog_data" :rules="rules" label-position="top" ref="dialog">
            <el-form-item label="From" prop="available_point_from">
              <el-input-number :min="0" :precision="2" :step="1" v-model="dialog_data.available_point_from"></el-input-number>
            </el-form-item>
            <el-form-item label="To"  prop="available_point_to">
              <el-input-number :min="0" :precision="2" :step="1" v-model="dialog_data.available_point_to"></el-input-number>
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
        rules: {},
        available_point_data: [],
        dialog: false,
        dialog_data: {
          available_point_from: 0,
          available_point_to: 0
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.target) {
          var list = this.target.target_profiles && this.target.target_profiles[2].criteria_fields ? this.target.target_profiles[2].criteria_fields : []
          if (list.length <= 0) {
            return true
          }
          for (var item of list) {
            var code = ''
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
              code = item.criteria_field_option.criteria_field_option_code
            }
            if (item.criteria_field_code === 'available_point_from') {
              this.dialog_data.available_point_from = code.length ? code : ''
            }
            if (item.criteria_field_code === 'available_point_to') {
              this.dialog_data.available_point_to = code.length ? code : ''
            }
            if (this.dialog_data.available_point_to) {
              this.available_point_data = []
              this.available_point_data.push(`${this.dialog_data.available_point_from}-${this.dialog_data.available_point_to}`)
            }
          }
        }
      },
      handleDelete(tag) {
        this.available_point_data.splice(this.available_point_data.indexOf(tag), 1)
        this.dialog_data.available_point_from = ''
        this.dialog_data.available_point_to = ''
      },
      closeDialog() {
        if (this.dialog_data.available_point_to) {
          this.$set(this.available_point_data, 0, `${this.dialog_data.available_point_from}-${this.dialog_data.available_point_to}`)
        }
        this.dialog = false
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../common';
</style>
