<template>
  <div class="points-bhg">
    <section class="points-summary">
      <p>Points summary:</p>
      <el-row :gutter="40">
        <el-col :xl="8" :lg="8" :md="4">
          <div class="total-earned-point">
            <label>Total earned point:</label>
            <el-input disabled v-model="points_summary.earned_point" />
          </div>
        </el-col>
        <el-col :xl="8" :lg="8" :md="4">
          <div class="total-redeemable-points">
            <label>Total redeemable points:</label>
            <el-input disabled v-model="points_summary.redeemable_points" />
          </div>
        </el-col>
        <el-col :xl="8" :lg="8" :md="4">
          <div class="total-expiring-points">
            <label>Total expiring points within in 30 days:</label>
            <el-input disabled v-model="points_summary.expiring_points_30" />
          </div>
        </el-col>
        <el-col :xl="8" :lg="8" :md="4">
          <div class="total-used-points">
            <label>Total used points:</label>
            <el-input disabled v-model="points_summary.used_points" />
          </div>
        </el-col>
        <el-col :xl="8" :lg="8" :md="4">
          <div class="total-expired-points">
            <label>Total expired points:</label>
            <el-input disabled v-model="points_summary.expired_points" />
          </div>
        </el-col>
      </el-row>
    </section>
    <section class="search">
      <div class="search-list">
        <el-form :model="form_search" label-width="120px">
          <el-row :gutter="30">
          <el-col :xl="8" :lg="8" :md="4">
            <div class="transaction-code">
              <label>Transaction code:</label>
              <el-input v-model="form_search.transaction_invoice_no" />
            </div>
          </el-col>
          <el-col :xl="8" :lg="8" :md="4">
            <div class="point-type">
              <label>Point type:</label>
              <el-select :placeholder="$t('member.fc_member_details_loyalty_point_type_input_label')" clearable v-model="form_search.point_type_code">
                <el-option :key="index" :label="item.resources_key ? $t(`member.${item.resources_key}`) : item.point_type_name" :value="item.point_type_code" v-for="(item, index) in point_type_list" />
              </el-select>
            </div>
          </el-col>
          <el-col :xl="8" :lg="8" :md="4">
            <div class="issue-date">
              <label>Issue date:</label>
              <date-range :value="issue_date" @valueDate = "valueDateJoin" />
            </div>
          </el-col>
          <el-col :xl="4" :lg="4" :md="4">
            <div class="search-button">
              <el-button type="primary" @click="search">Search</el-button>
            </div>
          </el-col>
          <el-col :lg="4" :md="4" :xl="4" >
            <div class="adjust-points">
              <el-button @click="dialog = true" type="primary" v-allow="'member_view_adjust_point'">Adjust points</el-button>
            </div>
          </el-col>
        </el-row>
        </el-form>
      </div>
    </section>
    <section class="points-history">
      <template v-if="past_period_state">
        <p>Redeemable points history:</p>
        <el-table
          :data="redeemable_points.list"
          border
          v-loading="redeemable_points.loading"
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
              {{scope.row.create_date ? globalData.formatDate((scope.row.create_date).substring(0, 10)) : table_placeholder}}
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
              {{scope.row.point_type_code | handlePointStatus }}
            </template>
          </el-table-column>
        </el-table>
        <pagination-container
          :page = "redeemable_points.page_no"
          :page_size = 'redeemable_points.page_size'
          :total = 'redeemable_points.total'
          @handleCurrentChange = "handleCurrentChangeRedeemPoint"
          @handleSizeChange="handleSizeChangeRedeemPoint"
        ></pagination-container>
      </template>
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
            Unavailable
          </template>
        </el-table-column>
      </el-table>
      <pagination-container
        :page = "earned_points.page_no"
        :page_size = 'earned_points.page_size'
        :total = 'earned_points.total'
        @handleCurrentChange = "handleCurrentChangeEarnedPoint"
        @handleSizeChange="handleSizeChangeEarnedPoint"
      ></pagination-container>
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
            <el-option key="2" label="Redeemable points" v-if="past_period_state" value="2" />
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
        this.past_period_state ? await this.redeemablePointsHistory() : ''
        await this.earnedPointsHistory()
        await this.getPointTypeList()
      },
      async search() {
        this.past_period_state ? await this.redeemablePointsHistory() : ''
        await this.earnedPointsHistory()
      },
      confirmAdjustPoint() {
        this.$refs['dialog'].validate((valid) => {
          if (valid) {
            this.loading_adjust = true
            var point_amount = parseInt(this.form.point_amount)
            adjustMemberPointWithHistory({
              member_code: this.member_code,
              account_code: this.form.point_type === '1' ? this.current_period.account_code : this.past_period.account_code,
              action_type_code: point_amount > 0 ? 'add' : 'deduct',
              point_amount: Math.abs(point_amount),
              effective_date: this.form.point_type === '1' ? this.current_period.open_date : this.past_period.open_date,
              expired_date: this.form.point_type === '1' ? this.current_period.expired_date : this.past_period.expired_date,
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
              this.redeemable_points.page_no = 1
              this.earned_points.page_no = 1
              this.search()
              this.dialog = false
              // 重新获取记录
            }).catch(() => {
              // 将加载状态去掉
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
          var account_balances = res.return_result.point_account_balances
          var account_balance_length = account_balances.length
          this.account_info = res.return_result.point_account_balances[0]
          for (let i = 0; i < account_balance_length; i++) {
            if (account_balances[i].account_type_code === 'current_period') {
              this.current_period = account_balances[i]
              this.points_summary.earned_point = this.current_period.account_point_balance
            }
            if (account_balances[i].account_type_code === 'past_period') {
              this.past_period = account_balances[i]
              this.points_summary.redeemable_points = this.past_period.account_point_balance
              if (this.past_period.expired_date) {
                var date = new Date()
                // 查询出相差的天数  如果大于30天就是0 如果小于30天就取 account_point_balance
                var diff_value = (this.calcDateDiffer(date, this.past_period.expired_date)) / (24 * 60 * 60)
                if (diff_value > 30) {
                  this.points_summary.expiring_points_30 = 0
                } else {
                  this.points_summary.expiring_points_30 = this.past_period.account_point_balance
                }
              }
            }
            this.past_period_state = Object.keys(this.past_period).length > 0
          }
        })
      },
      redeemablePointsHistory() {
        this.redeemable_points.loading = true
        return queryMemberPointHistoryByAccount({
          member_code: this.member_code,
          account_code: this.past_period.account_code,
          page_no: this.redeemable_points.page_no,
          page_size: this.redeemable_points.page_size,
          transaction_invoice_no: this.form_search.transaction_invoice_no,
          point_type_code: this.form_search.point_type_code,
          issue_date_from: this.form_search.issue_date_from,
          issue_date_to: this.form_search.issue_date_to
        }).then(res => {
          this.redeemable_points.loading = false
          var result = res.return_result
          this.redeemable_points.list = result.points === null ? [] : result.points
          this.redeemable_points.total = result.total_count
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
    margin-top: 10px;
    .points-summary{
      p{
        font-size: 18px;
      }
      .el-row{
        label{
          font-size: 16px;
          min-width: 200px;
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
      .search-list{
        padding: 0 10px 20px 0;
        .transaction-code, .point-type, .issue-date, .search-button, .adjust-points{
          margin-top: 20px;
          display: flex;
          align-items: center;
        }
        .search-button, .adjust-points{
          position: relative;
          height: 30px;
          .el-button{
            position: absolute;
            right: 0;
          }
        }
        label{
          display: block;
          text-align: right;
          min-width: 200px;
          margin-right: 10px;
        }
        .el-input{
          width: 200px;
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
