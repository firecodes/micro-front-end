<!--
  2019/12/03
  Business report-Channel Sales
-->
<template>
  <div class="channel_sales_19" ref="channel_sales_19">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
      <!--Channel-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_sales_table_channel_lable')" align="center" min-width="130" prop="channel">
        <template slot-scope="scope">
          <template v-if="scope.row.channel === '99999'">
            Total
          </template>
          <template v-else>
            {{ scope.row.channel ? $t(`reporting.${scope.row.channel}`) : table_placeholder }}
          </template>
        </template>
      </el-table-column>
      <!--Total sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_sales_table_total_lable')" align="center" min-width="130"  prop="total_sales">
        <template slot-scope="scope">
          {{ globalData.value.currency_symbol + ' ' + globalData.formatNumber(scope.row.total_sales || 0, 2) }}
        </template>
      </el-table-column>
      <!--Total member sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_sales_table_member_lable')" align="center" min-width="150" prop="total_member_sales">
        <template slot-scope="scope">
          {{ globalData.value.currency_symbol + ' ' + globalData.formatNumber(scope.row.total_member_sales || 0, 2) }}
        </template>
      </el-table-column>
      <!--Total non-member-sales-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_sales_table_non_member_lable')" align="center" min-width="190" prop="total_non_member_sales">
        <template slot-scope="scope">
          {{ globalData.value.currency_symbol + ' ' + globalData.formatNumber(scope.row.total_non_member_sales || 0, 2) }}
        </template>
      </el-table-column>
      <!--Average basket size-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_sales_table_ab_lable')" align="center" min-width="165" prop="average_basket">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.average_basket || 0, 2) }}
        </template>
      </el-table-column>
      <!--Average member basket size-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_sales_table_member_ab_lable')" align="center" min-width="220" prop="average_member_basket">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.average_member_basket || 0, 2) }}
        </template>
      </el-table-column>
      <!--Average non member basket size-->
      <el-table-column :label="$t('reporting.fc_reporting_oneclick_channel_sales_table_non_member_ab_lable')" align="center" min-width="250" prop="average_non_member_basket">
        <template slot-scope="scope">
          {{ globalData.formatNumber(scope.row.average_non_member_basket || 0, 2) }}
        </template>
      </el-table-column>
    </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { channelSales } from '@/api/report'
  import { channel_sales_19 } from '@/data/reporting'
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
      handleClickChannelSales(obj, source) {
        this.table_loading = true
        if (source === 'dw') {
          channelSales(obj).then(res => {
            this.table_loading = false
            var result = res.return_result
            this.table_data = result.list_channel_sales || []
            if (this.table_data.length > 0) {
              this.table_data.push({ 'channel': '99999', 'total_sales': result.aggregate_sales, 'total_member_sales': result.aggregate_member_sales, 'total_non_member_sales': result.aggregate_non_member_sales, 'average_basket': result.aggregate_basket, 'average_member_basket': result.aggregate_member_basket, 'average_non_member_basket': result.aggregate_non_member_basket })
            }
          }).catch(res => {
            this.table_loading = false
            this.$message.error(this.handleGlobalI18n('reporting', 'error'))
          })
        } else {
          var _this = this
          setTimeout(() => {
            _this.table_data = channel_sales_19
            _this.table_loading = false
          }, 1000)
        }
      },
      exportChannelSalesReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.$t('reporting.fc_reporting_oneclick_channel_sales_table_channel_lable'), this.$t('reporting.fc_reporting_oneclick_channel_sales_table_total_lable'), this.$t('reporting.fc_reporting_oneclick_channel_sales_table_member_lable'), this.$t('reporting.fc_reporting_oneclick_channel_sales_table_non_member_lable'), this.$t('reporting.fc_reporting_oneclick_channel_sales_table_ab_lable'), this.$t('reporting.fc_reporting_oneclick_channel_sales_table_member_ab_lable'), this.$t('reporting.fc_reporting_oneclick_channel_sales_table_non_member_ab_lable')]
          const filterVal = ['channel', 'total_sales', 'total_member_sales', 'total_non_member_sales', 'average_basket', 'average_member_basket', 'average_non_member_basket']
          const list = this.table_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.$t('reporting.fc_reporting_oneclick_search_type_menu11_lable')}-${Date.parse(new Date())}`
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'channel') {
            return v[j] === '99999' ? 'Total' : v[j] ? this.$t(`reporting.${v[j]}`) : this.table_placeholder
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
