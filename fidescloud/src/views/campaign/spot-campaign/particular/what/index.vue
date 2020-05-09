<template>
  <div class="spot_campaign__what" ref="what" v-loading="what_loading">
    <ed-form>
      <el-form :model="form" :rules="rules" label-position="left" label-width="280px" ref="what">
        <!--Reward type-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_what_reward_label')">
          <el-select :loading="type_list_loading"  v-model="form.reward_type">
            <el-option :key="item.campaign_type_id" :label="item.campaign_type_name_resource_key ? $t(`campaign.${item.campaign_type_name_resource_key}`) : item.campaign_type_name" :value="item.campaign_type_id" v-for="item in reward_type_list" />
          </el-select>
        </el-form-item>
        <component :is="handleComponent()" :ref="handleComponent()" :reward="reward"/>
      </el-form>
    </ed-form>
  </div>
</template>
<script>
  import MultiplePoint from './multiple-points'
  import BonusPoints from './bonus-points'
  import CouponComponent from './coupon'
  import { getCampaignTypeInfo } from '@/api/campaign'
  import { addOrUpdateCampaignRewardMixin } from '@/views/data/add_or_update_campaign_reward'
  export default {
    mixins: [addOrUpdateCampaignRewardMixin],
    props: {
      form_data: {
        type: Object
      },
      campaign_wizard_id: {
        type: String | Number
      }
    },
    watch: {
      form_data() {
        this.init()
      }
    },
    components: {
      CouponComponent,
      MultiplePoint,
      BonusPoints
    },
    data() {
      return {
        what_loading: true,
        type_list_loading: true,
        reward_type_list: [],
        form: {
          reward_type: null
        },
        rules: {},
        reward: {}
      }
    },
    created() {
      // 获取reward 列表
      this.getCampaignRewardTypeList()
      // 应该先获取reward 列表再初始化
    },
    methods: {
      init() {
        this.reward = this.form_data.reward ? JSON.parse(this.form_data.reward) : null
        if (!this.reward) {
          return true
        }
        var campaign_type = this.form_data.campaign_type.toLowerCase()
        if (campaign_type.indexOf('default') > -1 || this.form_data.campaign_type_code === 1) {
          return true
        }
        this.form.reward_type = this.form_data.campaign_type_code.toString()
      },
      // 获取奖励列表
      getCampaignRewardTypeList() {
        getCampaignTypeInfo().then(res => {
          this.type_list_loading = false
          // 特殊 处理 （去掉default , gift）
          var list = res.return_result
          var campaign_type_name = ''
          for (var item of list) {
            campaign_type_name = (item.campaign_type_name || '').toLowerCase()
            if (campaign_type_name.indexOf('communication') > -1 || campaign_type_name.indexOf('multiple') > -1 || campaign_type_name.indexOf('coupon') > -1 || campaign_type_name.indexOf('bonus') > -1) {
              this.reward_type_list.push(item)
            }
            if (campaign_type_name.indexOf('communication') > -1) {
              this.form.reward_type = item.campaign_type_id
            }
          }
          // 初始化数据
          this.init()
          this.what_loading = false
        }).catch(() => {
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
          this.what_loading = false
          this.type_list_loading = false
        })
      },
      // 处理显示组件
      handleComponent() {
        if (!this.form.reward_type) {
          return
        }
        for (var item of this.reward_type_list) {
          if (item.campaign_type_id === this.form.reward_type) {
            var campaign_type_name = (item.campaign_type_name || '').toLowerCase()
            if (campaign_type_name.indexOf('multiple') > -1) {
              return 'MultiplePoint'
            } else if (campaign_type_name.indexOf('coupon') > -1) {
              return 'CouponComponent'
            } else if (campaign_type_name.indexOf('bonus') > -1) {
              return 'BonusPoints'
            }
            break
          }
        }
      },
      // 保存数据
      async saveData() {
        var obj = {
          compaign_wizard_id: this.campaign_wizard_id,
          participant_limited_times: null,
          campaign_type_code: this.form.reward_type,
          purchase_amount_restriction_from: null,
          purchase_amount_restriction_to: null,
          purchase_product_category_limits: null,
          purchase_product_limits: null,
          reward_point: {},
          reward_coupon: {},
          reward_gwp: {}
        }
        var c_obj = {}
        for (var item of this.reward_type_list) {
          if (item.campaign_type_id === this.form.reward_type) {
            var campaign_type_name = (item.campaign_type_name || '').toLowerCase()
            if (campaign_type_name.indexOf('multiple') > -1) {
              await this.$refs['MultiplePoint'].saveData().then(res => {
                c_obj = res
              }).catch(res => {
                // do something
                c_obj = false
              })
              break
            } else if (campaign_type_name.indexOf('coupon') > -1) {
              c_obj = this.$refs['CouponComponent'].saveData()
              break
            } else if (campaign_type_name.indexOf('bonus') > -1) {
              await this.$refs['BonusPoints'].saveData().then(res => {
                c_obj = res
              }).catch(res => {
                // do something
                c_obj = false
              })
              break
            }
            break
          }
        }
        if (!c_obj) {
          return Promise.reject()
        }
        this.what_loading = true
        // 调用接口
        return new Promise((resolve, reject) => {
          this.saveCampaignReward(Object.assign({}, obj, c_obj)).then(res => {
            this.what_loading = false
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            resolve()
          }).catch(res => {
            this.what_loading = false
            this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
            reject(res)
          })
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spot_campaign__what{
    padding: 0 20px;
    /deep/ .el-form-item{
      margin-bottom: 0;
      min-height: 66px;
      // line-height: 66px;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(230,230,230,1);
      }
    }
    /deep/ .ed-form .el-form-item__label {
      margin-top: 15px
    }
    /deep/ .el-form-item__content {
      margin-top: 15px;
    }
    .list{
      display: flex;
      align-items: center;
      .no-limited{
        margin-left: 20px;
      }
      .svg-icon{
        cursor: pointer;
        margin-left: -24px;
        font-size: 14px;
      }
    }
    .specific_date_div{
      margin: 30px 0 15px 0;
    }
  }
</style>
