<template>
  <div class="recurring_campaign">
    <!--top-->
    <section class="recurring_campaign__top">
      <div class="center">
        <h1>
          <svg-icon icon-class="recurring-campaign-logo" />
          <label>Recurring campaign</label>
        </h1>
        <span>Highly targeted recurring campaigns with a variety of rewards used to repeat purchase</span>
      </div>
      <!--Create campaign-->
      <create-a-campaign class="recurring_campaign__create_button" />
    </section>
    <!--Draft-->
    <draft-table />
    <!--Ongoing-->
    <ongoing-table class="margin-top-30" />
    <!--Paused-->
    <paused-table class="margin-top-30" />
    <!--Past-->
    <past-table class="margin-top-30" />
  </div>
</template>
<script>
  import DraftTable from './draft'
  import PausedTable from './paused'
  import OngoingTable from './ongoing'
  import PastTable from './past'
  import CreateACampaign from './create-campaign'
  export default {
    components: {
      CreateACampaign,
      DraftTable,
      PausedTable,
      OngoingTable,
      PastTable
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .recurring_campaign{
    margin: 20px 50px;
    text-align: center;
    .margin-top-30{
      margin-top: 30px;
    }
    &__top{
      height: 90px;
      position: relative;
      h1{
        padding-top: 15px;
        margin-bottom: 12px;
      }
      .svg-icon{
        font-size: 25px;
        color: $new-primary;
        margin-right: 6px;
      }
      label{
        letter-spacing: -1px;
        font-size:24px;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:29px;
        font-family: HelveticaNeue1-Bold;
      }
      span{
        letter-spacing: .7px;
        font-family: HelveticaNeue1;
        font-size:16px;
        color:rgba(153,153,153,1);
        line-height:18px;
      }
    }
    &__create_button{
      position: absolute;
      top: 27px;
      right: 0;

    }
  }
</style>
