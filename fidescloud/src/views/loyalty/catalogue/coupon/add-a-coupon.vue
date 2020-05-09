<template>
  <div class="catalogue-add-a-coupon new-theme-css" v-loading="detail_loading">
    <div class="click-button">
      <!---->
      <el-button class="able" v-if="showAbleState()" :loading="activate_loading" icon="el-icon-sort" @click="handleActivate">{{handleAbleValue()}}</el-button>
      <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
      <el-button type="primary" :loading="save_loading" class="save" @click="submitForm('addEvent')">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
    </div>
    <!--info-->
    <div class="contain">
      <ed-header-title :title="handleHeaderTitle()" />
      <el-form ref="coupon" label-position="left" :model="form" :rules="rules"  label-width="300px">
        <div class="content">
          <div class="info">
            <!--select a coupon-->
            <el-form-item :label="$t('loyalty.fc_add_a_coupon_select_coupon_label')" v-if="query.type === 'add'" prop="coupon_code">
              <el-button class="select-a-coupon" type="primary" @click="dialog_show = !dialog_show">{{$t('loyalty.fc_add_a_coupon_select_coupon_btn_label')}}</el-button>
            </el-form-item>
            <!--Coupon details-->
            <el-form-item :label="$t('loyalty.fc_add_a_coupon_details_section_label')" class="coupon_details">
              <ul>
                <!--Coupon code-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_coupon_details_code_label')}}</span>
                    <label>{{table_coupon_data.coupon_code || table_placeholder}}</label>
                  </li>
                <!--Coupon name-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_coupon_details_name_label')}}</span>
                    <label>{{table_coupon_data.coupon_name || table_placeholder}}</label>
                  </li>
                <!--Channel-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_coupon_details_channel_label')}}</span>
                    <label>{{table_coupon_data.channel_name || table_placeholder}}</label>
                  </li>
                <!--Coupon type-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_coupon_details_type_label')}}</span>
                    <label>{{table_coupon_data.coupon_type_name || table_placeholder}}</label>
                  </li>
                <!--Cash amount-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_coupon_details_amount_label')}}</span>
                    <label>{{table_coupon_data.coupon_type_code === 'discount' ? (table_coupon_data.amount ? (table_coupon_data.amount*100).toFixed(2) + '%' : table_placeholder) : (table_coupon_data.amount ? table_coupon_data.amount + ' ' + unit : table_placeholder) }}</label>
                  </li>
                <!--Condition-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_coupon_details_condition_label')}}</span>
                    <label>
                      <template v-if="table_coupon_data.min_purchased_amount">
                        Minimum purchase of {{table_coupon_data.min_purchased_amount ? table_coupon_data.min_purchased_amount + ' ' + unit : table_placeholder }}
                      </template>
                      <template v-else>
                        {{table_placeholder}}
                      </template>
                   </label>
                  </li>
                <!--Validity period-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_coupon_details_period_label')}}</span>
                    <label>
                      <template v-if="table_coupon_data.effective_type === 1">
                        {{table_coupon_data.relative_value}} days after received
                      </template>
                      <template v-else-if="table_coupon_data.effective_type === 2 && table_coupon_data.specific_effective_date_from && table_coupon_data.specific_effective_date_to">
                        {{table_coupon_data.specific_effective_date_from ? table_coupon_data.specific_effective_date_from.substr(0, 19) : '-'}} To {{table_coupon_data.specific_effective_date_to ? table_coupon_data.specific_effective_date_to.substr(0, 19) : '-'}}
                      </template>
                      <template v-else>
                        {{table_placeholder}}
                      </template>
                    </label>
                  </li>
              </ul>
            </el-form-item>
            <!-- Redemption points-->
            <el-form-item :label="$t('loyalty.fc_add_a_coupon_details_redemption_points_label')" prop="redeem_point">
              <el-input-number v-model="form.redeem_point" :min="1" :precision="0" :max="999999999" />
            </el-form-item>
            <!-- Limited times-->
            <el-form-item :label="$t('loyalty.fc_add_a_coupon_details_limited_times_label')" prop="limited_times" ref="limited_times">
              <el-input-number v-model="form.limited_times" :min="1" :precision="0" :disabled="form.is_limited_redeem_times" :max="999999999" />
              <el-checkbox v-model="form.is_limited_redeem_times" class="margin-left-20">{{$t('loyalty.fc_add_a_coupon_details_limited_times_nolimit_label')}}</el-checkbox>
            </el-form-item>
            <!-- Applicable tiers-->
            <el-form-item :label="$t('loyalty.fc_add_a_coupon_details_tiers_label')" prop="limited_tier_list" ref="limited_tier_list">
              <el-select v-model="form.limited_tier_list" multiple :disabled="is_limited_tier_list" :loading="tier_list_status">
                <el-option v-for="item in tier_list" class="new-select-option" :key="item.member_tier_code" :label="item.member_tier_name" :value="item.member_tier_code" />
              </el-select>
              <el-checkbox v-model="is_limited_tier_list" class="margin-left-20">{{$t('loyalty.fc_add_a_coupon_details_tiers_nolimit_label')}}</el-checkbox>
            </el-form-item>
            <!--Start time of redemption-->
            <el-form-item :label="$t('loyalty.fc_add_a_coupon_details_start_time_label')" prop="redemption_start_date">
              <el-radio-group v-model="select_start_time">
                <el-radio :label="1" class="min-width-330">{{$t('loyalty.fc_add_a_coupon_details_start_time_option1_label')}}</el-radio>
                <el-radio :label="2">{{$t('loyalty.fc_add_a_coupon_details_start_time_option2_label')}}</el-radio>
              </el-radio-group>
              <el-date-picker :class="{'error': error}" v-if="select_start_time === 2" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions0" :format = '`${globalData.value.date_format} HH:mm:ss`'  style="width: 200px; margin-left: 58px;" popper-class="new_data_table" v-model="form.redemption_start_date" type="datetime"></el-date-picker>
            </el-form-item>
            <!--End time of redemption-->
            <el-form-item :label="$t('loyalty.fc_add_a_coupon_details_end_time_label')" prop="redemption_end_date">
              <el-radio-group v-model="select_end_time">
                <el-radio :label="1" class="min-width-330">{{$t('loyalty.fc_add_a_coupon_details_end_time_option1_label')}}</el-radio>
                <el-radio :label="2">{{$t('loyalty.fc_add_a_coupon_details_end_time_option2_label')}}</el-radio>
              </el-radio-group>
              <el-date-picker v-if="select_end_time === 2" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions0" :format = '`${globalData.value.date_format} HH:mm:ss`' style="width: 200px; margin-left: 58px;" popper-class="new_data_table" v-model="form.redemption_end_date" type="datetime"></el-date-picker>
            </el-form-item>
            <!--Coupon T&C-->
            <el-form-item :label="$t('loyalty.fc_add_a_coupon_details_tc_label')" class="coupon_details">
              <label class="white-space" style="padding-right: 16em; line-height: 1">{{table_coupon_data.terms || table_placeholder}}</label>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <select-coupon :dialog_show="dialog_show" :radio_row="radio_row" @handleDialogVisible="handleDialogVisible" @selectGiftDialog="selectGiftDialog"  />
  </div>
