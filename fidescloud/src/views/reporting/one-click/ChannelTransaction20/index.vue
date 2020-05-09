<!--
  2019/12/03
  Business report-Channel Transactions
-->
<template>
  <div class="channel_transactions_20" ref="channel_transactions_20">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Channel-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_transactions_table_channel_lable')" align="center" prop="channel">
        <template slot-scope="scope">
          <template v-if="scope.row.channel === '99999'">
            Total
          </template>
          <template v-else>
            {{ scope.row.channel ? $t(`reporting.${scope.row.channel}`) : table_placeholder }}
          </template>
        </template>
      </el-table-column>
      <!--Total transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_transactions_table_total_lable')" align="center"  prop="total_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_transactions || 0, 0) }}
        </template>
      </el-table-column>
      <!--Total member transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_transactions_table_member_lable')" align="center" prop="total_member_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_member_transactions || 0, 0) }}
        </template>
      </el-table-column>
      <!--Total Non-Member transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_transactions_table_non_member_lable')" align="center" prop="total_non_member_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_non_member_transactions || 0, 0) }}
        </template>
      </el-table-column>
      <!--Average daily transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_transactions_table_average_lable')" align="center" prop="average_daily_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.average_daily_transactions || 0, 0) }}
        </template>
      </el-table-column>
      <!--Average member daily transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_transactions_table_member_average_lable')" align="center" prop="average_member_daily_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.average_member_daily_transactions || 0, 0) }}
        </template>
      </el-table-column>
      <!--Average Non-member daily transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_transactions_table_non_member_average_lable')" align="center" min-width="130" prop="average_non_member_daily_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.average_non_member_daily_transactions || 0, 0) }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { channelTransaction } from '@/api/report'
  import { channel_transaction_20 } from '@/data/reporting'
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
      handleClickChannelTransaction(obj, source) {
        this.table_loading = true
        if (source === 'dw') {
          channelTransaction(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.list_channel_transaction || []
            if (this.table_data.length > 0) {
              this.table_data.push({ 'channel': '99999', 'total_transactions': result.aggregate_transactions, 'total_member_transactions': result.aggregate_member_transactions, 'total_non_member_transactions': result.aggregate_non_member_transactions, 'average_daily_transactions': result.aggregate_daily_transactions, 'average_member_daily_transactions': result.aggregate_member_daily_transactions, 'average_non_member_daily_transactions': result.aggregate_non_member_daily_transactions })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = channel_transaction_20
            _this.table_loading = false
          }, 1000)
        }
      },
      exportChannelTransactionReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_channel_transactions_table_channel_lable'), this.$t('reporting.fc_reporting_oneclick_channel_transactions_table_total_lable'), this.$t('reporting.fc_reporting_oneclick_channel_transactions_table_member_lable'), this.$t('reporting.fc_reporting_oneclick_channel_transactions_table_non_member_lable'), this.$t('reporting.fc_reporting_oneclick_channel_transactions_table_average_lable'), this.$t('reporting.fc_reporting_oneclick_channel_transactions_table_member_average_lable'), this.$t('reporting.fc_reporting_oneclick_channel_transactions_table_non_member_average_lable')]
          const filterVal = ['channel', 'total_transactions', 'total_member_transactions', 'total_non_member_transactions', 'average_daily_transactions', 'average_member_daily_transactions', 'average_non_member_daily_transactions']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu12_lable')}-${Date.parse(new Date())}`
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
