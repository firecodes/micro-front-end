<!--
 2020/02/19
 Tier Upgrade
-->
<template>
  <div class="tier_upgrade_23" ref="tier_upgrade_23">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
        <el-table-column :key="item.member_tier_id" :label="$t(`reporting.${item.member_tier_name}`)" :prop="item.prop" align="center" min-width="130" v-for="item in columns_list_data">
          <template slot-scope="scope">
            <template v-if="(scope.row)['current_tier'] === item.member_tier_name">
              {{ table_placeholder }}
            </template>
            <template v-else-if="item.member_tier_id  !== '-999999'">
              {{ globalData.formatNumber((scope.row)[item.prop] || 0, 0) }}
            </template>
            <template v-else>
              {{ (scope.row)[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { tierUpgrade } from '@/api/report'
  import { tier_upgrade_23 } from '@/data/reporting'
  export default {
    data() {
      return {
        table_data: [],
        table_loading: false,
        columns_list_data: []
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
          tierUpgrade(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.columns_list_data = result.columns_list || []
            var c_data = []
            if (result.columns_list && result.columns_list.length > 0) {
              c_data = [{ member_tier_name: 'fc_reporting_oneclick_tier_upgrade_table_upgrade_lable', member_tier_id: '-999999', prop: 'current_tier' }].concat(result.columns_list)
              for (var id in c_data) {
                if (c_data[id].member_tier_id === '-999999') {
                  continue
                }
                c_data[id].prop = c_data[id].member_tier_name
              }
              this.columns_list_data = c_data
            }
            this.table_data = result.json_data_array || []
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.columns_list_data = tier_upgrade_23.columns_list
            _this.table_data = tier_upgrade_23.json_data_array
            _this.table_loading = false
          }, 1000)
        }
      },
      export() {
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader = []
          var filterVal = []
          for (var item of this.columns_list_data) {
            tHeader.push(this.$t(`reporting.${item.member_tier_name}`))
            filterVal.push(item.prop)
          }
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu16_lable')}-${Date.parse(new Date())}`
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j.indexOf(v['current_tier']) !== -1) {
            return this.table_placeholder
          }
          return v[j]
        }
        ))
      }
    }
  }
</script>
