<template>
  <div class="select-coupon-dialog">
    <!--select a coupon-->
    <el-button @click="dialog_visible = true" class="select-coupon-button" type="primary">{{$t('campaign.fc_campaign_spot_create_what_coupon_btn_label')}}</el-button>
    <ed-dialog>
      <el-dialog :before-close="handleClose" :title="$t('campaign.fc_campaign_spot_create_select_coupon_title_label')" :visible.sync="dialog_visible" @open="init" class="dialog_coupon" width="800px">
        <div class="search">
          <!--Category-->
          <el-select :placeholder="$t('campaign.fc_campaign_spot_create_select_coupon_category_label')" clearable filterable v-model="form.coupon_type_code">
            <el-option :key="index" :label="item.name" :value="item.value" v-for="(item, index) in category_data_list" />
          </el-select>
          <!--input-->
          <el-input :placeholder="$t('campaign.fc_campaign_spot_create_select_coupon_search_input_label')" style="margin-left: 8px; width: 356px;" type="text" v-model="form.coupon_name" />
          <!--search-->
          <el-button @click="handleSearch" class="search-button" type="primary" >{{$t('campaign.fc_campaign_spot_create_select_coupon_search_btn_label')}}</el-button>
        </div>
        <el-table :data="table_data" :row-key="getRowKey" @selection-change="handleSelectionChange" ref="select-coupon" style="width: 800px;" v-loading="list_loading" >
          <el-table-column
            :reserve-selection="true"
            align="center"
            type="selection"
            width="70">
          </el-table-column>
          <!--Coupon code-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_coupon_table_code_label')" align="center" prop="coupon_code" >
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>{{scope.row.coupon_code}}</v-clamp>
            </template>
          </el-table-column>
          <!--Coupon name-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_coupon_table_name_label')" align="center" prop="coupon_name">
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>{{scope.row.coupon_name}}</v-clamp>
            </template>
          </el-table-column>
          <!--Coupon type1-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_coupon_table_type_label')" align="center" prop="coupon_type_name">
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>{{scope.row.coupon_type_name || table_placeholder}}</v-clamp>
            </template>
          </el-table-column>
          <!--Channel-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_coupon_table_channel_label')" align="center" prop="channel_name">
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>{{scope.row.channel_name || table_placeholder}}</v-clamp>
            </template>
          </el-table-column>
          <!--Effective from-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_coupon_table_from_label')" align="center" prop="coupon_type_name">
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>
                <template v-if="scope.row.effective_type === 2">
                  {{scope.row.specific_effective_date_from ? globalData.formatDate((scope.row.specific_effective_date_from).substr(0, 10)) : table_placeholder}}
                </template>
                <template v-else>
                  {{$t('loyalty.fc_coupon_table_effective_from_relative_label').replace('{3}',scope.row.relative_value_from ? scope.row.relative_value_from : 0)}}
                </template>
              </v-clamp>
            </template>
          </el-table-column>
          <!--Effective to-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_select_coupon_table_to_label')" align="center" prop="coupon_type_name">
            <template slot-scope="scope">
              <v-clamp :max-lines="1" autoresize>
                <template v-if="scope.row.effective_type === 2">
                  {{scope.row.specific_effective_date_to ? globalData.formatDate((scope.row.specific_effective_date_to).substr(0, 10)) : table_placeholder}}
                </template>
                <template v-else>
                  {{$t('loyalty.fc_coupon_table_effective_to_relative_label').replace('{10}',scope.row.relative_value)}}
                </template>
              </v-clamp>
            </template>
          </el-table-column>
        </el-table>
        <pagination-container
          :page = "list_query.page_no"
          :page_size = 'list_query.page_size'
          :total = 'total'
          @handleCurrentChange = "handleCurrentChange"
          layout="total, prev, pager, next, jumper"
        />
        <span class="dialog-footer" slot="footer">
          <!--cancel-->
          <el-button @click="dialog_visible = false" class="cancel">{{$t('campaign.fc_campaign_spot_create_select_coupon_cancel_btn_label')}}</el-button>
          <!--save-->
          <el-button @click="save" class="save" type="primary">{{$t('campaign.fc_campaign_spot_create_select_coupon_save_btn_label') }}</el-button>
        </span>
      </el-dialog>
    </ed-dialog>
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
      coupon_detail: {
        type: Array
      }
    },
    watch: {
      '$store.getters.language': {
        handler() {
          this.coupon_type_list = [{ name: this.$t('loyalty.fc_add_coupon_type_1st_label'), value: 'cash' }, { name: this.$t('loyalty.fc_add_coupon_type_2nd_label'), value: 'discount' }, { name: this.handleGlobalI18n('loyalty', 'sku'), value: 'sku' }]
        }
      },
      dialog_show() {
        this.dialog_visible = this.dialog_show
      },
      dialog_visible() {
        this.$emit('handleDialogVisible', this.dialog_visible)
      },
      coupon_detail() {
        this.parent_list = JSON.parse(JSON.stringify(this.coupon_detail))
      }
    },
    data() {
      return {
        list_loading: false,
        list_query: {
          page_no: 1,
          page_size: 8,
          asc: false,
          status: 1
        },
        select_data: [],
        total: null,
        category_data_list: [{ name: this.$t('loyalty.fc_add_coupon_type_1st_label'), value: 'cash' }, { name: this.$t('loyalty.fc_add_coupon_type_2nd_label'), value: 'discount' }, { name: this.handleGlobalI18n('loyalty', 'sku'), value: 'sku' }],
        coupon_category_name: '',
        dialog_visible: false,
        table_data: [],
        form: {
          coupon_type_code: '',
          coupon_name: ''
        },
        parent_list: []
      }
    },
    created() {
      this.parent_list = JSON.parse(JSON.stringify(this.coupon_detail))
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
              if (item.coupon_code === value.coupon_code) {
                this.$refs['select-coupon'] && this.$refs['select-coupon'].toggleRowSelection(item, true)
                arr.push(this.parent_list.indexOf(value))
                break
              }
            }
          }
          for (var i = arr.length - 1; i >= 0; i--) {
            this.parent_list.splice(arr[i], 1)
          }
        }, 400)
      },
      handleSelectionChange(val) {
        this.select_data = val
      },
      getRowKey(row) {
        return row.coupon_code
      },
      save() {
        var data_length = this.select_data.length
        if (data_length <= 0) {
          this.$message.error(this.$t('loyalty.fc_redemption_coupon_empty_notification_label'))
          return
        } else if (data_length > 3) {
          this.$message.error(this.$t('campaign.fc_campaign_what_coupon_select_limit_label'))
          return
        }
        this.$emit('selectGiftDialog', this.select_data)
        this.dialog_visible = false
      },
      getList(obj = {}) {
        this.list_loading = true
        queryCouponListBy(Object.assign({}, this.list_query, obj)).then(res => {
          const obj = res.return_result
          this.table_data = obj.coupons
          this.total = obj.total_count
          this.list_loading = false
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
<style rel="stylesheet/scss" lang="scss" scoped>
  .select-coupon-dialog{
    display: initial;
    .dialog_coupon{
      /deep/ .el-dialog__body{
        padding: 15px 0!important;
      }
    }
    /deep/ .el-checkbox__inner{
      width: 20px!important;
      height: 20px!important;
    }
    /deep/ .el-checkbox__inner::after {
      background-color: $new-primary!important;
      top: 1.8px!important;
      height: 10px!important;
      left: 6px!important;
      width: 5px!important;
    }
    /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      background-color: $new-primary;
      height: 6px;
      right: 0;
      top: 6px;
    }
    /deep/ .el-table th.is-leaf {
      font-size: 14px;
      font-family: Helvetica-medium-1;
      color: rgba(51,51,51,1);
      line-height: 16px;
      border-right: none;
    }
    /deep/ .el-table__header-wrapper .el-table__header th{
      background-color: #ECF4FF;
    }
    .select-coupon-button{
      min-width:150px;
      background-color: $new-primary;
      border-color: $new-primary;
    }
    .el-loading-spinner .path{
      stroke: $new-primary;
    }
    .search{
      display: flex;
      margin-left: 20px;
      margin-bottom: 15px;
      .el-select{
        width:180px;
      }
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
