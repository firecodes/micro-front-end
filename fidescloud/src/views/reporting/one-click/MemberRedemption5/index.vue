<!--
  2019/10/23
  会员兑换报表
-->
<template>
  <div class="members-redemption-report-5" ref="members-redemption-report-5">
    <el-table :data="table_data" border v-loading='table_loading' :empty-text="$t('member.fc_table_no_data_label')">
      <!--Redemption event name-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_redemption_table_event_lable')" align="center" prop="redemption_event_name" min-width="180">
        <template slot-scope="scope">
          {{ scope.row.redemption_event_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--From date-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_redemption_table_from_lable')" align="center" prop="effective_from_day" min-width="130">
        <template slot-scope="scope">
          {{ scope.row.effective_from_day || table_placeholder }}
        </template>
      </el-table-column>
      <!--To date-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_redemption_table_to_lable')" align="center" prop="effective_to_day" min-width="140">
        <template slot-scope="scope">
          {{ scope.row.effective_to_day || table_placeholder }}
        </template>
      </el-table-column>
      <!--Gift name / Coupon name -->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_redemption_table_gift_coupon_lable')" align="center" prop="redemption_reward_name" min-width="180">
        <template slot-scope="scope">
          {{ scope.row.redemption_reward_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Number of redeemed items-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_redemption_table_items_lable')" align="center" prop="total_items" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.total_items || table_placeholder }}
        </template>
      </el-table-column>
      <!--Amount of redeemed points-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_redemption_table_amount_lable')" align="center" prop="total_points" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.total_points || table_placeholder }}
        </template>
      </el-table-column>
      <!--Members who redeemed-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_redemption_table_members_lable')" align="center" prop="redeem_member_count" min-width="180">
        <template slot-scope="scope">
          {{ scope.row.redeem_member_count || table_placeholder }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { memberRedemptionReport } from '@/api/report'
  import { member_redemption_data } from '@/data/reporting'
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
          this.handleDWMemberRedemptionReport(obj)
        } else {
          this.handleFakeRedemptionReport()
        }
      },
      handleFakeRedemptionReport() {
        var _this = this
        setTimeout(() => {
          _this.table_data = member_redemption_data
          _this.table_loading = false
        }, 1000)
      },
      // DW-会员兑换报表
      handleDWMemberRedemptionReport(obj) {
        memberRedemptionReport(obj).then(res => {
          this.table_loading = false
          this.table_data = res.return_result || []
        }).catch(() => {
          this.table_loading = false
        })
      },
      exportMemberRedemptionReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.handleGlobalI18n('loyalty', 'redemption_event_name'), this.handleGlobalI18n('reporting', 'from_date'), this.handleGlobalI18n('reporting', 'to_date'), this.handleGlobalI18n('reporting', 'gift_name_or_coupon_name'), this.handleGlobalI18n('reporting', 'number_of_redeemed_items'), this.handleGlobalI18n('reporting', 'amount_of_redeemed_points'), this.handleGlobalI18n('reporting', 'member_who_redeemed')]
          const filterVal = ['redemption_event_name', 'effective_from_day', 'effective_to_day', 'redemption_reward_name', 'total_items', 'total_points', 'redeem_member_count']
          const list = this.tableData5
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.handleGlobalI18n('reporting', 'member_redemption_report')}-${Date.parse(new Date())}`,
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
