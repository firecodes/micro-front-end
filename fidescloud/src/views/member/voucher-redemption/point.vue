<template>
  <div class="point" v-loading="loading">
    <back-button />
    <section class="member-info">
      <div class="name">
        <label>Name:</label>
        <span>{{name || table_placeholder}}</span>
      </div>
      <div class="birthday">
        <label>Birthday:</label>
        <span>{{birthday || table_placeholder}}</span>
      </div>
      <div class="mobile">
        <label>Mobile:</label>
        <span>{{mobile || table_placeholder}}</span>
      </div>
      <div class="email">
        <label>Email:</label>
        <span>{{member_info.email || table_placeholder}}</span>
      </div>
    </section>
    <section class="point-detail">
      <div class="past-period">
        <div class="top">
          <p>Past Period</p>
          <label>Expiry Date: {{past_period.expiry_date || table_placeholder}}</label>
        </div>
        <div class="bottom">
          <div class="flex">
            <div class="total-points">
              <p>Total Points</p>
              <span>{{past_period.total_points}}</span>
            </div>
            <div class="maximum-redeemable-dollar">
              <p>Maximum Redeemable Dollar</p>
              <span>${{past_period.maximum_redeemable_dollar || 0}}</span>
            </div>
          </div>
          <el-button type="primary" class="redeem" @click="dialog = true" :disabled="past_period.total_points < 250">Redeem</el-button>
        </div>
      </div>
      <div class="current-period">
        <div class="top">
          <p>Current Period</p>
          <label>Expiry Date: {{current_period.expiry_date || table_placeholder}}</label>
        </div>
        <div class="bottom">
          <div class="flex">
            <div class="total-points">
              <p>Total Points</p>
              <span>{{current_period.total_points}}</span>
            </div>
            <div class="maximum-redeemable-dollar">
              <p>Maximum Redeemable Dollar</p>
              <span>${{current_period.maximum_redeemable_dollar || 0}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <el-dialog
      title="Redeem Points"
      :visible.sync="dialog"
      width="500px">
      <el-form label-width="145px">
        <el-form-item label="Points to Redeem：">
          <el-input v-model="points_to_redeem" @change="points_to_redeem = points_to_redeem > past_period.total_points ? calcOptimalPoint(past_period.total_points) : calcOptimalPoint(points_to_redeem)" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="proceed">Proceed</el-button>
          <el-button type="primary" @click="points_to_redeem = calcOptimalPoint(past_period.total_points)">Maximum</el-button>
          <el-button @click="dialog = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getMemberPoint
  } from '@/api/member'
  import BackButton from '@/components/BackButton'
  import { dateConversion1, getNextDate } from '@/utils'
  import { calcOptimalPoint, calcAmount } from './calc'
  import { getMemberInfo } from '@/api/member'
  import moment from 'moment'
  export default {
    components: {
      BackButton
    },
    data() {
      return {
        account_type_code: '',
        account_code: '',
        points_to_redeem: 0,
        past_period: {
          expiry_date: '',
          total_points: 0,
          maximum_redeemable_dollar: ''
        },
        current_period: {
          expiry_date: '',
          total_points: 0,
          maximum_redeemable_dollar: ''
        },
        loading: true,
        dialog: false,
        member_code: '',
        mobile: '',
        name: '',
        birthday: '',
        current_open_date: '',
        member_info: {
          email: ''
        }
      }
    },
    created() {
      // 获取传递的参数
      var query = this.$route.query
      this.member_code = query.member_code
      this.mobile = query.mobile
      this.name = query.full_name
      this.birthday = query.birthday
      if (this.member_code !== '' || this.member_code !== undefined) {
        this.getMemberPointInfo()
        this.handleGetMemberInfo()
      } else {
        this.$router.go(-1)
      }
    },
    methods: {
      calcOptimalPoint,
      calcAmount,
      dateConversion1,
      getNextDate,
      handleGetMemberInfo() {
        getMemberInfo(this.member_code).then(res => {
          this.member_info = res.return_result
        })
      },
      proceed() {
        this.$router.push({
          path: '/member/voucher-redeem/redeem',
          query: {
            account_code: this.account_code,
            member_code: this.member_code,
            account_type_code: this.account_type_code,
            point_redeem: this.calcOptimalPoint(this.points_to_redeem)
          }
        })
      },
      getMemberPointInfo() {
        getMemberPoint({ member_code: this.member_code }).then(res => {
          var result = res.return_result
          var point_account_list = result.point_account_balances
          const account_length = point_account_list.length
          for (let i = 0; i < account_length; i++) {
            if (point_account_list[i].account_type_code === 'current_period') {
              this.current_period.total_points = point_account_list[i].account_point_balance || 0
              this.current_open_date = (point_account_list[i].expired_date).substring(0, 10)
              this.current_period.expiry_date = this.dateConversion1(moment(moment(new Date(point_account_list[i].expired_date).valueOf()).format()).format('YYYY-MM-DD'))
              this.current_period.maximum_redeemable_dollar = this.calcAmount(this.calcOptimalPoint(this.current_period.total_points), this.current_period.total_points)
            } else if (point_account_list[i].account_type_code === 'past_period') {
              this.past_period.total_points = point_account_list[i].account_point_balance || 0
              this.past_period.expiry_date = this.dateConversion1((point_account_list[i].expired_date).substring(0, 10))
              this.past_period.maximum_redeemable_dollar = this.calcAmount(this.calcOptimalPoint(this.past_period.total_points), this.past_period.total_points)
              this.account_code = point_account_list[i].account_code
              this.account_type_code = point_account_list[i].account_type_code
            }
          }
          if (this.past_period.expiry_date === '' && this.current_open_date !== '') {
            // getNextDate
            this.past_period.expiry_date = this.dateConversion1(this.current_open_date)
          }
          this.points_to_redeem = this.calcOptimalPoint(this.past_period.total_points, this.past_period.total_points)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .point{
    margin: 20px;
    .member-info{
      z-index: 1;
      margin: 20px 20px;
      height: 107px;
      line-height: 20px;
      border-radius: 8px;
      background-color: rgba(243, 246, 251, 1);
      text-align: center;
      box-shadow: 0 0 0 0 rgba(243, 246, 251, 1);
      display: block;
      position: relative;
      .name{
        position: absolute;
        top: 40%;
        left: 6%;
      }
      .birthday{
        @extend .name;
        left: 30%;
      }
      .mobile{
        @extend .name;
        left: 50%;
      }
      .email{
        @extend .name;
        left: 70%;
      }
      label{
        line-height: 23px;
        color: rgba(16, 16, 16, 1);
        font-size: 18px;
        text-align: left;
        font-weight: bold;
      }
      span{
        line-height: 23px;
        color: rgba(16, 16, 16, 1);
        font-size: 18px;
        text-align: left;
      }
    }
    .point-detail{
      position: relative;
      margin-top: -48px;
      z-index: 101;
      width: 100%;
      height: 454px;
      line-height: 20px;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 1);
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0);
      display: flex;
      justify-content: space-around;
      .past-period{
        width: 40.8%;
        height: 356px;
        line-height: 20px;
        border-radius: 8px 8px 0 0;
        background-color: rgba(255, 255, 255, 0);
        text-align: center;
        box-shadow: 0 0 0 0 rgba(170, 170, 170, 1);
        border: 1px solid rgba(215, 215, 215, 1);
        margin-top: 40px;
        .top{
          width: 100%;
          height: 107px;
          line-height: 20px;
          border-radius: 8px 8px 0 0;
          background-color: rgba(245, 247, 250, 1);
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0);
          p{
            line-height: 41px;
            color: rgba(68, 68, 68, 1);
            font-size: 28px;
            font-weight: bold;
            margin: 13px 0 10px;
          }
          label{
            line-height: 26px;
            color: rgba(16, 16, 16, 1);
            font-size: 16px;
          }
        }
        .bottom{
          padding: 32px 23px;
          .flex{
            display: flex;
            justify-content: space-between;
          }
          .redeem{
            margin-top: 33px;
          }
          .total-points{
            width: percentage(300/620);
            // height: 100px;
            line-height: 20px;
            text-align: center;
            box-shadow: 0 2px 3px 1px rgba(170, 170, 170, 0.16);
            border: 1px solid rgba(255, 255, 255, 0);
            position: relative;
            min-height: 121px;
          }
          .maximum-redeemable-dollar{
            @extend .total-points;
          }
          p{
            margin: 8px 20px 6px 20px;
            line-height: 26px;
            color: rgba(160, 160, 160, 1);
            font-size: 16px;
          }
          span{
            display: block;
            line-height: 46px;
            color: rgba(68, 68, 68, 1);
            font-size: 32px;
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
          }
        }
      }
      .current-period{
        @extend .past-period;
      }
    }
  }
</style>
