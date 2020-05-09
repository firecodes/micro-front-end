<!--edit-->
<template>
  <div class="lifecycle-campaign-edit" v-loading = "loading" >
    <section class="top">
      <div class="image">
        <svg-icon :icon-class="cam_info.icon_name" style="color: #ffffff" />
      </div>
      <div class="info">
        <h1>{{cam_info.name_resource_key ? $t(`campaign.${cam_info.name_resource_key}`) : cam_info.campaign_name}}</h1>
        <p>{{cam_info.description_resource_key ? $t(`campaign.${cam_info.description_resource_key}`) : cam_info.desc}}</p>
      </div>
    </section>
    <div class="section-middle">
      <div class="middle-tag">
        <label>{{wave}}</label>
        <el-select v-model="wave">
          <el-option :label="$t('campaign.fc_campaign_lifecycle_edit_wave_label', {1: '1'})" value="1" />
          <el-option :label="$t('campaign.fc_campaign_lifecycle_edit_wave_label', {1: '2'})" value="2" />
          <el-option :label="$t('campaign.fc_campaign_lifecycle_edit_wave_label', {1: '3'})" value="3" />
        </el-select>
      </div>
      <div class="middle-content">
        <p>{{$t('campaign.fc_campaign_lifecycle_edit_desc_label')}}</p>
        <el-switch @change="wave1Change" v-if="wave === '1'" v-model="wave1" />
        <el-switch @change="wave2Change" v-else-if="wave === '2'" v-model="wave2" />
        <el-switch @change="wave3Change" v-else-if="wave === '3'" v-model="wave3" />
      </div>
      <div class="middle-line"></div>
      <section class="nonius">
        <div class="item" :class="{'check-item' : nonius_id===1, 'accomplish-item' : when_state}" @click="next(1)">
          <svg-icon icon-class="trigger-when" />
          <label>{{$t('campaign.fc_campaign_lifecycle_edit_when_section_label')}}</label>
        </div>
        <div class="width-60" :class="{'check-arrow' : nonius_id===1, 'check-arrow1' : nonius_id === 2, 'accomplish-arrow' : when_state, 'accomplish-arrow1' : who_state}" >
          <div class="arrow"></div>
          <div class="arrow1"></div>
        </div>
        <div class="item margin-left-30" :class="{'check-item' : nonius_id===2, 'accomplish-item' : who_state}" @click="next(2)">
          <svg-icon icon-class="trigger-who" />
          <label>{{$t('campaign.fc_campaign_lifecycle_edit_who_section_label')}}</label>
        </div>
        <div class="width-60" :class="{'check-arrow' : nonius_id===2, 'check-arrow1' : nonius_id === 3, 'accomplish-arrow' : who_state, 'accomplish-arrow1' : what_state}">
          <div class="arrow"></div>
          <div class="arrow1"></div>
        </div>
        <div class="item margin-left-30" :class="{'check-item' : nonius_id===3, 'accomplish-item' : what_state}" @click="next(3)">
          <svg-icon icon-class="trigger-what" />
          <label>{{$t('campaign.fc_campaign_lifecycle_edit_what_section_label')}}</label>
        </div>
        <div class="width-60" :class="{'check-arrow' : nonius_id===3, 'check-arrow1' : nonius_id === 4, 'accomplish-arrow' : what_state, 'accomplish-arrow1' : how_state}">
          <div class="arrow" ></div>
          <div class="arrow1"></div>
        </div>
        <div class="item margin-left-30" :class="{'check-item' : nonius_id===4, 'accomplish-item' : how_state}" @click="next(4)">
            <svg-icon icon-class="trigger-how" />
            <label>{{$t('campaign.fc_campaign_lifecycle_edit_how_section_label')}}</label>
          </div>
      </section>
    </div>
    <section class="content">
      <keep-alive>
        <!--<component-->
          <!--:ref="tabList[parseInt(nonius_id) - 1].label"-->
          <!--:nonius_id="nonius_id"-->
          <!--:form_data="form"-->
          <!--:tier_list = "tier_list"-->
          <!--:is="tabList[parseInt(nonius_id) - 1].component">-->
        <!--</component>-->
      </keep-alive>
        <when
          v-show="nonius_id === 1"
          ref="when"
          :nonius_id="nonius_id"
          :form_data="form_data"
        />
        <who
          v-show="nonius_id === 2"
          ref="who"
          :nonius_id="nonius_id"
          :form_data="form_data"
          :register_channel_data="register_channel_data"
          :tier_list = "tier_list"
        />
        <what
          v-show="nonius_id === 3"
          ref="what"
          :nonius_id="nonius_id"
          :form_data="form_data"
        />
        <how
          v-show="nonius_id === 4"
          ref="how"
          :nonius_id="nonius_id"
          :form_data="form_data"
        />
    </section>
    <section class="three-button">
      <el-button v-if="nonius_id !== 1" @click="back">{{$t('campaign.fc_campaign_lifecycle_edit_btn_back_label')}}</el-button>
      <el-button v-if="nonius_id !== 4" @click="next(nonius_id + 1)" type="primary">{{$t('campaign.fc_campaign_lifecycle_edit_btn_next_label')}}</el-button>
      <el-button v-if="nonius_id === 4" type="primary" @click="submit">{{handleGlobalI18n('campaign', 'save')}}</el-button>
    </section>
    <el-dialog
      :visible.sync="save_dialog"
      width="580px"
      :title="handleGlobalI18n('campaign', 'confirm')">
      <div class="dialog">
        <p>{{handleGlobalI18n('campaign', 'lifecycle_campaign_confirm_1')}}</p>
        <h5>{{handleGlobalI18n('campaign', 'lifecycle_campaign_confirm_2')}}</h5>
        <div class="submit">
          <el-button type="primary" @click="handleContinue">{{handleGlobalI18n('campaign', 'continue')}}</el-button>
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
  import { addCommunicationChannel } from '@/api/campaign'
  import { getLifeCycleCampaignWarzd, createLifecycleCampaign } from '@/api/lifecycleStudio'
  import { getTenantKPIByTier } from '@/api/kpi'
  // import { trigger_detail } from '@/data/trigger-campaign'
  import { DateTime } from 'luxon'
  import { queryChannelList } from '@/api/master'
  export default {
    components: {
      When,
      Who,
      What,
      How
    },
    data() {
      return {
        old_wave: '1',
        form_data: {
          name: 'wave1',
          code: '',
          is_trigger: 0,
          when_definition: {
            code: '',
            name: 'wave1',
            type: 1, // 1  realtime 2 day 3 month
            delay_value: 0,
            exec_date: '1'
          },
          who_definition_list: [{
            code: '',
            name: 'wave1',
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
            kind: 'Coupon',
            page_no: 1,
            transaction_amount_restriction_state: false,
            limit_total_points_state: false
          }],
          communication_definition_list: {
            code: '',
            name: 'wave1',
            kind: 'SMS', // sms edm
            communication_channel_code: '',
            communication_template_id: '',
            content: ''
          }
        },
        register_channel_data: [],
        wave: '1',
        communication_channel_id: null,
        communication_channel_code: null,
        save_dialog: false,
        when_state: false,
        who_state: false,
        what_state: false,
        how_state: false,
        cam_info: {},
        tier_list: [],
        loading: false,
        tabList: [
          { name: '1', label: 'when', component: 'When' },
          { name: '2', label: 'who', component: 'Who' },
          { name: '3', label: 'what', component: 'What' },
          { name: '4', label: 'how', component: 'How' }
        ],
        nonius_id: 0,
        form: {
          campaign_wizard_id: '',
          name: '',
          code: '',
          status: '', // 1 save 2 submit 3 cancel
          wave_list: [{
            name: 'wave1',
            code: '',
            is_trigger: 0,
            when_definition: {
              code: '',
              name: 'wave1',
              type: 1, // 1  realtime 2 day 3 month
              delay_value: 0,
              exec_date: '1'
            },
            who_definition_list: [{
              code: '',
              name: 'wave1',
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
              kind: 'Coupon',
              page_no: 1,
              transaction_amount_restriction_state: false,
              limit_total_points_state: false
            }],
            communication_definition_list: [{
              code: '',
              name: 'wave1',
              kind: 'SMS', // sms edm
              communication_channel_code: '',
              communication_template_id: '',
              content: ''
            }]
          }, {
            name: 'wave2',
            code: '',
            is_trigger: 0,
            when_definition: {
              code: '',
              name: 'wave2',
              type: 1, // 1  realtime 2 day 3 month
              delay_value: 0,
              exec_date: '1'
            },
            who_definition_list: [{
              code: '',
              name: 'wave2',
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
              kind: 'Coupon',
              page_no: 1,
              transaction_amount_restriction_state: false,
              limit_total_points_state: false
            }],
            communication_definition_list: [{
              code: '',
              name: 'wave2',
              kind: 'SMS', // sms edm
              communication_channel_code: '',
              communication_template_id: '',
              content: ''
            }]
          }, {
            name: 'wave3',
            code: '',
            is_trigger: 0,
            when_definition: {
              code: '',
              name: 'wave3',
              type: 1, // 1  realtime 2 day 3 month
              delay_value: 0,
              exec_date: '1'
            },
            who_definition_list: [{
              code: '',
              name: 'wave3',
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
              kind: 'Coupon',
              page_no: 1,
              transaction_amount_restriction_state: false,
              limit_total_points_state: false
            }],
            communication_definition_list: [{
              code: '',
              name: 'wave3',
              kind: 'SMS', // sms edm
              communication_channel_code: '',
              communication_template_id: '',
              content: ''
            }]
          }]

        },
        wave1: false,
        wave2: false,
        wave3: false
      }
    },
    created() {
      // 获取到上一步的数据
      this.cam_info = JSON.parse(window.localStorage.lifecycle_cam_info)
      if (Object.keys(this.cam_info).length <= 0) {
        this.$router.go(-1)
      }
      this.init()
    },
    methods: {
      async init() {
        await this.getTierList()
        await this.handleRegisterChannel()
        // 获取 lifecycle campaign 详情信息
        if (this.cam_info.campaign_warzd_id > 0) {
          await this.handleGetLifeCycleCampaignWizard()
        }
        // 初始化
        await this.setNoniusId()
      },
      handleIndex() {
        var index = 0
        switch (this.wave) {
          case '1':
            index = 0
            break
          case '2':
            index = 1
            break
          case '3':
            index = 2
            break
        }
        return index
      },
      setNoniusId() {
        return new Promise(resolve => {
          this.nonius_id = 1
          resolve()
        })
      },
      // 获取注册渠道
      handleRegisterChannel() {
        return queryChannelList({ page_no: 1, page_size: 40 }).then(res => {
          this.register_channel_data = res.return_result.channels || []
        })
      },
      // 获取tier 列表
      getTierList() {
        return getTenantKPIByTier().then(res => {
          this.tier_list = res.return_result.kpis
        })
      },
      handleContinue() {
        this.save_dialog = false
        this.$router.push({ path: `/campaign/lifecycle-studio/detail/${this.id}` })
      },
      handleGetLifeCycleCampaignWizard() {
        this.loading = true
        return getLifeCycleCampaignWarzd({ campaign_wizard_id: this.cam_info.campaign_warzd_id }).then(res => {
          this.loading = false
          var result = res.return_result
          this.form = result
          this.form.campaign_warzd_id = this.cam_info.campaign_warzd_id
          const has = Object.prototype.hasOwnProperty
          if (this.form.wave_list !== null && this.form.wave_list.length > 0) {
            this.wave1 = result.wave_list[0].is_trigger === 1
            this.wave2 = result.wave_list[1].is_trigger === 1
            this.wave3 = result.wave_list[2].is_trigger === 1
            for (var i = 0; i < 3; i++) {
              var _wave = this.form.wave_list[i]
              if (_wave.when_definition === null || !has.call(_wave, 'when_definition')) {
                this.form.wave_list[i].when_definition = {
                  code: '',
                  name: 'wave' + i + 1,
                  type: 2,
                  delay_value: 0,
                  exec_date: 0
                }
              }
              if (_wave.who_definition_list === null || !has.call(_wave, 'who_definition_list')) {
                this.form.wave_list[i].who_definition_list = [{
                  code: '',
                  name: 'wave' + i + 1,
                  select_type: 'everyone', // everyone  filter
                  target_criteria: []
                }]
              }
              if (_wave.what_reward_definition_list === null || !has.call(_wave, 'what_reward_definition_list')) {
                this.form.wave_list[i].what_reward_definition_list = [{
                  code: '',
                  max_points: 0,
                  multi_coefficient: 0,
                  points: 0,
                  coupon_code: '',
                  purchase_amount_restriction_from: 0,
                  purchase_amount_restriction_to: 0,
                  times: '',
                  product_list: [],
                  kind: 'Coupon',
                  page_no: 1,
                  transaction_amount_restriction_state: false,
                  limit_total_points_state: false
                }]
              }
              if (_wave.communication_definition_list === null || !has.call(_wave, 'communication_definition_list')) {
                this.form.wave_list[i].communication_definition_list = [{
                  code: '',
                  name: 'wave' + i + 1,
                  kind: 'SMS', // sms edm
                  communication_channel_code: '',
                  communication_template_id: '',
                  content: ''
                }]
              }
            }
          } else {
            this.form.wave_list = [{
              name: 'wave1',
              code: '',
              is_trigger: 0,
              when_definition: {
                code: '',
                name: 'wave1',
                type: 1, // 1  realtime 2 day 3 month
                delay_value: 0,
                exec_date: '1'
              },
              who_definition_list: [{
                code: '',
                name: 'wave1',
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
                kind: 'Coupon',
                page_no: 1,
                transaction_amount_restriction_state: false,
                limit_total_points_state: false
              }],
              communication_definition_list: [{
                code: '',
                name: 'wave1',
                kind: 'SMS', // sms edm
                communication_channel_code: '',
                communication_template_id: '',
                content: ''
              }]
            }, {
              name: 'wave2',
              code: '',
              is_trigger: 0,
              when_definition: {
                code: '',
                name: 'wave2',
                type: 1, // 1  realtime 2 day 3 month
                delay_value: 0,
                exec_date: '1'
              },
              who_definition_list: [{
                code: '',
                name: 'wave2',
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
                kind: 'Coupon',
                page_no: 1,
                transaction_amount_restriction_state: false,
                limit_total_points_state: false
              }],
              communication_definition_list: [{
                code: '',
                name: 'wave2',
                kind: 'SMS', // sms edm
                communication_channel_code: '',
                communication_template_id: '',
                content: ''
              }]
            }, {
              name: 'wave3',
              code: '',
              is_trigger: 0,
              when_definition: {
                code: '',
                name: 'wave3',
                type: 1, // 1  realtime 2 day 3 month
                delay_value: 0,
                exec_date: '1'
              },
              who_definition_list: [{
                code: '',
                name: 'wave3',
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
                kind: 'Coupon',
                page_no: 1,
                transaction_amount_restriction_state: false,
                limit_total_points_state: false
              }],
              communication_definition_list: [{
                code: '',
                name: 'wave3',
                kind: 'SMS', // sms edm
                communication_channel_code: '',
                communication_template_id: '',
                content: ''
              }]
            }]
          }
          this.form_data = this.form.wave_list[parseInt(this.wave) - 1]
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
      handleGetId(kind) {
        if (kind === 'SMS') {
          return 0
        } else if (kind === 'EDM') {
          return 1
        } else {
          return 2
        }
      },
      handleGetTemplateKey(kind) {
        var how_dom = this.$refs['how']
        if (kind === 'SMS') {
          return how_dom.sms_id
        } else if (kind === 'EDM') {
          return how_dom.edm_id
        } else {
          return how_dom.wechat_id
        }
      },
      // save
      save() {
        // how------------------------------------------------------------------------------------------
        var how_dom = this.$refs['how']
        var template = how_dom.options[this.handleGetId(how_dom.form.kind)].template[this.handleGetTemplateKey(how_dom.form.kind)]
        var how_form = { code: '', name: this.cam_info.trigger_name, kind: how_dom.form.kind, communication_channel_code: how_dom.form.communication_channel_code, communication_channel_id: this.communication_channel_id, communication_template_id: template.id, content: template.content, email_subject: template.subject }
        this.form.wave_list[this.handleIndex()] = Object.assign({ ...this.form.wave_list[this.handleIndex()], ...{ communication_definition_list: [how_form] }})
        var form = {
          campaign_warzd_id: this.cam_info.campaign_warzd_id,
          name: this.cam_info.lifecycle_campaign_type,
          code: '',
          status: 'save',
          wave_list: [{
            name: 'wave1',
            code: '',
            is_trigger: this.wave1 ? 1 : 0,
            when_definition: this.form.wave_list[0].when_definition,
            who_definition_list: this.form.wave_list[0].who_definition_list,
            what_reward_definition_list: this.form.wave_list[0].what_reward_definition_list,
            communication_definition_list: this.form.wave_list[0].communication_definition_list
          }, {
            name: 'wave2',
            code: '',
            is_trigger: this.wave2 ? 1 : 0,
            when_definition: this.form.wave_list[1].when_definition,
            who_definition_list: this.form.wave_list[1].who_definition_list,
            what_reward_definition_list: this.form.wave_list[1].what_reward_definition_list,
            communication_definition_list: this.form.wave_list[1].communication_definition_list
          }, {
            name: 'wave3',
            code: '',
            is_trigger: this.wave3 ? 1 : 0,
            when_definition: this.form.wave_list[2].when_definition,
            who_definition_list: this.form.wave_list[2].who_definition_list,
            what_reward_definition_list: this.form.wave_list[2].what_reward_definition_list,
            communication_definition_list: this.form.wave_list[2].communication_definition_list
          }]
        }
        for (var i in form.wave_list) {
          form.wave_list[i].what_reward_definition_list[0].purchase_amount_restriction_from = form.wave_list[i].what_reward_definition_list[0].transaction_amount_restriction_state ? form.wave_list[i].what_reward_definition_list[0].purchase_amount_restriction_from : null
          form.wave_list[i].what_reward_definition_list[0].purchase_amount_restriction_to = form.wave_list[i].what_reward_definition_list[0].transaction_amount_restriction_state ? form.wave_list[i].what_reward_definition_list[0].purchase_amount_restriction_to : null
          form.wave_list[i].what_reward_definition_list[0].max_points = form.wave_list[i].what_reward_definition_list[0].limit_total_points_state ? form.wave_list[i].what_reward_definition_list[0].max_points : null
          form.wave_list[i].who_definition_list[0].target_criteria = form.wave_list[i].who_definition_list[0].select_type === 'everyone' ? null : form.wave_list[i].who_definition_list[0].target_criteria
          // 判断当不选 age 时 过滤掉数据
          if (form.wave_list[i].who_definition_list[0].select_type !== 'everyone') {
            if (form.wave_list[i].who_definition_list[0].target_criteria.length > 2) {
              if (form.wave_list[i].who_definition_list[0].target_criteria[2].criteria_code === null || form.wave_list[i].who_definition_list[0].target_criteria[2].criteria_code === '') {
                form.wave_list[i].who_definition_list[0].target_criteria.splice(2, 1)
              }
            }
            if (form.wave_list[i].who_definition_list[0].target_criteria.length > 1) {
              if ((form.wave_list[i].who_definition_list[0].target_criteria[0].criteria_code === null || form.wave_list[i].who_definition_list[0].target_criteria[0].criteria_code === '') && form.wave_list[i].who_definition_list[0].target_criteria[0].criteria_field_code === 'age_from') {
                form.wave_list[i].who_definition_list[0].target_criteria.splice(0, 2)
              }
            }
          }
          form.wave_list[i].communication_definition_list[0].communication_channel_code = form.wave_list[i].communication_definition_list[0].communication_channel_code !== null ? form.wave_list[i].communication_definition_list[0].communication_channel_code : '7'
        }
        // 调用保存
        return createLifecycleCampaign(form).then(res => {
          this.loading = false
          // 保存成功
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.id = res.return_result.campaign_wizard_id
          this.save_dialog = true
        }).catch(_ => {
          this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
          this.loading = false
        })
      },
      // submit
      async submit() {
        try {
          await this.handleAddCommunicationChannel()
          await this.save()
        } catch (err) {
          this.loading = false
        }
      },
      handleAddCommunicationChannel() {
        this.loading = true
        var how_dom = this.$refs['how']
        var template = how_dom.options[this.handleGetId(how_dom.form.kind)].template[this.handleGetTemplateKey(how_dom.form.kind)]
        return addCommunicationChannel({
          communication_channel_type_id: how_dom.options[this.handleGetId(how_dom.form.kind)].id,
          planned_sendout_date: (DateTime.local().toISO()).substr(0, 10),
          template_id: template.id,
          backend_campaign_id: this.cam_info.campaign_warzd_id === null ? 0 : this.cam_info.campaign_warzd_id
        }).then(res => {
          this.communication_channel_id = res.return_result
        }).catch(_ => {
          this.loading = false
        })
      },
      wave1Change(value) {
        if (this.wave2 === true && !value) {
          this.$message({
            message: this.handleGlobalI18n('campaign', 'wave1_warning'),
            type: 'warning'
          })
          this.wave1 = true
        }
      },
      wave2Change(value) {
        if (this.wave1 === false && value) {
          this.$message({
            message: this.handleGlobalI18n('campaign', 'wave2_warning'),
            type: 'warning'
          })
          this.wave2 = false
          return true
        }
        if (this.wave3 === true && !value) {
          this.$message({
            message: this.handleGlobalI18n('campaign', 'wave2_1_warning'),
            type: 'warning'
          })
          this.wave2 = true
        }
      },
      wave3Change(value) {
        if (this.wave2 === false && value) {
          this.$message({
            message: this.handleGlobalI18n('campaign', 'wave3_warning'),
            type: 'warning'
          })
          this.wave3 = false
        }
      }
    },
    watch: {
      wave: {
        handler(new_value, old_value) {
          // how------------------------------------------------------------------------------------------
          var how_dom = this.$refs['how']
          var template = how_dom.options[how_dom.form.kind === 'SMS' ? 0 : 1].template[how_dom.form.kind === 'SMS' ? how_dom.sms_id : how_dom.edm_id]
          var how_form = { code: '', name: how_dom.form.name, kind: how_dom.form.kind, communication_channel_code: this.communication_channel_code, communication_template_id: template.id, content: template.content, email_subject: template.subject }
          this.form.wave_list[this.handleIndex()] = Object.assign({ ...this.form.wave_list[this.handleIndex()], ...{ communication_definition_list: [how_form] }})
          this.form_data = this.form.wave_list[parseInt(old_value) - 1]
          this.nonius_id = 1
          this.how_state = false
          this.who_state = false
          this.what_state = false
        }
      },
      nonius_id(new_value, old_value) {
        var value = parseInt(old_value)
        if (this.wave !== this.old_wave) {
          this.old_wave = this.wave
          return false
        }
        if (value === 1) {
          // when----------------------------------------------------------------------------------------------------------
          var when_dom = this.$refs['when']
          var when_form = {
            code: '',
            name: when_dom.form.name,
            type: when_dom.form.type,
            delay_value: when_dom.form.delay_value,
            exec_date: (when_dom.form.exec_date).toString()
          }
          this.form.wave_list[this.handleIndex()] = Object.assign({ ...this.form.wave_list[this.handleIndex()], ...{ when_definition: when_form }})
        } else if (old_value === 2) {
          // who ---------------------------------------------------------------------------------------------------------
          var who_dom = this.$refs['who']
          var who_form = { name: who_dom.form.name, code: '', select_type: who_dom.form.select_type, target_criteria: [] }
          if (who_form.select_type === 'filter') {
            var value1 = []
            var code = []
            for (var i in this.register_channel_data) {
              if (who_dom.select_register_channel_id[i] === parseInt(i) + 1) {
                code.push(this.register_channel_data[i].channel_code)
                value1.push(this.register_channel_data[i].channel_name)
              }
            }
            who_form.target_criteria = [{
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
              'criteria_field_code': 'register_channel',
              'criteria_field_name': 'register_channel',
              'criteria_code': code.join(','),
              'criteria_value': value1.join(',')
            }]
          }
          this.form.wave_list[this.handleIndex()] = Object.assign({ ...this.form.wave_list[this.handleIndex()], ...{ who_definition_list: [who_form] }})
        } else if (old_value === 3) {
          // what---------------------------------------------------------------------------------------------------------------------
          var what_dom = this.$refs['what']
          var what_form = what_dom.form
          this.form.wave_list[this.handleIndex()] = Object.assign({ ...this.form.wave_list[this.handleIndex()], ...{ what_reward_definition_list: [what_form] }})
        } else if (old_value === 4) {
          // how------------------------------------------------------------------------------------------
          var how_dom = this.$refs['how']
          var template = how_dom.options[this.handleGetId(how_dom.form.kind)].template[this.handleGetTemplateKey(how_dom.form.kind)]
          var how_form = { code: '', name: how_dom.form.name, kind: how_dom.form.kind, communication_channel_code: this.communication_channel_code, communication_template_id: template.id, content: template.content, email_subject: template.subject }
          this.form.wave_list[this.handleIndex()] = Object.assign({ ...this.form.wave_list[this.handleIndex()], ...{ communication_definition_list: [how_form] }})
        }
        this.form_data = this.form.wave_list[parseInt(this.wave) - 1]
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
  .lifecycle-campaign-edit{
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
    .section-middle{
      margin-top: 14px;
      background: #ffffff;
      text-align: center;
      position: relative;
      .middle-tag{
        padding-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        label{
          display: block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 4px;
          background-color: $primary;
          color: rgba(255, 255, 255, 1);
          font-size: 18px;
          text-align: center;
          border: 1px solid $primary;
        }
      }
      .middle-content{
        margin-top: 19px;
        display: flex;
        justify-content: center;
        position: relative;
        p{
          color: rgba(16, 16, 16, 1);
          font-size: 16px;
          line-height: 1.4;
        }
        .el-switch{
          position: absolute;
          right: 15px;
        }
      }
      .middle-line{
        display: block;
        position: absolute;
        text-align: center;
        border-top: 1px dashed #bbbbbb;
        margin: 22px 10px;
        left: 0;
        right: 0;
      }
    }
    .nonius{
      margin-top: 25px;
      padding: 20px 29px;
      width: 100%;
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
    min-height: 400px;
    margin-top: 15px;
    background-color: #ffffff;
  }
  .three-button{
    height: 50px;
    line-height: 50px;
    .el-button{
      width: 90px;
      margin-right: 19px;
      margin-left: 0;
    }
    text-align: right;
    background-color: rgba(26,188,156, 0.08);
    padding: 0 0 20px 20px;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .lifecycle-campaign-edit .middle-tag{
    input{
      border: none!important;
      color: $primary;
      font-size: 18px;
      width: 135px;
    }
    .el-select__caret{
      font-weight: bold;
    }
  }
</style>
