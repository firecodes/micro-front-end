<!--
  2019/11/29
  Business report-Member Transactions by Tier
-->
<template>
  <div class="member_transactions_tier_18" ref="member_transactions_tier_18">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Tier-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transactions_tier_table_tier_lable')" align="center" min-width="120" prop="tier_code">
        <template slot-scope="scope">
          <template v-if="scope.row.tier_code === '99999'">
            Total
          </template>
          <template v-else>
            {{ scope.row.tier_code || table_placeholder }}
          </template>
        </template>
      </el-table-column>
      <!--New members total transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transactions_tier_table_new_lable')" align="center" min-width="130"  prop="new_member_tier_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.new_member_tier_transactions || 0, 0) }}
        </template>
      </el-table-column>
      <!--Existing members total transactions-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_transactions_tier_table_existing_lable')" align="center" min-width="150" prop="existed_member_tier_transactions">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.existed_member_tier_transactions || 0, 0) }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { memberTierSalesTransReport } from '@/api/report'
  import { member_transaction_18 } from '@/data/reporting'
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
      handleClickGetMemberTransactionTier(obj, source) {
        this.table_data = []
        this.table_loading = true
        if (source === 'dw') {
          memberTierSalesTransReport(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = Object.keys(result).length <= 0 ? [] : result
            if (this.table_data.length > 0) {
              var new_member_tier_transactions_sum = 0
              var existed_member_tier_transactions_sum = 0
              for (var item of this.table_data) {
                new_member_tier_transactions_sum += item.new_member_tier_transactions
                existed_member_tier_transactions_sum += item.existed_member_tier_transactions
              }
              this.table_data.push({ 'tier_code': '99999', 'new_member_tier_transactions': new_member_tier_transactions_sum, 'existed_member_tier_transactions': existed_member_tier_transactions_sum })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = member_transaction_18
            _this.table_loading = false
          }, 1000)
        }
      },
      exportMemberTransactionTierReport() {
        import('@/vendor/Export2Excel').then(excel => {
          // ['Tier', 'New Members Total transactions', 'Existing Members Total transactions']
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_transactions_tier_table_tier_lable'), this.$t('reporting.fc_reporting_oneclick_transactions_tier_table_new_lable'), this.$t('reporting.fc_reporting_oneclick_transactions_tier_table_existing_lable')]
          const filterVal = ['tier_code', 'new_member_tier_transactions', 'existed_member_tier_transactions']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu10_lable')}-${Date.parse(new Date())}`
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'tier_code') {
            return v[j] === '99999' ? 'Total' : v[j]
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
