<!--
  Average basket
  2020/01/11
-->
<template>
  <div :class="{'check': average_basket_data.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="average_basket_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Average basket
    </p>
    <by-profile :data="average_basket_data" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Average basket" width="350px">
        <div class="dialog_body_height">
          <el-form :model="dialog_data" :rules="rules" label-position="top" ref="dialog">
            <el-form-item label="From" prop="average_basket_from">
              <el-input-number :min="0" :precision="2" :step="1" v-model="dialog_data.average_basket_from"></el-input-number>
            </el-form-item>
            <el-form-item label="To"  prop="average_basket_to">
              <el-input-number :min="0" :precision="2" :step="1" v-model="dialog_data.average_basket_to"></el-input-number>
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
        average_basket_data: [],
        dialog: false,
        dialog_data: {
          average_basket_from: 0,
          average_basket_to: 0
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
            var code = ''
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
              code = item.criteria_field_option.criteria_field_option_code
            }
            if (item.criteria_field_code === 'average_basket_from') {
              this.dialog_data.average_basket_from = code.length ? code : ''
            }
            if (item.criteria_field_code === 'average_basket_to') {
              this.dialog_data.average_basket_to = code.length ? code : ''
            }
            if (this.dialog_data.average_basket_to) {
              this.average_basket_data = []
              this.average_basket_data.push(`${this.dialog_data.average_basket_from}-${this.dialog_data.average_basket_to}`)
            }
          }
        }
      },
      handleDelete(tag) {
        this.average_basket_data.splice(this.average_basket_data.indexOf(tag), 1)
        this.dialog_data.average_basket_from = ''
        this.dialog_data.average_basket_to = ''
      },
      closeDialog() {
        if (this.dialog_data.average_basket_to) {
          this.$set(this.average_basket_data, 0, `${this.dialog_data.average_basket_from}-${this.dialog_data.average_basket_to}`)
        }
        this.dialog = false
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../common';
</style>
