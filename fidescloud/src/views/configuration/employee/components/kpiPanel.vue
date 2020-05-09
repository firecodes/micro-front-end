<template>
  <div>
    <h3 class="h3"><span>{{ handleGlobalI18n('employee', 'mgt_home_kpi_section_title') }}</span></h3>
    <el-row class="kpi-items" :gutter="18">
      <el-col :lg="{span:12}">
        <div class="kpi-item kpi-item-1">
          <div class="kpi-item-con">
            <h6 class="kpi-item-tit"><span>{{ handleGlobalI18n('employee', 'mgt_home_kpi_1st_section_title') }}</span></h6>
            <div class="kpi-item-con-box">
              <div class="kpi-item-con-left">
                <div>
                  <p>
                    <span v-if="kpis.existing_member_sales !== 0 && kpis.existing_member_sales !== 0">{{kpis.currency_type}}</span><em>{{parseFloat((kpis.existing_member_sales + kpis.new_member_sales).toFixed(2))|toFixed}}</em>
                  </p>
                </div>
              </div>
              <div class="kpi-item-con-right">
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_1st_item1_label') }}
                  <span>{{kpis.new_member_sales|unit(kpis.currency_type)}}</span>
                </p>
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_1st_item2_label') }}
                  <span>{{ kpis.member_sales_contribution|toFixed }}%</span>
                </p>
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_1st_item3_label') }}
                  <span>{{ kpis.rate_of_member_purchase_twice|toFixed }}%</span>
                </p>
              </div>
            </div>  
          </div>
        </div>
      </el-col>
      <el-col :lg="{span:12}">
        <div class="kpi-item kpi-item-2">
          <div class="kpi-item-con">
            <h6 class="kpi-item-tit"><span>{{ handleGlobalI18n('employee', 'mgt_home_kpi_2nd_section_title') }}</span></h6>
            <div class="kpi-item-con-box">
              <div class="kpi-item-con-left">
                <div>
                  <p>{{kpis.new_members}}</p>
                </div>
                <i>{{ handleGlobalI18n('employee', 'mgt_home_kpi_2nd_main_label') }}</i>
              </div>
              <div class="kpi-item-con-right">
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_2nd_item1_label') }}
                  <span>{{ kpis.rate_of_active_member|toFixed }}%</span>
                </p>
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_2nd_item2_label') }}
                  <span>{{kpis.rate_of_member_social_media_binding|toFixed}}%</span>
                </p>
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_2nd_item3_label') }}
                  <span>{{kpis.rate_of_member_retention|toFixed}}%</span>
                </p>
              </div>
            </div>  
          </div>
        </div>
      </el-col>
      <el-col :lg="{span:12}">
        <div class="kpi-item kpi-item-3">
          <div class="kpi-item-con">
            <h6 class="kpi-item-tit"><span>{{ handleGlobalI18n('employee', 'mgt_home_kpi_3rd_section_title') }}</span></h6>
            <div class="kpi-item-con-box kpi-item-con-box2">
              <div class="kpi-item-con-left">
                <div>
                  <p>{{kpis.average_items|toFixed}}</p>
                </div>
              </div>
              <div class="kpi-item-con-right">
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_3rd_item1_label') }}
                  <span>{{kpis.average_items_of_member|toFixed}}</span>
                </p>
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_3rd_item2_label') }}
                  <span>{{kpis.average_items_of_non_member|toFixed}}</span>
                </p>
              </div>
            </div>  
          </div>
        </div>
      </el-col>
      <el-col :lg="{span:12}">
        <div class="kpi-item kpi-item-4">
          <div class="kpi-item-con">
            <h6 class="kpi-item-tit"><span>{{ handleGlobalI18n('employee', 'mgt_home_kpi_4th_section_title') }}</span></h6>
            <div class="kpi-item-con-box kpi-item-con-box2">
              <div class="kpi-item-con-left">
                <div>
                  <p><span>{{kpis.average_basket|unit(kpis.currency_type)}}</span></p>
                </div>
                <i></i>
              </div>
              <div class="kpi-item-con-right">
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_4th_item1_label') }}
                  <span>{{kpis.average_basket_of_member|unit(kpis.currency_type)}}</span>
                </p>
                <p>
                  {{ handleGlobalI18n('employee', 'mgt_home_kpi_4th_item2_label') }}
                  <span>{{kpis.average_basket_of_non_member|unit(kpis.currency_type)}}</span>
                </p>
              </div>
            </div>  
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'kpi-panel',
    props: {
      kpis: { type: Object }
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .kpi-items {
    padding: 0 15px;
    background: #fff;
    .kpi-item {
      border-radius:4px;
      border: 1px solid #EBECF0;
      h6 {
        font-size: 16px;
        font-family:Roboto-Medium;
        color: #4D4D4D;
        text-align: center;
        margin-bottom: 15px;
      }
    }
    .kpi-item-con {
      padding: 20px 15px;
      overflow: hidden;
      height: 150px;
      .kpi-item-con-box {
        position: relative;
        overflow: hidden;
        width: 100%;
      }
      .kpi-item-con-box2 {
        margin-top: 27px;
      }
      .kpi-item-con-left {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translate3d(0%, -50%, 0);
        max-width: 40%;
        color: #4D4D4D;
        div {
          text-align: center;
        }
        p {
          font-size: 26px;
        }
        i {
          display: block;
          // color: #999;
          text-align: center;
        }
      }
      .kpi-item-con-right {
        float: right;
        font-size: 14px;
        // color: #999;
        color: #4D4D4D;
        line-height: 1.75;
        p {
          text-align: right;
        }
        p:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  @media only screen and (max-width: 1920px) {
   .kpi-items { 
    //  margin-bottom: -15px;
      .kpi-item {
        margin-bottom: 15px;
      }
    }
  }
  .h3 {
      height: 50px;
      background-color: #ffffff;
      position: relative;
      color: #409EFF !important;
      span {
        position: relative;
        top: 18px;
        left: 13px;
      }
    }
    .h3::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 3px;
      top: 17px;
      left: 0;
      background: #409EFF;
    }
</style>
