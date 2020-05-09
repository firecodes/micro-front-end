<template>
  <div class="campaign_particular" v-loading="loading">
    <div class="campaign_particular__operation_button">
      <!--Go back-->
      <el-button @click="click('back')" class="back" v-if="click_li === 1">{{$t('loyalty.fc_operation_btn_back_label')}}</el-button>
      <!--Previous-->
      <el-button @click="click('subtract')" class="previous" v-if="click_li > 1">{{$t('campaign.fc_operation_btn_previous_label')}}</el-button>
      <!--Next-->
      <el-button :loading="next_loading" @click="click('add')" class="next-button" type="primary">{{click_li < 4 ? $t('campaign.fc_campaign_spot_create_btn_next_label') : $t('loyalty.fc_operation_btn_save_label')}}</el-button>
    </div>
    <div class="campaign_particular__scroll">
      <el-scrollbar style="height:100%;">
        <div>
          <div class="campaign_particular__condition">
            <ed-header-title :title="form.campaign_name || table_placeholder" />
            <ul>
              <li :class="{'checked' : click_li === item.id, 'not-confirm' : !item.confirm_state }" v-for="item in switch_list">
                <label><ed-clamp :max-lines="1" autoresize>{{$t(`campaign.${item.label}`)}}</ed-clamp></label>
                <svg-icon :icon-class="item.svg_icon"/>
                <h2>{{item.title}}</h2>
                <div class="background"></div>
                <div class="none-icon"></div>
              </li>
            </ul>
          </div>
          <section class="campaign_particular__content">
            <keep-alive>
              <component :campaign_wizard_id="query.id" :click_li="click_li" :form_data="form" :is="handleComponent()" :ref="handleComponent()" />
            </keep-alive>
          </section>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
  import When from './when'
  import Who from './who'
  import What from './what'
  import How from './how'
  import { getCampaignWizardInfo } from '@/api/campaign'
  import { operationMixin } from '../operation'
  export default {
    mixins: [operationMixin],
    components: {
      When,
      Who,
      What,
      How
    },
    data() {
      return {
        next_loading: false,
        loading: true,
        switch_list: [
          // Select your time period  when
          { id: 1, label: 'fc_campaign_spot_create_module_when_desc_label', svg_icon: 'spot_campaign_switch_when', title: this.$t('campaign.fc_campaign_spot_create_module_when_label'), confirm_state: true },
          // Define your member targets who
          { id: 2, label: 'fc_campaign_spot_create_module_who_desc_label', svg_icon: 'spot_campaign_switch_who', title: this.$t('campaign.fc_campaign_spot_create_module_who_label'), confirm_state: false },
          // Chose your reward type what
          { id: 3, label: 'fc_campaign_spot_create_module_what_desc_label', svg_icon: 'spot_campaign_switch_what', title: this.$t('campaign.fc_campaign_spot_create_module_what_label'), confirm_state: false },
          // Select your communication channel how
          { id: 4, label: 'fc_campaign_spot_create_module_how_desc_label', svg_icon: 'spot_campaign_switch_how', title: this.$t('campaign.fc_campaign_spot_create_module_how_label'), confirm_state: false }
        ],
        click_li: 1,
        query: {
          id: null,
          type: ''
        },
        form: {}
      }
    },
    created() {
      // edit copy  只有这两种能进来
      const query = this.$route.query
      if (query.id && query.type) {
        this.query = query
        // 调用 获取详情
        this.handleGetWizardInfo()
      } else {
        this.$message.error('Params error')
        this.$router.go(-1)
      }
    },
    methods: {
      handleComponent() {
        if (this.click_li === 1) {
          return 'when'
        } else if (this.click_li === 2) {
          return 'who'
        } else if (this.click_li === 3) {
          return 'what'
        } else if (this.click_li === 4) {
          return 'how'
        }
      },
      handleGetWizardInfo() {
        this.loading = true
        getCampaignWizardInfo({ compaign_wizard_id: this.query.id }).then(res => {
          this.loading = false
          this.form = res.return_result || {}
        }).catch(() => {
          this.loading = false
          // 出错 返回上一页面
          this.$message.error('Params error')
          // this.$router.go(-1)
        })
      },
      suc() {
        this.switch_list[this.click_li].confirm_state = true
        this.click_li += 1
      },
      click(type) {
        if (type === 'back') {
          this.$router.go(-1)
        } else if (type === 'subtract') {
          if (this.click_li === 1) {
            return true
          }
          // 如果是从第二步回退到第一步 清除定时器和状态
          if (this.click_li === 2) {
            const who_ref = this.$refs['who']
            clearInterval(who_ref.timer)
            who_ref.calc_loading = false
          }
          this.click_li -= 1
        } else if (type === 'add') {
          // 异步执行之后执行
          this.next_loading = true
          // WHEN
          if (this.click_li === 1) {
            const when_ref = this.$refs['when']
            when_ref.saveData().then(() => {
              this.next_loading = false
              this.suc()
            }).catch(() => {
              this.next_loading = false
            })
            // WHO
          } else if (this.click_li === 2) {
            const who_ref = this.$refs['who']
            who_ref.saveData().then(() => {
              this.next_loading = false
              this.suc()
            }).catch(() => {
              this.next_loading = false
            })
            // WHAT
          } else if (this.click_li === 3) {
            const what_ref = this.$refs['what']
            what_ref.saveData().then(() => {
              this.next_loading = false
              this.suc()
            }).catch(() => {
              this.next_loading = false
            })
          // HOW
          } else if (this.click_li === 4) {
            const how_ref = this.$refs['how']
            how_ref.saveData().then(() => {
              this.next_loading = false
              // 跳转到详情页面
              this.detailRouter(this.query.id)
            }).catch(() => {
              this.next_loading = false
            })
          }
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../css/campaign_particular';
</style>
