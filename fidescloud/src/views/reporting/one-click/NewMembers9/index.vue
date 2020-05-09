<!--
  2019/10/22
  新会员报表
-->
<template>
  <div class="new-members-9" ref="new-members-9">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Registration channel-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_new_table_channel_lable')" align="center" min-width="150" prop="registration_channel">
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
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_new_table_region_lable')" align="center" min-width="150" prop="registration_region">
        <template slot-scope="scope">
          {{ scope.row.registration_region || table_placeholder }}
        </template>
      </el-table-column>
      <!--Registration store-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_new_table_store_lable')" align="center" min-width="160" prop="registration_store">
        <template slot-scope="scope">
          {{ scope.row.registration_store || table_placeholder }}
        </template>
      </el-table-column>
      <!--New members with purchase-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_new_table_purchased_lable')" align="center" min-width="220" prop="with_purchase">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.with_purchase || 0, 0) }}
        </template>
      </el-table-column>
      <!--New members without purchase-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_new_table_without_purchase_lable')" align="center" min-width="230" prop="without_purchase">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.without_purchase || 0, 0) }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { getNewMembers } from '@/api/report'
  import { new_members_list_data } from '@/data/reporting'
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
      handleClickGetNewMembers(obj, data, source) {
        this.table_loading = true
        if (source === 'dw') {
          getNewMembers(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.new_member_list || []
            if (this.table_data.length > 0) {
              this.table_data.push({
                'registration_channel': '99999',
                'registration_region': '',
                'registration_store': '',
                'with_purchase': result.total_new_members_with_purchase || 0,
                'without_purchase': result.total_new_members_without_purchase || 0
              })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = new_members_list_data
            _this.table_loading = false
          }, 1000)
        }
      },
      exportNewMembersReport() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          // ['Registration Channel', 'Registration Region', 'Registration Store', 'New Members With purchase', 'New Members Without purchase']
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_new_table_channel_lable'), this.$t('reporting.fc_reporting_oneclick_new_table_region_lable'), this.$t('reporting.fc_reporting_oneclick_new_table_store_lable'), this.$t('reporting.fc_reporting_oneclick_new_table_purchased_lable'), this.$t('reporting.fc_reporting_oneclick_new_table_without_purchase_lable')]
          const filterVal = ['registration_channel', 'registration_region', 'registration_store', 'with_purchase', 'without_purchase']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu2_lable')}-${Date.parse(new Date())}`
          })
          this.downloadLoading = false
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
