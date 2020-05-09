<template>
  <div class="spot_campaign_what_multiple_point" ref="MultiplePoint">
    <el-form :model="form" :rules="rules" label-width="280px" ref="form_m_p">
      <!--Earn rule-->
      <el-form-item :label="$t('campaign.fc_campaign_spot_create_what_earn_label')" class="spot_campaign_what_multiple_point__earn_rule" required>
        <!--Spend 1 USD to get-->
        <label>{{$t('campaign.fc_campaign_spot_create_what_spend_label', {'USD': globalData.value.currency})}}</label>
        <el-input-number :max="9999999" :min="1" v-model="form.multiple_ratio" />
        <!--points-->
        <label>{{$t('campaign.fc_campaign_spot_create_what_spend_points_label')}}</label>
      </el-form-item>
      <!--Conditions-->
      <el-form-item :label="$t('campaign.fc_campaign_spot_create_what_conditions_label')">
        <div class="list">
          <!--Transaction value-->
          <div class="spot_campaign_what_multiple_point__transaction_value">
            <el-checkbox v-model="form.transaction"></el-checkbox>
            <!--Transaction value -->
            <label>{{$t('campaign.fc_campaign_spot_create_what_value_label')}}</label>
            <el-form-item class="border-bottom-none" prop="purchase_amount_restriction_from">
              <el-input class="margin-27-10" v-model="form.purchase_amount_restriction_from" />
            </el-form-item>
            <label>{{globalData.value.currency}}</label>
            <span>—</span>
            <el-form-item class="border-bottom-none" prop="purchase_amount_restriction_to">
              <el-input class="margin-10" v-model="form.purchase_amount_restriction_to"  />
            </el-form-item>
            <label>{{globalData.value.currency}}</label>
          </div>
          <!--SKU-->
          <div class="spot_campaign_what_multiple_point__select_sku">
            <el-checkbox v-model="form.select_sku"></el-checkbox>
            <!--A specific sku is mandatory-->
            <label>{{$t('campaign.fc_campaign_spot_create_what_sku_label')}}</label>
            <select-sku-dialog :value_list="table_data" @selectSkuData="selectSkuData" />
            <div style="width: 480px">
              <el-table :data="show_table_data" :empty-text="$t('campaign.fc_campaign_spot_create_what_sku_table_nodate_label')" :loading="table_loading" border style="width: 480px">
                <!--SKU code-->
                <el-table-column :label="$t('campaign.fc_campaign_spot_create_what_sku_table_code_label')" align="center" prop="product_code" >
                  <template slot-scope="scope">
                    <ed-clamp :max-lines="1" autoresize>{{scope.row.product_code || table_placeholder}}</ed-clamp>
                  </template>
                </el-table-column>
                <!--SKU name-->
                <el-table-column :label="$t('campaign.fc_campaign_spot_create_what_sku_table_name_label')" align="center" prop="product_name" >
                  <template slot-scope="scope">
                    <ed-clamp :max-lines="1" autoresize>{{scope.row.product_name || table_placeholder}}</ed-clamp>
                  </template>
                </el-table-column>
                <!--SKU category-->
                <el-table-column :label="$t('campaign.fc_campaign_spot_create_what_sku_table_category_label')" align="center" prop="product_category_name">
                  <template slot-scope="scope">
                    <ed-clamp :max-lines="1" autoresize>{{scope.row.product_category_name || table_placeholder}}</ed-clamp>
                  </template>
                </el-table-column>
                <!--SKU unit-->
                <el-table-column :label="$t('campaign.fc_campaign_spot_create_what_sku_table_unit_label')" align="center" prop="unit_price">
                  <template slot-scope="scope">
                    <ed-clamp :max-lines="1" autoresize>{{scope.row.unit_price || table_placeholder}}</ed-clamp>
                  </template>
                </el-table-column>
              </el-table>
              <pagination-container
              :page = "list_query.page_no"
              :page_size = 'list_query.page_size'
              :total = 'list_query.total'
              @handleCurrentChange = "handleCurrentChange"
              layout="total, prev, pager, next, jumper"
              v-if="list_query.total > 0"
            ></pagination-container>
            </div>
          </div>
          <!--Participant limit 参与限制-->
          <div class="spot_campaign_what_multiple_point__participant_limit">
            <el-checkbox v-model="form.participant_limit" />
            <!--Participant limit-->
            <label>{{$t('campaign.fc_campaign_spot_create_what_participation_limit_label')}}</label>
            <el-input-number :max="9999999" :min="0" :precision="0" v-model="form.participant_limited_times" />
            <!--maximum times of member participation-->
            <label>{{$t('campaign.fc_campaign_spot_create_what_participant_limit_maximum_label')}}</label>
          </div>
        </div>
      </el-form-item>
      <!--Limit point-->
      <el-form-item label=" ">
      <div class="limit-point">
        <el-checkbox v-model="form.limit_point" />
        <!--Limit total point-->
        <label>{{$t('campaign.fc_campaign_spot_create_what_point_limit_label')}}</label>
        <el-input-number :max="9999999" :min="0" :precision="0" v-model="form.limit_point_value" />
        <!--points-->
        <label>{{$t('campaign.fc_campaign_spot_create_what_point_content_label')}}</label>
      </div>
    </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import SelectSkuDialog from './select-sku'
  export default {
    props: {
      reward: {
        default: Object
      }
    },
    components: {
      SelectSkuDialog,
      PaginationContainer
    },
    data() {
      return {
        list_query: {
          page_no: 1,
          page_size: 3,
          total: 0
        },
        rules: {
          // purchase_amount_restriction_from: [{ validator: this.handlePurchaseAmountRestrictionFrom, trigger: 'change' }],
          // purchase_amount_restriction_to: [{ validator: this.handlePurchaseAmountRestrictionTo, trigger: 'change' }]
        },
        table_data: [],
        show_table_data: [],
        table_loading: false,
        form: {
          multiple_ratio: null,
          limit_point: false,
          limit_point_value: 0,
          participant_limited_times: 0,
          participant_limit: false,
          select_sku: false,
          transaction: false,
          purchase_amount_restriction_from: 0,
          purchase_amount_restriction_to: 0
        }
      }
    },
    watch: {
      table_data() {
        this.list_query.total = this.table_data.length
        this.list_query.page_no = 1
        this.show_table_data = this.table_data.slice(0, this.list_query.page_size)
      }
    },
    created() {
      this.init()
    },
    methods: {
      handleCurrentChange(value) {
        this.list_query.page_no = value
        this.show_table_data = this.table_data.slice((this.list_query.page_no - 1) * this.list_query.page_size, this.list_query.page_no === 1 ? this.list_query.page_size : this.list_query.page_no * this.list_query.page_size)
      },
      init() {
        if (this.reward) {
          this.form = {
            multiple_ratio: this.reward.reward_point.multiple_ratio || 1,
            limit_point: Boolean(this.reward.reward_point.limit_total_points) || false,
            limit_point_value: this.reward.reward_point.limit_total_points || 0,
            participant_limited_times: this.reward.participant_limited_times || 0,
            participant_limit: Boolean(this.reward.participant_limited_times) || false,
            select_sku: Boolean(this.reward.purchase_product_limits && this.reward.purchase_product_limits.length > 0) || false,
            transaction: Boolean(this.reward.purchase_amount_restriction_from) || false,
            purchase_amount_restriction_from: this.reward.purchase_amount_restriction_from || 0,
            purchase_amount_restriction_to: this.reward.purchase_amount_restriction_to || 0
          }
          // sku
          if (this.form.select_sku) {
            // product_category_name unit_price
            if (this.reward.purchase_product_limits.length) {
              for (var item of this.reward.purchase_product_limits) {
                this.table_data.push(Object.assign({}, item, {
                  product_category_name: item.product_category,
                  unit_price: item.product_unit
                }))
              }
            }
            // this.table_data = this.reward.purchase_product_limits || []
          }
        }
      },
      handlePurchaseAmountRestrictionFrom(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.purchase_amount_restriction_to))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.purchase_amount_restriction_to) {
          this.$refs['purchase_amount_restriction_to'].resetField()
        }
        if (value === null && this.form.purchase_amount_restriction_to === null) {
          callback()
          return true
        }
        if (typeof this.form.purchase_amount_restriction_to === 'number' && typeof value === 'number' && value > this.form.purchase_amount_restriction_to) {
          callback(new Error('from value cannot be larger than to value !'))
          return true
        }
        callback()
      },
      handlePurchaseAmountRestrictionTo(rule, value, callback) {
        if ((typeof value === 'string' && value) || (typeof value === 'number' && value < 0) || ((typeof value === 'string' && value === '' && this.form.purchase_amount_restriction_from))) {
          callback(new Error('Please enter the correct value'))
          return true
        }
        if (!value && !this.form.purchase_amount_restriction_from) {
          this.$refs['purchase_amount_restriction_from'].resetField()
        }
        if (value === null && this.form.purchase_amount_restriction_from === null) {
          callback()
          return true
        }
        if (typeof this.form.purchase_amount_restriction_from === 'number' && typeof value === 'number' && value < this.form.purchase_amount_restriction_from) {
          callback(new Error('to value cannot be smaller than from value !'))
          return true
        }
        callback()
      },
      selectSkuData(arr) {
        this.table_data = arr
      },
      saveData() {
        // 处理sku
        var sku_list_data = []
        if (this.form.select_sku) {
          for (var item of this.table_data) {
            sku_list_data.push({
              product_code: item.product_code,
              product_name: item.product_name,
              product_category: item.product_category_name,
              product_unit: item.unit_price
            })
          }
        }
        var obj = {
          participant_limited_times: this.form.participant_limit ? this.form.participant_limited_times : 0,
          purchase_amount_restriction_from: this.form.transaction ? this.form.purchase_amount_restriction_from : null,
          purchase_amount_restriction_to: this.form.transaction ? this.form.purchase_amount_restriction_to : null,
          purchase_product_limits: this.form.select_sku ? sku_list_data : null,
          reward_point: {
            multiple_ratio: this.form.multiple_ratio,
            fixed_point: null,
            limit_total_points: this.form.limit_point ? this.form.limit_point_value : null,
            point_type: null,
            effective_date: null,
            expired_date: null,
            expired_type: null,
            expired_value: null
          }
        }
        return obj
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign_what_multiple_point{
    .border-bottom-none{
      border-bottom: none!important;
    }
    label{
      font-size:14px;
      font-family: HelveticaNeue1;
      color:rgba(51,51,51,1);
    }
    .el-checkbox{
      margin-right: 10px;
    }
    .el-input-number{
      margin: 0 10px;
    }
    &__transaction_value{
      display: flex;
      align-items: center;
      .el-input{
        width: 100px;
      }
      .margin-27-10{
        margin: 0 10px 0 27px;
      }
      .margin-10{
        margin: 0 10px;
      }
      span{
        margin-left: 10px;
      }
    }
    &__select_sku{
      margin-top: 30px;
      .el-table{
        margin-top: 22px;
      }
    }
    &__participant_limit{
      margin-top: 30px;
      margin-bottom: 15px;
    }
    /deep/ .el-checkbox__inner{
      width: 20px;
      height: 20px;
      &:after{
        top: 1.8px;
        height: 10px;
        left: 6px;
        width: 5px;
      }
    }
    /deep/ .el-table th.is-leaf {
      font-size: 14px;
      font-family: Helvetica-medium-1;
      color: rgba(51,51,51,1);
      line-height: 16px;
      border-right: none;
    }
    /deep/ .el-table tr{
      color: #666666;
      font-family: Helvetica-medium-1;
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td{
      background-color: #ffffff;
    }
    /deep/ .el-table--border td{
      border-right: none;
    }
    /deep/ .el-table__header {
      background-color: #f5f7fa;
    }
  }
</style>
