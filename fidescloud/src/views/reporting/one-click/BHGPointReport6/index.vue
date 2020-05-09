<!--
  2019/10/22
  BHG 会员积分报表
-->
<template>
  <div class="bhg-point-report-6" ref="bhg-point-report-6">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
        <!--S/No-->
      <el-table-column label="S/No" align="center" prop="row" min-width="80">
        <template slot-scope="scope">
          <template v-if="parseInt(scope.row.row) === 9999">
            Total
          </template>
          <template v-else>
            {{ scope.row.row || table_placeholder }}
          </template>
        </template>
      </el-table-column>
        <!--Month-->
      <el-table-column label="Month" align="center" prop="month" min-width="60">
        <template slot-scope="scope">
          {{ transformMonth(scope.row.month) || table_placeholder }}
        </template>
      </el-table-column>
        <!--Year-->
      <el-table-column label="Year" align="center" prop="year" min-width="70">
        <template slot-scope="scope">
          {{ (scope.row.year === '' || scope.row.year === null || scope.row.year === '0') ?  table_placeholder : scope.row.year }}
        </template>
      </el-table-column>
        <!--Membership Type Code-->
      <el-table-column label="Membership Type Code" align="center" prop="membership_type_code" min-width="165">
        <template slot-scope="scope">
          {{ scope.row.membership_type_code || table_placeholder }}
        </template>
      </el-table-column>
        <!--Total point awarded-->
      <el-table-column label="Total Points Awarded" align="center" prop="total_point_award" min-width="150">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_point_award || 0, 0) }}
        </template>
      </el-table-column>
        <!--Total points redeemed-->
      <el-table-column label="Total Points Redeemed" align="center" prop="total_point_redeemed" min-width="160">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_point_redeemed || 0, 0) }}
        </template>
      </el-table-column>
        <!--Total points expired-->
      <el-table-column label="Total Points Expired" align="center" prop="total_point_expired" min-width="150">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total_point_expired || 0, 0) }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { transformMonth } from '@/utils'
  import { pointReport } from '@/api/report'
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
      transformMonth,
      handleClickPointReport(obj) {
        this.table_loading = true
        pointReport(obj).then(res => {
          this.table_loading = false
          this.table_data = res.return_result.reports || []
        }).catch(res => {
          this.$message.error(res)
          this.table_loading = false
        })
      },
      exportBHGPointReport() {
        if (this.table_data.length <= 0) {
          return false
        }
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['S/No', 'Month', 'Year', 'Membership Type Code', 'Total Points Awarded', 'Total Points Redeemed', 'Total Points Expired']
          const filterVal = ['row', 'month', 'year', 'membership_type_code', 'total_point_award', 'total_point_redeemed', 'total_point_expired']
          const list = this.table_data
          const data = this.formatJsonPoint(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `member-report-${Date.parse(new Date())}`,
            autoWidth: 250
          })
          this.downloadLoading = false
        })
      },
      formatJsonPoint(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'row') {
            return parseInt(v[j]) === 9999 ? 'Total' : v[j]
          } else if (j === 'month') {
            return this.transformMonth(v[j])
          } else if (j === 'total_point_redeemed') {
            return v[j] || 0
          } else if (j === 'total_point_expired') {
            return v[j] || 0
          } else if (j === 'total_point_award') {
            return v[j] || 0
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
