<template>
  <div class="reward">
    <el-form ref="form" :model="form" label-width="280px" class="form1" :rules="rules" >
      <div v-if="campaign_type==='1'">
        <!--交易总量限制-->
        <el-form-item prop="multiple_ratio" style="margin-left:-200px;" :rules="[
            { required: true, message: handleGlobalI18n('validation', 'compare_the_size_error'), trigger: 'change' }
          ]">
          <span>{{handleGlobalI18n('campaign', 'spend')}} 1&nbsp;&nbsp;</span>
          <el-select style="width:100px;" v-model="unit" disabled>
              <el-option :label="unit" :value="unit"></el-option>
            </el-select>
            <span>&nbsp;&nbsp;{{handleGlobalI18n('campaign', 'get')}}&nbsp;&nbsp;</span>
          <el-input-number v-model.number="form.multiple_ratio" :precision="0"  :min="1" :step="1" :disabled="campaign_status === '3'"></el-input-number>
          <span>&nbsp;&nbsp;{{handleGlobalI18n('campaign', 'point')}}</span>
        </el-form-item>
        <div>
          <el-checkbox v-model="form.transaction_amount_restriction_state" :disabled="campaign_status === '3'">{{handleGlobalI18n('campaign', 'transaction_amount_restriction')}}</el-checkbox>
          <div v-if="form.transaction_amount_restriction_state" >
            <el-form-item :label="handleGlobalI18n('campaign', 'from') + ':'" class="form" prop="purchase_amount_restriction_from">
              <el-input-number v-model.number="form.purchase_amount_restriction_from" :disabled="campaign_status === '3'" :precision="2" :min="0" :step="0.1"></el-input-number>
            </el-form-item>
            <el-form-item :label="handleGlobalI18n('campaign', 'to') + ':'"  prop="purchase_amount_restriction_to">
              <el-input-number v-model.number="form.purchase_amount_restriction_to" :disabled="campaign_status === '3'" :precision="2" :min="0" :step="0.1"></el-input-number>
            </el-form-item>
          </div>
        </div>
        <!--参与次数-->
        <div>
          <el-checkbox v-model="form.participation_limit_state" :disabled="campaign_status === '3'">{{handleGlobalI18n('campaign', 'participation_limit')}}</el-checkbox>
          <el-form-item :label="handleGlobalI18n('campaign', 'member_participation_amount') + ':'" v-show="form.participation_limit_state">
            <el-input-number v-model.number="form.participant_limited_times"  :min="0" :step="1" :disabled="campaign_status === '3'"></el-input-number>
          </el-form-item>
        </div>
        <div>
          <el-checkbox v-model="form.limit_total_points_state" :disabled="campaign_status === '3'">{{handleGlobalI18n('campaign', 'limit_total_points')}}</el-checkbox>
          <el-form-item :label="handleGlobalI18n('campaign', 'limit_total_points') + ':'" v-show="form.limit_total_points_state">
            <el-input-number v-model.number="form.limit_total_points" :precision="0"  :min="0" :step="1" :disabled="campaign_status === '3'"></el-input-number>
          </el-form-item>
        </div>
      </div>
      <!--产品类别限制-->
      <!--<el-checkbox>Purchasing limit</el-checkbox>-->
      <!--<el-form-item>-->
      <!--<div class="add-category">-->
      <!--<span>+</span><label>Add category</label>-->
      <!--</div>-->
      <!--</el-form-item>-->
      <!--coupon-->
      <el-form-item v-show="campaign_type === '2' || campaign_type === '3'" :label="handleGlobalI18n('campaign', 'select') + ':'" class="coupon">
        <div class="all" :class="{'height400': campaign_status !=='3', 'height150': campaign_status ==='3' }" >
          <el-row :gutter="20" style="height: 100%" v-selectLoadmore="selectLoadMore" >
            <el-scrollbar style="height:100%;">
              <template v-if="campaign_type === '2'">
                <el-col :xs="12" :sm="12" :lg="6" :xl="4" v-for="(item, index) in coupon_list" :key="index" v-show="handleShowCoupon(item.coupon_code)" :class="{'not-allowed': campaign_status === '3'}">
                  <div class="cash coupon1" :class="{'selected': selectCouponItem.coupon_code===item.coupon_code, 'pointer-events bg-f5f7fa': campaign_status === '3'}" @click="selectCoupon(item)">
                    <svg-icon class="corner" icon-class="corner_br"></svg-icon>
                    <label>{{item.coupon_type_code.toLocaleUpperCase()}}</label>
                    <p v-if="item.coupon_type_code === 'gwp'"><span>{{item.product_name}}</span></p>
                    <p v-else-if="item.coupon_type_code === 'discount'">{{item.amount*100}}<span>%</span></p>
                    <p v-else><span>{{globalData.value.currency_symbol}}</span>{{item.amount}}</p>
                  </div>
                </el-col>
              </template>
              <template v-else-if="campaign_type === '3' && coupon_list.length>0">
                <el-col :xs="12" :sm="12" :lg="6" :xl="4" v-for="(item,index) in coupon_list" :key="index" :class="{'not-allowed': campaign_status === '3'}">
                  <div class="gwp coupon1" :class="{'selected': selectCouponItem.coupon_code===item.coupon_code, 'pointer-events bg-f5f7fa': campaign_status === '3'}" @click="selectCoupon(item)">
                    <svg-icon class="corner" icon-class="corner_br"></svg-icon>
                    <label>{{handleGlobalI18n('campaign', 'GWP')}}</label>
                    <p><span>{{item.product_name}}</span></p>
                  </div>
                </el-col>
              </template>
              <div style="text-align: center" >
                <!--{{handleGlobalI18n('campaign', 'after_loaded')}}-->
                <p style="font-size:13px;" v-if="coupon_list.length>=total && list_state"></p>
                <i class="el-icon-loading"  v-else></i>
              </div>
            </el-scrollbar>
          </el-row>
        </div>
      </el-form-item>
    </el-form>
    <div class="button">
      <el-button @click="back(1)" size="small">{{handleGlobalI18n('campaign', 'back')}}</el-button>
      <el-button @click="next" size="small" type="primary" :loading="nextLoading">{{handleGlobalI18n('campaign', 'next')}}</el-button>
    </div>
  </div>
