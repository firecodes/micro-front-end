<!--
 Recurring campaign detail
  2020/01/07
-->
<template>
  <div class="recurring_campaign_detail" v-if="info.campaign_name" v-loading = "loading">
    <section class="recurring_campaign_detail__top">
      <top-component :campaign_wizard_status = "info.campaign_wizard_status || ''" :id="query.id" :info = "info || {}" @handleRefer="handleRefer" />
    </section>
    <div class="recurring_campaign_detail__content">
      <section class="recurring_campaign_detail__detail_list">
        <section class="recurring_campaign_detail__left">
          <preview-component :communication_channels = "communication_channels" :communication_info="communication_info" />
        </section>
        <section class="recurring_campaign_detail__right">
          <detail-component :campaign_info = "info" :campaign_wizard_status = "info.campaign_wizard_status || ''" :id="query.id" />
        </section>
      </section>
      <section class="recurring_campaign_detail__estimated_budget">
        <estimated-budget-component :budge_list="budge_list" :campaign_info = "info" />
      </section>
    </div>
  </div>
</template>
<script>
  import TopComponent from './top'
  import PreviewComponent from './preview'
  import DetailComponent from './detail'
  import EstimatedBudgetComponent from './estimated-budget'
  import { getCampaignWizardInfo, getCampaignBudgeInfo } from '@/api/campaign'
  export default {
    components: {
      TopComponent, PreviewComponent, DetailComponent, EstimatedBudgetComponent
    },
    data() {
      return {
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
        }).catch(res => {
          this.loading = false
        })
      },
      getCampaignDetail() {
        return getCampaignWizardInfo({ compaign_wizard_id: this.query.id }).then(res => {
          this.info = res.return_result
          if (Object.keys(this.info).length > 0) {
            var communication = this.info.communication ? JSON.parse(this.info.communication || '') : {}
            this.communication_channels = communication.communication_channels ? communication.communication_channels[0] : {}
            this.communication_info = communication.communication_info ? communication.communication_info : {}
          }
        }).catch(res => {
          this.$message.error('Params error')
          this.$router.go(-1)
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .recurring_campaign_detail {
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
    &__estimated_budget{
      margin-top: 30px;
    }
  }
</style>
