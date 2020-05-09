<!--
  Gender
  2020/01/11
-->
<template>
  <div :class="{'check': select_name.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="gender_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Gender
    </p>
    <by-profile :data="select_name" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Gender" width="350px">
        <div class="dialog_body_height">
          <el-select filterable placeholder="Please select gender" v-model="select_gender">
            <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in gender_list" />
          </el-select>
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
        dialog: false,
        select_gender: '',
        select_name: [],
        gender_list: [{ name: 'Unknown', value: 0 }, { name: 'Male', value: 1 }, { name: 'Female', value: 2 }]
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
            var code = []
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
              code = item.criteria_field_option.criteria_field_option_code
            }
            if (item.criteria_field_code === 'gender') {
              this.select_gender = code.length ? parseInt(code) : ''
              this.select_name = []
              if (this.select_gender) {
                this.select_name.push(this.gender_list[parseInt(this.select_gender)].name)
              }
              break
            }
          }
        }
      },
      handleDelete() {
        this.select_name = []
        this.select_gender = ''
      },
      closeDialog() {
        var list = ['Unknown', 'Male', 'Female']
        this.$set(this.select_name, 0, list[parseInt(this.select_gender)])
        this.dialog = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../common';
</style>
