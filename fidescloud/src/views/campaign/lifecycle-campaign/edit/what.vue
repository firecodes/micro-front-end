<template>
  <div class="trigger-campaign-what-item" ref="what">
    <el-form label-width="147px" >
      <p class="p">{{$t('campaign.fc_campaign_lifecycle_edit_what_title_label')}}</p>
      <!--选择模式-->
      <div class="select-mode">
        <el-form-item :label="$t('campaign.fc_campaign_lifecycle_edit_what_reward_label')">
          <el-select v-model="form.kind">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="handleGlobalI18n('campaign', item.label)"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!--选择模式为奖励积分-->
      <div class="bonus-point-mode" v-if="form.kind === 'General Points'">
        <el-form-item label=" ">
          <el-collapse-transition>
            <div class="points_purchase">
              <div>
                <span>{{handleGlobalI18n('campaign', 'spend')}} 1&nbsp;&nbsp;</span>
                <el-select style="width:100px;" v-model="unit">
                  <el-option :label="this.globalData.value.currency" :value="this.globalData.value.currency"></el-option>
                </el-select>
                <span>&nbsp;&nbsp;{{handleGlobalI18n('campaign', 'get')}}&nbsp;&nbsp;</span>
                <el-input-number :precision="0" :min="1" v-model="form.points" :step="1"></el-input-number>
                <span>&nbsp;&nbsp;{{handleGlobalI18n('campaign', 'point')}}</span>
              </div>
              <div>
                <el-checkbox v-model="form.transaction_amount_restriction_state">{{handleGlobalI18n('campaign', 'transaction_amount_restriction')}}</el-checkbox>
                <div v-if="form.transaction_amount_restriction_state" >
                  <el-form-item :label="handleGlobalI18n('campaign', 'from') + ':'" class="form" prop="purchase_amount_restriction_from">
                    <el-input-number :precision="2" v-model="form.purchase_amount_restriction_from" :min="0" :step="0.1"></el-input-number>
                  </el-form-item>
                  <el-form-item :label="handleGlobalI18n('campaign', 'to') + ':'"  prop="purchase_amount_restriction_to">
                    <el-input-number :precision="2" v-model="form.purchase_amount_restriction_to" :min="0" :step="0.1"></el-input-number>
                  </el-form-item>
                </div>
              </div>
              <div>
                <el-checkbox v-model="form.limit_total_points_state" >{{handleGlobalI18n('campaign', 'limit_total_points')}}</el-checkbox>
                <el-form-item :label="handleGlobalI18n('campaign', 'limit_total_points') + ':'" v-show="form.limit_total_points_state">
                  <el-input-number :precision="0" v-model="form.max_points"  :min="0" :step="1" ></el-input-number>
                </el-form-item>
              </div>
            </div>
          </el-collapse-transition>
        </el-form-item>
      </div>
      <!--选择模式为优惠券-->
      <div class="coupon-mode" v-if="form.kind === 'Coupon'">
        <section v-show="coupon_list.length > 0" class="coupon_gather" v-loading="loading_coupon"  style="margin-left: 133px;">
          <div class="flex-coupon">
            <div class="turn-left" :class="{'color-57a not-allowed': coupon_form.page_no === 1}"  >
              <div :class="{'pointer-events ': coupon_form.page_no === 1}" @click="turnLeft">
                <svg-icon icon-class="arrow_down"></svg-icon>
              </div>
            </div>
            <div style="max-width: 990px;">
              <transition name="el-zoom-in-center">
                <div class="coupon-list"> <!-- :class="{'pointer-events not-allowed ': !edit_state}"      coupon-item_check -->
                  <div class="coupon-item" v-for="item in coupon_list" :key="item.id" :class="{'coupon-item_check': item.coupon_code === form.coupon_code}" @click="form.coupon_code = item.coupon_code">
                    <div class="left">
                      <div class="coupon-item_price">
                        <template  v-if="item.coupon_type_code === 'cash'">
                          <span class="coupon-item_unit">{{globalData.value.currency}}</span>
                          <label>{{item.amount}}</label>
                        </template>
                        <template v-if="item.coupon_type_code === 'discount'">
                          <label>{{(item.amount * 100).toFixed(2)}}</label>
                          <span class="coupon-item_unit">%</span>
                        </template>
                      </div>
                      <p class="coupon-item_type">{{handleGlobalI18n('campaign', (item.coupon_type_code.toLowerCase()))}}</p>
                    </div>
                    <div class="coupon-item_detail">
                      <label class="coupon-item_name"><v-clamp :max-lines="1" autoresize>{{item.coupon_name}}</v-clamp></label>
                      <p>{{item.description || '' }}</p>
                      <div class="coupon-item_effective">{{$t('campaign.fc_campaign_lifecycle_edit_what_reward_relative_label')}} {{item.relative_value}}{{handleGlobalI18n('campaign', 'campaign_' + handleRelativeUnit(item.relative_unit))}}</div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            <div class="turn-right" :class="{'color-57a not-allowed': coupon_form.page_no === total_page}">
              <div :class="{'pointer-events ': coupon_form.page_no === total_page}" @click="turnRight">
                <svg-icon icon-class="arrow_down"></svg-icon>
              </div>
            </div>
          </div>
          <div class="paging">
            <label>{{coupon_form.page_no}}/{{total_page}}</label>
          </div>
        </section>
      </div>
    </el-form>
  </div>
