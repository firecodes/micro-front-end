<template>
  <div class="prospect lifecycle-studio" >
    <div v-loading="loading">
      <div class="div-title">
        <div class="image">
          <img v-if="lifecycle_type === 3" src="../../../../assets/images/Prospect.png" />
          <img v-else-if="lifecycle_type === 0" src="../../../../assets/images/NewBuyer.png" />
          <img v-else-if="lifecycle_type === 1" src="../../../../assets/images/RepeatCustomer.png" />
          <img v-else-if="lifecycle_type === 2" src="../../../../assets/images/SleepingCustomer.png" />
        </div>
        <p>{{handleGlobalI18n('campaign', configuration.lifecycle_campaign_type)}}</p>
        <div class="operating" ref="operating">
          <!--保存-->
          <div class="save cursor-pointer" title="save" @click="save('save1')" v-show="edit_state">
            <img src="../../../../assets/images/lifecycle-studio/save.png"  />
            <label>{{handleGlobalI18n('campaign', 'lifecycle_save')}}</label>
          </div>
          <!--编辑-->
          <div class="block_up cursor-pointer" title="edit" @click="edit_state=true" v-show="!edit_state">
            <img src="../../../../assets/images/lifecycle-studio/bianji.png" />
            <label>{{handleGlobalI18n('campaign', 'edit')}}</label>
          </div>
          <!--启用-->
          <div class="start_using cursor-pointer" title="start using" @click="save('submit')" v-show="(!enable_state && edit_state) || save_state">
            <img src="../../../../assets/images/lifecycle-studio/start_using.png" />
            <label >{{handleGlobalI18n('campaign', 'enable')}}</label>
          </div>
          <!--停用-->
          <div class="block_up cursor-pointer" title="block up" @click="cancel" v-show="enable_state">
            <img src="../../../../assets/images/lifecycle-studio/block_up.png" />
            <label>{{handleGlobalI18n('campaign', 'disable')}}</label>
          </div>
          <!--返回-->
          <div class="back cursor-pointer" title="back" @click="back">
            <img src="../../../../assets/images/lifecycle-studio/fanhui.png" />
            <label>{{handleGlobalI18n('campaign', 'back')}}</label>
          </div>
        </div>
      </div>
      <section class="nonius">
        <div class="item" :class="{'check-item' : nonius_id===1}" @click="nonius_id=1">
          <div class="top">
            <div class="left">
              <div class="image"><svg-icon :icon-class="wave1 ? 'Wave1': 'Wave2'"></svg-icon></div>
              <p>{{handleGlobalI18n('campaign', 'wave')}}1</p>
            </div>
            <div class="right">
              <el-switch v-model="wave1" active-color="#8BC34A" :disabled="!edit_state" @change="wave1Change"></el-switch>
            </div>
          </div>
          <div class="bottom">{{handleGlobalI18n('campaign', 'wave1_declare')}}</div>
        </div>
        <div class="arrow" :class="{'check-arrow' : nonius_id===1 || nonius_id===2, 'check-arrow1': nonius_id===2}"></div>
        <div class="item" :class="{'check-item1' : nonius_id===2}" @click="nonius_id=2">
          <div class="top">
            <div class="left">
              <div class="image"><svg-icon :icon-class="wave2? 'Wave1': 'Wave2'"></svg-icon></div>
              <p>{{handleGlobalI18n('campaign', 'wave')}}2</p>
            </div>
            <div class="right">
              <el-switch v-model="wave2" active-color="#8BC34A" :disabled="!edit_state" @change="wave2Change"></el-switch>
            </div>
          </div>
          <div class="bottom">{{handleGlobalI18n('campaign', 'wave2_declare')}}</div>
        </div>
        <div class="arrow" :class="{'check-arrow' : nonius_id===2 || nonius_id===3, 'check-arrow1': nonius_id===3}"></div>
        <div class="item" :class="{'check-item2' : nonius_id===3}" @click="nonius_id=3">
          <div class="top">
            <div class="left">
              <div class="image"><svg-icon :icon-class="wave3? 'Wave1': 'Wave2'"></svg-icon></div>
              <p>{{handleGlobalI18n('campaign', 'wave')}}3</p>
            </div>
            <div class="right">
              <el-switch v-model="wave3" active-color="#8BC34A" :disabled="!edit_state" @change="wave3Change"></el-switch>
            </div>
          </div>
          <div class="bottom">{{handleGlobalI18n('campaign', 'wave3_declare')}}</div>
        </div>
      </section>
      <wave
        :nonius_id="nonius_id"
        :edit_state="edit_state"
        :lifecycle_type="lifecycle_type"
        :register_channel_data="register_channel_data"
        @save = "save"
      />
    </div>
  </div>
