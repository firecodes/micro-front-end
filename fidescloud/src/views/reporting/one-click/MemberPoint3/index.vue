<!--
  2019/10/23
  会员积分报表3
-->
<template>
  <div class="members-point-report-3" ref="members-point-report-3">
    <el-table :data="table_data" border v-loading='table_loading' :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column :label="handleGlobalI18n('reporting', 'total_members')" align="center" prop='total_members' min-width="95">
        <template slot-scope="scope">
          {{ scope.row.total_members || table_placeholder }}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('reporting', 'points_earned')" align="center" prop="points_earned" min-width="110">
        <template slot-scope="scope">
          {{ scope.row.points_earned || 0 }}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('reporting', 'used_points')" align="center" prop="used_points" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.used_points || 0 }}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('reporting', 'expired_points')" align="center" prop="expired_points" min-width="220">
        <template slot-scope="scope">
          {{ scope.row.expired_points || 0 }}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('reporting', 'points_balance')"  align="center" prop="points_balance" min-width="210">
        <template slot-scope="scope">
          {{ scope.row.points_balance || 0 }}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('reporting', 'total_sales')" align="center" prop="total_sales" min-width="230">
        <template slot-scope="scope">
          {{ scope.row.total_sales || 0 }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { memberPointReport } from '@/api/report'
  import { member_point_data } from '@/data/reporting'
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
      handleClickSearch(obj, data, source) {
        this.table_loading = true
        if (source === 'dw') {
          this.handleDWMemberPointReport(obj)
        } else {
          this.handleFakeMemberPointReport()
        }
      },
      handleFakeMemberPointReport() {
        var _this = this
        setTimeout(() => {
          _this.table_data = member_point_data
          _this.table_loading = false
        }, 1000)
      },
      handleDWMemberPointReport(data) {
        memberPointReport(data).then(res => {
          this.table_loading = false
          this.table_data = res.return_result.reports
        }).catch(() => {
          this.table_loading = false
        })
      },
      // 导出会员积分报表
      exportMemberPointReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.handleGlobalI18n('reporting', 'total_members'), this.handleGlobalI18n('reporting', 'points_earned'), this.handleGlobalI18n('reporting', 'used_points'), this.handleGlobalI18n('reporting', 'expired_points'), this.handleGlobalI18n('reporting', 'points_balance'), this.handleGlobalI18n('reporting', 'total_sales')]
          const filterVal = ['total_members', 'points_earned', 'used_points', 'expired_points', 'points_balance', 'total_sales']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.handleGlobalI18n('reporting', 'member_point_report')}-${Date.parse(new Date())}`,
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
