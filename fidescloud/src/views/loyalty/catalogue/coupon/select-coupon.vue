<!--
  2019/10/29
-->
<template>
  <div class="select-coupon-dialog">
    <el-dialog :title="$t('loyalty.fc_add_a_coupon_popup_title_label')" :visible.sync="dialog_visible" width="700px" :before-close="handleClose">
      <div class="search">
        <el-select v-model="form.coupon_type_code" clearable filterable :placeholder="$t('loyalty.fc_add_a_coupon_popup_category_label')">
          <el-option :key="index" :label="item.name" :value="item.value" class="new-select-option" v-for="(item, index) in category_data_list" />
        </el-select>
        <el-input v-model="form.coupon_name" :placeholder="$t('loyalty.fc_add_a_coupon_popup_input_empty_tips')" type="text" style="margin-left: 8px; width: 356px" />
        <el-button type="primary" class="search-button" @click="handleSearch" >{{$t('loyalty.fc_add_a_coupon_popup_btn_search_label')}}</el-button>
      </div>
      <el-radio-group v-model="radio">
        <el-table :data="table_data" border style="width: 660px" v-loading="list_loading">
          <!--Operation-->
          <el-table-column :label="$t('loyalty.fc_add_a_coupon_popup_table_operation_label')" align="center">
            <template slot-scope="scope">
              <el-radio :label="scope.row.coupon_code"></el-radio>
            </template>
          </el-table-column>
          <!--Coupon code-->
          <el-table-column prop="coupon_code" :label="$t('loyalty.fc_add_a_coupon_popup_table_code_label')" align="center" >
            <template slot-scope="scope">
              <v-clamp autoresize :max-lines="1">{{scope.row.coupon_code}}</v-clamp>
            </template>
          </el-table-column>
          <!--Coupon name-->
          <el-table-column prop="coupon_name" :label="$t('loyalty.fc_add_a_coupon_popup_table_name_label')" align="center">
            <template slot-scope="scope">
              <v-clamp autoresize :max-lines="1">{{scope.row.coupon_name}}</v-clamp>
            </template>
          </el-table-column>
          <!--Coupon type-->
          <el-table-column prop="coupon_type_name" :label="$t('loyalty.fc_add_a_coupon_popup_table_type_label')" align="center">
            <template slot-scope="scope">
              <v-clamp autoresize :max-lines="1">{{scope.row.coupon_type_name || table_placeholder}}</v-clamp>
            </template>
          </el-table-column>
        </el-table>
      </el-radio-group>
      <pagination-container
        :page = "list_query.page_no"
        :page_size = 'list_query.page_size'
        :total = 'total'
        layout="total, prev, pager, next, jumper"
        @handleCurrentChange = "handleCurrentChange"
      ></pagination-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_visible = false" class="cancel">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
        <el-button type="primary" class="save" @click="save">{{$t('loyalty.fc_operation_btn_save_label') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryCouponListBy } from '@/api/loyalty'
  import VClamp from 'vue-clamp'
  export default {
    components: {
      PaginationContainer,
      VClamp
    },
    props: {
      radio_row: {
        type: String,
        default: ''
      },
      dialog_show: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      '$store.getters.language': {
        handler() {
          this.coupon_type_list = [{ name: this.$t('loyalty.fc_add_coupon_type_1st_label'), value: 'cash' }, { name: this.$t('loyalty.fc_add_coupon_type_2nd_label'), value: 'discount' }, { name: this.handleGlobalI18n('loyalty', 'sku'), value: 'sku' }]
        }
      },
      radio_row(val) {
        this.radio = val
      },
      dialog_show() {
        this.dialog_visible = this.dialog_show
      },
      dialog_visible() {
        this.$emit('handleDialogVisible', this.dialog_visible)
      }
    },
    data() {
      return {
        list_loading: false,
        list_query: {
          page_no: 1,
          page_size: 8,
          asc: false,
          status: 1,
          is_used_in_redemption: false
        },
        total: null,
        radio: '',
        category_data_list: [{ name: this.$t('loyalty.fc_add_coupon_type_1st_label'), value: 'cash' }, { name: this.$t('loyalty.fc_add_coupon_type_2nd_label'), value: 'discount' }, { name: this.handleGlobalI18n('loyalty', 'sku'), value: 'sku' }],
        coupon_category_name: '',
        dialog_visible: false,
        table_data: [],
        form: {
          coupon_type_code: '',
          coupon_name: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      save() {
        if (this.radio === '') {
          this.$message.error(this.$t('loyalty.fc_loyalty_catalogue_add_coupon_unselected_tips'))
          return false
        }
        // 将选择的值传递出去
        this.table_data.forEach(item => {
          if (item.coupon_code === this.radio) {
            this.$emit('selectGiftDialog', item)
            this.dialog_visible = false
          }
        })
      },
      getList(obj = {}) {
        this.list_loading = true
        queryCouponListBy(Object.assign({}, this.list_query, obj)).then(res => {
          const obj = res.return_result
          this.table_data = obj.coupons
          this.total = obj.total_count
          this.list_loading = false
        }).catch(() => {
          this.list_loading = false
        })
      },
      handleSearch() {
        this.list_query.page_no = 1
        this.getList(this.form)
      },
      handleCurrentChange(val) {
        this.list_query.page_no = val
        this.getList(this.form)
      },
      handleClose() {
        this.dialog_visible = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .select-coupon-dialog{
    .el-loading-spinner .path{
      stroke: $new-primary;
    }
    .search{
      display: flex;
      margin: -10px 0 20px 0;
      .el-select{
        width:180px;
      }
    }
    .el-radio__label{
      display: none;
    }
    .save{
      background-color: $new-primary!important;
      border-color: $new-primary;
    }
    .search-button{
      margin-left: 8px;
      min-width: 108px;
      background-color: $new-primary!important;
      @extend .save;
    }
    .el-button{
      min-width: 88px;
    }
    .cancel{
      border-color:$new-primary;
      color: $new-primary;
    }

    .add{
      display: flex;
      .el-input{
        margin-right: 20px;
      }
    }
  }
</style>
