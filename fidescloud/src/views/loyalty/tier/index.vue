<template>
  <div class="loyalty-tier tier" id="loyalty-tier" v-loading="loading">
    <operate-button>
      <!--Save-->
      <el-button :loading="saveLoading" @click="save(0)" style="min-width: 80px;" type="primary" v-if="old_list_length <= 0">{{handleGlobalI18n('loyalty', 'save')}}</el-button>
      <!--Edit-->
      <el-button :loading="saveLoading" @click="modify" style="min-width: 80px;" type="primary" v-else>{{$t('loyalty.fc_operation_btn_edit_label')}}</el-button>
      <!--Activate-->
      <el-button @click="handleActivate" style="min-width: 80px;" type="primary" v-if="!is_active">{{handleGlobalI18n('loyalty', 'activate')}}</el-button>
      <!--Active-->
      <el-button style="min-width: 80px ;" type="danger" v-else >{{handleGlobalI18n('loyalty', 'active')}}</el-button>
    </operate-button>
    <div class="tier-list" ref="tier-list">
      <el-scrollbar style="height:100%; width: 100%;">
        <el-form label-position="left" ref="form" :model="tiers">
            <ul class="list-ul">
              <li class="list-li" v-for="(item, index) in tiers.data" :key="index">
                <div class="tier-detail">
                  <div class="bg-000" v-if="item.local_state === 3"></div>
                  <!--Tier name---------------------------------------------------------------->
                  <section class="tier-name">
                    <el-form-item :prop="'data.' + index + '.member_tier_name'" :rules="checkMemberTierName(index)">
                      <el-input  :class="{'bg-color-primary-tier' : (item.local_state === 3 || item.local_state === 2)}" :disabled="old_list_length > 0" :placeholder="handleGlobalI18n('loyalty', 'tier_name')" maxAPACITFCRO-180length="32" minlength="1" ref="aaa" type="text" v-model="item.member_tier_name" />
                    </el-form-item>
                    <i :class="{'pointer-events not-allowed ': old_list_length > 0}" @click="deleteItem(index)" class="el-icon-delete" />
                  </section>
                  <div style="position: relative;">
                    <div class="bg-000" v-if="item.local_state === 2"></div>
                    <section class="tier-generosity">
                      <!--Generosity-->
                      <p class="title">{{$t('loyalty.fc_loyalty_tier_generosity_section_label')}}</p>
                      <div class="base-generosity">
                        <!--Base generosity-->
                        <p class="base-generosity-title">{{$t('loyalty.fc_loyalty_tier_generosity_base_label')}}</p>
                        <p class="basic-point-rule">
                          <!--Spend 1 RMB get 10 points-->
                          <el-form-item :label="$t('loyalty.fc_loyalty_tier_generosity_base_spend_label')" label-width="90px">
                            <el-select class="width-85" disabled v-model="globalData.value.currency">
                              <el-option :label="globalData.value.currency" :value="globalData.value.currency" />
                            </el-select>
                            <label  style="padding: 0 11px;">{{$t('loyalty.fc_loyalty_tier_generosity_base_get_label')}}</label>
                            <el-input :value="point_monetary_value" class="width-150" disabled />
                            <label  style="padding-left: 11px;">{{$t('loyalty.fc_loyalty_tier_generosity_base_points_label')}}</label>
                          </el-form-item>
                        </p>
                        <div class="dash"></div>
                        <div class="tier-bonus-title">
                          <div class="select">
                            <!--Tier bonus generosity-->
                            <p>{{$t('loyalty.fc_loyalty_tier_generosity_bonus_label')}}</p>
                            <el-switch
                              v-model="tier_bonus_generosity[index]"
                              :active-text="$t('loyalty.fc_operation_btn_on_label')"
                              :inactive-text="$t('loyalty.fc_operation_btn_off_label')">
                            </el-switch>
                          </div>
                          <div class="on-tier-bonus" :class="{'z-index-1': !tier_bonus_generosity[index]}">
                            <!--Spend 1 RMB get 20 points-->
                            <el-form-item :label="$t('loyalty.fc_loyalty_tier_generosity_bonus_spend_label')" label-width="90px">
                              <el-select class="width-85" disabled v-model="globalData.value.currency">
                                <el-option :label="globalData.value.currency" :value="globalData.value.currency" />
                              </el-select>
                              <label style="padding: 0 11px;">{{$t('loyalty.fc_loyalty_tier_generosity_bonus_get_label')}}</label>
                              <el-input-number :max="99999999" :min="0" :precision="2" :step="1" class="width-150" style="margin: 0 10px;" type="text" v-model="item.multiple_point_ratio" />
                              <label style="padding-left: 11px;">{{$t('loyalty.fc_loyalty_tier_generosity_bonus_points_label')}}</label>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </section>
                    <!--tier upgrade rule-->
                    <section class="tier-upgrade-rule">
                      <p class="title">{{$t('loyalty.fc_loyalty_tier_upgrade_section_label')}}</p>
                      <div class="eligibility-rule">
                        <p>{{$t('loyalty.fc_loyalty_tier_upgrade_eligibility_label')}}</p>
                        <div class="ul dis-flex">
                          <div class="li" :class="{'pointer-events not-allowed ': (index !== 0 || tiers.data.length > 1 || old_list_length > 0), 'check': item_b.id === upgrade_rule}" v-for="(item_b, index1) in eligibility_data"  :key ="index1" @click="upgrade_rule = item_b.id">
                            <svg-icon :icon-class="upgrade_rule === item_b.id ? 'radio-select' : 'radio'" />
                            <label>{{$t(`loyalty.${item_b.label}`)}}</label>
                          </div>
                        </div>
                        <div class="margin-20 by-payment">
                          <el-form-item :label="$t('loyalty.fc_loyalty_tier_upgrade_eligibility_from_label')" label-width="90px"
                              :prop="'data.' + index + '.upgrade_value_from'"
                              :rules="checkFormIndex(index)"
                          >
                              <el-input-number :max="99999999" :min="0" :precision="0" :step="1" class="width-150" disabled v-if="index ===0" v-model="item.upgrade_value_from" />
                              <el-input-number :disabled="old_list_length > 0" :max="99999999" :min="0" :precision="0" :step="1" class="width-150" v-else v-model="item.upgrade_value_from" />
                              <el-select class="width-85" disabled v-if="upgrade_rule ===1" v-model="globalData.value.currency">
                                <el-option :label="globalData.value.currency" :value="globalData.value.currency" />
                              </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('loyalty.fc_loyalty_tier_upgrade_eligibility_to_label')" label-width="90px"
                              :prop="'data.' + index + '.upgrade_value_to'"
                              :rules="checkIndex(index)">
                            <el-input class="width-150" disabled type="text" v-if="index+1 === tiers.data.length" v-model.number="item.upgrade_value_to = ''" />
                            <el-input-number :disabled="old_list_length > 0" :max="99999999" :min="item.upgrade_value_from + 1.99" :precision="2" :step="1" class="width-150" v-else v-model.number="item.upgrade_value_to" />
                            <el-select class="width-85" disabled v-if="upgrade_rule ===1" v-model="globalData.value.currency">
                              <el-option :label="globalData.value.currency" :value="globalData.value.currency" />
                            </el-select>
                            <label style="padding-left: 11px;">{{$t('loyalty.fc_loyalty_tier_upgrade_eligibility_spent_label')}}</label>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="threshold-tier">
                        <p>{{$t('loyalty.fc_loyalty_tier_upgrade_threshold_label')}}</p>
                        <el-form-item :label="$t('loyalty.fc_loyalty_tier_upgrade_threshold_at_label')" label-width="90px">
                          <template v-if="index +1 === tiers.data.length">
                            <el-input-number :max="99999999" :min="0" :value="item.upgrade_value_to" class="width-150" disabled />
                          </template>
                          <template v-else>
                            <el-input-number :max="99999999" :min="1" :precision="2" :value="item.upgrade_value_to + 0.01" class="width-150" disabled />
                          </template>
                          <el-select class="width-85" disabled v-if="upgrade_rule ===1" v-model="globalData.value.currency">
                            <el-option :label="globalData.value.currency" :value="globalData.value.currency" />
                          </el-select>
                        </el-form-item>
                      </div>
                      <div class="maximum-purchase-upgrade-rule" v-if="upgrade_rule === 1">
                        <el-checkbox v-model="maximum_purchase_upgrade_rule_check[index]">{{$t('loyalty.fc_loyalty_tier_upgrade_threshold_maximum_label')}}</el-checkbox>
                        <template v-if="maximum_purchase_upgrade_rule_check[index]">
                          <p>
                            {{handleGlobalI18n('loyalty', 'maximum_purchase_upgrade_rule_1')}}{{globalData.value.currency_symbol}}
                            <el-input-number :disabled="old_list_length > 0" :max="99999999" :min="1" :precision="2" class="width-150" v-model="item.single_upgrade_purchase_amount_threshold" />
                            {{handleGlobalI18n('loyalty', 'maximum_purchase_upgrade_rule_2')}}
                          </p>
                        </template>
                      </div>
                      <div class="dash"></div>
                      <div class="XXXXX" :class="{'z-index-1': upgrade_rule !== 1}">
                        <p>
                          <label>{{$t('loyalty.fc_loyalty_tier_upgrade_accrued_label')}}</label>
                          <el-switch
                            :disabled="old_list_length > 0"
                            v-model="item.is_limit_upgrade_period"
                            :active-text="$t('loyalty.fc_operation_btn_on_label')"
                            :inactive-text="$t('loyalty.fc_operation_btn_off_label')">
                          </el-switch>
                        </p>
                        <el-form-item  :label="handleGlobalI18n('loyalty', 'tier_in_last')" label-width="90px" :class="{'z-index-1': !item.is_limit_upgrade_period}">
                          <el-input-number :disabled="old_list_length > 0" :max="99999999" :min="1" :precision="0" :step="1" class="width-150" v-model="item.limit_upgrade_period_value" />
                          <el-select :disabled="old_list_length > 0" v-model="item.limit_upgrade_period_unit" class="width-50">
                            <el-option :label="firstWordUpperCase(handleGlobalI18n('system', 'months'))" :value="parseInt(2)" />
                            <el-option :label="firstWordUpperCase(handleGlobalI18n('system', 'days'))" :value="parseInt(1)" />
                          </el-select>
                        </el-form-item>
                      </div>
                      <div class="dash" :class="{'z-index-1': upgrade_rule !== 1}"></div>
                    </section>
                    <!--tier downgrading-->
                    <section class="tier-downgrading">
                    <p class="title">{{$t('loyalty.fc_loyalty_tier_downgrade_section_label')}}</p>
                    <div class="eligibility-period">
                      <p>{{$t('loyalty.fc_loyalty_tier_downgrade_eligibility_label')}}</p>
                      <div class="ul">
                        <div class="li" :class="{'pointer-events not-allowed ': (index === 0 || old_list_length > 0 )}" v-for="(item_a, index1) in eligibility_period_data" :key="index1" @click="item.expired_type = item_a.id">
                          <svg-icon :icon-class="item.expired_type === item_a.id ? 'radio-select': 'radio'" />
                          <label v-if="index1 === 0">{{$t(`loyalty.${item_a.value}`)}}</label>
                          <label v-if="upgrade_rule !== 1 && index1 === 1">{{handleGlobalI18n('loyalty', 'tier_downgrade_rule_2')}}</label>
                          <label v-if="upgrade_rule === 1 && index1 === 1">{{$t(`loyalty.${item_a.value}`)}}</label>
                        </div>
                      </div>
                    </div>
                    <div class="downgrade-config" :class="{'z-index-1': item.expired_type !== 2}">
                      <el-input-number :disabled="old_list_length > 0" :max="99999999" :min="0"  :precision="0" :step="1" class="width-150" v-model="item.expired_relative_value" />
                      <label>{{handleGlobalI18n('loyalty', 'after_the_date_of_upgrade')}}</label>
                    </div>
                  </section>
                  </div>
                  <!--next-->
                  <section class="tier-next" >
                    <el-button  type="primary" v-if="old_list_length <= 0 && item.local_state  === 1" :disabled="old_list_length > 0"  @click.stop="addNewTierNext(index + 1)">{{handleGlobalI18n('loyalty', 'next')}}</el-button>
                    <el-button  type="primary" v-if="item.local_state  === 2 && old_list_length <= 0" :disabled="old_list_length > 0" @click.stop="tiers.data[index].local_state = 4" >{{handleGlobalI18n('loyalty', 'edit')}}</el-button>
                    <el-button  type="primary" v-if="item.local_state === 4 && old_list_length <= 0" :disabled="old_list_length > 0" @click.stop="tiers.data[index].local_state = 2" >{{handleGlobalI18n('loyalty', 'save')}}</el-button>
                    <!--<el-button  type="danger" :disabled="old_list_length > 0"  @click.stop="delItem(index)" v-if="index!=0">{{handleGlobalI18n('loyalty', 'delete')}}</el-button>-->
                  </section>
                </div>
              </li>
              <!-- click add first tier-->
              <li class="list-li" v-show="tiers.data.length === 0">
                <div class="tier-add-first tier-detail" @click.stop="addNewTier(1)">
                  <div class="middle">
                    <svg-icon icon-class="tier_add_first" />
                    <label>{{handleGlobalI18n('loyalty', 'tier_add_first_tier')}}</label>
                  </div>
                </div>
              </li>
              <!--click add tier-->
              <li class="list-li" v-show="tiers.data.length >0 && old_list_length <= 0">
                <div class="tier-add-not-first tier-detail"  @click.stop="addNewTierNext()">
                  <div class="middle">
                    <svg-icon icon-class="tier_add" />
                    <label>{{handleGlobalI18n('loyalty', 'tier_add_higher_tier')}}</label>
                  </div>
                </div>
              </li>
            </ul>
        </el-form>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
  import {
    queryMemberTierList,
    addOrUpdateMemberTier
  } from '@/api/loyalty'
  import CustomRadio from '@/components/CustomRadio/index'
  import { firstWordUpperCase } from '@/utils'
  import {
    queryPointRule
  } from '@/api/loyalty'
  import {
    parse2Date
  } from '@/utils'
  import OperateButton from '@/components/Operate-button'
  export default{
    name: 'loyalty-tier',
    components: {
      CustomRadio,
      OperateButton
    },
    data() {
      return {
        maximum_purchase_upgrade_rule_check: [],
        is_active: false,
        old_list_length: 0,
        saveLoading: false,
        upgrade_rule: 1,
        point_monetary_value: 0,
        loading: true,
        tiers: {
          data: []
        },
        tier_bonus_generosity: [false],
        tier_downgrade_rule: false, // false never
        eligibility_period_data: [{ id: 3, value: 'fc_loyalty_tier_downgrade_eligibility_option1_label' }, { id: 2, value: 'fc_loyalty_tier_downgrade_eligibility_option2_label' }],
        eligibility_data: [{ id: 1, title: 'by_payment', label: 'fc_loyalty_tier_upgrade_eligibility_payment_label' }, { id: 2, title: 'by_points', label: 'fc_loyalty_tier_upgrade_eligibility_points_label' }],
        tier_transition_data: [{ id: 0, value: 'tier_transition_1' }, { id: 1, value: 'tier_transition_2' }]
      }
    },
    created() {
      this.getPointRule()
      this.getList()
    },
    mounted() {
      this.$refs['tier-list'].style.height = `990px` // 1090
    },
    methods: {
      deleteItem(index) {
        if (index === 0) {
          return false
        } else {
          this.tiers.data.splice(index, 1)
        }
      },
      getList() {
        this.loading = true
        queryMemberTierList({ page_no: 1, page_size: 10 }).then(res => {
          this.old_list_length = res.return_result.tiers.length
          this.tiers.data = res.return_result.tiers
          this.upgrade_rule = this.tiers.data[0].upgrade_type
          for (const index in this.tiers.data) {
            const a = this.tiers.data[index]
            this.tiers.data[index].upgrade_value_to = a.upgrade_value_to ? parseInt(a.upgrade_value_to - 1) : null
            this.tiers.data[index].is_limit_upgrade_period = a.is_limit_upgrade_period === 1
            this.tier_bonus_generosity[index] = a.multiple_point_ratio > 0
            this.tiers.data[index].local_state = 3
            this.maximum_purchase_upgrade_rule_check[index] = a.single_upgrade_purchase_amount_threshold !== null
          }
          // 判断是否是激活状态
          if (this.tiers.data[0].status === 1) {
            // 已激活
            this.is_active = true
          }
          this.loading = false
          this.$nextTick(() => {
            this.updateDom()
          })
        }).catch(res => {
          this.loading = false
        })
      },
      updateDom() {
        this.$refs.aaa.map(item => {
          const d = item.$el.getElementsByTagName('input')[0]
          if (d.value.length > 0) {
            d.style.background = 'none'
            d.style.color = '#fff'
          }
        })
      },
      checkFormIndex(index) {
        if (index !== 0) {
          return [{ required: true, message: this.upgrade_rule === 1 ? this.handleGlobalI18n('validation', 'tier_upgrade_transaction_amount_null') : this.handleGlobalI18n('validation', 'tier_upgrade_point_balance_null'), trigger: 'blur' }, { validator: this.validateUpgrade, trigger: 'blur' }]
        }
      },
      checkMemberTierName(index) {
        return [{ required: true, message: ' ', trigger: 'blur' }, { validator: this._checkTierNameDuplicate, trigger: 'blur' }]
      },
      _checkTierNameDuplicate(rule, value, callback) {
        if (!this.checkTierNameDuplicate()) {
          this.$message({
            message: this.handleGlobalI18n('validation', 'tier_name_duplicated'),
            type: 'warning'
          })
          callback(new Error(' '))
        }
        callback()
      },
      checkIndex(index) {
        if (index < this.tiers.data.length - 1) {
          return [{ required: true, message: this.upgrade_rule === 1 ? this.handleGlobalI18n('validation', 'tier_upgrade_transaction_amount_null') : this.handleGlobalI18n('validation', 'tier_upgrade_point_balance_null'), trigger: 'blur' }, { validator: this.validateUpgrade, trigger: 'blur' }]
        }
      },
      validateUpgrade(rule, value, callback) {
        const str = (rule.field).split('.')
        const state = str[2] === 'upgrade_value_from' ? 1 : 2
        const index = parseInt(str[1])
        if (state === 1) {
          if (index !== 0) {
            if (parseInt(this.tiers.data[index].upgrade_value_from) !== parseInt(this.tiers.data[index - 1].upgrade_value_to + 1)) {
              // 根据升级规则满足的条件显示不同的提示内容（1 按照交易金额 2 按照累计积分）
              let error_content = ''
              if (this.upgrade_rule === 1) {
                error_content = this.handleGlobalI18n('validation', 'tier_upgrade_transaction_amount_from_error')
              } else {
                error_content = this.handleGlobalI18n('validation', 'tier_upgrade_point_balance_from_error')
              }
              this.$message.error(error_content)
              callback(new Error(' '))
            }
          }
        } else if (state === 2) {
          if (parseInt(this.tiers.data[index].upgrade_value_to) <= parseInt(this.tiers.data[index].upgrade_value_from)) {
            // 根据升级规则满足的条件显示不同的提示内容（1 按照交易金额 2 按照累计积分）
            let error_content = ''
            if (this.upgrade_rule === 1) {
              error_content = this.handleGlobalI18n('validation', 'tier_upgrade_transaction_amount_to_error')
            } else {
              error_content = this.handleGlobalI18n('validation', 'tier_upgrade_point_balance_to_error')
            }
            this.$message.error(error_content)
            callback(new Error(' '))
          }
        }
        callback()
      },
      modify() {
        this.$alert(this.$t('loyalty.fc_loyalty_tier_attention_content_label'), this.$t('loyalty.fc_loyalty_tier_attention_title'), {
          confirmButtonText: this.$t('loyalty.fc_loyalty_tier_attention_btn_confirm_label')
        })
      },
      save(status = 0) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 检测数据是否存在
            if (this.tiers.data.length <= 0) {
              return false
            }
            // 检测tier name 是否重复
            if (!this.checkTierNameDuplicate(status)) {
              this.$message({
                message: this.handleGlobalI18n('validation', 'tier_name_duplicated'),
                type: 'warning'
              })
              return false
            }
            if (status === 0) {
              this.$confirm(this.handleGlobalI18n('loyalty', 'tier_confirm3'), this.handleGlobalI18n('loyalty', 'attention'), {
                confirmButtonText: this.handleGlobalI18n('loyalty', 'confirm'),
                cancelButtonText: this.handleGlobalI18n('loyalty', 'cancel'),
                confirmButtonClass: 'new_confirm_confirm',
                cancelButtonClass: 'new_confirm_cancel'
              }).then(() => {
                this.addOrUpdate()
              }).catch(() => {
                this.saveLoading = false
              })
            } else {
              this.addOrUpdate()
            }
          }
        })
      },
      addOrUpdate() {
        this.saveLoading = true
        this.loading = true
        this.updateTierLevel()
        addOrUpdateMemberTier(this.tiers.data).then(() => {
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.saveLoading = false
          this.getList()
        }).catch(() => {
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
          this.saveLoading = false
          this.loading = false
        })
      },
      // 激活处理
      handleActivate() {
        if (this.tiers.data.length <= 0) {
          return false
        }
        // 如果在激活时，数据没有保存
        if (this.old_list_length <= 0) {
          this.$alert(this.$t('loyalty.fc_tier_no_save_active_content_label'), this.$t('loyalty.fc_loyalty_tier_attention_title'), {
            confirmButtonText: this.handleGlobalI18n('system', 'confirm')
          }).then(_ => {
            return false
          }).catch(_ => {
            return false
          })
        } else {
          // 激活确认提示框
          this.$alert(this.$t('loyalty.fc_tier_active_content_label'), this.$t('loyalty.fc_loyalty_tier_attention_title'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('loyalty.fc_loyalty_tier_attention_btn_confirm_label')
          }).then(_ => {
            this.save(1)
          }).catch(_ => {
            return false
          })
        }
      },
      isRepeat(arr) {
        var hash = {}
        for (const i in arr) {
          if (hash[arr[i]]) { return true }
          hash[arr[i]] = true
        }
        return false
      },
      checkTierNameDuplicate(status) {
        var tier_name = []
        for (const index in this.tiers.data) {
          // 顺便处理字段status
          this.tiers.data[index].status = status
          // 顺便处理 maximum purchase upgrade rule
          if (!this.maximum_purchase_upgrade_rule_check[index]) {
            this.tiers.data[index].single_upgrade_purchase_amount_threshold = null
          }
          tier_name.push(this.tiers.data[index].member_tier_name)
        }
        if (this.isRepeat(tier_name)) {
          return false
        }
        return true
      },
      updateTierLevel() {
        var i = 1
        for (const index in this.tiers.data) {
          const a = this.tiers.data[index]
          a.upgrade_value_from = parseInt(a.upgrade_value_from)
          a.upgrade_value_to = parseInt(a.upgrade_value_to) > 0 ? parseInt(a.upgrade_value_to + 1) : null
          a.upgrade_type = this.upgrade_rule
          a.is_limit_upgrade_period = a.is_limit_upgrade_period ? 1 : 0
          a.multiple_point_ratio = this.tier_bonus_generosity[index] ? a.multiple_point_ratio : 0
          a.default_tier = parseInt(index) === 0 ? 1 : 0
          if (a.active_flag !== 0) {
            a.tier_level = i
            i++
          }
        }
      },
      firstWordUpperCase,
      // 获取point rule
      getPointRule() {
        queryPointRule().then(res => {
          if (res.return_result.id === null) {
            return false
          } else {
            this.point_monetary_value = res.return_result.point_ratio
            var value = this.point_monetary_value
            if (typeof value === 'number') {
              this.point_monetary_value = value.toFixed(2)
            }
          }
        })
      },
      initHeight() {
        if (this.tiers.data.length > 0) {
          const height = document.getElementsByClassName('tier-detail')[0].clientHeight
          if (height > 0) {
            document.getElementsByClassName('tier-add-not-first')[0].style.height = `${height}px`
          }
        }
      },
      // 新增一个新的tier列
      addNewTier(id = 0) {
        if (this.tiers.data === null) {
          this.tiers.data = []
        }
        this.tier_bonus_generosity.push(true)
        this.tiers.data.push({
          member_tier_name: '',
          member_tier_code: '',
          default_tier: 0,
          active_flag: 1,
          create_date: parse2Date(),
          multiple_point_ratio: 0,
          upgrade_type: 1,
          upgrade_value_from: 0,
          upgrade_value_to: 0,
          expired_type: id === 1 ? 3 : 2,
          expired_fixed_after_year: 0,
          expired_fixed_specific_month: 0,
          expired_fixed_specific_date: 0,
          expired_relative_unit: 2,
          expired_relative_value: 1,
          is_newTier: true,
          is_advanced_slice: 0, // 1是 需要  0 是不需要
          is_limit_upgrade_period: true,
          limit_upgrade_period_unit: 1,
          limit_upgrade_period_value: 1,
          single_upgrade_purchase_amount_threshold: null,
          local_state: 1 // 1是新增的  2 是已经到下一步的 3 是已保存的 4 是重新编辑的
        })
      },
      addNewTierNext(id = this.tiers.data.length) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 检测tier name 是否重复
            if (!this.checkTierNameDuplicate()) {
              this.$message({
                message: this.handleGlobalI18n('validation', 'tier_name_duplicated'),
                type: 'warning'
              })
              return
            }
            // 提示框
            var _this = this
            this.$confirm(this.$t('loyalty.fc_tier_add_new_content_label'), this.$t('loyalty.fc_loyalty_tier_attention_title'), {
              confirmButtonText: this.handleGlobalI18n('system', 'confirm'),
              cancelButtonText: this.handleGlobalI18n('system', 'cancel')
            }).then(_ => {
              _this.tiers.data[id - 1].local_state = 2
              _this.tier_bonus_generosity.push(true)
              const new_obj = {
                member_tier_name: '',
                member_tier_code: '',
                default_tier: 0,
                active_flag: 1,
                create_date: parse2Date(),
                multiple_point_ratio: 0,
                upgrade_type: 1,
                upgrade_value_from: 0,
                upgrade_value_to: 0,
                expired_type: 2,
                expired_fixed_after_year: 0,
                expired_fixed_specific_month: 0,
                expired_fixed_specific_date: 0,
                expired_relative_unit: 2,
                expired_relative_value: 1,
                is_newTier: true,
                is_advanced_slice: 0, // 1是 需要  0 是不需要
                is_limit_upgrade_period: true,
                limit_upgrade_period_unit: 1,
                limit_upgrade_period_value: 1,
                single_upgrade_purchase_amount_threshold: null,
                local_state: 1 // 1是新增的  2 是已经到下一步的 3 是已保存的
              }
              _this.tiers.data.splice(id, 0, new_obj)
            }).catch(_ => {
              return false
            })
          } else {
            this.$message({
              message: this.handleGlobalI18n('validation', 'tier_configuration_not_done'),
              type: 'warning'
            })
            return false
          }
        })
      }
    },
    watch: {
      'tiers.data': {
        handler() {
          this.$nextTick(() => {
            this.initHeight()
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $padding-left: 21px;
  // $height: 950px;
  $height: 880px;
  .dis-flex{
    display: flex;
    align-items: center;
    .li{
      margin-top: 0!important;
      &:not(:first-child) {
        margin-left: 17%
      }
      .svg-icon{
        font-size: 20px;
        color: $primary!important;
      }
    }

  }
  .tier-detail{
    position: relative;
  }
  .bg-000{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(239, 239, 239, .4);
    z-index: 999;
  }
  .margin-20{
    margin: 20px 0 0;
  }
  .dash{
    margin: 0 $padding-left;
    border-bottom: 1px dashed #bbbbbb;
  }
  .z-index-1{
    visibility:hidden;
  }
  .tier {
    .svg-icon{
      min-width: 20px;
      font-size: 20px;
    }
    line-height: 1.2;
    margin: 14px 20px;
    border-radius: 2px;
    .operate {
      height: $--operate-bg-height;
      background-color: $--operate-bg-color;
      padding: 5px 0 5px 20px;
      display: flex;
      justify-content: start;
    }
    .title{
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .ul{
      line-height: 20px;
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      .li{
        display: flex;
        align-items: center;
        &:not(:first-child) {
          margin-top: 12px;
        }
        label{
          margin-left: 10px;
        }
      }
    }
    &-add-first, &-add-not-first{
      position: relative;
      width: 100%;
      border: 1px dashed $primary;
      cursor: pointer;
      height: 927px; // 1027
      .middle{
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        height: 100px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        .svg-icon{
          font-size: 52px;
        }
        label{
          width: 100%;
          color: $primary;
          font-size: 18px;
        }
      }
    }
    &-detail{
      margin-top: 14px;
      background: #fff;
    }
    &-name{
      height: 50px;
      display: flex;
      overflow: hidden;
      align-items: center;
      background: $primary;
      border-radius: 2px 2px 0 0;
      .el-form-item{
        width: 445px;
        margin-bottom: 0!important;
        padding: 10px 0;
        margin-left: 21px;
      }
      i{
        cursor: pointer;
        font-size: 28px;
        margin-left:15px;
        color: rgba(255, 255, 255, 1);
      }
    }
    &-generosity{
      background: #ffffff;
      .base-generosity{
        margin-left: $padding-left;
      }
      .base-generosity-title, .tier-bonus-title p{
        color: #333333;
        font-size: 16px;
      }
      .base-generosity-title{
        margin: 12px 0;
      }
      .dash{
        @extend .dash;
        margin: 14px $padding-left 14px 0;
      }
      label{
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
      }
      .tier-bonus-title{
        padding-right: $padding-left;
        align-items: center;
        padding-bottom: 14px;
        .select{
          display: flex;
          justify-content: space-between;
        }
        .on-tier-bonus{
          margin-top: 12px;
        }
      }
    }
    &-upgrade-rule{
      background: #F9F9F9;
      .el-select{
        width: 28%;
      }
      .eligibility-rule,.threshold-tier, .XXXXX, .tier-transition, .maximum-purchase-upgrade-rule{
        padding-left: $padding-left;
        p{
          color: rgba(16, 16, 16, 1);
          font-size: 15px;
          margin: 12px 0;
        }
      }
      .eligibility-rule{
        .el-input{
          width: 30%
        }
      }
      .tier-transition, .maximum-purchase-upgrade-rule{
        padding-bottom: 15px;
        .svg-icon{
          color: $primary!important;
        }
      }
      .XXXXX{
        p{
          margin-right: $padding-left;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    &-downgrading{
      background:#ffffff ;
      .eligibility-period{
        padding-left: $padding-left;
        padding-bottom: 20px;
        p{
          color: rgba(16, 16, 16, 1);
          font-size: 15px;
          margin: 12px 0;
        }
        .svg-icon{
          color: $primary!important;
        }
      }
      .downgrade-config{
        padding-left: $padding-left;
        padding-bottom: 20px;
      }
    }
    &-next{
      border-top: 1px solid #f2f2f2;
      background: #ffffff;
      text-align: right;
      .el-button{
        min-width: 80px;
        margin: 8px 21px 8px;
      }
    }
    .tier-add-first{
      .svg-icon{
        font-size: 85px
      }
    }
  }
  .list-ul{
    .list-li{
      min-width: 530px;
      &:not(:first-child) {
        margin-left: 20px;
      }
    }
    display: flex;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .tier{
    .el-scrollbar__wrap{
      overflow-x: scroll;
    }
  }
  .bg-color-primary-tier{
    line-height: 33px;
    .el-input__inner{
      background-color: $primary!important;
      color: #ffffff!important;
      border: none!important;
      font-size: 18px!important;
      padding-top: 10px!important;
    }
  }
  .el-switch .el-switch__label--left {
    color: #303133!important;
  }
  .loyalty-tier{
    .el-input-number, .el-select, .el-input{
      margin: 0!important;
    }
  }
</style>
