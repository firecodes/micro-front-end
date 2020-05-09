<!--select coupon-->
<template>
  <div class="spot_campaign_what_coupon" ref="CouponComponent">
    <!--select a coupon-->
    <el-form-item :label="$t('campaign.fc_campaign_spot_create_what_coupon_label')" required>
      <select-coupon :coupon_detail="coupon_detail" @selectGiftDialog="selectGiftDialog" />
    </el-form-item>
    <!--coupon detail-->
    <el-form-item :loading="coupon_loading" label=" " v-if="Object.keys(coupon_detail).length > 0">
      <div class="spot_campaign_what_coupon__coupon_detail">
        <div class="hover-div">
          <img :src="require('@/assets/images/coupon/coupon-offline.png')" v-if="coupon_detail.channel_code === 'offline'" />
          <img :src="require('@/assets/images/coupon/coupon-online.png')" v-else-if="coupon_detail.channel_code === 'online'" />
          <img :src="require('@/assets/images/coupon/coupon-online-offline.png')" v-else />
          <div class="content">
            <div class="left">
              <label class="gwp" v-if="coupon_detail.coupon_type_code ==='sku'">GWP</label>
              <label class="discount" v-else-if="coupon_detail.coupon_type_code ==='discount'">
                <span>{{parseInt(coupon_detail.amount) < parseFloat(coupon_detail.amount) ? (coupon_detail.amount* 100).toFixed(2) || 0 : ((1 - coupon_detail.amount)* 100) || 0}}%</span><br />
                <span>OFF</span>
              </label>
              <label class="discount" v-else>
                <span>{{globalData.value.currency_symbol}}{{coupon_detail.amount || 0}}</span><br />
                <span>OFF</span>
              </label>
            </div>
            <div class="right">
              <div class="padding-20">
                <div class="coupon-channel-type">
                  <label>{{coupon_detail.channel_name === 'All' ? 'Online + Offline' : coupon_detail.channel_name}}</label>
                  <img :src="require('@/assets/images/coupon/offline-icon.png')" v-if="coupon_detail.channel_code === 'offline'" />
                  <img :src="require('@/assets/images/coupon/online-icon.png')" v-else-if="coupon_detail.channel_code === 'online'" />
                </div>
                <div class="coupon-name">
                  {{coupon_detail.coupon_name}}
                </div>
                <div class="expiry-date">
                  <label>{{$t('loyalty.fc_coupon_tile_expiry_date_label')}}</label>
                  <template v-if="coupon_detail.effective_type === 2">
                    {{coupon_detail.specific_effective_date_from ? globalData.formatDate((coupon_detail.specific_effective_date_from).substr(0, 10)) : table_placeholder}}{{handleGlobalI18n('system', 'to')}}{{coupon_detail.specific_effective_date_to ? globalData.formatDate((coupon_detail.specific_effective_date_to).substr(0, 10)) : table_placeholder}}
                  </template>
                  <template v-else>
                    {{`+${coupon_detail.relative_value} `}}{{$t('loyalty.fc_add_coupon_relative_date_input_label')}}
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form-item>
  </div>
</template>
<script>
  import SelectCoupon from './select-coupon'
  import { queryCouponListBy } from '@/api/loyalty'
  export default {
    props: {
      reward: {
        default: Object
      }
    },
    watch: {
      reward() {
        this.init()
      }
    },
    components: {
      SelectCoupon
    },
    data() {
      return {
        coupon_loading: false,
        coupon_detail: {}
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.reward) {
          // 获取详情
          var coupon_code = this.reward.reward_coupon.coupon_code || ''
          if (coupon_code) {
            this.coupon_loading = true
            queryCouponListBy({ coupon_code: coupon_code, page_no: 1, page_size: 1 }).then(res => {
              this.coupon_loading = false
              this.coupon_detail = res.return_result.coupons ? res.return_result.coupons[0] : []
            }).catch(() => {
              this.coupon_loading = false
            })
          }
        }
      },
      selectGiftDialog(item) {
        this.coupon_detail = item
      },
      // 保存数据
      saveData() {
        return {
          reward_coupon: {
            coupon_code: this.coupon_detail.coupon_code || ''
          }
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign_what_coupon{
      &__coupon_detail{
        width: 440px;
        height: 140px;
        margin-right: 65px;
        margin-bottom: 40px;
        position: relative;
        img{
          width: 100%;
        }
        .hover-div{
          cursor: pointer;
          position: relative;
          &:hover{
            .operation{
              opacity: 1;
            }
          }
        }
        .content{
            position: absolute;
            top: 0;
            width: 101%;
            height: 100%;
            display: flex;
            .left{
              flex:0 0 24.7%;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Apple-Myungjo;
              color:rgba(255,255,255,1);
              font-size: 30px;
              .gwp{
                line-height: 0;
                display: inline-table;
              }
              .discount, .cash{
                margin-top: -16%;
                line-height: 1.4;
                span{
                  &:first-child{
                    font-size: 27px;
                  }
                  flex: 1;
                }
              }
            }
            .right{
              font-size: 18px;
              width: 75.3%;
              color: rgba(255,255,255,1);
              height: 100%;
              letter-spacing: 0.6px;
              .padding-20{
                width: 80%;
                margin: 10px 10% 0 10%;
              }
              .coupon-channel-type{
                font-weight: 700;
                line-height: 25px;
                margin-top: 25px;
                display: flex;
                align-items: center;
                img{
                  margin-left: 7px;
                  width: 16px;
                  height: 14px;
                }
              }
              .coupon-name{
                white-space:nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 8px 0;
                line-height:25px;
                font-family: HelveticaNeue1;
                font-weight: 300;
              }
              .expiry-date{
                margin-top: 8px;
                font-family: HelveticaNeue1;
                font-size: 14px;
                color:rgba(255,255,255,1);
                line-height: 20px;
              }
              position: relative;
            }

          }
      }
  }
</style>
