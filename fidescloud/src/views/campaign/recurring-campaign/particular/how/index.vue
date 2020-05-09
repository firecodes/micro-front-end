<template>
  <div class="recurring_campaign__how " v-loading = 'loading'>
    <ed-form class="recurring_campaign__how_index">
      <el-form :model="form" :rules="rules" label-position="left" label-width="280px" ref="when">
        <!--select the channel-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_how_channel_label')" class="select_channel">
          <div class="flex">
            <el-select v-model="form.channel_value">
              <el-option :key="item.code" :label="$t(`campaign.${item.label}`)" :value="item.code" v-for="item in channel_list"  />
            </el-select>
            <!--SMS-->
            <template v-if="form.channel_value === 'SMS'">
              <div class="add_sms">
                <!--Add sms-->
                <el-button @click="handleAdd('SMS')" type="primary">{{$t('campaign.fc_campaign_spot_create_how_btn_add_sms_label')}}</el-button>
              </div>
              <div @click="menu_type_list = !menu_type_list" class="icon-menu">
                <svg-icon icon-class="tile_card_list" v-show="menu_type_list" ></svg-icon>
                <img :src='require("@/assets/images/coupon/tile.png")' class="tile" v-show="!menu_type_list" />
              </div>
            </template>
            <!--EDM-->
            <template v-else-if="form.channel_value === 'EDM'">
              <div class="add_edm">
                <!--Add Edm-->
                <el-button @click="handleAdd('EDM')" type="primary">{{$t('campaign.fc_campaign_spot_create_how_btn_add_edm_label')}}</el-button>
              </div>
              <div @click="menu_type_list_edm = !menu_type_list_edm" class="icon-menu">
                <svg-icon icon-class="tile_card_list" v-show="menu_type_list_edm" ></svg-icon>
                <img :src='require("@/assets/images/coupon/tile.png")' class="tile" v-show="!menu_type_list_edm" />
              </div>
            </template>
          </div>
        </el-form-item>
        <div class="detail" v-if="form.channel_value">
          <component :channel_type_id="handleGetChannelId()" :channel_value="form.channel_value" :communication="communication" :form_data = "form_data" :is="form.channel_value === 'SMS' ? 'SmsComponent' : 'EdmComponent'" :menu_type_list="menu_type_list" :menu_type_list_edm="menu_type_list_edm" :ref="form.channel_value === 'SMS' ? 'SmsComponent' : 'EdmComponent'" :refresh_template="refresh_template" @handleAdd="handleAdd" @handleEditTemplate="handleEditTemplate"></component>
        </div>
      </el-form>
    </ed-form>
    <sms-add :channel_id="handleGetChannelId()" :dialog_show_state = "dialog_show_state_sms" :form_data="form_data" :template_row = "template_row"  @handleDialogShow="handleDialogShow" @refreshTemplate="refreshTemplate" v-if="form.channel_value === 'SMS'"/>
    <edm-add :channel_id="handleGetChannelId()"
             :dialog_show_state = "dialog_show_state_edm"
             :form_data="form_data"
             :template_row = "template_row"
             @handleDialogShow="handleDialogShowEdm"
             @refreshTemplate="refreshTemplate"
             v-else-if="form.channel_value === 'EDM'"
    />
  </div>
