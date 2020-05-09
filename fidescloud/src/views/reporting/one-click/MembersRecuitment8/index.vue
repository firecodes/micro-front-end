<!--
  2019/10/22
  会员招募报表
-->
<template>
  <div class="members-recruitment-report-8" ref="members-recruitment-report-8">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Registration channel-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_channel_lable')" align="center" min-width="120" prop="registration_channel">
        <template slot-scope="scope">
          <template v-if="scope.row.registration_channel === '99999'">
            Total
          </template>
          <template v-else>
            {{ scope.row.registration_channel ? $t(`reporting.${scope.row.registration_channel}`) : table_placeholder }}
          </template>
        </template>
      </el-table-column>
      <!--Registration region-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_region_lable')" align="center" min-width="130" prop="registration_region">
        <template slot-scope="scope">
          {{ scope.row.registration_region || table_placeholder }}
        </template>
      </el-table-column>
      <!--Registration store-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_store_lable')" align="center" min-width="150" prop="registration_store">
        <template slot-scope="scope">
          {{ scope.row.registration_store || table_placeholder }}
        </template>
      </el-table-column>
      <!--New members-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_new_lable')" align="center" min-width="170" prop="new_members">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.new_members || 0, 0) }}
        </template>
      </el-table-column>
      <!--Existing members-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_recruitment_table_existing_lable')" align="center" min-width="130" prop="existing_members">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.existing_members || 0, 0) }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { getMemberRecruitment } from '@/api/report'
  import { members_recruitment_data } from '@/data/reporting'
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
      handleClickGetMembersRecruitment(obj, data, source) {
        this.table_loading = true
        if (source === 'dw') {
          getMemberRecruitment(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.member_recuitment_list || []
            if (this.table_data.length > 0) {
              this.table_data.push({ 'registration_channel': '99999', 'registration_region': '', 'registration_store': '', 'new_members': result.total_new_members, 'existing_members': result.total_existing_members })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = members_recruitment_data
            _this.table_loading = false
          }, 1000)
        }
      },
      exportMemberRecruitmentReport() {
        import('@/vendor/Export2Excel').then(excel => {
          // ['Registration Channel', 'Registration Region', 'Registration Store', 'New Members', 'Existing Members']
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_recruitment_table_channel_lable'), this.$t('reporting.fc_reporting_oneclick_recruitment_table_region_lable'), this.$t('reporting.fc_reporting_oneclick_recruitment_table_store_lable'), this.$t('reporting.fc_reporting_oneclick_recruitment_table_new_lable'), this.$t('reporting.fc_reporting_oneclick_recruitment_table_existing_lable')]
          const filterVal = ['registration_channel', 'registration_region', 'registration_store', 'new_members', 'existing_members']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu1_lable')}-${Date.parse(new Date())}`
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'registration_channel') {
            return v[j] === '99999' ? 'Total' : v[j] ? this.$t(`reporting.${v[j]}`) : this.table_placeholder
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
