<template>
  <div class="select-gift-dialog">
    <el-dialog :before-close="handleClose" :title="$t('loyalty.fc_redemption_gift_add_select_title_label')" :visible.sync="dialog_visible" width="700px">
      <div class="search">
        <el-select :placehoulder="$t('loyalty.fc_redemption_gift_add_select_dropdown_label')" clearable filterable v-model="form.gift_category_code" >
          <el-option class="new-select-option" v-for="(item, index) in category_data_list" :key="index" :value="item.gift_category_code" :label="item.gift_category_name" />
        </el-select>
        <el-input :placeholder="$t('loyalty.fc_redemption_gift_add_select_search_input_label')" style="margin-left: 8px; width: 356px" type="text" v-model="form.gift_name" />
        <!--Search-->
        <el-button @click="handleSearch" class="search-button" type="primary">{{$t('loyalty.fc_redemption_gift_add_select_btn_search_label')}}</el-button>
      </div>
      <el-radio-group v-model="radio">
        <el-table :data="table_data" border style="width: 660px" v-loading="list_loading">
          <!--Operation-->
          <el-table-column :label="$t('loyalty.fc_redemption_gift_add_select_table_operation_label')" align="center">
            <template slot-scope="scope">
              <el-radio :label="scope.row.gift_code" />
            </template>
          </el-table-column>
          <!--Gift code-->
          <el-table-column :label="$t('loyalty.fc_redemption_gift_add_select_table_code_label')" align="center" prop="gift_code" >
            <template slot-scope="scope">
              <v-clamp autoresize :max-lines="1">{{scope.row.gift_code}}</v-clamp>
            </template>
          </el-table-column>
          <!--Gift name-->
          <el-table-column :label="$t('loyalty.fc_redemption_gift_add_select_table_name_label')" align="center" prop="gift_name">
            <template slot-scope="scope">
              <v-clamp autoresize :max-lines="1">{{scope.row.gift_name}}</v-clamp>
            </template>
          </el-table-column>
          <!--Gift category-->
          <el-table-column :label="$t('loyalty.fc_redemption_gift_add_select_table_category_label')" align="center" prop="gift_category_name">
            <template slot-scope="scope">
              <v-clamp autoresize :max-lines="1">{{scope.row.gift_category_name || table_placeholder}}</v-clamp>
            </template>
          </el-table-column>
          <!--Gift unit-->
          <el-table-column :label="$t('loyalty.fc_redemption_gift_add_select_table_unit_label')" align="center" prop="unit">
            <template slot-scope="scope">
              <v-clamp autoresize :max-lines="1">{{scope.row.unit || table_placeholder}}</v-clamp>
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
      />
      <span slot="footer" class="dialog-footer">
        <!--Cancel-->
        <el-button @click="dialog_visible = false" class="cancel">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
        <!--Save-->
        <el-button @click="save" class="save" type="primary">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryGiftCategory, searchGift } from '@/api/loyalty'
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
          asc: false,
          status: 1,
          order_by: 'id',
          use_in_redemption: false
        },
        total: null,
        radio: '',
        category_data_list: [],
        gift_category_name: '',
        dialog_visible: false,
        table_data: [],
        total_table_data: [],
        form: {
          gift_category_code: '',
          gift_name: ''
        }
      }
    },
    created() {
      this.getCategoryList()
      this.getList()
    },
    methods: {
      save() {
        if (this.radio === '') {
          this.$message.error(this.$t('loyalty.fc_loyalty_catalogue_add_gift_unselected_tips'))
          return false
        }
        // 将选择的值传递出去
        this.addTotalTableData().forEach(item => {
          if (item.gift_code === this.radio) {
            this.$emit('selectGiftDialog', item)
            this.dialog_visible = false
          }
        })
      },
      addTotalTableData() {
        const temp = {}
        const ret = this.total_table_data.reduce((item, next) => {
          temp[next.gift_code] ? '' : temp[next.gift_code] = true && item.push(next)
          return item
        }, [])
        return ret
      },
      getList(obj = {}) {
        this.list_loading = true
        searchGift(Object.assign({}, this.list_query, obj)).then(res => {
          const obj = res.return_result
          this.table_data = obj.gifts
          this.total_table_data = this.total_table_data.concat(this.table_data)
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
        this.getList()
      },
      getCategoryList() {
        queryGiftCategory({ gift_category_name: this.gift_category_name, page_no: 1, page_size: 10000 }).then(res => {
          this.category_data_list = res.return_result.results
        })
      },
      handleClose() {
        this.dialog_visible = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .select-gift-dialog{
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
      @extend .save;
    }
    .el-button{
      min-width: 88px;
    }
    .cancel{
      border-color: $new-primary !important;
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
