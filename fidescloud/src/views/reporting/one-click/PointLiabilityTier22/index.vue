<!--
  2020/02/19
  Point liability tier
-->
<template>
  <div class="point_liability_tier" ref="point_liability_tier_22">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
        <!--Tier-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_point_liability_table_tier_lable')" align="center" min-width="130" prop="member_tier_name">
          <template slot-scope="scope">
            <template v-if="scope.row.member_tier_name === '99999'">
              Total
            </template>
            <template v-else>
              {{ scope.row.member_tier_name || table_placeholder }}
            </template>
          </template>
        </el-table-column>
        <!--Total outstanding points-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_point_liability_table_outstanding_lable')" align="center" min-width="155" prop="outstanding_points">
          <template slot-scope="scope">
            {{ globalData.formatNumber(scope.row.outstanding_points || 0, 0) }}
          </template>
        </el-table-column>
        <!--Total Issued points-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_point_liability_table_issued_lable')" align="center" min-width="150" prop="issued_points">
          <template slot-scope="scope">
            {{ globalData.formatNumber(scope.row.issued_points || 0, 0) }}
          </template>
        </el-table-column>
        <!--Total Redeemed points-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_point_liability_table_redeemed_lable')" align="center" min-width="150" prop="redeemed_points">
          <template slot-scope="scope">
            {{ globalData.formatNumber(scope.row.redeemed_points || 0, 0) }}
          </template>
        </el-table-column>
        <!--Redemption Rate-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_point_liability_table_redemption_rate_lable')" align="center" min-width="130">
          <template slot-scope="scope">
            {{ scope.row.redemption_rate ? `${(scope.row.redemption_rate).toFixed(2)}%` : `0%` }}
          </template>
        </el-table-column>
        <!--Total Expired points-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_point_liability_table_expired_lable')" align="center" min-width="130" prop="expired_points">
          <template slot-scope="scope">
            {{ globalData.formatNumber(scope.row.expired_points || 0, 0) }}
          </template>
        </el-table-column>
        <!--Expiration rate-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_point_liability_table_expiration_lable')" align="center" min-width="130" prop="expiration_rate">
          <template slot-scope="scope">
            {{ scope.row.expiration_rate ? `${(scope.row.expiration_rate).toFixed(2)}%` : `0%` }}
          </template>
        </el-table-column>
      </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { pointsLiabilityTier } from '@/api/report'
  import { point_liability_tier_22 } from '@/data/reporting'
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
      handleClickPointLiabilityTier(obj, source) {
        this.table_loading = true
        if (source === 'dw') {
          pointsLiabilityTier(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.points_liability_tier_list || []
            if (this.table_data.length > 0) {
              this.table_data.push({
                'member_tier_name': '99999',
                'outstanding_points': result.total_outstanding_points,
                'issued_points': result.total_issued_points,
                'redeemed_points': result.total_redeemed_points,
                'redemption_rate': result.total_redemption_rate,
                'expired_points': result.total_expired_points,
                'expiration_rate': result.total_expiration_rate
              })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = point_liability_tier_22
            _this.table_loading = false
          }, 1000)
        }
      },
      exportPointLiabilityTierReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Tier', 'Total outstanding points', 'Total issued points', 'Total redeemed points', 'Redemption rate', 'Total expired points', 'Expiration rate']
          const filterVal = ['member_tier_name', 'outstanding_points', 'issued_points', 'redeemed_points', 'redemption_rate', 'expired_points', 'expiration_rate']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu15_lable')}-${Date.parse(new Date())}`
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'member_tier_name') {
            return v[j] === '99999' ? 'Total' : v[j]
          } else if (j === 'redemption_rate' || j === 'expiration_rate') {
            return v[j] ? `${(v[j]).toFixed(2)}%` : `0%`
          } else {
            return v[j] || 0
          }
        }))
      }
    }
  }
</script>
