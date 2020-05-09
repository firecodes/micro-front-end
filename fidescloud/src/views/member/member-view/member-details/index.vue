<template>
  <div class="member-details">
      <el-container class="container">
        <el-aside class="aside">
          <el-card shadow="hover" v-loading="loading" :body-style="card_body_style">
            <div class="member-info">
              <div class="member-img" v-if="!member_info.head_image">
                <img src="../../../../assets/images/male-icon.png" v-if="member_info.gender===1">
                <img src="../../../../assets/images/female-icon.png" v-else-if="member_info.gender===2">
                <img src="../../../../assets/images/know-icon.png" v-else-if="member_info.gender===0 || !member_info.gender">
              </div>
              <div class="member-img" v-else>
                <img :src="member_info.head_image" alt="" />
              </div>
              <!--member register channel-->
              <div class="member-register-channel">
                <p>
                  <label v-html="member_info.register_channel_resources_key ? $t(`reporting.${member_info.register_channel_resources_key}`) : (member_info.register_channel_name ? member_info.register_channel_name : table_placeholder)" /><br />
                  <span> {{ (member_info.register_date)?globalData.formatDate((member_info.register_date).substring(0, 10)):'' }}</span>
                </p>
              </div>
              <!--member name-->
              <div class="member_username">
                <!-- <label class="label">
                  <ed-clamp :max-lines="1" autoresize>{{member_info.full_name || table_placeholder}}</ed-clamp>
                </label> -->
                <ed-clamp :max-lines="2" autoresize>{{member_info.full_name || table_placeholder}}</ed-clamp>
                <img src="../../../../assets/images/male.png" v-if="member_info.gender===1">
                <img src="../../../../assets/images/female.png" v-else-if="member_info.gender===2">
              </div>
              <!--member-grade-->
              <div class="grade">
                <div class="gold">
                  <img src="../../../../assets/images/tier-icon.png">
                  <span>{{member_info.member_tier_name}}</span>
                </div>
                <!--member points-->
                <div class="points">
                  <!-- <label>{{handleGlobalI18n('member', 'points')}}</label> -->
                  <label>
                    <svg-icon icon-class="points_update" style="color: #ffffff"></svg-icon>
                  </label>
                  <span>{{account_info.account_point_balance || 0}}</span>
                </div>
              </div>
              <!--expire point-->
              <section class="expire-remind" v-if="!is_bhg_user">
                <p v-if="expire_data.expired_type === 3">{{signMix(handleGlobalI18n('member', 'expiring_point_no_expiry'), [expire_data.expired_default_value || 0, handleUnitDate(expire_data.expired_default_unit), expire_data.expired_amount])}}</p>
                <p v-else-if="expire_data.expired_type === 2">{{signMix(handleGlobalI18n('member', 'expiring_point_relative'), [expire_data.expired_relative_value || 0, handleUnitDate(expire_data.expired_relative_unit), expire_data.expired_amount || 0])}}</p>
                <p v-else-if="expire_data.expired_type === 1">{{signMix(handleGlobalI18n('member', 'expiring_point_fixed'), [new Date().getFullYear() + expire_data.expired_fixed_after_year, (expire_data.expired_fixed_specific_month).toString().padStart(2, "0"), expire_data.expired_fixed_specific_date.toString().padStart(2, "0"),  expire_data.expired_amount || 0])}}</p>
              </section>
              <!--只针对BHG的显示-->
              <section class="point-bhg" v-else>
                <div class="redeemable-points">
                  <p>Redeemable:</p>
                  <span>{{redeemable_points}}</span>
                  <label class="date">Redeem by <br />{{expires_on || table_placeholder}}</label>
                </div>
                <div class="earned-points">
                  <!--<p>Earned points:</p>-->
                  <p>Current:</p>
                  <span>{{earned_points}}</span>
                  <label class="date">Earn until <br /> {{redeemable_on || table_placeholder}}</label>
                </div>
              </section>
              <!--member tags-->
              <!--<div class="tags">-->
                <!--<label v-for="(item, index) in tags" :key="index" :style="{color:item.color,backgroundColor:item.bgColor}">{{item.name}}</label>-->
              <!--</div>-->
            </div>
            <ul class="info">
            <li>
              <label>{{$t('member.fc_member_details_code_label')}}</label>
              <span v-html="member_info.member_code || table_placeholder"></span>
            </li>
            <li>
              <label>{{$t('member.fc_member_details_mobile_label')}}</label>
              <span>{{member_info.mobile ? ((member_info.mobile_region_code ?  (member_info.mobile_region_code + ' ') : '') + member_info.mobile) : table_placeholder }}</span>
            </li>
            <li>
              <label>{{$t('member.fc_member_details_email_label')}}</label>
              <span v-html="member_info.email || table_placeholder"></span>
            </li>
            <li>
              <label>{{$t('member.fc_member_details_birthday_label')}}</label>
              <span>{{globalData.formatDate(member_info.birthday) || table_placeholder}}</span>
            </li>
          </ul>
          </el-card>
        </el-aside>
        <!--main-->
        <el-main class="main">
          <available-campaign :member_code="params_member_code" />
          <!--<points-summary></points-summary>-->
          <transactions :member_code="params_member_code" :member_id = "member_info.member_id || ''" @getLatestPurchaseDate = "getLatestPurchaseDate" />
          <!--<campaign></campaign>-->
          <short-cut :member_code="params_member_code" />
        </el-main>
      </el-container>
  </div>
