<!--
  2019/10/23
  会员优惠券报表
-->
<template>
  <div class="members-coupon-report-4" ref="members-coupon-report-4">
    <el-table :data="table_data" border v-loading='table_loading' :empty-text="$t('member.fc_table_no_data_label')">
      <!--Coupon name-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_coupon_table_name_lable')" align="center" prop='coupon_name' min-width="140">
        <template slot-scope="scope">
          {{ scope.row.coupon_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Coupon type-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_coupon_table_type_lable')" align="center" prop="coupon_type_name" min-width="115">
        <template slot-scope="scope">
          {{ scope.row.coupon_type_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Number of redeemed coupons-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_coupon_table_redeemed_lable')" align="center" prop="normal_coupon" min-width="225">
        <template slot-scope="scope">
          {{ scope.row.normal_coupon || 0 }}
        </template>
      </el-table-column>
      <!--Number of used coupons-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_coupon_table_used_lable')" align="center" prop="used_coupon" min-width="220">
        <template slot-scope="scope">
          {{ scope.row.used_coupon || 0 }}
        </template>
      </el-table-column>
      <!--Number of expired coupons-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_coupon_table_expired_lable')"  align="center" prop="expired_coupon" min-width="210">
        <template slot-scope="scope">
          {{ scope.row.expired_coupon || 0 }}
        </template>
      </el-table-column>
      <!--Rate of coupon related sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_coupon_table_rate_lable')" align="center" prop="issued_coupon" min-width="230">
        <template slot-scope="scope">
          {{ scope.row.issued_coupon || 0 }}
        </template>
      </el-table-column>
      <!--Coupon related sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_coupon_table_sales_lable')" align="center" prop="total_amount" min-width="230">
        <template slot-scope="scope">
          {{ scope.row.total_amount || 0 }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { memberCouponReport } from '@/api/report'
  import { member_coupon_data } from '@/data/reporting'
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
          this.handleDWMemberCouponReport(obj)
        } else {
          this.handleFakeMemberRecruitmentReport1()
        }
      },
      handleFakeMemberRecruitmentReport1() {
        var _this = this
        setTimeout(() => {
          _this.table_data = member_coupon_data
          _this.table_loading = false
        }, 1000)
      },
      // DW-会员券报表
      handleDWMemberCouponReport(obj) {
        memberCouponReport(obj).then(res => {
          this.table_loading = false
          this.table_data = res.return_result || []
        }).catch(() => {
          this.table_loading = false
        })
      },
      exportMemberCouponReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.handleGlobalI18n('reporting', 'coupon_name'), this.handleGlobalI18n('reporting', 'coupon_type'), this.handleGlobalI18n('reporting', 'number_of_redeemed_coupons'), this.handleGlobalI18n('reporting', 'number_of_used_coupons'), this.handleGlobalI18n('reporting', 'number_of_expired_coupons'), this.handleGlobalI18n('reporting', 'rate_of_coupon_issued'), this.handleGlobalI18n('reporting', 'coupon_related_sales')]
          const filterVal = ['coupon_name', 'coupon_type_name', 'normal_coupon', 'used_coupon', 'expired_coupon', 'issued_coupon', 'total_amount']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.handleGlobalI18n('reporting', 'member_coupon_report')}-${Date.parse(new Date())}`,
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
