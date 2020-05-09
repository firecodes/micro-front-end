<template>
  <div class="trigger-campaign-how-item" ref="how">
    <el-form label-width="150px" >
      <p class="p">{{$t('campaign.fc_campaign_trigger_edit_how_title_label')}}</p>
      <!--选择模式-->
      <div class="select-mode">
        <el-form-item :label="$t('campaign.fc_campaign_trigger_edit_how_channel_label')">
          <el-select v-model="form.kind">
            <el-option
              v-for="item in options"
              :key="item.code"
              :label="handleGlobalI18n('campaign', item.code)"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!--选择模式为SMS-->
      <div class="sms-mode" v-if="form.kind === 'SMS'">
        <div class="left">
          <div class="img iphone">
            <img alt="" src="../../../../assets/images/iPhone-x.png">
            <div class="content" v-if="options[0].template.length > 0">
              <v-clamp autoresize :max-lines="10" style="text-align: left">{{options[0].template[sms_id].content}}</v-clamp>
            </div>
          </div>
          <div class="preview">
            <el-button>{{$t('campaign.fc_campaign_trigger_edit_how_btn_preview_label')}}</el-button>
          </div>
        </div>
        <div class="right">
          <ul>
            <li class="add" @click="dialog_state = true; textarea2 = ''">
              <i class="el-icon-plus" />
            </li>
            <li v-for="(item, index) in options[0].template" v-if="item!== null" :class="{'item_check': sms_id === index }"  @click="sms_id = index" >
              <p v-html="item.content" />
              <div class="bottom-button">
                <div class="edit" @click="dialog_state = true; textarea2 = item.content; edit_state = true; edit_id = item.id">
                  <i class="el-icon-edit" />
                  <p>{{$t('campaign.fc_campaign_trigger_edit_how_btn_edit_label')}}</p>
                </div>
              </div>
            </li>
          </ul>
          <test-message
            channel_type="1"
            :content="options[0].template.length > 0 ? options[0].template[sms_id].content : ''"
            :email_subject="options[0].template.length > 0 ? options[0].template[sms_id].subject : ''"
          />
        </div>
      </div>
      <!--选择模式为EDM-->
      <div class="edm-mode" v-if="form.kind === 'EDM'">
        <div class="left">
          <div class="img ipad">
            <img alt="" src="../../../../assets/images/iPad.png">
            <div class="content" v-if="options[1].template.length > 0">
              <el-scrollbar style="height:100%; width: 100%">
                <p class="center">
                  <label>To:</label>
                  <span>Target Group</span>
                </p>
                <p class="center">
                  <label>Subject:</label>
                  <span>{{options[1].template[edm_id].subject}}</span>
                </p>
                <div class="line"></div>
                <p style="width: 100%;" v-html="options[1].template[edm_id].content" />
              </el-scrollbar>
            </div>
          </div>
          <div class="preview" @click="handlePreview">
            <el-button>{{$t('campaign.fc_campaign_trigger_edit_how_btn_preview_label')}}</el-button>
          </div>
        </div>
        <div class="right">
          <ul>
            <li class="add" @click="dialog_edm = true; type = 'add'; textarea2=''">
              <i class="el-icon-plus" />
            </li>
            <li v-for="(item, index) in options[1].template" v-if="item !== null" :class="{'item_check': edm_id === index}"  @click="edm_id = index" >
              <p v-html="item.content" />
              <div class="bottom-button">
                <div class="edit" @click="editTemplate(item,index)">
                  <i class="el-icon-edit" />
                  <p>{{$t('campaign.fc_campaign_trigger_edit_how_btn_edit_label')}}</p>
                </div>
              </div>
            </li>
          </ul>
          <test-message
            channel_type="2"
            :content="options[1].template.length > 0 ? options[1].template[edm_id].content : ''"
            :email_subject="options[1].template.length > 0 ? options[1].template[edm_id].subject : ''"
          />
        </div>
      </div>
      <!--选择模式为Wechat-->
      <div class="sms-mode" v-if="form.kind === 'WeChat'">
        <div class="right">
          <div style="overflow-y: hidden;min-height: 400px;width: 100%">
            <el-scrollbar style="height:100%;">
              <ul style=" height:400px;">
                <li class="add" @click="dialog_state_wechat = true; textarea2 = ''">
                  <i class="el-icon-plus" />
                </li>
                <li v-for="(item, index) in options[2].template" v-if="item!== null" :class="{'item_check': wechat_id === index }"  @click="wechat_id = index" >
                  <p v-html="item.content" />
                  <div class="bottom-button">
                    <div class="edit" @click="dialog_state_wechat = true; textarea2 = item.content; edit_state = true; edit_id = item.id">
                      <i class="el-icon-edit" />
                      <p>{{$t('campaign.fc_campaign_trigger_edit_how_btn_edit_label')}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <!--SMS  编辑或者添加-->
      <el-dialog :title="handleGlobalI18n('campaign', 'edit')" :visible.sync="dialog_state" width="1000px">
        <div class="ld">
          <div class="valiable">
            <label>{{handleGlobalI18n('campaign', 'variable')}}:</label>
            <div style="overflow-y: hidden;min-height: 300px;width: 250px">
              <el-scrollbar style="height:100%;">
                <div class="list">
                  <p  :key="index" @click="selVal(item)" v-for="(item,index) in options[0].reserved_field_list" v-html="item.name" v-show = "options[0].reserved_field_list.length>0" />
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="content">
            <label>{{handleGlobalI18n('campaign', 'content')}}:</label>
            <textarea @blur="clickText" ref="input" style="width:470px" v-model="textarea2"></textarea>
          </div>
        </div>
        <div style="margin-top:14px; text-align: center" class="dialog-sms-button">
          <el-button @click="dialog_state=false" class="cancel">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
          <el-button :loading="sms_loading_dialog"  @click="addOrUpdateSmsTemplate(1)" type="primary">{{$t('loyalty.fc_operation_btn_confirm_label')}}</el-button>
        </div>
      </el-dialog>

      <!--WeChat  编辑或者添加-->
      <el-dialog :title="$t('campaign.fc_campaign_trigger_edit_how_edit_title_label')" :visible.sync="dialog_state_wechat" v-if="options[2] !== undefined" width="1000px">
        <div class="ld">
          <div class="valiable">
            <label>{{$t('campaign.fc_campaign_trigger_edit_how_edit_variable_label')}}</label>
            <div style="overflow-y: hidden;min-height: 300px;width: 250px">
              <el-scrollbar style="height:100%;">
                <div class="list">
                  <p  :key="index" @click="selVal(item)" v-for="(item,index) in options[2].reserved_field_list" v-html="item.name" v-show = "options[2].reserved_field_list.length>0" />
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="content">
            <label>{{$t('campaign.fc_campaign_trigger_edit_how_edit_content_label')}}</label>
            <textarea
              style="width:470px"
              ref="input"
              @blur="clickText"
              v-model="textarea2">
          </textarea>
          </div>
        </div>
        <div style="margin-top:14px; text-align: center" class="dialog-sms-button">
          <el-button @click="dialog_state_wechat=false" class="cancel">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
          <el-button :loading="wechat_loading_dialog"  @click="addOrUpdateWechatTemplate(3)" type="primary">{{$t('loyalty.fc_operation_btn_confirm_label')}}</el-button>
        </div>
      </el-dialog>
      <!--EDM 编辑或者添加-->
      <dialog-edm
        :dialog_edm="dialog_edm"
        :reserved_field_list="options[1].reserved_field_list"
        :handle_obj="handle_obj"
        :template_content="textarea2"
        :subject="subject"
        :type="type"
        :campaign_type_id="campaign_type_id"
        @cancelDialog="dialog_edm = false"
        @editTemplate="refreshTemplate">
      ></dialog-edm>
    </el-form>
  </div>
</template>
<script>
  import DialogEdm from '@/views/campaign/dialog-edm'
  import { getSelectPosition } from '@/utils'
  import TesterGroup from '../../tester-group'
  import TestMessage from '../../test-message'
  import VClamp from 'vue-clamp'
  import { getTemplateListByCommunicationChannelType, updateTemplate, addTemplate, getReservedFieldListByCommunicationChannelType, getCommunicationChannelTypeList } from '@/api/campaign'
  export default {
    props: {
      nonius_id: {
        type: Number,
        default: 1
      },
      form_data: {
        type: Object,
        default: {}
      },
      campaign_type_id: {
        type: Number
      }
    },
    components: {
      TestMessage,
      DialogEdm,
      TesterGroup,
      VClamp
    },
    data() {
      return {
        wechat_loading_dialog: false,
        dialog_state_wechat: false,
        cam_info: {},
        listQuery: {},
        send_test_message_statue: false,
        sms_loading_dialog: false,
        edit_state: false,
        edit_id: null,
        seleP: 0,
        dialog_state: false,
        type: 'edit',
        subject: '',
        textarea2: '',
        handle_obj: {},
        dialog_edm: false,
        edm_id: 0,
        sms_id: 0,
        wechat_id: 0,
        options: [{
          template: [],
          reserved_field_list: []
        }, {
          template: [],
          reserved_field_list: []
        }, {
          template: [],
          reserved_field_list: []
        }],
        query: {
          mobile: '',
          email: ''
        },
        form: {},
        is_init: false
      }
    },
    created() {
      this.cam_info = JSON.parse(window.localStorage.trigger_cam_info)
      this.getCommunicationChannelList()
    },
    methods: {
      handleTemplate(id) {
        if (this.form.kind === 'SMS' && id === 1 && this.options[0].template.length > 0) {
          return this.options[0].template[this.sms_id].id
        } else if (this.form.kind === 'EDM' && id === 2 && this.options[1].template.length > 0) {
          return this.options[1].template[this.edm_id].id
        } else if (this.form.kind === 'WeChat' && id === 3 && this.options[2].template.length > 0) {
          return this.options[2].template[this.wechat_id].id
        } else {
          return 1
        }
      },
      // 预览
      handlePreview() {
        const w = window.open('about:blank')
        w.document.write(this.options[1].template[this.edm_id].content)
        w.document.close()
      },
      // refreshTemplate
      refreshTemplate() {
        this.getTemplateList(this.form.kind)
      },
      // 获取沟通的渠道
      getCommunicationChannelList() {
        return getCommunicationChannelTypeList().then(res => {
          this.options = []
          for (const item of res.return_result) {
            this.options.push({
              title: item.name, id: item.id, template: [], code: item.code, reserved_field_list: []
            })
          }
        })
      },
      handleGetId() {
        if (this.form.kind === 'SMS') {
          return 0
        } else if (this.form.kind === 'EDM') {
          return 1
        } else {
          return 2
        }
      },
      // 获取模板预设字段
      getReservedFieldList() {
        return getReservedFieldListByCommunicationChannelType({ communication_channel_type: this.options[this.handleGetId()].id }).then(res => {
          this.options[this.handleGetId()].reserved_field_list = res.return_result === null ? [] : res.return_result
        })
      },
      insert_flg(str, flg, sn) {
        return str.substring(0, sn) + flg + str.substring(sn, str.length)
      },
      selVal(item) {
        this.textarea2 = this.insert_flg(this.textarea2, `{${item.name}}`, this.seleP)
        this.seleP = this.textarea2.length
      },
      clickText() {
        this.seleP = getSelectPosition(this.$refs['input'])
      },
      editTemplate(item, index) {
        this.handle_obj = {
          campaign_type_id: this.campaign_type_id,
          communication_channel_type: 2,
          communication_channel_type_id: 2,
          communication_template_id: item.id
        }
        this.dialog_edm = true
        this.textarea2 = item.content
        this.type = 'edit'
        this.subject = item.subject
      },
      init() {
        const info = JSON.parse(JSON.stringify(this.form_data))
        const communication_definition_list = info.communication_definition_list
        this.form = { ...communication_definition_list }
        if (Object.keys(this.form).length > 0) {
          if (this.form.kind === 'SMS') {
            this.options[0].template.forEach((item, index, input) => {
              if (parseInt(item.id) === parseInt(this.form.communication_template_id)) {
                this.sms_id = index
              }
            })
          } else if (this.form.kind === 'EDM') {
            this.options[1].template.forEach((item, index, input) => {
              if (parseInt(item.id) === parseInt(this.form.communication_template_id)) {
                this.edm_id = index
              }
            })
          } else {
            this.options[2].template.forEach((item, index, input) => {
              if (parseInt(item.id) === parseInt(this.form.communication_template_id)) {
                this.wechat_id = index
              }
            })
          }
        }
      },
      // 获取沟通渠道对应的模板数据
      getTemplateList(channel_type) {
        return getTemplateListByCommunicationChannelType({ communication_channel_type: channel_type, campaign_type_id: this.campaign_type_id, page_size: 100, page_no: 1 }).then(res => {
          this.options[this.handleGetId()].template = res.return_result === null || res.return_result.result.length <= 0 ? [] : res.return_result.result
          if (!this.is_init) {
            // 处理选中的模板
            if (this.form.kind === 'EDM' && this.form.communication_template_id > 0) {
              this.options[1].template.forEach((item, index, input) => {
                if (item.id === this.form.communication_template_id) {
                  this.edm_id = index
                  this.is_init = true
                }
              })
            } else if (this.form.kind === 'SMS' && this.form.communication_template_id > 0) {
              this.options[0].template.forEach((item, index, input) => {
                if (item.id === this.form.communication_template_id) {
                  this.sms_id = index
                  this.is_init = true
                }
              })
            } else if (this.form.kind === 'WeChat' && this.form.communication_template_id > 0) {
              this.options[2].template.forEach((item, index, input) => {
                if (item.id === parseInt(this.form.communication_template_id)) {
                  this.wechat_id = index
                  this.is_init = true
                }
              })
            }
          }
        }).catch(_ => {})
      },
      addOrUpdateWechatTemplate(communication_channel_type_id) {
        if (this.textarea2 === null || this.textarea2 === undefined || this.textarea2 === '') {
          this.$message({
            message: 'WeChat content cannot be blank',
            type: 'warning'
          })
          return false
        }
        var timestamp = Date.parse(new Date())
        var template_field_list = []
        var patt = /\{([^{}]+)\}/g
        var result = []
        var i = 1
        while ((result = patt.exec(this.textarea2)) != null) {
          for (const item of this.options[2].reserved_field_list) {
            if (item.name === result[1]) {
              template_field_list.push({
                reserved_field_id: item.id,
                sequence: i
              })
              i++
              break
            }
          }
        }
        var handle_obj = {
          campaign_type_id: this.campaign_type_id,
          communication_channel_type: communication_channel_type_id,
          communication_channel_type_id: communication_channel_type_id,
          content: this.textarea2,
          setting_time: timestamp,
          template_reserved_fields: template_field_list
        }
        this.wechat_loading_dialog = true
        if (this.edit_state) {
          // 编辑
          updateTemplate(Object.assign({}, handle_obj, { communication_template_id: this.edit_id })).then(res => {
            this.editState = false
            this.refreshTemplate()
            this.dialog_state_wechat = false
            this.wechat_loading_dialog = false
          }).catch(() => {
            this.wechat_loading_dialog = false
          })
        } else {
          // 新增
          addTemplate(handle_obj).then(res => {
            this.refreshTemplate()
            this.dialog_state_wechat = false
            this.wechat_loading_dialog = false
          }).catch(() => {
            this.wechat_loading_dialog = false
          })
        }
      },
      // 添加 或者更新模板操作
      addOrUpdateSmsTemplate(communication_channel_type_id) {
        if (this.textarea2 === null || this.textarea2 === undefined || this.textarea2 === '') {
          this.$message({
            message: 'Sms content cannot be blank',
            type: 'warning'
          })
          return false
        }
        var timestamp = Date.parse(new Date())
        var template_field_list = []
        var patt = /\{([^{}]+)\}/g
        var result = []
        var i = 1
        while ((result = patt.exec(this.textarea2)) != null) {
          for (const item of this.options[0].reserved_field_list) {
            if (item.name === result[1]) {
              template_field_list.push({
                reserved_field_id: item.id,
                sequence: i
              })
              i++
              break
            }
          }
        }
        var handle_obj = {
          campaign_type_id: this.campaign_type_id,
          communication_channel_type: communication_channel_type_id,
          communication_channel_type_id: communication_channel_type_id,
          content: this.textarea2,
          setting_time: timestamp,
          template_reserved_fields: template_field_list
        }
        this.sms_loading_dialog = true
        if (this.edit_state) {
          // 编辑
          updateTemplate(Object.assign({}, handle_obj, { communication_template_id: this.edit_id })).then(res => {
            this.editState = false
            this.refreshTemplate()
            this.dialog_state = false
            this.sms_loading_dialog = false
          }).catch(() => {
            this.sms_loading_dialog = false
          })
        } else {
          // 新增
          addTemplate(handle_obj).then(res => {
            this.refreshTemplate()
            this.dialog_state = false
            this.sms_loading_dialog = false
          }).catch(() => {
            this.sms_loading_dialog = false
          })
        }
      }
    },
    watch: {
      'form.kind': {
        async handler(val) {
          await this.getCommunicationChannelList()
          await this.getTemplateList(val)
          await this.getReservedFieldList()
        }
      },
      form_data: {
        handler(val) {
          this.init()
        }
      },
      nonius_id: {
        handler(val) {
          this.init()
        },
        immediate: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .trigger-campaign-how-item{
    .el-input, .el-select{
      width: 153px;
    }
    .tip{
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      text-align: left;
      margin-left: 12px;
    }
    .p{
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .select-mode{
      margin-top: 17px;
    }
  }
  .sms-mode, .edm-mode{
    display: flex;
    .left{
      position: relative;
      text-align: center;
      .icon{
        position: absolute;
        bottom: 3%;
        right: 5%;
        font-size: 24px;
        color: #101010;
      }
      .preview{
        margin-bottom: 50px;
      }
      width: 345px;
      background: #fff;
      .ipad{
        width: 311px;
        height: 438px;
        .content{
          overflow-y: hidden;
          height: 327px;
          width: 85%;
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
          img{
            width: 100%;
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
          left: 0;
          display: inline-table;
          background: #e5e5e8;
          border-radius: 6px;
          width: 131px;
          line-height: 14px;
          color: rgba(16, 16, 16, 1);
          top: 0;
          color: #101010;
          position: absolute;
          bottom:0;
          margin: 85px 22px;
          padding: 4px;
          font-size: 10px;
          p{
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 10;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    .right {
      flex: 1;
      padding: 34px 24px 0 20px;
      ul{
        display: flex;
        flex-wrap: wrap;
        li{
          border-radius: 5px;
          overflow: hidden;
          display: flex;
          margin: 0 20px 20px 0;
          width: 290px;
          height: 140px;
          background-color: rgba(255, 255, 255, 0);
          border: 1px solid rgba(187, 187, 187, 1);
          p{
            display: -webkit-box;
            text-overflow: ellipsis;
            overflow : hidden;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            padding: 10px;
            line-height: 24px;
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
          }
          position: relative;
          .bottom-button{
            position: absolute;
            bottom: 0;
            height: 40px;
            width: 100%;
            display: flex;
            align-items: center;
            background: rgba(242, 242, 242, 1);
          }
          .line{
            height: 45%;
            border-right: 1px solid #000;
          }
          .edit, .delete{
            width: 100%;
            cursor: pointer;
            line-height: 40px;
            text-align: center;
            color: #101010;
            p{
              display: inline;
              font-size: 14px!important;
              line-height: 1!important;
              padding: 0!important;
            }
            border: 1px solid rgba(255, 255, 255, 0);
          }
        }
        .add{
          border-style: dashed;
          border-color: $primary;
          text-align: center;
          cursor: pointer;
          border-width: 2px;
          i{
            line-height: 140px;
            font-size: 56px;
            color: $primary;
            position: absolute;
            left: 0;
            right: 0;
            text-align: center;
          }
        }
      }
    }
  }
  .send-test{
    margin-top: 6px;
    .el-input{
      width: 200px;
    }
    .el-button{
      margin-left: 17px;
      width: 145px;
    }
  }
  .item_check {
    border-color: $primary!important;
    background: url("../../../../assets/images/coupon-xuanze.png") no-repeat!important;
    background-size: 30px!important;
    background-position: right top!important;
  }
  .dialog-sms-button{
    .el-button{
      width: 90px;
    }
    .cancel{
      border-color: $primary;
      color: $primary;
    }
  }
  .ld{
    display: flex;
    height:300px;
    width: 750px;
    label{
      font-size:14px;
      width: 80px;
      text-align: right;
      padding-right: 10px;
    }
    .valiable{
      width: 70%;
      margin-right:5px;
      display: flex;
      .list{
        min-height:300px;
        border:1px solid #888888;
      }
      p{
        padding-left:5px;
        line-height: 40px;
        border-bottom: 1px dashed #666666;
        &:hover{
          background: #99a9bf;
        }
      }
    }
    .content{
      margin-left:30px;
      display: flex;
      width: 100%;
      textarea{
        width: 100%;
        resize:none
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .ipad{
    img{
      width: 100%;
    }
  }
  .edm-mode .right li p{
    img{
      display: none;
    }
  }
</style>

