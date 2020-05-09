<template>
  <div class="points" v-loading="loading">
    <section class="section">
      <div class="account">
        <p>{{$t('member.fc_member_details_loyalty_point_summary_label')}}</p>
      </div>
      <div class="account-details">
        <el-row :gutter="20">
            <el-form label-width="140px"  label-position="right">
              <!--Total points-->
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
                <el-form-item :label="$t('member.fc_member_details_loyalty_point_total_label')">
                  <el-input v-model="account_info.account_point_balance || 0" disabled />
                </el-form-item>
              </el-col>
              <!--Used points-->
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
                <el-form-item :label="$t('member.fc_member_details_loyalty_point_used_label')">
                  <el-input v-model="account_info.account_point_used || 0" disabled />
                </el-form-item>
              </el-col>
              <!--Expired points-->
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item :label="$t('member.fc_member_details_loyalty_point_expired_label')">
                  <el-input v-model="account_info.account_point_expired || 0" disabled />
                </el-form-item>
              </el-col>
            </el-form>
            <el-form :model="form" label-width="140px">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
                <!--Transaction code-->
                <el-form-item :label="$t('member.fc_member_details_loyalty_point_code_label')">
                  <el-input v-model="form.transaction_invoice_no" />
                </el-form-item>
              </el-col>
              <!--Point type-->
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
                <el-form-item :label="$t('member.fc_member_details_loyalty_point_type_label')">
                  <el-select :placeholder="$t('member.fc_member_details_loyalty_point_type_input_label')" clearable v-model="form.point_type_code">
                    <el-option :key="index" :label="item.resources_key ? $t(`member.${item.resources_key}`) : item.point_type_name" :value="item.point_type_code" v-for="(item, index) in point_type_list" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item :label="$t('member.fc_member_details_loyalty_point_issue_label')">
                  <date-range :value="issue_date" @valueDate = "valueDateJoin" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4">
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">{{$t('member.fc_member_details_loyalty_point_btn_search_label')}}</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
      </div>
    </section>
    <p class="query_result">{{$t('member.fc_member_details_loyalty_point_history_title')}}</p>
    <el-table :data="tableData" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
      <!--Transaction code-->
      <el-table-column prop="transaction_invoice_no" align="center" :label="$t('member.fc_member_details_loyalty_point_table_code_label')">
        <template slot-scope="scope">
          {{scope.row.transaction_invoice_no || table_placeholder}}
        </template>
      </el-table-column>
      <!--Issue date-->
      <el-table-column prop="create_date" align="center" :label="$t('member.fc_member_details_loyalty_point_table_issue_label')">
        <template slot-scope="scope">
          {{scope.row.effective_date ? globalData.formatDate((scope.row.effective_date).substring(0, 10)) : table_placeholder}}
        </template>
      </el-table-column>
      <!--Effective date-->
      <el-table-column prop="effective_date" align="center" :label="$t('member.fc_member_details_loyalty_point_table_effective_label')">
        <template slot-scope="scope">
          {{scope.row.effective_date ? globalData.formatDate((scope.row.effective_date).substring(0, 10)) : table_placeholder}}
        </template>
      </el-table-column>
      <!--Expiry date-->
      <el-table-column prop="expired_date" align="center" :label="$t('member.fc_member_details_loyalty_point_table_expiry_label')">
        <template slot-scope="scope">
          {{scope.row.expired_date ? globalData.formatDate((scope.row.expired_date).substring(0, 10)) : table_placeholder}}
        </template>
      </el-table-column>
      <!--Point type-->
      <el-table-column prop="point_type_name" align="center" :label="$t('member.fc_member_details_loyalty_point_table_type_label')">
        <template slot-scope="scope">
          {{scope.row.point_type_resources_key ? $t(`member.${scope.row.point_type_resources_key}`) : scope.row.point_type_name }}
        </template>
      </el-table-column>
      <!--Points-->
      <el-table-column prop="point_amount" align="center" :label="$t('member.fc_member_details_loyalty_point_table_points_label')">
        <template slot-scope="scope">
          {{scope.row.point_amount_with_sign || table_placeholder }}
        </template>
      </el-table-column>
      <!--Status-->
      <el-table-column prop="point_amount" align="center" :label="$t('member.fc_member_details_loyalty_point_table_status_label')">
        <template slot-scope="scope">
          {{scope.row.point_type_code | handlePointStatus }}
        </template>
      </el-table-column>
    </el-table>
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
  import DateRange from '@/components/EldatePicker'
  import {
    getMemberPoint,
    queryMemberPointHistoryByAccount
  } from '@/api/member'
  import {
    loyaltyInfoMixins
  } from '@/utils/util'
  import PaginationContainer from '@/components/PaginationContainer'
  import { queryPointTypeList } from '@/api/loyalty'
  var status_data = {
    standard_points: 'Outstanding',
    tier_points: 'Outstanding',
    expired_points: 'Expired',
    campaign_points: 'Outstanding',
    redemption_points: 'Redeemed'
  }
  import { DateTime } from 'luxon'

  export default {
    mixins: [loyaltyInfoMixins],
    components: {
      PaginationContainer,
      DateRange
    },
    data() {
      return {
        issue_date: [],
        form: {
          transaction_invoice_no: null,
          point_type_code: null,
          issue_date_from: null,
          issue_date_to: null
        },
        sel_account: 0,
        date_form: '',
        date_to: '',
        account_type: '',
        point_type: '',
        account_list: [],
        tableData: [],
        listLoading: false,
        account_info: {},
        account_code: '',
        listQuery: {
          page_size: 10
        },
        loading: true,
        point_type_list: [],
        postfix: null
      }
    },
    filters: {
      handlePointStatus(val) {
        var has = Object.prototype.hasOwnProperty
        return has.call(status_data, val) ? status_data[val] : '-'
      }
    },
    created() {
      this.asyncFun()
    },
    methods: {
      setDateTime() {
        this.generate_time = DateTime.local().toISO()
        const nowDateLength = this.generate_time.length
        this.postfix = this.generate_time.substring(nowDateLength - 6, nowDateLength)
      },
      onSubmit() {
        this.setDateTime()
        this.form.issue_date_from = this.form.issue_date_from ? `${this.form.issue_date_from.substring(0, 10)}T00:00:00.000${this.postfix}` : null
        this.form.issue_date_to = this.form.issue_date_to ? `${this.form.issue_date_to.substring(0, 10)}T23:59:59.999${this.postfix}` : null
        this.queryMemberPointHistory(this.form)
      },
      valueDateJoin(val) {
        [this.form.issue_date_from, this.form.issue_date_to] = val
      },
      asyncFun() {
        this.getMemberPointByAccount()
        this.queryMemberPointHistory()
        // 获取积分类型
        this.getPointTypeList()
      },
      getPointTypeList() {
        queryPointTypeList({ page_no: 1, page_size: 40 }).then(res => {
          this.point_type_list = res.return_result.point_types || []
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.queryMemberPointHistory()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.queryMemberPointHistory()
      },
      valueDate(val) {
        if (val !== '') {
          [this.date_form, this.date_to] = val
        }
      },
      getMemberPointByAccount() {
        getMemberPoint({ member_code: this.member_code }).then(res => {
          this.account_info = res.return_result.point_account_balances[0]
        })
      },
      queryMemberPointHistory(obj = {}) {
        this.loading = true
        queryMemberPointHistoryByAccount({ member_code: this.member_code, ...this.listQuery, ...obj }).then(res => {
          this.tableData = res.return_result.points
          this.loading = false
          this.total = res.return_result.total_count
        }).catch(res => {
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .account-details{
    background-color:#f9f9f9;
    margin-top:20px;
    padding:12px;
  }
  .el-input, .el-select{
    width: 200px;
  }
.points{
  margin-top:20px;
  .account{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:20px;
    p{
      font-size: 12px;
      color: #000000;
    }
  }
  .account-details{
    line-height: 40px;
    .used-points,.total-points,.expired-points{
      display: flex;
      flex:1;
      height:40px;
      border:1px solid #797979;
      // border-left-color: #ffffff;

    }
    .total-points{
      // border-left:1px solid #797979;
    }
    .key{
      flex:0 0 40%;
      height:38px;
      border-right:1px solid #797979;
      // z-index:-1;
      width: 40%;
      text-align: center;
      // background-color:#f3f6fb;
    }
    .value{
      text-align: center;
      // background-color: #ffffff;
      flex:0 0 60%;
    }
  }
  .check{
    // background-color:#f9f9f9;
    margin-top:20px;
    .margin{
      padding:12px;
    }
  }
  .query_result{
    margin:15px 0;
  }
}
</style>
