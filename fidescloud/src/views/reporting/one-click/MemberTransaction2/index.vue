<!--
  2019/10/23
  会员交易报表2
-->
<template>
  <div class="members-transaction-report-2" ref="members-transaction-report-2">
    <el-table :data="table_data" border v-loading='table_loading' :empty-text="$t('member.fc_table_no_data_label')">
      <!--Store name-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transaction_table_name_lable')" align="center" prop='store_name' min-width="135">
        <template slot-scope="scope">
          {{ scope.row.store_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Sales rank-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transaction_table_rank_lable')" align="center" prop="sales_rank" min-width="95">
        <template slot-scope="scope">
          {{ scope.row.sales_rank || table_placeholder }}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('reporting', 'existing_member')" align="center" prop="old_member" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.old_member || table_placeholder }}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('reporting', 'number_of_existing_member_sales')" align="center" prop="old_member_sales" min-width="240">
        <template slot-scope="scope">
          {{ scope.row.old_member_sales || table_placeholder }}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('reporting', 'total_amount_of_existing_member_sales')" align="center" prop="old_member_sales_count" min-width="275">
        <template slot-scope="scope">
          {{ scope.row.old_member_sales_count || table_placeholder }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { memberTransactionReport } from '@/api/report'
  import { member_transaction_data, member_transaction_data_cn } from '@/data/reporting'
  export default {
    data() {
      return {
        table_data: [],
        table_loading: false
      }
    },
    watch: {
      table_data() {
        this.$emit('handleExportButton', this.table_data.length > 0)
      }
    },
    methods: {
      handleClickSearch(obj, source) {
        this.table_loading = true
        if (source === 'dw') {
          this.handleDWMemberTransactionReport(obj)
        } else {
          this.handleFakeMemberTransactionReport()
        }
      },
      handleFakeMemberTransactionReport() {
        var _this = this
        setTimeout(() => {
          _this.table_data = member_transaction_data
          // 如果是中文的 显示中文数据
          if (_this.globalData.value.currency_symbol === '￥') {
            _this.table_data = member_transaction_data_cn
          }
          _this.table_loading = false
        }, 1000)
      },
      // DW-会员交易报表
      handleDWMemberTransactionReport(obj) {
        memberTransactionReport(obj).then(res => {
          this.table_data = res.return_result
          this.table_loading = false
        }).catch(() => {
          this.table_loading = false
        })
      },
      // 导出会员交易报表
      exportMemberTransactionReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.handleGlobalI18n('reporting', 'store_name'), this.handleGlobalI18n('reporting', 'sales_rank'), this.handleGlobalI18n('reporting', 'existing_member'), this.handleGlobalI18n('reporting', 'number_of_existing_member_sales'), this.handleGlobalI18n('reporting', 'total_amount_of_existing_member_sales')]
          const filterVal = ['store_name', 'sales_rank', 'old_member', 'old_member_sales', 'old_member_sales_count']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.handleGlobalI18n('reporting', 'member_transaction_report')}-${Date.parse(new Date())}`,
            autoWidth: 250
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j] || this.table_placeholder
        }))
      }
    }
  }
</script>
