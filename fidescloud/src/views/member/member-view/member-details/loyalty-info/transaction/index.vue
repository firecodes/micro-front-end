<!--transaction info-->
<template>
  <div class="transaction-info" v-loading = "loading">
    <el-table :data="tableData" border :empty-text="$t('member.fc_table_no_data_label')">
      <!--Purchase date-->
      <el-table-column prop="purchase_date" align="center" :label="$t('member.fc_member_details_loyalty_transaction_table_date_label')">
        <template slot-scope="scope">
          {{scope.row.purchase_date ? globalData.formatDate((scope.row.purchase_date).substring(0, 10)) : table_placeholder }}
        </template>
      </el-table-column>
      <!--Invoice no-->
      <el-table-column  :label="$t('member.fc_member_details_loyalty_transaction_table_invoice_label')"  prop="invoice_no" align="center">
        <template slot-scope="scope">
          <div style="cursor:pointer;color:#0099ff" @click="handleTransactionDetail(scope.row)">
            {{scope.row.invoice_no || table_placeholder }}
          </div>
        </template>
      </el-table-column>
      <!--store code-->
      <el-table-column prop="store_code" align="center" :label="$t('member.fc_member_details_loyalty_transaction_table_code_label')">
        <template slot-scope="scope">
          {{scope.row.store_code || table_placeholder }}
        </template>
      </el-table-column>
      <!--store name-->
      <el-table-column prop="store_name" align="center" :label="$t('member.fc_member_details_loyalty_transaction_table_name_label')">
        <template slot-scope="scope">
          {{scope.row.store_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Channel name-->
      <el-table-column prop="channel_name" align="center" :label="$t('member.fc_member_details_loyalty_transaction_table_channel_label')">
        <template slot-scope="scope">
          {{scope.row.channel_resources_key ? $t(`reporting.${scope.row.channel_resources_key}`) : scope.row.channel_name }}
        </template>
      </el-table-column>
      <!--Amount-->
      <el-table-column prop="total_amount" align="center" :label="$t('member.fc_member_details_loyalty_transaction_table_amount_label')">
        <template slot-scope="scope">
          {{scope.row.total_amount || table_placeholder }}
        </template>
      </el-table-column>
      <!--Earned points-->
      <el-table-column prop="earned_points" align="center" :label="$t('member.fc_member_details_loyalty_transaction_table_points_label')">
        <template slot-scope="scope">
          {{scope.row.earned_points}}
        </template>
      </el-table-column>
      <!--items-->
      <el-table-column prop="total_quantity" align="center" :label="$t('member.fc_member_details_loyalty_transaction_table_items_label')">
        <template slot-scope="scope">
          {{scope.row.total_quantity || table_placeholder }}
        </template>
      </el-table-column>
    </el-table>
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
     />
    <el-dialog :title="handleGlobalI18n('member', 'transaction_detail')" :visible.sync="dialogFormVisible" width="80%">
      <div style="overflow-y: hidden;height: 400px;">
        <el-scrollbar style="height:100%; width: 100%">
          <div class="transaction-detail" v-loading = "listLoading1">
            <el-row :gutter="20" style="margin-top: 16px;">
              <!-- Purchase date-->
              <el-col :xs="12" :sm="8" :lg="8">
                <div class="li">
                  <label>{{handleGlobalI18n('member', 'purchase_date')}}: </label>
                  {{detail_info.purchase_date ? globalData.formatDate((detail_info.purchase_date).substring(0, 10)) : table_placeholder }}
                </div>
              </el-col>
              <!--Invoice no-->
              <el-col :xs="12" :sm="8" :lg="8">
                <div class="li">
                  <label>{{handleGlobalI18n('member', 'invoice_no')}}: </label>
                  <span>{{detail_info.invoice_no || table_placeholder}}</span>
                </div>
              </el-col>
              <!--Transaction type-->
              <el-col :xs="12" :sm="8" :lg="8">
                <div class="li">
                  <label>{{handleGlobalI18n('member', 'transaction_type')}}: </label>
                  <span>{{detail_info.transaction_type_name || table_placeholder}}</span>
                </div>
              </el-col>
              <!--channel-->
              <el-col :xs="12" :sm="8" :lg="8">
                <div class="li">
                  <label>{{handleGlobalI18n('member', 'channel')}}: </label>
                  <span>{{detail_info.channel_resources_key ? $t(`reporting.${detail_info.channel_resources_key}`) : detail_info.channel_name}}</span>
                </div>
              </el-col>
              <!--Employee name-->
              <el-col :xs="12" :sm="8" :lg="8">
                <div class="li">
                  <label>{{handleGlobalI18n('member', 'employee_name')}}: </label>
                  <span>{{detail_info.employee_name || table_placeholder}}</span>
                </div>
              </el-col>
              <!--amount-->
              <el-col :xs="12" :sm="8" :lg="8">
                <div class="li">
                  <label>{{handleGlobalI18n('member', 'amount')}}: </label>
                  <span>{{detail_info.total_amount || table_placeholder}}</span>
                </div>
              </el-col>
              <!--Items-->
              <el-col :xs="12" :sm="8" :lg="8">
                <div class="li">
                  <label>{{handleGlobalI18n('member', 'items')}}: </label>
                  <span>{{detail_info.total_quantity || table_placeholder}}</span>
                </div>
              </el-col>
              <!--Store name-->
              <el-col :xs="12" :sm="12" :lg="12">
                <div class="li">
                  <label>{{handleGlobalI18n('member', 'store_name')}}: </label>
                  <span>{{detail_info.store_name || table_placeholder}}</span>
                </div>
              </el-col>
            </el-row>
            <el-table :data="tableData1" border :empty-text="$t('member.fc_table_no_data_label')" >
              <!--Product name-->
              <el-table-column prop="product_code" align="center" :label="handleGlobalI18n('member', 'product_code')" width="270px">
                <template slot-scope="scope">
                  {{scope.row.product_code || table_placeholder }}
                </template>
              </el-table-column>
              <!--Product name-->
              <el-table-column prop="product_name" align="center" :label="handleGlobalI18n('member', 'product_name')" min-width="270px">
                <template slot-scope="scope">
                  {{scope.row.product_name || table_placeholder }}
                </template>
              </el-table-column>
              <!--Quantity-->
              <el-table-column prop="quantity" align="center" :label="handleGlobalI18n('member', 'quantity')" >
                <template slot-scope="scope">
                  {{scope.row.quantity || table_placeholder }}
                </template>
              </el-table-column>
              <!--Real price-->
              <el-table-column prop="real_price" align="center" :label="handleGlobalI18n('member', 'real_price')" >
                <template slot-scope="scope">
                  {{scope.row.real_price || table_placeholder }}
                </template>
              </el-table-column>
              <!--Unit price-->
              <el-table-column prop="unit_price" align="center" :label="handleGlobalI18n('member', 'unit_price')" >
                <template slot-scope="scope">
                  {{scope.row.unit_price || table_placeholder }}
                </template>
              </el-table-column>
              <!--Total amount-->
              <el-table-column prop="total_amount" align="center" :label="handleGlobalI18n('member', 'total_amount')" >
                <template slot-scope="scope">
                  {{scope.row.real_amount || table_placeholder }}
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="tableData2" border :empty-text="$t('member.fc_table_no_data_label')" >
              <!--Tender type name-->
              <el-table-column prop="tender_type_name" align="center" :label="handleGlobalI18n('member', 'tender_type_name')" width="270px">
                <template slot-scope="scope">
                  {{scope.row.tender_type_name || table_placeholder }}
                </template>
              </el-table-column>
              <!--Tender type code-->
              <el-table-column prop="tender_type_code" align="center" :label="handleGlobalI18n('member', 'tender_type_code')" min-width="270px">
                <template slot-scope="scope">
                  {{scope.row.tender_type_code || table_placeholder }}
                </template>
              </el-table-column>
              <!--Real amount-->
              <el-table-column prop="real_amount" align="center" :label="handleGlobalI18n('member', 'real_amount')" >
                <template slot-scope="scope">
                  {{scope.row.real_amount || table_placeholder }}
                </template>
              </el-table-column>
              <!--Source no-->
              <el-table-column prop="source_no" align="center" :label="handleGlobalI18n('member', 'source_no')" >
                <template slot-scope="scope">
                  {{scope.row.source_no || table_placeholder }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getMemberTransactionList,
    getMemberTransactionDetail
  } from '@/api/member'
  import {
    pageLimit
  } from '@/api/api'
  import {
    loyaltyInfoMixins
  } from '@/utils/util'
  import PaginationContainer from '@/components/PaginationContainer'
  export default {
    mixins: [loyaltyInfoMixins],
    components: {
      PaginationContainer
    },
    data() {
      return {
        tableData1: [],
        tableData2: [],
        tableData: [],
        dialogFormVisible: false,
        listQuery: {
          page_size: pageLimit
        },
        listLoading1: false,
        loading: true,
        detail_info: ''
      }
    },
    created() {
      this.getTransactionList()
    },
    methods: {
      handleTransactionDetail(info) {
        this.detail_info = info
        this.dialogFormVisible = true
        this.getTransactionDetailList()
      },
      getTransactionDetailList() {
        this.listLoading1 = true
        this.tableData1 = []
        getMemberTransactionDetail({ code: this.detail_info.invoice_no }).then((res) => {
          var result = res.return_result.details || []
          this.tableData1 = result
          this.tableData2 = res.return_result.tenders || []
          this.listLoading1 = false
        }).catch(() => {
          this.listLoading1 = false
        })
      },
      getTransactionList() {
        this.loading = true
        getMemberTransactionList(Object.assign({ member_code: this.member_code }, this.listQuery)).then((res) => {
          this.tableData = res.return_result.transactions || []
          this.loading = false
          this.total = res.return_result.total_count
        }).catch(() => {
          this.loading = false
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getTransactionList()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getTransactionList()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-dialog__body{
    padding: 0 !important;
  }
  .transaction-info {
    .transaction-detail{
      margin:-30px -10px;
      background-color: #ffffff;
      text-align: center;
      padding-bottom: 20px;
      height: 100%;
      .el-col {
        text-align: left;
        margin-top: 15px;
        .li{
          display: flex;
          label {
            width: 120px;
            text-align: right;
            font-size: 14px;
            color: #000000;
          }
          span{
            color:#888888;
          }
        }

      }
    }
    .el-table{
      margin-top:20px;
    }
  }
</style>
