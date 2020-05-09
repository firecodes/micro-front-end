<!--
  Postal code
  2020/01/11
-->
<template>
  <div :class="{'check': postal_code_name_list.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="postal_code_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Postal code
    </p>
    <by-profile :data="postal_code_name_list" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Postal code" width="350px">
        <div class="dialog_body_height">
          <postal-code :value="select_postal_code_list" @postal_code = "handleSelect" />
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
  import PostalCode from '../postal-code'
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
      ByProfile,
      PostalCode
    },
    data() {
      return {
        dialog: false,
        select_postal_code_list: [],
        postal_code_name_list: [],
        postal_code_value_list: [],
        select_loading: true,
        obj: {}
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
            var name = []
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
              code = item.criteria_field_option.criteria_field_option_code
            }
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_name')) {
              name = item.criteria_field_option.criteria_field_option_name
            }
            if (item.criteria_field_code === 'postal_code') {
              this.postal_code_name_list = name.length ? name.split(',') : []
              this.postal_code_value_list = code.length ? code.split(',') : []
              break
            }
          }
        }
      },
      handleSelect(obj) {
        this.obj = obj
      },
      handleDelete(tag) {
        const key = this.postal_code_name_list.indexOf(tag)
        this.postal_code_name_list.splice(key, 1)
        this.postal_code_value_list.splice(key, 1)
        this.select_postal_code_list.splice(key, 1)
      },
      closeDialog() {
        var obj = this.obj
        this.dialog = false
        this.postal_code_value_list = []
        this.postal_code_name_list = []
        const value = obj.value
        for (let i = 0; i < value.length; i++) {
          this.$set(this.postal_code_value_list, i, value[i].value)
          this.$set(this.postal_code_name_list, i, value[i].name)
        }
        this.select_postal_code_list = obj.index
        this.obj = {}
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../common';
</style>
