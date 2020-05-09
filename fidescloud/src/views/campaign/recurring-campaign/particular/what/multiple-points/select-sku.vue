<template>
  <div class="select-sku-dialog">
    <!--select a sku-->
    <el-button @click="dialog_visible = true" type="primary">{{$t('campaign.fc_campaign_spot_create_what_sku_btn_label')}}</el-button>
    <ed-dialog>
      <!--select a sku-->
      <el-dialog :before-close="handleClose" :title="$t('campaign.fc_campaign_spot_create_select_sku_title_label')" :visible.sync="dialog_visible" @open="init" custom-class="select-sku-custom-class" width="700px">
        <div class="search">
          <el-input :placeholder="$t('campaign.fc_campaign_spot_create_select_sku_search_input_label')" type="text" v-model="form.product_query" />
          <!--Search-->
          <el-button @click="handleSearch" class="search-button" type="primary">{{$t('campaign.fc_campaign_spot_create_select_sku_search_btn_label')}}</el-button>
        </div>
        <el-radio-group v-model="radio">
          <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" :row-key="getRowKey" @selection-change="handleSelectionChange" border ref="select_sku_table" style="width: 700px" v-loading="list_loading">
            <!--选择-->
            <el-table-column
              :reserve-selection="true"
              align="center"
              type="selection"
              width="90">
            </el-table-column>
            <!--SKU code-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_sku_table_code_label')" align="center" prop="product_code" >
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.product_code || table_placeholder}}</ed-clamp>
              </template>
            </el-table-column>
            <!--SKU name-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_sku_table_name_label')" align="center" prop="product_name" >
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.product_name || table_placeholder}}</ed-clamp>
              </template>
            </el-table-column>
            <!--SKU category-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_sku_table_category_label')" align="center" prop="product_category_name">
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.product_category_name || table_placeholder}}</ed-clamp>
              </template>
            </el-table-column>
            <!--SKU unit-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_sku_table_unit_label')" align="center" prop="unit_price">
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.unit_price || table_placeholder}}</ed-clamp>
              </template>
            </el-table-column>
          </el-table>
        </el-radio-group>
        <pagination-container
          :page = "list_query.page_no"
          :page_size = 'list_query.page_size'
          :total = 'total'
          @handleCurrentChange = "handleCurrentChange"
          layout="total, prev, pager, next, jumper"
        ></pagination-container>
        <span class="dialog-footer" slot="footer">
          <!--cancel-->
          <el-button @click="dialog_visible = false" class="cancel">{{$t('campaign.fc_campaign_spot_create_select_sku_cancel_btn_label')}}</el-button>
          <!--save-->
          <el-button @click="handleSave()" class="save" type="primary">{{$t('campaign.fc_campaign_spot_create_select_sku_save_btn_label')}}</el-button>
        </span>
      </el-dialog>
    </ed-dialog>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryProductList } from '@/api/master'
  export default {
    components: {
      PaginationContainer
    },
    props: {
      value_list: {
        type: Array,
        default: []
      },
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
        select_data: [],
        list_loading: false,
        list_query: {
          page_no: 1,
          page_size: 8,
          asc: false
        },
        parent_list: [],
        total: null,
        radio: '',
        dialog_visible: false,
        table_data: [],
        form: {
          product_query: ''
        }
      }
    },
    created() {
      this.parent_list = JSON.parse(JSON.stringify(this.value_list))
      this.getList()
    },
    methods: {
      init() {
        setTimeout(() => {
          if (this.parent_list.length <= 0 || this.table_data.length <= 0) {
            return true
          }
          var arr = []
          for (var value of this.parent_list) {
            for (var item of this.table_data) {
              if (item.product_code === value.product_code) {
                this.$refs.select_sku_table && this.$refs.select_sku_table.toggleRowSelection(item, true)
                arr.push(this.parent_list.indexOf(value))
                break
              }
            }
          }
          for (var aa of arr) {
            this.parent_list.splice(aa, 1)
          }
        }, 400)
      },
      handleSelectionChange(val) {
        this.select_data = val
      },
      getRowKey(row) {
        return row.product_code
      },
      handleSave() {
        if (this.select_data.length <= 0) {
          this.$message.error('Please select a sku')
          return false
        }
        this.$emit('selectSkuData', this.select_data)
        this.dialog_visible = false
      },
      getList(obj = {}) {
        this.list_loading = true
        queryProductList(Object.assign({}, this.list_query, obj)).then(res => {
          const obj = res.return_result
          this.table_data = obj.products
          this.total = obj.total_count
          this.list_loading = false
          // init
          if (this.list_query.page_no > 1) {
            this.init()
          }
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
<style lang="scss" rel="stylesheet/scss" scoped>
  .select-sku-dialog{
    display: initial;
    /deep/ .el-dialog__body{
      padding: 15px 0!important;
    }
    .el-button{
      background-color: $new-primary;
      border-color: $new-primary;
      margin-left: 6px;
    }
    .el-loading-spinner .path{
      stroke: $new-primary;
    }
    .search{
      display: flex;
      margin-left: 20px;
      margin-bottom: 15px;
      .el-input{
        width: 300px;
      }
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
      @extend .save;
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
    /deep/ .el-table__header-wrapper .el-table__header th{
      background-color: #ECF4FF;
    }
    /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      background-color: $new-primary;
      height: 6px;
      right: 0;
      top: 6px;
    }
  }
</style>
