<template>
  <div class="advanced-query-coupon" ref="advanced-query">
    <el-form ref="form" :rules="rules"  :model="form" label-position="left" label-width="230px">
      <el-row class="list">
        <!-- Coupon type -->
        <el-col :span="12">
          <!--Coupon type-->
          <el-form-item :label="$t('loyalty.fc_redemption_coupon_advanced_type_label')" prop="coupon_type_code" label-width="140px">
            <el-select clearable filterable v-model="form.coupon_type_code" style="width: 300px;">
              <el-option
                class="new-select-option"
                v-for="item in coupon_type_list"
                :key="item.name"
                :label="$t(`loyalty.${item.name}`)"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- Redemption status -->
        <el-col :span="12">
          <el-form-item :label="$t('loyalty.fc_redemption_coupon_advanced_status_label')" prop="redemption_status" label-width="177">
            <el-select clearable filterable v-model="form.redemption_status" style="width: 300px;">
              <el-option
                class="new-select-option"
                v-for="item in redemption_status_list"
                :key="item.name"
                :label="$t(`loyalty.${item.name}`)"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- Redemption points -->
        <el-col :span="24">
          <el-form-item :label="$t('loyalty.fc_redemption_coupon_advanced_points_label')" >
            <div style="display: flex;align-items: center">
              <el-form-item prop="redemption_points_from" ref="redemption_points_from">
                <el-input type="text" v-model.number="form.redemption_points_from" style="width: 300px;" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
              </el-form-item>
              <label class="connecting-line"></label>
              <el-form-item prop="redemption_points_to" ref="redemption_points_to">
                <el-input type="text" v-model.number="form.redemption_points_to" style="width: 300px;" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <!-- Number of redeemed coupons -->
        <el-col :span="24">
          <el-form-item :label="$t('loyalty.fc_redemption_coupon_advanced_number_label')">
            <div style="display: flex;align-items: center">
              <el-form-item prop="redeem_coupon_count_from" ref="redeem_coupon_count_from">
                <el-input type="age" v-model.number="form.redeem_coupon_count_from" style="width: 300px;" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
              </el-form-item>
              <label class="connecting-line"></label>
              <el-form-item prop="redeem_coupon_count_to" ref="redeem_coupon_count_to">
                <el-input type="age" v-model.number="form.redeem_coupon_count_to" style="width: 300px;" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="button" type="flex" justify="right">
          <el-form-item>
            <div>
              <el-button @click="resetForm1" class="reset">{{$t('loyalty.fc_redemption_coupon_advanced_btn_reset_label')}}</el-button>
              <el-button type="primary" @click="search" class="search">{{$t('loyalty.fc_redemption_coupon_advanced_btn_search_label')}}</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { redemption_status_list, coupon_type_list } from '../data'
  export default {
    data() {
      return {
        coupon_type_list: coupon_type_list,
        redemption_status_list: redemption_status_list,
        rules: {
          redemption_points_from: [{ type: 'number', validator: this.handleRedemptionPointsFrom, trigger: ['change', 'blur'] }],
          redemption_points_to: [{ type: 'number', validator: this.handleRedemptionPointsTo, trigger: ['change', 'blur'] }],
          redeem_coupon_count_from: [{ type: 'number', validator: this.handleRedeemCouponCountFrom, trigger: ['change', 'blur'] }],
          redeem_coupon_count_to: [{ type: 'number', validator: this.handleRedeemCouponCountTo, trigger: ['change', 'blur'] }]
        },
        form: {
          coupon_type_code: null,
          redemption_status: null,
          redemption_points_from: null,
          redemption_points_to: null,
          redeem_coupon_count_from: null,
          redeem_coupon_count_to: null
        }
      }
    },
    methods: {
      handleRedemptionPointsFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && !value && this.form.redemption_points_to))) {
          callback(new Error('Please enter the correct value2'))
          return true
        }
        if (!value && !this.form.redemption_points_to) {
          this.$refs['redemption_points_to'].resetField()
        }
        if (value === null && this.form.redemption_points_to === null) {
          callback()
          return true
        }
        if (typeof this.form.redemption_points_to === 'number' && typeof value === 'number' && value > this.form.redemption_points_to) {
          callback(new Error('Please enter the correct value1'))
          return true
        }
        callback()
      },
      handleRedemptionPointsTo(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.redemption_points_from))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.redemption_points_from) {
          this.$refs['redemption_points_from'].resetField()
        }
        if (value === null && this.form.redemption_points_from === null) {
          callback()
          return true
        }
        if (typeof this.form.redemption_points_from === 'number' && typeof value === 'number' && value < this.form.redemption_points_from) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handleRedeemCouponCountFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.redeem_coupon_count_to))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.redeem_coupon_count_to) {
          this.$refs['redeem_coupon_count_to'].resetField()
        }
        if (value === null && this.form.redeem_coupon_count_to === null) {
          callback()
          return true
        }
        if (typeof this.form.redeem_coupon_count_to === 'number' && typeof value === 'number' && value > this.form.redeem_coupon_count_to) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handleRedeemCouponCountTo(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.redeem_coupon_count_from))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.redeem_coupon_count_from) {
          this.$refs['redeem_coupon_count_from'].resetField()
        }
        if (value === null && this.form.redeem_coupon_count_from === null) {
          callback()
          return true
        }
        if (typeof this.form.redeem_coupon_count_from === 'number' && typeof value === 'number' && value < this.form.redeem_coupon_count_from) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      search() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('advanced_search', this.form)
          }
        })
      },
      resetForm1() {
        this.$refs['form'].resetFields()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .advanced-query-coupon{
    .el-form-item__label{
      font-family: Helvetica-medium-1;
      font-size:14px;
      font-weight:500;
      color:rgba(51,51,51,1);
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-button{
    min-width: 88px;
  }
  .el-select{
    width: 150px!important;
  }
  .el-col{
    height: 66px;
  }
  .el-input{
    width: 200px!important;
  }
  h5 {
    line-height: 3;
  }
  .advanced-query-coupon {
    width:700px;
    background:rgba(255,255,255,1);
    box-shadow:0 5px 15px -3px rgba(204,204,204,1);
    padding: 0 20px;
    margin-top: 10px;
    .el-form {
      padding-top:20px;
    }
    .connecting-line{
      margin: 0 8px;
      width:14px;
      height:2px;
      background:rgba(51,51,51,1);
      display: block;
    }
  .reset{
      border-color: $new-primary;
      color: $new-primary;
      background-color: #ffffff;
    }
    .search{
      background-color: $new-primary;
      border-color: $new-primary;
    }
  }
</style>
