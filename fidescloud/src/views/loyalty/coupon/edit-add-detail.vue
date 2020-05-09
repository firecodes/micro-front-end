<template>
  <div class="edit-add-detail-copy-coupon new-theme-css" v-loading="loading">
    <div class="click-button">
      <template v-if="query.type === 'detail'">
        <!--<p class="top-p-left">Coupon Details</p>-->
        <p class="top-p-left" />
      </template>
      <template v-else>
        <p></p>
      </template>
      <template v-if="query.type === 'detail'">
        <div>
          <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_back_label')}}</el-button>
          <el-button type="primary" class="save el-button-width-108" @click="handleClickEdit">{{$t('loyalty.fc_operation_btn_edit_label')}}</el-button>
        </div>
      </template>
      <template v-else-if="query.type === 'edit'">
        <div>
          <el-button class="delete" @click="lineDeleteCoupon(query.id)">{{$t('loyalty.fc_operation_btn_delete_label')}}</el-button>
          <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
          <el-button :loading="save_loading" @click="submitForm(false)" class="save" type="primary">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
        </div>
      </template>
      <template v-else>
        <div>
          <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
          <el-button :loading="save_loading" @click="submitForm(false)" class="save" type="primary">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
        </div>
      </template>
    </div>
    <!--info-->
    <div class="contain" :class="{'detail-contain' : query.type === 'detail'}">
      <ed-header-title :title="handleHeaderTitle()" />
      <div class="info">
        <el-form ref="coupon" :model="form" :rules="rules"  label-width="300px" label-position="left">
          <!--coupon code-->
          <el-form-item :label="$t('loyalty.fc_coupon_details_basic_code_label')" prop="coupon_code" ref="coupon_code" >
            <template v-if="query.type=== 'detail'">
              <p>{{form.coupon_code}}</p>
            </template>
            <template v-else-if="query.type=== 'edit'">
              <el-input :disabled="true" maxlength="32" v-model="form.coupon_code" />
            </template>
            <template v-else>
              <el-input :disabled="form.auto_generate_code" :placeholder="$t('loyalty.fc_add_coupon_code_input_label')" maxlength="32" v-model="form.coupon_code" />
              <el-checkbox class="margin-left-20" v-model="form.auto_generate_code">{{$t('loyalty.fc_add_coupon_code_automated_label')}}</el-checkbox>
            </template>
          </el-form-item>
          <!--coupon name-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_name_label')" prop="coupon_name" ref="coupon_name">
            <template v-if="query.type=== 'detail'">
              <p>{{form.coupon_name}}</p>
            </template>
            <template v-else>
              <el-input :placeholder="$t('loyalty.fc_add_coupon_name_input_label')" maxlength="32" v-model="form.coupon_name" />
            </template>
          </el-form-item>
          <!--coupon view-->
          <el-form-item :label="$t('loyalty.fc_coupon_details_basic_coupon_view_label')" prop="coupon_view" ref="coupon_view"  v-if="query.type=== 'detail' && enable_coupon_tools === 'true'">
            <p>{{form.cpntools_coupon_id?'Completed':'Uncompleted'}}</p>
          </el-form-item>
          <!--Channel-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_channel_label')" prop="channel_code">
            <template v-if="query.type=== 'detail'">
              <p>{{form.channel_name}}</p>
            </template>
            <template v-else>
              <el-select v-model="form.channel_code" @change="changeChannelCode">
                <el-option class="new-select-option" v-for="item in channel_list" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
            </template>
          </el-form-item>
          <!--coupon type-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_type_label')"  prop="coupon_type_code" ref="coupon_type_code">
            <template v-if="query.type=== 'detail'">
              <p>{{form.coupon_type_name}}</p>
            </template>
            <template v-else>
              <el-select v-model="form.coupon_type_code" >
                <el-option class="new-select-option" v-for="item in coupon_type_list" v-show="((form.channel_code === 'online' || form.channel_code === 'all') && (item.value === 'cash' || item.value === 'discount')) || form.channel_code === 'offline'" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
            </template>
          </el-form-item>
          <!--cash amount-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_cash_amount_label')" prop="amount" v-if="form.coupon_type_code === 'cash'">
            <p v-if="query.type=== 'detail'">{{form.amount}}</p>
            <el-input-number v-model="form.amount" :min="0"  :precision="2" :max="9999999" class="width-300" v-else/>
          </el-form-item>
          <!--discount amount-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_discount_amount_label')" prop="amount" v-if="form.coupon_type_code === 'discount'">
            <p v-if="query.type=== 'detail'">{{form.amount.toFixed(2)}}<label class="label-condition">%</label></p>
            <template v-else>
              <el-input-number v-model="form.amount" :min="0" :max="100" :precision="2" class="width-300"/>
              <label class="label-condition margin-left-20">%</label>
            </template>
          </el-form-item>
          <!--select a sku-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_select_sku_label')" v-if="form.coupon_type_code === 'sku'" v-show="query.type !== 'detail'">
            <el-button type="primary" class="select-gift-button" @click="dialog_show = true">{{$t('loyalty.fc_add_coupon_select_sku_btn_label')}}</el-button>
          </el-form-item>
          <!--selected sku-->
          <el-form-item class="selected_gift" :label="$t('loyalty.fc_add_coupon_selected_sku_label')" style="height: 116px;" v-if="form.coupon_type_code === 'sku'">
            <el-table :data="tableSKUData" border style="width: 500px" v-loading = 'table_data_loading' :empty-text="$t('loyalty.fc_add_coupon_selected_no_data_label')">
              <el-table-column  align="center" :label="$t('loyalty.fc_coupon_select_sku_table_code_label')" min-width="120px" prop="product_code">
                <template slot-scope="scope">
                  <v-clamp :max-lines="1" autoresize>{{scope.row.product_code}}</v-clamp>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('loyalty.fc_coupon_select_sku_table_name_label')" min-width="130px" prop="product_name">
                <template slot-scope="scope">
                  <v-clamp :max-lines="1" autoresize>{{scope.row.product_name}}</v-clamp>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('loyalty.fc_coupon_select_sku_table_category_label')" min-width="130px" prop="product_category_name">
                <template slot-scope="scope">
                  <v-clamp :max-lines="1" autoresize>{{scope.row.product_category_name || table_placeholder}}</v-clamp>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- condition-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_condition_label')" prop="min_purchased_amount">
            <p v-if="query.type=== 'detail'"> <label class="label-condition">{{$t('loyalty.fc_add_coupon_condition_input_label')}}</label>{{form.min_purchased_amount}}</p>
            <template v-else>
              <label class="label-condition">{{$t('loyalty.fc_add_coupon_condition_input_label')}}</label>
              <el-input-number v-model="form.min_purchased_amount" :min="0" :max="9999999" :step="1"  class="width-150"/>
            </template>
          </el-form-item>
          <!--Validity period-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_period_label')" class="effective_type" prop="effective_type" :class="{'height-66 line-height-33': query.type === 'detail'}">
            <template v-if="query.type=== 'detail'">
              <p v-if="form.effective_type === 1" :class="{'line-height-1': query.type=== 'detail'}">{{$t('loyalty.fc_coupon_details_basic_period_relative_label').replace('{3}',form.relative_value_from).replace('{10}', form.relative_value)}}</p>
              <p v-else-if="form.effective_type === 2" :class="{'line-height-1': query.type=== 'detail'}">{{form.specific_effective_date_from}} {{$t('loyalty.fc_coupon_details_basic_period_specific_label')}} {{form.specific_effective_date_to}}</p>
            </template>
            <template v-else>
              <el-select v-model.number="form.effective_type">
                <el-option class="new-select-option" v-for="item in validity_period_list" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
              <section v-if="form.effective_type === 1">
                <div>
                  <label class="width-80">{{$t('loyalty.fc_add_coupon_period_relative_start_label')}}</label>
                  <el-input-number v-model="form.relative_value_from" :min="0" :max="99999" :step="1" />
                  <label class="label-condition"> {{$t('loyalty.fc_add_coupon_relative_date_start_desc_label')}}</label>
                </div>
                <div class="flex">
                  <label class="width-80"> </label>
                  <i class="el-icon-info margin-right-20" />{{$t('loyalty.fc_add_coupon_period_relative_start_tips_label')}}
                </div>
                <div>
                  <label class="width-80">{{$t('loyalty.fc_add_coupon_period_relative_end_label')}}</label>
                  <el-input-number v-model="form.relative_value" :min="0" :max="99999" :step="1" />
                  <label class="label-condition">{{$t('loyalty.fc_add_coupon_relative_date_end_desc_label')}}</label>
                </div>
              </section>
              <section v-else-if="form.effective_type === 2">
                <el-date-picker
                  popper-class="new_data_table"
                  v-model="date_from"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="-"
                  :picker-options="pickerOptions0"
                  :default-time="['00:00:00', '23:59:59']"
                  :format = '`${globalData.value.date_format} HH:mm:ss`'>
                </el-date-picker>
              </section>
            </template>
          </el-form-item>
          <!--coupon T&C-->
          <el-form-item :label="$t('loyalty.fc_add_coupon_tc_label')" prop="terms" class="terms">
            <p class="line-height-1 white-space" style="padding-right: 20em; margin-top: 6px" v-html="form.terms" v-if="query.type=== 'detail'" />
            <el-input :rows="8" class="width-1000" maxlength="400000" show-word-limit type="textarea" v-else v-model="form.terms" />
          </el-form-item>
          <!-- Coupon style -->
          <el-form-item :label="$t('loyalty.fc_add_coupon_style_label')" prop="coupon_style" v-if="enable_coupon_tools === 'true'">
            <el-button :disabled="!form.cpntools_coupon_id ? true:false" @click="openNewWidow" class="blue-button" type="primary" v-if="query.type === 'detail'">{{$t('loyalty.fc_coupon_details_basic_coupon_style_btn_label')}}</el-button>
            <div class="flex font-size-12" v-else-if="query.type !== 'detail' && enable_coupon_tools === 'true'">
              <el-button @click="styleDialog=true" class="blue-button confirm-button" type="primary">{{$t('loyalty.fc_add_coupon_style_btn_configure_label')}}</el-button>
              <i class="el-icon-info margin-left-20" />
              <span>{{$t('loyalty.fc_add_coupon_style_tips_label').split('{')[0]}}<router-link :to="{path:'/loyalty/coupon/guide'}" class="color-blue" target="_blank">{{$t('loyalty.fc_add_coupon_style_tips_label').split('{')[1].split('}')[0]}}</router-link>{{$t('loyalty.fc_add_coupon_style_tips_label').split('}')[1]}}</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!--redemption information-->
    <div class="contain detail-contain margin-top-27-border" v-if="query.type === 'detail'">
      <ed-header-title :title="$t('loyalty.fc_coupon_details_redemption_section_title')" />
      <el-form  label-position="left" :model="form" label-width="300px">
        <div class="content">
          <div class="info">
            <!--Redemption status:-->
            <el-form-item :label="$t('loyalty.fc_coupon_details_redemption_status_label')">
              <p class="color-333">{{form.is_used_in_redemption ? 'Yes': 'No'}}</p>
            </el-form-item>
            <!--Number of redeemed coupons:-->
            <el-form-item :label="$t('loyalty.fc_coupon_details_redemption_number_label')">
              <p class="color-333">{{ form.redeemed_counts ? form.redeemed_counts : 0 }}</p>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <!--campaign information-->
    <div class="contain new-table-css detail-contain margin-top-27-border" v-if="query.type === 'detail'">
      <ed-header-title :title="$t('loyalty.fc_coupon_details_campaign_section_title')" />
      <div class="info">
        <el-table :data="campaign_information_data" size="medium"  highlight-current-row :empty-text="$t('member.fc_table_no_data_label')">
          <el-table-column :label="$t('loyalty.fc_coupon_details_campaign_table_name_label')" align="center" prop="campaign_name" />
          <el-table-column :label="$t('loyalty.fc_coupon_details_campaign_table_launched_label')" align="center" prop="campaign_launched" />
          <el-table-column :label="$t('loyalty.fc_coupon_details_campaign_table_number_label')" align="center" prop="number_of_issued_coupons" />
        </el-table>
      </div>
    </div>
    <select-sku v-if="query.type !== 'detail'" :dialog_show="dialog_show" :radio_row="radio_row" @handleDialogVisible="handleDialogVisible" @selectGiftDialog="selectGiftDialog" />
    <el-dialog :title="$t('loyalty.fc_add_coupon_style_popup_title_label')" :visible.sync="styleDialog" top="30vh" width="420px">
      <div class="ld">
        <div class="content coupon-style">
          <p v-html="$t('loyalty.fc_add_coupon_style_popup_content_label')" />
          <el-input :disabled="true" v-model="form.rel_cpntools_code">
             <el-button @click="copy()" class="copy-button" slot="append">{{$t('loyalty.fc_add_coupon_style_popup_btn_copy_label')}}</el-button>
          </el-input>
         </div>
      </div>
      <div style="margin-top:14px; text-align: center">
        <el-button @click="styleDialog=false">{{$t('loyalty.fc_add_coupon_style_popup_btn_cancel_label')}}</el-button>
        <el-button @click="confirm()" type="primary" >{{$t('loyalty.fc_add_coupon_style_popup_btn_confirm_label')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { batchDeleteCoupon, addOrUpdateCoupon, checkMemberCouponCode, getCouponInfoByCode, obtainAddCouponPage, obtainEditCouponPage } from '@/api/loyalty'
  import { queryProductList } from '@/api/master'
  import SelectSku from './select-sku'
  import VClamp from 'vue-clamp'
  import { getTimeZone, copyText } from '@/utils'
  import { handleOssFileHtmlStr } from '@/views/data/oss-file-html-str'
  export default {
    mixins: [handleOssFileHtmlStr],
    components: {
      SelectSku,
      VClamp
    },
    data() {
      return {
        styleDialog: false,
        table_data_loading: false,
        campaign_information_data: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        radio_row: '',
        dialog_show: false,
        date_from: [],
        tableSKUData: [],
        validity_period_list: [{ name: this.$t('loyalty.fc_add_coupon_period_2nd_label'), value: 1 }, { name: this.$t('loyalty.fc_add_coupon_period_1st_label'), value: 2 }],
        channel_list: [{ name: this.$t('loyalty.fc_add_coupon_channel_1st_label'), value: 'online' }, { name: this.$t('loyalty.fc_add_coupon_channel_2nd_label'), value: 'offline' }, { name: this.$t('loyalty.fc_add_coupon_channel_3rd_label'), value: 'all' }],
        coupon_type_list: [{ name: this.$t('loyalty.fc_add_coupon_type_1st_label'), value: 'cash' }, { name: this.$t('loyalty.fc_add_coupon_type_2nd_label'), value: 'discount' }, { name: this.handleGlobalI18n('loyalty', 'sku'), value: 'sku' }],
        delete: {
          params: {},
          loading: false
        },
        tableData: [],
        detail_gift_category_name: '',
        loading: false,
        save_loading: false,
        unit: this.globalData.value.currency,
        rules: {
          coupon_code: [{ validator: this.checkCouponCode, message: ' ', trigger: 'blur' }],
          coupon_name: [{ required: true, message: ' ', trigger: ['blur', 'change'] }, { validator: this.checkCouponName, trigger: ['blur', 'change'] }],
          channel_code: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          coupon_type_code: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          amount: [{ required: true, validator: this.checkAmount, message: ' ', trigger: ['blur', 'change'] }],
          effective_type: [{ required: true, validator: this.checkEffectiveType, message: ' ', trigger: ['blur', 'change'] }],
          terms: [{ required: true, message: ' ', trigger: ['blur', 'change'] }]
        },
        form: {
          auto_generate_code: false,
          coupon_code: '',
          terms: null,
          effective_type: 1,
          min_purchased_amount: null,
          amount: null,
          coupon_type_code: 'cash',
          channel_code: 'online',
          coupon_name: null,
          coupon_view: '',
          product_code: '',
          relative_value_from: 0,
          relative_value: 1,
          specific_effective_date_fromdate_from: null,
          specific_effective_date_to: null,
          rel_cpntools_code: null,
          cpntools_coupon_id: ''
        },
        query: {},
        category_list: [],
        edit_state: false,
        rel_cpntools_code: JSON.parse(localStorage.getItem('tenantInfo')).code + '_' + new Date().getTime(),
        clickConfirm: false,
        enable_coupon_tools: sessionStorage.getItem('enable_coupon_tools')
      }
    },
    watch: {
      '$store.getters.language': {
        handler() {
          this.channel_list = [{ name: this.$t('loyalty.fc_coupon_advanced_channel_1st_label'), value: 'online' }, { name: this.$t('loyalty.fc_coupon_advanced_channel_2nd_label'), value: 'offline' }, { name: this.$t('loyalty.fc_coupon_advanced_channel_3rd_label'), value: 'all' }]
          this.coupon_type_list = [{ name: this.$t('loyalty.fc_add_coupon_type_1st_label'), value: 'cash' }, { name: this.$t('loyalty.fc_add_coupon_type_2nd_label'), value: 'discount' }, { name: this.handleGlobalI18n('loyalty', 'sku'), value: 'sku' }]
          this.validity_period_list = [{ name: this.$t('loyalty.fc_add_coupon_period_2nd_label'), value: 1 }, { name: this.$t('loyalty.fc_add_coupon_period_1st_label'), value: 2 }]
        }
      },
      tableSKUData(val) {
        if (val.length > 0) {
          this.form.product_code = this.tableSKUData[0].product_code
        }
      },
      date_from(val) {
        if (val && val.length > 0) {
          [this.form.specific_effective_date_from, this.form.specific_effective_date_to] = val
        } else {
          [this.form.specific_effective_date_from, this.form.specific_effective_date_to] = [null, null]
        }
      }
    },
    created() {
      this.query = this.$route.query
      this.form.rel_cpntools_code = this.enable_coupon_tools === 'true' ? this.rel_cpntools_code : null
      if (this.query.type === 'detail' || this.query.type === 'edit' || this.query.type === 'copy') {
        // 获取详情
        this.detail_loading = true
        this.edit_state = true
        this.handleGetDetailInfo()
      }
      if (this.query.type === 'detail') {
        this.rules = {}
      }
    },
    methods: {
      checkCouponCode(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail' || this.form.auto_generate_code || type === 'edit') {
          callback()
          return true
        }
        if (!this.form.coupon_code) {
          callback(new Error(' '))
          return true
        }
        checkMemberCouponCode({ coupon_code: this.form.coupon_code }).then(res => {
          const obj = res.return_result
          if (obj.exist) {
            this.$message.error(this.$t('loyalty.fc_coupon_code_duplicated_notification_tips'))
            callback(new Error(' '))
          } else {
            callback()
          }
        }).then((res) => {
          callback(new Error(' '))
        })
      },
      changeChannelCode() {
        this.form.coupon_type_code = 'cash'
      },
      selectGiftDialog(row) {
        if (row === null) {
          this.form.product_code = ''
          this.radio_row = ''
          this.tableSKUData = []
        } else {
          this.radio_row = row.product_code
          this.tableSKUData = []
          this.tableSKUData.push(row)
        }
      },
      handleDialogVisible(bl) {
        this.dialog_show = bl
      },
      deleteCoupon(type) {
        this.$confirm(this.$t('loyalty.fc_coupon_delete_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
          cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          // success
          this.handleDelete(type)
        }).catch(() => {
          // cancel
        })
      },
      handleDelete(type) {
        this.delete.loading = true
        batchDeleteCoupon(this.delete.params).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('loyalty.fc_coupon_delete_notification_label')
          })
          this.$router.go(-1)
          this.delete.loading = false
        }).catch(res => {
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
        })
      },
      // 一行的删除
      lineDeleteCoupon(coupon_code) {
        this.delete.params = {
          codes: [coupon_code]
        }
        this.deleteCoupon()
      },
      handleClickEdit() {
        this.query.type = 'edit'
        this.handleGetDetailInfo()
        this.rules = {
          coupon_name: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          channel_code: [{ required: true, message: ' ', trigger: ['blur'] }],
          coupon_type_code: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          amount: [{ required: true, validator: this.checkAmount, message: ' ', trigger: ['blur', 'change'] }],
          effective_type: [{ required: true, validator: this.checkEffectiveType, message: ' ', trigger: ['blur', 'change'] }],
          terms: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          product_code: [{ required: true, message: ' ', trigger: ['blur', 'change'] }]
        }
        // this.$refs['coupon'].resetFields()
      },
      handleGetDetailInfo() {
        this.loading = true
        getCouponInfoByCode({ 'coupon_code': this.query.id }).then(res => {
          this.form = Object.assign({}, this.form, res.return_result, { terms: '' })
          const terms = res.return_result.terms || ''
          this.edit_state = false
          // 处理discount amount
          if (this.form.coupon_type_code === 'discount') {
            this.form.amount = this.form.amount * 100
          }
          // copy 除了coupon code 之外 其他的全部复制过来
          if (this.query.type === 'copy') {
            this.form.coupon_code = null
            // coupon name 变成 Copy + coupon name
            this.form.coupon_name = 'Copy-' + this.form.coupon_name
          }
          if (this.form.coupon_type_code === 'sku' && this.form.product_code) {
            this.table_data_loading = true
            // 去调用gift 详情
            queryProductList({ 'product_query': this.form.product_code, 'page_no': 1, 'page_size': 1 }).then(res => {
              this.tableSKUData = res.return_result.products
              this.radio_row = this.form.product_code
              this.table_data_loading = false
            }).catch(res => {
              this.table_data_loading = false
            })
          }
          if (this.form.effective_type === 2) {
            this.date_from = [`${this.form.specific_effective_date_from.substr(0, 10)} ${this.form.specific_effective_date_from.substr(11, 8)}`, `${this.form.specific_effective_date_to.substr(0, 10)} ${this.form.specific_effective_date_to.substr(11, 8)}`]
          } else if (!this.form.relative_value_from) {
            this.form.relative_value_from = 0
          }
          // 查询terms 20200426
          if (terms) {
            this.handleHtml2str(terms).then(res => {
              this.loading = false
              this.detail_loading = false
              this.form.terms = res.replace(/<br\/>/g, '\r\n')
            })
          } else {
            this.loading = false
            this.detail_loading = false
          }
          if (this.query.type === 'edit' && !this.form.rel_cpntools_code && this.enable_coupon_tools === 'true') {
            this.form.rel_cpntools_code = this.rel_cpntools_code
          }
          this.loading = false
          this.detail_loading = false
        }).catch(() => {
          this.loading = false
          this.detail_loading = false
        })
      },
      handleImgUrl(val) {
        this.form.image_url = val
      },
      checkEffectiveType(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail') {
          callback()
          return true
        }
        if (this.form.effective_type === 1) {
          if (this.form.relative_value_from === undefined || this.form.relative_value === undefined || (this.form.relative_value_from === 0 && this.form.relative_value === 0) || this.form.relative_value_from > this.form.relative_value) {
            callback(new Error(' '))
            return true
          }
          callback()
        } else {
          if (!this.form.specific_effective_date_from || !this.form.specific_effective_date_to || (this.form.specific_effective_date_from >= this.form.specific_effective_date_to)) {
            callback(new Error(' '))
            return true
          }
          callback()
        }
      },
      checkAvailableInventory(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail' || this.form.is_limited_inventory) {
          callback()
          return true
        }
        if ((this.form.available_inventory) === '' || this.form.available_inventory === undefined) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
          return true
        }
        callback()
      },
      checkCouponName(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail') {
          callback()
          return true
        }
        if (this.form.coupon_name.length > 32) {
          this.$message.error('Coupon name is 32 bits long')
          callback(new Error(' '))
          return true
        }
        callback()
      },
      checkAmount(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail') {
          callback()
          return true
        }
        if (this.form.coupon_type_code === 'discount' && Number(this.form.amount) >= 0 && Number(this.form.amount) <= 100) {
          callback()
          return true
        }
        if (this.form.coupon_type_code === 'cash' && Number(this.form.amount) >= 0 && Number(this.form.amount) <= 9999999) {
          callback()
          return true
        }
        callback(new Error(''))
        return false
      },
      submitForm(clickConfirm) {
        this.clickConfirm = clickConfirm
        if (this.form.coupon_type_code === 'sku' && !this.form.product_code) {
          this.$message.error(this.$t('loyalty.fc_coupon_sku_empty_notification_label'))
          return false
        }
        if (this.form.effective_type === 2 && this.form.specific_effective_date_from !== '' && this.form.specific_effective_date_from !== null) {
          this.form = Object.assign({}, this.form, { specific_effective_date_from: `${this.form.specific_effective_date_from.substr(0, 10)}T${this.form.specific_effective_date_from.substr(11, 8)}${getTimeZone()}`, specific_effective_date_to: `${this.form.specific_effective_date_to.substr(0, 10)}T${this.form.specific_effective_date_to.substr(11, 8)}${getTimeZone()}` })
        } else {
          this.form.specific_effective_date_to = null
          this.form.specific_effective_date_from = null
        }
        this.form.relative_unit = 1
        this.$refs['coupon'].validate(valid => {
          if (valid) {
            this.handleSubmitForm()
          } else {
            this.save_loading = false
            return false
          }
        })
      },
      async handleSubmitForm() {
        var terms = ''
        if (this.form.terms) {
          var rs = this.form.terms.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')
          await this.handleStr2html(rs).then(res => {
            terms = res
          }).catch(() => {
            this.save_loading = false
            this.$message.error(this.$t('configuration.fc_configuration_import_table_status_value4_lable'))
          })
        }
        await this.handleAddOrUpdateCoupon(terms)
      },
      handleAddOrUpdateCoupon(terms) {
        // 如果是编辑 则将字段auto_generate_code 删除
        if (this.query.type === 'edit') {
          delete this.form.auto_generate_code
        }
        var amount = this.form.amount
        if (this.form.coupon_type_code === 'discount') {
          amount = this.form.amount / 100
        }
        if (!this.form.rel_cpntools_code && this.enable_coupon_tools === 'true') {
          this.form.rel_cpntools_code = this.rel_cpntools_code
        }
        addOrUpdateCoupon({ ...this.form, terms: terms, amount: amount }).then(res => {
          if (this.clickConfirm) {
            var pushUrl = '/loyalty/coupon/guide'
            // 获取cpntools_coupon_url
            if (this.form.cpntools_coupon_id) {
              obtainEditCouponPage({ cpntools_coupon_id: this.form.cpntools_coupon_id }).then(res => {
                this.save_loading = false
                this.$message({
                  message: this.$t('configuration.fc_operation_feedback_notification_label'),
                  type: 'success'
                })
                window.open(res.return_result.url)
                this.$router.push({
                  path: pushUrl
                })
              }).catch(() => {
                this.save_loading = false
                this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
              })
            } else {
              obtainAddCouponPage().then(res => {
                this.save_loading = false
                this.$message({
                  message: this.$t('configuration.fc_operation_feedback_notification_label'),
                  type: 'success'
                })
                window.open(res.return_result.url)
                this.$router.push({
                  path: pushUrl
                })
              }).catch(() => {
                this.save_loading = false
                this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
              })
            }
          } else {
            this.save_loading = false
            this.$message({
              message: this.$t('configuration.fc_operation_feedback_notification_label'),
              type: 'success'
            })
            this.$router.go(-1)
          }
        }).catch(res => {
          this.save_loading = false
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
        })
      },
      handleHeaderTitle() {
        var type = this.query.type
        if (type === 'detail') {
          return this.$t('loyalty.fc_coupon_details_basic_section_title')
        } else if (type === 'add' || type === 'copy') {
          return this.$t('loyalty.fc_add_coupon_title_label')
        } else if (type === 'edit') {
          return this.$t('loyalty.fc_edit_coupon_title_label')
        }
      },
      confirm() {
        this.styleDialog = false
        this.submitForm(true)
      },
      copy() {
        copyText(this.form.rel_cpntools_code) && this.$message.success(this.$t('loyalty.fc_add_coupon_style_popup_copy_notification_label'))
      },
      openNewWidow() {
        window.open(this.form.cpntools_coupon_url)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .font-size-12 {
    font-size: 12px;
  }
  .margin-left-20{
    margin-left: 20px;
  }
  .margin-right-20 {
    margin-right: 20px;
  }
  .white-space{
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
  .margin-top-27-border{
    margin-top: 27px;
  }
  .el-input-number{
    width: 178px;
  }
  .width-150{
    width: 150px!important;
  }
  .width-80{
    display: inline-block;
    width: 80px;
  }
  .line-height-1{
    line-height: 1.5;
  }
  .select-gift-button{
    width:60px;
    background:$new-primary!important;
    border-color: $new-primary
  }
  .blue-button, .copy-button{
    background:$new-primary!important;
    border-color: $new-primary;
    color: #ffffff !important;
    &:disabled {
      background-color: #909399 !important;
      border-color: #909399 !important;
    }
  }
  .confirm-button {
    width: 100px;
    height: 30px;
    padding: 0;
  }
  .copy-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .label-condition{
    font-size:14px;
    color:rgba(51,51,51,1);
    line-height:16px;
    padding-right: 3px;
  }
  .edit-add-detail-copy-coupon {
    .flex {
      display: flex;
      align-items: center;
    }
    .el-icon-info {
      margin-right: 8px;
      color: $new-primary;
      font-size: 20px;
    }
    .color-blue {
      color: $new-primary;
    }
    .coupon-style {
      p {
        line-height: 24px;
      }
      .el-input {
        width: 100%!important;
        margin-top: 15px;
      }
    }
    /deep/ .el-dialog__body {
      padding: 10px 15px !important;
    }
    /deep/ .el-textarea .el-input__count{
      bottom: -10px;
      right: -63px;
    }
    .el-button{
      min-width: 88px;
    }
    .pagination-container {
      text-align: right;
      padding: 15px 0;
      background-color: #ffffff;
    }
    .el-input{
      width: 300px;
    }
    .el-select{
      width: 300px;
    }
    .el-form-item{
      margin: 0 0 70px 20px;
      height: auto;
      min-height: 66px;
      line-height: 66px;
      margin-bottom: 0!important;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(230,230,230,1);
      }
      // &:last-child{
      //   padding: 15px 0!important;
      //   min-height: 66px;
      //   height: auto!important;
      // }
      display: flex;
      align-items: center;
    }
    .terms {
      padding: 15px 0!important;
    }
    .terms, .selected_gift, .effective_type{
      align-items: flex-start
    }
    .selected_gift, .effective_type{
      padding: 15px 0!important;
    }
    .effective_type{
      section{
        margin-top: 13px;
      }
    }
    .width-1000{
      width: 1000px!important;
    }
    margin: 30px;
    .click-button {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      text-align: right;
      margin-bottom: -20px;
      .save{
        margin-left: 8px;
        background-color: $new-primary;
        border-color: $new-primary;
      }
      .cancel, .delete{
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
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
  .height-66{
    min-height:66px!important;
  }
  /deep/ .height-66 .el-form-item__label, .line-height-33 .line-height-1{
    line-height: 33px!important;
  }
  .height-110{
    height:110px!important;
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  @import "../new-theme-css";
  .edit-add-detail-copy-coupon{
    .el-table th{
      padding: 4px 0 !important;
    }
    .el-table__empty-block{
      min-height: 42px!important;
      height: 32px!important;
    }
    .el-form-item .el-form-item__label {
      font-size: 14px!important;
      font-weight: 700!important;
      color: rgba(51,51,51,1);
      line-height: 17px;
      &:before{
        color: rgba(51,51,51,1)!important;
      }
    }
    .el-form-item__content{
      margin-left: 0!important;
      width: 100%;
    }
  }
</style>
