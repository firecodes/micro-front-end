<!--
  2019/11/26
  Business report-Transactions
-->
<template>
  <div class="transactions_14" ref="transactions_14">
    <ed-table>
    <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Channel-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transactions_table_channel_lable')" align="center" min-width="120" prop="channel">
        <template slot-scope="scope">
          <template v-if="scope.row.channel === '99999'">
            Total
          </template>
          <template v-else>
            {{ scope.row.channel ? $t(`reporting.${scope.row.channel}`) : table_placeholder }}
          </template>
        </template>
      </el-table-column>
      <!--Region-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transactions_table_region_lable')" align="center" min-width="130" prop="region">
        <template slot-scope="scope">
          {{ scope.row.region || table_placeholder }}
        </template>
      </el-table-column>
      <!--Store-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transactions_table_store_lable')" align="center" min-width="150" prop="store">
        <template slot-scope="scope">
          {{ scope.row.store || table_placeholder }}
        </template>
      </el-table-column>
      <!--Total member transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transactions_table_member_lable')" align="center" min-width="170" prop="total_member_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_member_transactions || 0, 0) }}
        </template>
      </el-table-column>
      <!--Total non-member transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transactions_table_non_member_lable')" align="center" min-width="150" prop="total_non_member_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_non_member_transactions || 0, 0) }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { businessTransactionReport } from '@/api/report'
  import { transactions_14_data } from '@/data/reporting'
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
      handleClickGetTransaction(obj, source) {
        this.table_loading = true
        if (source === 'dw') {
          businessTransactionReport(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.list_business_transaction || []
            if (this.table_data.length > 0) {
              this.table_data.push({ 'channel': '99999', 'region': '', 'store': '', 'total_member_transactions': result.aggregate_member_transactions, 'total_non_member_transactions': result.aggregate_non_member_transactions })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = transactions_14_data
            _this.table_loading = false
          }, 1000)
        }
      },
      exportTransactionReport() {
        import('@/vendor/Export2Excel').then(excel => {
          // ['Channel', 'Region', 'Store', 'Total Member Transactions', 'Total Non-member transactions']
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_transactions_table_channel_lable'), this.$t('reporting.fc_reporting_oneclick_transactions_table_region_lable'), this.$t('reporting.fc_reporting_oneclick_transactions_table_store_lable'), this.$t('reporting.fc_reporting_oneclick_transactions_table_member_lable'), this.$t('reporting.fc_reporting_oneclick_transactions_table_non_member_lable')]
          const filterVal = ['channel', 'region', 'store', 'total_member_transactions', 'total_non_member_transactions']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu6_lable')}-${Date.parse(new Date())}`
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'channel') {
            return v[j] === '99999' ? 'Total' : v[j] ? this.$t(`reporting.${v[j]}`) : this.table_placeholder
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
