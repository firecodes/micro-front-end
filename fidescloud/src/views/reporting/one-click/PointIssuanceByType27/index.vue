<!--
 20200.03.18
 Point Issuance by type
-->
<template>
  <div ref="point_issuance_by_type_27">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
        <!--Type-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_points_issuance_table_type_lable')" align="center" min-width="130" prop="point_type_name">
          <template slot-scope="scope">
            <template v-if="scope.row.point_type_name === '99999'">
              Total
            </template>
            <template v-else>
              {{ $t(`member.${scope.row.point_type_name}`) || table_placeholder }}
            </template>
          </template>
        </el-table-column>
        <!--Total Issued points-->
        <el-table-column :label="$t('reporting.fc_reporting_oneclick_points_issuance_table_points_lable')" align="center" min-width="150" prop="issued_points">
          <template slot-scope="scope">
            {{ globalData.formatNumber(scope.row.issued_points || 0, 0) }}
          </template>
        </el-table-column>
      </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { pointsIssuance } from '@/api/report'
  import { point_issuance_data_27 } from '@/data/reporting'
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
      handleClick(obj, source) {
        this.table_loading = true
        if (source === 'dw') {
          pointsIssuance(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.points_issuance_list || []
            if (this.table_data.length > 0) {
              this.table_data.push({
                'point_type_name': '99999',
                'issued_points': result.total_issued_points || 0
              })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = point_issuance_data_27
            _this.table_loading = false
          }, 1000)
        }
      },
      export() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_points_issuance_table_type_lable'), this.$t('reporting.fc_reporting_oneclick_points_issuance_table_points_lable')]
          const filterVal = ['point_type_name', 'issued_points']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu14_lable')}-${Date.parse(new Date())}`
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'point_type_name') {
            return v[j] === '99999' ? 'Total' : this.$t(`member.${v[j]}`)
          } else {
            return v[j] || 0
          }
        }))
      }
    }
  }
</script>
