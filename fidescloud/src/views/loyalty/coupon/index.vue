<template>
  <div class="coupon">
    <el-input type="text" style="width: 360px; margin-bottom:10px"  :placeholder="handleGlobalI18n('loyalty', 'input_placeholder')" v-model="listQuery.coupon_name" v-filter-special-char></el-input>
    <el-button type="primary" icon="el-icon-search" @click="getData">{{handleGlobalI18n('loyalty', 'search')}}</el-button>
    <el-button icon="el-icon-plus" style="margin-left: 0" @click="dialogFormVisible = true;edit = false;">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
    <el-table :data="tableData" v-loading="loading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column :label="handleGlobalI18n('loyalty', 'coupon_code')" :show-overflow-tooltip="true" align="center" prop="coupon_code" width="300"></el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'coupon_name')" :show-overflow-tooltip="true" align="center" prop="coupon_name"></el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'coupon_type')" align="center" prop="coupon_type_name"></el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'effective_from')" align="center" prop="specific_effective_date_from" >
        <template slot-scope="scope">
          <template v-if="scope.row.effective_type === 2">
            {{scope.row.specific_effective_date_from ? globalData.formatDate((scope.row.specific_effective_date_from).substring(0, 10)) : table_placeholder}}
          </template>
          <template v-else>
            {{(handleGlobalI18n('member', 'issue_date')).toLowerCase()}}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'effective_to')" align="center" prop="specific_effective_date_to" >
        <template slot-scope="scope">
          <template v-if="scope.row.effective_type === 2">
            {{scope.row.specific_effective_date_to ? globalData.formatDate((scope.row.specific_effective_date_to).substring(0, 10)) : table_placeholder}}
          </template>
          <template v-else>
            {{`${(handleGlobalI18n('member', 'issue_date')).toLowerCase()} + ${scope.row.relative_value}`}} {{handleRelativeUnit(scope.row.relative_unit)}}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'status')" align="center">
        <template slot-scope="scope">
          {{scope.row.active_flag===1? 'active': 'isActive'}}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'operation')" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)">{{handleGlobalI18n('loyalty', 'edit')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></pagination-container>
    <el-dialog :title="selectName" :visible.sync="dialogFormVisible" width="700px">
      <add-procuct :state="pgVisable" @handleAddProduct="handleAddProduct" @handleSelectProductInfo="handleSelectProductInfo"></add-procuct>
      <el-form ref="addCoupon" label-width="200px"  autoComplete="on" :rules="rules"  :model="form">
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_coupon_name')" prop="coupon_name" >
          <el-input v-model="form.coupon_name" maxlength="32" @change="form.coupon_name=MixTrim(form.coupon_name)" class="width200"></el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_coupon_code')" prop="coupon_code" v-show="this.edit">
          <el-input v-model="form.coupon_code" @change="form.coupon_code=MixTrim(form.coupon_code)" class="width200" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_coupon_type')"   prop="coupon_type_code">
          <el-select v-model="form.coupon_type_code" class="width200">
            <el-option v-for="item in coupon_type_list" :label="item.coupon_type_name" :value="item.coupon_type_code" :key="item.coupon_type_code" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_cash_amount')" v-if="form.coupon_type_code === 'cash'" prop="cash_amount">
          <el-input-number v-model="form.cash_amount" :min="0" :step="1" :precision="2" class="width200"></el-input-number>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_discount_amount')" v-if="form.coupon_type_code === 'discount'" prop="discount_amount">
          <el-input v-model="form.discount_amount" class="width200">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_select_product')" v-if="form.coupon_type_code === 'gwp'"
                      prop="product_code"
                      ref="product_code"
                      :rules="[{ required: true, message: 'The select product length is up to 32', trigger: ['change', 'blur'] }]" >
          <el-button icon="el-icon-plus" @click="pgVisable=true">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
          <el-tag
            v-for="tag in multipleSelection"
            :key="tag.product_name"
            closable
            size="medium"
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag.product_name}}
          </el-tag>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_effective_on')" prop="effective_type">
          <el-select v-model="form.effective_type" class="width200">
            <el-option :label="handleGlobalI18n('loyalty', 'dialog_specific_date')"  :value="parseInt(2)"></el-option>
            <el-option :label="handleGlobalI18n('loyalty', 'dialog_relative_date')" :value="parseInt(1)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_relative_date')"  v-if="form.effective_type===1" prop="relative_value">
          <el-input :min="0" :step="1" v-model="form.relative_value" style="width: 200px">
            <template slot="append">
              <el-select v-model="form.relative_unit" style="width: 100px;">
                <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'days'))" :value="parseInt(1)"></el-option>
                <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'months'))" :value="parseInt(2)"></el-option>
                <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'years'))" :value="parseInt(3)"></el-option>
              </el-select>
            </template>
          </el-input>
          <p style="font-size: 14px;color: #606266;line-height: 1;margin-top:10px;" v-text="handleGlobalI18n('loyalty', 'effective_tips')"></p>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_effective_date_period')" v-if="form.effective_type===2" prop="specific_effective_date_from"
                      style="width:385px;"
                      :rules="[{ required: true, message: 'Please enter the correct value', trigger: 'change' }]">
          <eldate-picker :value="date" @valueDate="valueDate" :pickerOptions="pickerOptions0"  style="width:385px;"></eldate-picker>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_coupon_status')" v-show="edit">
          <el-select v-model="form.active_flag" class="width200">
            <el-option :label="handleGlobalI18n('loyalty', 'dialog_coupon_state_1')" :value="parseInt(1)"></el-option>
            <el-option :label="handleGlobalI18n('loyalty', 'dialog_coupon_state_2')" :value="parseInt(0)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_coupon_description')"  prop="description" >
          <el-input
            style="max-width: 385px;"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            v-model="form.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; pgVisable = false">{{handleGlobalI18n('loyalty', 'cancel')}}</el-button>
        <el-button type="primary" @click="submitForm('addCoupon')" :loading="saveLoading">{{handleGlobalI18n('loyalty', 'save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    queryCouponListBy,
    addOrUpdateCoupon,
    // saveCoupon,
    // updateCoupon,
    checkCouponCode,
    queryCouponTypeList
  } from '@/api/loyalty'
  import PaginationContainer from '@/components/PaginationContainer'
  import {
    pageLimit
  } from '@/api/api'
  import {
    parseIntVal,
    handleTrim,
    mixLoading,
    pickerOptions0Mixins,
    validatePositiveInteger1Mixins,
    validateMoreThanZeroMixins,
    filterCharacter,
    handlePageNoMixins
  } from '@/utils/util'
  import AddProcuct from './add-product'
  import EldatePicker from '@/components/EldatePicker'
  import filterSpecialChar from '@/directive/special-char'
  import { DateTime } from 'luxon'
  import { firstWordUpperCase } from '@/utils'
  export default {
    mixins: [parseIntVal, filterCharacter, handleTrim, mixLoading, pickerOptions0Mixins, validatePositiveInteger1Mixins, validateMoreThanZeroMixins, handlePageNoMixins],
    components: {
      PaginationContainer,
      AddProcuct,
      EldatePicker
    },
    directives: {
      filterSpecialChar
    },
    data() {
      return {
        date: [],
        rulesSelect: {
          coupon_name: [
            { required: true, max: 32, message: this.handleGlobalI18n('validation', 'coupon_name_error'), trigger: 'change' }
          ]
        },
        rules: {
          cash_amount: [
            { required: true, message: this.handleGlobalI18n('validation', 'cash_amount_null'), trigger: ['change', 'blur'] },
            { validator: this.checkMoreThanZeroValue, trigger: ['blur'] }
          ],
          discount_amount: [
            { required: true, message: this.handleGlobalI18n('validation', 'discount_amount_null'), trigger: ['change', 'blur'] },
            // { validator: this.checkMoreThanZeroValue, trigger: ['blur'] },
            { validator: this.handleDiscountAmount, trigger: ['blur', 'change'] }
          ],
          relative_value: [
            { required: true, message: this.handleGlobalI18n('validation', 'relative_value_null'), trigger: ['change', 'blur'] },
            { validator: this.checkPositiveInteger, trigger: ['blur'] }
          ],
          coupon_name: [
            { required: true, max: 32, message: this.handleGlobalI18n('validation', 'coupon_name_null'), trigger: 'change' }
          ],
          coupon_type_code: [
            { required: true, message: this.handleGlobalI18n('validation', 'coupon_type_code_null'), trigger: 'change' }
          ],
          description: [
            { max: 125, message: this.handleGlobalI18n('validation', 'coupon_description_length'), trigger: 'change' }
          ],
          effective_type: [
            { required: true, message: this.handleGlobalI18n('validation', 'effective_type_null'), trigger: 'change' }
          ]
        },
        pgVisable: false,
        multipleSelection: [],
        dialogFormVisible: false,
        tableData: [],
        coupon_type_list: [{ coupon_type_name: this.handleGlobalI18n('loyalty', 'cash'), coupon_type_code: 'cash' }, { coupon_type_name: this.handleGlobalI18n('loyalty', 'discount'), coupon_type_code: 'discount' }, { coupon_type_name: this.handleGlobalI18n('loyalty', 'gwp'), coupon_type_code: 'gwp' }],
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          coupon_name: ''
        },
        total: 0,
        form: {
          discount_amount: null,
          cash_amount: null,
          coupon_name: null,
          coupon_code: null,
          coupon_type_code: 'cash',
          active_flag: 1,
          product_code: null,
          effective_type: 1,
          relative_value: null,
          relative_unit: 1,
          specific_effective_date_from: null,
          specific_effective_date_to: null,
          description: ''
        },
        loading: false,
        saveLoading: false,
        edit: false,
        postfix: ''
      }
    },
    computed: {
      selectName() {
        if (!this.edit) {
          return this.handleGlobalI18n('loyalty', 'add_new_coupon')
        } else {
          return this.handleGlobalI18n('loyalty', 'edit_coupon')
        }
      }
    },
    created() {
      this.getData()
      // this.queryCouponTypeList()
    },
    methods: {
      handleRelativeUnit(val) {
        var data = ['days', 'months', 'years']
        return this.handleGlobalI18n('loyalty', data[val - 1])
      },
      firstWordUpperCase,
      handleDiscountAmount(rule, value, callback) {
        if (!value) {
          return callback(new Error(this.handleGlobalI18n('validation', 'compare_the_size_error')))
        }
        if (!(/^[0-9]+$/.test(value))) {
          this.form.discount_amount = null
          callback()
        }
        const val = parseInt(value)
        if (val <= 0 || val >= 100) {
          callback(new Error(this.handleGlobalI18n('validation', 'compare_the_size_error')))
        } else {
          callback()
        }
      },
      handleSelectProductInfo(val) {
        this.$refs.product_code.clearValidate()
        this.multipleSelection[0] = val
        this.form.product_code = val.product_code
      },
      valueDate(val) {
        [this.form.specific_effective_date_from, this.form.specific_effective_date_to] = val
      },
      setDateTime() {
        const now_date = DateTime.local().toISO()
        const now_date_length = now_date.length
        this.postfix = now_date.substring(now_date_length - 6, now_date_length)
      },
      handleAddProduct(state) {
        this.pgVisable = state
      },
      getData() {
        this.listQuery.page_no = 1
        this.getCouponList()
      },
      checkCouponCode(rule, value, callback) {
        checkCouponCode(this.form.coupon_code).then(res => {
          callback()
        }).catch(res => {
          callback(new Error(res.return_message))
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getData()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getData()
      },
      queryCouponTypeList() {
        queryCouponTypeList({ page_no: 1, page_size: 100 }).then(res => {
          this.coupon_type_list = res.return_result.coupon_types
        }).catch(res => {
          console.log(res.return_message)
        })
      },
      getCouponList() {
        this.loading = true
        queryCouponListBy(this.listQuery).then(res => {
          this.total = res.return_result.total_count
          this.tableData = res.return_result.coupons
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          this.saveLoading = true
          if (valid) {
            this.setDateTime()
            if (this.form.coupon_type_code === 'cash') {
              this.form.amount = this.form.cash_amount
            }
            if (this.form.coupon_type_code === 'discount') {
              this.form.amount = this.form.discount_amount / 100
            }
            addOrUpdateCoupon({ ...this.form, discount_amount: this.form.discount_amount / 100, specific_effective_date_from: this.form.specific_effective_date_from ? `${(this.form.specific_effective_date_from).substring(0, 10)}T00:00:00.000${this.postfix}` : null, specific_effective_date_to: this.form.specific_effective_date_to ? `${(this.form.specific_effective_date_to).substring(0, 10)}T23:59:59.999${this.postfix}` : null }).then(res => {
              this.saveLoading = false
              this.dialogFormVisible = false
              this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
              this.listQuery = {
                page_no: 1,
                page_size: pageLimit,
                coupon_name: ''
              }
              this.getCouponList()
              this.form = {
                discount_amount: null,
                cash_amount: null,
                coupon_name: null,
                coupon_code: null,
                coupon_type_code: 'cash',
                active_flag: 1,
                product_code: null,
                effective_type: 1,
                relative_value: null,
                relative_unit: 1,
                specific_effective_date_from: null,
                specific_effective_date_to: null,
                description: ''
              }
              this.$refs[formName].resetFields()
            }).catch(res => {
              this.saveLoading = false
            })
          } else {
            this.saveLoading = false
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleClose(tag) {
        // console.log(typeof tag, typeof this.multipleSelection)
        // console.log(tag, this.multipleSelection)
        this.multipleSelection.splice(this.multipleSelection.indexOf(tag))
        this.form.product_code = ''
      },
      check(index) {
        return index % 2 === 0
      },
      handleEdit(index, row) {
        // this.resetForm('addCoupon')
        this.multipleSelection = []
        if (row.product_code !== undefined && row.product_code !== null && row.product_name !== undefined && row.product_name !== null) {
          this.multipleSelection[0] = { product_code: row.product_code, product_name: row.product_name }
        }
        this.dialogFormVisible = true
        this.form = Object.assign(JSON.parse(JSON.stringify(row)), { cash_amount: 0, discount_amount: 0 })
        if (this.form.coupon_type_code === 'cash') {
          this.form.cash_amount = this.form.amount || 0
        }
        if (this.form.coupon_type_code === 'discount') {
          this.form.discount_amount = this.form.amount * 100 || 0
        }
        this.$nextTick(() => {
          this.$set(this.date, 0, row.specific_effective_date_from ? (row.specific_effective_date_from).substring(0, 10) : null)
          this.$set(this.date, 1, row.specific_effective_date_to ? (row.specific_effective_date_to).substring(0, 10) : null)
        })
        this.edit = true
      },
      handleDelete(index, row) {
      },
      toAddProduct() {
        this.$router.push({
          path: '/loyalty/add-product'
        })
      }
    },
    watch: {
      edit() {
        if (!this.edit) {
          this.multipleSelection = []
          this.$refs['addCoupon'].resetFields()
          this.form = {
            discount_amount: 0,
            cash_amount: 0,
            coupon_name: '',
            coupon_code: '',
            coupon_type_code: '',
            active_flag: 1,
            amount: 0,
            product_code: '',
            effective_type: 1,
            relative_value: '',
            relative_unit: 1,
            specific_effective_date_from: null,
            specific_effective_date_to: null,
            description: ''
          }
          this.$refs['addCoupon'].resetFields()
        }
      },
      'form.coupon_type_code': {
        handler(val) {
          // this.$refs.addCoupon.clearValidate(['product_code', 'cash_amount', 'discount_amount'])
        }
      },
      'form.cash_amount': {
        handler(val) {
          if (this.form.cash_amount === '' || this.form.cash_amount === undefined || this.form.cash_amount <= 0) {
            this.$nextTick(() => {
              this.form.cash_amount = 0
            })
            return true
          }
        }
      },
      'form.discount_amount': {
        handler(val) {
          if (this.form.discount_amount === '' || this.form.discount_amount === undefined || this.form.discount_amount <= 0) {
            this.$nextTick(() => {
              this.form.discount_amount = 0
            })
            return true
          }
        }
      },
      'form.relative_value': {
        handler(val) {
          if (this.form.relative_value === '' || this.form.relative_value === undefined || this.form.relative_value <= 0) {
            this.$nextTick(() => {
              this.form.relative_value = 0
            })
            return true
          }
        }
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-form-item {
    margin-bottom: 20px;
  }
  .width200{
    width: 200px;
  }
  .pagination-container {
    text-align: right;
    padding: 15px 0;
    background-color: #ffffff;
  }
  .coupon {
    margin: 25px;
    .gwp{
      text-align: left;
      label{
        border:1px solid #666666;
        padding:2px 20px;
        border-radius: 5px;
      }
      div{
        &:not(:first-child){
          margin-top:10px;
        }
      }
    }
  }

</style>
