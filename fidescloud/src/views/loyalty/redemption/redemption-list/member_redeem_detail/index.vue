<template>
  <div class="member-redeem-detail">
    <back-button></back-button>
    <div class="detail" v-loading="listLoading">
       <div class="redeem_info">
            <el-row>
                <el-col :xs="12" :sm="12" :lg="8">
                    <div class="piece">
                        <label>{{handleGlobalI18n('loyalty', 'redemption_event_name')}}:</label>
                        <p>{{detail.redemtion_event_name || table_placeholder}}</p>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="8">
                    <div class="piece">
                        <label>{{handleGlobalI18n('loyalty', 'create_date')}}:</label>
                        <p>{{globalData.formatDate((detail.generate_time).substring(0, 10))}}</p>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="8">
                    <div class="piece">
                        <label>{{handleGlobalI18n('loyalty', 'start_date')}}:</label>
                        <p>{{globalData.formatDate((detail.effective_from_time).substring(0, 10))}}</p>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="8">
                    <div class="piece">
                        <label>{{handleGlobalI18n('loyalty', 'end_date')}}:</label>
                        <p>{{globalData.formatDate((detail.effective_to_time).substring(0, 10))}}</p>
                    </div>
                </el-col>
            </el-row>
            <div class="dashed"></div>
            <el-row>
                <el-col :xs="12" :sm="12" :lg="8">
                    <div class="piece">
                        <label>{{handleGlobalI18n('loyalty', 'member_code')}}:</label>
                        <p>{{detail.member_code}}</p>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="8">
                    <div class="piece">
                        <label>{{handleGlobalI18n('loyalty', 'member_name')}}:</label>
                        <p>{{detail.member_name}}</p>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="8">
                    <div class="piece">
                        <label>{{handleGlobalI18n('loyalty', 'redemption_date')}}:</label>
                        <p>{{globalData.formatDate((detail.order_time).substring(0, 10))}}</p>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="8">
                    <div class="piece">
                        <label>{{handleGlobalI18n('loyalty', 'address')}}:</label>
                        <p>{{detail.address}}</p>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="8">
                  <div class="piece">
                    <label>{{handleGlobalI18n('loyalty', 'status')}}:</label>
                    <p>{{handleStatus(detail.status)}}</p>
                  </div>
                </el-col>
              <el-col :xs="12" :sm="12" :lg="8" v-if="detail.status === 3">
                <div class="piece">
                  <label>{{handleGlobalI18n('loyalty', 'cancel_date')}}:</label>
                  <p>{{globalData.formatDate((detail.modify_date).substring(0, 10))}}</p>
                </div>
              </el-col>
            </el-row>
       </div>
       <div class="redeem-gift">
           <p>Redeem Gift:</p>
           <el-table :data="detail.gift_details"  highlight-current-row border :empty-text="$t('member.fc_table_no_data_label')">
                <el-table-column prop="gift_name" align="center" :label="handleGlobalI18n('loyalty', 'gift_name')"></el-table-column>
                <el-table-column prop="gift_code" align="center" :label="handleGlobalI18n('loyalty', 'gift_code')"></el-table-column>
                <el-table-column prop="points" align="center" :label="handleGlobalI18n('loyalty', 'redemption_points')"></el-table-column>
                <el-table-column prop="quantity" align="center" :label="handleGlobalI18n('loyalty', 'number')">
                    <template slot-scope="scope">
                        {{`* ${scope.row.quantity}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="total_points" align="center" :label="handleGlobalI18n('loyalty', 'total_points')">
                    <template slot-scope="scope">
                        {{scope.row.points * scope.row.quantity}}
                    </template>
                </el-table-column>
            </el-table>
       </div>
       <div class="redeem-coupon">
           <p>Redeem Coupon:</p>
           <el-table :data="detail.coupon_details"  highlight-current-row border :empty-text="$t('member.fc_table_no_data_label')">
                <el-table-column prop="coupon_name" align="center" label="Coupon Name"></el-table-column>
                <el-table-column prop="coupon_code" align="center" label="Coupon Code"></el-table-column>
                <el-table-column prop="points" align="center" label="Redeem Points"></el-table-column>
                <el-table-column prop="quantity" align="center" label="Number">
                    <template slot-scope="scope">
                        {{`* ${scope.row.quantity}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="total_points" align="center" label="Total Points">
                    <template slot-scope="scope">
                        {{scope.row.points * scope.row.quantity}}
                    </template>
                </el-table-column>
            </el-table>
       </div>
      <!--<section style="width: 100%; text-align: right; margin-top: 20px;" v-show="detail.status === 1" @click="cancelRedemption">-->
      <section style="width: 100%; text-align: right; margin-top: 20px;" v-show="detail.status === 1"  @click="cancelRedemption">
        <el-button :loading="cancel_loading" v-allow="'cancel_redemption'">{{handleGlobalI18n('member', 'cancel_redemption')}}</el-button>
      </section>
    </div>
  </div>
</template>
<script>
  import BackButton from '@/components/BackButton'
  import { mapGetters, mapMutations } from 'vuex'
  import { setRedeemComponentId as setComponentSession } from '@/utils/auth'
  import { redeemStatus } from '../mixin'
  import { cancelRedemptionOrder } from '@/api/redemption'
  import { DateTime } from 'luxon'
  export default {
    mixins: [redeemStatus],
    components: {
      BackButton
    },
    data() {
      return {
        listLoading: true,
        detail: {},
        cancel_loading: false
      }
    },
    computed: {
      ...mapGetters([
        'redeem_detail'
      ])
    },
    created() {
      this.listLoading = false
      this.detail = this.redeem_detail
    },
    methods: {
      ...mapMutations({
        setRedeemComponentId: 'SET_REDEEM_COMPONENT_ID'
      }),
      cancelRedemption() {
        if (this.detail.status !== 1) {
          return false
        }
        // alert
        this.$confirm(this.handleGlobalI18n('validation', 'confirm_cancel_redemption'))
          .then(_ => {
            this.cancel_loading = true
            var current_time = DateTime.local().toISO()
            cancelRedemptionOrder({ current_time: current_time, member_code: this.detail.member_code, redeem_code: this.detail.redeem_code }).then(res => {
              this.cancel_loading = false
              this.detail.status = 3
              this.detail.modify_date = current_time
            }).catch(_ => {
              this.cancel_loading = false
            })
          })
          .catch(_ => {})
      }
    },
    beforeRouteLeave(to, from, next) {
      this.setRedeemComponentId('1')
      setComponentSession('1')
      next()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .member-redeem-detail {
    margin: 20px;
    .detail{
        margin-top: 20px;
        width: 100%;
        background-color: #fff;
        padding: 22px;
        .redeem_info{
            width: 100%;
            background-color: #f9f9f9;
            padding: 18px 23px 23px 23px;
        }
        .dashed{
            margin-top: 10px;
            width: 100%;
            border:1px dashed #BBBBBB;
        }
        .piece{
            line-height: 35px;
            display: flex;
            font-size: 16px;
             label{
                 min-width: 200px;
                 text-align: right;
                 font-weight: bold;
             }
            p{
                padding-left:10px;
                color: rgba(16, 16, 16, .7);
            }
        }
    }
    .redeem-gift,.redeem-coupon {
        margin-top: 20px;
        p{
            margin-bottom: 10px;
            color: rgba(16, 16, 16, 1);
            font-size: 16px;
            font-weight: bold;
        }
        .el-table{
           //  max-width: 1170px;
        }
    }
  }
</style>
