<template>
  <div class="advanced-query-gift" ref="advanced-query">
    <el-form ref="form" :rules="rules"  :model="form" label-width="150px" label-position="left">
      <el-row class="list">
        <!-- Gift category -->
        <el-col :span="24">
          <el-form-item :label="$t('loyalty.fc_gift_advanced_category_label')" prop="gift_category_code">
            <el-select clearable filterable v-model="form.gift_category_code" style="width: 300px;" :placeholder="$t('loyalty.fc_gift_advanced_category_input_label')" :loading="category_list_status">
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
        <!-- Retail market price -->
        <el-col :span="24">
          <el-form-item :label="$t('loyalty.fc_gift_advanced_market_price_label')" >
            <div style="display: flex; align-items: center">
              <el-form-item prop="unit_price_from" ref="unit_price_from">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" type="text" v-model.number="form.unit_price_from" />
              </el-form-item>
              <label class="connecting-line"></label>
              <el-form-item prop="unit_price_to" ref="unit_price_to">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" type="text" v-model.number="form.unit_price_to" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <!-- Purchased price -->
        <el-col :span="24">
          <el-form-item :label="$t('loyalty.fc_gift_advanced_purchased_price_label')">
            <div style="display: flex;align-items: center">
              <el-form-item prop="purchased_price_from" ref="purchased_price_from">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.purchased_price_from" />
              </el-form-item>
              <label class="connecting-line"></label>
              <el-form-item prop="purchased_price_to" ref="purchased_price_to">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.purchased_price_to" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <!-- Stock -->
        <el-col :span="24">
          <el-form-item :label="$t('loyalty.fc_gift_advanced_stock_label')">
            <div style="display: flex;align-items: center">
              <el-form-item prop="inventory_from" ref="inventory_from">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.inventory_from" />
              </el-form-item>
              <label class="connecting-line"></label>
              <el-form-item prop="inventory_to" ref="inventory_to">
                <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 300px;" type="text" v-model.number="form.inventory_to" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <div class="button">
            <div>
              <el-button @click="resetForm1" class="reset">{{$t('loyalty.fc_gift_advanced_btn_reset_label')}}</el-button>
              <el-button type="primary" @click="search" class="search">{{$t('loyalty.fc_gift_advanced_btn_search_label')}}</el-button>
            </div>
        </div>
      </el-row>
    </el-form>
  </div>
</template>
<script>
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
        downloadLoading: false,
        rules: {
          unit_price_from: [{ validator: this.handleUnitPriceFrom, trigger: 'change' }],
          unit_price_to: [{ validator: this.handleUintPriceTo, trigger: 'change' }],
          purchased_price_from: [{ validator: this.handlePurchasePriceFrom, trigger: 'change' }],
          purchased_price_to: [{ validator: this.handlePurchasePriceTo, trigger: 'change' }],
          inventory_from: [{ validator: this.handleInventoryFrom, trigger: 'change' }],
          inventory_to: [{ validator: this.handleInventoryTo, trigger: 'change' }]
        },
        form: {
          gift_name: null,
          gift_category_code: null,
          unit_price_from: null,
          unit_price_to: null,
          purchased_price_from: null,
          purchased_price_to: null,
          inventory_from: null,
          inventory_to: null
        }
      }
    },
    methods: {
      handleUnitPriceFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.unit_price_to))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.unit_price_to) {
          this.$refs['unit_price_to'].resetField()
        }
        if (value === null && this.form.unit_price_to === null) {
          callback()
          return true
        }
        if (typeof this.form.unit_price_to === 'number' && typeof value === 'number' && value > this.form.unit_price_to) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handleUintPriceTo(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.unit_price_from))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.unit_price_from) {
          this.$refs['unit_price_from'].resetField()
        }
        if (value === null && this.form.unit_price_from === null) {
          callback()
          return true
        }
        if (typeof this.form.unit_price_from === 'number' && typeof value === 'number' && value < this.form.unit_price_from) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handlePurchasePriceFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.purchased_price_to))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.purchased_price_to) {
          this.$refs['purchased_price_to'].resetField()
        }
        if (value === null && this.form.purchased_price_to === null) {
          callback()
          return true
        }
        if (typeof this.form.purchased_price_to === 'number' && typeof value === 'number' && value > this.form.purchased_price_to) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handlePurchasePriceTo(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.purchased_price_from))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.purchased_price_from) {
          this.$refs['purchased_price_from'].resetField()
        }
        if (value === null && this.form.purchased_price_from === null) {
          callback()
          return true
        }
        if (typeof this.form.purchased_price_from === 'number' && typeof value === 'number' && value < this.form.purchased_price_from) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handleInventoryFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.inventory_to))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.inventory_to) {
          this.$refs['inventory_to'].resetField()
        }
        if (value === null && this.form.inventory_to === null) {
          callback()
          return true
        }
        if (typeof this.form.inventory_to === 'number' && typeof value === 'number' && value > this.form.inventory_to) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        callback()
      },
      handleInventoryTo(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.inventory_from))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.inventory_from) {
          this.$refs['inventory_from'].resetField()
        }
        if (value === null && this.form.inventory_from === null) {
          callback()
          return true
        }
        if (typeof this.form.inventory_from === 'number' && typeof value === 'number' && value < this.form.inventory_from) {
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
      confirmSubmit(value, limitLength, callback) {
        if (value) {
          if ((!callback && value.length <= limitLength) || (callback && callback(value) && value.length <= limitLength)) {
            return 1
          } else {
            return 0
          }
        } else {
          return 0
        }
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
  .el-input, .el-select {
    width: 200px!important;
  }
  .el-col{
    height: 66px;
  }
  h5 {
    line-height: 3;
  }
  .advanced-query-gift {
    padding: 0 20px;
    width:620px;
    background:rgba(255,255,255,1);
    box-shadow:0px 5px 15px -3px rgba(204,204,204,1);
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
    .button{
      text-align: center;
      width: 100%;
      margin-top: -3px;
      margin-bottom: 12px;
      .reset{
        margin-right: 7px;
        background-color: #ffffff;
      }
    }
  .reset{
      border-color: $new-primary;
      color: $new-primary;
    }
    .search{
      background-color: $new-primary;
      border-color: $new-primary;
    }
  }
</style>