</template>
<script>
  import EdmComponent from './edm'
  import SmsComponent from './sms'
  import { handleCommunicationListMixin } from '@/views/data/communication-channel'
  import { addOrUpdateCampaignCommunication, addCommunicationChannel } from '@/api/campaign'
  import SmsAdd from './sms/add'
  import EdmAdd from './edm/add'
  export default {
    mixins: [handleCommunicationListMixin],
    props: {
      form_data: {
        type: Object
      },
      campaign_wizard_id: {
        type: String | Number
      }
    },
    components: {
      SmsAdd,
      EdmAdd,
      EdmComponent,
      SmsComponent
    },
    data() {
      return {
        refresh_template: false,
        dialog_show_state_sms: false,
        dialog_show_state_edm: false,
        loading: true,
        channel_list: [],
        form: {
          channel_value: ''
        },
        template_row: {},
        menu_type_list: true,
        menu_type_list_edm: true,
        rules: {},
        communication: {}
      }
    },
    watch: {
      form_data: {
        handler() {
          this.init()
        },
        deep: true
      }
    },
    created() {
      // 获取沟通渠道（sms edm）
      this.communicationChannelList()
    },
    methods: {
      init() {
        this.communication = this.form_data.communication ? JSON.parse(this.form_data.communication) : null
        if (!this.communication) {
          return true
        }
        this.form.channel_value = this.communication.communication_channels[0].communication_channel_code === '1' ? 'SMS' : 'EDM'
      },
      handleAdd(type) {
        if (type === 'SMS') {
          this.dialog_show_state_sms = true
        } else if (type === 'EDM') {
          this.dialog_show_state_edm = true
        }
        this.template_row = {}
      },
      handleEditTemplate(row, type) {
        if (type === 'SMS') {
          this.template_row = row
          this.dialog_show_state_sms = true
        } else if (type === 'EDM') {
          this.template_row = row
          this.dialog_show_state_edm = true
        }
      },
      handleDialogShow(value) {
        this.dialog_show_state_sms = value
      },
      handleDialogShowEdm(value) {
        this.dialog_show_state_edm = value
      },
      handleGetChannelId(value) {
        if (this.channel_list.length <= 0) {
          return -1
        } else {
          for (var item of this.channel_list) {
            if (item.code === this.form.channel_value) {
              return item.value
            }
          }
        }
        return -1
      },
      communicationChannelList() {
        this.handleGetCommunicationChannelList().then(res => {
          this.loading = false
          this.channel_list = []
          var obj = {}
          for (const item of res) {
            var name = (item.name || '').toLowerCase()
            obj = { value: item.id, name: name, code: item.code, reserved_field_list: [] }
            if (name === 'sms') {
              this.channel_list.push({ ...obj, label: 'fc_campaign_spot_create_how_channel_menu1_label' })
            } else if (name === 'edm') {
              this.channel_list.push({ ...obj, label: 'fc_campaign_spot_create_how_channel_menu2_label' })
            }
            this.form.channel_value = 'SMS'
          }
          this.init()
        }).catch(res => {
          this.loading = false
          this.$message.error('get communication channel error!')
        })
      },
      refreshTemplate() {
        this.refresh_template = !this.refresh_template
      },
      // 保存数据
      saveData() {
        var obj = {
          compaign_wizard_id: this.campaign_wizard_id,
          select_comunication: 0,
          communication_channels: null
        }
        var channel_value = this.form.channel_value.toLowerCase()
        var c_obj = {}
        if (channel_value === 'sms') {
          c_obj = this.$refs['SmsComponent'].handleSaveValue()
        } else if (channel_value === 'edm') {
          c_obj = this.$refs['EdmComponent'].handleSaveValue()
        }
        if (!c_obj.communication_channels[0].communication_template_id) {
          obj.select_comunication = 0
        } else {
          obj.select_comunication = 1
        }
        return new Promise((resolve, reject) => {
          addOrUpdateCampaignCommunication(Object.assign({}, obj, c_obj)).then(res => {
            if (obj.select_comunication === 0) {
              resolve()
            } else {
              var communication_channel_type_id = ''
              for (var item of this.channel_list) {
                if (item.code === this.form.channel_value) {
                  communication_channel_type_id = item.value
                  break
                }
              }
              addCommunicationChannel({
                communication_channel_type_id: communication_channel_type_id,
                planned_sendout_date: null,
                template_id: c_obj.communication_channels[0].communication_template_id,
                backend_campaign_id: this.campaign_wizard_id
              }).then(() => {
                this.$message.success('Success')
                resolve()
              }).catch(() => {
                this.$message.error('Fail1')
                reject()
              })
            }
          }).catch(res => {
            this.$message.error('Fail1')
            reject()
          })
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign__how{
    padding-left: 20px;
    /deep/ .el-checkbox__label{
      display: none;
    }
    /deep/ .el-checkbox__inner{
      width: 20px!important;
      height: 20px!important;
      background-color: #ECF4FF!important;
    }
    /deep/ .el-checkbox__inner::after {
      background-color: $new-primary!important;
      top: 1.8px!important;
      height: 10px!important;
      left: 6px!important;
      width: 5px!important;
    }
    .flex{
      display: flex;
      align-items: center;
      position: relative;
      .tile{
        width: 30px;
        height: 24px;
      }
      .icon-menu{
        cursor: pointer;
        position: absolute;
        right: 20px;
        display: flex;
        align-items: center;
        top: 0;
        bottom:0;
        margin: auto;
        .svg-icon{
          font-size: 30px;
          color: $new-primary
        }
      }
    }
    .add_sms, .add_edm{
      margin-left: 10px;
      .el-button{
        background-color: $new-primary;
        border-color: $new-primary;
        min-width: 100px;
        font-size:16px;
        font-family: HelveticaNeue1;
        color: rgba(255,255,255,1);
        height: 36px;
      }
    }
    &_index{
      /deep/ .el-form-item{
        margin-bottom: 0;
        line-height: 66px;
        &:not(:last-child) {
          border-bottom: 1px solid rgba(230,230,230,1);
        }
      }
      /deep/ .el-form-item__label {
        line-height: 66px;
      }
      /deep/ .el-form-item__content {
        margin-top: 15px;
      }
    }
    .detail{
      margin: 0 0 0 -20px;
    }
  }
</style>
