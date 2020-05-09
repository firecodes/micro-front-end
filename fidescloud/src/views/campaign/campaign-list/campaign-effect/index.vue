<!--campaign effect-->
<template>
  <div class="campaign-effect" v-loading="loading">
    <back-button style="margin-bottom:20px;"></back-button>
    <div class="item1">
      <div class="campaign-info">
        <div class="multiple-points">
          <label>{{performanceParams!=={} ? handleGlobalI18n('campaign', (performanceParams.campagin_type_name ? performanceParams.campagin_type_name.toLowerCase() : '')) : '---'}}</label>
        </div>
        <h4>{{handleGlobalI18n('campaign', 'effect_campaign_name')+ ':'}}{{performanceParams!=={} ? performanceParams.campaign_name: '---'}}</h4>
        <!--<label class="label">Campaign number:{{performanceParams!=={} ? performanceParams.campaign_code: '-&#45;&#45;'}}</label>-->
        <label class="label">{{handleGlobalI18n('campaign', 'effect_campaign_create')+ ':'}}{{performanceParams!=={} ? performanceParams.campaign_create_date: '---'}}</label>
        <!--<label class="label">Campaign Period:{{`${detail!==null ? detail.campaign_start_time.replace(/-/g, '/') : ''} - ${detail!==null ? detail.campaign_end_time.replace(/-/g, '/'): ''}`}}</label>-->
        <!--<img src="../../../../assets/images/1u2540.png" @click="toCampaignState">-->
      </div>
      <div class="campaign-details" :class="{'show':showCampaignDetails}">
        <div class="li">
          <h6>Target</h6>
          <el-row>
            <el-col :xs="6" :sm="6" :lg="6">
              <label>Gender:</label>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="6">
              <label>Age:</label>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="6">
              <label>Points:</label>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="6">
              <label>Latest purchase date:</label>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="6">
              <div class="estimate-target"><label>Estimate target：</label><span>3991</span></div>
            </el-col>
          </el-row>
        </div>
        <div class="li">
          <h6>Target</h6>
          <el-row>
            <el-col :xs="6" :sm="6" :lg="6">
              <label>Multiple ratio:</label><span>2.0</span>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="6">
              <label>Maximum :</label><span>2000</span>
            </el-col>
          </el-row>
        </div>
        <div class="li">
          <h6>Communication</h6>
          <el-row>
            <el-col :xs="6" :sm="6" :lg="6">
              <label>Choose channels:</label><span>SMS</span>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="6">
              <label>Send date :</label><span>30/04/2018</span>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="12" style="opacity: 0">
              <label>Send date :</label><span>30/04/2018</span>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="14">
              <div class="member-service"><label>【member service】 today is your birthday, we will send you a gift. Please click here ~</label></div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-row class="list-li" :gutter="20">
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="detail">
          <p class="title">{{handleGlobalI18n('campaign', 'number_of_contacts')}}</p>
          <div class="bottom">
            <div class="img">
              <img src="../../../../assets/images/1.png">
            </div>
            <div class="right">
              <p>{{detail!==null ? formatMonty2(detail.no_of_contacts, 0): 0}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="detail">
          <p class="title">{{handleGlobalI18n('campaign', 'additional_sales')}}</p>
          <div class="bottom">
            <div class="img">
              <img src="../../../../assets/images/2.png">
            </div>
            <div class="right">
              <p><label>{{globalData.value.currency_symbol}}</label>{{detail!==null ? formatMonty2(detail.additional_sales) : 0}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="detail">
          <p class="title">{{handleGlobalI18n('campaign', 'return_rate')}}</p>
          <div class="bottom">
            <div class="img">
              <img src="../../../../assets/images/3.png">
            </div>
            <div class="right">
              <p>{{detail!==null && detail.return_rate !== 'NaN' ? detail.return_rate * 100 : 0}}%</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="detail">
          <p class="title">{{handleGlobalI18n('campaign', 'visit_effect')}}</p>
          <div class="bottom">
            <div class="img">
              <img src="../../../../assets/images/6.png">
            </div>
            <div class="right">
              <p><label>{{globalData.value.currency_symbol}}</label>{{detail!==null ? formatMonty2(detail.visit_effect) : 0}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="detail">
          <p class="title">{{handleGlobalI18n('campaign', 'average_basket')}}</p>
          <div class="bottom">
            <div class="img">
              <img src="../../../../assets/images/4.png">
            </div>
            <div class="right">
              <p><label>{{globalData.value.currency_symbol}}</label>{{detail!==null ? formatMonty2(detail.average_basket) : 0}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="detail">
          <p class="title">{{handleGlobalI18n('campaign', 'ab_effect')}}</p>
          <div class="bottom">
            <div class="img">
              <img src="../../../../assets/images/5.png">
            </div>
            <div class="right">
              <p><label>{{globalData.value.currency_symbol}}</label>{{detail!==null ? formatMonty2(detail.ab_effect) : 0}}</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { formatMonty2, isDWAccessKpi } from '@/utils'
  import { getPerformanceByCampaignCode } from '@/api/campaign'
  import { getCampaignKpi } from '@/api/dwKpi'
  import { mapGetters } from 'vuex'
  import BackButton from '@/components/BackButton'
  export default{
    components: {
      BackButton
    },
    data() {
      return {
        showCampaignDetails: false,
        tableData: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 }
        ],
        listLoading: false,
        code: '',
        loading: true,
        detail: null,
        wizard_id: null
      }
    },
    computed: {
      ...mapGetters([
        'performanceParams'
      ])
    },
    created() {
      const params = this.$route.params
      this.code = params.code
      this.wizard_id = params.id
      this.init()
    },
    methods: {
      formatMonty2,
      isDWAccessKpi,
      init() {
        if (this.isDWAccessKpi()) {
          this.getCampaignEffectKpi()
        } else {
          this.getDetail()
        }
      },
      getCampaignEffectKpi() {
        getCampaignKpi({ campagin_id: this.wizard_id }).then(res => {
          this.detail = res.return_result
          this.detail.no_of_contacts = this.detail.number_of_contacts
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      getDetail() {
        getPerformanceByCampaignCode({ campaign_code: this.code }).then(res => {
          this.detail = res.return_result.performance
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .campaign-effect{
    margin:25px;
    .item1{
      .campaign-info{
        height:168px;
        background-color: #f9f9f9;
        -moz-box-shadow: 0px 6px 5px rgba(204, 204, 204, 0.349019607843137);
        -webkit-box-shadow: 0px 6px 5px rgba(204, 204, 204, 0.349019607843137);
        box-shadow: 0px 6px 5px rgba(204, 204, 204, 0.349019607843137);
        position: relative;
        text-align: center;
        .multiple-points{
          position: absolute;
          left:0;
          top:10px;
          width: 171px;
          height: 42px;
          line-height: 42px;
          background: inherit;
          background-color: rgba(215, 215, 215, 1);
          border-top-right-radius: 48px;
          border-bottom-right-radius: 48px;
          text-align: center;
          label{
            font-weight: 600;
            color:#ffffff;
            font-size:14px;
          }
        }
        h4{
          padding-top:25px;
          color:#555555;
          font-size:26px;
        }
        .label{
          padding-top:30px;
          margin-top:12px;
          font-size:16px;
          color:#666666;
          display: block;
        }
        img{
          margin-top:14px;
          width: 32px;
          height:32px;
        }
      }
      .campaign-details{
        display: none;
        height:0;
        transition: height .6s ease-in-out;
        background-color: #ffffff;
        .li{
          margin:0 20px;
          text-align: center;
          padding-top:15px;
          &:not(:last-child){
            position: relative;
            &:after{
              content:'';
              position: absolute;
              width:100%;
              bottom:0;
              left:0;
              height:1px;
              background-color: #cccccc;
            }
          }
          h6{
            display: inline;
            font-weight: 700;
            color: #666666;
            font-size:14px;
            position: relative;
            &:after{
              content: "";
              position: absolute;
              bottom:-8px;
              height:3px;
              width: auto;
              left:0;
              right:0;
              margin:auto;
              background-color: #999999;
            }
          }
          .el-col{
            text-align: left;
            margin-top:30px;
            label{
              font-size:14px;
              color:#666666;
            }
          }
          .estimate-target,.member-service{
            background-color: #f2f2f2;
            height:40px;
            line-height: 40px;
            label{
              margin-left:10px;
            }
            span{
              font-weight: 700;
            }
          }
          &:first-child{
            height:160px;
          }
          &:nth-child(2){
            height:100px;
          }
          &:last-child{
            height:166px;
          }
        }
      }
    }
    .list-li{
      .detail{
        margin-top:20px;
        background-color:#ffffff;
        box-shadow:0 7px 18px rgba(188, 193, 214, 0.62);
        -webkit-box-shadow:0 7px 18px rgba(188, 193, 214, 0.62);
        -moz-box-shadow: 0 7px 18px rgba(188, 193, 214, 0.62);
        -ms-box-shadow:0 7px 18px rgba(188, 193, 214, 0.62);
        -o-box-shadow:0 7px 18px rgba(188, 193, 214, 0.62);
        .title{
          padding-top:15px;
          font-size:22px;
          color:#979795;
          margin-left:15px;
        }
        .bottom{
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top:30px;
          height:110px;
          .img{
            height:80px;
            margin:0 0 20px 20px;
          }
          img{
            width: 80px;
          }
          .right{
            p{
              color:$primary;
            }
            margin:0 20px 20px;
            label{
              font-size:20px;
              color:#666673;
              padding-right:5px;
            }
          }
        }
      }
    }
    .show{
      display: block!important;
      height:426px!important;
      /*animation:mymove 1s 1;*/
      /*-webkit-animation:mymove 1s 1; !*Safari and Chrome*!*/
      transition: height .6s ease-in-out;
    }
    @keyframes mymove
    {
      from {height:0px;opacity: 0}
      to {height:426px;opacity: 1}
    }

    @-webkit-keyframes mymove /*Safari and Chrome*/
    {
      from {height:0px;opacity: 0}
      to {height:426px;opacity: 1}
    }
    @keyframes mymove1
    {
      from {height:426px;opacity: 1}
      to {height:0px;opacity: 0}
    }

    @-webkit-keyframes mymove1 /*Safari and Chrome*/
    {
      from {height:426px;opacity: 1}
      to {height:0px;opacity: 0}
    }
  }

  @media (min-width: 1024px){
    .list-li{
      p{
        font-size:30px;
      }
    }
  }
  @media (min-width: 1366px) {
    .list-li{
      p{
        font-size:35px;
      }
    }
  }
  @media (min-width: 1440px) {
    .list-li{
      p{
        font-size:40px;
      }
    }
  }
  @media (min-width: 1680px) {
    .list-li{
      p{
        font-size:50px;
      }
    }
  }
</style>
