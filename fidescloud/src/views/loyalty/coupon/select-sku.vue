<template>
  <div class="select-sku-dialog">
    <el-dialog :before-close="handleClose" :visible.sync="dialog_visible" :title="$t('loyalty.fc_coupon_select_sku_title')" width="700px">
      <div class="search">
        <el-input :placeholder="$t('loyalty.fc_coupon_select_sku_search_empty_tips')" type="text" v-model="form.product_query" />
        <el-button type="primary" class="search-button" @click="handleSearch">{{$t('loyalty.fc_coupon_select_sku_btn_search_label')}}</el-button>
      </div>
      <el-radio-group v-model="radio">
        <el-table :data="table_data" border style="width: 660px" v-loading="list_loading">
          <el-table-column align="center" :label="$t('loyalty.fc_coupon_select_sku_table_operation_label')">
            <template slot-scope="scope">
              <el-radio :label="scope.row.product_code" @click.native.prevent="clickRadio(scope.row.product_code)" />
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('loyalty.fc_coupon_select_sku_table_code_label')" prop="product_code" >
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>{{scope.row.product_code}}</v-clamp>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('loyalty.fc_coupon_select_sku_table_name_label')" prop="product_name">
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>{{scope.row.product_name}}</v-clamp>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('loyalty.fc_coupon_select_sku_table_category_label')" prop="product_category_name">
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>{{scope.row.product_category_name || table_placeholder}}</v-clamp>
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
        <el-button type="primary" class="save" @click="save">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryProductList } from '@/api/master'
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
          asc: false
        },
        total: null,
        radio: this.radio_row,
        dialog_visible: false,
        table_data: [],
        form: {
          product_query: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      clickRadio(val) {
        val === this.radio ? this.radio = '' : this.radio = val
      },
      save() {
        if (this.radio === '') {
          this.$emit('selectGiftDialog', null)
        } else {
          // 将选择的值传递出去
          this.table_data.forEach(item => {
            if (item.product_code === this.radio) {
              this.$emit('selectGiftDialog', item)
            }
          })
        }
        this.dialog_visible = false
      },
      getList(obj = {}) {
        this.list_loading = true
        queryProductList(Object.assign({}, this.list_query, obj)).then(res => {
          const obj = res.return_result
          this.table_data = obj.products
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
  .el-pagination {
    white-space: normal !important;
  }
  .select-sku-dialog{
    .el-table {
      color: #666;
    }
    .el-table__header th {
      background: #ECF4FF !important;
      color: #333333 !important;
      height: 40px !important;
    }
    .search{
      display: flex;
      margin: 5px 0 15px 0;
      .el-select{
        width:180px;
      }
      .el-input {
        width: 300px;
      }
    }
    .el-radio__label{
      display: none;
    }
    .search-button{
      margin-left: 8px;
      min-width: 108px;
    }
    .el-button{
      min-width: 88px;
    }
    .cancel{
      border-color:$new-primary;
      color: $new-primary;
      background-color: #ffffff;
    }

    .add{
      display: flex;
      .el-input{
        margin-right: 20px;
      }
    }
  }
</style>