</template>
<script>
  import VClamp from 'vue-clamp'
  import { queryCouponListBy } from '@/api/loyalty'
  import { what_options } from '@/data/lifecycle-campaign'
  import { validateCompareFloat } from '@/utils/validate'
  export default {
    components: {
      VClamp
    },
    props: {
      nonius_id: {
        type: Number,
        default: 1
      },
      form_data: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        rules: {
          purchase_amount_restriction_from: [
            { validator: this.validatePurchaseTo, trigger: ['blur', 'change'] }
          ],
          purchase_amount_restriction_to: [
            { validator: this.validatePurchaseTo, trigger: ['blur', 'change'] }
          ]
        },
        unit: this.globalData.value.currency,
        loading_coupon: false,
        options: what_options,
        form: {},
        coupon_form: {
          page_no: 1
        },
        coupon_list: [],
        total_page: null
      }
    },
    methods: {
      handleRelativeUnit(index) {
        var arr = ['', 'days', 'months', 'years']
        return arr[index]
      },
      validateCompareFloat,
      init() {
        const info = this.form_data
        const what_reward_definition_list = info.what_reward_definition_list[0]
        this.form = { ...what_reward_definition_list }
        this.handleCouponList()
        // this.form.coupon_code = '0d3d78c6'
      },
      validatePurchaseTo(rule, value, callback) {
        this.validateCompareFloat(this.form.purchase_amount_restriction_from, this.form.purchase_amount_restriction_to, callback)
      },
      handleCouponList() {
        queryCouponListBy({ page_no: this.coupon_form.page_no, page_size: 6, expired_type_code: 1 }).then(res => {
          this.coupon_list = res.return_result.coupons
          this.loading_coupon = false
          this.total_page = res.return_result.total_page
          if (this.form.coupon_code === '' || this.form.coupon_code === undefined) {
            this.form.coupon_code = this.coupon_list[0].coupon_code
          }
        })
      },
      turnLeft() {
        this.loading_coupon = true
        this.coupon_form.page_no -= 1
        this.handleCouponList()
      },
      turnRight() {
        this.loading_coupon = true
        this.coupon_form.page_no += 1
        this.handleCouponList()
      }
    },
    watch: {
      nonius_id: {
        handler(val) {
          this.init()
        },
        immediate: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .trigger-campaign-what-item{
    .el-input, .el-select, .el-input-number{
      width: 180px;
    }
    .tip{
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      text-align: left;
      margin-left: 12px;
    }
    .p{
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .select-mode{
      margin-top: 17px;
    }
    .coupon_gather {
      margin-top: 30px;
      position: relative;
      .flex-coupon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .paging {
        text-align: center;
        line-height: 23px;
        color: $primary;
        font-size: 16px;
      }
      .turn-right {
        cursor: pointer;
        .svg-icon {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 48px !important;
          color: $primary;
        }
      }
      .turn-left {
        @extend .turn-right;
        .svg-icon {
          transform: rotate(180deg);
        }
      }
    }
    .coupon-list {
      cursor: pointer;
      $width: 300px;
      $type_width: 69px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .coupon-item {
        margin: 10px 15px 10px 15px;
        min-width: $width;
        max-width: $width;
        height: 85px;
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0);
        text-align: center;
        border: 1px solid #bbbbbb;
        display: flex;
        align-items: center;
        flex: 1;
        .left{
          min-width: 85px;
          line-height: 1.6;
          position: relative;
          &:after {
            content: "";
            position: absolute;
            right: 0;
            top: 0;
            border-left: 1px dashed rgba(187, 187, 187, 1);
            width: 1px;
            height: 70px;
            bottom: 0;
            margin: auto;
          }
        }
        &_type {
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
        }
        &_detail {
          line-height: 22px;
          display: flex;
          flex: 1;
          flex-wrap: wrap;
          justify-content: flex-start;
          text-align: left;
          padding-left: 10px;
          p {
            color: rgba(187, 187, 187, 1);
            font-size: 12px;
            width: 100%;
            height: 22px;
          }
        }
        &_price {
          margin-top: 4px;
          flex: 0 0 100%;
          label {
            color: rgba(16, 16, 16, 1);
            font-size: 24px;
          }
        }
        &_name {
          width: 100%;
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        &_unit {
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
        }
        &_effective {
          color: rgba(229, 28, 35, 1);
          font-size: 12px;
        }
        &_check {
          border-color: $primary;
          background: url("../../../../assets/images/coupon-xuanze.png") no-repeat;
          background-size: 30px;
          background-position: right top;
        }
      }
    }
  }
</style>
