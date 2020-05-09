<template>
  <div class="offers">
    <ed-header-title :title="$t('member.fc_member_details_offers_section_title')"></ed-header-title>
     <el-row class="ul" :gutter="15" v-loading="loading">
      <el-col :xs="24" :sm="24" :lg="12" :xl="8">
        <!--multiple points-->
        <el-card shadow="hover" class="li" :body-style="card_body_style">
          <div class="top">
            <div class="alal">
              <div class="bg">
                <svg-icon icon-class="member_detail_multiple_points"></svg-icon>
              </div>
              <label>{{$t('member.fc_member_details_offers_points_label')}}</label>
            </div>
          </div>
          <div class="bottom">
            <div class="empty" v-if="multiple_list.length<=0">
              <svg-icon icon-class="nothing"></svg-icon>
            </div>
            <div class="skit-whitening" v-else >
                <el-carousel trigger="click" height="150px">
                  <el-carousel-item v-for="index in Math.ceil((multiple_list.length)/ 4)" :key="index">
                    <!--v-for="item in coupon_list"-->
                    <div class="skit-whitening" v-for="(item, index1) in multiple_list" v-if="index1<index*4 && index1>=(index-1)*4">
                      <label>{{`${item.campaign_name} [${item.campaign_from_date ?  globalData.formatDate((item.campaign_from_date).substring(0, 10)) : ''} - ${item.campaign_to_date ? globalData.formatDate((item.campaign_to_date).substring(0, 10)) : ''}]`}}</label>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12" :xl="8">
        <!--coupon-->
        <el-card shadow="hover" class="li" :body-style="card_body_style">
          <div class="top">
            <div class="alal">
              <div class="bg">
                <svg-icon icon-class="member_detail_coupon"></svg-icon>
              </div>
              <label>{{$t('member.fc_member_details_offers_coupon_label')}}</label>
            </div>
          </div>
          <div class="bottom">
            <div class="empty" v-if="coupon_list.length<=0">
              <svg-icon icon-class="nothing"></svg-icon>
            </div>
            <div class="skit-whitening" v-else >
              <el-carousel trigger="click" height="150px">
                <el-carousel-item v-for="index in Math.ceil((coupon_list.length)/ 4)" :key="index">
                  <!--v-for="item in coupon_list"-->
                  <div class="skit-whitening" v-for="(item, index1) in coupon_list" v-if="index1<index*4 && index1>=(index-1)*4">
                    <label>{{`${item.campaign_name} [${item.campaign_from_date ? globalData.formatDate((item.campaign_from_date).substring(0, 10)) : ''} - ${item.campaign_to_date ? globalData.formatDate((item.campaign_to_date).substring(0, 10)) : ''}]`}}</label>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12" :xl="8">
        <!--gwp-->
        <el-card shadow="hover" class="li" :body-style="card_body_style">
          <div class="top">
            <div class="alal">
              <div class="bg">
                <svg-icon icon-class="member_detail_gwp"></svg-icon>
               </div>
              <label>{{$t('member.fc_member_details_offers_gwp_label')}}</label>
            </div>
          </div>
          <div class="bottom">
            <div class="empty" v-if="gwp_list.length<=0">
              <svg-icon icon-class="nothing"></svg-icon>
            </div>
            <div class="skit-whitening" v-else >
              <el-carousel trigger="click" height="150px">
                <el-carousel-item v-for="index in Math.ceil((gwp_list.length)/ 4)" :key="index">
                  <div class="skit-whitening" v-for="(item, index1) in gwp_list" v-if="index1<index*4 && index1>=(index-1)*4">
                    <label>{{`${item.campaign_name} [${item.campaign_from_date ? globalData.formatDate((item.campaign_from_date).substring(0, 10)): ''} - ${item.campaign_to_date ? globalData.formatDate((item.campaign_to_date).substring(0, 10)) : ''}]`}}</label>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { date } from '@/utils'
  import {
    getMemberAvailableCampaign
  } from '@/api/member'
  import { checkObjHasOwnProperty } from '@/utils'
  export default {
    props: {
      member_code: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        card_body_style: { padding: 0 },
        multiple_list: [],
        coupon_list: [],
        gwp_list: [],
        loading: true
      }
    },
    mounted() {
      this.memberAvailableCampaign()
    },
    methods: {
      date,
      memberAvailableCampaign() {
        getMemberAvailableCampaign({ member_code: this.member_code }).then((res) => {
          const result = res.return_result
          this.loading = false
          if (!checkObjHasOwnProperty(result, 'member_available_campaigns')) {
            return false
          }
          const list = result.member_available_campaigns
          for (const item of list) {
            const type = item.campaign_type_code
            if (type === 'multiple_points') {
              this.multiple_list.push(item)
            } else if (type === 'coupon') {
              this.coupon_list.push(item)
            } else if (type === 'gwp') {
              this.gwp_list.push(item)
            }
          }
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-carousel__item{
    background-color: #ffffff;
  }
  .offers {
    font-size: 16px;
    .ul {
      padding: 0;
      margin-top: -15px;
      display: flex;
      flex: 1;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-col{
        &:first-child {
          .bg{
            background: #8BC34A 100%;
          }
        }
        &:nth-child(2){
          .bg{
            background: #4DC3E5 100%;
          }
        }
        &:nth-child(3){
          .bg{
            background: #FBCA0E 100%
          }
        }
      }
      .li {
        height: 210px;
        margin-top: 15px;
        background: #ffffff;
        border: 1px solid #e4e5e6;
        display: flex;
        flex-direction: column;
        position: relative;
        flex: 1;
        .bg{
          width: 36px;
          height:36px;
          border-radius: 50%;
          position: relative
        }
        .top {
          height: 52px;
          line-height: 52px;
          width: 100%;
          position: relative;
          .alal {
            padding-left:10px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
          text-align: center;
          color: #101010;
          .svg-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            color:#ffffff;
            transform: translate(-50%, -50%);
            font-size: 25px;
            margin-bottom: 10px;
          }
          label {
            margin-left: 14px;
            font-weight: bold;
            font-size: 16px;
          }
        }
        .bottom {
          padding: 0 10px 10px 10px;
          color: rgba(16, 16, 16, 1);
          .skit-whitening {
            background-color: #F3F6FB;
            &:not(:first-child) {
              margin-top: 7px;
            }
            text-align: center;
            label {
              line-height: 30px;
              font-size: 14px;
            }
          }
          .none {
            line-height: 60px;
            text-align: center;
          }
          .svg-icon{
            font-size: 80px!important;
          }
          position: relative;
          .empty{
            margin-top:60px;
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);
            font-size:70px;
            color:rgba(0,0,0,0.2)
          }
        }
      }
    }
  }
</style>
