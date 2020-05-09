<template>
  <div class="transactions" >
    <ed-header-title :title="$t('member.fc_member_details_transactions_section_title')" />
    <div v-loading="loading">
      <div class="rows">
        <el-row class="list1">
          <el-col :xs="8" :sm="8" :lg="8" v-for="item in switchover" :key="item.value">
            <div :class="{'select-before':state===item.value}" @click.stop="state = item.value">
              <label>{{$t(`member.${item.name}`)}}</label>
            </div>
          </el-col>
        </el-row>
        <!--overall-->
        <el-row class="overall" v-if="state===1">
          <el-col :span="8">
            <label>{{$t('member.fc_member_details_transactions_overall_title1_label')}}</label>
            <h2>{{formatMonty2(memberKpi.average_items || 0)}}</h2>
            <label>{{$t('member.fc_member_details_transactions_overall_title1_introduction_label')}}</label>
          </el-col>
          <el-col :span="8">
            <label>{{$t('member.fc_member_details_transactions_overall_title2_label')}}</label>
            <h2 class="flex"><label class="label">{{globalData.value.currency_symbol}}</label>{{formatMonty2(memberKpi.average_basket || 0)}}</h2>
            <label>{{$t('member.fc_member_details_transactions_overall_title2_introduction_label')}}</label>
          </el-col>
          <el-col :span="8">
            <label>{{$t('member.fc_member_details_transactions_overall_title3_label')}}</label>
            <h2 class="flex"><label class="label">{{globalData.value.currency_symbol}}</label>{{formatMonty2(memberKpi.accumulative_payment || 0)}}
            </h2>
            <label>{{$t('member.fc_member_details_transactions_overall_title3_introduction_label')}}</label>
          </el-col>
        </el-row>
        <!--RFM-->
        <div class="rfm" v-else-if="state===2">
          <el-col :span="8">
            <label class="explain">{{$t('member.fc_member_details_transactions_rfm_recency_label')}}</label>
            <h2>
              <span v-html="formatMonty(memberKpi.rfm_lastest_purchase_time || 0)"></span>
              <label class="label">{{$t('member.fc_member_details_transactions_rfm_recency_personal_label')}}</label>
              <span>/</span><span v-html="formatMonty(tenantKpi.rfm_lastest_purchase_time || 0)"></span>
              <label class="label">{{$t('member.fc_member_details_transactions_rfm_recency_average_label')}}</label>
            </h2>
          </el-col>
          <el-col :span="8">
            <label class="explain">{{$t('member.fc_member_details_transactions_rfm_frequency_label')}}</label>
            <h2>
              <span v-html="formatMonty(memberKpi.rfm_purchase_frequency || 0)"></span>
              <label class="label">{{$t('member.fc_member_details_transactions_rfm_frequency_personal_label')}}</label>
              <span>/</span><span v-html="formatMonty(tenantKpi.rfm_purchase_frequency || 0)"></span>
              <label class="label">{{$t('member.fc_member_details_transactions_rfm_frequency_average_label')}}</label></h2>
          </el-col>
          <el-col :span="8">
            <label class="explain">{{$t('member.fc_member_details_transactions_rfm_value_label')}}</label>
            <h2>
              <label class="label1">{{globalData.value.currency_symbol}}</label>
              <span v-html="formatMonty(memberKpi.rfm_total_spend || 0)"></span>
              <label class="label">{{$t('member.fc_member_details_transactions_rfm_value_personal_label')}}</label>
              <span>/</span>
              <label class="label1">{{globalData.value.currency_symbol}}</label>
              <span v-html="formatMonty(tenantKpi.rfm_total_spend || 0)"></span>
              <label class="label">{{$t('member.fc_member_details_transactions_rfm_value_average_label')}}</label>
            </h2>
          </el-col>
        </div>
        <!--Recent transactions-->
        <div class="recent-transactions" v-else-if="state===3">
          <el-table :data="tableData" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
            <!--Purchase date-->
            <el-table-column prop="purchase_date" align="center" :label="$t('member.fc_member_details_transactions_recent_table_data_label')" min-width="100">
              <template slot-scope="scope">
                {{scope.row.purchase_date ? globalData.formatDate((scope.row.purchase_date).substring(0, 10)) : table_placeholder }}
              </template>
            </el-table-column>
            <!--Store name-->
            <el-table-column prop="store_name" align="center" :label="$t('member.fc_member_details_transactions_recent_table_name_label')" min-width="100">
              <template slot-scope="scope">
                {{(scope.row.store_code && scope.row.store_name) ? (scope.row.store_code + '-' + scope.row.store_name) : table_placeholder }}
              </template>
            </el-table-column>
            <!--Channel-->
            <el-table-column prop="channel_name" align="center"  :label="$t('member.fc_member_details_transactions_recent_table_channel_label')" min-width="100px">
              <template slot-scope="scope">
                {{ scope.row.channel_resources_key ? $t(`reporting.${scope.row.channel_resources_key }`) : scope.row.channel_name }}
              </template>
            </el-table-column>
            <!--Payment type-->
            <el-table-column prop="transaction_type_name" align="center" :label="$t('member.fc_member_details_transactions_recent_table_type_label')" min-width="110px">
              <template slot-scope="scope">
                {{scope.row.transaction_type_name || table_placeholder }}
              </template>
            </el-table-column>
            <!--Amount-->
            <el-table-column prop="total_amount" align="center" :label="$t('member.fc_member_details_transactions_recent_table_amount_label')" min-width="80px">
              <template slot-scope="scope">
                {{scope.row.total_amount || table_placeholder }}
              </template>
            </el-table-column>
            <!--Eared points-->
            <el-table-column prop="earned_points" align="center" :label="$t('member.fc_member_details_transactions_recent_table_points_label')" min-width="110px">
              <template slot-scope="scope">
                {{scope.row.earned_points}}
              </template>
            </el-table-column>
            <!--Total quantity-->
            <el-table-column prop="total_quantity" align="center" :label="$t('member.fc_member_details_transactions_recent_table_items_label')" min-width="60px">
              <template slot-scope="scope">
                {{scope.row.total_quantity || table_placeholder }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="line"></div>
      <div class="charts">
        <div style="display: flex; flex:1;">
          <bar-charts style="flex:0 0 60%;" :chart-data="lineChartData" />
          <!--<line-charts style="flex:0 0 70%" :chart-data="lineChartData"></line-charts>-->
          <!--<redar-charts style="flex: 0 0 40%" :chart-data="channel_chart_data"></redar-charts>-->
          <transaction-channel-chart style="flex: 0 0 40%" :chart-data="channel_chart_data" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // import RedarCharts from '@/components/RedarCharts'
  import BarCharts from './barcharts'
  import { getMemberChannelKPI, getMemberKPI, getMemberMonthlyKPI, getTenantKPI } from '@/api/kpi'
  import { getMemberTransactionList } from '@/api/member'
  import { getMemberKpi } from '@/api/dwKpi'
  import { isDWAccessKpi } from '@/utils'
  import TransactionChannelChart from './transaction-channel-chart'
  import {
    formatMonty,
    formatMonty2
  } from '@/utils'
  import { checkObjHasOwnProperty } from '@/utils'
  export default {
    props: {
      member_code: {
        type: String
      },
      member_id: {
        type: String | Number,
        default: ''
      }
    },
    watch: {
      member_id() {
        this.init()
      }
    },
    components: {
      BarCharts,
      // RedarCharts,
      TransactionChannelChart
      // CountTo
    },
    data() {
      return {
        switchover: [{
          value: 1,
          name: 'fc_member_details_transactions_overall_label'
        }, {
          value: 2,
          name: 'fc_member_details_transactions_rfm_label'
        }, {
          value: 3,
          name: 'fc_member_details_transactions_recent_label'
        }],
        form: {
          year: ''
        },
        loading: true,
        listLoading: false,
        tableData: [],
        state: 1,
        lineChartData: { thisYearData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], lastYearData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        memberKpi: '',
        tenantKpi: '',
        channel_chart_data: {
          indicator: [],
          value: []
        }
      }
    },
    created() {
      // this.init()
      // recent transactions
      this.recentTransactions()
      // transaction channel
      this.getTransactionChannelKpi()
    },
    methods: {
      formatMonty,
      formatMonty2,
      isDWAccessKpi,
      init() {
        if (this.isDWAccessKpi()) {
          this.getDwKpi()
        } else {
          this.handleSecondData()
        }
      },
      getDwKpi() {
        getMemberKpi({ member_id: this.member_id }).then(res => {
          const data = res.return_result
          this.loading = false
          this.memberKpi = {
            average_items: data.average_items,
            average_basket: data.average_basket,
            accumulative_payment: data.accumulative_payment,
            rfm_lastest_purchase_time: data.member_recency,
            rfm_lasetet_purchase_frequence: data.member_frequency,
            rfm_total_spend: data.member_montary_value
          }
          this.tenantKpi = {
            rfm_lastest_purchase_time: data.tenant_recency,
            rfm_purchase_frequency: data.tenant_frequency,
            rfm_total_spend: data.tenant_montary_value
          }
          const kpis = data.member_transation
          var newData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          var lastData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          if (kpis !== null && kpis.length > 0) {
            for (const item of kpis[0]) {
              newData[item.transaction_month] = item.sum_amount
            }
          }
          if (kpis !== null && kpis.length > 1) {
            for (const item of kpis[1]) {
              lastData[item.transaction_month] = item.sum_amount
            }
          }
          this.lineChartData = {
            thisYearData: newData,
            lastYearData: lastData
          }
          this.$emit('getLatestPurchaseDate', data.lastest_purchase_date)
        })
      },
      async handleSecondData() {
        try {
          // member kpi
          await this.getMemberKpi()
          // tenant kpi
          await this.getTenantKpi()
          // member transaction
          await this.getMemberTransaction()
        } catch (err) {
          this.loading = false
        }
      },
      // member kpi
      getMemberKpi() {
        getMemberKPI(this.member_code).then(response => {
          this.memberKpi = response.return_result
          this.$emit('getLatestPurchaseDate', this.memberKpi.lastest_purchase_date)
        }).catch(() => {
          this.loading = false
        })
      },
      // tenant kpi
      getTenantKpi() {
        getTenantKPI().then(response => {
          this.tenantKpi = response.return_result
        }).catch(() => {
          this.loading = false
        })
      },
      // recent transaction list
      recentTransactions() {
        getMemberTransactionList({
          member_code: this.member_code,
          page_no: 1,
          page_size: 4
        }).then(res => {
          const result = res.return_result
          if (!checkObjHasOwnProperty(result, 'transactions')) {
            return false
          }
          this.tableData = result.transactions
        }).catch(() => {
          this.loading = false
        })
      },
      // channel kpi
      getTransactionChannelKpi() {
        getMemberChannelKPI(this.member_code).then(res => {
          this.loading = false
          const result = res.return_result
          if (!checkObjHasOwnProperty(result, 'kpis')) {
            return false
          }
          const kpis = result.kpis
          var max = 0
          for (const item of kpis) {
            max = item.purchase_times > max ? item.purchase_times : max
          }
          // var _this = this
          for (const item of kpis) {
            this.channel_chart_data.indicator.push(this.$t(`reporting.${item.channel_name}`))
            this.channel_chart_data.value.push(item.purchase_times)
          }
        }).catch(() => {
          this.loading = false
        })
      },
      // line charts member transaction kpi
      getMemberTransaction() {
        getMemberMonthlyKPI({ member_code: this.member_code, year: new Date().getFullYear() }).then(res => {
          const result = res.return_result
          if (!checkObjHasOwnProperty(result, 'kpis')) {
            return false
          }
          const kpis = result.kpis
          const newData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          if (kpis !== null) {
            for (const item of kpis) {
              newData[item.month] = item.transaction_amount
            }
          }
          this.lineChartData = newData
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .transactions {
    z-index: 2;
    margin-top: 20px;
    font-size: 16px;
    .p {
      line-height: 30px;
      height: 30px;
      padding-left: 10px;
      border-bottom: 1px solid #C3C3C3;
      font-size: 18px;
      color: #888888;
    }
    .rows {
      background: #ffffff;
      .list1 {
        height: 50px;
        box-shadow: 0 6px 5px rgba(204, 204, 204, 0.349019607843137);
        .el-col {
          line-height: 50px;
          text-align: center;
          label {
            font-size: 18px;
          }
          color: #ffffff;
          background-color: #7cacff;
          &:not(:last-child) {
            position: relative;
            &:after {
              content: '';
              position: absolute;
              height: 100%;
              width: 1px;
              background: $primary;
              top: 0;
              bottom: 0;
              margin: auto;
              right: 0;
            }
          }
        }
        .select-before {
          background-color: $primary;
          position: relative;
          &:before {
            content: '';
            bottom: -10px;
            left: 0;
            right: 0;
            margin: auto;
            position: absolute;
            display: inline-block;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 10px;
            border-color: $primary $primary transparent transparent;
            transform: rotate(135deg);
            box-shadow: 5px -5px 5px rgba(204, 204, 204, 0.349019607843137);
          }
        }
      }
      .overall, .rfm {
        margin-top: 2px;
        padding-bottom: 40px;
        padding-top: 45px;
        text-align: center;
        h2 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .flex {
          /* display: flex;
           align-items: flex-start;
           justify-content: center;*/
        }
        span {
          padding: 0 5px;
        }
        label {
          color: #aaaaaa;
          font-size: 16px;
        }
        .explain {
          color: #aeaeae;
          line-height: 2;
        }
        .label1 {
          font-size: 20px;
          padding-right: 4px;
        }
      }
      .overall {
        .label {
          padding-right: 5px;
        }
      }
      .rfm {
        display: table;
        width: 100%;
      }
      .recent-transactions {
        padding: 20px;
      }
    }
    .line {
      height: 1px;
      background-color: #ffffff;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 20px;
        right: 20px;
        border-bottom: 1px dashed #bbbbbb;
      }
    }
    .charts {
      background-color: #ffffff;
    }
  }
</style>
