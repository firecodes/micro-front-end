<template>
  <div class="points-bhg">
    <section class="search">
      <div class="search-list">
        <el-form :model="form_search" label-width="170px">
          <div class="flex-a">
            <!--Total points-->
            <div class="point_total">
              <el-form-item :label="$t('member.fc_member_details_loyalty_point_total_label')">
                <el-input disabled v-model="account_info.account_point_balance || 0" />
              </el-form-item>
            </div>
            <!--Used points-->
            <div class="used_point">
              <el-form-item :label="$t('member.fc_member_details_loyalty_point_used_label')">
                <el-input disabled v-model="account_info.account_point_used || 0" />
              </el-form-item>
            </div>
            <!--Expired points-->
            <div class="expired_point">
              <el-form-item :label="$t('member.fc_member_details_loyalty_point_expired_label')">
                <el-input disabled v-model="account_info.account_point_expired || 0" />
              </el-form-item>
            </div>
            <div class="transaction-code">
              <el-form-item label="Transaction code:">
                <el-input style="width: 250px"  v-model="form_search.transaction_invoice_no"/>
              </el-form-item>
            </div>
            <div class="point-type">
              <el-form-item label="Point type:">
                <el-select :placeholder="$t('member.fc_member_details_loyalty_point_type_input_label')" clearable style="width: 250px"  v-model="form_search.point_type_code">
                  <el-option :key="index" :label="item.resources_key ? $t(`member.${item.resources_key}`) : item.point_type_name" :value="item.point_type_code" v-for="(item, index) in point_type_list" />
                </el-select>
              </el-form-item>
            </div>
            <div class="issue-date">
              <el-form-item label="Issue date:">
                <date-range :value="issue_date" @valueDate = "valueDateJoin"  style="width: 250px" />
              </el-form-item>
            </div>
            <div class="button">
              <div class="search-button">
                <el-button @click="search" type="primary">Search</el-button>
              </div>
              <div class="adjust-points" style="margin-left: 20px;">
                <el-button @click="dialog = true" type="primary" v-allow="'member_view_adjust_point'">Adjust points</el-button>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </section>
    <section class="points-history">
      <p>Earned points history:</p>
      <el-table
        :data="earned_points.list"
        border
        v-loading="earned_points.loading"
        style="width: 100%">
        <el-table-column
          prop="transaction_invoice_no"
          label="Transaction code"
          width="180">
          <template slot-scope="scope">
            <template v-if="scope.row.point_adjustment_history_id === null">
              {{scope.row.transaction_invoice_no || table_placeholder}}
            </template>
            <template v-else>
              <span style="color:rgb(0, 153, 255); cursor: pointer" @click="showAdjustInfo(scope.row)">Manuel adjustment</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="issue_date"
          label="Issue date"
          width="180">
          <template slot-scope="scope">
            {{scope.row.effective_date ? globalData.formatDate((scope.row.effective_date).substring(0, 10)) : table_placeholder}}
          </template>
        </el-table-column>
        <el-table-column
          prop="effective_date"
          label="Effective date">
          <template slot-scope="scope">
            {{scope.row.effective_date ? globalData.formatDate((scope.row.effective_date).substring(0, 10)) : table_placeholder}}
          </template>
        </el-table-column>
        <el-table-column
          prop="expiry_date"
          label="Expiry date">
          <template slot-scope="scope">
            {{scope.row.expired_date ? globalData.formatDate((scope.row.expired_date).substring(0, 10)) : table_placeholder}}
          </template>
        </el-table-column>
        <el-table-column
          prop="point_type"
          label="Point type">
          <template slot-scope="scope">
            {{scope.row.point_type_resources_key ? $t(`member.${scope.row.point_type_resources_key}`) : scope.row.point_type_name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="points"
          label="Points">
          <template slot-scope="scope">
            {{scope.row.point_amount_with_sign || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="Status">
          <template slot-scope="scope">
            available
          </template>
        </el-table-column>
      </el-table>
      <pagination-container
        :page = "earned_points.page_no"
        :page_size = 'earned_points.page_size'
        :total = 'earned_points.total'
        @handleCurrentChange = "handleCurrentChangeEarnedPoint"
        @handleSizeChange="handleSizeChangeEarnedPoint"
      />
    </section>
    <el-dialog
      class="dialog-bhg"
      title="Manual point adjustment"
      :visible.sync="dialog"
      width="480px">
      <el-form label-width="145px" :model="form" ref="dialog">
        <el-form-item label="Point type: " prop="point_type" :rules="[{ required: true, message: handleGlobalI18n('validation', 'is_null'), trigger: ['change', 'trigger'] }]">
          <el-select v-model="form.point_type">
            <el-option key="1" label="Earned points" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="Point amount: " prop="point_amount" :rules="[{ required: true, message: handleGlobalI18n('validation', 'is_null'), trigger: ['change', 'trigger'] }]">
          <el-input-number v-model="form.point_amount" />
        </el-form-item>
        <el-form-item label="Comment: " prop="comment">
          <el-input type="textarea" :rows="2" v-model="form.comment" />
        </el-form-item>
        <el-form-item label="">
          <el-button style="width: 80px;" @click="dialog = false">Cancel</el-button>
          <el-button style="min-width: 80px;" type="primary" :loading="loading_adjust" @click="confirmAdjustPoint">Confirm</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      class="dialog-bhg"
      title="Manual point adjustment"
      :visible.sync="dialog1"
      width="480px">
      <el-form label-width="145px" :model="info" ref="dialog">
        <el-form-item label="Point type: " prop="point_type">
          <el-select v-model="info.point_type" clearable :placeholder="handleGlobalI18n('member', 'please_select')">
            <el-option :key="index" :label="item.resources_key ? $t(`member.${item.resources_key}`) : item.point_type_name" :value="item.point_type_code" v-for="(item, index) in point_type_list" />
          </el-select>
        </el-form-item>
        <el-form-item label="Point amount: " prop="point_amount">
          <el-input-number v-model="info.point_amount" />
        </el-form-item>
        <el-form-item label="Comment: " prop="comment">
          <el-input type="textarea" :rows="2" v-model="info.comment" />
        </el-form-item>
        <el-form-item label="">
          <el-button style="width: 80px;" type="primary" @click="dialog1 = false">Close</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import DateRange from '@/components/EldatePicker'
  import { loyaltyInfoMixins } from '@/utils/util'
  import {
    getMemberPoint,
    queryMemberPointHistoryByAccount,
    adjustMemberPointWithHistory
  } from '@/api/member'
  import { calcDateDiffer, kjfUUID } from '@/utils'
  import { queryPointTypeList } from '@/api/loyalty'
  import PaginationContainer from '@/components/PaginationContainer'
  import { DateTime } from 'luxon'
  var status_data = {
    standard_points: 'Outstanding',
    tier_points: 'Outstanding',
    expired_points: 'Expired',
    campaign_points: 'Outstanding',
    redemption_points: 'Redeemed'
  }
  export default{
    mixins: [loyaltyInfoMixins],
    components: {
      PaginationContainer,
      DateRange
    },
    data() {
      return {
        account_info: {},
        past_period_state: false,
        loading_adjust: false,
        dialog1: false,
        adjust_state: false,
        issue_date: [],
        point_type_list: [],
        points_summary: {
          earned_point: 0,
          redeemable_points: 0,
          expiring_points_30: 0,
          used_points: 0,
          expired_points: 0
        },
        form: {
          point_type: '',
          point_amount: '',
          comment: ''
        },
        info: {
          point_type: '',
          point_amount: '',
          comment: ''
        },
        listQuery: {
          page_size: 10
        },
        form_search: {
          transaction_invoice_no: null,
          point_type_code: null,
          issue_date_from: null,
          issue_date_to: null
        },
        dialog: false,
        current_period: {},
        past_period: {},
        redeemable_points: {
          loading: false,
          list: [],
          page_no: 1,
          page_size: 5,
          total: 0
        },
        earned_points: {
          loading: false,
          list: [],
          page_no: 1,
          page_size: 5,
          total: 0
        }
      }
    },
    filters: {
      handlePointStatus(val) {
        var has = Object.prototype.hasOwnProperty
        return has.call(status_data, val) ? status_data[val] : '-'
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      kjfUUID,
      calcDateDiffer,
      showAdjustInfo(obj) {
        this.info = {
          point_type: obj.point_type_code,
          point_amount: obj.point_amount_with_sign,
          comment: obj.remark
        }
        this.dialog1 = true
      },
      async fetch() {
        await this.getMemberPointByAccount()
        await this.earnedPointsHistory()
        await this.getPointTypeList()
      },
      async search() {
        await this.earnedPointsHistory()
      },
      confirmAdjustPoint() {
        this.$refs['dialog'].validate((valid) => {
          if (valid) {
            this.loading_adjust = true
            var point_amount = parseInt(this.form.point_amount)
            adjustMemberPointWithHistory({
              member_code: this.member_code,
              account_code: this.current_period.account_code || null,
              action_type_code: point_amount > 0 ? 'add' : 'deduct',
              point_amount: Math.abs(point_amount),
              effective_date: this.current_period.open_date || null,
              expired_date: this.current_period.expired_date || null,
              adjust_date: DateTime.local().toISO(),
              point_biz_code: this.kjfUUID(32),
              remark: this.form.comment
            }).then(res => {
              // 调整积分成功
              this.$message({
                message: 'Success',
                type: 'success'
              })
              this.loading_adjust = false
              this.earned_points.page_no = 1
              this.search()
              this.dialog = false
              // 重新获取记录
            }).catch(() => {
              // 将加载状态去掉
              this.$message.error('Fail')
              this.loading_adjust = false
            })
          }
        })
      },
      valueDateJoin(val) {
        [this.form_search.issue_date_from, this.form_search.issue_date_to] = val
      },
      getPointTypeList() {
        return queryPointTypeList({ page_no: 1, page_size: 40 }).then(res => {
          this.point_type_list = res.return_result.point_types || []
        })
      },
      handleCurrentChangeRedeemPoint(val) {
        this.redeemable_points.page_no = val
        this.redeemablePointsHistory()
      },
      handleSizeChangeRedeemPoint(val) {
        this.redeemable_points.page_size = val
        this.redeemablePointsHistory()
      },
      handleCurrentChangeEarnedPoint(val) {
        this.earned_points.page_no = val
        this.earnedPointsHistory()
      },
      handleSizeChangeEarnedPoint(val) {
        this.earned_points.page_size = val
        this.earnedPointsHistory()
      },
      getMemberPointByAccount() {
        return getMemberPoint({ member_code: this.member_code }).then(res => {
          this.current_period = res.return_result.point_account_balances[0]
          this.account_info = res.return_result.point_account_balances[0]
        })
      },
      earnedPointsHistory() {
        this.earned_points.loading = true
        return queryMemberPointHistoryByAccount({
          member_code: this.member_code,
          account_code: this.current_period.account_code,
          page_no: this.earned_points.page_no,
          page_size: this.earned_points.page_size,
          transaction_invoice_no: this.form_search.transaction_invoice_no,
          point_type_code: this.form_search.point_type_code,
          issue_date_from: this.form_search.issue_date_from,
          issue_date_to: this.form_search.issue_date_to
        }).then(res => {
          this.earned_points.loading = false
          var result = res.return_result
          this.earned_points.list = result.points === null ? [] : result.points
          this.earned_points.total = result.total_count
        })
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .points-bhg{
    .flex-a{
      display: flex;
      flex-wrap: wrap;
      .button{
        margin-top: 20px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
    margin-top: 10px;
    .points-summary{
      p{
        font-size: 18px;
      }
      .el-row{
        label{
          font-size: 16px;
          display: block;
          text-align: right;
          margin-right: 10px;
        }
        .total-earned-point, .total-redeemable-points, .total-expiring-points, .total-used-points, .total-expired-points{
          display: flex;
          align-items: center;
          margin-top: 20px;
        }
        .el-input{
          width: 160px;
        }
      }
    }
    .search{
      margin-top: 35px;
      background-color: #f9f9f9;
      padding: 20px;
      .search-list{
        padding: 0 10px 20px 0;
        .transaction-code, .point-type, .issue-date, .search-button, .adjust-points, .point_total, .used_point, .expired_point{
          display: flex;
          align-items: center;
        }
        label{
          display: block;
          text-align: right;
          margin-right: 10px;
        }
        .el-input{
          width: 250px;
        }
      }
    }
    .points-history{
      p{
        margin-top: 20px;
        margin-bottom: 20px;
      }
      font-size: 18px;
    }
    .dialog-bhg{
      .el-select, .el-input-number{
        width: 200px;
      }
    }
  }
</style>