</template>

<script>
  import { getLifeCycleCampaignWarzd, createLifecycleCampaign, cancelLifecycleCampaign } from '@/api/lifecycleStudio'
  import Wave from '@/views/campaign/lifecycle-studio/publish/wave'
  import { queryChannelList } from '@/api/master'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        save_state: false,
        enable_state: false,
        loading: true,
        configuration: {},
        edit_state: false,
        lifecycle_type: null,
        wave1: false,
        wave2: false,
        wave3: false,
        nonius_id: null,
        register_channel_data: [],
        form: {
          campaign_warzd_id: null,
          name: '',
          code: '',
          status: '',
          wave_list: [
            {
              name: 'wave1',
              code: '',
              is_trigger: 0,
              when_definition: {
                code: '',
                name: 'wave1',
                type: 2,
                delay_value: 0,
                exec_date: 0
              },
              who_definition_list: [{
                code: '',
                name: 'wave1',
                select_type: 'everyone',
                target_criteria: [
                  {
                    'criteria_field_code': 'age_from',
                    'criteria_field_name': 'age',
                    'criteria_code': '',
                    'criteria_value': ''
                  },
                  {
                    'criteria_field_code': 'age_to',
                    'criteria_field_name': 'age',
                    'criteria_code': '',
                    'criteria_value': ''
                  },
                  {
                    'criteria_field_code': 'register_channel',
                    'criteria_field_name': 'register_channel',
                    'criteria_code': '',
                    'criteria_value': ''
                  }
                ]
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
                kind: 'General Points',
                page_no: 1,
                transaction_amount_restriction_state: false,
                limit_total_points_state: false
              }],
              communication_definition_list: [{
                code: '',
                name: 'wave1',
                kind: 'SMS',
                communication_channel_code: ''
              }]
            },
            {
              name: 'wave2',
              code: '',
              is_trigger: 0,
              when_definition: {
                code: '',
                name: 'wave2',
                type: 2,
                delay_value: 0,
                exec_date: 0
              },
              who_definition_list: [{
                code: '',
                name: 'wave2',
                select_type: 'everyone',
                target_criteria: [
                  {
                    'criteria_field_code': 'age_from',
                    'criteria_field_name': 'age',
                    'criteria_code': '',
                    'criteria_value': ''
                  },
                  {
                    'criteria_field_code': 'age_to',
                    'criteria_field_name': 'age',
                    'criteria_code': '',
                    'criteria_value': ''
                  },
                  {
                    'criteria_field_code': 'register_channel',
                    'criteria_field_name': 'register_channel',
                    'criteria_code': '',
                    'criteria_value': ''
                  }
                ]
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
                kind: 'General Points',
                page_no: 1,
                transaction_amount_restriction_state: false,
                limit_total_points_state: false
              }],
              communication_definition_list: [{
                code: '',
                name: 'wave2',
                kind: 'SMS',
                communication_channel_code: ''
              }]
            },
            {
              name: 'wave3',
              code: '',
              is_trigger: 0,
              when_definition: {
                code: '',
                name: 'wave3',
                type: 2,
                delay_value: 0,
                exec_date: 0
              },
              who_definition_list: [{
                code: '',
                name: 'wave3',
                select_type: 'everyone',
                target_criteria: [
                  {
                    'criteria_field_code': 'age_from',
                    'criteria_field_name': 'age',
                    'criteria_code': '',
                    'criteria_value': ''
                  },
                  {
                    'criteria_field_code': 'age_to',
                    'criteria_field_name': 'age',
                    'criteria_code': '',
                    'criteria_value': ''
                  },
                  {
                    'criteria_field_code': 'register_channel',
                    'criteria_field_name': 'register_channel',
                    'criteria_code': '',
                    'criteria_value': ''
                  }
                ]
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
                kind: 'General Points',
                page_no: 1,
                transaction_amount_restriction_state: false,
                limit_total_points_state: false
              }],
              communication_definition_list: [{
                code: '',
                name: 'wave3',
                kind: 'SMS',
                communication_channel_code: ''
              }]
            }
          ]
        },
        action: false,
        update_state: false
      }
    },
    components: {
      Wave
    },
    computed: {
      ...mapGetters([
        'lifecycle_configuration',
        'lifecycle_info'
      ])
    },
    created() {
      this.lifecycle_type = parseInt(this.$route.params.id)
      this.configuration = this.lifecycle_configuration[this.lifecycle_type]
      // 设置form
      this.form.campaign_warzd_id = this.configuration.campaign_warzd_id
      this.form.name = this.configuration.lifecycle_campaign_type
      // 初始化
      this.nonius_id = 1
      // data
      this.setLifecycleInfo(this.form)
      this.init()
    },
    methods: {
      ...mapMutations({
        setLifecycleInfo: 'SET_LIFECYCLE_INFO'
      }),
      async init() {
        try {
          await this.handleGetLifeCycleCampaignWarzd()
          await this.handleRegisterChannel()
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      },
      handleRegisterChannel() {
        return queryChannelList({ page_no: 1, page_size: 40 }).then(res => {
          this.register_channel_data = res.return_result.channels || []
        })
      },
      back() {
        if (this.update_state && this.edit_state) {
          this.$alert(this.handleGlobalI18n('campaign', 'back_warning'), this.handleGlobalI18n('loyalty', 'attention'), {
            confirmButtonText: this.handleGlobalI18n('loyalty', 'confirm')
          })
        } else {
          this.$router.go(-1)
        }
      },
      save(state) {
        const info = JSON.parse(JSON.stringify(this.lifecycle_info))
        info.wave_list[0].is_trigger = this.wave1 ? 1 : 0
        info.wave_list[1].is_trigger = this.wave2 ? 1 : 0
        info.wave_list[2].is_trigger = this.wave3 ? 1 : 0
        for (var i in info.wave_list) {
          info.wave_list[i].what_reward_definition_list[0].purchase_amount_restriction_from = info.wave_list[i].what_reward_definition_list[0].transaction_amount_restriction_state ? info.wave_list[i].what_reward_definition_list[0].purchase_amount_restriction_from : null
          info.wave_list[i].what_reward_definition_list[0].purchase_amount_restriction_to = info.wave_list[i].what_reward_definition_list[0].transaction_amount_restriction_state ? info.wave_list[i].what_reward_definition_list[0].purchase_amount_restriction_to : null
          info.wave_list[i].what_reward_definition_list[0].max_points = info.wave_list[i].what_reward_definition_list[0].limit_total_points_state ? info.wave_list[i].what_reward_definition_list[0].max_points : null
          info.wave_list[i].who_definition_list[0].target_criteria = info.wave_list[i].who_definition_list[0].select_type === 'everyone' ? null : info.wave_list[i].who_definition_list[0].target_criteria
          // 判断当不选 age 时 过滤掉数据
          if (info.wave_list[i].who_definition_list[0].select_type !== 'everyone') {
            if (info.wave_list[i].who_definition_list[0].target_criteria.length > 2) {
              if (info.wave_list[i].who_definition_list[0].target_criteria[2].criteria_code === null || info.wave_list[i].who_definition_list[0].target_criteria[2].criteria_code === '') {
                info.wave_list[i].who_definition_list[0].target_criteria.splice(2, 1)
              }
            }
            if (info.wave_list[i].who_definition_list[0].target_criteria.length > 1) {
              if ((info.wave_list[i].who_definition_list[0].target_criteria[0].criteria_code === null || info.wave_list[i].who_definition_list[0].target_criteria[0].criteria_code === '') && info.wave_list[i].who_definition_list[0].target_criteria[0].criteria_field_code === 'age_from') {
                info.wave_list[i].who_definition_list[0].target_criteria.splice(0, 2)
              }
            }
          }
          info.wave_list[i].communication_definition_list[0].communication_channel_code = info.wave_list[i].communication_definition_list[0].communication_channel_code !== null ? info.wave_list[i].communication_definition_list[0].communication_channel_code : '7'
        }
        if (state === 'save1') {
          state = 'save'
          this.edit_state = false
          this.save_state = true
        }
        info.status = state
        createLifecycleCampaign(info).then(res => {
          if (state === 'submit') {
            this.enable_state = true
          }
          this.update_state = false
          this.$notify({
            title: 'Success',
            message: this.handleGlobalI18n('system', 'save_successfully'),
            type: 'success'
          })
        })
      },
      // 取消
      cancel() {
        cancelLifecycleCampaign({ campaign_wizard_id: this.configuration.campaign_warzd_id }).then(res => {
          this.$notify({
            title: 'Success',
            message: this.handleGlobalI18n('system', 'save_successfully'),
            type: 'success'
          })
        })
      },
      // 查询详情
      handleGetLifeCycleCampaignWarzd() {
        return getLifeCycleCampaignWarzd({ campaign_wizard_id: this.configuration.campaign_warzd_id }).then(res => {
          if (res.return_result.wave_list !== null) {
            this.form = res.return_result
            this.form.campaign_warzd_id = this.configuration.campaign_warzd_id
            this.wave1 = res.return_result.wave_list[0].is_trigger === 1
            this.wave2 = res.return_result.wave_list[1].is_trigger === 1
            this.wave3 = res.return_result.wave_list[2].is_trigger === 1
            for (var i in this.form.wave_list) {
              this.form.wave_list[i].what_reward_definition_list[0] = { ...this.form.wave_list[i].what_reward_definition_list[0], page_no: 1, transaction_amount_restriction_state: false, limit_total_points_state: false }
              if (this.form.wave_list[i].who_definition_list[0].select_type !== 'filter') {
                this.form.wave_list[i].who_definition_list[0].target_criteria = [
                  {
                    'criteria_field_code': 'age_from',
                    'criteria_field_name': 'age',
                    'criteria_code': '',
                    'criteria_value': ''
                  },
                  {
                    'criteria_field_code': 'age_to',
                    'criteria_field_name': 'age',
                    'criteria_code': '',
                    'criteria_value': ''
                  },
                  {
                    'criteria_field_code': 'register_channel',
                    'criteria_field_name': 'register_channel',
                    'criteria_code': '',
                    'criteria_value': ''
                  }
                ]
              }
            }
            this.setLifecycleInfo(this.form)
            this.action = true
          }
        })
      },
      wave1Change(value) {
        if (this.wave2 === true && !value) {
          this.$notify({
            title: this.handleGlobalI18n('campaign', 'warning'),
            message: this.handleGlobalI18n('campaign', 'wave1_warning'),
            type: 'warning'
          })
          this.wave1 = true
        }
      },
      wave2Change(value) {
        if (this.wave1 === false && value) {
          this.$notify({
            title: this.handleGlobalI18n('campaign', 'warning'),
            message: this.handleGlobalI18n('campaign', 'wave2_warning'),
            type: 'warning'
          })
          this.wave2 = false
          return true
        }
        if (this.wave3 === true && !value) {
          this.$notify({
            title: this.handleGlobalI18n('campaign', 'warning'),
            message: this.handleGlobalI18n('campaign', 'wave2_1_warning'),
            type: 'warning'
          })
          this.wave2 = true
        }
      },
      wave3Change(value) {
        if (this.wave2 === false && value) {
          this.$notify({
            title: this.handleGlobalI18n('campaign', 'warning'),
            message: this.handleGlobalI18n('campaign', 'wave3_warning'),
            type: 'warning'
          })
          this.wave3 = false
        }
      }
    },
    watch: {
      'lifecycle_info.status': {
        handler(val) {
          if (val.toLowerCase() === 'submit') {
            // 已经是开启状态
            this.enable_state = true
          }
        }
      },
      'lifecycle_info': {
        handler(val) {
          if (this.action) {
            this.update_state = true
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $check-color: #4ac2e7;
  .color-57a {
    .svg-icon {
      color: rgb(181, 182, 184) !important;
    }
  }
  .lifecycle-studio{
    // position: absolute;
    // left: 0;
    // top: 0;
    // width: 100%;
    // height: 100%;
    $width: 20px;
    padding: $width;
    .operating{
      background: #ffffff;
      position: relative;
      padding-left: 9px;
      z-index: 99;
      top: 0;
      width: 100%;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .save,.start_using,.block_up,.back{
        text-align: center;
        background: #fff;
        display: flex;
        align-items: center;
        label{
          color: rgba(61, 142, 227, 1);
          font-size: 14px;
        }
        cursor: pointer;
        margin-right: 18px;
        position: relative;
        &:not(:last-child) {
          &:after{
            content: '';
            position: absolute;
            right: -10px;
            width: 1px;
            height: 80%;
            top: 50%;
            transform: translate(0, -50%);
            background: rgba(61, 142, 227, 1);
          }
        }
      }
      img{
        width: 22px;
        height: 22px;
        margin-right: 5px;
      }
    }
    .div-title{
      width: 100%;
      height: 80px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 0px 0px rgba(170, 170, 170, 1);
      border: 1px solid rgba(255, 255, 255, 0);
      display: flex;
      align-items: center;
      .image{
        width: 73px;
        margin-left:18px;
        margin-right: 17px;
        height: 48px;
      }
      p{
        color: rgba(183, 218, 253, 1);
        font-size: 28px;
        text-align: left;
        width: 550px;
      }
    }
    .nonius{
      width: 100%;
      margin-top: 20px;
      background-color: #ffffff;
      display: flex;
      justify-content: space-around;
      height: 158px;
      .item{
        font-size: 16px;
        &:hover{
          cursor: pointer;
        }
        &:last-child{
          padding-right: 17px;
          &:after{
            width: 0!important;
          }
        }
        padding-left:17px;
        flex: 1;
        border:2px solid #ffffff;
        position: relative;
        &:after{
          content: '';
          width: 10px;
          height: 100%;
          position: absolute;
          top:0;
          right:-10px;
          background: #fff;
        }
        .top{
          height: 68px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left{
            display: flex;
            align-items: center;
            p{
              color: rgba(16, 16, 16, 1);
              font-size: 18px;
            }
          }
          .image{
            width: 42px;
            height: 42px;
            border-radius: 42px;
            margin-right: 13px;
          }
          .svg-icon{
            font-size: 42px;
          }
          &:after{
            content: '';
            position: absolute;
            bottom: 0;
            left:0;
            height: 1px;
            width: 100%;
            background: rgba(228, 228, 228, 1);
          }
        }
        .bottom{
          color: rgba(16, 16, 16, 1);
          font-size: 1em;
          line-height: 25px;
          padding-top: 10px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      .arrow{
        min-width: 98px;
        position: relative;
        &:after{
          content:"";
          position:absolute;
          left:0;
          top:0;
          width:116px;
          height:1px;
          background: #E4E4E4;
          transform-origin:0 0;
          transform:rotateZ(42deg);
        }
        &:before{
          content:"";
          position:absolute;
          left:-3px;;
          bottom:0;
          width:116px;
          height:1px;
          background: #E4E4E4;
          transform-origin:0 0;
          transform:rotateZ(-42deg);
        }
      }
    }
  }
  .detail{
    margin-top: 20px;
    background: #ffffff;
    position: relative;
  }
  .check-item{
    border-color:$check-color #ffffff $check-color $check-color!important;
    box-shadow: 0px 0px 6px 0px $check-color;
  }
  .check-item1{
    @extend .check-item;
    border-left-color: #ffffff!important;
    &:before{
      content: '';
      position: absolute;
      left: -7px;;
      top: 0;
      height: 100%;
      width: 15px;
      background: #ffffff;
    }
  }
  .check-item2{
    @extend .check-item;
    border-right: 2px solid $check-color!important;
    &:before{
      content: '';
      position: absolute;
      left: -7px;;
      top: 0;
      height: 100%;
      width: 15px;
      background: #ffffff;
    }
    &:after{
      content: '';
      width: 0!important;

    }
  }
  .check-arrow{
    &:after{
      height: 2px!important;
      background: $check-color!important;
      box-shadow: 0px 0px 6px 0px $check-color;
    }
    &:before{
      height: 2px!important;
      background: $check-color!important;
      box-shadow: 0px 0px 6px 0px $check-color;
    }
  }
  .check-arrow1{
    border-top: 2px solid $check-color;
    border-bottom: 2px solid $check-color;
    box-shadow: 5px 0px 6px 0px $check-color;
    &:before{
      transform-origin: 4px -1px!important;
    }
    &:after{
      transform-origin: 2px 0px!important;
    }
  }
</style>
