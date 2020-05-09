<template>
  <div class="catalogue-add-a-gift new-theme-css" v-loading="detail_loading">
    <div class="click-button">
      <el-button class="able" v-if="showAbleState()" :loading="activate_loading"  icon="el-icon-sort" @click="handleActivate">{{handleAbleValue()}}</el-button>
      <!--Cancel-->
      <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
      <!--Save-->
      <el-button type="primary" :loading="save_loading" class="save" @click="submitForm('addEvent')">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
    </div>
    <!--info-->
    <div class="contain">
      <ed-header-title :title="handleHeaderTitle()" />
      <el-form ref="gift" label-position="left" :model="form" :rules="rules"  label-width="300px">
        <div class="content">
          <div class="info">
            <!--select a gift-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_select_gift_label')" prop="gift_code" v-if="query.type === 'add'">
              <el-button class="select-a-gift" type="primary" @click="dialog_show = !dialog_show">{{$t('loyalty.fc_add_a_gift_select_gift_btn_label')}}</el-button>
            </el-form-item>
            <!--Gift details-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_details_section_label')" class="gift_details">
              <ul>
                <!--Gift code-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_gift_details_code_label')}}</span>
                    <label>{{table_gift_data.gift_code || table_placeholder}}</label>
                  </li>
                <!--Gift name-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_gift_details_name_label')}}</span>
                    <label>{{table_gift_data.gift_name || table_placeholder}}</label>
                  </li>
                <!--Gift category-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_gift_details_category_label')}}</span>
                    <label>{{table_gift_data.gift_category_name || table_placeholder}}</label>
                  </li>
                <!--Gift unit-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_gift_details_unit_label')}}</span>
                    <label>{{table_gift_data.unit || table_placeholder}}</label>
                  </li>
                <!--Stock-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_gift_details_stock_label')}}</span>
                    <label>
                      <template v-if="!table_gift_data.is_limited_inventory">
                        {{$t('loyalty.fc_add_a_gift_details_limited_times_nolimit_label')}}
                      </template>
                      <template v-else-if="!form.is_limited_inventory">
                        {{table_gift_data.available_inventory || table_placeholder}}
                      </template>
                      <template v-else>
                        {{table_placeholder}}
                      </template>
                    </label>
                  </li>
                <!--Retail market price-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_gift_details_market_price_label')}}</span>
                    <label>{{table_gift_data.unit_price ?  table_gift_data.unit_price + ' ' + unit : table_placeholder}}</label>
                  </li>
                <!--Purchased price-->
                  <li>
                    <span>{{$t('loyalty.fc_add_a_gift_details_purchased_price_label')}}</span>
                    <label>{{table_gift_data.purchased_price ?  table_gift_data.purchased_price + ' ' + unit : table_placeholder}}</label>
                  </li>
              </ul>
            </el-form-item>
            <!--Standard point value-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_details_standard_value_label')">
              <el-radio-group v-model="standard_point_value">
                <el-radio :label="1" class="min-width-330">{{$t('loyalty.fc_add_a_gift_details_standard_value_option1_label')}}</el-radio>
                <el-radio :label="2">{{$t('loyalty.fc_add_a_gift_details_standard_value_option2_label')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- Point value-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_details_point_value_label')">
              <!--<label>{{ handlePointValue() }}</label>-->
              <label>{{ r_value }}</label>
            </el-form-item>
            <!-- Redemption points-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_details_redemption_points_label')" prop="redeem_point">
              <el-input-number v-model="form.redeem_point" :min="1" :precision="0" :max="99999999"/>
            </el-form-item>
            <!-- Limited times-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_details_limited_times_label')" prop="limited_times" ref="limited_times">
              <el-input-number v-model="form.limited_times" :min="1" :precision="0" :disabled="form.is_limited_redeem_times" :max="999999999" />
              <el-checkbox v-model="form.is_limited_redeem_times" class="margin-left-20">{{$t('loyalty.fc_add_a_gift_details_limited_times_nolimit_label')}}</el-checkbox>
            </el-form-item>
            <!-- Applicable tiers-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_details_tiers_label')" prop="limited_tier_list" ref="limited_tier_list">
              <el-select v-model="form.limited_tier_list" multiple :disabled="is_limited_tier_list" :loading = "tier_list_status">
                <el-option v-for="item in tier_list" class="new-select-option" :key="item.member_tier_code" :label="item.member_tier_name" :value="item.member_tier_code" />
              </el-select>
              <el-checkbox v-model="is_limited_tier_list" class="margin-left-20">{{$t('loyalty.fc_add_a_gift_details_tiers_nolimit_label')}}</el-checkbox>
            </el-form-item>
            <!--Start time of redemption-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_details_start_time_label')" prop="redemption_start_date">
              <el-radio-group v-model="select_start_time">
                <el-radio :label="1" class="min-width-330">{{$t('loyalty.fc_add_a_gift_details_start_time_option1_label')}}</el-radio>
                <el-radio :label="2">{{$t('loyalty.fc_add_a_gift_details_start_time_option2_label')}}</el-radio>
              </el-radio-group>
              <el-date-picker v-if="select_start_time === 2" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions0" :format = '`${globalData.value.date_format} HH:mm:ss`'  style="width: 200px; margin-left: 58px;" popper-class="new_data_table" v-model="form.redemption_start_date" type="datetime"></el-date-picker>
            </el-form-item>
            <!--End time of redemption-->
            <el-form-item :label="$t('loyalty.fc_add_a_gift_details_end_time_label')" prop="redemption_end_date">
              <el-radio-group v-model="select_end_time">
                <el-radio :label="1" class="min-width-330">{{$t('loyalty.fc_add_a_gift_details_end_time_option1_label')}}</el-radio>
                <el-radio :label="2">{{$t('loyalty.fc_add_a_gift_details_end_time_option2_label')}}</el-radio>
              </el-radio-group>
              <el-date-picker v-if="select_end_time === 2" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions0" :format = '`${globalData.value.date_format} HH:mm:ss`' style="width: 200px; margin-left: 58px;" popper-class="new_data_table" v-model="form.redemption_end_date" type="datetime"></el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <select-a-gift :dialog_show="dialog_show" :radio_row="radio_row" @handleDialogVisible="handleDialogVisible" @selectGiftDialog="selectGiftDialog" />
  </div>
</template>

<script>
  import { addRelRedeemCatalogGift, editRedeemCatalogRelGift, disableRedemptionGift } from '@/api/catalogue'
  import SelectAGift from './select-a-gift'
  import { getTierListMixin } from '../../../data/tier-list'
  import { getRightNow, getTimeZone } from '@/utils'
  import { getPointRuleMixin } from '../../../data/point-rule'
  import { redemption_state_mixin } from '../data'
  export default {
    mixins: [
      redemption_state_mixin,
      getTierListMixin,
      getPointRuleMixin
    ],
    components: {
      SelectAGift
    },
    watch: {
      radio_row() {
        this.handlePointValue()
      },
      standard_point_value() {
        this.handlePointValue()
      }
    },
    data() {
      return {
        activate_loading: false,
        standard_point_value: 1,
        unit: this.globalData.value.currency,
        is_limited_tier_list: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        select_start_time: 1,
        select_end_time: 1,
        radio_row: '',
        value1: '',
        detail_gift_category_name: '',
        detail_loading: false,
        save_loading: false,
        dialog_show: false,
        rules: {
          gift_code: [{ required: true, message: ' ', trigger: ['blur'] }],
          redeem_point: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          limited_times: [{ required: true, message: ' ', trigger: ['blur', 'change'], validator: this.checkLimitedTimes }],
          limited_tier_list: [{ required: true, message: ' ', trigger: ['blur', 'change'], validator: this.checkLimitedTierList }],
          redemption_start_date: [{ validator: this.handleRedemptionStartDate, trigger: ['change', 'blur'] }],
          redemption_end_date: [{ validator: this.handleRedemptionEndDate, trigger: ['change', 'blur'] }]
        },
        form: {
          gift_code: null,
          gift_id: null,
          redeem_point: 1,
          is_limited_redeem_times: false,
          limited_times: 1,
          limited_tier_list: [],
          redemption_start_date: '',
          redemption_end_date: '',
          redemption_event_id: null
        },
        query: {},
        table_gift_data: {},
        gift_state: '',
        redemption_state: '',
        r_value: 0
      }
    },
    created() {
      //
      this.query = this.$route.query
      if (this.query.type === 'config') {
        this.table_gift_data = JSON.parse(sessionStorage.getItem('redemption_info'))
        this.table_gift_data.available_inventory = this.table_gift_data.stock
        this.table_gift_data.unit = this.table_gift_data.gift_unit
        this.gift_state = this.handleGiftStatus(this.table_gift_data.gift_status, this.table_gift_data.stock, !this.table_gift_data.is_limited_inventory)
        this.redemption_state = this.handleRedemptionStatus(this.table_gift_data.redemption_status, this.table_gift_data.redemption_start_date)
        this.is_limited_tier_list = this.table_gift_data.limited_tier_list === null
        this.select_start_time = 2
        this.radio_row = this.table_gift_data.gift_code
        this.select_end_time = this.table_gift_data.redemption_end_date === null ? 1 : 2
        this.form = {
          gift_code: this.table_gift_data.gift_code,
          gift_id: this.table_gift_data.gift_id,
          redeem_point: this.table_gift_data.redeem_point,
          is_limited_redeem_times: this.table_gift_data.is_limited_redeem_times === 0,
          limited_times: this.table_gift_data.is_limited_redeem_times === 0 ? null : this.table_gift_data.limited_times,
          limited_tier_list: this.table_gift_data.limited_tier_list ? this.table_gift_data.limited_tier_list.split(',') : null,
          redemption_start_date: this.table_gift_data.redemption_start_date ? `${this.table_gift_data.redemption_start_date.substring(0, 10)} ${this.table_gift_data.redemption_start_date.substring(11, 19)}` : null,
          redemption_end_date: this.table_gift_data.redemption_end_date ? `${this.table_gift_data.redemption_end_date.substring(0, 10)} ${this.table_gift_data.redemption_end_date.substring(11, 19)}` : null,
          redemption_event_id: null
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
        if (this.redemption_state === 'Active' && this.gift_state === 'Available') {
          content = this.$t('loyalty.fc_redemption_gift_edit_disable_content_label')
        } else if (this.redemption_state === 'Inactive' && this.gift_state === 'Available') {
          content = this.$t('loyalty.fc_redemption_gift_edit_enable_content_label')
        } else {
          content = this.$t('loyalty.fc_gift_enable_forbidden_content_label')
        }
        if ((this.redemption_state === 'Active' && this.gift_state === 'Available') || (this.redemption_state === 'Inactive' && this.gift_state === 'Available')) {
          this.$confirm(this.$t(`loyalty.${content}`), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
            cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
            confirmButtonClass: 'new_confirm_confirm',
            cancelButtonClass: 'new_confirm_cancel'
          }).then(() => {
            // success
            this.handleDisableRedemptionGift()
          }).catch(() => {
            // cancel
          })
        } else {
          this.$alert(content, 'Alert', {
            confirmButtonText: 'OK',
            dangerouslyUseHTMLString: true,
            customClass: 'new-dialog-center',
            callback: action => {
            }
          })
        }
      },
      handleDisableRedemptionGift() {
        var obj = {
          redemption_ref_gift_id: parseInt(this.table_gift_data.id),
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
              this.$message.error(this.$t('member.fc_member_lifecycle_vaule_incorrect_tips'))
              return false
            }
          }
        }
        this.activate_loading = true
        this.$refs['gift'].validate(valid => {
          if (valid) {
            disableRedemptionGift(obj).then(res => {
              // if (obj.type === 0) {
              //   this.redemption_state = 'Inactive'
              //   this.table_gift_data.redemption_status = 0
              // } else {
              //   this.redemption_state = 'Active'
              //   this.table_gift_data.redemption_status = 1
              // }
              // sessionStorage.setItem('redemption_info', JSON.stringify(this.table_gift_data))
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
        if (this.query.type !== 'config' || this.gift_state === 'Deleted' || this.redemption_state === 'Planned') {
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
      handlePointValue() {
        var value = 0
        if (this.point_rule_obj.point_ratio && this.radio_row) {
          if (this.standard_point_value === 1) {
            value = Math.round(this.table_gift_data.unit_price * this.point_rule_obj.point_ratio)
          } else if (this.standard_point_value === 2) {
            value = Math.round(this.table_gift_data.purchased_price * this.point_rule_obj.point_ratio)
          }
        }
        this.r_value = value
        if (this.query.type !== 'config' && value > 0) {
          this.form.redeem_point = this.r_value
        }
      },
      handleRedemptionStartDate(rule, value, callback) {
        if (this.select_start_time === 1) {
          callback()
          return true
        }
        if (this.select_start_time === 2) {
          if (value === '' || value === undefined || value === null) {
            callback(new Error(' '))
            return true
          }
          callback()
        }
      },
      handleRedemptionEndDate(rule, value, callback) {
        if (this.select_end_time === 1) {
          callback()
          return true
        }
        if (this.select_end_time === 2) {
          if (value === '' || value === undefined || value === null) {
            callback(new Error(' '))
            return true
          }
          // 结束时间不能小于开始时间
          var start_time = new Date(this.form.redemption_start_date).getTime()
          var end_time = new Date(value).getTime()
          if (this.select_start_time === 1) {
            start_time = new Date().getTime()
          }
          if (this.select_start_time === 2 && this.select_end_time === 2 && end_time <= start_time) {
            callback(new Error(' '))
            return true
          }
          callback()
        }
      },
      selectGiftDialog(row) {
        this.radio_row = row.gift_code
        this.form.gift_code = row.gift_code
        this.table_gift_data = row || {}
      },
      submitForm() {
        if (!this.radio_row) {
          this.$message.error(this.$t('loyalty.fc_loyalty_catalogue_add_gift_unselected_tips'))
          return true
        }
        this.$refs['gift'].validate(valid => {
          if (valid) {
            this.save_loading = true
            var right_now = getRightNow()
            var postfix = getTimeZone()
            var now_date_time = `${right_now.year}-${right_now.month}-${right_now.day}T${right_now.hour}:${right_now.minute}:${right_now.second}.${right_now.mill}${postfix}`
            var form = {
              redemption_event_id: null,
              gift_code: this.table_gift_data.gift_code,
              redeem_point: this.form.redeem_point,
              is_limited_redeem_times: this.form.is_limited_redeem_times ? 0 : 1,
              limited_times: this.form.is_limited_redeem_times ? null : this.form.limited_times,
              limited_tier_list: this.is_limited_tier_list ? null : this.form.limited_tier_list,
              redemption_start_date: this.select_start_time === 1 ? now_date_time : `${this.form.redemption_start_date && (this.form.redemption_start_date).substring(0, 10)}T${this.form.redemption_start_date && (this.form.redemption_start_date).substring(11, 20)}.000${postfix}`,
              redemption_end_date: this.select_end_time === 1 ? null : `${this.form.redemption_end_date && (this.form.redemption_end_date).substring(0, 10)}T${this.form.redemption_end_date && (this.form.redemption_end_date).substring(11, 20)}.999${postfix}`,
              gift_id: null
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
      // 保存
      save(form) {
        this.$confirm(this.$t('loyalty.fc_redemption_add_save_gift_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
          cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          // success22
          addRelRedeemCatalogGift(form).then(res => {
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
        if (this.gift_state === 'Available') {
          this.$confirm(this.$t('loyalty.fc_redemption_update_gift_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
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
        form.redemption_gift_rel_id = this.table_gift_data.id
        editRedeemCatalogRelGift(form).then(res => {
          // sessionStorage.setItem('redemption_info', JSON.stringify(form))
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
      },
      handleDialogVisible(bl) {
        this.dialog_show = bl
      },
      handleHeaderTitle() {
        var type = this.query.type
        if (type === 'config') {
          return this.$t('loyalty.fc_redemption_gift_config_title_label')
        } else if (type === 'add') {
          return this.$t('loyalty.fc_add_a_gift_title_label')
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .catalogue-add-a-gift {
    .min-width-330{
      min-width: 330px;
    }
    .content{
      display: flex;
    }
    .gift_details{
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
    .gift_details{
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
    .el-input,.el-input-number, .el-select{
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
    .select-a-gift{
      width: 60px;
      border-color: $new-primary;
      background-color: $new-primary;
    }
    margin: 30px;
    .click-button {
      position: relative;
      z-index: 10;
      width: 100%;
      text-align: right;
      margin-bottom: -20px;
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
  .catalogue-add-a-gift{
    .able i{
      transform:rotate(90deg);
    }
    .gift_details .el-form-item__label {
      line-height: 36px!important;
    }
    .el-form-item .el-form-item__label {
      font-size: 14px!important;
      font-weight: 700!important;
      color: rgba(51,51,51,1)!important;
      line-height: 17px;
      &:before{
        color: rgba(51,51,51,1)!important;
      }
    }
    .el-form-item__content{
      margin-left: 0!important;
      width: 100% !important
    }
  }
</style>
