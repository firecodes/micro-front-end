<!--
  spot campaign detail
-->
<template>
  <div class="spot_campaign_detail_sub_content">
    <section class="spot_campaign_detail_sub_content__top">
      <ed-header-title :title="$t('campaign.fc_campaign_spot_details_module_details_label')" />
      <div @click.top="handleRouteEdit()" style="display: contents;" v-if="campaign_wizard_status === 1">
        <svg-icon  class="i cursor-pointer" icon-class="spot-campaign-detail-modify" />
      </div>
    </section>
    <section class="spot_campaign_detail_sub_content__content" v-loading="loading">
      <ul v-if="!loading">
        <li v-for="item in detail_list">
          <!--When-Who-What-How-->
          <p class="left">{{$t(`campaign.${item.title}`)}}</p>
          <div class="right">
            <section class="channel_type">{{item.type}}</section>
            <section class="channel_content">
              <template v-if=" item.content && item.content.length > 1">
                <p style="min-height: 16px;" v-for="value in item.content">{{value}}</p>
              </template>
              <template v-else>
                <p class="one">{{item.content  && item.content[0]}}</p>
              </template>
            </section>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
  import { getCampaignTypeInfo } from '@/api/campaign'
  import { queryCouponListBy } from '@/api/loyalty'
  import { mapGetters } from 'vuex'
  const moment = require('moment')
  export default {
    props: {
      campaign_info: {},
      id: {
        type: Number | String
      },
      campaign_wizard_status: {
        type: Number | String,
        default: null
      }
    },
    data() {
      return {
        loading: true,
        campaign_type_list: [],
        detail_list: [[], [], [], []]
      }
    },
    computed: {
      ...mapGetters([
        'language'
      ])
    },
    watch: {
      language() {
        this.init()
      }
    },
    created() {
      this.loading = false
      this.getCampaignRewardTypeList()
    },
    methods: {
      init() {
        const _this = this
        const campaign_info = this.campaign_info
        // notification_date_list: [{ label: 'Instantly', value: 2 }, { label: 'Specific date', value: 1 }],
        // /////000000000000000000000000000when-----------------------------
        let when_content = []
        const period = campaign_info.period ? JSON.parse(campaign_info.period) : null
        const target = campaign_info.target ? JSON.parse(campaign_info.target) : null
        const reward = campaign_info.reward ? JSON.parse(campaign_info.reward) : null
        const communication = campaign_info.communication ? JSON.parse(campaign_info.communication) : null
        if (period) {
          when_content = [
            _this.$t('campaign.fc_campaign_details_when_date_label'), // Notification date:
            _this.$t('campaign.fc_campaign_details_when_period_label') // Campaign period
          ]
          if (campaign_info.when_type === 1) {
            // specific date
            when_content[0] = when_content[0] + `${_this.formatTimeStamp(period.sendDate) || _this.table_placeholder}`
          } else if (campaign_info.when_type === 2) {
            // Instantly
            when_content[0] = when_content[0] + _this.$t('campaign.fc_campaign_spot_create_when_date_menu1_label')
          }
          // No limit
          when_content[1] = when_content[1] + (period.limitFlag ? _this.$t('campaign.fc_campaign_spot_create_when_no_limit_label') : `${_this.formatTimeStamp(period.campaignStartDate) || _this.table_placeholder} - ${_this.formatTimeStamp(period.campaignEndDate) || _this.table_placeholder}`)
        }
        // //////////////////////////who--------------------------------------------------------
        var who_content = []
        if (target) {
          // Estimated audience:
          who_content[0] = _this.$t('campaign.fc_campaign_details_who_estimated_label') + (campaign_info.estimated_audience ? campaign_info.estimated_audience : 0)
          //  Control group
          who_content[1] = _this.$t('campaign.fc_campaign_details_who_control_label') + `${(100 - parseFloat(target.control_group)).toFixed(2)}%`
        }
        // //////////////////////////what ----------------------------------------------
        var what_content = []
        if (reward) {
          for (const item of _this.campaign_type_list) {
            if (parseInt(item.campaign_type_id) === campaign_info.campaign_type_code) {
              var campaign_type_name = (item.campaign_type_name).toLowerCase()
              if (campaign_type_name.indexOf('communication') > -1) {
                what_content = []
                // 'Reward type: Communication only'
                what_content[0] = _this.$t('campaign.fc_campaign_details_what_communication_type_label') + _this.$t('campaign.fc_campaign_details_what_communication_type_content_label')
                // 更新页面
                _this.handleSetWhatObj(reward, campaign_info, what_content)
              } else if (campaign_type_name.indexOf('multiple') > -1) {
                what_content = [
                  // Earn rule:
                  `${_this.$t('campaign.fc_campaign_details_what_multiple_rule_label')} ${_this.$t('campaign.fc_campaign_details_what_multiple_rule_content_label', { 'currency': _this.globalData.value.currency || _this.table_placeholder }, { 'n': reward.reward_point.multiple_ratio || _this.table_placeholder })}`,
                  (function() {
                    if (reward.purchase_amount_restriction_to) {
                      // Transaction value
                      return `${_this.$t('campaign.fc_campaign_details_what_multiple_value_label')} ${reward.purchase_amount_restriction_from || _this.table_placeholder} ${_this.globalData.value.currency} - ${reward.purchase_amount_restriction_to || _this.table_placeholder} ${_this.globalData.value.currency}`
                    }
                    // Transaction value
                    return `${_this.$t('campaign.fc_campaign_details_what_multiple_value_label')} ` + _this.table_placeholder
                  })(),
                  // Sku
                  `${_this.$t('campaign.fc_campaign_details_what_multiple_name_label')}` + (function() {
                    var s = ''
                    if (reward.purchase_product_limits) {
                      for (const item of reward.purchase_product_limits) {
                        s = s + ', ' + item.product_name
                      }
                      return s.slice(1)
                    } else {
                      return _this.table_placeholder
                    }
                  })(),
                  // Participation limit
                  `${_this.$t('campaign.fc_campaign_details_what_multiple_participation_label')} ${reward.participant_limited_times || _this.table_placeholder}`,
                  // Limit total points
                  `${_this.$t('campaign.fc_campaign_details_what_multiple_point_label')} ${reward.reward_point.limit_total_points || _this.table_placeholder}`
                ]
                // 更新页面
                _this.handleSetWhatObj(reward, campaign_info, what_content)
              } else if (campaign_type_name.indexOf('coupon') > -1) {
                var coupon_code = reward.reward_coupon.coupon_code
                // 获取coupon 详情
                what_content = [
                  // coupon name
                  `${_this.$t('campaign.fc_campaign_details_what_coupon_name_label')} ${coupon_code || _this.table_placeholder}`
                ]
                if (coupon_code) {
                  what_content = []
                  var coupon_code_list = coupon_code.split(',')
                  for (var coupon of coupon_code_list) {
                    queryCouponListBy({ coupon_code: coupon, page_no: 1, page_size: 1 }).then(res => {
                      var coupon_detail = res.return_result.coupons ? res.return_result.coupons[0] : []
                      if (coupon_detail) {
                        var arr = [
                          // Coupon name
                          `${_this.$t('campaign.fc_campaign_details_what_coupon_name_label')} ${coupon_detail.coupon_name}`,
                          // Coupon type
                          `${_this.$t('campaign.fc_campaign_details_what_coupon_type_label')} ${coupon_detail.coupon_type_name}`,
                          // Coupon channel
                          `${_this.$t('campaign.fc_campaign_details_what_coupon_channel_label')} ${coupon_detail.channel_name}`,
                          // Cash/discount/sku
                          (function() {
                            var coupon_type_code = coupon_detail.coupon_type_code
                            if (coupon_type_code === 'sku') {
                              return _this.$t('campaign.fc_campaign_details_what_coupon_type_3rd_label')
                            } else if (coupon_type_code === 'discount') {
                              return _this.$t('campaign.fc_campaign_details_what_coupon_type_2nd_label')
                            } else if (coupon_type_code === 'cash') {
                              return _this.$t('campaign.fc_campaign_details_what_coupon_type_1st_label')
                            } else {
                              return _this.table_placeholder
                            }
                          })() + (function() {
                            var coupon_type_code = coupon_detail.coupon_type_code
                            if (coupon_type_code === 'sku') {
                              return coupon_detail.product_name
                            } else if (coupon_type_code === 'discount') {
                              return (parseInt(coupon_detail.amount) < parseFloat(coupon_detail.amount) ? (coupon_detail.amount * 100).toFixed(2) || 0 : ((1 - coupon_detail.amount) * 100) || 0) + '%'
                            } else if (coupon_type_code === 'cash') {
                              return _this.globalData.value.currency_symbol + (coupon_detail.amount || 0)
                            } else {
                              return _this.table_placeholder
                            }
                          })(),
                          // Validity period
                          `${_this.$t('campaign.fc_campaign_details_what_coupon_validity_label')} ` + (function() {
                            if (coupon_detail.effective_type === 2 && coupon_detail.specific_effective_date_from && coupon_detail.specific_effective_date_to) {
                              return _this.globalData.formatDate((coupon_detail.specific_effective_date_from).substr(0, 10)) + ' - ' + _this.globalData.formatDate((coupon_detail.specific_effective_date_to).substr(0, 10))
                            } else if (coupon_detail.effective_type === 1) {
                              return `${coupon_detail.relative_value} ` + _this.$t('loyalty.fc_add_coupon_relative_date_end_desc_label')
                            } else {
                              return _this.table_placeholder
                            }
                          })()
                        ]
                        if (what_content.length > 0) {
                          arr = [' ', ...arr]
                        }
                        what_content = [...what_content, ...arr]
                        // 更新页面
                        _this.handleSetWhatObj(reward, campaign_info, what_content)
                      }
                    })
                  }
                }
              } else if (campaign_type_name.indexOf('bonus') > -1) {
                what_content = [
                  // Point type:
                  `${_this.$t('campaign.fc_campaign_details_what_bonus_type_label')} ` + (function() {
                    var value = ''
                    if (reward.reward_point.point_type === 'standard_points') {
                      value = 'fc_member_details_loyalty_point_type_menu8_label'
                    } else if (reward.reward_point.point_type === 'tier_points') {
                      value = 'fc_member_details_loyalty_point_type_menu9_label'
                    } else if (reward.reward_point.point_type === 'campaign_points') {
                      value = 'fc_member_details_loyalty_point_type_menu1_label'
                    } else {
                      value = ''
                    }
                    return _this.$t(`member.${value}`)
                  })(),
                  // Point value
                  `${_this.$t('campaign.fc_campaign_details_what_bonus_value_label')} ${reward.reward_point.fixed_point}`,
                  // Expiry date
                  _this.$t('campaign.fc_campaign_details_what_bonus_expiry_label') + (function() {
                    if (reward.reward_point.expired_type === 1) {
                      // return `${_this.formatTimeStamp(reward.reward_point.effective_date)} - ${_this.formatTimeStamp(reward.reward_point.expired_date)}`
                      return `${_this.formatTimeStamp(reward.reward_point.expired_date)}`
                    } else {
                      return `${reward.reward_point.expired_value} ` + _this.$t('campaign.fc_campaign_spot_create_what_expiry_relative_content_label')
                    }
                  })()
                ]
                // 更新页面
                _this.handleSetWhatObj(reward, campaign_info, what_content)
              }
              break
            } else {
              // 更新页面
              _this.handleSetWhatObj(reward, campaign_info, what_content)
            }
          }
        } else {
          // 更新页面
          _this.handleSetWhatObj(reward, campaign_info, what_content)
        }
        // //////////////////////////how ----------------------------------------------
        var how_content = []
        if (communication) {
          how_content = [
            // Notification channel
            _this.$t('campaign.fc_campaign_details_how_channel_label') + (function() {
              if (!communication) {
                return _this.table_placeholder
              } else {
                if (communication.communication_channels[0].communication_channel_code === '2') {
                  // EDM
                  return _this.$t('campaign.fc_campaign_details_how_channel_edm_label')
                } else if (communication.communication_channels[0].communication_channel_code === '1') {
                  // SMS
                  return _this.$t('campaign.fc_campaign_details_how_channel_sms_label')
                }
              }
            })()
          ]
        }
        this.$set(this.detail_list, 0, {
          title: 'fc_campaign_spot_details_when_label', // WHEN
          type: (function() {
            if (campaign_info.when_type === 1) {
              // Specific date
              return _this.$t('campaign.fc_campaign_spot_create_when_date_menu2_label')
            } else if (campaign_info.when_type === 2) {
              // Instantly
              return _this.$t('campaign.fc_campaign_spot_create_when_date_menu1_label')
            } else {
              return _this.table_placeholder
            }
          })(),
          content: when_content
        })
        this.$set(this.detail_list, 1, {
          title: 'fc_campaign_spot_details_who_label', // WHO
          type: (function() {
            if (!target) {
              return _this.table_placeholder
            } else {
              if (target.target_type === 1) {
                // Targeted members
                return _this.$t('campaign.fc_campaign_spot_create_who_audience_menu2_label')
              } else if (target.target_type === 3) {
                // Upload members
                return _this.$t('campaign.fc_campaign_spot_create_who_audience_menu5_label')
              } else if (target.target_type === 4) {
                // All members
                return _this.$t('campaign.fc_campaign_spot_create_who_audience_menu1_label')
              } else if (target.target_type === 5) {
                // Tagged members
                return _this.$t('campaign.fc_campaign_spot_create_who_audience_menu3_label')
              } else if (target.target_type === 6) {
                // Member groups
                return _this.$t('campaign.fc_campaign_spot_create_who_audience_menu4_label')
              } else {
                return _this.table_placeholder
              }
            }
          })(),
          content: who_content
        })
        this.$set(this.detail_list, 3, {
          title: 'fc_campaign_spot_details_how_label', // HOW
          type: (function() {
            if (!communication) {
              return _this.table_placeholder
            } else {
              if (communication.communication_channels[0].communication_channel_code === '2') {
                // EDM
                return _this.$t('campaign.fc_campaign_spot_create_how_channel_menu2_label')
              } else if (communication.communication_channels[0].communication_channel_code === '1') {
                // SMS
                return _this.$t('campaign.fc_campaign_spot_create_how_channel_menu1_label')
              }
            }
          })(),
          content: how_content
        })
        this.loading = false
      },
      // 更新what对象
      handleSetWhatObj(reward, campaign_info, what_content) {
        // do something
        var _this = this
        this.$set(this.detail_list, 2, {
          title: 'fc_campaign_spot_details_what_label', // WHAT
          type: (function() {
            if (!reward) {
              return _this.table_placeholder
            } else {
              for (var item of _this.campaign_type_list) {
                if (parseInt(item.campaign_type_id) === campaign_info.campaign_type_code) {
                  return item.campaign_type_name_resource_key ? _this.$t(`campaign.${item.campaign_type_name_resource_key}`) : item.campaign_type_name
                }
              }
            }
          })(),
          content: what_content
        })
      },
      // 获取奖励列表
      getCampaignRewardTypeList() {
        getCampaignTypeInfo().then(res => {
          this.campaign_type_list = res.return_result
          this.init()
        }).catch(() => {
        })
      },
      formatTimeStamp(dataStr) {
        if (dataStr) {
          var _this = this.globalData.value
          var date_format = _this.date_format.toUpperCase()
          return moment(dataStr).format(date_format)
        } else {
          return '-'
        }
      },
      handleRouteEdit() {
        this.$router.push({
          path: '/campaign/spot-campaign/edit',
          query: {
            type: 'edit',
            id: this.id
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spot_campaign_detail_sub_content{
    &__top{
      position: relative;
      display: flex;
      align-items: center;
      .svg-icon{
        position: absolute;
        left: 82px;
        font-size: 14px;
        color: #333333;
      }
    }
    &__content{
      width: 100%;
      min-height:480px;
      background:rgba(255,255,255,1);
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
      li{
        padding: 15px 0;
        width: 100%;
        min-height: 120px;
        &:not(:last-child) {
          border-bottom: 1px solid rgba(230,230,230,1);
        }
        display: flex;
        .left{
          width: 100px;
          min-width: 100px;
          text-align: center;
          margin-top: 7px;
          font-size:14px;
          font-family: HelveticaNeue1-Bold;
          font-weight:bold;
          color: $new-primary;
          line-height:17px;
        }
        .right{
          position: relative;
          margin-left: 12px;
        }
        .channel_type{
          position: relative;
          margin-top: 7px;
          font-size:14px;
          font-family: HelveticaNeue1-Bold;
          font-weight:bold;
          color:rgba(51,51,51,1);
          line-height:17px;
          &:before{
            content: '';
            position: absolute;
            left:-12px;
            top: -7px;
            width:2px;
            height:30px;
            background: $new-primary;
          }
        }
        .channel_content{
          p{
            margin-top: 15px;
            font-size:14px;
            font-family: HelveticaNeue1;
            color:rgba(51,51,51,1);
            line-height:16px;
            &:first-child{
              margin-top: 21px;
            }
          }
          .one{
            margin-top: 40px!important;
          }
        }
      }
    }
  }
</style>
