<template>
  <div class="coupon" v-loading = "loading">
    <!--查询条件-->
    <div class="check">
      <div class="margin">
        <el-form >
          <el-row>
            <!--Date from-->
            <el-col :span="10">
              <div class="date-from">
                <el-form-item :label="$t('member.fc_member_details_loyalty_coupon_date_label')">
                  <eldate-picker :value="date" @valueDate="valueDate" />
                </el-form-item>
              </div>
            </el-col>
            <!--Status-->
            <el-col :span="7">
              <div class="status-select">
                <el-form-item :label="$t('member.fc_member_details_loyalty_coupon_status_label')">
                  <el-select v-model="status" clearable :placeholder="$t('member.fc_member_details_loyalty_coupon_status_input_label')">
                    <el-option :label="$t('member.fc_member_details_loyalty_coupon_status_menu1_label')" value="0" />
                    <el-option :label="$t('member.fc_member_details_loyalty_coupon_status_menu2_label')" value="1" />
                    <el-option :label="$t('member.fc_member_details_loyalty_coupon_status_menu3_label')" value="2" />
                    <el-option :label="$t('member.fc_member_details_loyalty_coupon_status_menu4_label')" value="3" />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="button">
                <el-button type="primary" @click="search">{{$t('member.fc_member_details_loyalty_coupon_btn_search_label')}}</el-button>
                <el-button @click="resetForm1">{{$t('member.fc_member_details_loyalty_coupon_btn_reset_label')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <p class="query_result">{{$t('member.fc_member_details_loyalty_coupon_history_label')}}</p>
    <!--查询结果-->
    <el-table :data="tableData" border :empty-text="$t('member.fc_table_no_data_label')">
      <!--Name-->
      <el-table-column prop="coupon_name" align="center" :label="$t('member.fc_member_details_loyalty_coupon_table_name_label')">
        <template slot-scope="scope">
          {{scope.row.coupon_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Coupon code-->
      <el-table-column prop="coupon_serial_no" align="center" :label="$t('member.fc_member_details_loyalty_coupon_table_code_label')">
        <template slot-scope="scope">
          <div @click="handleView(scope.row.coupon_code)" style="cursor:pointer;color:#0099ff">
            {{scope.row.coupon_code || table_placeholder }}
          </div>
        </template>
      </el-table-column>
      <!--Amount-->
      <el-table-column prop="amount" align="center" :label="$t('member.fc_member_details_loyalty_coupon_table_amount_label')">
        <template slot-scope="scope">
          {{function() {
            if(scope.row.coupon_type_code === 'discount') {
              return (scope.row.amount* 100).toFixed(2) + '%'
            } else if (scope.row.coupon_type_code === 'sku') {
              return table_placeholder
            } else {
              return scope.row.amount
           }
          }() }}
        </template>
      </el-table-column>

      <!-- cn 添加-->
      <el-table-column align="center" label="渠道" prop="register_channel_name" v-if="isCNLoginUser()" />
      <!--------------->
      <!--Product name-->
      <el-table-column prop="product_name" align="center" :label="$t('member.fc_member_details_loyalty_coupon_table_product_label')">
        <template slot-scope="scope">
          {{scope.row.product_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Effective date-->
      <el-table-column prop="effective_date" align="center" :label="$t('member.fc_member_details_loyalty_coupon_table_effective_label\t')">
        <template slot-scope="scope">
          {{ scope.row.effective_date ? globalData.formatDate((scope.row.effective_date).substring(0, 10)) : table_placeholder }}
        </template>
      </el-table-column>
      <!--Expiry date-->
      <el-table-column prop="expired_date" align="center" :label="$t('member.fc_member_details_loyalty_coupon_table_expiry_label')">
        <template slot-scope="scope">
          {{ scope.row.expired_date ? globalData.formatDate((scope.row.expired_date).substring(0, 10)) : table_placeholder }}
        </template>
      </el-table-column>
      <!--Issued date-->
      <el-table-column prop="expired_date" align="center" :label="$t('member.fc_member_details_loyalty_coupon_table_issue_label')">
        <template slot-scope="scope">
          {{ scope.row.expired_date ? globalData.formatDate((scope.row.generate_date).substring(0, 10)) : table_placeholder }}
        </template>
      </el-table-column>
      <!--Status-->
      <el-table-column prop="status" align="center" :label="$t('member.fc_member_details_loyalty_coupon_table_status_label\t')">
        <template slot-scope="scope">
          {{scope.row.status | handleStatus }}
        </template>
      </el-table-column>
     </el-table>
    <!--分页-->
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <!--显示详情-->
    <ed-dialog>
      <!--Coupon detail-->
      <el-dialog :title="$t('member.fc_member_details_loyalty_coupon_detail_title_label')" :visible.sync="dialogFormVisible" width="700px" >
        <el-form :model="form" disabled label-width="180px" ref="addCoupon" v-loading="dialog_loading">
          <!--Coupon code-->
          <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_coupon_code')">
            <el-input class="width200" v-model="form.coupon_code" />
          </el-form-item>
          <!--Coupon name-->
          <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_coupon_name')">
            <el-input class="width200" maxlength="32"  v-model="form.coupon_name" />
          </el-form-item>
          <!--Channel-->
          <el-form-item :label="$t('member.fc_member_details_loyalty_coupon_details_channel_label')">
            <el-input class="width200" v-model="form.channel_name" />
          </el-form-item>
          <!--Coupon type-->
          <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_coupon_type')"   prop="coupon_type_code">
            <el-input class="width200" v-model="form.coupon_type_name" />
          </el-form-item>
          <!--Cash amount-->
          <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_cash_amount')" prop="cash_amount" v-if="form.coupon_type_code === 'cash'">
            <el-input class="width200" v-model="form.amount" />
          </el-form-item>
          <!--Discount amount-->
          <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_discount_amount')" prop="discount_amount" v-if="form.coupon_type_code === 'discount'">
            <el-input class="width200" v-model="form.amount.toFixed(2)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <!--select a sku-->
          <el-form-item label="Select a SKU" v-if="form.coupon_type_code === 'sku'">
            <el-input class="width200" v-model="form.product_name" />
          </el-form-item>
          <!-- Condition-->
          <el-form-item :label="$t('member.fc_member_details_loyalty_coupon_details_condition_label')" prop="min_purchased_amount">
            {{$t('loyalty.fc_add_coupon_condition_input_label')}} {{form.min_purchased_amount || table_placeholder}}
          </el-form-item>
          <!--Validity period-->
          <el-form-item :label="$t('member.fc_member_details_loyalty_coupon_details_validity_label')" class="effective_type" prop="effective_type">
            <template v-if="form.effective_type === 1">
              <el-input class="width200" v-model="form.relative_value">
                <template slot="append">
                  {{$t('loyalty.fc_add_coupon_relative_date_input_label')}}
                </template>
              </el-input>
            </template>
            <template v-else-if="form.effective_type === 2">
              {{globalData.formatDate((form.specific_effective_date_from).substring(0, 10))}} - {{globalData.formatDate((form.specific_effective_date_to).substring(0, 10))}}
            </template>
          </el-form-item>
          <!--coupon T&C-->
          <el-form-item :label="$t('member.fc_member_details_loyalty_coupon_details_tc_label')">
            <el-input
              :autosize="{ minRows: 2, maxRows: 6}"
              style="max-width: 385px;"
              type="textarea"
              v-model="form.terms">
            </el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
    </ed-dialog>
  </div>
</template>

<script>
  import EldatePicker from '@/components/EldatePicker'
  import PaginationContainer from '@/components/PaginationContainer'
  import { getCouponInfoByCode } from '@/api/loyalty'
  import { queryProductList } from '@/api/master'
  import {
    loyaltyInfoMixins
  } from '@/utils/util'
  import {
    firstWordUpperCase,
    isCNLoginUser
  } from '@/utils'
  import {
    queryMemberCouponListBySearch
  } from '@/api/member'
  import { DateTime } from 'luxon'
  var status_data = [
    'Inactive',
    'Normal',
    'Used',
    'Expired(before used)'
  ]
  import { handleOssFileHtmlStr } from '@/views/data/oss-file-html-str'
  export default {
    mixins: [loyaltyInfoMixins, handleOssFileHtmlStr],
    components: {
      EldatePicker,
      PaginationContainer
    },
    filters: {
      handleStatus(val) {
        return status_data[val] || '-'
      }
    },
    data() {
      return {
        dialog_loading: true,
        dialogFormVisible: false,
        date: [],
        date_form: null,
        date_to: null,
        coupon_serial_no: '',
        status: '',
        tableData: [],
        listQuery: {
          page_size: 10
        },
        loading: true,
        postfix: '',
        form: {},
        valueDateForm: []
      }
    },
    created() {
      this.queryMemberCouponListBySearch()
    },
    methods: {
      isCNLoginUser,
      firstWordUpperCase,
      channel_data() {
        return ['天猫', '京东', '电商'][Math.floor(Math.random() * 3)]
      },
      handleView(coupon_code) {
        this.dialogFormVisible = true
        // this.form = data
        // if (this.form.specific_effective_date_from) {
        //   this.valueDateForm = [(this.form.specific_effective_date_from).substring(0, 10), (this.form.specific_effective_date_to).substring(0, 10)]
        // }
        // 调用 getCouponInfoByCode
        this.dialog_loading = true
        getCouponInfoByCode({ 'coupon_code': coupon_code }).then(res => {
          this.form = res.return_result
          // 处理discount amount
          if (this.form.coupon_type_code === 'discount') {
            this.form.amount = (this.form.amount * 100)
          }
          if (this.form.coupon_type_code === 'sku' && this.form.product_code) {
            // 去调用gift 详情
            queryProductList({ 'product_query': this.form.product_code, 'page_no': 1, 'page_size': 1 }).then(res => {
              var tableSKUData = res.return_result.products
              this.dialog_loading = false
              this.form.product_name = tableSKUData[0].product_name
            }).catch(res => {
              this.dialog_loading = false
            })
          } else {
            this.dialog_loading = false
          }
          if (this.form.effective_type === 2) {
            this.form.specific_effective_date_from = `${this.form.specific_effective_date_from.substr(0, 10)} ${this.form.specific_effective_date_from.substr(11, 8)}` || ''
            this.form.specific_effective_date_to = `${this.form.specific_effective_date_to.substr(0, 10)} ${this.form.specific_effective_date_to.substr(11, 8)}` || ''
          }
          // 查询terms
          if (this.form.terms) {
            this.handleHtml2str(this.form.terms).then(res => {
              this.form.terms = res.replace(/<br\/>/g, '\r\n')
            })
          }
        })
      },
      queryMemberCouponListBySearch() {
        this.setDateTime()
        this.loading = true
        queryMemberCouponListBySearch(Object.assign({
          member_code: this.member_code,
          generate_date_from: this.date_form ? `${this.date_form}T00:00:00.000${this.postfix}` : null,
          generate_date_to: this.date_to ? `${this.date_to}T23:59:59.999${this.postfix}` : null,
          coupon_serial_no: this.coupon_serial_no,
          status: this.status
        }, this.listQuery)).then((res) => {
          this.tableData = res.return_result.member_coupons
          if (this.isCNLoginUser()) {
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].register_channel_name = this.channel_data()
            }
          }
          this.total = res.return_result.total_count
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },
      setDateTime() {
        const generate_time = DateTime.local().toISO()
        const nowDateLength = generate_time.length
        this.postfix = generate_time.substring(nowDateLength - 6, nowDateLength)
      },
      valueDate(val) {
        [this.date_form, this.date_to] = val
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.queryMemberCouponListBySearch()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.queryMemberCouponListBySearch()
      },
      search() {
        this.listQuery.page_no = 1
        this.queryMemberCouponListBySearch()
      },
      resetForm1() {
        [this.date, this.coupon_serial_no, this.status] = [[], '', '']
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-form-item {
    margin-bottom: 20px;
  }
  .width200{
    width: 330px;
  }
  .coupon{
    margin-top:20px;
    .check{
      background-color:#f9f9f9;
      margin-top:20px;
      .margin{
        padding:12px;
      }
    }
    .query_result{
      margin:15px 0;
    }
    /deep/ .el-input.is-disabled .el-input__inner, /deep/ .el-range-editor.is-disabled, /deep/ .el-textarea.is-disabled .el-textarea__inner, /deep/ .el-range-editor.is-disabled input{
      background-color: #ffffff;
    }
  }
</style>
