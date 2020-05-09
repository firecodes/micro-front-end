<!--campaign setting-->
<template>
  <div class="campaign-setting">
    <div class="steps">
      <template v-for="(item,index) in steps">
        <div class="tab" :class="{'select':tabsState>=item.id}">
          <div class="num"><span>{{item.id}}</span></div>
          <label>{{handleGlobalI18n('campaign', item.value)}}</label>
        </div>
        <div class="arrow" v-show="index<steps.length-1">
          <svg-icon icon-class="arrow_down"></svg-icon>
        </div>
      </template>
    </div>
    <div v-loading = "loading">
      <keep-alive >
        <component
          :is="typeTabComponent"
          @selectTabs="selectTabs"
          @selectCampaignType="selectCampaignType"
          :campaign_type="campaign_type"
          :campaign_wizard_id="campaign_wizard_id"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  import Complete from './complete/index'
  import BasicInfo from './basic-info/index'
  import Reward from './reward/index'
  import Communication from './communication/index'
  import { getCampaignWizardInfo } from '@/api/campaign'
  const steps = [
    { value: 'basic_info_target', id: 1 },
    { value: 'reward', id: 2 },
    { value: 'communication', id: 3 },
    { value: 'complete', id: 4 }
  ]
  export default {
    data() {
      return {
        loading: false,
        steps: steps,
        tabsState: 1,
        campaign_type: '',
        campaign_wizard_id: '',
        edit_info: {
          state: false,
          id: null
        }
      }
    },
    components: {
      Complete,
      BasicInfo,
      Reward,
      Communication
    },
    computed: {
      typeTabComponent() {
        if (this.tabsState === 1) {
          return 'basic-info'
        } else if (this.tabsState === 2) {
          return 'reward'
        } else if (this.tabsState === 3) {
          return 'communication'
        } else {
          return 'complete'
        }
      }
    },
    created() {
      const query = this.$route.query
      this.loading = false
      this.setAdd({})
      this.setEdit({})
      if (query.hasOwnProperty('edit_state') && query.hasOwnProperty('edit_cam_id')) {
        this.edit_info = { state: query.edit_state, id: query.edit_cam_id }
        this.loading = true
        this.getDetail()
      }
    },
    methods: {
      getDetail() {
        getCampaignWizardInfo({ compaign_wizard_id: this.edit_info.id }).then(res => {
          setTimeout(() => {
            this.loading = false
          }, 1000)
          const result = res.return_result
          this.setEdit(Object.assign({}, this.edit_info, { detail: result }))
          this.selectCampaignType({ campaign_type: result.communication_type_code.toString(), campaign_wizard_id: parseInt(this.edit_info.id) })
          // var step = result.step
          // if (step === 5) {
          //   step = 1
          // }
          // this.tabsState = step
        }).catch(() => {
          this.loading = false
        })
      },
      selectTabs(id) {
        this.tabsState = id
      },
      selectCampaignType(obj) {
        this.campaign_type = obj.campaign_type
        this.campaign_wizard_id = obj.campaign_wizard_id
      },
      ...mapMutations({
        setEdit: 'SET_EDIT',
        setAdd: 'SET_ADD'
      })
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .campaign-setting {
    margin: 20px 25px 25px 25px;
    .steps {
      background-color: #ffffff;
      display: flex;
      align-items: center;
      padding: 14px 20px;
      .arrow {
        font-size: 25px;
        margin: 0 30px;
        color: #E5E5E5;
      }
      .tab {
        display: flex;
        align-items: center;
        label {
          color: rgba(229, 229, 229, 1);
          font-size: 16px;
        }
        .num {
          width: 25px;
          height: 25px;
          line-height: 23px;
          background-color: rgba(229, 229, 229, 1);
          color: rgba(255, 255, 255, 1);
          font-size: 16px;
          border-radius: 50%;
          text-align: center;
          border: 1px solid rgba(229, 229, 229, 1);
          margin-right: 10px;
        }
      }
      .select {
        .num {
          background-color: $primary;
          border: 1px solid $primary;
        }
        label {
          color: $primary;
        }
      }
    }
  }

</style>
