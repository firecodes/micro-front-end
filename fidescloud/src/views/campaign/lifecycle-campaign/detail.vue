<template>
  <!-- campaign detail-->
  <div class="trigger-campaign-detail" >
    <!--v-if="info !== null"-->
    <section class="top">
      <div class="image">
        <svg-icon :icon-class="cam_info.icon_name" style="color: #ffffff" />
      </div>
      <div class="info">
        <h1>{{cam_info.name_resource_key ? $t(`campaign.${cam_info.name_resource_key}`) : cam_info.campaign_name}}</h1>
        <p>{{cam_info.description_resource_key ? $t(`campaign.${cam_info.description_resource_key}`) : cam_info.desc}}</p>
      </div>
      <div class="right-button">
        <img :src="handleValueImage()" alt="" />
        <el-select v-model="value" @change="changeValue()" :class="{'dcdfe6' : value === 'Paused'}">
          <!--Active-->
          <el-option :label="$t('campaign.fc_campaign_lifecycle_status_btn_active_label')" value="Active" />
          <!--Paused-->
          <el-option :label="$t('campaign.fc_campaign_lifecycle_status_btn_paused_label')" value="Paused" />
        </el-select>
      </div>
    </section>
    <section class="middle">
      <div class="wave1" :class="{'wave-checked' : click_status === 'wave1', 'dcdfe6' : !wave_status[0]}" @click="click_status = 'wave1'">
        <section class="tag">
          <label>1</label>
          <div class="line"></div>
        </section>
        <section class="name">
<!--Wave #1-->
          {{$t('campaign.fc_campaign_lifecycle_details_wave1_label')}}
        </section>
        <section class="info">
          <p>{{$t('campaign.fc_campaign_lifecycle_details_wave1_desc_label')}}</p>
          <el-switch disabled v-model="wave_status[0]" />
        </section>
      </div>
      <div class="wave2" :class="{'wave-checked' : click_status==='wave2', 'dcdfe6' : !wave_status[1]}" @click="click_status = 'wave2'">
        <section class="tag">
          <div class="line"></div>
          <label>2</label>
          <div class="line"></div>
        </section>
        <section class="name">
<!--  Wave #2-->
          {{$t('campaign.fc_campaign_lifecycle_details_wave2_label')}}
        </section>
        <section class="info">
          <p>{{$t('campaign.fc_campaign_lifecycle_details_wave2_desc_label')}}</p>
          <el-switch disabled v-model="wave_status[1]" />
        </section>
      </div>
      <div class="wave3" :class="{'wave-checked' : click_status==='wave3', 'dcdfe6' : !wave_status[2]}" @click="click_status = 'wave3'">
        <section class="tag">
          <div class="line"></div>
          <label>3</label>
        </section>
        <section class="name">
