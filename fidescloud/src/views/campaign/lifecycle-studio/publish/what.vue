<template>
  <div class="what-item config">
    <el-form label-position="right" label-width="180px" :disabled="!edit_state" :rules="rules" >
      <!-- Complimentary points -->
      <!--<div class="item" :class="{'not-allowed ': !edit_state}">-->
        <!--<div :class="{'pointer-events': !edit_state}"  @click="form.kind = 'Multiple Points'; show_coupon_gather = false;show_points_purchase = false ">-->
          <!--<svg-icon :icon-class="form.kind === 'Multiple Points' ? 'radiobox' : 'radio02'"></svg-icon>-->
        <!--</div>-->
        <!--<el-form-item label="Complimentary points:">-->
          <!--<el-input-number :min="0" v-model.number="form.multi_coefficient"></el-input-number>-->
        <!--</el-form-item>-->
      <!--</div>-->
      <!-- Points with purchase -->
      <div class="item" :class="{'not-allowed ': !edit_state}">
        <div :class="{'pointer-events': !edit_state}"  @click="form.kind = 'General Points';show_coupon_gather = false;show_points_purchase = true">
          <svg-icon :icon-class="form.kind === 'General Points' ? 'radiobox' : 'radio02'"></svg-icon>
        </div>
        <el-form-item :label="handleGlobalI18n('campaign', 'points_with_purchase') + ':'">
          <el-collapse-transition>
            <div class="points_purchase" v-show="show_points_purchase">
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
      <!-- coupon -->
      <div class="item" :class="{'not-allowed ': !edit_state}">
        <div :class="{'pointer-events': !edit_state}"  @click="form.kind = 'Coupon';show_coupon_gather = true;show_points_purchase = false">
          <svg-icon :icon-class="form.kind === 'Coupon' ? 'radiobox' : 'radio02'" ></svg-icon>
        </div>
        <el-form-item :label="handleGlobalI18n('campaign', 'coupon') + ':'">
          <el-collapse-transition>
            <section v-show="show_coupon_gather" class="coupon_gather" v-loading="loading_coupon" >
              <div class="flex-coupon">
                <div class="turn-left" :class="{'color-57a not-allowed': form.page_no === 1}"  >
                  <div :class="{'pointer-events ': form.page_no === 1}" @click="turnLeft">
                    <svg-icon icon-class="arrow_down"></svg-icon>
                  </div>
                </div>
                <div style="max-width: 1071px;">
                  <transition name="el-zoom-in-center">
                    <div class="coupon-list"> <!-- :class="{'pointer-events not-allowed ': !edit_state}"      coupon-item_check -->
                      <div class="coupon-item" v-for="item in coupon_list" :key="item.id" :class="{'pointer-events not-allowed ': !edit_state, 'coupon-item_check': item.coupon_code === form.coupon_code}" @click="form.coupon_code = item.coupon_code">
                        <p class="coupon-item_type">{{handleGlobalI18n('campaign', item.coupon_type_code)}}</p>
                        <div class="coupon-item_detail">
                          <div class="coupon-item_price">
                            <span class="coupon-item_unit">{{globalData.value.currency}}</span>
                            <label>{{item.amount.toFixed(2)}}</label>
                          </div>
                          <p>50%off once purchase up to 100 RMB</p>
                          <div class="coupon-item_effective">Effective date in 5 Days</div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
                <div class="turn-right" :class="{'color-57a not-allowed': form.page_no === total_page}">
                  <div :class="{'pointer-events ': form.page_no === total_page}" @click="turnRight">
                    <svg-icon icon-class="arrow_down"></svg-icon>
                  </div>
                </div>
              </div>
              <div class="paging">
                <label>{{form.page_no}}/{{total_page}}</label>
              </div>
            </section>
          </el-collapse-transition>
        </el-form-item>
      </div>
      <div class="button">
        <el-button @click="save">{{handleGlobalI18n('campaign', 'lifecycle_save')}}</el-button>
        <el-button @click="next">{{handleGlobalI18n('campaign', 'next')}}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  import { queryCouponListBy } from '@/api/loyalty'
  import { mapGetters, mapMutations } from 'vuex'
  import {
    validateCompareFloat
  } from '@/utils/validate'
  export default {
    props: {
      edit_state: {
        type: Boolean,
        default: false
      },
      nonius_id: {
        type: Number,
        default: 1
      }
    },
    computed: {
      ...mapGetters([
        'lifecycle_info'
      ])
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
        tip_state: true,
        unit: this.globalData.value.currency,
        show_coupon_gather: false,
        show_points_purchase: false,
        loading_coupon: false,
        coupon_list: [],
        total_page: null,
        form: {}
      }
    },
    created() {
      // this.handleCouponList()
    },
    methods: {
      validateCompareFloat,
      ...mapMutations({
        setLifecycleWhat: 'SET_LIFECYCLE_WHAT'
      }),
      init() {
        // 初始化提示标识
        this.tip_state = true
        // 重置数据
        this.show_coupon_gather = false
        this.show_points_purchase = false
        this.loading_coupon = false
        this.coupon_list = []
        const info = JSON.parse(JSON.stringify(this.lifecycle_info))
        const what_reward_definition_list = info.wave_list[this.nonius_id - 1].what_reward_definition_list[0]
        this.form = { ...what_reward_definition_list }
        if (this.form.purchase_amount_restriction_from && this.form.purchase_amount_restriction_to) {
          this.form.transaction_amount_restriction_state = true
        }
        if (this.form.max_points) {
          this.form.limit_total_points_state = true
        }
        if (this.form.kind === 'General Points') {
          this.show_points_purchase = true
        } else if (this.form.kind === 'Coupon') {
          this.show_coupon_gather = true
        }
        this.handleCouponList()
      },
      validatePurchaseTo(rule, value, callback) {
        this.validateCompareFloat(this.form.purchase_amount_restriction_from, this.form.purchase_amount_restriction_to, callback)
      },
      handleCouponList() {
        queryCouponListBy({ page_no: this.form.page_no, page_size: 6, expired_type_code: 2 }).then(res => {
          this.coupon_list = res.return_result.coupons
          this.loading_coupon = false
          this.total_page = res.return_result.total_page
        })
      },
      turnLeft() {
        if (!this.edit_state) {
          return true
        }
        this.loading_coupon = true
        this.form.page_no -= 1
        this.handleCouponList()
      },
      turnRight() {
        if (!this.edit_state) {
          return true
        }
        this.loading_coupon = true
        this.form.page_no += 1
        this.handleCouponList()
      },
      next() {
        this.$emit('next', 4)
      },
      save() {
        this.$emit('save', 'save')
      }
    },
    watch: {
      'form': {
        handler(val) {
          this.setLifecycleWhat({ info: JSON.parse(JSON.stringify(this.form)), nonius_id: this.nonius_id })
        },
        deep: true
      },
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
  .config{
    .el-input, .el-input-number{
      width: 200px;
    }
    min-height: 436px;
    padding-bottom: 20px;
    margin-top: 55px;
    .button{
      margin-left: 200px;
      .el-button{
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: center;
        width: 90px;
      }
    }
  }
  .what-item {
    .el-form-item {
      margin-left: 20px;
    }
    .item {
      cursor: pointer;
      display: flex;
      flex: 1;
      .svg-icon {
        flex: 0 0 20px;
        margin-top: 5px;
        font-size: 20px !important;
        margin-left: 50px;
      }
    }
    .flex-coupon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .paging {
      text-align: center;
      line-height: 23px;
      color: rgba(61, 142, 227, 1);
      font-size: 16px;
    }
    .points_purchase {
      margin-top: 50px;
      position: relative;
      left: -90px;
    }
    .coupon_gather {
      margin-top: 30px;
      position: relative;
      left: -90px;
      .turn-right {
        .svg-icon {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 48px !important;
          color: rgba(61, 142, 227, 1);
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
      $width: 327px;
      $type_width: 69px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
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
        &_type {
          flex: 0 0 23%;
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
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
        &_unit {
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
        }
        &_effective {
          color: rgba(16, 16, 16, 1);
          font-size: 12px;
        }
        &_check {
          border-color: #3d8ee3;
          background: url("../../../../assets/images/lifecycle-studio/xuanze.png") no-repeat;
          background-size: 30px;
          background-position: right top;
        }
      }
    }
  }
</style>
