<template>
  <div class="basic-point" ref="standard_points_rule">
    <div class="contain" v-loading="loading">
      <div class="info">
        <el-form :model="form" label-width="100px" ref="form">
          <!--Point earn rule-->
          <p class="p">{{$t('loyalty.fc_loyalty_point_standard_earn_section_label')}}</p>
          <el-form-item style="margin-left:-62px; color:#606266" prop="point_ratio">
            <span>{{$t('loyalty.fc_loyalty_point_standard_earn_spend_label')}}&nbsp;</span>
            <el-select style="width:100px;" v-model="unit" disabled>
              <el-option :label="unit" :value="unit" />
            </el-select>
            <span>&nbsp;&nbsp;{{$t('loyalty.fc_loyalty_point_standard_earn_get_label')}}&nbsp;&nbsp;</span>
            <el-input-number :disabled="modify_state" :max="99999999" :min="0.01" :precision="2" :rules="[{ required: true, message: 'not empty', trigger: 'blur' }]" :step="0.01" style="width:130px;" v-model="form.point_ratio" />
            <label class="hint">&nbsp;&nbsp;{{$t('loyalty.fc_loyalty_point_standard_earn_points_label')}}</label>
          </el-form-item>
          <!--Point redemption rule-->
          <p class="p">{{$t('loyalty.fc_loyalty_point_standard_redemption_section_label')}}</p>
          <el-form-item style="margin-left:-57px;color:#606266">
            <span>{{$t('loyalty.fc_loyalty_point_standard_redemption_point_label')}} </span>
            <el-input-number :disabled="modify_state" :max="99999999" :min="0.0001" :precision="2" :step="0.1"  style="width:200px;" v-model="point_monetary_value" />
            <el-select style="width:100px;" v-model="unit" disabled>
              <el-option :label="unit" :value="unit" />
            </el-select>
          </el-form-item>
          <!--Point expiry rule-->
          <p class="p">{{$t('loyalty.fc_loyalty_point_standard_expiry_section_label')}}</p>
          <el-form-item :label="$t('loyalty.fc_loyalty_point_standard_expiry_rule1_label')" prop="expired_rule" >
            <el-select v-model.number="form.expired_type" placeholder="please select" :disabled="modify_state" clearable>
              <el-option :label="handleGlobalI18n('loyalty', 'relative_date')"  :value="parseInt(2)" />
              <el-option :label="handleGlobalI18n('loyalty', 'specific_date')" :value="parseInt(1)" />
              <el-option :label="handleGlobalI18n('loyalty', 'no_expiration')" :value="parseInt(3)" />
            </el-select>
          </el-form-item>
          <!--Relative date-->
          <el-form-item :label="$t('loyalty.fc_loyalty_point_standard_expiry_rule2_label')" v-show="form.expired_type===2">
            <el-input-number :disabled="modify_state" :max="99999999" :min="1" :precision="0" :step="1" style="width: 180px" v-model.number="relative_value" />
            <el-select :disabled="modify_state" placeholder="please select" style="width: 120px" v-model.number="form.relative_unit">
              <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'days'))" :value="parseInt(1)" />
              <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'months'))" :value="parseInt(2)" />
              <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'years'))" :value="parseInt(3)" />
            </el-select>
          </el-form-item>
          <!--Specific date-->
          <el-form-item :label="handleGlobalI18n('loyalty', 'after')" v-show="form.expired_type===1">
            <el-input-number :disabled="modify_state" :max="99999999" :min="0" :precision="0" :step="1" style="width:160px;" v-model="fixed_after_year" />
            <span style="font-size:13px;color:#888888;padding:0 5px">{{firstWordUpperCase(handleGlobalI18n('loyalty', 'year'))}}</span>
            <el-input-number :disabled="modify_state" :max="99999999" :min="0" :precision="0" :step="1" style="width: 160px;" v-model="fixed_specific_month" />
            <span style="font-size:13px;color:#888888;padding:0 5px">{{firstWordUpperCase(handleGlobalI18n('loyalty', 'month'))}}</span>
            <el-input-number :disabled="modify_state" :max="99999999" :min="0" :precision="0" :step="1" style="width: 160px;" v-model="form.fixed_specific_date" />
            <span style="font-size:13px;color:#888888;padding:0 5px">{{firstWordUpperCase(handleGlobalI18n('loyalty', 'day'))}}</span>
          </el-form-item>
          <p class="p">{{$t('loyalty.fc_loyalty_point_standard_details_section_label')}}</p>
          <el-form-item :label="$t('loyalty.fc_loyalty_point_standard_details_remark_label')">
            <el-input
              style="width: 300px"
              type="textarea"
              :disabled="modify_state"
              maxlength="125"
              :autosize="{ minRows: 2, maxRows: 6}"
              v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    addPointRule,
    updatePointRule,
    queryPointRule
  } from '@/api/loyalty'
  import { firstWordUpperCase } from '@/utils'
  export default {
    data() {
      return {
        loading: false,
        unit: this.globalData.value.currency,
        saveLoading: false,
        modify_state: false,
        old_point_ratio: 1,
        point_monetary_value: 1,
        old_point_monetary_value: 1,
        relative_value: 1,
        fixed_after_year: 0,
        fixed_specific_month: 0,
        form: {
          id: null,
          point_ratio: 1,
          expired_type: 3,
          relative_unit: 1,
          relative_value: 1,
          fixed_after_year: 0,
          fixed_specific_month: 0,
          fixed_specific_date: 1,
          remark: ''
        }
      }
    },
    created() {
      this.queryPointRule()
    },
    methods: {
      firstWordUpperCase,
      changePointRatio() {
        this.$confirm(`${this.handleGlobalI18n('loyalty', 'confirm1')}"1${this.unit}"${this.handleGlobalI18n('loyalty', 'confirm2')}"${this.form.point_ratio}"${this.unit}"${this.handleGlobalI18n('loyalty', 'confirm3')}"1${this.unit}"?`, this.handleGlobalI18n('loyalty', 'attention'), {
          confirmButtonText: this.handleGlobalI18n('loyalty', 'confirm'),
          cancelButtonText: this.handleGlobalI18n('loyalty', 'cancel'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          this.old_point_ratio = this.form.point_ratio
        }).catch(() => {
          this.form.point_ratio = this.old_point_ratio
        })
      },
      changePointMonetaryValue() {
        this.$confirm(`${this.handleGlobalI18n('loyalty', 'confirm4')}${this.point_monetary_value}${this.unit}?`, this.handleGlobalI18n('loyalty', 'attention'), {
          confirmButtonText: this.handleGlobalI18n('loyalty', 'confirm'),
          cancelButtonText: this.handleGlobalI18n('loyalty', 'cancel'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          this.old_point_monetary_value = this.point_monetary_value
        }).catch(() => {
          this.point_monetary_value = this.old_point_monetary_value
        })
      },
      validatePoint(rule, value, callback) {
        if ((value) <= 0 || isNaN(parseInt(value))) {
          callback(new Error(this.handleGlobalI18n('validation', 'point_error')))
        } else {
          callback()
        }
      },
      queryPointRule() {
        this.loading = true
        queryPointRule().then(res => {
          if (res.return_result.id === null || JSON.stringify(res.return_result) === '{}') {
            this.modify_state = false
          } else {
            this.modify_state = true
            const data = res.return_result
            this.form.fixed_specific_date = data.fixed_specific_date || 0
            this.relative_value = data.relative_value
            this.fixed_after_year = data.fixed_after_year
            this.fixed_specific_month = data.fixed_specific_month
            this.form = data
            this.old_point_monetary_value = data.point_monetary_value || 0
            this.point_monetary_value = this.old_point_monetary_value || 0
            this.old_point_ratio = data.point_ratio || 0
            this.form.point_ratio = this.old_point_ratio || 0
          }
          this.$emit('getFormId', !this.modify_state)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 保存数据
      save() {
        if (!this.modify_state) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.$confirm(this.handleGlobalI18n('loyalty', 'confirm5'), this.handleGlobalI18n('loyalty', 'attention'), {
                confirmButtonText: this.handleGlobalI18n('loyalty', 'confirm'),
                cancelButtonText: this.handleGlobalI18n('loyalty', 'cancel'),
                dangerouslyUseHTMLString: true,
                confirmButtonClass: 'new_confirm_confirm',
                cancelButtonClass: 'new_confirm_cancel'
              }).then(() => {
                this.saveLoading = true
                //
                let value = Object.assign({}, this.form, { point_rule_name: 'Basic Point Rule', point_monetary_value: this.point_monetary_value })
                if (value.expired_type === 3) {
                  value = Object.assign({}, value, { relative_value: null, relative_unit: null, fixed_after_year: null, fixed_specific_date: null, fixed_specific_month: null })
                } else if (value.expired_type === 2) {
                  value = Object.assign({}, value, { fixed_after_year: null, fixed_specific_date: null, fixed_specific_month: null })
                } else if (value.expired_type === 1) {
                  value = Object.assign({}, value, { relative_value: null, relative_unit: null })
                }
                if (this.form.id > 0) {
                  this.update(value)
                } else {
                  this.add(value)
                }
              }).catch(() => {
              })
            }
          })
        } else {
          this.$alert(this.handleGlobalI18n('loyalty', 'confirm6'), this.handleGlobalI18n('loyalty', 'attention'), {
            confirmButtonText: this.handleGlobalI18n('loyalty', 'confirm')
          })
        }
      },
      add(val) {
        addPointRule(val).then(() => {
          this.saveLoading = false
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.$emit('getFormId', false)
          this.modify_state = true
        }).catch(() => {
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
        })
      },
      update(val) {
        updatePointRule(val).then(() => {
          this.saveLoading = false
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.queryPointRule()
        }).catch(() => {
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
        })
      }
    },
    watch: {
      relative_value() {
        if (this.relative_value === '' || this.relative_value === undefined || this.relative_value <= 0) {
          this.$nextTick(() => {
            this.relative_value = 1
            this.form.relative_value = this.relative_value
          })
          return true
        }
        this.form.relative_value = this.relative_value
      },
      fixed_after_year() {
        if (this.fixed_after_year === '' || this.fixed_after_year === undefined || this.fixed_after_year < 0) {
          this.$nextTick(() => {
            this.fixed_after_year = 0
            this.form.fixed_after_year = this.fixed_after_year
          })
          return true
        }
        this.form.fixed_after_year = this.fixed_after_year
      },
      fixed_specific_month() {
        if (this.fixed_specific_month === '' || this.fixed_specific_month === undefined || this.fixed_specific_month < 0) {
          this.$nextTick(() => {
            this.fixed_specific_month = 0
            this.form.fixed_specific_month = this.fixed_specific_month
          })
          return true
        }
        this.form.fixed_specific_month = this.fixed_specific_month
      },
      'form.fixed_specific_date': {
        handler(val) {
          if (val === '' || val === undefined || val < 0) {
            this.$nextTick(() => {
              if (this.fixed_after_year <= 0 && this.fixed_specific_month <= 0) {
                this.form.fixed_specific_date = 1
              } else {
                this.form.fixed_specific_date = 0
              }
            })
          }
        }
      },
      'form.point_ratio': {
        handler(val) {
          if (val === '' || val === undefined || val <= 0) {
            this.$nextTick(() => {
              this.form.point_ratio = 1
            })
            return true
          }
          if (this.old_point_ratio !== this.form.point_ratio && !this.modify_state) {
            this.changePointRatio()
          }
        }
      },
      // unit() {
      //   if (this.old_unit !== this.unit && this.unit !== '') {
      //     this.changePointMonetaryValue()
      //   }
      // },
      'point_monetary_value': {
        handler(val) {
          if (val === '' || val === undefined || val <= 0) {
            this.$nextTick(() => {
              this.point_monetary_value = 1
            })
            return true
          }
          this.form.point_monetary_value = val
          if (this.old_point_monetary_value !== val && !this.modify_state) {
            this.changePointMonetaryValue()
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .basic-point {
    .click-button {
      padding:5px;
      width: 100%;
      background-color: #ffffff;
      .add {
        margin-left: 20px;
      }
    }
    .click-button {
      padding:5px;
      width: 100%;
      background-color: #ffffff;
      .save {
        margin-left: 20px;
      }
    }
    .el-input,.el-select,.el-input-number{
      width:300px;
    }
    .contain {
      background-color: #ffffff;
      position: relative;
      .label{
        position: relative;
        left:-10px;
        color:red;
      }
    }
    p {
      line-height: 4;
    }
    .p{
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
  }
</style>
