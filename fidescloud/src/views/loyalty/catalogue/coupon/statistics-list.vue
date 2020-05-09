<template>
  <ul class="redemption-analysis-statistics-list">
    <!--total redeemed points-->
    <li>
      <div>
        <p>{{$t('loyalty.fc_redemption_overall_analysis_coupon_total_redeemed_label')}}</p>
        <label>20,000</label>
      </div>
    </li>
    <!--sales with coupons-->
    <li>
      <div>
        <p>{{$t('loyalty.fc_redemption_overall_analysis_coupon_sales_label')}}</p>
        <label>$ 1,012</label>
      </div>
    </li>
    <!--average basket with coupons-->
    <li>
      <div>
        <p>{{$t('loyalty.fc_redemption_overall_analysis_coupon_ab_label')}}</p>
        <label>$ 225</label>
        <div class="tendency raise">
          <span>{{$t('loyalty.fc_redemption_overall_analysis_coupon_contrast_rate_label')}} 2.55%</span>
          <svg-icon icon-class="coupon-analysis-raise" />
        </div>
      </div>
    </li>
    <!--number of redeemed coupons-->
    <li>
      <div>
        <p>{{$t('loyalty.fc_redemption_overall_analysis_coupon_number_redeemed_label')}}</p>
        <label>1,000</label>
      </div>
    </li>
    <!--number of expense coupons-->
    <li>
      <div>
        <p>{{$t('loyalty.fc_redemption_overall_analysis_coupon_number_espensed_label')}}</p>
        <label>50</label>
      </div>
    </li>
    <!--rate of expense coupons-->
    <li>
      <div>
        <p>{{$t('loyalty.fc_redemption_overall_analysis_coupon_rate_espensed_label')}}</p>
        <label>5.0 %</label>
        <div class="tendency down">
          <span>{{$t('loyalty.fc_redemption_overall_analysis_coupon_contrast_rate_label')}} -1.55%</span>
          <svg-icon icon-class="coupon-analysis-down" />
        </div>
      </div>
    </li>
  </ul>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .redemption-analysis-statistics-list{
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li{
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: percentage(500/1570);
      height:200px;
      line-height: 200px;
      background-color: #ffffff;
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
      margin-bottom: 30px;
      p{
        font-size:20px;
        color:rgba(102,102,102,1);
        line-height:24px;
      }
      label{
        font-size:36px;
        font-weight: 500;
        color:rgba(51,51,51,1);
        line-height:44px;
        margin: 14px 0;
        display: block;
      }
      span{
        font-size:20px;
        font-weight:bold;
      }
      .tendency{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
      }
      .raise{
        color: $new-primary;
      }
      .svg-icon{
        margin-left: 6px;
        font-size: 22px;
      }
      .down{
        color: #D52B1E;
      }
    }
  }
</style>
