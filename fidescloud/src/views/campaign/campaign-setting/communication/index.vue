<template>
  <div class="communication">
    <el-dialog :title="handleGlobalI18n('campaign', getStateTitle)" :visible.sync="dialogState" width="1000px">
      <div class="ld">
        <div class="valiable" v-if="!editState">
          <label>{{handleGlobalI18n('campaign', 'variable')}}:</label>
          <div style="overflow-y: hidden;min-height: 300px;width: 250px">
            <el-scrollbar style="height:100%;">
              <div class="list">
                <p  v-show = "radio[targets-1].reservedFieldList.length>0" v-for="(item,index) in radio[targets-1].reservedFieldList" :key="index" @click="selVal(item)" v-html="item.name"></p>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="content">
          <label>{{handleGlobalI18n('campaign', 'content')}}:</label>
          <textarea
            style="width:470px"
            ref="input"
            @blur="clickText"
            v-model="textarea2">
          </textarea>
         </div>
      </div>
      <div style="margin-top:14px; text-align: center">
        <el-button type="danger" v-if="!editState"  @click="confirm" >{{handleGlobalI18n('campaign', 'confirm')}}</el-button>
        <el-button @click="dialogState=false;editState = false">{{handleGlobalI18n('campaign', 'cancel')}}</el-button>
      </div>
    </el-dialog>
    <!--EDM-->
    <dialog-edm
      :type="edm_type"
      :dialog_edm="dialog_edm"
      :reserved_field_list="reserved_field_list"
      :handle_obj="handle_obj"
      :template_content="textarea2"
      :subject="subject"
      @cancelDialog="cancelDialog"
      @editTemplate="changeChannel">
    </dialog-edm>
    <div :class="{'not-allowed': campaign_status === '3'}">
      <handle-radio :disabled="campaign_status === '3'" :data="radio" :campaign_targets="targets" @selId="checkTarget"></handle-radio>
    </div>
    <div class="a">
      <div class="left" v-if="targets===1">
        <img src="../../../../assets/images/tem1.png">
        <div class="content">
          <div class="top">
            <div class="icon">
                <svg-icon icon-class="message"></svg-icon>
            </div>
            <label>Message</label>
            <span>Now</span>
          </div>
          <p v-html="(radio[parseInt(targets)-1].template.length>0 && radio[parseInt(targets)-1].template[select_template_index].content != undefined)? radio[parseInt(targets)-1].template[select_template_index].content: ''"></p>
        </div>
      </div>
      <div class="left" v-else-if="targets===3">
        <img src="../../../../assets/images/tem2.png" >
        <div class="content2">
          <div class="top">
            <h5>Service notification</h5>
            <label class="time">17/05/2018</label>
          </div>
          <p v-html="(radio[parseInt(targets)-1].template.length>0 && radio[parseInt(targets)-1].template[select_template_index].content != undefined)? radio[parseInt(targets)-1].template[select_template_index].content: ''"></p>
          <div class="bottom">
            <label>Details</label>
            <svg-icon icon-class="arrow_down"></svg-icon>
          </div>
        </div>
      </div>
      <div class="right">
        <el-form class="template-list flex" label-position="right"  label-width="150px" :rules="rules" :model="form" ref="form">
          <el-row class="ul"  :gutter="20">
                <el-form-item :label="handleGlobalI18n('campaign', 'choose_template') + ':'">
                  <div style="overflow-y: hidden">
                  <div :class = "{'height180' : campaign_status === '3', 'height400' : campaign_status !== '3'}">
                  <el-scrollbar style="height:100%;">
                  <el-col :xs="24" :sm="24" :lg="8" :xl="6" class="li" :class="{'not-allowed': campaign_status === '3'}" v-if="campaign_status !== '3'">
                    <div @click="addT" :class="{'pointer-events bg-f5f7fa': campaign_status === '3'}">
                      <div class="info">
                        <svg-icon icon-class="add_t" class="add_t"></svg-icon>
                      </div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8" :xl="6" class="li"  v-show = "radio[targets-1].template.length>0" v-for="(item,index) in radio[targets-1].template" :key="index" :class="{'not-allowed': campaign_status === '3'}">
                  <div class="li" >
                    <div class="info cursor-pointer"  @click="select_template_index=index" :class="{'check':index===select_template_index,  'pointer-events  bg-f5f7fa': campaign_status === '3'}" >
                      <div style="height:100%">
                        <svg-icon class="corner" icon-class="corner"></svg-icon>
                        <p v-html="item.content"></p>
                      </div>
                      <div class="button">
                        <div class="edit" @click.stop="editTemplate(item,index)">
                          <span>{{handleGlobalI18n('campaign', 'view')}}</span>
                        </div>
                        <!--<div class="delete" @click.stop="delTemplate(item)">-->
                          <!--<i class="el-icon-delete"></i>-->
                          <!--<span>Delete</span>-->
                        <!--</div>-->
                      </div>
                    </div>
                  </div>
                </el-col>
                  </el-scrollbar>
                  </div>
                  </div>
                </el-form-item>
              </el-row>
          <el-form-item :label="handleGlobalI18n('campaign', 'send_date') + ':'" prop="send_date" :rules="[ { required: true, message: handleGlobalI18n('validation', 'send_date_null'), trigger: 'change' }]">
            <el-date-picker style="width: 200px" type="date" :disabled="campaign_status === '3'" :picker-options="pickerOptions0"  :format="globalData.value.date_format"  :placeholder="handleGlobalI18n('campaign', 'please_select')" v-model="form.send_date" value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!--新增发送测试短信-->
          <div class="send-test" v-if="targets === 1">
            <el-form ref="form2" :model="send_test_query" style="display: flex">
              <el-form-item label="" prop="mobile" :rules="[{ required: true, message: handleGlobalI18n('validation', 'is_null'), trigger: ['blur', 'change'] }]">
                <el-input v-model="send_test_query.mobile" placeholder="Enter phone number"></el-input>
              </el-form-item>
              <el-button type="primary" style="height: 30px;" :loading="send_test_message_statue" @click.stop="handleSendTestMessage(1,  radio[parseInt(targets)-1].template[select_template_index].content)">Send test message</el-button>
            </el-form>
          </div>
          <!--发送测试邮件-->
          <div class="send-test" v-if="targets === 2">
            <el-form ref="form2" :model="send_test_query2" style="display: flex">
              <el-form-item label="" prop="email" :rules="[{ required: true, message: handleGlobalI18n('validation', 'is_null'), trigger: ['blur', 'change'] }]">
                <el-input v-model="send_test_query2.email" placeholder="Enter email address"></el-input>
              </el-form-item>
              <el-button type="primary" style="height: 30px;" :loading="send_test_message_statue" @click.stop="handleSendTestMessage(2,  radio[parseInt(targets)-1].template[select_template_index].content)">Send test message</el-button>
            </el-form>
          </div>
          <el-form-item>
            <div class="t-button">
              <el-button @click="back(2, 'back')">{{handleGlobalI18n('campaign', 'back')}}</el-button>
              <el-button @click="back(4, 'next')" type="primary" :loading="nextLoading">{{handleGlobalI18n('campaign', 'next')}}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <loading v-show="mixLoadingState"></loading>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import HandleRadio from '../handleRadio'
  import { getSelectPosition } from '@/utils'
  import { mixLoading } from '@/utils/util'
  import {
    getCommunicationChannelTypeList,
    addOrUpdateCampaignCommunication,
    getTemplateListByCommunicationChannelType,
    getReservedFieldListByCommunicationChannelType,
    addTemplate,
    updateTemplate,
    addCommunicationChannel,
    sendCommunication
  } from '@/api/campaign'
  import DialogEdm from '@/views/campaign/dialog-edm'
  import { checkObjHasOwnProperty } from '@/utils'
  export default {
    mixins: [mixLoading],
    components: {
      HandleRadio,
      DialogEdm
    },
    props: {
      campaign_wizard_id: {
        type: Number
      },
      campaign_type: {
        type: String,
        default: '1'
      }
    },
    data() {
      return {
        send_test_message_statue: false,
        send_test_query: {
          mobile: ''
        },
        send_test_query2: {
          email: ''
        },
        reserved_field_list: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        rules: {},
        // campaign_wizard_id: 15,
        dynamic_fields: [],
        dialogState: false,
        select_template_index: 0,
        targets: 1,
        nextLoading: false,
        radio: [{ template: [], reservedFieldList: [] }, { template: [], reservedFieldList: [] }, { template: [], reservedFieldList: [] }],
        dialogEdit: false,
        form: {
          send_date: ''
        },
        textarea2: '',
        seleP: 0,
        editState: false,
        editId: '',
        nextState: false,
        step123: 0,
        campaign_status: '',
        dialog_edm: false,
        subject: '',
        handle_obj: {},
        edm_type: ''
      }
    },
    computed: {
      getStateTitle() {
        return this.editState ? 'view' : 'add'
      },
      ...mapGetters([
        'campaign_edit',
        'campaign_add'
      ])
    },
    created() {
      this.init()
    },
    methods: {
      ...mapMutations({
        setAdd: 'SET_ADD'
      }),
      // 发送测试消息
      handleSendTestMessage(channel_type, content) {
        this.$refs['form2'].validate((valid) => {
          if (valid) {
            this.send_test_message_statue = true
            var obj = { channel_type: channel_type, content: content, mobile_phone: this.send_test_query.mobile, email_subject: '', email: this.send_test_query2.email }
            if (channel_type === 2) {
              obj.email_subject = this.radio[parseInt(this.targets) - 1].template[this.select_template_index].subject
            }
            sendCommunication(obj).then(res => {
              this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
              this.send_test_message_statue = false
            }).catch(_ => {
              this.send_test_message_statue = false
            })
          }
        })
      },
      cancelDialog(state) {
        this.dialog_edm = state
      },
      addT() {
        this.textarea2 = ''
        this.editId = ''
        if (this.targets !== 2) {
          this.dialogState = true
        } else {
          this.handle_obj = {
            communication_channel_type: this.handleChannelType(),
            communication_channel_type_id: this.radio[this.targets - 1].id,
            communication_template_id: ''
          }
          this.reserved_field_list = this.radio[this.targets - 1].reservedFieldList
          this.dialog_edm = true
          this.edm_type = 'add'
        }
      },
      handleAddTemplate(obj) {
        addTemplate(obj).then(res => {
          this.getTemplateList()
        })
      },
      handleEditTemplate(obj) {
        updateTemplate(obj).then(res => {
          this.editState = false
          this.getTemplateList()
        })
      },
      async init() {
        try {
          await this.getCommunicationChannelList()
          this.initEdit()
          // 模板字段
          if (this.campaign_status !== '3') {
            await this.getTemplateList()
            await this.getReservedFieldList()
            await this.initEditTemplate()
          }
        } catch (err) {
          console.log(err)
        }
        await this.handleMixLoadingStateFalse()
      },
      initEditTemplate() {
        if (this.campaign_edit.state && this.campaign_edit.id !== null) {
          const edit_detail = this.campaign_edit.detail
          if (JSON.parse(edit_detail.communication) !== null) {
            const communication = JSON.parse(edit_detail.communication).communication_channels[0]
            if (communication !== null) {
              var i = 0
              for (var item of this.radio[this.targets - 1 ].template) {
                if (item.id === communication.communication_template_id) {
                  this.select_template_index = i
                  return true
                }
                i++
              }
            }
          }
        }
        return true
      },
      initEdit() {
        if (this.campaign_edit.state && this.campaign_edit.id !== null) {
          const edit_detail = this.campaign_edit.detail
          this.step123 = edit_detail.step
          this.campaign_status = edit_detail.campaign_status
          if (JSON.parse(edit_detail.communication) !== null) {
            const communication = JSON.parse(edit_detail.communication)
            const communication_channel = communication.communication_channels[0]
            if (communication_channel !== null) {
              this.form.send_date = communication_channel.send_date
              this.targets = JSON.parse(communication_channel.communication_channel_code)
              this.radio[this.targets - 1].template.push(communication.communication_info)
              this.select_template_index = 0
            }
          }
        }
      },
      getCommunicationChannelList() {
        return getCommunicationChannelTypeList().then(res => {
          this.radio = []
          for (const item of res.return_result) {
            this.radio.push({
              title: item.name, id: item.id, template: [], code: item.code
            })
          }
        })
      },
      getReservedFieldList() {
        return getReservedFieldListByCommunicationChannelType({ communication_channel_type: this.handleChannelType() }).then(res => {
          this.radio[this.targets - 1].reservedFieldList = res.return_result === null ? [] : res.return_result
        })
      },
      getTemplateList() {
        return getTemplateListByCommunicationChannelType({ communication_channel_type: this.radio[this.targets - 1].code, page_no: 1, page_size: 100 }).then(res => {
          const result = res.return_result
          if (result.result === null) {
            return false
          }
          if (!checkObjHasOwnProperty(result, 'result')) {
            return false
          }
          this.radio[this.targets - 1].template = result.result
        })
      },
      editTemplate(info, index) {
        this.editState = true
        this.editId = index
        this.textarea2 = info.content
        this.subject = info.subject
        if (this.targets === 2) {
          this.handle_obj = {
            communication_channel_type: this.handleChannelType(),
            communication_channel_type_id: this.radio[this.targets - 1].id,
            communication_template_id: this.radio[this.targets - 1].template[this.editId].id
          }
          this.reserved_field_list = this.radio[this.targets - 1].reservedFieldList
          this.dialog_edm = true
          this.edm_type = 'view'
        } else {
          this.dialogState = true
        }
      },
      delTemplate(tag) {
        this.select_template_index = 0
        this.template.splice(this.template.indexOf(tag), 1)
      },
      confirm() {
        var timestamp = Date.parse(new Date())
        var template_field_list = []
        var patt = /\{([^{}]+)\}/g
        var result = []
        var i = 1
        while ((result = patt.exec(this.textarea2)) != null) {
          for (const item of this.radio[this.targets - 1].reservedFieldList) {
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
          communication_channel_type: this.handleChannelType(),
          communication_channel_type_id: this.radio[this.targets - 1].id,
          content: this.textarea2,
          setting_time: timestamp,
          template_reserved_fields: template_field_list
        }
        this.setAdd(Object.assign({}, this.campaign_add, {
          'communication': Object.assign({}, handle_obj, {
            communication_channel_name: this.radio[this.targets - 1].title
          })
        }))
        if (this.editState) {
          const obj = this.radio[this.targets - 1].template[this.editId]
          obj.content = this.textarea2
          // 修改
          // this.$set(this.radio[this.targets - 1].template, this.editId, obj)

          // 处理
          handle_obj.communication_template_id = this.radio[this.targets - 1].template[this.editId].id
          this.handleEditTemplate(handle_obj)
        } else {
          // 新增
          this.handleAddTemplate(handle_obj)
        }
        this.dialogState = false
      },
      handleChannelType() {
        if (this.radio[this.targets - 1].title === 'SMS') {
          return 1
        } else if (this.radio[this.targets - 1].title === 'EDM') {
          return 2
        } else if (this.radio[this.targets - 1].title === 'WeChat') {
          return 3
        }
      },
      selVal(item) {
        if (this.targets === 2) {
          // this.textarea2 = this.textarea2 + `{${item.name}}`
          // this.textarea2 = this.textarea2 + `{${item.name}}`
          // this.$refs.tinymce.setContent(this.textarea2)
        } else {
          this.textarea2 = this.insert_flg(this.textarea2, `{${item.name}}`, this.seleP)
          this.seleP = this.textarea2.length
        }
      },
      insert_flg(str, flg, sn) {
        var newstr = str.substring(0, sn) + flg + str.substring(sn, str.length)
        return newstr
      },
      clickText() {
        this.seleP = getSelectPosition(this.$refs['input'])
      },
      back(id, type) {
        if (type === 'back') {
          if (this.campaign_type === '4') {
            this.$emit('selectTabs', 1)
          } else {
            this.$emit('selectTabs', parseInt(id))
          }
        } else if (type === 'next') {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.nextLoading = true
              this.toNext(id)
            } else {
              return false
            }
          })
        }
      },
      addOrUpdateCampaignC1() {
        return addOrUpdateCampaignCommunication({
          compaign_wizard_id: this.campaign_wizard_id,
          communication_channels: [{
            communication_channel_code: this.targets,
            communication_template_id: this.radio[this.targets - 1].template[this.select_template_index].id,
            send_date: this.form.send_date
          }],
          communication_info: this.radio[this.targets - 1].template[this.select_template_index]
        })
      },
      async toNext(id) {
        this.setAdd(Object.assign({}, this.campaign_add, {
          'communication': {
            communication_channel_name: this.radio[this.targets - 1].title,
            send_date: this.form.send_date,
            communication_template_content: this.radio[this.targets - 1].template[this.select_template_index].content
          }
        }))
        if (this.campaign_status === '3') {
          this.$emit('selectTabs', 4)
          this.nextLoading = false
          return true
        }
        try {
          await this.addOrUpdateCampaignC1()
          await this.addOrUpdateCampaignC2(id)
        } catch (err) {
          console.log(err)
        }
      },
      addOrUpdateCampaignC2(id) {
        return addCommunicationChannel({
          communication_channel_type_id: this.radio[this.targets - 1].id,
          planned_sendout_date: this.form.send_date,
          template_id: this.radio[this.targets - 1].template[this.select_template_index].id,
          backend_campaign_id: this.campaign_wizard_id
        }).then(res => {
          this.nextState = true
          this.nextLoading = false
          this.$emit('selectTabs', parseInt(id))
        })
      },
      checkTarget(id) {
        this.select_template_index = 0
        this.targets = id
        if (this.radio[this.targets - 1].template.length <= 0) {
          this.changeChannel()
        }
      },
      async changeChannel() {
        try {
          await this.handleMixLoadingStateTrue()
          await this.getReservedFieldList()
          await this.getTemplateList()
          await this.handleMixLoadingStateFalse()
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .send-test{
    margin-top: 6px;
    margin-left: 150px;
    .el-input{
      width: 200px;
    }
    .el-button{
      margin-left: 17px;
      width: 145px;
    }
  }
  .el-scrollbar__wrap {
    overflow-y: scroll !important;
  }
  .height400 {
    height: 400px;
  }
  .height180 {
    height: 180px;
  }
  .communication {
    margin-top: 13px;
    background-color: #ffffff;
    padding: 20px 30px 70px;
    .a {
      margin-top: 26px;
      display: flex;
      flex: 1;
      .left {
        width: 280px;
        margin-right:50px;
        img {
          width: 100%;
        }
        position: relative;
        .content{
          color:#000000;
          font-size:14px;
          line-height: 16px;
          width: 80%;
          position: absolute;
          top:220px;
          left: 50%;
          transform: translate(-49%,0);
          border-radius: 8px;
          box-shadow: 0 10px 20px rgba(0,0,0,.5);
          padding: 12px 12px 20px;
          background-color: rgba(116, 124, 136, 0.8);
          p{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp:5;
            overflow: hidden;
          }
        }
        .top{
          font-size:15px;
          display: flex;
          align-items: center;
          color:#ffffff;
          margin-bottom: 12px;
          .icon{
            background-color: #50f167;
            padding:2px;
            border-radius: 3px;
            margin-right:7px;
            .svg-icon{
              font-size:13px;
            }
          }
          position: relative;
          span{
            position: absolute;
            right:0;
          }
        }
        .content2{
          @extend .content;
          top:122px;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: none;
          .top{
            display: block;
            color: #000000;
          }
          h5{
            margin-bottom: 5px;
          }
          .time{
            color:#888888;
          }
          .bottom{
            margin-top:10px;
            padding-top:10px;
            position: relative;
            border-top:1px solid #000000;
            .svg-icon{
              position: absolute;
              right:0;
            }

          }
        }
        .content3{
          @extend .content;
          top:72px;
          left:45%;
          background-color: rgba(0,0,0,0);
          box-shadow: none;
          p {
            -webkit-line-clamp: 3;
          }
        }
      }
      .width-450{
        width: 450px;
      }
      .right {
        flex: 1;
        label {
          width: 155px;
          text-align: right;
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
        }
        .ul {
          width: 100%;
          .li {
            .info {
              margin-bottom: 20px;
              height: 150px;
              border-radius: 0;
              background-color: rgba(255, 255, 255, 0);
              text-align: center;
              border: 1px dashed rgba(187, 187, 187, 1);
              position: relative;
            }
            p {
              line-height: 20px;
              color: rgba(16, 16, 16, 1);
              font-size: 14px;
              padding-top:25px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 4;
              overflow: hidden;
              height:100%;
            }
            .corner {
              position: absolute;
              top: 0;
              left: 0;
              font-size: 35px;
              color:#888888;
            }
            .button{
              font-size:14px;
              background-color: #f2f2f2;
              color: $primary;
              left:0;
              right:0;
              i{
                margin-right:5px;
              }
              align-items: center;
              height:40px;
              position: absolute;
              bottom:0;
              flex:1;
              justify-content: space-around;
              display: flex;
              .edit{
                flex: 1;
                // @extend .delete;
                position: relative;
                /*&:after{*/
                  /*content:'';*/
                  /*position: absolute;*/
                  /*right:0;*/
                  /*top:0;*/
                  /*bottom:0;*/
                  /*width: 1px;*/
                  /*height:20px;*/
                  /*background-color:$primary;*/
                  /*margin: auto;*/
                /*}*/
              }
              .delete{
                flex: 0 0 0%;
              }
            }
            .add_t{
              font-size:48px;
              color:#888888;
              position: absolute;
              left:0;
              right:0;
              top:0;
              bottom:0;
              margin:auto;
            }
            .check{
              border-style: solid;
              border-color:$primary;
              .corner{
                color:$primary;
              }
            }
          }
        }
        .send-date{
          margin-top: 10px;
          margin-bottom:30px;
          line-height: 30px;
          label{
            .el-input{
              height:30px;
            }
          }
        }
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
  }
</style>
