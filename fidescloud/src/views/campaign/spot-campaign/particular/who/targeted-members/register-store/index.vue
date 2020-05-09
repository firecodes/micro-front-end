<!--
  Register store
  2020/01/11
-->
<template>
  <div :class="{'check': register_store_name_list.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="register_store_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Register store
    </p>
    <by-profile :data="register_store_name_list" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Register store" width="350px">
        <div class="dialog_body_height">
          <multiple-register-store :value="select_register_store_list" ref="register_store" ></multiple-register-store>
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
  import MultipleRegisterStore from '../multiple_select-register_store'
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
      MultipleRegisterStore
    },
    data() {
      return {
        dialog: false,
        select_register_store_list: [],
        register_store_name_list: [],
        register_store_value_list: [],
        select_loading: true
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
            if (item.criteria_field_code === 'register_store') {
              this.register_store_name_list = name.length ? name.split(',') : []
              this.register_store_value_list = code.length ? code.split(',') : []
              break
            }
          }
        }
      },
      handleDelete(tag) {
        const key = this.register_store_name_list.indexOf(tag)
        this.register_store_name_list.splice(key, 1)
        this.register_store_value_list.splice(key, 1)
        this.select_register_store_list.splice(key, 1)
      },
      closeDialog() {
        var obj = this.$refs['register_store'].change()
        this.dialog = false
        this.register_store_value_list = []
        this.register_store_name_list = []
        const value = obj.value
        for (let i = 0; i < value.length; i++) {
          this.$set(this.register_store_value_list, i, value[i].store_code)
          this.$set(this.register_store_name_list, i, value[i].store_name)
        }
        this.select_register_store_list = obj.index
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../common';
</style>
