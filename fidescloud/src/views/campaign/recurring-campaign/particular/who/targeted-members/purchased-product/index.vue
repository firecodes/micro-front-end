<!--
  Purchased product
  2020/01/11
-->
<template>
  <div :class="{'check': purchased_product_name_list.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="purchased_product_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Purchased product
    </p>
    <by-profile :data="purchased_product_name_list" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Purchased product" width="350px">
        <div class="dialog_body_height">
          <product-list :value="select_purchased_product_list" ref="product-list" />
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
  import ProductList from '../product-list'
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
      ProductList
    },
    data() {
      return {
        dialog: false,
        select_purchased_product_list: [],
        purchased_product_name_list: [],
        purchased_product_value_list: [],
        select_loading: true
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
            var name = []
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
              code = item.criteria_field_option.criteria_field_option_code
            }
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_name')) {
              name = item.criteria_field_option.criteria_field_option_name
            }
            if (item.criteria_field_code === 'purchased_product') {
              this.purchased_product_name_list = name.length ? name.split(',') : []
              this.purchased_product_value_list = code.length ? code.split(',') : []
              break
            }
          }
        }
      },
      handleDelete(tag) {
        const key = this.purchased_product_name_list.indexOf(tag)
        this.purchased_product_name_list.splice(key, 1)
        this.purchased_product_value_list.splice(key, 1)
        this.select_purchased_product_list.splice(key, 1)
      },
      closeDialog() {
        var obj = this.$refs['product-list'].change()
        this.dialog = false
        this.purchased_product_value_list = []
        this.purchased_product_name_list = []
        const value = obj.value
        for (let i = 0; i < value.length; i++) {
          this.$set(this.purchased_product_value_list, i, value[i].product_code)
          this.$set(this.purchased_product_name_list, i, value[i].product_name)
        }
        this.select_purchased_product_list = obj.index
        this.obj = {}
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../common';
</style>