</template>
<script>
  import Transactions from './transactions'
  import Campaign from './campaign'
  import ShortCut from './shortcut'
  import AvailableCampaign from './available-campaign'
  import PointsSummary from './pointsSummary'
  import VClamp from 'vue-clamp'
  import moment from 'moment'
  import {
    getMemberInfo,
    getMemberPoint,
    getMemberSNSList
  } from '@/api/member'
  import { view404 } from '@/api/api'
  import {
    date
  } from '@/utils'
  import { checkObjHasOwnProperty, isBHGLoginUser, dateConversion } from '@/utils'
  import {
    signMix
  } from '@/utils'
  export default {
    components: {
      AvailableCampaign,
      Transactions,
      Campaign,
      ShortCut,
      VClamp,
      PointsSummary
    },
    data() {
      return {
        redeemable_on: '',
        expires_on: '',
        earned_points: 0,
        redeemable_points: 0,
        loading: true,
        expire_data: {},
        card_body_style: { padding: 0 },
        recent_purchase_date: '',
        tags: [
          { name: 'Moisturizing', color: '#55A8FF', bgColor: '#ECF5FF' },
          { name: 'Skin whitening', color: '#78C850', bgColor: '#ECF6E8' },
          { name: 'Active', color: '#E7A444', bgColor: '#FCF6EB' },
          { name: 'Sensitive skin', color: '#F67C7C', bgColor: '#F7EAEA' },
          { name: 'Sensitive skin', color: '#6BE2E3', bgColor: '#c2f9d3' }
        ],
        params_member_code: '',
        member_info: '',
        account_info: {},
        weChatBindState: 0,
        is_bhg_user: false
      }
    },
    created() {
      this.params_member_code = this.$route.params.id
      if (this.params_member_code) {
        this.init()
        // this.getSNSWeChatInfo()
      } else {
        this.$router.push(view404)
      }
      if (this.isBHGLoginUser()) {
        this.is_bhg_user = true
      }
    },
    methods: {
      dateConversion,
      isBHGLoginUser,
      signMix,
      date,
      async init() {
        await this.getMemberDetail()
        await this.getMemberPoint()
      },
      handleUnitDate(val) {
        const data = ['day', 'month', 'year']
        return this.handleGlobalI18n('member', data[val - 1]).toLowerCase()
      },
      getSNSWeChatInfo() {
        getMemberSNSList({ member_code: this.params_member_code, sns_binding_type_code: 'wechat', page_no: 1, page_size: 1 }).then(res => {
          const result = res.return_result
          if (!checkObjHasOwnProperty(result, 'sns_bindings')) {
            return false
          }
          const data = result.sns_bindings
          if (data.length > 0) {
            this.weChatBindState = data[0].binding_status
          }
        })
      },
      getLatestPurchaseDate(val) {
        this.recent_purchase_date = val
      },
      getMemberDetail() {
        return getMemberInfo(this.params_member_code).then((response) => {
          this.member_info = response.return_result
        }).catch(res => {
          this.$message.error = res
          this.loading = false
        })
      },
      getMemberPoint() {
        return getMemberPoint({ member_code: this.params_member_code }).then(res => {
          var result = res.return_result
          var point_account_list = result.point_account_balances
          if (point_account_list !== null) {
            this.account_info = point_account_list[0]
            this.expire_data = result.member_expired_point || {}
          }
          if (this.isBHGLoginUser()) {
            const account_length = point_account_list.length
            for (let i = 0; i < account_length; i++) {
              if (point_account_list[i].account_type_code === 'current_period') {
                this.earned_points = point_account_list[i].account_point_balance || 0
                this.redeemable_on = moment(moment(new Date(point_account_list[i].expired_date).valueOf()).format()).format('DD/MM/YYYY')
              } else if (point_account_list[i].account_type_code === 'past_period') {
                this.redeemable_points = point_account_list[i].account_point_balance || 0
                this.expires_on = this.dateConversion((point_account_list[i].expired_date).substring(0, 10))
              }
            }
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .member-details {
    margin: 25px;
    .header {
      height: 40px!important;
      background-color: rgba(255, 255, 255, 1);
      color: #666666;
      line-height: 40px;
    }
    .container {
      margin-top: 25px;
    }
    .aside {
      width: 30%;
      .member-info {
        background-color: rgba(255, 255, 255, 1);
        text-align: center;
        padding: 20px;
        .member-img {
          margin: auto;
          margin-top: 45px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-bottom: 10px;
          img{
            border-radius: 50%;
            width: 100%;
            height:100%;
          }
        }
        position: relative;
        .member-register-channel{
          position: absolute;
          top:10px;
          left:0;
          color: #ffffff;
          height: 26px;
          line-height: 16px;
          font-size:12px;
          p {
            label, span{
              padding:0 20px 0 10px;
            }
            border: 1px solid #ffffff;
            border-right-color: #FD9899;
            border-left-color: #FD9899;
            background-color: #FD9899;
            position: relative;
            &:after {
              content: '';
              top: 4px;
              right: -12.5px;
              position: absolute;
              width: 24px;
              height: 24px;
              border-width: 1px;
              border-style: solid;
              background-color: #ffffff;
              border-color: #ffffff #ffffff transparent transparent;
              transform: rotate(45deg);
            }
          }
        }
        .expire-remind{
          p{
            text-align: left;
            border-radius: 3px;
            background: $primary;
            line-height: 1.2;
            color: #fff;
            padding: 10px 5px;
            font-size: 15px;
          }
        }
        .grade{
          margin:15px 0;
          display: flex;
          height: 24px;
          justify-content: center;
          img{
            height: 24px;
          }
          .gold{
            flex: auto;
            position: relative;
            background-color: $primary;
            border-radius: 3px;
            img{
              border-radius: 3px;
              position: absolute;
              left:0;
            }
            span{
              position: absolute;
              top:4px;
              left:0;
              right: 0;
              margin: 0 auto;
              color: rgba(255, 255, 255, 1);
              font-size: 16px;
            }
          }
          .points {
            padding:0 10px;
            line-height: 24px;
            margin-left: 20px;
            border-radius: 3px;
            background-color: $primary;
            color: rgba(255, 255, 255, 1);
            font-size: 16px;
            text-align: center;
            border: 1px solid $primary;
          }
        }
        .member_username {
          font-size: 18px;
          color: rgba(16,16,16,1);
          label{
            vertical-align: 20%;
          }
          img{
            width: 22px;
          }
          /deep/ {
            span {
              display: inline-block;
              width: 100%;
              &:nth-last-of-type(1) {
                word-break: break-all;
              }
            }
          }
        }

        .tags {
          text-align: left;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          label {
            margin-top:10px;
            &:not(:first-child){
              margin-left:5px;
            }
            padding: 4px 6px;
            background-color: rgba(242, 242, 242, 1);
            border-radius: 6px;
            font-size: 14px;
            color: #999999;
          }
        }
      }
      .info {
        background-color: #f3f6fb;
        padding: 10px;
        font-size:16px;
        li {
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          height: 45px;
          line-height: 45px;
          &:not(:last-child){
            border-bottom: 1px solid #bbbdbf;
          }
          label {
            font-weight: bold;
          }
        }
      }
      .recommend-products{
        background-color: #ffffff;
        text-align: center;
        padding:15px;
        .list-pic{
          margin:10px;
        }
        .el-carousel__item h3 {
          color: #475669;
          font-size: 18px;
          opacity: 0.75;
          line-height: 200px;
          margin: 0;
        }

        .el-carousel__item:nth-child(2n) {
          background-color: #99a9bf;
        }

        .el-carousel__item:nth-child(2n+1) {
          background-color: #d3dce6;
        }
        .label{
          font-weight: bold;
        }
      }
    }
    .main {
      //min-width: 1000px;
      margin-left: 20px;
      padding:0;
      overflow-x: hidden;
     }
    .point-bhg{
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      color: #ffffff;
      .earned-points{
        border-radius: 3px;
        flex: 0 0 48%;
        background-color: $primary;
        label{
          display: block;
        }
        p{
          margin-top: 7px;
          margin-bottom: 5px;
        }
        label{
          display: block;
          margin-top: 5px;
        }
      }
      .redeemable-points{
        @extend .earned-points;
      }
    }
  }
</style>
