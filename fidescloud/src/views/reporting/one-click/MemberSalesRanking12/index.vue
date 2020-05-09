<!--
  2019/11/14
  Member sales top 50 ranks
-->
<template>
  <div class="member-sales-rank-12" ref="member-sales-rank-12">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Ranking-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sales_top50_table_ranking_lable')" align="center" min-width="120" prop="ranking">
        <template slot-scope="scope">
          <template v-if="scope.row.ranking === '99999'">
            Total
          </template>
          <template v-else>
            {{ scope.row.ranking || table_placeholder }}
          </template>
        </template>
      </el-table-column>
      <!--Member name-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sales_top50_table_name_lable')" align="center" min-width="130" prop="member_name">
        <template slot-scope="scope">
          {{ scope.row.member_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Member code-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sales_top50_table_code_lable')" align="center" min-width="150" prop="member_code">
        <template slot-scope="scope">
          {{ scope.row.member_code || table_placeholder }}
        </template>
      </el-table-column>
      <!--Member sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sales_top50_table_sales_lable')" align="center" min-width="170" prop="member_sales">
        <template slot-scope="scope">
          {{ globalData.value.currency_symbol + ' ' + globalData.formatNumber(scope.row.member_sales || 0, 2) }}
        </template>
      </el-table-column>
      <!--Member tier-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_sales_top50_table_tier_lable')" align="center" min-width="130" prop="member_tier_name">
        <template slot-scope="scope">
          {{ scope.row.member_tier_name || table_placeholder }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { memberSalesRanking } from '@/api/report'
  import { member_sales_rank_list_data } from '@/data/reporting'
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
      handleClickGetMemberSalesRank(obj, data, source) {
        this.table_loading = true
        if (source === 'dw') {
          memberSalesRanking(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.member_sales_list || []
            if (this.table_data.length > 0) {
              this.table_data.push({ 'ranking': '99999', 'member_name': '', 'member_code': '', 'member_sales': result.total_member_sales, 'member_tier_name': '' })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = member_sales_rank_list_data
            _this.table_loading = false
          }, 1000)
        }
      },
      exportMemberSalesRankingReport() {
        import('@/vendor/Export2Excel').then(excel => {
          // ['Ranking', 'Member Name', 'Member Code', 'Member Sales', 'Member Tier']
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_sales_top50_table_ranking_lable'), this.$t('reporting.fc_reporting_oneclick_sales_top50_table_name_lable'), this.$t('reporting.fc_reporting_oneclick_sales_top50_table_code_lable'), this.$t('reporting.fc_reporting_oneclick_sales_top50_table_sales_lable'), this.$t('reporting.fc_reporting_oneclick_sales_top50_table_tier_lable')]
          const filterVal = ['ranking', 'member_name', 'member_code', 'member_sales', 'member_tier_name']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu4_lable')}-${Date.parse(new Date())}`,
            autoWidth: 250
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'ranking') {
            return v[j] === '99999' ? 'Total' : v[j]
          } else if (j === 'member_sales') {
            return v[j] || 0
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
