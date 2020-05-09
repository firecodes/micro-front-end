<!--
  Estimated budget
  2020/01/07
-->
<template>
  <div class="spot_campaign_detail__estimated_budget">
    <ed-header-title :title="$t('campaign.fc_campaign_spot_details_module_budget_label')" />
    <ed-table v-loading="loading">
      <!--Cash Coupon-->
      <el-table :data="table_data" align="center" style="width: 100%" v-if="type === 1">
        <!--Coupon name-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_coupon_budget_table_name_label')" align="center"  prop="coupon_name">
          <template slot-scope="scope">
            {{scope.row.coupon_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Coupon type-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_coupon_budget_table_type_label')" align="center" prop="coupon_type">
          <template slot-scope="scope">
            {{scope.row.coupon_type || table_placeholder}}
          </template>
        </el-table-column>
        <!--Coupon cost-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_coupon_budget_table_coupon_cost_label')" align="center" prop="coupon_cost">
          <template slot-scope="scope">
            {{scope.row.coupon_cost || table_placeholder}}
          </template>
        </el-table-column>
        <!--Number of coupons-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_coupon_budget_table_numbers_label')" align="center" prop="number_of_coupons">
          <template slot-scope="scope">
            {{scope.row.number_of_coupons || table_placeholder}}
          </template>
        </el-table-column>
        <!--Total cost-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_coupon_budget_table_total_label')" align="center" prop="total_cost">
          <template slot-scope="scope">
            {{scope.row.total_coupons || table_placeholder}}
          </template>
        </el-table-column>
      </el-table>
      <!--Bonus points-->
      <el-table :data="table_data" align="center" style="width: 100%" v-if="type === 2">
        <!--Point type-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_bonus_budget_table_type_label')" align="center" prop="point_type">
          <template slot-scope="scope">
            {{scope.row.point_type || table_placeholder}}
          </template>
        </el-table-column>
        <!--Point per member-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_bonus_budget_table_per_label')" align="center" prop="point_per_member">
          <template slot-scope="scope">
            {{scope.row.point_per_member || table_placeholder}}
          </template>
        </el-table-column>
        <!--Number of members-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_bonus_budget_table_numbers_label')" align="center" prop="number_of_members">
          <template slot-scope="scope">
            {{scope.row.number_of_members || table_placeholder}}
          </template>
        </el-table-column>
        <!--Total offered points-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_bonus_budget_table_points_label')" align="center" prop="total_offer_points">
          <template slot-scope="scope">
            {{scope.row.total_offer_points || table_placeholder}}
          </template>
        </el-table-column>
      </el-table>
      <!--Multiple points-->
      <el-table :data="table_data" align="center" style="width: 100%" v-if="type === 3">
        <!--Rule name-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_multiple_budget_table_name_label')" align="center" prop="rule_name">
          <template slot-scope="scope">
            {{scope.row.rule_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Earn rule-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_multiple_budget_table_rule_label')" align="center" prop="earn_rule">
          <template slot-scope="scope">
            {{scope.row.earn_rule || table_placeholder}}
          </template>
        </el-table-column>
        <!--Expiry date-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_multiple_budget_table_expiry_label')" align="center" prop="expiry_date">
          <template slot-scope="scope">
            {{scope.row.expiry_date || table_placeholder}}
          </template>
        </el-table-column>
        <!--Number of members-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_multiple_budget_table_numbers_label')" align="center" prop="number_of_coupons">
          <template slot-scope="scope">
            {{scope.row.number_of_members || table_placeholder}}
          </template>
        </el-table-column>
      </el-table>
    </ed-table>
  </div>
</template>
<script>
  import { getCampaignTypeInfo } from '@/api/campaign'
  export default {
    props: {
      budge_list: {
        type: Object
      },
      campaign_info: {
        type: Object
      }
    },
    data() {
      return {
        table_data: [],
        loading: false,
        type: 3// 1 Cash Coupon 2 Bonus points 3 Multiple points
      }
    },
    watch: {
      'budge_list': {
        handler() {
          this.init()
        },
        deep: true
      }
    },
    methods: {
      init() {
        this.loading = true
        getCampaignTypeInfo().then(res => {
          this.loading = false
          var campaign_type_name = ''
          for (var item of res.return_result) {
            campaign_type_name = (item.campaign_type_name || '').toLowerCase()
            if (parseInt(item.campaign_type_id) === this.campaign_info.campaign_type_code) {
              if (campaign_type_name.indexOf('multiple') > -1) {
                this.type = 3
                this.$set(this.table_data, 0, this.budge_list.mutiple_point_budge)
                break
              } else if (campaign_type_name.indexOf('coupon') > -1) {
                this.type = 1
                this.table_data = this.budge_list.coupon_budge
                break
              } else if (campaign_type_name.indexOf('bonus') > -1) {
                this.type = 2
                this.$set(this.table_data, 0, this.budge_list.bonus_point_budge)
                break
              }
            }
          }
        })
      }
    }
  }
</script>
