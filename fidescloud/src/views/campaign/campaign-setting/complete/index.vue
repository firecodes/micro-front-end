<template>
  <div class="complete">
    <div title="Preview">
      <div class="item1">
        <div class="campaign-info">
          <div class="multiple-points">
            <label>{{handleGlobalI18n('campaign',info.campaign_type ? info.campaign_type.toLowerCase() : '')}}</label>
          </div>
          <h4>{{info.campaign_name}}</h4>
          <!--<label class="label">C001345(campaign number)</label>-->
          <label class="label">{{handleGlobalI18n('campaign', 'campaign_period')}}:{{`${info.campaign_start_date ? globalData.formatDate(info.campaign_start_date).replace(/-/g, '/') : ''} - ${info.campaign_end_date ? globalData.formatDate(info.campaign_end_date).replace(/-/g, '/'): ''}`}}</label>
        </div>
        <div class="campaign-details">
          <div class="li">
            <h6>{{handleGlobalI18n('campaign', 'target')}}</h6>
            <el-row class="line-h">
              <template v-for="item in target.target_profiles ? target.target_profiles: []">
                  <el-col :xs="24" :sm="12" :lg="8" :xl="6" v-for="item1 in item.criteria_fields" :key = "item1.criteria_field_code" v-if="item1.criteria_field_option.criteria_field_option_name">
                    <label><span style="color: #000000;font-size:16px; padding-right:5px;" >{{((handleGlobalI18n('campaign', item1.criteria_field_code)).substring(0, 1).toUpperCase()) + ((handleGlobalI18n('campaign', item1.criteria_field_code)).substring( 1))}}:</span>
                      <!---->
                      {{item1.criteria_field_option.criteria_field_option_name}}</label>
                  </el-col>
              </template>
              <el-col :xs="24" :sm="12" :lg="8" :xl="8" v-for="item in target.target_tags ? target.target_tags : []" :key="item.segmentation_type_name" v-if="item.hasOwnProperty('segmentation_values') ? item.segmentation_values.length>0 : false" >
                <label>
                  <span style="color: #000000;font-size:16px; padding-right:5px;">{{(handleGlobalI18n('campaign', item.segmentation_type_name).substring(0,1).toUpperCase()+handleGlobalI18n('campaign', item.segmentation_type_name).substring(1)).replace(/_/g, ' ')}}:</span>
                  <template v-for="(item1,index1) in item.segmentation_values">
                    {{item1.segmentation_value_name}}
                    <template v-if="(index1>=0 && index1 < item.segmentation_values.length-1)">,</template>
                  </template>
                </label>
              </el-col>
              <el-col :span="24" >
                <div class="estimate-target"><label>{{handleGlobalI18n('campaign', 'potential_reach')}}：</label><span>{{vuex_cam_info.basic.total_targets || 0}}</span></div>
              </el-col>
            </el-row>
          </div>
          <div class="li" v-if="vuex_cam_info.reward">
            <h6>{{handleGlobalI18n('campaign', 'reward')}}</h6>
            <el-row>
              <el-col :xs="12" :sm="8" :lg="6" :xl="6" v-if="vuex_cam_info.reward.reward_point.multiple_ratio && info.campaign_type === 'MULTIPLE_POINTS' ">
                <span>{{handleGlobalI18n('campaign', 'spend') + ' 1 ' + this.globalData.value.currency + ' ' + handleGlobalI18n('campaign', 'get') + ' ' + vuex_cam_info.reward.reward_point.multiple_ratio + ' ' + handleGlobalI18n('campaign', 'point')}}</span>
              </el-col>
              <el-col :xs="12" :sm="8" :lg="6" :xl="6" v-if="vuex_cam_info.reward.purchase_amount_restriction_from && vuex_cam_info.reward.purchase_amount_restriction_to">
                <label>{{handleGlobalI18n('campaign', 'transaction_amount_restriction')}}:</label><span>{{vuex_cam_info.reward.purchase_amount_restriction_from+ ' - ' + vuex_cam_info.reward.purchase_amount_restriction_to}}</span>
              </el-col>
              <el-col :xs="12" :sm="8" :lg="6" :xl="6" v-if="vuex_cam_info.reward.participant_limited_times">
                <label>{{handleGlobalI18n('campaign', 'participation_limit')}}:</label><span>{{vuex_cam_info.reward.participant_limited_times}}</span>
              </el-col>
              <el-col :xs="12" :sm="8" :lg="6" :xl="6" v-if="vuex_cam_info.reward.reward_point.limit_total_points">
                <label>{{handleGlobalI18n('campaign', 'limit_total_points')}}:</label><span>{{vuex_cam_info.reward.reward_point.limit_total_points}}</span>
              </el-col>
              <el-col :span="24" v-if="reward.reward_coupon && reward.reward_coupon.hasOwnProperty('coupon_info') && info.campaign_type === 'COUPON'">
                <label>Coupon name :</label><span>{{reward.reward_coupon.coupon_info.coupon_name}}</span>
              </el-col>
              <el-col :span="24" v-if="reward.reward_gwp && reward.reward_gwp.hasOwnProperty('coupon_info') && info.campaign_type === 'GWP'">
                  <label>GWP name :</label><span>{{reward.reward_gwp.coupon_info.coupon_name}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="li">
            <h6>{{handleGlobalI18n('campaign', 'communication')}}</h6>
            <el-row>
              <el-col :xs="6" :sm="6" :lg="6">
                <label>{{handleGlobalI18n('campaign', 'choose_channels')}}:</label><span>{{handleGlobalI18n( 'campaign', vuex_cam_info.communication.communication_channel_name) || ''}}</span>
              </el-col>
              <el-col :xs="6" :sm="6" :lg="6">
                <label>{{handleGlobalI18n('campaign', 'send_date')}} :</label><span>{{globalData.formatDate(vuex_cam_info.communication.send_date || '')}}</span>
              </el-col>
              <!--<el-col :xs="24" :sm="24" :lg="24">-->
                <!--<div class="member-service"><label v-html="vuex_cam_info.communication.communication_template_content || ''"></label></div>-->
              <!--</el-col>-->
            </el-row>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="back">{{handleGlobalI18n('campaign', 'back')}}</el-button>
        <router-link to="/campaign/campaign-list" tag="span" v-if="campaign_status === '3'">
        <el-button type="primary">{{handleGlobalI18n('campaign', 'close')}}</el-button>
        </router-link>
        <el-button type="primary" v-else :loading="submitLoading" @click="toSubmit" >{{handleGlobalI18n('campaign', 'submit')}}</el-button>
      </div>
    </div>
    <loading v-show="mixLoadingState"></loading>
  </div>
</template>

<script>
  import { getCampaignWizardInfo, submitCampaign } from '@/api/campaign'
  import { mixLoading } from '@/utils/util'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    mixins: [mixLoading],
    props: {
      campaign_wizard_id: {
        type: Number
      }
    },
    data() {
      return {
        submitLoading: false,
        form: {
          campaign_name: '',
          category_type: '',
          campaign_date_period: ''
        },
        info: {},
        target: [],
        vuex_cam_info: {},
        step: 0,
        campaign_status: '',
        reward: {}
      }
    },
    computed: {
      ...mapGetters([
        'campaign_edit',
        'campaign_add'
      ])
    },
    created() {
      this.getDetail()
      this.init()
    },
    methods: {
      init() {
        this.vuex_cam_info = this.campaign_add
      },
      ...mapMutations({
        setAdd: 'SET_ADD',
        setEdit: 'SET_EDIT'
      }),
      getDetail() {
        getCampaignWizardInfo({ compaign_wizard_id: this.campaign_wizard_id }).then(res => {
          this.handleMixLoadingStateFalse()
          this.info = res.return_result
          this.target = JSON.parse(this.info.target)
          this.reward = JSON.parse(this.info.reward)
          this.step = this.info.step
          this.campaign_status = this.info.campaign_status
        }).catch(() => {
          this.handleMixLoadingStateFalse()
        })
      },
      toSubmit() {
        this.submitLoading = true
        var _this = this
        submitCampaign({ compaign_wizard_id: this.campaign_wizard_id }).then(res => {
          this.submitLoading = false
          if (!res.return_result.success) {
            this.$notify({
              title: _this.handleGlobalI18n('system', 'error'),
              message: _this.handleGlobalI18n('validation', 'campaign_submit_error'),
              type: 'error'
            })
            return false
          } else {
            this.setAdd({})
            this.setEdit({})
            this.$router.push({
              path: '/campaign/campaign-list'
            })
          }
        }).then(() => {
          this.submitLoading = false
        })
      },
      back() {
        this.$emit('selectTabs', 3)
      }
    },
    watch: {
      campaign_add() {
        this.getDetail()
        this.init()
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .line-h{
    .el-col{
      line-height: 30px;
    }
  }
  .complete {
    margin-top:13px;
    .item1 {
      .campaign-info {
        background-color: #f9f9f9;
        position: relative;
        text-align: center;
        padding-bottom: 20px;
        .multiple-points {
          position: absolute;
          left: 0;
          top: 10px;
          width: 171px;
          height: 42px;
          line-height: 42px;
          background: inherit;
          background-color: rgba(215, 215, 215, 1);
          border-top-right-radius: 48px;
          border-bottom-right-radius: 48px;
          text-align: center;
          label {
            font-weight: 600;
            color: #ffffff;
            font-size: 14px;
          }
        }
        h4 {
          padding-top: 25px;
          color: #555555;
          font-size: 26px;
        }
        .label {
          margin-top: 12px;
          font-size: 16px;
          color: #666666;
          display: block;
        }
      }
      .campaign-details {
        background-color: #ffffff;
        .li {
          margin: 0 20px;
          text-align: center;
          padding-top: 10px;
          padding-bottom: 20px;
          &:not(:last-child) {
            position: relative;
            border-bottom: 1px solid #cccccc;
          }
          h6 {
            display: inline;
            font-weight: 700;
            color: #666666;
            font-size: 14px;
            position: relative;
            &:after {
              content: "";
              position: absolute;
              bottom: -8px;
              height: 3px;
              width: auto;
              left: 0;
              right: 0;
              margin: auto;
              background-color: #999999;
            }
          }
          .el-col {
            text-align: left;
            margin-top: 15px;
            label {
              font-size: 14px;
              color: #666666;
            }
          }
          .estimate-target, .member-service {
            background-color: #f2f2f2;
            line-height: 40px;
            label {
              margin-left: 10px;
            }
            span {
              font-weight: 700;
            }
          }
          .estimate-target{
            width: 250px;
          }
        }
      }
    }
    .dialog-footer{
      margin-top:20px;
      text-align: center;
    }
  }
</style>