</template>

<script>
  import { queryCouponListBy } from '@/api/loyalty'
  import { addOrUpdateCampaignReward } from '@/api/campaign'
  import { mixLoading } from '@/utils/util'
  import {
    validateCompare,
    validateCompareFloat,
    validatePositiveInteger
  } from '@/utils/validate'
  import {
    signMix
  } from '@/utils'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    mixins: [mixLoading],
    props: {
      campaign_type: {
        type: String,
        default: '1'
      },
      campaign_wizard_id: {
        type: Number
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
        step: 0,
        list_state: false,
        // campaign_type: '1',
        // campaign_wizard_id: 14,
        selectCouponItem: { coupon_code: '' },
        nextLoading: false,
        form: {
          transaction_amount_restriction_state: false,
          participation_limit_state: false,
          limit_total_points_state: false,
          purchase_amount_restriction_from: null,
          purchase_amount_restriction_to: null,
          participant_limited_times: null,
          maximum: '',
          multiple_ratio: null,
          limit_total_points: null
        },
        listQuery: {
          page_no: 0,
          page_size: 24
        },
        campaign_status: '',
        list_form: {},
        total: 0,
        coupon_list: [],
        state: false
      }
    },
    computed: {
      ...mapGetters([
        'campaign_edit',
        'campaign_add'
      ])
    },
    created() {
      this.init()
      if (this.campaign_type === '3' && this.campaign_status !== '3') {
        this.list_form = { coupon_type_code: 'gwp' }
      }
      if ((this.campaign_type === '2' || this.campaign_type === '3') && this.campaign_status !== '3') {
        this.getCouponList()
      }
    },
    watch: {
      campaign_type() {
        this.list_form = {}
        if (this.campaign_type === '3' && this.campaign_status !== '3') {
          this.list_form = { coupon_type_code: 'gwp' }
          this.selectCouponItem = {}
        }
        if ((this.campaign_type === '2' || this.campaign_type === '3') && this.campaign_status !== '3') {
          this.listQuery.page_no = 0
          this.coupon_list = []
          this.getCouponList()
        }
      },
      'form.purchase_amount_restriction_to': {
        handler(newValue, oldValue) {
          this.$refs['form'].validate((valid) => {})
        }
      },
      'form.purchase_amount_restriction_from': {
        handler(newValue, oldValue) {
          this.$refs['form'].validate((valid) => {})
        }
      }
    },
    methods: {
      init() {
        if (this.campaign_edit.state && this.campaign_edit.id !== null) {
          // this.campaign_wizard_id = this.campaign_edit.id
          const edit_detail = this.campaign_edit.detail
          this.step = edit_detail.step
          this.campaign_status = edit_detail.campaign_status
          const reward = edit_detail.reward ? JSON.parse(edit_detail.reward) : null
          if (reward !== null) {
            this.form.participant_limited_times = reward.participant_limited_times
            if (this.form.participant_limited_times) {
              this.form.participation_limit_state = true
            }
            this.form.purchase_amount_restriction_from = reward.purchase_amount_restriction_from
            this.form.purchase_amount_restriction_to = reward.purchase_amount_restriction_to
            if (this.form.purchase_amount_restriction_from && this.form.purchase_amount_restriction_to) {
              this.form.transaction_amount_restriction_state = true
            }
            this.form.multiple_ratio = reward.reward_point.multiple_ratio
            this.form.limit_total_points = reward.reward_point.limit_total_points
            if (this.form.limit_total_points) {
              this.form.limit_total_points_state = true
            }
            if (reward.reward_coupon.hasOwnProperty('coupon_code') && this.campaign_type === '2') {
              this.selectCouponItem = reward.reward_coupon.coupon_info
              this.selectCouponItem.coupon_code = reward.reward_coupon.coupon_code
              if (this.campaign_status === '3') {
                this.coupon_list.push(this.selectCouponItem)
                this.total = 1
                this.list_state = true
              }
            }
            if (reward.reward_gwp.hasOwnProperty('coupon_code') && this.campaign_type === '3') {
              this.selectCouponItem = reward.reward_gwp.coupon_info
              this.selectCouponItem.coupon_code = reward.reward_gwp.coupon_code
              if (this.campaign_status === '3') {
                this.coupon_list.push(this.selectCouponItem)
                this.total = 1
                this.list_state = true
              }
            }
          }
        }
      },
      validateCompare,
      validateCompareFloat,
      validatePositiveInteger,
      handleShowCoupon(coupon) {
        if (this.campaign_status !== '3') {
          return true
        } else if (this.campaign_status === '3') {
          if (this.selectCouponItem.coupon_code === coupon) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      ...mapMutations({
        setAdd: 'SET_ADD'
      }),
      next() {
        if (this.campaign_status === '3') {
          this.back(3)
          return true
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.campaign_type === '1') {
              var confirm_val = this.handleGlobalI18n('campaign', 'reward_confirm')
              this.$confirm(signMix(confirm_val, [this.unit, this.form.multiple_ratio, this.unit]), this.handleGlobalI18n('campaign', 'attention'), {
                confirmButtonText: this.handleGlobalI18n('campaign', 'confirm'),
                cancelButtonText: this.handleGlobalI18n('campaign', 'cancel'),
                confirmButtonClass: 'new_confirm_confirm',
                cancelButtonClass: 'new_confirm_cancel'
              }).then(() => {
                this.submit()
              })
            } else {
              this.submit()
            }
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      submit() {
        var data = {
          compaign_wizard_id: this.campaign_edit.state ? this.campaign_edit.id : this.campaign_wizard_id,
          participant_limited_times: this.form.participation_limit_state ? this.form.participant_limited_times : null,
          purchase_amount_restriction_from: this.form.transaction_amount_restriction_state ? this.form.purchase_amount_restriction_from : null,
          purchase_amount_restriction_to: this.form.transaction_amount_restriction_state ? this.form.purchase_amount_restriction_to : null,
          reward_point: {
            multiple_ratio: this.form.multiple_ratio,
            limit_total_points: this.form.limit_total_points_state ? this.form.limit_total_points : null
          },
          reward_gwp: {
            coupon_code: this.campaign_type === '3' ? this.selectCouponItem.coupon_code : '',
            coupon_info: this.campaign_type === '3' ? this.selectCouponItem : null
          },
          reward_coupon: {
            coupon_code: this.campaign_type === '2' ? this.selectCouponItem.coupon_code : '',
            coupon_info: this.campaign_type === '2' ? this.selectCouponItem : null
          }
        }
        this.setAdd(Object.assign({}, this.campaign_add, {
          'reward': data
        }))
        if (this.campaign_type === '2' && (this.selectCouponItem.coupon_code === undefined || this.selectCouponItem.coupon_code === '' || this.selectCouponItem.coupon_code === null)) {
          this.$notify({
            title: 'Error',
            message: 'please select coupon',
            type: 'error'
          })
          return true
        }
        if (this.campaign_type === '3' && (this.selectCouponItem.coupon_code === undefined || this.selectCouponItem.coupon_code === '' || this.selectCouponItem.coupon_code === null)) {
          this.$notify({
            title: 'Error',
            message: 'please select coupon',
            type: 'error'
          })
          return true
        }
        this.nextLoading = true
        addOrUpdateCampaignReward(data).then(res => {
          this.nextLoading = false
          this.state = true
          this.back(3)
        }).catch(res => {
          this.nextLoading = false
        })
      },
      validatePurchaseTo(rule, value, callback) {
        this.validateCompareFloat(this.form.purchase_amount_restriction_from, this.form.purchase_amount_restriction_to, callback)
      },
      selectCoupon(item) {
        this.selectCouponItem = item
      },
      selectLoadMore() {
        if (this.coupon_list.length >= this.total) {
          return
        }
        this.getCouponList()
      },
      getCouponList() {
        this.listQuery.page_no = ++this.listQuery.page_no
        this.handleMixLoadingStateTrue()
        queryCouponListBy(Object.assign({}, this.list_form, this.listQuery)).then(res => {
          this.total = res.return_result.total_count
          this.coupon_list = this.coupon_list.concat(res.return_result.coupons || [])
          this.handleMixLoadingStateFalse()
          this.list_state = true
        }).catch(res => {
          this.list_state = true
          this.handleMixLoadingStateFalse()
        })
      },
      back(id) {
        this.$emit('selectTabs', parseInt(id))
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-scrollbar__wrap {
    overflow-y: scroll !important;
  }
  .el-scrollbar__bar{
    display: none;
  }
  .reward {
    background-color: #ffffff;
    margin-top: 13px;
    padding: 30px 20px 40px;
    .add-category {
      display: initial;
      border: 1px #777777 dashed;
      border-radius: 10px;
      text-align: center;
      line-height: 1;
      padding: 8px 30px;
      span {
        font-weight: 600;
        font-size: 22px;
        vertical-align: -10%;
        margin-right: 10px;
      }
    }
    .el-checkbox {
      margin-left: 10px;
      margin-bottom: 20px;
    }
    .button {
      margin-top: 40px;
      margin-left: 100px;
    }
    .form {
      label {
        margin: 0 10px;
      }
    }
    .el-input, .el-select,.el-input-number {
      width: 240px;
    }
    .multiple-points {
      .all {
        background-color: #f2f2f2;
        padding: 14px 10px;
      }
      .el-checkbox {
        margin: 10px 0 !important;
      }
    }
    .coupon {
      overflow-y: hidden;
      .all {
        // max-height:380px;
        background-color: #f2f2f2;
        padding: 10px;
      }
      .height400 {
        height:400px;
      }
      .height150 {
        height:110px;
      }
      .el-col {
        .coupon1 {
          cursor: pointer;
          margin-bottom: 20px;
          background-color: #ffffff;
          border: 1px dashed #797979;
          position: relative;
          height: 90px;
          .corner {
            position: absolute;
            bottom: -3px;
            right: -3px;
            font-size: 35px;
            color:#797979;
          }
          label {
            text-align: center;
            position: absolute;
            top: 10px;
            line-height: 20px;
            left: 0;
            height: 20px;
            width: 82px;
            color: #ffffff;
            background-color: #d7d7d7;
          }
          p {
            position: absolute;
            text-align: center;
            margin: auto;
            line-height: 90px;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            font-weight: 600;
            font-size: 30px;
            span {
              font-size: 20px;
              margin-right:4px;
            }
          }
        }
      }
    }
    .selected{
      border-style: solid!important;
      border-color: $primary!important;
      .corner{
        color: $primary!important;
      }
    }
  }
</style>
