import { getFcHomepageMember, getFcHomepageSales, getFcHomepageCampaign } from '@/api/dwKpi'
import { queryMemberTierList } from '@/api/loyalty'
import { calcNumberInt } from '@/utils'
var dw = {
  data() {
    return {
      campaign_wizard_id: null,
      info: {},
      new_campaign_wizard_id: null,
      campaign_type: null,
      send_date: null
    }
  },
  methods: {
    handleFirstData() {
      try {
        // member
        if (this.query_type === '') {
          this.dwGetMemberData()
        }
        // sale
        if (this.query_type === '' || this.query_type === 'sale') {
          this.dwGetSaleData()
        }
        // campaign
        if (this.query_type === '' || this.query_type === 'campaign') {
          this.dwGetCampaignData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // dw member data
    dwGetMemberData() {
      var myDate = new Date()
      const nowYear = myDate.getFullYear()
      getFcHomepageMember({ query_year: nowYear }).then(res => {
        var info = res.return_result
        this.tenantDetail = {
          total_member: info.total_member || 0,
          active_rate: info.activity_rate / 100 || 0
        }
        if (info.tier_activity_rate) {
          // 调用tier 列表
          queryMemberTierList({ page_no: 1, page_size: 10 }).then(res => {
            var result = res.return_result.tiers || []
            if (result.length > 0) {
              var tier_list = []
              result.forEach(item => {
                tier_list[item.member_tier_id] = item.member_tier_name
              })
              for (var item of info.tier_activity_rate || []) {
                if (tier_list[item.member_tier_id]) {
                  this.tier_list.push({
                    'member_tier_id': item.member_tier_id,
                    'member_tier_name': tier_list[item.member_tier_id],
                    'active_rate': (item.active_rate / 100)
                  })
                  this.tier_list.push({
                    'member_tier_id': item.member_tier_id,
                    'member_tier_name': tier_list[item.member_tier_id],
                    'active_rate': (item.active_rate / 100)
                  })
                }
              }
            }
          }).catch(() => {
            // do something
          })
        }
        this.tierPieData = [{ value: (this.tenantDetail.active_rate * 100).toFixed(1), name: 'active' }, { value: ((1 - this.tenantDetail.active_rate) * 100).toFixed(1), name: 'inactive' }]
        this.barChartData.push({ value: info.frequency_last_year.toFixed(2) || 0, name: 'fc_home_members_3rd_item1_label' })
        this.barChartData.push({ value: info.frequency_p12m.toFixed(2) || 0, name: 'fc_home_members_3rd_item2_label' })
        this.memberPieData.push({ rate: info.rate_of_new_member / 100 || 0, value: calcNumberInt(info.total_member * info.rate_of_new_member / 100) || 0, name: 'fc_home_members_1st_item1_label' })
        this.memberPieData.push({ rate: info.rate_of_exsiting_member / 100 || 0, value: info.total_member - calcNumberInt(info.total_member * info.rate_of_new_member / 100) || 0, name: 'fc_home_members_1st_item2_label' })
      }).catch(res => {
        console.log(res)
      })
    },
    // dw sale data
    dwGetSaleData() {
      getFcHomepageSales({ query_year: this.select_year }).then(res => {
        var info = res.return_result
        this.sale_data = {
          total_sales: info.total_sales,
          total_sales_vs_last_month: info.total_sales_vs_laster_month / 100,
          total_sales_vs_last_year: info.total_sales_vs_laster_year / 100,
          member_sales: info.member_sales,
          member_sales_vs_last_month: info.member_sales_vs_laster_month / 100,
          member_sales_vs_last_year: info.member_sales_vs_laster_year / 100,
          average_basket: info.average_basket,
          average_basket_vs_last_month: info.average_basket_vs_laster_month / 100,
          average_basket_vs_last_year: info.average_basket_vs_laster_year / 100,
          average_items: info.average_items,
          average_items_vs_last_month: info.average_items_vs_laster_month / 100,
          average_items_vs_last_year: info.average_items_vs_laster_year / 100
        }
        const has = Object.prototype.hasOwnProperty
        var newData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var lastData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if (has.call(info, 'member_transactions_every_month') && info.member_transactions_every_month !== null && info.member_transactions_every_month.length > 0) {
          for (var val of info.member_transactions_every_month) {
            newData[val.transaction_month - 1] = val.sum_amount
          }
        }
        if (has.call(info, 'member_transactions_every_month_vs_last_year') & info.member_transactions_every_month_vs_last_year !== null && info.member_transactions_every_month_vs_last_year.length > 0) {
          for (var item of info.member_transactions_every_month_vs_last_year) {
            lastData[item.transaction_month - 1] = item.sum_amount
          }
        }
        this.sale_data.lineChartData = {
          thisYearData: newData,
          lastYearData: lastData
        }
      })
    },
    // dw campaign data
    dwGetCampaignData() {
      getFcHomepageCampaign({ query_year: this.select_year }).then(res => {
        var info = res.return_result
        this.campaign_data = {
          campaign_sales: info.campaign_sales,
          campaign_number: info.campaign_number,
          campaign_participants: info.participants,
          campaign_response_rate: ((info.response_rate || 0)).toFixed(2)
        }
      })
    }
  }
}

export const dwMixin = dw
