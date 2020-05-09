<template>
  <div class="catalogue-redemption-details">
    <div class="click-button">
      <el-button class="go-back" @click="handleGoBack">{{$t('loyalty.fc_operation_btn_back_label')}}</el-button>
    </div>
    <!--info-->
    <div class="contain">
      <ed-header-title :title="$t('loyalty.fc_redemption_coupon_details_title_label')" />
      <el-form ref="gift" label-position="left" :model="form" label-width="300px"  v-loading="detail_loading">
        <div class="content">
          <div class="info">
            <!--Gift information-->
            <el-form-item :label="$t('loyalty.fc_redemption_coupon_details_gift_info_label')" class="gift_information" v-if="query.type === 'gift'">
              <ul>
                <!--Gift code-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_gift_code_label')}}</span>
                  <label>{{info.gift_code || table_placeholder}}</label>
                </li>
                <!--Gift name-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_gift_name_label	')}}</span>
                  <label>{{info.gift_name || table_placeholder}}</label>
                </li>
                <!--Gift category-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_gift_category_label')}}</span>
                  <label>{{info.gift_category_name || table_placeholder}}</label>
                </li>
                <!--Gift unit-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_gift_unit_label')}}</span>
                  <label>{{info.gift_unit || table_placeholder}}</label>
                </li>
                <!--stock-->
                <li>
                  <span>{{$t('loyalty.fc_gift_table_stock_label')}}</span>
                  <label>
                    <template v-if="!info.is_limited_inventory">
                      Not limited
                    </template>
                    <template v-else-if="info.is_limited_inventory">
                      {{info.stock || table_placeholder}}
                    </template>
                    <template v-else>
                      {{table_placeholder}}
                    </template>
                  </label>
                </li>
                <!--Retail market price -->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_gift_market_price_label')}}</span>
                  <label>{{info.unit_price ?  info.unit_price + ' ' + unit : table_placeholder}}</label>
                </li>
                <!--Purchased price-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_gift_purchased_price_label')}}</span>
                  <label>{{info.purchased_price ?  info.purchased_price + ' ' + unit : table_placeholder}}</label>
                </li>
              </ul>
            </el-form-item>
            <!--Coupon information-->
            <el-form-item :label="$t('loyalty.fc_redemption_coupon_details_coupon_info_label')" class="gift_information" v-else-if="query.type === 'coupon'">
              <ul>
                <!--Coupon code-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_coupon_code_label')}}</span>
                  <label>{{info.coupon_code || table_placeholder}}</label>
                </li>
                <!--Coupon name-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_coupon_name_label')}}</span>
                  <label>{{info.coupon_name || table_placeholder}}</label>
                </li>
                <!--channel-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_coupon_channel_label')}}</span>
                  <label>{{info.channel_name || table_placeholder}}</label>
                </li>
                <!--Coupon type-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_coupon_type_label')}}</span>
                  <label>{{info.coupon_type_name || table_placeholder}}</label>
                </li>
                <!--Cash amount-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_coupon_amount_label')}}</span>
                  <label>{{info.coupon_type_code === 'discount' ? (info.amount ? (info.amount*100).toFixed(2) + '%' : table_placeholder) : (info.amount ? info.amount + ' ' + unit : table_placeholder) }}</label>
                </li>
                <!--Condition-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_coupon_condition_label')}}</span>
                  <label>
                    <template v-if="info.min_purchased_amount">
                      Minimum purchase of {{info.min_purchased_amount ? info.min_purchased_amount + ' ' + unit : table_placeholder }}
                    </template>
                    <template v-else>
                      {{table_placeholder}}
                    </template>
                  </label>
                </li>
                <!--Validity period-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_coupon_period_label')}}</span>
                  <label>
                    <template v-if="info.effective_type === 1">
                      {{info.relative_value}} days after received
                    </template>
                    <template v-else-if="info.effective_type === 2">
                      {{`${info.specific_effective_date_from.substr(0, 10)} ${info.specific_effective_date_from.substr(11, 8)}`}} To {{`${info.specific_effective_date_to.substr(0, 10)} ${info.specific_effective_date_to.substr(11, 8)}`}}
                    </template>
                    <template v-else>
                      {{table_placeholder}}
                    </template>
                  </label>
                </li>
              </ul>
            </el-form-item>
            <!--Redemption information-->
            <el-form-item :label="$t('loyalty.fc_redemption_coupon_details_redemption_info_label')" class="redemption_information" >
              <ul>
                <!--Redemption status-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_redemption_status_label')}}</span>
                  <label>{{handleRedemptionStatus(info.redemption_status, info.redemption_start_date) || table_placeholder}}</label>
                </li>
                <!--Number if redeemed coupons-->
                <li v-if="query.type === 'coupon'">
                  <span>{{$t('loyalty.fc_redemption_coupon_details_redemption_number_label')}}</span>
                  <label>{{info.redeem_coupon_count || 0}}</label>
                </li>
                <!--Number of redeemed gift-->
                <li v-else-if="query.type === 'gift'">
                  <span>{{$t('loyalty.fc_redemption_coupon_details_gift_number_label')}}</span>
                  <label>{{info.redeem_gift_count || table_placeholder}}</label>
                </li>
                <!--Standard point value-->
                <!--<li v-if="query.type === 'gift'">-->
                  <!--<span>{{$t('loyalty.fc_redemption_coupon_details_gift_value_label')}}</span>-->
                  <!--<label>{{table_placeholder}}</label>-->
                <!--</li>-->
                <!--Redemption points-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_redemption_points_label')}}</span>
                  <label>{{info.redeem_point || table_placeholder}}</label>
                </li>
                <!--Limited times-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_redemption_limitedtimes_label')}}</span>
                  <label>{{info.is_limited_redeem_times === 0 ? 'No limit' : info.limited_times || table_placeholder}}</label>
                </li>
                <!--Applicable tiers-->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_redemption_applicable_tiers_label')}}</span>
                  <label>{{info.limited_tier_list || 'No limit'}}</label>
                </li>
                <!--Start time of redemption -->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_redemption_starttime_label')}}</span>
                  <label>{{info.redemption_start_date ? info.redemption_start_date.substring(0, 10) : table_placeholder}}</label>
                </li>
                <!--End time of redemption -->
                <li>
                  <span>{{$t('loyalty.fc_redemption_coupon_details_redemption_endtime_label')}}</span>
                  <label>{{info.redemption_end_date ? info.redemption_end_date.substring(0, 10) : 'No limit'}}</label>
                </li>
              </ul>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { redemption_state_mixin } from './data'
  export default {
    mixins: [
      redemption_state_mixin
    ],
    data() {
      return {
        unit: this.globalData.value.currency,
        detail_loading: false,
        form: {
          standard_point_value: 1,
          auto_generate_code: false,
          is_limited_inventory: false,
          gift_code: '',
          gift_name: '',
          available_inventory: 1,
          unit_price: '',
          purchased_price: '',
          gift_category_code: '',
          unit: '',
          dynamic_content: '',
          image_url: '',
          description: ''
        },
        query: {},
        info: {}
      }
    },
    created() {
      this.query = this.$route.query
      if (this.query.id) {
        // 获取详情
        this.detail_loading = true
        this.info = JSON.parse(sessionStorage.getItem('redemption_info'))
        this.detail_loading = false
      } else {
        this.$router.go(-1)
      }
    },
    methods: {
      handleGoBack() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .catalogue-redemption-details {
    .content{
      display: flex;
    }
    .gift_information, .redemption_information{
      padding: 15px 0!important;
      align-items: flex-start!important;
      height: auto!important;
      li{
        display: flex;
        height: 34px;
        align-items: center;
      }
      span{
        display: block;
        width: 230px;
        font-size:14px;
        font-weight: 500;
        color:rgba(51,51,51,1);
        font-family: Helvetica-medium-1;
      }
      label{
        font-family: HelveticaNeue1;
        display: block;
        font-size:14px;
        color:rgba(51,51,51,1);
      }
    }
    .el-button{
      min-width: 88px;
    }
    .el-form-item{
      margin: 0 0 70px 20px;
      height: 66px;
      line-height: 66px;
      margin-bottom: 0!important;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(230,230,230,1);
      }
      &:last-child{
        padding: 12px 0 12px 0;
        height: auto!important;
      }
      display: flex;
      align-items: center;
    }
    margin: 30px;
    .click-button {
      width: 100%;
      text-align: left;
      .go-back{
        border-color: $new-primary;
        color: $new-primary;
        background-color: #ffffff!important;
      }
    }
    .contain {
      position: relative;
      .info{
        background:rgba(255,255,255,1);
        box-shadow:0 5px 15px -3px rgba(204,204,204,1);
        width: 100%;
      }
    }
    .p{
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      margin-top: -20px;
      box-sizing: border-box;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  @import "../new-theme-css";
  .catalogue-redemption-details{
    .el-form-item .el-form-item__label {
      font-size: 14px!important;
      font-weight: 700!important;
      color: rgba(51,51,51,1)!important;
      line-height: 36px!important;
      &:before{
        color: rgba(51,51,51,1)!important;
      }
    }
    .el-form-item__content{
      margin-left: 0!important;
      width: 100% !important
    }
  }
</style>
