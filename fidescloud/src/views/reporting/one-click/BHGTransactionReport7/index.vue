<!--
  2019/10/22
  BHG 会员交易报表
-->
<template>
  <div class="bhg-transaction-report-7" ref="bhg-transaction-report-7">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading = 'table_loading'>
        <!--S/No-->
        <el-table-column align="center" label="S/No" prop="row">
          <template slot-scope="scope">
            <template v-if="parseInt(scope.row.row) === 9999">
              Total
            </template>
            <template v-else>
              {{ scope.row.row || table_placeholder }}
            </template>
          </template>
        </el-table-column>
        <!--Outlet code-->
        <el-table-column align="center" label="Outlet Code" prop="store_code">
          <template slot-scope="scope">
            {{ scope.row.store_code || table_placeholder }}
          </template>
        </el-table-column>
        <!--Outlet name-->
        <el-table-column align="center" label="Outlet Name" prop="store_name">
          <template slot-scope="scope">
            {{ scope.row.store_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--Membership type code-->
        <el-table-column align="center" label="Membership Type Code" min-width="110" prop="membership_type_code">
          <template slot-scope="scope">
            {{ scope.row.membership_type_code || table_placeholder }}
          </template>
        </el-table-column>
        <!--Total spending-->
        <el-table-column align="center" label="Total Spending" prop="total_spending">
          <template slot-scope="scope">
            {{ globalData.formatNumber(scope.row.total_spending || 0, 2) }}
          </template>
        </el-table-column>
        <!--Total nett spending-->
        <el-table-column align="center" label="Total Nett Spending" prop="total_net_spending">
          <template slot-scope="scope">
            {{globalData.formatNumber( scope.row.total_net_spending || 0, 2) }}
          </template>
        </el-table-column>
        <!--Total points awarded-->
        <el-table-column align="center" label="Total Points Awarded" min-width="110" prop="total_point_award">
          <template slot-scope="scope">
            {{globalData.formatNumber( scope.row.total_point_award || 0, 2) }}
          </template>
        </el-table-column>
        <!--Total point redeemed-->
        <el-table-column align="center" label="Total Point Redeemed" min-width="110" prop="total_point_redeemed">
          <template slot-scope="scope">
            0
          </template>
        </el-table-column>
        <!--Total point expired-->
        <el-table-column align="center" label="Total Point Expired" min-width="110" prop="total_point_expired">
          <template slot-scope="scope">
            0
          </template>
        </el-table-column>
        <!--Total voucher redeemed-->
        <el-table-column align="center" label="Total Voucher Redeemed" min-width="110" prop="total_sales_count">
          <template slot-scope="scope">
            0
          </template>
        </el-table-column>
        <!--Total sales trans count-->
        <el-table-column align="center" label="Total Sales Trans Count" min-width="110" prop="total_sales_count">
          <template slot-scope="scope">
            {{ scope.row.total_sales_count || table_placeholder }}
          </template>
        </el-table-column>
        <!--Avg spending-->
        <el-table-column align="center" label="Avg Spending" prop="avg_spending" >
          <template slot-scope="scope">
            {{ globalData.formatNumber(scope.row.avg_spending || 0, 2) }}
          </template>
        </el-table-column>
      </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { transactionReport } from '@/api/report'
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
      handleClickTransactionReport(obj) {
        this.table_loading = true
        transactionReport(obj).then(res => {
          this.table_loading = false
          this.table_data = res.return_result.reports || []
        }).catch(res => {
          this.$message.error(res)
          this.table_loading = false
        })
      },
      exportBHGTransactionReport() {
        if (this.table_data.length <= 0) {
          return false
        }
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['S/No', 'Outlet Code', 'Outlet Name', 'Membership Type Code', 'Total Spending', 'Total Nett Spending', 'Total Points Awarded', 'Total Point Expired', 'Total Voucher Redeemed', 'Total Sales Trans Count', 'Avg Spending']
          const filterVal = ['row', 'store_code', 'store_name', 'membership_type_code', 'total_spending', 'total_net_spending', 'total_point_redeemed', 'total_point_expired', 'total_sales_count', 'total_sales_count', 'avg_spending']
          const list = this.table_data
          const data = this.formatJsonTransaction(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `member-transaction-${Date.parse(new Date())}`,
            autoWidth: 250
          })
          this.downloadLoading = false
        })
      },
      formatJsonTransaction(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'row') {
            return parseInt(v[j]) === 9999 ? 'Total' : v[j]
          } else if (j === 'total_spending' || j === 'total_net_spending' || j === 'total_point_redeemed' || j === 'total_point_expired' || j === 'total_sales_count' || j === 'avg_spending') {
            return v[j] || 0
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
