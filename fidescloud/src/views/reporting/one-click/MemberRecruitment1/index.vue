<!--
  2019/10/22
  会员招募报表1
-->
<template>
  <div class="members-recruitment-report-1" ref="members-recruitment-report-1">
    <el-table :data="table_data" border v-loading='table_loading' :empty-text="$t('member.fc_table_no_data_label')">
      <!--Store name-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_name_lable')" align="center" prop='store_name' min-width="135">
        <template slot-scope="scope">
          {{ scope.row.store_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Number of new member-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_numbers_new_lable')" align="center" prop="new_member" min-width="185">
        <template slot-scope="scope">
          {{ scope.row.new_member || table_placeholder }}
        </template>
      </el-table-column>
      <!--Numbers of new member sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_new_sales_lable')" align="center" prop="new_member_sales" min-width="220">
        <template slot-scope="scope">
          {{ scope.row.new_member_sales || table_placeholder }}
        </template>
      </el-table-column>
      <!--Total amount of new members sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_total_new_lable')"  align="center" prop="new_member_sales_count" min-width="245">
        <template slot-scope="scope">
          {{ scope.row.new_member_sales_count || table_placeholder }}
        </template>
      </el-table-column>
      <!--Numbers of existing member-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_numbers_existing_lable')" align="center" prop="old_member" min-width="210">
        <template slot-scope="scope">
          {{ scope.row.old_member || table_placeholder }}
        </template>
      </el-table-column>
      <!--Total amount of existing member sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_existing_sales_lable')"  align="center" prop="old_member_sales" min-width="240">
        <template slot-scope="scope">
          {{ scope.row.old_member_sales || table_placeholder }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_total_existing_lable')" align="center" prop="old_member_sales_count" min-width="265">
        <template slot-scope="scope">
          {{ scope.row.old_member_sales_count || table_placeholder }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { memberRecruitmentReport } from '@/api/report'
  import { recruitment_member_data, recruitment_member_data_cn } from '@/data/reporting'
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
          this.handleDwMemberRecruitmentReport(obj)
        } else {
          this.handleFakeMemberRecruitmentReport1()
        }
      },
      handleFakeMemberRecruitmentReport1() {
        var _this = this
        setTimeout(() => {
          _this.table_data = recruitment_member_data
          // 如果是中文的 显示中文数据
          if (_this.globalData.value.currency_symbol === '￥') {
            _this.table_data = recruitment_member_data_cn
          }
          _this.table_loading = false
        }, 1000)
      },
      // DW-新招募会员报表
      handleDwMemberRecruitmentReport(obj) {
        memberRecruitmentReport(obj).then(res => {
          this.table_data = res.return_result
          this.table_loading = false
        }).catch(() => {
          this.table_loading = false
        })
      },
      exportMemberRecruitmentReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.handleGlobalI18n('reporting', 'store_name'), this.handleGlobalI18n('reporting', 'numbers_of_new_member'), this.handleGlobalI18n('reporting', 'numbers_of_new_member_sales'), this.handleGlobalI18n('reporting', 'total_amount_of_new_member_sales'), this.handleGlobalI18n('reporting', 'number_of_existing_member'), this.handleGlobalI18n('reporting', 'number_of_existing_member_sales'), this.handleGlobalI18n('reporting', 'total_amount_of_existing_member_sales')]
          const filterVal = ['store_name', 'new_member', 'new_member_sales', 'new_member_sales_count', 'old_member', 'old_member_sales', 'old_member_sales_count']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.handleGlobalI18n('reporting', 'member_recruitment_report')}-${Date.parse(new Date())}`,
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
