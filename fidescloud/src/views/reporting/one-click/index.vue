<!--reporting-->
<template>
  <div class="reporting">
    <el-form :inline="true" :model="form" class="ed-form" label-width="180px" ref="form">
      <!--Reporting type----------------------------------------------------------------------------------------->
      <el-form-item :label="$t('reporting.fc_reporting_oneclick_search_type_lable')" prop="reporting_type" :rules="[{ required: true, message: this.handleGlobalI18n('validation', 'reporting_type_null'), trigger: 'change' }]">
        <ed-select>
          <el-select :placeholder="$t('reporting.fc_reporting_oneclick_search_type_input_lable')" class="width-280" clearable v-model="form.reporting_type">
            <el-option :key="index" :label="$t(`reporting.${item.item}`)" :value="item.value" v-for="(item, index) in report_type_list" />
          </el-select>
        </ed-select>
      </el-form-item>
      <!--Registration store------------------------------------------------------------------------------------->
      <el-form-item :label="$t('reporting.fc_reporting_oneclick_recruitment_store_lable')" prop="store_code" v-if="form.reporting_type === '1' || form.reporting_type === '2'">
        <registration-store city_id="" :multiple="true" :value="form.store_code" @registration_store = "selectRegistration1" type="store1" class="width-280"/>
      </el-form-item>
      <!--Coupon ----------------------------------------------------------------------------------------------------->
      <el-form-item :label="$t('reporting.fc_reporting_oneclick_coupon_coupon_lable')" prop="coupon_id" v-if="form.reporting_type === '4'">
        <coupon-select
          class="width-280"
          @select-coupon-list = "handleSelectCouponList"
          :multiple="multiple_coupon"
        />
      </el-form-item>
      <!--Redemption event------------------------------------------------------------------------------------------------>
      <el-form-item :label="$t('reporting.fc_reporting_oneclick_redemption_event_lable')" :rules="[{ required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: 'change' }]" prop="redemption_id" v-if="form.reporting_type === '5'">
        <redemption-event-select
          class="width-280"
          @select-redemption-list = "handleSelectRedemptionList"
        />
      </el-form-item>
      <!--Date month---------------------------------------------------------------------------------------------------------->
      <el-form-item label="Date month" :rules="[{ required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: 'change' }]" prop="date_month" v-if="form.reporting_type === '6'">
        <el-date-picker
          popper-class="ed-date-picker"
          v-model="form.date_month"
          type="monthrange"
          format="MM/yyyy"
          value-format="yyyy-MM"
          :range-separator="$t('member.fc_member_details_campaign_date_to_label')"
          :start-placeholder="$t('reporting.fc_reporting_oneclick_search_date_start_lable')"
          :end-placeholder="$t('reporting.fc_reporting_oneclick_search_date_end_lable')">
        </el-date-picker>
      </el-form-item>
      <!--Date from-->
      <el-form-item :label="$t('reporting.fc_reporting_oneclick_search_date_lable')" prop="date" v-if="form.reporting_type !== '6'" :rules="date_rule()">
        <date-range :value="form.date" @valueDate="valueDateJoin" style="width: 280px;" />
      </el-form-item>
      <template v-if="form.reporting_type === '8' || form.reporting_type === '9' || form.reporting_type === '12' || form.reporting_type === '13' || form.reporting_type === '14' || form.reporting_type === '15' || form.reporting_type === '16' || form.reporting_type === '21'">
        <!--Registration channel-->
        <el-form-item :label="$t('reporting.fc_reporting_oneclick_search_channel_lable')" prop="registration_channel">
          <registration-channel :value="form.registration_id" @registration_channel = "selectRegistration1" class="width-280"/>
        </el-form-item>
        <template v-if="form.channel_code === 'POS'">
          <!--Registration region-->
          <el-form-item :label="$t('reporting.fc_reporting_oneclick_search_channel_pos_region_lable')" prop="registration_region">
            <registration-region :value="form.registration_region" @registration_region = "selectRegistration1" class="width-280"/>
          </el-form-item>
          <!--Registration store-->
          <el-form-item :label="$t('reporting.fc_reporting_oneclick_search_channel_pos_store_lable')" prop="registration_store">
            <registration-store :city_id="form.registration_region" :value="form.registration_store" @registration_store = "selectRegistration1" class="width-280" type="registration_store" />
          </el-form-item>
        </template>
      </template>
      <template v-if="form.reporting_type === '11' ">
        <!--Tier-->
        <el-form-item :label="$t('reporting.fc_reporting_oneclick_search_tier_lable')" prop="date">
          <ed-select>
            <el-select clearable v-model="tier" class="width-280">
              <el-option :key="index" :label="item.member_tier_name" :value="item.member_tier_id" v-for="(item, index) in tier_list" />
            </el-select>
          </ed-select>
        </el-form-item>
      </template>
      <!--Tier-->
      <template v-if="form.reporting_type === '18' || form.reporting_type === '17'">
        <el-form-item :label="$t('reporting.fc_reporting_oneclick_search_tier_lable')" prop="date">
          <ed-select>
            <el-select clearable v-model="tier" class="width-280">
              <el-option :key="index" :label="item.member_tier_name" :value="item.member_tier_code" v-for="(item, index) in tier_list" />
            </el-select>
          </ed-select>
        </el-form-item>
      </template>
      <!--Multiple channel-->
      <template v-if="form.reporting_type === '19' || form.reporting_type === '20'">
        <el-form-item :label="$t('reporting.fc_reporting_oneclick_search_channel_lable')" prop="registration_channel">
          <registration-channel-multiple @registration_channel="selectRegistration1" />
        </el-form-item>
      </template>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-form-item label=" ">
            <!--reset-->
            <el-button @click="reset" class="reset-button">{{$t('reporting.fc_reporting_oneclick_btn_reset_lable')}}</el-button>
            <!--search-->
            <el-button @click="submitForm" class="search-button" type="primary">{{$t('reporting.fc_reporting_oneclick_btn_search_lable')}}</el-button>
            <!--export-->
            <el-button :class="{'no_table_data' : !export_button_state}" :disabled="!export_button_state" :loading="downloadLoading" @click="handleExport" class="export-button" icon="el-icon-download" type="primary">{{$t('reporting.fc_reporting_oneclick_btn_export_lable')}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--Search result-->
    <!--<h5>{{$t('reporting.fc_reporting_oneclick_search_result_lable')}}</h5>-->
    <!--point report-->
    <bhg-point-report @handleExportButton="handleExportButton" ref="bhg-point-report-6" v-if="form.reporting_type === '6'" />
    <!--transaction report-->
    <bhg-transaction-report @handleExportButton="handleExportButton" ref="bhg-transaction-report-7" v-else-if="form.reporting_type === '7'" />
    <!--Members Recruitment-->
    <members-recruitment @handleExportButton="handleExportButton" ref="members-recruitment-report-8" v-else-if="form.reporting_type === '8'" />
    <!--New Members-->
    <new-members @handleExportButton="handleExportButton" ref="new-members-9" v-else-if="form.reporting_type === '9'" />
    <!--Association report-->
    <association-report10 @handleExportButton="handleExportButton" ref="association-report-10" v-else-if="form.reporting_type === '10'" />
    <!--Member tier-->
    <member-tier11 @handleExportButton="handleExportButton" ref="member-tier-11" v-else-if="form.reporting_type === '11'" />
    <!--Member sales ranking-->
    <member-sales-rank @handleExportButton="handleExportButton" ref="member-sales-rank-12" v-else-if="form.reporting_type === '12'"  />
    <!--sales-->
    <sales13 @handleExportButton="handleExportButton" ref="sales_13" v-else-if="form.reporting_type === '13'" />
    <!--transaction-->
    <transaction14 @handleExportButton="handleExportButton" ref="transactions_14" v-else-if="form.reporting_type === '14'" />
    <!--Member Sales-->
    <member-sales15 @handleExportButton="handleExportButton" ref="member_sales_15" v-else-if="form.reporting_type === '15'" />
    <!--Member Transaction -->
    <member-transaction16 @handleExportButton="handleExportButton" ref="member_transaction_16" v-else-if="form.reporting_type === '16'" />
    <!--Member Sales Tier-->
    <member-sales-tier17 @handleExportButton="handleExportButton" ref="member_sales_tier_17" v-else-if="form.reporting_type === '17'" />
    <!--Member Transaction Tier-->
    <member-transaction-tier18 @handleExportButton="handleExportButton" ref="member_transactions_tier_18" v-else-if="form.reporting_type === '18'" />
    <!--Channel sales-->
    <channel-sales19 @handleExportButton="handleExportButton" ref="channel_sales_19" v-else-if="form.reporting_type === '19'" />
    <!--Channel transaction-->
    <channel-transaction20 @handleExportButton="handleExportButton" ref="channel_transactions_20" v-else-if="form.reporting_type === '20'" />
    <!--Top50 SKU Contribution-->
    <sku-contribution21 @handleExportButton="handleExportButton" ref="sku_contribution_21" v-else-if="form.reporting_type === '21'" />
    <!--Points liability - Tier-->
    <point-liability-tier22 @handleExportButton="handleExportButton" ref="point_liability_tier_22" v-else-if="form.reporting_type === '22'" />
    <!--Tier upgrade-->
    <tier-upgrade23 @handleExportButton="handleExportButton" ref="tier_upgrade_23" v-else-if="form.reporting_type === '23'" />
    <!--Tier upgrade rate-->
    <tier-upgrade-rate24 @handleExportButton="handleExportButton" ref="tier_upgrade_24" v-else-if="form.reporting_type === '24'" />
    <!--Tier downgrade-->
    <tier-downgrade25 @handleExportButton="handleExportButton" ref="tier_downgrade_25" v-else-if="form.reporting_type === '25'" />
    <!--Tier downgrade rate -->
    <tier-downgrade-rate26 @handleExportButton="handleExportButton" ref="tier_downgrade_26" v-else-if="form.reporting_type === '26'" />
    <!--Point Issuance by type -->
    <point-issuance-by-type27 @handleExportButton="handleExportButton" ref="point_issuance_by_type_27" v-else-if="form.reporting_type === '27'" />
  </div>
</template>
<script>
  import RegistrationChannelMultiple from './registration-channel-multiple'
  import RegistrationChannel from './registration-channel'
  import RegistrationRegion from './registration-region'
  import RegistrationStore from './registration-store'
  import DateRange from '@/components/EldatePickerNew'
  import StoreList from './store'
  import PaginationContainer from '@/components/PaginationContainer'
  import CouponSelect from './select-coupon'
  import RedemptionEventSelect from './select-redemption-event'
  import { DateTime } from 'luxon'
  import { reportDataSource, isBHGLoginUser, transformMonth, isBrotzeit19User } from '@/utils'
  import BhgPointReport from './BHGPointReport6'
  import BhgTransactionReport from './BHGTransactionReport7'
  import MembersRecruitment from './MembersRecuitment8'
  import NewMembers from './NewMembers9'
  import AssociationReport10 from './AssociationReport10'
  import MemberTier11 from './MemberTier11'
  import MemberSalesRank from './MemberSalesRanking12'
  import { getTierListMixin } from '@/views/data/tier-list'
  import Sales13 from './Sales13'
  import Transaction14 from './Transaction14'
  import MemberSales15 from './MemberSales15'
  import MemberTransaction16 from './MemberTransaction16'
  import MemberSalesTier17 from './MemberSalesTier17'
  import MemberTransactionTier18 from './MemberTransactionTier18'
  import ChannelSales19 from './ChannelSales19'
  import ChannelTransaction20 from './ChannelTransaction20'
  import SkuContribution21 from './SkuContribution21'
  import PointLiabilityTier22 from './PointLiabilityTier22'
  import TierUpgrade23 from './TierUpgrade23'
  import TierUpgradeRate24 from './TierUpgradeRate24'
  import TierDowngrade25 from './TierDowngrade25'
  import TierDowngradeRate26 from './TierDowngradeRate26'
  import PointIssuanceByType27 from './PointIssuanceByType27'
  export default {
    mixins: [getTierListMixin],
    components: {
      PointIssuanceByType27,
      RegistrationChannelMultiple,
      ChannelTransaction20,
      SkuContribution21,
      ChannelSales19,
      MemberTransactionTier18,
      MemberSalesTier17,
      MemberTransaction16,
      MemberSales15,
      Transaction14,
      Sales13,
      MemberSalesRank,
      MemberTier11,
      RegistrationStore,
      RegistrationRegion,
      RegistrationChannel,
      BhgTransactionReport,
      BhgPointReport,
      MembersRecruitment,
      NewMembers,
      DateRange,
      StoreList,
      PaginationContainer,
      CouponSelect,
      RedemptionEventSelect,
      AssociationReport10,
      PointLiabilityTier22,
      TierUpgrade23,
      TierUpgradeRate24,
      TierDowngrade25,
      TierDowngradeRate26
    },
    data() {
      return {
        export_button_state: false,
        tier: '',
        value1: '',
        date_rule: function() {
          if (this.form.reporting_type !== '5' && this.form.reporting_type !== '27' && this.form.reporting_type !== '') {
            return [{ required: true, message: this.handleGlobalI18n('validation', 'report_select_date_null'), trigger: ['blur'] }]
          }
        },
        report_type_list: [
          { name: 'members_recuitment', value: '8', item: 'fc_reporting_oneclick_search_type_menu1_lable' },
          { name: 'new_members', value: '9', item: 'fc_reporting_oneclick_search_type_menu2_lable' },
          { name: 'member_tier', value: '11', item: 'fc_reporting_oneclick_search_type_menu3_lable' },
          { name: 'member_sales_ranking', value: '12', item: 'fc_reporting_oneclick_search_type_menu4_lable' },
          { name: 'sales_13', value: '13', item: 'fc_reporting_oneclick_search_type_menu5_lable' },
          { name: 'transactions_14', value: '14', item: 'fc_reporting_oneclick_search_type_menu6_lable' },
          { name: 'member_sales_15', value: '15', item: 'fc_reporting_oneclick_search_type_menu7_lable' },
          { name: 'member_transaction_16', value: '16', item: 'fc_reporting_oneclick_search_type_menu8_lable' },
          { name: 'member_sales_tier_17', value: '17', item: 'fc_reporting_oneclick_search_type_menu9_lable' },
          { name: 'member_transactions_tier_18', value: '18', item: 'fc_reporting_oneclick_search_type_menu10_lable' },
          { name: 'channel_sales_19', value: '19', item: 'fc_reporting_oneclick_search_type_menu11_lable' },
          { name: 'channel_transactions_20', value: '20', item: 'fc_reporting_oneclick_search_type_menu12_lable' },
          { name: 'sku_contribution_21', value: '21', item: 'fc_reporting_oneclick_search_type_menu13_lable' },
          { name: 'point_issuance_by_type_27', value: '27', item: 'fc_reporting_oneclick_search_type_menu14_lable' },
          { name: 'point_liability_tier_22', value: '22', item: 'fc_reporting_oneclick_search_type_menu15_lable' },
          { name: 'tier_upgrade_23', value: '23', item: 'fc_reporting_oneclick_search_type_menu16_lable' },
          { name: 'tier_upgrade_24', value: '24', item: 'fc_reporting_oneclick_search_type_menu17_lable' },
          { name: 'tier_downgrade_25', value: '25', item: 'fc_reporting_oneclick_search_type_menu18_lable' },
          { name: 'tier_downgrade_26', value: '26', item: 'fc_reporting_oneclick_search_type_menu19_lable' }
        ],
        /* 当用户是BHG的时候显示 */
        bhg_report_type_list: [
          { name: 'point_report', value: '6', item: 'fc_reporting_bhg_point_report' },
          { name: 'transaction_report', value: '7', item: 'fc_reporting_bhg_transaction_report' }
        ],
        multiple_coupon: true,
        downloadLoading: false,
        loading: false,
        from_date: '',
        to_date: '',
        form: {
          reporting_type: '',
          date: [],
          date_month: '',
          store_code: '',
          coupon_id: [],
          redemption_id: '',
          generate_time: '',
          registration_channel: '',
          channel_code: '',
          registration_region: '',
          registration_store: '',
          registration_channel_multiple: ''
        },
        postfix: ''
      }
    },
    created() {
      if (this.isBHGLoginUser()) {
        this.report_type_list = this.bhg_report_type_list
      } else {
        // 判断是否登录用户是 UATBrotzeit19 或者 Brotzeit19
        if (isBrotzeit19User()) {
          this.report_type_list = this.report_type_list.concat([{ name: 'association_report', value: '10', item: 'fc_reporting_brotzeit_association_report' }])
        }
      }
    },
    watch: {
      'form.registration_region': {
        handler(val) {
          this.form.registration_store = ''
        }
      },
      'form.reporting_type': {
        handler(val) {
          this.export_button_state = false
          this.form.date = []
          this.to_date = ''
          this.form.store_code = ''
          this.form.store_code = ''
          this.form.coupon_id = []
          this.form.redemption_id = ''
          this.form.date_month = ''
          this.form.channel_code = ''
          this.form.registration_channel = ''
          this.form.registration_store = ''
          this.tier = ''
          this.form.registration_region = ''
          this.form.registration_id = ''
          this.form.registration_channel_multiple = ''
          this.$refs['form'].clearValidate()
        }
      }
    },
    methods: {
      handleExportButton(val) {
        this.export_button_state = val
      },
      transformMonth,
      reportDataSource,
      isBHGLoginUser,
      selectRegistration1(obj) {
        if (obj.type === 'region') {
          this.form.registration_region = obj.value
        } else if (obj.type === 'registration_store') {
          this.form.registration_store = obj.value
        } else if (obj.type === 'store1') {
          this.form.store_code = obj.value
        } else if (obj.type === 'registration_channel_multiple') {
          this.form.registration_channel_multiple = obj.channel
        } else {
          this.form.registration_channel = obj.channel
          this.form.channel_code = obj.channel_code
          this.form.registration_id = obj.id
        }
      },
      handleSelectRedemptionList(val) {
        this.form.redemption_id = val
      },
      handleSelectCouponList(val) {
        this.form.coupon_id = val
      },
      handleExport() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            switch (this.form.reporting_type) {
              case '6':
                this.$refs['bhg-point-report-6'].exportBHGPointReport()
                break
              case '7':
                this.$refs['bhg-transaction-report-7'].exportBHGTransactionReport()
                break
              case '8':
                this.$refs['members-recruitment-report-8'].exportMemberRecruitmentReport()
                break
              case '9':
                this.$refs['new-members-9'].exportNewMembersReport()
                break
              case '10':
                this.$refs['association-report-10'].exportData({ from: this.from_date ? `${(this.from_date)}T00:00:00.000${this.postfix}` : '', to: this.to_date ? `${(this.to_date)}T23:59:59.999${this.postfix}` : '' })
                break
              case '11':
                this.$refs['member-tier-11'].exportMemberTierReport()
                break
              case '12':
                this.$refs['member-sales-rank-12'].exportMemberSalesRankingReport()
                break
              case '13':
                this.$refs['sales_13'].exportSalesReport()
                break
              case '14':
                this.$refs['transactions_14'].exportTransactionReport()
                break
              case '15':
                this.$refs['member_sales_15'].exportMemberSalesReport()
                break
              case '16':
                this.$refs['member_transaction_16'].exportMemberTransactionReport()
                break
              case '17':
                this.$refs['member_sales_tier_17'].exportMemberSalesTierReport()
                break
              case '18':
                this.$refs['member_transactions_tier_18'].exportMemberTransactionTierReport()
                break
              case '19':
                this.$refs['channel_sales_19'].exportChannelSalesReport()
                break
              case '20':
                this.$refs['channel_transactions_20'].exportChannelTransactionReport()
                break
              case '21':
                this.$refs['sku_contribution_21'].exportSkuContributionReport()
                break
              case '22':
                this.$refs['point_liability_tier_22'].exportPointLiabilityTierReport()
                break
              case '23':
                this.$refs['tier_upgrade_23'].export()
                break
              case '24':
                this.$refs['tier_upgrade_24'].export()
                break
              case '25':
                this.$refs['tier_downgrade_25'].export()
                break
              case '26':
                this.$refs['tier_downgrade_26'].export()
                break
              case '27':
                this.$refs['point_issuance_by_type_27'].export()
                break
            }
          } else {
            return false
          }
        })
      },
      // 重置
      reset() {
        this.$refs['form'].resetFields()
      },
      selectRegistration(obj) {
        this.form.store_code = obj.value
      },
      // 设置当前时区
      setDateTime() {
        this.form.generate_time = DateTime.local().toISO()
        const nowDateLength = this.form.generate_time.length
        this.postfix = this.form.generate_time.substring(nowDateLength - 6, nowDateLength)
      },
      // 点击搜索
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.setDateTime()
            var source = this.reportDataSource()
            // const date_params = {
            //   start_date: `${(this.from_date)}T00:00:00.000${this.postfix}`,
            //   end_date: `${(this.to_date)}T23:59:59.999${this.postfix}`
            // }
            // const form_data = {
            //   from_date: this.from_date ? `${(this.from_date)}T00:00:00.000${this.postfix}` : '',
            //   to_date: this.to_date ? `${(this.to_date)}T23:59:59.999${this.postfix}` : ''
            // }
            const date_params1 = {
              start_date: typeof this.from_date === 'string' ? `${(this.from_date)}` : '',
              end_date: typeof this.to_date === 'string' ? `${(this.to_date)}` : ''
            }
            const params2 = {
              from: this.from_date ? `${(this.from_date)}T00:00:00.000${this.postfix}` : '',
              to: this.to_date ? `${(this.to_date)}T23:59:59.999${this.postfix}` : ''
            }
            const params_data = { channel_code: this.form.channel_code, channel_id: this.form.registration_channel, region_id: (this.form.channel_code !== 'POS' || this.form.channel_code === '') ? null : this.form.registration_region, store_id: (this.form.channel_code !== 'POS' || this.form.channel_code === '') ? null : this.form.registration_store, ...date_params1 }
            switch (this.form.reporting_type) {
              case '6':
                this.$refs['bhg-point-report-6'].handleClickPointReport({ 'from_date': this.form.date_month[0], 'to_date': this.form.date_month[1] })
                break
              case '7':
                this.$refs['bhg-transaction-report-7'].handleClickTransactionReport({ from_date: this.from_date ? `${(this.from_date)}` : '', to_date: this.to_date ? `${(this.to_date)}` : '' })
                break
              case '8':
                this.$refs['members-recruitment-report-8'].handleClickGetMembersRecruitment({ channel_code: this.form.channel_code, channel_id: this.form.registration_channel, region_id: (this.form.channel_code !== 'POS' || this.form.channel_code === '') ? null : this.form.registration_region, store_id: (this.form.channel_code !== 'POS' || this.form.channel_code === '') ? null : this.form.registration_store, ...date_params1 }, date_params1, source)
                break
              case '9':
                this.$refs['new-members-9'].handleClickGetNewMembers({ channel_code: this.form.channel_code, channel_id: this.form.registration_channel, region_id: (this.form.channel_code !== 'POS' || this.form.channel_code === '') ? null : this.form.registration_region, store_id: (this.form.channel_code !== 'POS' || this.form.channel_code === '') ? null : this.form.registration_store, ...date_params1 }, date_params1, source)
                break
              case '10':
                this.$refs['association-report-10'].handleMemberCouponReport(params2)
                break
              case '11':
                this.$refs['member-tier-11'].handleClickGetMemberTier({ tier_id: this.tier, ...date_params1 }, source)
                break
              case '12':
                this.$refs['member-sales-rank-12'].handleClickGetMemberSalesRank({ channel_code: this.form.channel_code, channel_id: this.form.registration_channel, region_id: (this.form.channel_code !== 'POS' || this.form.channel_code === '') ? null : this.form.registration_region, store_id: (this.form.channel_code !== 'POS' || this.form.channel_code === '') ? null : this.form.registration_store, ...date_params1 }, date_params1, source)
                break
              case '13':
                this.$refs['sales_13'].handleClickGetSales(params_data, source)
                break
              case '14':
                this.$refs['transactions_14'].handleClickGetTransaction(params_data, source)
                break
              case '15':
                this.$refs['member_sales_15'].handleClickGetMemberSales(params_data, source)
                break
              case '16':
                this.$refs['member_transaction_16'].handleClickGetMemberTransaction(params_data, source)
                break
              case '17':
                this.$refs['member_sales_tier_17'].handleClickGetMemberSalesTier({ ...date_params1, tier_code: this.tier }, source)
                break
              case '18':
                this.$refs['member_transactions_tier_18'].handleClickGetMemberTransactionTier({ ...date_params1, tier_code: this.tier }, source)
                break
              case '19':
                this.$refs['channel_sales_19'].handleClickChannelSales({ ...date_params1, channel_ids: this.form.registration_channel_multiple }, source)
                break
              case '20':
                this.$refs['channel_transactions_20'].handleClickChannelTransaction({ ...date_params1, channel_ids: this.form.registration_channel_multiple }, source)
                break
              case '21':
                this.$refs['sku_contribution_21'].handleClickSkuContribution(params_data, source)
                break
              case '22':
                this.$refs['point_liability_tier_22'].handleClickPointLiabilityTier(date_params1, source)
                break
              case '23':
                this.$refs['tier_upgrade_23'].handleClick(date_params1, source)
                break
              case '24':
                this.$refs['tier_upgrade_24'].handleClick(date_params1, source)
                break
              case '25':
                this.$refs['tier_downgrade_25'].handleClick(date_params1, source)
                break
              case '26':
                this.$refs['tier_downgrade_26'].handleClick(date_params1, source)
                break
              case '27':
                this.$refs['point_issuance_by_type_27'].handleClick(date_params1, source)
                break
            }
          } else {
            return false
          }
        })
      },
      valueDateJoin(val) {
        if (val === null) {
          this.form.date = []
          this.from_date = ''
          this.to_date = ''
        } else {
          this.form.date = val;
          [this.from_date, this.to_date] = this.form.date || ['', '']
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .ed-form{
    /deep/ .el-form-item__label{
      font-size: 16px !important;
      font-weight: bold !important;
      color: #333333;
      font-family: HelveticaNeue1-Bold;
    }
    /deep/ .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before{
      color: rgba(51,51,51,1);
    }
  }
  .reporting {
    margin: 25px;
    .reset-button{
      background-color: #ffffff;
      color: $new-primary;
      min-width:88px;
      height:36px;
      border-radius:4px;
      border-color: $new-primary;
      &:hover{
        color: $new-primary;
      }
    }
    .export-button, .search-button{
      min-width:88px;
      background: $new-primary;
      border-color: $new-primary;
      border-radius:4px;
    }
    /deep/ .el-range-editor.is-active {
      border-color: $new-primary
    }
    .label-name {
      font-size: 14px;
      color: red;
    }
    .width-250{
      width: 250px!important;
    }
    .width-280{
      width: 280px!important;
    }
    .el-form {
      margin-top: 20px;
      padding-top: 20px;
    }
    h5 {
      line-height: 3;
    }
  }
  $export_disabled_color: #cccccc;
  .no_table_data{
    background-color: $export_disabled_color!important;
    border-color: $export_disabled_color!important;
    &:hover{
      background-color: $export_disabled_color!important;
    }
  }
</style>
