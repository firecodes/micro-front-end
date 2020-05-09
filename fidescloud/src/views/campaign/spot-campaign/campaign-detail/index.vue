<!--
 spot campaign detail
  2020/01/07
-->
<template>
  <div class="spot_campaign_detail"  v-loading = "loading">
    <section class="spot_campaign_detail__top">
      <top-component :campaign_wizard_status = "info.campaign_wizard_status || ''" :communication_channels = "communication_channels" :communication_info="communication_info" :id="query.id" :info = "info || {}" @handleRefer="handleRefer" @refreshTestList="refreshTestList" v-if="info.campaign_name" />
    </section>
    <div class="spot_campaign_detail__content">
      <section class="spot_campaign_detail__detail_list">
        <!--Preview-->
        <section class="spot_campaign_detail__left">
          <preview-component :communication_channels = "communication_channels" :communication_info="communication_info" />
        </section>
        <!--Detail-->
        <section class="spot_campaign_detail__right">
          <detail-component :campaign_info = "info" :campaign_wizard_status = "info.campaign_wizard_status || ''" :id="query.id" v-if="info.campaign_name" />
        </section>
      </section>
      <!--Estimated budget-->
      <section class="spot_campaign_detail__estimated_budget">
        <estimated-budget-component :budge_list="budge_list" :campaign_info = "info" />
      </section>
      <!--Test group-->
      <section class="spot_campaign_detail__test_history">
        <test-history-component :id="query.id" :refresh_test_list_val="refresh_test_list_val"/>
      </section>
    </div>
  </div>
</template>
<script>
  import TestHistoryComponent from './test-history'
  import TopComponent from './top'
  import PreviewComponent from './preview'
  import DetailComponent from './detail'
  import EstimatedBudgetComponent from './estimated-budget'
  import { getCampaignWizardInfo, getCampaignBudgeInfo } from '@/api/campaign'
  export default {
    components: {
      TestHistoryComponent,
      TopComponent, PreviewComponent, DetailComponent, EstimatedBudgetComponent
    },
    data() {
      return {
        refresh_test_list_val: 0,
        loading: true,
        info: {},
        communication_channels: {},
        communication_info: {},
        budge_list: null
      }
    },
    created() {
      var query = this.$route.query
      if (query.id && query.type) {
        this.query = query
        // 调用 获取详情
        this.init()
      } else {
        this.$message.error('Params error')
        this.$router.go(-1)
      }
    },
    methods: {
      refreshTestList(val) {
        this.refresh_test_list_val = val
      },
      handleRefer() {
        this.getCampaignDetail()
      },
      async init() {
        await this.getCampaignDetail()
        await this.getBudgeInfo()
      },
      getBudgeInfo() {
        return getCampaignBudgeInfo({ campaign_wizard_id: this.query.id }).then(res => {
          this.budge_list = res.return_result
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      getCampaignDetail() {
        return getCampaignWizardInfo({ compaign_wizard_id: this.query.id }).then(res => {
          this.info = res.return_result
          if (Object.keys(this.info).length > 0) {
            const communication = this.info.communication ? JSON.parse(this.info.communication || '') : {}
            this.communication_channels = communication.communication_channels ? communication.communication_channels[0] : {}
            this.communication_info = communication.communication_info ? communication.communication_info : {}
          }
        }).catch(() => {
          this.$message.error('Params error')
          this.$router.go(-1)
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spot_campaign_detail {
    &__top{
      margin-top: 20px;
    }
    &__content{
      margin: 30px 50px;
    }
    &__detail_list{
      display: flex;
      height: auto;
    }
    &__left{
      max-width: 450px;
      min-width: 450px;
      margin-right: 20px;
      height: auto;
    }
    &__right{
      width: 100%;
    }
    &__estimated_budget, &__test_history{
      margin-top: 30px;
    }
  }
</style>
