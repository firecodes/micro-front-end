<template>
  <div class="advanced-query-gift" ref="advanced-query">
    <el-form ref="form" :rules="rules"  :model="form" label-position="left" label-width="230px">
      <el-row class="list">
        <!-- Gift category -->
        <el-col :span="12">
          <!--Gift category-->
          <el-form-item :label="$t('loyalty.fc_redemption_gift_advanced_category_label')" prop="gift_category_code" label-width="140px">
            <el-select clearable filterable v-model="form.gift_category_code" style="width: 300px;" :loading="category_list_status">
              <el-option
                class="new-select-option"
                v-for="item in category_list"
                :key="item.gift_category_code"
                :label="item.gift_category_name"
                :value="item.gift_category_code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- Redemption status -->
        <el-col :span="12">
          <el-form-item :label="$t('loyalty.fc_redemption_gift_advanced_status_label')" prop="redemption_status" label-width="177">
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
          <el-form-item :label="$t('loyalty.fc_redemption_gift_advanced_points_label')" >
            <div style="display: flex;align-items: center">
              <el-form-item prop="redemption_points_from" ref="redemption_points_from">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.redemption_points_from" />
              </el-form-item>
              <label class="connecting-line" />
              <el-form-item prop="redemption_points_to" ref="redemption_points_to">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.redemption_points_to" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <!-- Number of redeemed coupons -->
        <el-col :span="24">
          <el-form-item :label="$t('loyalty.fc_redemption_gift_advanced_number_label')">
            <div style="display: flex;align-items: center">
              <el-form-item prop="redeem_gift_count_from" ref="redeem_gift_count_from">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.redeem_gift_count_from" />
              </el-form-item>
              <label class="connecting-line" />
              <el-form-item prop="redeem_gift_count_to" ref="redeem_gift_count_to">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.redeem_gift_count_to" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <!-- Stock -->
        <el-col :span="24">
          <el-form-item :label="$t('loyalty.fc_redemption_gift_advanced_stock_label')">
            <div style="display: flex;align-items: center">
              <el-form-item prop="gift_stock_from" ref="gift_stock_from">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.gift_stock_from" />
              </el-form-item>
              <label class="connecting-line" />
              <el-form-item prop="gift_stock_to" ref="gift_stock_to">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.gift_stock_to" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="button" type="flex" justify="right">
          <el-form-item>
            <div>
              <el-button @click="resetForm1" class="reset">{{$t('loyalty.fc_redemption_gift_advanced_btn_reset_label')}}</el-button>
              <el-button type="primary" @click="search" class="search">{{$t('loyalty.fc_redemption_gift_advanced_btn_search_label')}}</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { redemption_status_list } from '../data'
  export default {
    props: {
      category_list: {
        type: Array,
        default: []
      },
      category_list_status: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        redemption_status_list: redemption_status_list,
        downloadLoading: false,
        rules: {
          redemption_points_from: [{ validator: this.handleRedemptionPointsFrom, trigger: 'change' }],
          redemption_points_to: [{ validator: this.handleRedemptionPointsTo, trigger: 'change' }],
          redeem_gift_count_from: [{ validator: this.handleRedeemGiftCountFrom, trigger: 'change' }],
          redeem_gift_count_to: [{ validator: this.handleRedeemGiftCountTo, trigger: 'change' }],
          gift_stock_from: [{ validator: this.handleGiftStockFrom, trigger: 'change' }],
          gift_stock_to: [{ validator: this.handleGiftStockTo, trigger: 'change' }]
        },
        form: {
          gift_category_code: null,
          redemption_status: null,
          redemption_points_from: null,
          redemption_points_to: null,
          redeem_gift_count_from: null,
          redeem_gift_count_to: null,
          gift_stock_from: null,
          gift_stock_to: null
        }
      }
    },
    methods: {
      handleRedemptionPointsFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.redemption_points_to))) {
          callback(new Error('Please enter the correct value'))
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
          callback(new Error('Please enter the correct value'))
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
      handleRedeemGiftCountFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.redeem_gift_count_to))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.redeem_gift_count_to) {
          this.$refs['redeem_gift_count_to'].resetField()
        }
        if (value === null && this.form.redeem_gift_count_to === null) {
          callback()
          return true
        }
        if (typeof this.form.redeem_gift_count_to === 'number' && typeof value === 'number' && value > this.form.redeem_gift_count_to) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handleRedeemGiftCountTo(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.redeem_gift_count_from))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.redeem_gift_count_from) {
          this.$refs['redeem_gift_count_from'].resetField()
        }
        if (value === null && this.form.redeem_gift_count_from === null) {
          callback()
          return true
        }
        if (typeof this.form.redeem_gift_count_from === 'number' && typeof value === 'number' && value < this.form.redeem_gift_count_from) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handleGiftStockFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.gift_stock_to))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.gift_stock_to) {
          this.$refs['gift_stock_to'].resetField()
        }
        if (value === null && this.form.gift_stock_to === null) {
          callback()
          return true
        }
        if (typeof this.form.gift_stock_to === 'number' && typeof value === 'number' && value > this.form.gift_stock_to) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handleGiftStockTo(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.gift_stock_from))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.gift_stock_from) {
          this.$refs['gift_stock_from'].resetField()
        }
        if (value === null && this.form.gift_stock_from === null) {
          callback()
          return true
        }
        if (typeof this.form.gift_stock_from === 'number' && typeof value === 'number' && value < this.form.gift_stock_from) {
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
  .advanced-query-gift{
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
  .advanced-query-gift {
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
