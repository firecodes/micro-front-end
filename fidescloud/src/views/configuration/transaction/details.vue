<template>
  <div class="detailPage">
    <div class="top-header">
      <el-button @click="() => this.$router.push('/configuration/transaction')">{{$t('loyalty.fc_operation_btn_back_label')}}</el-button>
    </div>
    <ed-header-title :title="$t('configuration.fc_transaction_details_order_section_title')"></ed-header-title>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" class="ruleForm" v-loading="loading">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_code_label')" prop="transaction_code">
            <span>{{ruleForm.transaction_code | placeholder}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_type_label')" prop="transaction_type">
            <span>{{ruleForm.transaction_type | placeholder}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_channel_label')" prop="channel_name">
            <span>{{ruleForm.channel_resources_key ? $t(`reporting.${ruleForm.channel_resources_key}`) : ruleForm.channel_name ? ruleForm.channel_name : '-'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_time_label')" prop="transaction_time">
            <span>{{ruleForm.transaction_time | formatTimeStamp('DD/MM/YYYY HH:mm')}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_method_label')" prop="paymentMethod">
            <span>{{ruleForm.payment_method | placeholder}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_payment_label')" prop="payment">
            <span>{{ruleForm.payment === '' || ruleForm.payment === null ? '-' : globalData.value.currency_symbol + ruleForm.payment}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="ruleForm.member_name">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_name_label')" prop="member_name">
            <a class="color-link" :href="hrefsSkip('/member/member-view/member-details/', ruleForm.member_code)" target="_blank" v-if="ruleForm.member_name">{{ruleForm.member_name}}</a>
            <span v-if="!ruleForm.member_name">{{'-'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_store_label')" prop="store_name">
            <a class="color-link" :href="hrefStore('/configuration/store/list/details/', ruleForm.store_id)" target="_blank" v-if="ruleForm.store_name">{{ruleForm.store_name}}</a>
            <span v-if="!ruleForm.store_name">{{'-'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="!ruleForm.is_online">
          <el-form-item :label="$t('configuration.fc_transaction_details_order_assistant_label')" prop="storeAssistant">
            <a class="color-link" :href="hrefAssisant('/configuration/employee/list/detail/', ruleForm.employee_id)" target="_blank" v-if="ruleForm.employee_name">{{ruleForm.employee_name}}</a>
            <span v-if="!ruleForm.employee_name">{{'-'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ed-header-title :title="$t('configuration.fc_transaction_details_product_section_title')"></ed-header-title>
    <div class="prodinfo" v-loading="loading">
      <el-row :gutter="110"  v-if="(Object.keys(ruleForm)).length">
        <el-col :span="6" v-for="item in ruleForm.products" :key="item.product_id">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="item.image" class="image" />
            <div style="padding: 14px;">
              <p>{{item.product_name}}</p>
              <p>{{item.product_code}}</p>
              <p><span>{{item.uint}} {{item.purchase_price === '' || item.purchase_price === null ? '-' : globalData.value.currency_symbol + item.purchase_price}}</span><span>x{{item.quantity}}</span></p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- <ed-header-title title="Payment information"></ed-header-title>
    <pay-list></pay-list> -->
    <div v-if="(Object.keys(ruleForm)).length && ruleForm.relate_list.length" v-loading="loading">
      <div style="margin-bottom: 22px"></div>
      <ed-header-title :title="$t('configuration.fc_transaction_details_related_section_title')"></ed-header-title>
      <order-list :list="ruleForm.relate_list"></order-list>
    </div>
  </div>
</template>

<script>
import EdHeaderTitle from '@/components/Ed-header-title/ed-header-title'
import PayList from './components/paylist'
import OrderList from './components/orderlist'
import { transactionDetail } from './mixins/detail'
export default {
  components: {
    EdHeaderTitle,
    PayList,
    OrderList
  },
  mixins: [transactionDetail],
  created() {
    this.init()
  }
}
</script>

<style lang='scss' scoped>
@import "./styles/details";
</style>