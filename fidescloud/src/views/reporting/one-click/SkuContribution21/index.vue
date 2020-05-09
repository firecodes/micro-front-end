<!--
  2019/12/03
  Business report-Top 50 SKU Contribution
-->
<template>
  <div class="sku_contribution_21" ref="sku_contribution_21">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Ranking-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sku_top50_table_ranking_lable')" align="center" min-width="130" prop="ranking">
        <template slot-scope="scope">
          <template v-if="scope.row.ranking === '99999'">
            Total
          </template>
          <template v-else>
            {{ scope.row.ranking || table_placeholder }}
          </template>
        </template>
      </el-table-column>
      <!--SKU name-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sku_top50_table_name_lable')" align="center" min-width="130"  prop="sku_name">
        <template slot-scope="scope">
          {{ scope.row.sku_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--SKU code-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sku_top50_table_code_lable')" align="center" min-width="150" prop="sku_code">
        <template slot-scope="scope">
          {{ scope.row.sku_code || table_placeholder }}
        </template>
      </el-table-column>
      <!--Total sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sku_top50_table_sales_lable')" align="center" min-width="150" prop="total_sales">
        <template slot-scope="scope">
          {{ globalData.value.currency_symbol + ' ' + globalData.formatNumber(scope.row.total_sales || 0, 2) }}
        </template>
      </el-table-column>
      <!--Sales contribution %-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sku_top50_table_contribution_lable')" align="center" min-width="160" prop="sales_contribution">
        <template slot-scope="scope">
          {{ scope.row.sales_contribution ? `${(scope.row.sales_contribution * 100).toFixed(0)}%` : `0%` }}
        </template>
      </el-table-column>
      <!--Total items-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sku_top50_table_items_lable')" align="center" min-width="130" prop="total_items">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_items || 0, 0) }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { skuContribution } from '@/api/report'
  import { sku_contribution_20 } from '@/data/reporting'
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
      handleClickSkuContribution(obj, source) {
        this.table_loading = true
        if (source === 'dw') {
          skuContribution(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.list_sku_contribution || []
            if (this.table_data.length > 0) {
              this.table_data.push({ 'ranking': '99999', 'sku_name': '', 'sku_code': '', 'total_sales': result.aggregate_sales, 'sales_contribution': result.aggregate_sales_contribution, 'total_items': result.aggregate_items })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = sku_contribution_20
            _this.table_loading = false
          }, 1000)
        }
      },
      exportSkuContributionReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_sku_top50_table_ranking_lable'), this.$t('reporting.fc_reporting_oneclick_sku_top50_table_name_lable'), this.$t('reporting.fc_reporting_oneclick_sku_top50_table_code_lable'), this.$t('reporting.fc_reporting_oneclick_sku_top50_table_sales_lable'), this.$t('reporting.fc_reporting_oneclick_sku_top50_table_contribution_lable'), this.$t('reporting.fc_reporting_oneclick_sku_top50_table_items_lable')]
          const filterVal = ['ranking', 'sku_name', 'sku_code', 'total_sales', 'sales_contribution', 'total_items']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu13_lable')}-${Date.parse(new Date())}`
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'ranking') {
            return v[j] === '99999' ? 'Total' : v[j]
          } else if (j === 'sales_contribution') {
            return v[j] ? `${(v[j] * 100).toFixed(0)}%` : `0%`
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
