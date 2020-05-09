<!--edit-->
<template>
  <div class="trigger-campaign-edit" v-loading = "loading">
    <section class="top">
      <div class="image">
        <svg-icon :icon-class="cam_info.icon_name" style="color:#ffffff" />
      </div>
      <div class="info">
        <h1>{{$t(`campaign.${cam_info.trigger_name}`)}}</h1>
        <p>{{$t(`campaign.${cam_info.desc}`)}}</p>
      </div>
    </section>
    <section class="nonius">
      <div class="item" :class="{'check-item' : nonius_id===1, 'accomplish-item' : when_state}" @click="next(1)">
        <svg-icon icon-class="trigger-when" />
        <label>{{$t('campaign.fc_campaign_trigger_edit_module_when_label')}}</label>
      </div>
      <div class="width-60" :class="{'check-arrow' : nonius_id===1, 'check-arrow1' : nonius_id === 2, 'accomplish-arrow' : when_state, 'accomplish-arrow1' : who_state}" >
        <div class="arrow"></div>
        <div class="arrow1"></div>
      </div>
      <div class="item margin-left-30" :class="{'check-item' : nonius_id===2, 'accomplish-item' : who_state}" @click="next(2)">
        <svg-icon icon-class="trigger-who" />
        <label>{{$t('campaign.fc_campaign_trigger_edit_module_who_label')}}</label>
      </div>
      <div class="width-60" :class="{'check-arrow' : nonius_id===2, 'check-arrow1' : nonius_id === 3, 'accomplish-arrow' : who_state, 'accomplish-arrow1' : what_state}">
        <div class="arrow"></div>
        <div class="arrow1"></div>
      </div>
      <div class="item margin-left-30" :class="{'check-item' : nonius_id===3, 'accomplish-item' : what_state}" @click="next(3)">
        <svg-icon icon-class="trigger-what" />
        <label>{{$t('campaign.fc_campaign_trigger_edit_module_what_label')}}</label>
      </div>
      <div class="width-60" :class="{'check-arrow' : nonius_id===3, 'check-arrow1' : nonius_id === 4, 'accomplish-arrow' : what_state, 'accomplish-arrow1' : how_state}">
        <div class="arrow" ></div>
        <div class="arrow1"></div>
      </div>
      <div class="item margin-left-30" :class="{'check-item' : nonius_id===4, 'accomplish-item' : how_state}" @click="next(4)">
          <svg-icon icon-class="trigger-how" />
          <label>{{$t('campaign.fc_campaign_trigger_edit_module_how_label')}}</label>
        </div>
    </section>
    <section class="content">
      <keep-alive>
        <!--<component-->
          <!--:ref="tabList[parseInt(nonius_id) - 1].label"-->
          <!--:nonius_id="nonius_id"-->
          <!--:form_data="form"-->
          <!--:campaign_type_id="campaign_type_id"-->
          <!--:tier_list = "tier_list"-->
          <!--:is="tabList[parseInt(nonius_id) - 1].component">-->
        <!--</component>-->
      </keep-alive>
        <when
          v-show="nonius_id === 1"
          ref="when"
          :nonius_id="nonius_id"
          :form_data="form"
          :campaign_type_id="campaign_type_id"
        />
        <who
          v-show="nonius_id === 2"
          ref="who"
          :nonius_id="nonius_id"
          :form_data="form"
          :tier_list = "tier_list"
          :campaign_type_id="campaign_type_id"
        />
        <what
          v-show="nonius_id === 3"
          ref="what"
          :nonius_id="nonius_id"
          :form_data="form"
          :campaign_type_id="campaign_type_id"
        />
        <how
          v-show="nonius_id === 4"
          ref="how"
          :nonius_id="nonius_id"
          :form_data="form"
          :campaign_type_id="campaign_type_id"
        />
    </section>
    <section class="three-button">
      <el-button v-if="nonius_id !== 1" @click="back">{{$t('campaign.fc_campaign_trigger_edit_btn_back_label')}}</el-button>
      <el-button v-if="nonius_id !== 4" @click="next(nonius_id + 1)" type="primary">{{$t('campaign.fc_campaign_trigger_edit_btn_next_label')}}</el-button>
      <el-button v-if="nonius_id === 4" type="primary" @click="submit">{{handleGlobalI18n('campaign', 'save')}}</el-button>
    </section>
    <el-dialog
      :visible.sync="save_dialog"
      width="580px"
      :title="$t('campaign.fc_operation_confirm_title_label')"> <!--Confirm-->
      <div class="dialog">
        <!--
          Congratulations your operation has been saved but it is not live yet
          Don't forget to activate the trigger campaign by clicking on the resume button
        -->
        <p v-html="$t('campaign.fc_campaign_trigger_save_popup_tips_label')" />
        <div class="submit">
          <el-button @click="handleContinue" type="primary">{{$t('campaign.fc_operation_btn_continue_label')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import When from './when'
  import Who from './who'
  import What from './what'
  import How from './how'
  import { queryTriggerCampaignById, submitTriggerCampaign, addCommunicationChannel } from '@/api/campaign'
  import { getTenantKPIByTier } from '@/api/kpi'
  // import { trigger_detail } from '@/data/trigger-campaign'
  import { DateTime } from 'luxon'
  export default {
    components: {
      When,
      Who,
      What,
      How
    },
    data() {
      return {
        communication_channel_id: null,
        communication_channel_code: null,
        campaign_type_id: null,
        id: null,
        save_dialog: false,
        when_state: false,
        who_state: false,
        what_state: false,
        how_state: false,
        cam_info: {},
        tier_list: [],
        loading: false,
        trigger_cam_info: JSON.parse(window.localStorage.trigger_cam_info),
        tabList: [
          { name: '1', label: 'when', component: 'When' },
          { name: '2', label: 'who', component: 'Who' },
          { name: '3', label: 'what', component: 'What' },
          { name: '4', label: 'how', component: 'How' }
        ],
        nonius_id: 1,
        form: {
          campaign_wizard_id: '',
          trigger_id: null,
          name: '',
          code: '',
          status: '', // 0 save 1 submit 2 disable
          when_definition: {
            code: '',
            name: '',
            type: 1, // 1  realtime 2 day 3 month
            delay_value: 0,
            exec_date: '1'
          },
          who_definition_list: [{
            code: '',
            name: '',
            select_type: 'everyone', // everyone  filter
            target_criteria: []
          }],
          what_reward_definition_list: [{
            code: '',
            max_points: 0,
            multi_coefficient: 0,
            points: 0,
            coupon_code: '',
            purchase_amount_restriction_from: 0,
            purchase_amount_restriction_to: 0,
            times: '',
            product_list: [],
            kind: 'Communication',
            expired_value: 1,
            expired_type: 1,
            duration: 1
          }],
          communication_definition_list: {
            code: '',
            name: '',
            kind: 'SMS', // sms edm
            communication_channel_code: '',
            communication_template_id: '',
            content: ''
          }
        }
      }
    },
    created() {
      // 获取到上一步的数据
      this.cam_info = JSON.parse(window.localStorage.trigger_cam_info)
      if (Object.keys(this.cam_info).length <= 0) {
        this.$router.go(-1)
      }
      if (Object.keys(this.trigger_cam_info).length < 0) {
        this.$route.go(-1)
      }
      this.campaign_type_id = this.cam_info.trigger_id
      // 初始化
      this.nonius_id = 1
      // 获取活动详细信息配置
      if (this.trigger_cam_info.campaign_wizard_id > 0) {
        this.detail()
      }
      //
      this.init()
      this.id = this.$route.params.id
    },
    methods: {
      async init() {
        await this.getTierList()
      },
      handleContinue() {
        this.save_dialog = false
        this.$router.push({ path: `/campaign/trigger-studio/detail/${this.id}` })
      },
      // 获取tier 列表
      getTierList() {
        return getTenantKPIByTier().then(res => {
          this.tier_list = res.return_result.kpis
        })
      },
      detail() {
        this.loading = true
        queryTriggerCampaignById({ campaign_wizard_id: this.trigger_cam_info.campaign_wizard_id }).then(res => {
          this.loading = false
          var result = res.return_result
          this.form = result
          const has = Object.prototype.hasOwnProperty
          if (result.when_definition === null || !has.call(result, 'when_definition')) {
            this.form.when_definition = {
              code: '',
              name: '',
              type: 1, // 1  realtime 2 day 3 month
              delay_value: 0,
              exec_date: '1'
            }
          }
          if (result.who_definition_list === null || !has.call(result, 'who_definition_list')) {
            this.form.who_definition_list = [{
              code: '',
              name: '',
              select_type: 'everyone', // everyone  filter
              target_criteria: []
            }]
          }
          if (result.what_reward_definition_list === null || !has.call(result, 'what_reward_definition_list')) {
            this.form.what_reward_definition_list = [{
              code: '',
              max_points: 0,
              multi_coefficient: 0,
              points: 0,
              coupon_code: '',
              purchase_amount_restriction_from: 0,
              purchase_amount_restriction_to: 0,
              times: '',
              product_list: [],
              kind: 'Communication',
              expired_value: 1,
              expired_type: 1,
              duration: 1
            }]
          }
          if (result.communication_definition_list === null || !has.call(result, 'communication_definition_list')) {
            this.form.communication_definition_list = {
              code: '',
              name: '',
              kind: 'SMS', // sms edm
              communication_channel_code: '',
              communication_template_id: '',
              content: ''
            }
          } else {
            this.communication_channel_code = result.communication_definition_list.communication_channel_code
          }
        }).catch(() => {
          this.loading = false
        })
      },
      // back
      back() {
        if (this.nonius_id === 1) {
          this.$router.go(-1)
        }
        --this.nonius_id
      },
      next(value) {
        // 先判断当前页面是否数据完整 否则不允许下一步
        if (this.nonius_id === 1) {
          this.when_state = true
        }
        this.nonius_id = value
        if (this.nonius_id === 4) {
          this.how_state = true
        } else if (this.nonius_id === 2) {
          this.who_state = true
        } else if (this.nonius_id === 3) {
          this.what_state = true
        }
      },
      // save
      save() {
        // how------------------------------------------------------------------------------------------
        var how_dom = this.$refs['how']
        var how_form = {
          code: this.cam_info.trigger_name,
          name: this.cam_info.trigger_name,
          kind: how_dom.form.kind,
          // communication_channel_code: this.communication_channel_code,
          communication_channel_code: null,
          communication_channel_id: this.communication_channel_id,
          communication_template_id: (function() {
            if (how_dom.form.kind === 'SMS') {
              return how_dom.options[0].template[how_dom.sms_id].id
            } else if (how_dom.form.kind === 'EDM') {
              return how_dom.options[1].template[how_dom.edm_id].id
            } else {
              return how_dom.options[2].template[how_dom.wechat_id].id
            }
          }()),
          content: (function() {
            if (how_dom.form.kind === 'SMS') {
              return how_dom.options[0].template[how_dom.sms_id].content
            } else if (how_dom.form.kind === 'EDM') {
              return how_dom.options[1].template[how_dom.edm_id].content
            } else {
              return how_dom.options[2].template[how_dom.wechat_id].content
            }
          }()),
          email_subject: ''
        }
        if (how_dom.form.kind === 'EDM') {
          how_form.email_subject = how_dom.options[1].template[how_dom.edm_id].subject
        }
        var form = {
          campaign_wizard_id: this.cam_info.campaign_wizard_id,
          trigger_id: this.cam_info.trigger_id,
          name: this.cam_info.trigger_name,
          code: this.cam_info.trigger_name,
          status: 'SAVE',
          communication_definition_list: how_form
        }
        this.form.communication_definition_list.communication_channel_code = this.communication_channel_id
        // console.log(JSON.stringify(Object.assign({ ...this.form, ...form })))
        // 调用保存
        return submitTriggerCampaign({ ...this.form, ...form }).then(res => {
          this.loading = false
          // 保存成功
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.id = res.return_result.campaign_wizard_id
          this.save_dialog = true
        }).catch(_ => {
          this.loading = false
        })
      },
      // submit
      async submit() {
        var how_dom = this.$refs['how']
        if (how_dom.sms_id === 0 && how_dom.edm_id === 0 && how_dom.options[how_dom.form.kind === 'SMS' ? 0 : 1].template.length <= 0) {
          this.$message({
            message: this.handleGlobalI18n('campaign', 'template_error'),
            type: 'warning'
          })
        } else {
          try {
            await this.handleAddCommunicationChannel()
            await this.save()
          } catch (err) {
            console.log(err)
            this.loading = false
          }
        }
      },
      handleAddCommunicationChannel() {
        this.loading = true
        var how_dom = this.$refs['how']
        return addCommunicationChannel({
          communication_channel_type_id: (function() {
            if (how_dom.form.kind === 'SMS') {
              return how_dom.options[0].id
            } else if (how_dom.form.kind === 'EDM') {
              return how_dom.options[1].id
            } else {
              return how_dom.options[2].id
            }
          }()),
          planned_sendout_date: (DateTime.local().toISO()).substr(0, 10),
          template_id: (function() {
            if (how_dom.form.kind === 'SMS') {
              return how_dom.options[0].template[how_dom.sms_id].id
            } else if (how_dom.form.kind === 'EDM') {
              return how_dom.options[1].template[how_dom.sms_id].id
            } else {
              return how_dom.options[2].template[how_dom.sms_id].id
            }
          }()),
          backend_campaign_id: this.cam_info.campaign_wizard_id === null ? 0 : this.cam_info.campaign_wizard_id
        }).then(res => {
          this.communication_channel_id = res.return_result
        }).catch(_ => {
          this.loading = false
        })
      }
    },
    watch: {
      nonius_id(new_value, old_value) {
        const cam_info = JSON.parse(window.localStorage.trigger_cam_info)
        var value = parseInt(old_value)
        if (value === 1) {
          // when----------------------------------------------------------------------------------------------------------
          var when_dom = this.$refs['when']
          var when_form = {
            code: this.cam_info.trigger_name,
            name: this.cam_info.trigger_name,
            type: when_dom.form.type,
            delay_value: when_dom.form.delay_value,
            exec_date: (when_dom.form.exec_date).toString()
          }
          if (when_form.type === 4 || when_form.type === 5) {
            when_form.delay_value = Math.abs(when_form.delay_value)
          } else if (when_form.type === 1 && cam_info.category !== 'Reminders') {
            // 当类型为instantly时 delay_value 的值传0
            when_form.delay_value = 0
          }
          this.form = Object.assign({ ...this.form, ...{ when_definition: when_form }})
        } else if (old_value === 2) {
          // who ---------------------------------------------------------------------------------------------------------
          var who_dom = this.$refs['who']
          var who_form = { name: this.cam_info.trigger_name, code: this.cam_info.trigger_name, select_type: who_dom.form.select_type, target_criteria: [] }
          if (who_form.select_type === 'filter') {
            who_form.target_criteria = [{
              'criteria_field_code': 'tiers',
              'criteria_field_name': 'tiers',
              'criteria_code': who_dom.tags.tier_code.join(','),
              'criteria_value': who_dom.tags.tier_name.join(',')
            }, {
              'criteria_field_code': 'age_from',
              'criteria_field_name': 'age',
              'criteria_code': who_dom.dialogData.age_from,
              'criteria_value': who_dom.dialogData.age_from
            }, {
              'criteria_field_code': 'age_to',
              'criteria_field_name': 'age',
              'criteria_code': who_dom.dialogData.age_to,
              'criteria_value': who_dom.dialogData.age_to
            }, {
              'criteria_field_code': 'birthday_from',
              'criteria_field_name': 'birthday',
              'criteria_code': who_dom.birthday_from,
              'criteria_value': who_dom.birthday_from
            }, {
              'criteria_field_code': 'birthday_to',
              'criteria_field_name': 'birthday',
              'criteria_code': who_dom.birthday_to,
              'criteria_value': who_dom.birthday_to
            }, {
              'criteria_field_code': 'join_date_from',
              'criteria_field_name': 'join_date',
              'criteria_code': who_dom.join_date_from,
              'criteria_value': who_dom.join_date_from
            }, {
              'criteria_field_code': 'join_date_to',
              'criteria_field_name': 'join_date',
              'criteria_code': who_dom.join_date_to,
              'criteria_value': who_dom.join_date_to
            }, {
              'criteria_field_code': 'register_store',
              'criteria_field_name': 'register_store',
              'criteria_code': who_dom.tags.register_store.value.join(','),
              'criteria_value': who_dom.tags.register_store.name.join(',')
            }, {
              'criteria_field_code': 'register_channel',
              'criteria_field_name': 'register_channel',
              'criteria_code': who_dom.tags.register_channel.value.join(','),
              'criteria_value': who_dom.tags.register_channel.name.join(',')
            }, {
              'criteria_field_code': 'lastest_purchase_date_from',
              'criteria_field_name': 'lastest_purchase_date',
              'criteria_code': who_dom.lastest_purchase_date_from,
              'criteria_value': who_dom.lastest_purchase_date_from
            }, {
              'criteria_field_code': 'lastest_purchase_date_to',
              'criteria_field_name': 'lastest_purchase_date',
              'criteria_code': who_dom.lastest_purchase_date_to,
              'criteria_value': who_dom.lastest_purchase_date_to
            }, {
              'criteria_field_code': 'average_basket_from',
              'criteria_field_name': 'average_basket',
              'criteria_code': who_dom.average_basket_from,
              'criteria_value': who_dom.average_basket_from
            }, {
              'criteria_field_code': 'average_basket_to',
              'criteria_field_name': 'average_basket',
              'criteria_code': who_dom.average_basket_to,
              'criteria_value': who_dom.average_basket_to
            }, {
              'criteria_field_code': 'average_items_from',
              'criteria_field_name': 'average_item',
              'criteria_code': who_dom.average_items_from,
              'criteria_value': who_dom.average_items_from
            }, {
              'criteria_field_code': 'average_items_to',
              'criteria_field_name': 'average_item',
              'criteria_code': who_dom.average_items_to,
              'criteria_value': who_dom.average_items_to
            }, {
              'criteria_field_code': 'purchased_product',
              'criteria_field_name': 'purchased_product',
              'criteria_code': who_dom.tags.purchased_product.value.join(','),
              'criteria_value': who_dom.tags.purchased_product.name.join(',')
            }, {
              'criteria_field_code': 'purchased_brand',
              'criteria_field_name': 'purchased_brand',
              'criteria_code': who_dom.tags.purchased_brand.value.join(','),
              'criteria_value': who_dom.tags.purchased_brand.name.join(',')
            }, {
              'criteria_field_code': 'purchased_category',
              'criteria_field_name': 'purchased_category',
              'criteria_code': who_dom.tags.purchased_category.value.join(','),
              'criteria_value': who_dom.tags.purchased_category.name.join(',')
            }, {
              'criteria_field_code': 'available_point_from',
              'criteria_field_name': 'available_point',
              'criteria_code': who_dom.available_point_from,
              'criteria_value': who_dom.available_point_from
            }, {
              'criteria_field_code': 'available_point_to',
              'criteria_field_name': 'available_point',
              'criteria_code': who_dom.available_point_to,
              'criteria_value': who_dom.available_point_to
            }, {
              'criteria_field_code': 'campaign_respondent',
              'criteria_field_name': 'campaign_respondent',
              'criteria_code': who_dom.tags.campaign_respondent.join(','),
              'criteria_value': who_dom.tags.campaign_respondent.join(',')
            }]
          }
          this.form = Object.assign({ ...this.form, ...{ who_definition_list: [who_form] }})
        } else if (old_value === 3) {
          // what---------------------------------------------------------------------------------------------------------------------
          var what_dom = this.$refs['what']
          var what_form = { code: this.cam_info.trigger_name, max_points: '', multi_coefficient: '', points: null, coupon_code: null, purchase_amount_restriction_from: '', purchase_amount_restriction_to: '', times: '', product_list: [], kind: what_dom.form.kind, expired_value: null, expired_type: null }
          if (what_form.kind === 'Double Point') {
            what_form = {
              kind: what_dom.form.kind,
              multi_coefficient: 1,
              times: parseInt(what_dom.applied_to) === 1 ? 1 : null,
              duration: parseInt(what_dom.form.duration)
            }
          } else if (what_form.kind === 'Communication') {
            // null
          } else if (what_form.kind === 'Coupon') {
            what_form = Object.assign({}, what_form, { coupon_code: what_dom.form.coupon_code })
          } else if (what_form.kind === 'General Points') {
            what_form = Object.assign({}, what_form, { points: what_dom.form.points, expired_value: what_dom.form.expired_value, expired_type: what_dom.expiry_rule_radio === 2 ? 4 : what_dom.form.expired_type })
          }
          this.form = Object.assign({ ...this.form, ...{ what_reward_definition_list: [what_form] }})
        } else if (old_value === 4) {
          // how------------------------------------------------------------------------------------------
          var how_dom = this.$refs['how']
          var how_form = {
            code: this.cam_info.trigger_name,
            name: this.cam_info.trigger_name,
            kind: how_dom.form.kind,
            // communication_channel_code: this.communication_channel_code,
            communication_channel_code: null,
            communication_channel_id: this.communication_channel_id,
            communication_template_id: (function() {
              if (how_dom.form.kind === 'SMS') {
                return how_dom.options[0].template[how_dom.sms_id].id
              } else if (how_dom.form.kind === 'EDM') {
                return how_dom.options[1].template[how_dom.edm_id].id
              } else {
                return how_dom.options[2].template[how_dom.wechat_id].id
              }
            }()),
            content: (function() {
              if (how_dom.form.kind === 'SMS') {
                return how_dom.options[0].template[how_dom.sms_id].content
              } else if (how_dom.form.kind === 'EDM') {
                return how_dom.options[1].template[how_dom.edm_id].content
              } else {
                return how_dom.options[2].template[how_dom.wechat_id].content
              }
            }()),
            email_subject: ''
          }
          if (how_dom.form.kind === 'EDM') {
            how_form.email_subject = how_dom.options[1].template[how_dom.edm_id].subject
          }
          this.form = Object.assign({ ...this.form, ...{ communication_definition_list: how_form }})
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .width-60{
    margin: auto;
    display: flex;
  }
  .margin-left-30{
    margin-left: 30px;
  }
  .dialog{
    padding: 0 20px;
    text-align: center;
    p{
      line-height: 1.3;
      color: rgba(16, 16, 16, 1);
      font-size: 16px;
      text-align: left;
    }
    h5{
      margin-top: 20px;
      line-height: 1.3;
      color: rgba(16, 16, 16, 1);
      font-size: 16px;
      text-align: left;
    }
    .submit{
      text-align: center;
      margin-top: 26px;
      .el-button{
        width: 90px;
      }
    }
  }
  .check-arrow{
    .arrow{
      margin-top: -5px!important;
      border-width: 60px 0 60px 60px!important;
      border-color:transparent transparent transparent $primary!important;
    }
  }
  .check-arrow1{
    .arrow1{
      margin-top: -5px!important;
      border-width: 60px 0 60px 60px!important;
      border-color:$primary $primary $primary transparent!important;
    }
  }
  .trigger-campaign-edit{
    margin: 20px;
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
    .nonius{
      padding: 20px 29px;
      width: 100%;
      margin-top: 15px;
      background-color: #ffffff;
      display: flex;
      justify-content: space-around;
      height: 150px;
      .item{
        font-size: 16px;
        &:hover{
          cursor: pointer;
        }
        background-color: #A0A0A0;
        flex: 1;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        .svg-icon{
          font-size: 52px;
          color: #ffffff;
        }
        label{
          display: block;
          color: #101010;
          color: rgba(255, 255, 255, 1);
          font-size: 26px;
          line-height: 1.5;
          margin-left: 26px;
        }
      }
      .arrow{
        width:0;
        height:0;
        border-width:55px 0 55px 55px;
        border-style:solid;
        border-color:transparent transparent transparent #A0A0A0;
        margin:0 auto;
        position:relative;
      }
      .arrow1{
        margin: 0 -30px auto -30px;
        width:0;
        height:0;
        border-width:55px 0 55px 55px;
        border-style:solid;
        border-color:#A0A0A0 #A0A0A0 #A0A0A0 transparent;
        position:relative;
      }
    }
    .check-item{
      background-color: $primary!important;
      // box-shadow: -1px 0 5px $primary;
      .svg-icon{
        color:#ffffff!important;
      }
      margin-top: -5px;
      height: 120px;
      line-height: 120px;
      label{
        color:#ffffff!important;
      }
    }
    .accomplish-item{
      background-color: $primary!important;
    }
    .accomplish-arrow{
      .arrow{
        border-color:transparent transparent transparent $primary;
      }
    }
    .accomplish-arrow1{
      .arrow1{
        border-color: $primary $primary $primary transparent;
      }
    }
  }
  .content{
    display: -webkit-box;
    min-height: 500px;
    margin-top: 15px;
    background-color: #ffffff;
  }
  .three-button{
    height: 50px;
    line-height: 50px;
    .el-button{
      min-width: 90px;
      margin-right: 19px;
      margin-left: 0;
    }
    text-align: right;
    background-color: rgba(26,188,156, 0.08);
    padding: 0 0 20px 20px;
  }
</style>
