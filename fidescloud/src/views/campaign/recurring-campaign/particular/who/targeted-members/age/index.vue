<!--
  Age
  2020/01/11
-->
<template>
  <div :class="{'check': age_data.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="age_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Age
    </p>
    <by-profile :data="age_data" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Age" width="350px">
        <div class="dialog_body_height">
          <el-form :model="dialog_data" :rules="rules" label-position="top" ref="dialog">
            <el-form-item label="From" prop="age_from">
              <el-input-number :max="150" :min="0" :precision="0" :step="1" v-model="dialog_data.age_from"></el-input-number>
            </el-form-item>
            <el-form-item label="To"  prop="age_to">
              <el-input-number :max="150" :min="0" :precision="0" :step="1" v-model="dialog_data.age_to"></el-input-number>
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
      age_data: [],
      dialog: false,
      dialog_data: {
        age_from: 0,
        age_to: 0
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
          var code = 0
          if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
            code = item.criteria_field_option.criteria_field_option_code
          }
          if (item.criteria_field_code === 'age_from') {
            this.dialog_data.age_from = code || 0
          }
          if (item.criteria_field_code === 'age_to') {
            this.dialog_data.age_to = code || 0
          }
        }
        if (this.dialog_data.age_to) {
          this.age_data = []
          this.age_data.push(`${this.dialog_data.age_from}-${this.dialog_data.age_to}`)
        }
      }
    },
    handleDelete(tag) {
      this.age_data.splice(this.age_data.indexOf(tag), 1)
      this.dialog_data.age_from = ''
      this.dialog_data.age_to = ''
    },
    closeDialog() {
      if (this.dialog_data.age_to) {
        this.$set(this.age_data, 0, `${this.dialog_data.age_from}-${this.dialog_data.age_to}`)
      }
      this.dialog = false
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../common';
</style>