</template>

<script>
  import { addRedeemCatalogRelCoupon, editRedeemCatalogRelCoupon, disableRedemptionCoupon } from '@/api/catalogue'
  import SelectCoupon from './select-coupon'
  import { getTierListMixin } from '../../../data/tier-list'
  import { getRightNow, getTimeZone } from '@/utils'
  import { redemption_state_mixin } from '../data'
  import { handleOssFileHtmlStr } from '@/views/data/oss-file-html-str'
  export default {
    mixins: [
      getTierListMixin,
      redemption_state_mixin,
      handleOssFileHtmlStr
    ],
    components: {
      SelectCoupon
    },
    watch: {
      'form.limited_tier_list': {
        handler() {
          console.log(this.form.limited_tier_list)
        }
      }
    },
    data() {
      return {
        error: false,
        activate_loading: false,
        is_limited_tier_list: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        select_start_time: 1,
        select_end_time: 1,
        table_coupon_data: {},
        radio_row: '',
        value1: '',
        detail_coupon_category_name: '',
        detail_loading: false,
        save_loading: false,
        dialog_show: false,
        unit: this.globalData.value.currency,
        rules: {
          coupon_code: [{ required: true, message: ' ', trigger: ['blur'] }],
          redeem_point: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          limited_times: [{ required: true, message: ' ', trigger: ['blur', 'change'], validator: this.checkLimitedTimes }],
          limited_tier_list: [{ required: true, message: ' ', trigger: ['blur', 'change'], validator: this.checkLimitedTierList }],
          redemption_start_date: [{ validator: this.handleRedemptionStartDate, trigger: ['change', 'blur'] }],
          redemption_end_date: [{ validator: this.handleRedemptionEndDate, trigger: ['change', 'blur'] }]
        },
        form: {
          coupon_code: null,
          coupon_id: null,
          redeem_point: 1,
          is_limited_redeem_times: false,
          limited_times: 1,
          limited_tier_list: [],
          redemption_start_date: '',
          redemption_end_date: '',
          redemption_event_id: null
        },
        query: {},
        category_list: [],
        coupon_state: '',
        redemption_state: ''
      }
    },
    created() {
      //
      this.query = this.$route.query
      if (this.query.type === 'config') {
        this.table_coupon_data = JSON.parse(sessionStorage.getItem('redemption_info'))
        this.coupon_state = this.handleCouponStatus(this.table_coupon_data.coupon_status, this.table_coupon_data.effective_type, this.table_coupon_data.specific_effective_date_to)
        this.redemption_state = this.handleRedemptionStatus(this.table_coupon_data.redemption_status, this.table_coupon_data.specific_effective_date_from)
        this.is_limited_tier_list = this.table_coupon_data.limited_tier_list === null
        this.select_start_time = 2
        this.radio_row = this.table_coupon_data.coupon_code
        this.select_end_time = this.table_coupon_data.redemption_end_date === null ? 1 : 2
        this.form = {
          coupon_code: this.table_coupon_data.coupon_code,
          coupon_id: this.table_coupon_data.coupon_id,
          redeem_point: this.table_coupon_data.redeem_point,
          is_limited_redeem_times: this.table_coupon_data.is_limited_redeem_times === 0,
          limited_times: this.table_coupon_data.is_limited_redeem_times === 0 ? null : this.table_coupon_data.limited_times,
          limited_tier_list: this.table_coupon_data.limited_tier_list ? this.table_coupon_data.limited_tier_list.split(',') : null,
          redemption_start_date: this.table_coupon_data.redemption_start_date ? `${this.table_coupon_data.redemption_start_date.substring(0, 10)} ${this.table_coupon_data.redemption_start_date.substring(11, 19)}` : null,
          redemption_end_date: this.table_coupon_data.redemption_end_date ? `${this.table_coupon_data.redemption_end_date.substring(0, 10)} ${this.table_coupon_data.redemption_end_date.substring(11, 19)}` : null,
          redemption_event_id: null
        }
        // 查询terms
        if (this.table_coupon_data.terms) {
          this.handleHtml2str(this.table_coupon_data.terms).then(res => {
            this.table_coupon_data.terms = res.replace(/<br\/>/g, '\r\n')
          })
        }
      }
    },
    methods: {
      checkLimitedTimes(rule, value, callback) {
        if (this.form.is_limited_redeem_times) {
          callback()
          return true
        }
        if ((this.form.limited_times) === '' || this.form.limited_times === undefined) {
          callback(new Error(' '))
          return true
        }
        callback()
      },
      checkLimitedTierList(rule, value, callback) {
        if (this.is_limited_tier_list) {
          callback()
          return true
        }
        if (this.form.limited_tier_list.length <= 0) {
          callback(new Error(' '))
          return true
        }
        callback()
      },
      handleActivate() {
        var content = ''
        if (this.redemption_state === 'Active' && this.coupon_state === 'Available') {
          content = this.$t('loyalty.fc_redemption_disable_coupon_content_label')
        } else if (this.redemption_state === 'Inactive' && this.coupon_state === 'Available') {
          content = this.$t('loyalty.fc_redemption_update_coupon_content_label')
        } else {
          content = this.$t('loyalty.fc_coupon_enable_forbidden_content_label')
        }
        if ((this.redemption_state === 'Active' && this.coupon_state === 'Available') || (this.redemption_state === 'Inactive' && this.coupon_state === 'Available')) {
          this.$confirm(content, this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
            cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
            confirmButtonClass: 'new_confirm_confirm',
            cancelButtonClass: 'new_confirm_cancel'
          }).then(() => {
            // success
            this.handleDisableRedemptionCoupon()
          }).catch(() => {
            // cancel
          })
        } else {
          this.$alert(content, 'Alert', {
            confirmButtonText: 'Confirm',
            dangerouslyUseHTMLString: true,
            customClass: 'new-dialog-center',
            callback: action => {
            }
          })
        }
      },
      handleDisableRedemptionCoupon() {
        var obj = {
          redemption_ref_coupon_id: parseInt(this.table_coupon_data.id),
          type: 0
        }
        if (this.redemption_state === 'Active') {
          obj.type = 0
        } else if (this.redemption_state === 'Inactive') {
          obj.type = 1
          // Start time 如果选择Specific time，则该时间必须大于Enable按钮点击时的当前时间；
          if (this.select_start_time === 2) {
            var right_now = getRightNow()
            var postfix = getTimeZone()
            var now_date_time = `${right_now.year}-${right_now.month}-${right_now.day}T${right_now.hour}:${right_now.minute}:${right_now.second}.${right_now.mill}${postfix}`
            var start_time = new Date(this.form.redemption_start_date).getTime()
            var end_time = new Date(now_date_time).getTime()
            if (end_time > start_time) {
              this.error = true
              this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
              return false
            } else {
              this.error = false
            }
          }
        }
        this.activate_loading = true
        this.$refs['coupon'].validate(valid => {
          if (valid) {
            disableRedemptionCoupon(obj).then(res => {
              // if (obj.type === 0) {
              //   this.redemption_state = 'Inactive'
              //   this.table_coupon_data.redemption_status = 0
              // } else {
              //   this.redemption_state = 'Active'
              //   this.table_coupon_data.redemption_status = 1
              // }
              // sessionStorage.setItem('redemption_info', JSON.stringify(this.table_coupon_data))
              this.$router.go(-1)
              this.$message({
                message: this.$t('configuration.fc_operation_feedback_notification_label'),
                type: 'success'
              })
              this.activate_loading = false
            }).catch(res => {
              this.activate_loading = false
              this.$message.error(res)
            })
          }
        })
      },
      showAbleState() {
        if (this.query.type !== 'config' || this.coupon_state === 'Deleted' || this.redemption_state === 'Planned') {
          return false
        }
        return true
      },
      handleAbleValue() {
        if (this.redemption_state === 'Active') {
          return this.$t('loyalty.fc_operation_btn_disable_label')
        } else if (this.redemption_state === 'Inactive') {
          return this.$t('loyalty.fc_operation_btn_enable_label')
        }
      },
      handleRedemptionStartDate(rule, value, callback) {
        if (this.select_start_time === 1) {
          callback()
          return true
        }
        if (value === '' || value === undefined) {
          callback(new Error(' '))
          return true
        }
        callback()
      },
      handleRedemptionEndDate(rule, value, callback) {
        if (this.select_end_time === 1) {
          callback()
          return true
        }
        if (value === '' || value === undefined) {
          callback(new Error(' '))
          return true
        }

        // 结束时间不能小于开始时间
        var start_time = new Date(this.form.redemption_start_date).getTime()
        var end_time = new Date(value).getTime()
        if (this.select_start_time === 1) {
          start_time = new Date().getTime()
        }
        if (end_time <= start_time) {
          callback(new Error(' '))
          return true
        }
        callback()
      },
      selectGiftDialog(row) {
        this.radio_row = row.coupon_code
        this.form.coupon_code = row.coupon_code
        this.table_coupon_data = row || {}
        // 查询terms
        if (this.table_coupon_data.terms) {
          this.handleHtml2str(this.table_coupon_data.terms).then(res => {
            this.table_coupon_data.terms = res.replace(/<br\/>/g, '\r\n')
          })
        }
      },
      handleDialogVisible(bl) {
        this.dialog_show = bl
      },
      submitForm() {
        if (!this.radio_row) {
          this.$message.error(this.$t('loyalty.fc_loyalty_catalogue_add_coupon_unselected_tips'))
          return true
        }
        this.$refs['coupon'].validate(valid => {
          if (valid) {
            this.save_loading = true
            var right_now = getRightNow()
            var postfix = getTimeZone()
            var now_date_time = `${right_now.year}-${right_now.month}-${right_now.day}T${right_now.hour}:${right_now.minute}:${right_now.second}.${right_now.mill}${postfix}`
            var form = {
              redemption_coupon_rel_id: null,
              coupon_code: this.table_coupon_data.coupon_code,
              coupon_id: null,
              redeem_point: this.form.redeem_point,
              is_limited_redeem_times: this.form.is_limited_redeem_times ? 0 : 1,
              limited_times: this.form.is_limited_redeem_times ? null : this.form.limited_times,
              limited_tier_list: this.is_limited_tier_list ? null : this.form.limited_tier_list,
              redemption_start_date: this.select_start_time === 1 ? now_date_time : `${(this.form.redemption_start_date).substring(0, 10)}T${(this.form.redemption_start_date).substring(11, 19)}.000${postfix}`,
              redemption_end_date: this.select_end_time === 1 ? null : `${(this.form.redemption_end_date).substring(0, 10)}T${(this.form.redemption_end_date).substring(11, 19)}.999${postfix}`,
              redemption_event_id: null
            }
            if (this.query.type === 'config') {
              this.editSave(form)
            } else {
              this.save(form)
            }
          } else {
            this.save_loading = false
            return false
          }
        })
      },
      // 保存coupon
      save(form) {
        this.$confirm(this.$t('loyalty.fc_redemption_add_save_coupon_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
          cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          addRedeemCatalogRelCoupon(form).then(res => {
            this.save_loading = false
            this.$router.go(-1)
            this.$message({
              message: this.$t('configuration.fc_operation_feedback_notification_label'),
              type: 'success'
            })
          }).catch(res => {
            this.save_loading = false
            this.$message.error(res)
          })
        }).catch(() => {
          // cancel
          this.save_loading = false
        })
      },
      // 编辑保存
      editSave(form) {
        if (this.coupon_state === 'Available') {
          this.$confirm(this.$t('loyalty.fc_redemption_update_coupon_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
            cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
            confirmButtonClass: 'new_confirm_confirm',
            cancelButtonClass: 'new_confirm_cancel'
          }).then(() => {
            this.edit(form)
          }).catch(() => {
            // cancel
            this.save_loading = false
          })
        } else {
          this.edit(form)
        }
      },
      edit(form) {
        form.redemption_coupon_rel_id = parseInt(this.table_coupon_data.id)
        editRedeemCatalogRelCoupon(form).then(res => {
          sessionStorage.setItem('redemption_info', JSON.stringify(form))
          this.save_loading = false
          this.$router.go(-1)
          this.$message({
            message: this.$t('configuration.fc_operation_feedback_notification_label'),
            type: 'success'
          })
        }).catch(res => {
          this.save_loading = false
          this.$router.go(-1)
          this.$message.error(res)
        })
      },
      handleHeaderTitle() {
        var type = this.query.type
        if (type === 'config') {
          return this.$t('loyalty.fc_redemption_coupon_config_title_label')
        } else if (type === 'add') {
          return this.$t('loyalty.fc_add_a_coupon_title_label')
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .catalogue-add-a-coupon {
    .error /deep/ .el-input__inner {
      border: 1px solid #F56C6C;
    }
    .white-space{
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
    }
    .min-width-330{
      min-width: 330px;
    }
    .content{
      display: flex;
    }
    .coupon_details{
      li{
        display: flex;
        height: 34px;
        align-items: center;
      }
      span{
        font-family: Helvetica-medium-1;
        display: block;
        width: 230px;
        font-size:14px;
        font-weight: 500;
        color:rgba(51,51,51,1);
      }
      label{
        font-family: HelveticaNeue1;
        display: block;
        font-size:14px;
        color:rgba(51,51,51,1);
      }
    }
    .coupon_details{
      padding: 15px 0!important;
      align-items: flex-start!important;
      height: auto!important;
    }
    .margin-left-20{
      margin-left: 20px;
    }
    .el-button{
      min-width: 88px;
    }
    .el-input-number, .el-select{
      width: 300px;
    }
    .el-form-item{
      margin: 0 0 70px 20px;
      height: 66px;
      line-height: 66px;
      margin-bottom: 0!important;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(230,230,230,1);
      }
      &:last-child{
        padding: 12px 0 12px 0;
        height: auto!important;
      }
      display: flex;
      align-items: center;
    }
    .select-a-coupon{
      width: 60px;
      border-color: $new-primary;
      background-color: $new-primary;
    }
    margin: 30px;
    .click-button {
      position: relative;
      z-index: 10;
      width: 100%;
      margin-bottom: -20px;
      text-align: right;
      .save{
        margin-left: 8px;
        background-color: $new-primary;
        border-color: $new-primary;
      }
      .cancel, .delete, .able{
        border-color: $new-primary;
        color: $new-primary;
      }
      .cancel{
        background-color: #ffffff;
      }
    }
    .contain {
      z-index: 1;
      position: relative;
      .info{
        background:rgba(255,255,255,1);
        box-shadow:0 5px 15px -3px rgba(204,204,204,1);
        width: 100%;
      }
    }
    .p{
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      margin-top: -20px;
      box-sizing: border-box;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  @import "../../new-theme-css";
  .catalogue-add-a-coupon{
    .able i{
      transform:rotate(90deg);
    }
    .el-form-item .el-form-item__label {
      font-size: 14px!important;
      font-weight: 700!important;
      color: rgba(51,51,51,1)!important;
      line-height: 17px!important;
      &:before{
        color: rgba(51,51,51,1)!important;
      }
    }
    .coupon_details .el-form-item__label {
      line-height: 36px!important;
    }
    .el-form-item__content{
      margin-left: 0!important;
      width: 100% !important
    }
  }
</style>
