<template>
  <ul class="redemption-analysis-statistics-list">
    <!--total redeemed points-->
    <li>
      <div class="icon">
        <svg-icon icon-class="redemption-analysis-icon3" />
      </div>
      <p>{{$t('loyalty.fc_redemption_overall_analysis_gift_points_label')}}</p>
      <label>20,000</label>
    </li>
    <!--total redeemed gifts-->
    <li>
      <div class="icon">
        <svg-icon icon-class="redemption-analysis-icon1" />
      </div>
      <p>{{$t('loyalty.fc_redemption_overall_analysis_gift_gifts_label')}}</p>
      <label>220</label>
    </li>
    <!--total participation members-->
    <li>
      <div class="icon">
        <svg-icon icon-class="redemption-analysis-icon2" />
      </div>
      <p>{{$t('loyalty.fc_redemption_overall_analysis_gift_members_label')}}</p>
      <label>120</label>
    </li>
  </ul>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .redemption-analysis-statistics-list{
    width: 100%;
    display: flex;
    justify-content: space-between;
    li{
      text-align: center;
      width: percentage(500/1570);
      height:200px;
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
      &:first-child{
        background:rgba(44,194,234,1);
      }
      &:nth-child(2){
        background: #00C8C2;
      }
      &:last-child{
        background: #5984FF;
      }
      .svg-icon{
        margin-top: 28px;
        font-size: 40px;
      }
      p{
        margin: 18px 0;
        font-size:20px;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:25px;
      }
      label{
        font-size:36px;
        font-weight:bold;
        color:rgba(255,255,255,1);
        line-height:44px;
      }
    }

  }
</style>