<!--  Wave #3-->
          {{$t('campaign.fc_campaign_lifecycle_details_wave3_label')}}
        </section>
        <section class="info">
          <p>{{$t('campaign.fc_campaign_lifecycle_details_wave3_desc_label ')}}</p>
          <el-switch disabled v-model="wave_status[2]" />
        </section>
      </div>
    </section>
    <div class="bottom" v-if="info !== null">
      <section class="left preview">
        <h2>{{handleGlobalI18n('campaign', 'preview')}}</h2>
        <template v-if="info.wave_list.length > 0">
          <!--iphone-->
          <div class="img iphone" v-if="info.wave_list[handleIndex()].communication_definition_list[0].kind ==='SMS'">
            <img src="../../../assets/images/iPhone-x.png" />
            <div class="content" >
              <v-clamp autoresize :max-lines="10" style="text-align: left">{{info.wave_list[handleIndex()].communication_definition_list[0].content}}</v-clamp>
            </div>
          </div>
          <!--iPad-->
          <div class="img ipad" v-else>
            <img src="../../../assets/images/iPad.png" />
            <div class="content" style="width: 85%">
              <el-scrollbar style="height:100%; width: 100%">
                <p class="center">
                  <label>To:</label>
                  <span>Target Group</span>
                </p>
                <p class="center">
                  <label>Subject:</label>
                  <span>{{info.wave_list[handleIndex()].communication_definition_list[0].email_subject}}</span>
                </p>
                <div class="line"></div>
                <p class="html" v-html="info.wave_list[handleIndex()].communication_definition_list[0].content" />
              </el-scrollbar>
            </div>
          </div>
          <div class="icon">
          <i class="el-icon-refresh" />
        </div>
        </template>
      </section>
      <section class="right">
        <h2 v-if="click_status === 'wave1'">{{$t('campaign.fc_campaign_lifecycle_details_wave1_label')}} {{handleGlobalI18n('system', 'details')}}</h2>
        <h2 v-else-if="click_status === 'wave2'">{{$t('campaign.fc_campaign_lifecycle_details_wave2_label')}} {{handleGlobalI18n('system', 'details')}}</h2>
        <h2 v-else-if="click_status === 'wave3'">{{$t('campaign.fc_campaign_lifecycle_details_wave3_label')}} {{handleGlobalI18n('system', 'details')}}</h2>
        <ul class="detail" v-if="info !== null">
          <template v-if="info.wave_list.length > 0">
            <!--when-->
            <li>
              <h4>WHEN</h4>
              <p class="line" />
              <h5>{{handleGlobalI18n('campaign', 'specific_date')}}</h5>
              <label v-if="info.wave_list[handleIndex()].when_definition !== null">
                <template v-if="cam_info.lifecycle_campaign_type === 'PROSPECT' || cam_info.lifecycle_campaign_type === 'NEW BUYER'">
                  {{`${info.wave_list[handleIndex()].when_definition.delay_value} ${handleGlobalI18n('campaign', 'lifecycle_days_after')}`}}
                </template>
                <template v-else>
                  {{`${handleGlobalI18n('campaign', 'last_purchase_happened_before')} ${info.wave_list[handleIndex()].when_definition.exec_date} ${handleGlobalI18n('campaign', 'month')}`}}
                </template>
              </label>
            </li>
            <!--who-->
            <li>
              <h4>WHO</h4>
              <p class="line" />
              <h5>{{ info.wave_list[handleIndex()].when_definition !== null ? handlerWhoOption(info.wave_list[handleIndex()].who_definition_list[0].select_type) : '' }}</h5>
              <label v-if="info !== null && info.wave_list[handleIndex()].when_definition !== null">
                <template v-if="info.wave_list[handleIndex()].who_definition_list[0].select_type === 'everyone'">
                  {{handleGlobalI18n('campaign', 'all_member_depict')}}
                </template>
                <template v-else-if="info.wave_list[handleIndex()].who_definition_list[0].select_type === 'filter'">
                  {{handleGlobalI18n('campaign', 'target_depict')}}
                </template>
              </label>
            </li>
            <!--what-->
            <li>
              <h4>WHAT</h4>
              <p class="line"></p>
              <h5>{{ info.wave_list[handleIndex()].when_definition !== null ? handlerWhatOption(info.wave_list[handleIndex()].what_reward_definition_list[0].kind) : '' }}</h5>
              <label v-if="info.wave_list[handleIndex()].when_definition !== null">
                <template v-if="info.wave_list[handleIndex()].what_reward_definition_list[0].kind === 'Communication'">
                  {{handleGlobalI18n('campaign', 'lifecycle_c_only_depict')}}
                </template>
                <template v-else-if="info.wave_list[handleIndex()].what_reward_definition_list[0].kind === 'Coupon'">
                  <!--The member will receive a {{info.wave_list[handleIndex()].what_reward_definition_list[0].coupon_name}} that will expire on {{info.wave_list[handleIndex()].what_reward_definition_list[0].expired_date}}-->
                  {{handleGlobalI18n('campaign', 'lifecycle_campaign_what_coupon')}}
                </template>
                <template v-else-if="info.wave_list[handleIndex()].what_reward_definition_list[0].kind === 'General Points'">
                  <!--The member will receive a {{info.wave_list[handleIndex()].what_reward_definition_list[0].points}} bonus points.-->
                  {{handleGlobalI18n('campaign', 'lifecycle_campaign_what_point')}}
                </template>
              </label>
            </li>
            <li>
              <h4>HOW</h4>
              <p class="line"></p>
              <h5>{{ info.wave_list[handleIndex()].when_definition !== null ? handlerHowOption(info.wave_list[handleIndex()].communication_definition_list[0].kind) : '' }}</h5>
              <label v-if="info.wave_list[handleIndex()].when_definition !== null">
                <template v-if="info.wave_list[handleIndex()].communication_definition_list[0].kind === 'SMS'">
                  {{handleGlobalI18n('campaign', 'spot_sms_depict')}}
                </template>
                <template v-if="info.wave_list[handleIndex()].communication_definition_list[0].kind === 'EDM'">
                  {{handleGlobalI18n('campaign', 'spot_edm_depict')}}
                </template>
              </label>
            </li>
          </template>
        </ul>
        <div class="button">
          <router-link tag="li" to="/campaign/lifecycle-studio/edit">
            <el-button type="primary">{{handleGlobalI18n('campaign', 'edit')}}</el-button>
          </router-link>
        </div>
      </section>
    </div>
    <el-dialog
      :visible.sync="confirm_paused_dialog"
      width="580px"
      :title="$t('loyalty.fc_operation_delete_confirm_title_label')">
      <div class="dialog">
        <h1>{{$t('campaign.fc_campaign_lifecycle_pause_popup_title_label')}}</h1>
        <p>{{$t('campaign.fc_campaign_lifecycle_pause_popup_content1_label')}}</p>
        <h5>{{$t('campaign.fc_campaign_lifecycle_pause_popup_content2_label')}}</h5>
        <div class="down-expert">
          <img src="../../../assets/images/trigger-campaign/download.png" />
          <label>{{$t('campaign.fc_campaign_lifecycle_pause_popup_btn_request_label')}}</label>
        </div>
        <div class="submit">
          <el-button @click="confirm_paused_dialog = false" class="keep-active">{{$t('campaign.fc_campaign_lifecycle_pause_popup_btn_active_label')}}</el-button>
          <el-button @click="confirm_paused_dialog = false; value='Paused';submit('DISABLE')" type="primary">{{$t('campaign.fc_campaign_lifecycle_pause_popup_btn_pause_label')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { queryTriggerCampaignById, cancelLifecycleCampaign } from '@/api/campaign'
  import { when_options, who_options, what_options, how_options } from '@/data/trigger-campaign'
  import { getLifeCycleCampaignWarzd, createLifecycleCampaign } from '@/api/lifecycleStudio'
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
        id: null,
        campaign_wizard_id: null,
        configuration: {},
        wave_status: [false, false, false],
        click_status: 'wave1'
      }
    },
    created() {
      // 获取到上一步的数据
      this.cam_info = JSON.parse(window.localStorage.lifecycle_cam_info)
      if (Object.keys(this.cam_info).length <= 0) {
        this.$router.go(-1)
      }
      this.campaign_wizard_id = parseInt(this.$route.params.id)
      this.id = this.campaign_wizard_id
      this.handleGetLifeCycleCampaignWizard()
    },
    methods: {
      handleIndex() {
        var index = 0
        switch (this.click_status) {
          case 'wave1':
            index = 0
            break
          case 'wave2':
            index = 1
            break
          case 'wave3':
            index = 2
            break
        }
        return index
      },
      handleGetLifeCycleCampaignWizard() {
        return getLifeCycleCampaignWarzd({ campaign_wizard_id: this.campaign_wizard_id }).then(res => {
          this.info = res.return_result
          if (Object.keys(this.info).length > 0) {
            this.value = this.info.status.toLowerCase() === 'submit' ? 'Active' : 'Paused'
            this.info.wave_list = this.info.wave_list === null ? [] : this.info.wave_list
            if (this.info.wave_list !== null && Object.keys(this.info.wave_list).length > 0) {
              this.info.wave_list.forEach((item, index) => {
                this.wave_status[index] = (item.is_trigger === 1)
              })
            }
          }
        })
      },
      handlerHowOption(val) {
        for (const item of how_options) {
          if (item.value === val) {
            return this.handleGlobalI18n('campaign', item.label)
          }
        }
      },
      handlerWhatOption(val) {
        for (const item of what_options) {
          if (item.value === val) {
            return this.handleGlobalI18n('campaign', item.label)
          }
        }
      },
      handlerWhoOption(val) {
        for (const item of who_options) {
          if (item.value === val) {
            return this.handleGlobalI18n('campaign', item.label)
          }
        }
      },
      handlerWhenOption(val) {
        if (this.cam_info.category === 'Reminders') {
          return this.handleGlobalI18n('campaign', 'specific_date')
        }
        for (const item of when_options) {
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
        if (status === 'DISABLE') {
          cancelLifecycleCampaign({ campaign_wizard_id: this.id }).then(() => {
            this.loading = false
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          }).catch(_ => {
            this.loading = false
            this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
          })
        } else {
          createLifecycleCampaign(Object.assign({}, this.info, { 'status': status, campaign_warzd_id: this.id })).then(() => {
            this.loading = false
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          }).catch(_ => {
            this.loading = false
            this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
          })
        }
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
  $dcdfe6: #DCDFE6;
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
          width: 90px;
        }
      }
      .keep-active{
        border-color: $primary;
        color: $primary;
        min-width: 120px;
        background-color: #ffffff;
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
            word-break: break-word;
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
    .middle{
      margin: 14px 0 17px 0;
      padding: 13px 15px;
      height: 165px;
      width: 100%;
      background: #ffffff;
      display: flex;
      .wave1, .wave2, .wave3{
        flex: percentage(1/3);
        text-align: center;
        .tag{
          margin-top: 19px;
          display: flex;
          align-items: center;
          height: 30px;
          justify-content: flex-end;
          .line{
            width: calc(50% - 15px);
            height: 3px;
            border: 1.5px solid $primary;
          }
          label{
            display: block;
            width: 30px;
            line-height: 28px;
            height: 30px;
            border-radius: 4px;
            background-color: $primary;
            color: rgba(255, 255, 255, 1);
            font-size: 18px;
            text-align: center;
            border: 1px solid $primary;
          }
        }
        .name{
          margin-top: 6px;
          line-height: 1.5;
          color: $primary;
          font-size: 18px;
        }
        .info{
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 10px;
          p{
            text-align: left;
            width: 75%;
            color: rgba(16, 16, 16, 1);
            font-size: 16px;
            line-height: 1.6;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
      .dcdfe6{
        .line{
          border-color: $dcdfe6!important;
        }
        .tag label{
          background-color: $dcdfe6!important;
          border-color: $dcdfe6!important;
        }
        .name{
          color: $dcdfe6!important;
        }
        .info p {
          color: $dcdfe6!important;
        }
      }
      .wave3{
        .tag{
          justify-content: flex-start!important;
        }
      }
      .wave2{
        margin-left: 12px;
        margin-right: 12px;
      }
      .wave-checked{
        background-color: rgba(26, 188, 156, 0.1);
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
