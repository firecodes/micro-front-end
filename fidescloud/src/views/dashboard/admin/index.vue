<template>
  <div class="dashboard-admin-container">
    <!--Members-->
    <member-analysis :bar_chart_data = "barChartData" :member_pie_data = "memberPieData" :tenant_detail = "tenantDetail" :tier_list="tier_list" :tier_pie_data = "tierPieData" />
    <!--Sales-->
    <sales :default_year = 'default_year' :query_year_data="query_year_data" :sale_blocks_title="sale_blocks_title" :sale_data="sale_data" @getKpiYear="getKpiYear" @salesClickData="salesClickData" />
    <!--Campaigns-->
    <campaign-analysis :campaign_data="campaign_data" :default_year = 'default_year' :query_year_data="query_year_data" @getKpiYear="getKpiYear" />
    <!--之前临时新增的coupon 我也不知道啥用-->
    <coupon :default_year = 'default_year' :query_year_data="query_year_data" :sale_blocks_title="sale_blocks_title" :sale_data="coupon_data" @getKpiYear="getKpiYear" @salesClickData="couponClickData" v-if="isCNLoginUser()" />
  </div>
</template>

<script>
  import MemberAnalysis from './components/MemberAnalysis' // 会员
  import Sales from './components/Sales' // 销售
  import CampaignAnalysis from './components/CampaignAnalysis' // 活动
  import Coupon from './components/Coupon' // 优惠券
  import { getTenantCampaignKPIYearly, getTenantKPIYearly, getTenantKPIMonthly, listTenantKPIMonthly, getTenantKPIByTier, getTenantKPI } from '@/api/kpi'
  import { checkObjHasOwnProperty, isDWAccessKpi, isCNLoginUser, decimal2FormatValue } from '@/utils'
  import { dwMixin } from './dw_access'
  export default {
    mixins: [dwMixin],
    components: {
      Sales,
      CampaignAnalysis,
      MemberAnalysis,
      Coupon
    },
    data() {
      return {
        width: 120,
        value2: true,
        campaign_data: {},
        tier_list: [],
        sale_data: {
          lineChartData: {
            thisYearData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            lastYearData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        },
        coupon_data: {
          lineChartData: {
            thisYearData: [100, 150, 140, 155, 180, 150, 150, 170, 150, 120, 120, 100],
            lastYearData: [50, 120, 130, 120, 130, 150, 110, 140, 100, 150, 50, 150]
          },
          total_sales: 51000000,
          total_sales_vs_last_month: 0.1369,
          total_sales_vs_last_year: 0.1624,
          member_sales: 888,
          member_sales_vs_last_month: 0.2052,
          member_sales_vs_last_year: 0.1511,
          average_basket: 12,
          average_basket_vs_last_month: 0.30,
          average_basket_vs_last_year: 0.8,
          average_items: 14,
          average_items_vs_last_month: 0.20,
          average_items_vs_last_year: 0.10
        },
        member_data: [],
        select_year: '',
        default_year: '',
        query_type: '',
        query_year_data: [],
        sale_blocks_data: [],
        sale_blocks_title: 'fc_home_sales_1st_section_title',
        sale_blocks_type: 'total_sales',
        barChartData: [],
        memberPieData: [],
        tenantDetail: {},
        tierPieData: []
      }
    },
    created() {
      var myDate = new Date()
      const nowYear = myDate.getFullYear()
      this.select_year = nowYear
      this.default_year = nowYear
      for (var i = 0; i < 2; i++) {
        this.query_year_data.push({ value: parseInt(this.select_year) - i })
      }
      this.init()
    },
    methods: {
      isCNLoginUser,
      isDWAccessKpi,
      decimal2FormatValue,
      init() {
        /*
        *   两种获取方式（根据配置来区分使用哪种）
        *   1. dw方式获取(getDwKpi)
        *   2. 原来的方式
        * */
        if (this.isDWAccessKpi()) {
          this.handleFirstData()
        } else {
          this.handleSecondData()
        }
        if (this.select_year === 2019) {
          this.coupon_data = {
            lineChartData: {
              thisYearData: [100, 150, 140, 155, 180, 150, 150, 170, 150, 120, 120, 100],
              lastYearData: [50, 120, 130, 120, 130, 150, 110, 140, 100, 150, 50, 150]
            },
            total_sales: 51000000,
            total_sales_vs_last_month: 0.1369,
            total_sales_vs_last_year: 0.1624,
            member_sales: 888,
            member_sales_vs_last_month: 0.2052,
            member_sales_vs_last_year: 0.1511,
            average_basket: 12,
            average_basket_vs_last_month: 0.30,
            average_basket_vs_last_year: 0.8,
            average_items: 14,
            average_items_vs_last_month: 0.20,
            average_items_vs_last_year: 0.10
          }
        } else {
          this.coupon_data = {
            lineChartData: {
              thisYearData: [80, 150, 120, 125, 100, 120, 120, 80, 150, 100, 100, 50],
              lastYearData: [30, 80, 70, 100, 110, 130, 70, 120, 80, 100, 50, 120]
            },
            total_sales: 40000000,
            total_sales_vs_last_month: 0.1269,
            total_sales_vs_last_year: 0.1124,
            member_sales: 425,
            member_sales_vs_last_month: 0.1552,
            member_sales_vs_last_year: 0.1211,
            average_basket: 10,
            average_basket_vs_last_month: 0.12,
            average_basket_vs_last_year: 0.4,
            average_items: 12,
            average_items_vs_last_month: 0.10,
            average_items_vs_last_year: 0.0840
          }
        }
      },
      // 初始化第二种方式获取数据
      async handleSecondData() {
        try {
          // campaign
          if (this.query_type === '' || this.query_type === 'campaign') {
            this.getCampaignKpiData()
          }
          if (this.query_type === '' || this.query_type === 'sale') {
            // sale
            // await this.handleKPIMonthly()
            await this.handleKPIYearly()
            await this.handleSalesBlockData()
            await this.initLineChat()
          }
          // member
          if (this.query_type === '') {
            this.handleTenantKpi()
            this.handleTierKpi()
          }
        } catch (err) {
          console.log(err)
        }
      },
      // 初始化sales 的图标
      initLineChat() {
        return new Promise((resolve, reject) => {
          if (this.sale_blocks_type === null) {
            this.sale_blocks_type = 'total_sales'
          }
          if (this.sale_blocks_title === null) {
            this.sale_blocks_title = 'fc_home_sales_1st_section_title'
          }
          this.sale_data.lineChartData = this.sale_blocks_data['year' + this.select_year][this.sale_blocks_type] || []
          resolve()
        })
      },
      // 获取campaign kpi
      getCampaignKpiData() {
        return getTenantCampaignKPIYearly(parseInt(this.select_year)).then(res => {
          var result = res.return_result
          this.campaign_data = {
            campaign_number: result.campaign_number,
            campaign_participants: result.campaign_participants,
            campaign_response_rate: (result.campaign_response_rate * 100).toFixed(2),
            campaign_sales: result.campaign_sales
          }
        })
      },
      // 获取sale  year
      handleKPIYearly() {
        return getTenantKPIYearly(parseInt(this.select_year)).then(res => {
          const data = res.return_result
          const data_length = Object.keys(data).length
          if (data_length > 0) {
            this.sale_data = { ...this.sale_data, ...res.return_result }
          } else {
            this.sale_data = Object.assign({}, { lineChartData: this.sale_data.lineChartData })
          }
        })
      },
      // Make 4 sales blocks on the homepage clickable with a dynamic graph
      handleSalesBlockData() {
        var select_year = this.select_year
        return listTenantKPIMonthly({ year: [select_year, select_year - 1] }).then(res => {
          var thisYearDataTotalSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          var lastYearDataTotalSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          var thisYearDataMemberSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          var lastYearDataMemberSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          var thisYearDataAverageBasket = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          var lastYearDataAverageBasket = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          var thisYearDataAverageItems = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          var lastYearDataAverageItems = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          if (checkObjHasOwnProperty(res.return_result, 'kpis')) {
            for (var val of res.return_result.kpis) {
              if (val.year === this.select_year) {
                thisYearDataTotalSales[val.month - 1] = val.total_sales
                // console.log(thisYearDataTotalSales)
                thisYearDataMemberSales[val.month - 1] = val.member_sales
                thisYearDataAverageBasket[val.month - 1] = val.average_basket
                thisYearDataAverageItems[val.month - 1] = val.average_items
              } else {
                lastYearDataTotalSales[val.month - 1] = val.total_sales
                lastYearDataMemberSales[val.month - 1] = val.member_sales
                lastYearDataAverageBasket[val.month - 1] = val.average_basket
                lastYearDataAverageItems[val.month - 1] = val.average_items
              }
            }
          }
          this.sale_blocks_data['year' + this.select_year] = {
            'total_sales': {
              'thisYearData': thisYearDataTotalSales,
              'lastYearData': lastYearDataTotalSales
            },
            'member_sales': {
              'thisYearData': thisYearDataMemberSales,
              'lastYearData': lastYearDataMemberSales
            },
            'average_basket': {
              'thisYearData': thisYearDataAverageBasket,
              'lastYearData': lastYearDataAverageBasket
            },
            'average_items': {
              'thisYearData': thisYearDataAverageItems,
              'lastYearData': lastYearDataAverageItems
            }
          }
        })
      },
      async handleKPIMonthly() {
        try {
          await this.kpiMonthlyYear(parseInt(this.select_year), 1)
          await this.kpiMonthlyYear(parseInt(this.select_year) - 1, -1)
        } catch (err) {
          console.log(err)
        }
      },
      // 获取sale month
      kpiMonthlyYear(year, state) {
        return getTenantKPIMonthly(year).then(res => {
          var newData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          if (checkObjHasOwnProperty(res.return_result, 'kpis')) {
            for (var val of res.return_result.kpis) {
              newData[val.month - 1] = val.member_sales
            }
          }
          if (state === 1) {
            this.sale_data.lineChartData.thisYearData = newData
          } else if (state === -1) {
            this.sale_data.lineChartData.lastYearData = newData
          }
        })
      },
      // 当活动选择不同年份的处理
      getKpiYear(year, query_type) {
        this.query_type = query_type
        this.select_year = year
        this.init()
      },
      // 处理点击sales
      salesClickData(type, title) {
        this.sale_blocks_title = title
        this.sale_blocks_type = type
        this.sale_data.lineChartData = this.sale_blocks_data['year' + this.select_year][this.sale_blocks_type] || []
      },
      couponClickData(type, title) {
        if (this.select_year === '2019') {
          this.coupon_data = {
            lineChartData: {
              thisYearData: [100, 150, 140, 155, 180, 150, 150, 170, 150, 120, 120, 100],
              lastYearData: [50, 120, 130, 120, 130, 150, 110, 140, 100, 150, 50, 150]
            },
            total_sales: 51000000,
            total_sales_vs_last_month: 0.1369,
            total_sales_vs_last_year: 0.1624,
            member_sales: 888,
            member_sales_vs_last_month: 0.2052,
            member_sales_vs_last_year: 0.1511,
            average_basket: 12,
            average_basket_vs_last_month: 0.30,
            average_basket_vs_last_year: 0.8,
            average_items: 14,
            average_items_vs_last_month: 0.20,
            average_items_vs_last_year: 0.10
          }
        } else {
          this.coupon_data = {
            lineChartData: {
              thisYearData: [80, 150, 120, 125, 100, 120, 120, 80, 150, 100, 100, 50],
              lastYearData: [30, 80, 70, 100, 110, 130, 70, 120, 80, 100, 50, 120]
            },
            total_sales: 40000000,
            total_sales_vs_last_month: 0.1269,
            total_sales_vs_last_year: 0.1124,
            member_sales: 425,
            member_sales_vs_last_month: 0.1552,
            member_sales_vs_last_year: 0.1211,
            average_basket: 10,
            average_basket_vs_last_month: 0.12,
            average_basket_vs_last_year: 0.4,
            average_items: 12,
            average_items_vs_last_month: 0.10,
            average_items_vs_last_year: 0.0840
          }
        }
        this.sale_data.lineChartData = this.sale_blocks_data['year' + this.select_year][this.sale_blocks_type] || []
      },
      // member 的--------------------------------------------------------0712
      handleTenantKpi() {
        return getTenantKPI().then(res => {
          this.tenantDetail = res.return_result
          this.memberPieData.push({ rate: this.tenantDetail.total_member === null ? 0 : (this.tenantDetail.new_member || 0) / (this.tenantDetail.total_member || 1), value: this.tenantDetail.new_member || 0, name: 'fc_home_members_1st_item1_label' })
          this.memberPieData.push({ rate: this.tenantDetail.total_member === null ? 0 : (this.tenantDetail.existing_member || 0) / (this.tenantDetail.total_member || 1), value: this.tenantDetail.existing_member || 0, name: 'fc_home_members_1st_item2_label' })
          this.barChartData.push({ value: this.tenantDetail.frequency_last_year ? this.tenantDetail.frequency_last_year.toFixed(2) : 0, name: 'fc_home_members_3rd_item1_label' })
          this.barChartData.push({ value: this.tenantDetail.frenquency_p12m ? this.tenantDetail.frenquency_p12m.toFixed(2) : 0, name: 'fc_home_members_3rd_item2_label' })
          var active_rate = this.decimal2FormatValue(this.tenantDetail.active_rate, 1)
          this.tierPieData = [{ value: active_rate, name: 'active' }, { value: (100 - active_rate).toFixed(1), name: 'inactive' }]
        })
      },
      handleTierKpi() {
        return getTenantKPIByTier().then(res => {
          const result = res.return_result
          this.tier_list = []
          if (checkObjHasOwnProperty(result, 'kpis')) {
            for (var i = 0; i < result.kpis.length; i++) {
              this.tier_list.push({
                'member_tier_code': result.kpis[i].member_tier_code,
                'member_tier_name': result.kpis[i].member_tier_name,
                'tier_level': result.kpis[i].tier_level,
                'active_rate': result.kpis[i].active_rate === null ? 0 : result.kpis[i].active_rate
              })
            }
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .dashboard-admin-container {
    padding: 0 25px 25px 25px;
    .select-section{
       .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
      }
      /*打开时文字位置设置*/
       .el-switch__label--right {
        z-index: 1;
        top:0;
        right: 40px;
      }
      /*关闭时文字位置设置*/
       .el-switch__label--left {
        z-index: 1;
        top: 0;
        left: 40px;
      }
      /*显示文字*/
      .el-switch__label.is-active {
        display: block;
      }
      margin: 15px 0 10px 25px;
      text-align: right;
      .normal{
        height: 30px;
        display: inline-table;
        position: relative;
        text-align: center;
        line-height: 30px;
      }
      label{
        position: absolute;
        left:0;
        right:0;
        margin: 0 auto;
        font-size: 15px;
        color:#ffffff;
      }
      .el-switch.is-checked .el-switch__core::after{
        margin-left: -27px;
      }
      .el-switch__core{
        height: 30px;
        border-radius: 15px;
      }
      .el-switch__core:after{
        height: 26px;
        width: 26px;
      }
      .el-switch{
        height: 30px;
        line-height: 30px;
      }
    }
  }
</style>
