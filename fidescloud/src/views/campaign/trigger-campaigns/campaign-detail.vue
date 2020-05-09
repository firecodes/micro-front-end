<template>
  <!-- campaign detail-->
  <div class="trigger-campaign-detail" v-if="info !== null">
    <section class="top">
      <div class="image">
        <svg-icon :icon-class="cam_info.icon_name" style="color: #ffffff"></svg-icon>
      </div>
      <div class="info">
        <h1>{{$t(`campaign.${cam_info.trigger_name}`)}}</h1>
        <p>{{$t(`campaign.${cam_info.desc}`)}}</p>
      </div>
      <div class="right-button">
        <img :src="handleValueImage()" />
        <el-select v-model="value" @change="changeValue()" :class="{'dcdfe6' : value === 'Paused'}">
          <el-option :label="$t('campaign.fc_campaign_trigger_status_active_label')" value="Active"></el-option>
          <el-option :label="$t('campaign.fc_campaign_trigger_status_paused_label')" value="Paused"></el-option>
        </el-select>
      </div>
    </section>
    <div class="bottom" v-loading="loading" >
      <section class="left preview">
        <h2>{{$t('campaign.fc_campaign_trigger_view_preview_section_label')}}</h2>
        <!--iPad-->
        <div v-if="!show"  class="img ipad">
          <img src="../../../assets/images/iPad.png">
          <div class="content" style="width: 85%" v-if="info.communication_definition_list !== null">
            <el-scrollbar style="height:100%; width: 100%">
              <p class="center">
                <label>To:</label>
                <span>Target Group</span>
              </p>
              <p class="center">
                <label>Subject:</label>
                <span>{{info.communication_definition_list.email_subject}}</span>
              </p>
              <div class="line"></div>
              <p class="html" v-html="info.communication_definition_list.content"></p>
            </el-scrollbar>
          </div>
        </div>
        <!--iphone-->
        <div v-else-if="show" class="img iphone">
          <img src="../../../assets/images/iPhone-x.png">
          <div class="content" v-if="info.communication_definition_list !== null">
            <v-clamp autoresize :max-lines="10" style="text-align: left">{{info.communication_definition_list.content}}</v-clamp>
          </div>
        </div>
        <div class="icon">
          <i class="el-icon-refresh"></i>
        </div>
      </section>
      <section class="right">
        <h2>{{$t('campaign.fc_campaign_trigger_view_details_section_label')}}</h2>
        <ul class="detail">
          <!--when-->
          <li>
            <h4>{{$t('campaign.fc_campaign_trigger_view_module_when_label')}}</h4>
            <p class="line"></p>
            <h5>{{ info !== null && info.when_definition !== null ? handlerWhenOption(info.when_definition.type) : '' }}</h5>
            <label v-if="info !== null && info.when_definition !== null">
              <template v-if="cam_info.category === 'Reminders'">
                <!--The message will be sent on {{info.when_definition.exec_date || ''}}st date of every Month-->
                {{signMix(handleGlobalI18n('campaign', 'trigger_campaign_when_1'), [info.when_definition.exec_date || ''])}}
              </template>
              <template v-else-if="info.when_definition.type === 1">
                {{handleGlobalI18n('campaign', 'trigger_campaign_when_2')}}
              </template>
              <template v-else-if="info.when_definition.type === 5">
                <!--The message will be sent instantly after {{info.when_definition.delay_value || ''}} days.-->
                {{signMix(handleGlobalI18n('campaign', 'trigger_campaign_when_3'), [Math.abs(info.when_definition.delay_value) || ''])}}
              </template>
              <template v-else-if="info.when_definition.type === 3">
                {{signMix(handleGlobalI18n('campaign', 'trigger_campaign_when_1'), [info.when_definition.exec_date || ''])}}
              </template>
              <template v-else-if="info.when_definition.type === 4">
                {{Math.abs(info.when_definition.delay_value)}} days before the occurrence
              </template>
            </label>
          </li>
          <!--who-->
          <li>
            <h4>{{$t('campaign.fc_campaign_trigger_view_module_who_label')}}</h4>
            <p class="line"></p>
            <h5>{{ info !== null && info.when_definition !== null ? handlerWhoOption(info.who_definition_list[0].select_type) : '' }}</h5>
            <label v-if="info !== null && info.when_definition !== null">
              <template v-if="info.who_definition_list[0].select_type === 'everyone'">
                {{handleGlobalI18n('campaign', 'all_member_depict')}}
              </template>
              <template v-else-if="info.who_definition_list[0].select_type === 'filter'">
                {{handleGlobalI18n('campaign', 'target_depict')}}
              </template>
            </label>
          </li>
          <!--what-->
          <li>
            <h4>{{$t('campaign.fc_campaign_trigger_view_module_what_label')}}</h4>
            <p class="line"></p>
            <h5>{{ info !== null && info.when_definition !== null ? handlerWhatOption(info.what_reward_definition_list[0].kind) : '' }}</h5>
            <label v-if="info !== null && info.when_definition !== null">
              <template v-if="info.what_reward_definition_list[0].kind === 'Communication'">
                <!--The message will be sent instantly when triggered.-->
                {{handleGlobalI18n('campaign', 'trigger_campaign_c_only_depict')}}
              </template>
              <template v-else-if="info.what_reward_definition_list[0].kind === 'Coupon'">
                <!--The member will receive a {{info.what_reward_definition_list[0].coupon_name}} that will expire on {{info.what_reward_definition_list[0].expired_date}}-->
                {{handleGlobalI18n('campaign', 'spot_campaign_coupon_depict')}}
              </template>
              <template v-else-if="info.what_reward_definition_list[0].kind === 'General Points'">
                <!--The member will receive a {{info.what_reward_definition_list[0].points}} bonus points.-->
                {{handleGlobalI18n('campaign', 'spot_campaign_m_point_depict')}}
              </template>
            </label>
          </li>
          <li>
            <h4>{{$t('campaign.fc_campaign_trigger_view_module_how_label')}}</h4>
            <p class="line"></p>
            <h5>{{ info !== null && info.when_definition !== null ? handlerHowOption(info.communication_definition_list.kind) : '' }}</h5>
            <label v-if="info !== null && info.when_definition !== null">
              <template v-if="info.communication_definition_list.kind === 'SMS'">
                {{handleGlobalI18n('campaign', 'spot_sms_depict')}}
              </template>
              <template v-if="info.communication_definition_list.kind === 'EDM'">
                {{handleGlobalI18n('campaign', 'spot_edm_depict')}}
              </template>
            </label>
          </li>
        </ul>
        <div class="button">
          <router-link tag="li" to="/campaign/trigger-studio/edit">
            <el-button type="primary">{{$t('campaign.fc_campaign_trigger_view_btn_edit_label')}}</el-button>
          </router-link>
        </div>
      </section>
    </div>
    <el-dialog
      :visible.sync="confirm_paused_dialog"
      width="580px"
      title="Confirm">
      <div class="dialog">
        <h1>Attention!</h1>
        <p>By pausing your Campaign, your Members won’t automatically receive your trigger message, that will impact your Member engagement.</p>
        <h5>Do you need support from us to help you take the better decision?</h5>
        <div class="down-expert">
          <img src="../../../assets/images/trigger-campaign/download.png" />
          <label>Request a call with a Fides Cloud Expert</label>
        </div>
        <div class="submit">
          <el-button class="keep-active" @click="confirm_paused_dialog = false">Keep active</el-button>
          <el-button type="primary" @click="confirm_paused_dialog = false; value='Paused';submit('DISABLE')">Pause</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    signMix
  } from '@/utils'
  import { queryTriggerCampaignById, submitTriggerCampaign } from '@/api/campaign'
  import { when_options, who_options, what_options, how_options } from '@/data/trigger-campaign'
  import VClamp from 'vue-clamp'
  export default{
    components: {
      VClamp
    },
    data() {
      return {
        confirm_paused_dialog: false,
        show: false, // true sms  false edm
        cam_info: null,
        info: null,
        value: 'Active',
        loading: false,
        id: null
      }
    },
    created() {
      // 获取到上一步的数据
      this.cam_info = JSON.parse(window.localStorage.trigger_cam_info)
      if (Object.keys(this.cam_info).length <= 0) {
        this.$router.go(-1)
      }
      this.id = this.$route.params.id
      this.detail()
    },
    methods: {
      signMix,
      handlerHowOption(val) {
        for (var item of how_options) {
          if (item.value === val) {
            return this.handleGlobalI18n('campaign', item.label)
          }
        }
      },
      handlerWhatOption(val) {
        for (var item of what_options) {
          if (item.value === val) {
            return this.handleGlobalI18n('campaign', item.label)
          }
        }
      },
      handlerWhoOption(val) {
        for (var item of who_options) {
          if (item.value === val) {
            return this.handleGlobalI18n('campaign', item.label)
          }
        }
      },
      handlerWhenOption(val) {
        if (this.cam_info.category === 'Reminders') {
          return this.handleGlobalI18n('campaign', 'specific_date')
        }
        for (var item of when_options) {
          if (item.value === val) {
            return this.handleGlobalI18n('campaign', item.label)
          }
        }
      },
      detail() {
        this.loading = true
        queryTriggerCampaignById({ campaign_wizard_id: this.id }).then(res => {
          this.loading = false
          this.info = res.return_result
          if (this.cam_info.category === 'Reminders') {
            this.options = [
              { value: 1, label: 'Specific date' }
            ]
          }
          if (Object.keys(this.info).length > 0) {
            this.value = this.info.status.toLowerCase() === 'submit' ? 'Active' : 'Paused'
            if (Object.keys(this.info.communication_definition_list).length > 0) {
              this.show = this.info.communication_definition_list.kind === 'SMS'
            }
          }
          // 判断字段是否存在
          const has = Object.prototype.hasOwnProperty
          if (!has.call(this.info, 'when_definition')) {
            this.info.when_definition = null
          }
        }).catch(() => {
          this.loading = false
        })
      },
      changeValue() {
        if (this.value === 'Active') {
          this.submit('SUBMIT')
        }
        if (this.value === 'Paused') {
          this.value = 'Active'
          this.confirm_paused_dialog = true
        }
      },
      submit(status) {
        this.loading = true
        submitTriggerCampaign(Object.assign({}, this.info, { 'status': status, campaign_wizard_id: this.id, trigger_id: this.cam_info.trigger_id })).then(res => {
          this.loading = false
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
        }).catch(_ => {
          this.loading = false
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
        })
      },
      handleValueImage() {
        if (this.value === 'Active') {
          return require('../../../assets/images/active.png')
        } else {
          return require('../../../assets/images/pause.png')
        }
      }
    },
    watch: {
      value() {
        if (this.value === (this.info.status.toLowerCase() === 'submit' ? 'Active' : 'Paused')) {
          return false
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .trigger-campaign-detail{
    margin: 20px;
    .dialog{
      text-align: center;
      h1{
        color: rgba(16, 16, 16, 1);
        font-size: 18px;
      }
      p{
        margin-top: 4px;
        color: rgba(136, 136, 136, 1);
        font-size: 16px;
        text-align: left;
        line-height: 1.3;
      }
      h5{
        margin-top: 20px;
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        text-align: left;
        padding-bottom: 8px;
      }
      .down-expert{
        cursor: pointer;
        margin:13px auto;
        width: 368px;
        height: 45px;
        border-radius: 25px;
        background-color: rgba(255, 255, 255, 0);
        color: rgba(26, 188, 156, 1);
        font-size: 14px;
        text-align: center;
        border: 1px solid rgba(26, 188, 156, 1);
        img{
          width: 24px;
          height: 23px;
          margin-right: 11px;
        }
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .submit{
        text-align: center;
        margin-top: 38px;
        .el-button{
          min-width: 90px;
        }
      }
      .keep-active{
        border-color: $primary;
        color: $primary;
      }
    }
    .top{
      height: 80px;
      width: 100%;
      background-color: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      padding-left: 15px;
      position: relative;
      .image{
        width: 58px;
        height: 58px;
        line-height: 20px;
        border-radius: 8px;
        background-color: $primary;
        border: 1px solid $primary;
        position: relative;
      }
      .svg-icon{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        font-size: 36px;
      }
      .info{
        margin-left: 13px;
      }
      h1{
        color: rgba(51, 51, 51, 1);
        font-size: 26px;
        line-height: 1.2;
      }
      p{
        line-height: 1.2;
        color: $primary;
        font-size: 18px;
      }
    }
    .bottom{
      margin-top: 14px;
      display: flex;
      flex: 1;
      justify-content: space-between;
      min-height: 551px;
      h2{
        padding-top: 14px;
        @include vertical-moulding(14px)
      }
      .left{
        position: relative;
        margin-right: 20px;
        .icon{
          position: absolute;
          bottom: 3%;
          right: 5%;
          font-size: 24px;
          color: $primary;
        }
        width: 500px;
        background: #fff;
        .ipad{
          width: 311px;
          height: 438px;
          .content{
            overflow-y: hidden;
            height: 327px;
            top: 0;
            position: absolute;
            bottom:0;
            margin: 62px 24px;
            padding: 2%;
            background: #ffffff;
            label{
              color: #000;
              font-size: 14px;
              font-weight: bold;
            }
            p{
              line-height: 1.3;
              color: rgba(16, 16, 16, 1);
              font-size: 14px;
              text-align: left;
            }
            .center{
              text-align: center;
            }
            .line{
              margin: 8px 0;
              width: 100%;
              border-top: 1px solid rgba(187, 187, 187, 1);
            }
          }
        }
        .img{
          margin: 30px auto 40px auto;
          position: relative;
          img{
            width: 100%;
          }
        }
        .iphone{
          width: 226px;
          height: 441px;
          .content{
            display: inline-table;
            background: #e5e5e8;
            border-radius: 6px;
            width: 131px;
            line-height: 14px;
            color: rgba(16, 16, 16, 1);
            top: 0;
            color: #101010;
            position: absolute;
            left:0;
            margin: 85px 22px;
            padding: 4px;
            font-size: 10px;
            p{
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 10;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
      .right{
        flex: 1;
        background: #fff;
      }
      .detail{
        padding: 0 27px 0 27px;
        h4{
          padding-top: 28px;
          color: $primary;
          font-size: 14px;
          position: relative;
          display: inline-block;
          &:after{
            content: "";
            position: absolute;
            bottom: -9px;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: $primary;
          }
        }
        p{
          margin: 9px 0 14px 0;
          border-bottom: 1px solid rgba(187, 187, 187, 1);
        }
        h5{
          color: #000;
          font-size: 14px;
          margin: 12px 0 7px 0;
        }
        label{
          color: #999;
          font-size: 14px;
          line-height: 1.4;
        }
      }
      position: relative;
      .button{
        position: absolute;
        bottom: 16px;
        right: 27px;
        text-align: right;
        .el-button{
          width: 80px;
        }
      }
    }
    .right-button{
      display: flex;
      align-items: center;
      text-align: right;
      position: absolute;
      right: 27px;
      img{
        width: 32px;
        margin-left: -13px;
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .trigger-campaign-detail .ipad{
    .html img{
      width: 100%;
    }
  }
  .trigger-campaign-detail .right-button{
    width: 130px;
    input{
      border: none;
      color: $primary;
      font-size: 18px;
    }
    .dcdfe6{
      input{
        color: #DCDFE6!important;
      }
    }
    .el-select .el-input .el-select__caret{
      color: #101010;
    }
  }
  .trigger-campaign-detail{
    .el-dialog__body{
      padding: 11px 42px 32px 42px!important;
    }
  }
</style>
