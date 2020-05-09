<!--
  2019/11/06
  会员等级
-->
<template>
  <div class="member-tier-11" ref="member-tier-11">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Tier-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_tier_table_tier_lable')" align="center" min-width="150" prop="member_tier_name">
        <template slot-scope="scope">
          <template v-if="scope.row.member_tier_name === '99999'">
            Total
          </template>
          <template v-else>
            {{ scope.row.member_tier_name || table_placeholder }}
          </template>
        </template>
      </el-table-column>
      <!--Total Members-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_tier_table_total_members_lable')" align="center" min-width="120" prop="total">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.total || 0, 0) }}
        </template>
      </el-table-column>
      <!--Total member %-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_tier_table_total_percent_lable')" align="center" min-width="140" prop="total_member_percentage">
        <template slot-scope="scope">
          {{ scope.row.total_member_percentage ? parseFloat(scope.row.total_member_percentage).toFixed(2) + '%' : '0%' }}
        </template>
      </el-table-column>
      <!--New member-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_tier_table_new_members_lable')" align="center" min-width="140" prop="new_members">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.new_members || 0, 0) }}
        </template>
      </el-table-column>
      <!--New member %-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_tier_table_new_percent_lable')" align="center" min-width="140" prop="new_member_percentage">
        <template slot-scope="scope">
          {{ scope.row.new_member_percentage ? parseFloat(scope.row.new_member_percentage).toFixed(2) + '%'  : '0%' }}
        </template>
      </el-table-column>
      <!--Existing members-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_tier_table_existing_members_lable')" align="center" min-width="140" prop="existing_members">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.existing_members || 0, 0) }}
        </template>
      </el-table-column>
      <!--Existing mebers %-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_tier_table_existing_percent_lable')" align="center" min-width="140" prop="existing_member_percentage">
        <template slot-scope="scope">
          {{ scope.row.existing_member_percentage ? parseFloat(scope.row.existing_member_percentage).toFixed(2) + '%' : '0%' }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { getMemberTier } from '@/api/report'
  import { member_tier_list_data } from '@/data/reporting'
  export default {
    data() {
      return {
        table_data: [],
        table_loading: false,
        member_sum: {
          total_member_sum: 0,
          new_member_sum: 0,
          existing_member_sum: 0
        }
      }
    },
    watch: {
      table_data() {
        this.$emit('handleExportButton', this.table_data.length > 0)
      }
    },
    methods: {
      handleClickGetMemberTier(data, source) {
        this.table_loading = true
        if (source === 'dw') {
          getMemberTier(data).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.member_tier_list || []
            if (this.table_data.length > 0) {
              this.handlePercentage()
              this.table_data.push({
                member_tier_name: '99999',
                total: result.total_members,
                total_member_percentage: this.member_sum.total_member_sum > 0 ? '100' : '0',
                new_members: result.total_new_members,
                new_member_percentage: this.member_sum.new_member_sum > 0 ? '100' : '0',
                existing_members: result.total_existing_members,
                existing_member_percentage: this.member_sum.existing_member_sum > 0 ? '100' : '0'
              })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = member_tier_list_data
            _this.table_loading = false
          }, 1000)
        }
      },
      handlePercentage() {
        this.table_data.map(item => {
          this.member_sum.total_member_sum += item.total_member_percentage
          this.member_sum.new_member_sum += item.new_member_percentage
          this.member_sum.existing_member_sum += item.existing_member_percentage
        })
      },
      exportMemberTierReport() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          // ['Tier', 'Total Member', 'Total Member %', 'New Members', 'New Member %', 'Existing Members', 'Existing Member %']
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_tier_table_tier_lable'), this.$t('reporting.fc_reporting_oneclick_tier_table_total_members_lable'), this.$t('reporting.fc_reporting_oneclick_tier_table_total_percent_lable'), this.$t('reporting.fc_reporting_oneclick_tier_table_new_members_lable'), this.$t('reporting.fc_reporting_oneclick_tier_table_new_percent_lable'), this.$t('reporting.fc_reporting_oneclick_tier_table_existing_members_lable'), this.$t('reporting.fc_reporting_oneclick_tier_table_existing_percent_lable')]
          const filterVal = ['member_tier_name', 'total', 'total_member_percentage', 'new_members', 'new_member_percentage', 'existing_members', 'existing_member_percentage']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu3_lable')}-${Date.parse(new Date())}`
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'member_tier_name') {
            return v[j] === '99999' ? 'Total' : v[j]
          } else if (j === 'total_member_percentage' || j === 'new_member_percentage' || j === 'existing_member_percentage') {
            return parseFloat(v[j]).toFixed(2) + '%' || '0%'
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
