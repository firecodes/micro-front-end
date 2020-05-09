<template>
  <div class="how-item config">
    <!--SMS and Wechat-->
    <el-dialog :title="handleGlobalI18n('campaign', 'edit')" :visible.sync="dialog_state" width="1000px">
      <div class="ld">
        <div class="valiable">
          <label>{{handleGlobalI18n('campaign', 'variable')}}:</label>
          <div style="overflow-y: hidden;min-height: 300px;width: 250px">
            <el-scrollbar style="height:100%;">
              <div class="list">
                <p  v-show = "reserved_field_list.length>0" v-for="(item,index) in reserved_field_list" :key="index" @click="selVal(item)" v-html="item.name"></p>
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
        <el-button type="danger"  @click="confirm" >{{handleGlobalI18n('campaign', 'confirm')}}</el-button>
        <el-button @click="dialog_state=false">{{handleGlobalI18n('campaign', 'cancel')}}</el-button>
      </div>
    </el-dialog>
    <!--EDM-->
    <dialog-edm
      :dialog_edm="dialog_edm"
      :reserved_field_list="reserved_field_list"
      :handle_obj="handle_obj"
      :template_content="textarea2"
      :subject="subject"
      @cancelDialog="cancelDialog"
      @editTemplate="editTemplate"
    ></dialog-edm>
    <div class="left">
      <el-form label-position="top" label-width="80px" :disabled="!edit_state">
        <div class="template_type">
          <div class="type-item" v-for="(item,index) in channel_list" :key="index"  :class="{'not-allowed ': !edit_state}">
            <div :class="{'pointer-events': !edit_state}" @click="form.kind=item.code" >
              <svg-icon :icon-class="form.kind === item.code ? 'radiobox' : 'radio02'"></svg-icon>
              <label>{{handleGlobalI18n('campaign', item.name)}}</label>
            </div>
          </div>
        </div>
        <div class="communication">
          <div class="item template">
            <el-form-item :label="handleGlobalI18n('campaign', 'template') + ':'">
              <section class="template_list" >
                <div class="template_item add" v-loading="template_loading" v-if="!template.id"  @click="edit">
                  <svg-icon icon-class="add_t" class="add_svg"></svg-icon>
                </div>
                <div class="template_item" v-loading="template_loading" v-else>
                  <div style="height:100%">
                    <p v-html="template.content"></p>
                  </div>
                  <div class="template_button" :class="{'not-allowed ': !edit_state}">
                    <div class="edit cursor-pointer" :class="{'pointer-events': !edit_state}" @click="edit">
                      <i class="el-icon-edit"></i>
                      <span>{{handleGlobalI18n('campaign', 'edit')}}</span>
                    </div>
                  </div>
                </div>
              </section>
            </el-form-item>
          </div>
        </div>
        <div class="button">
          <el-button @click="save">{{handleGlobalI18n('campaign', 'lifecycle_save')}}</el-button>
        </div>
      </el-form>
    </div>
    <div class="preview">
      <div class="preview_detail" v-if="form.kind==='SMS'">
        <img src="../../../../assets/images/tem1.png" />
        <div class="content">
          <div class="top">
            <div class="icon">
              <svg-icon icon-class="message"></svg-icon>
            </div>
            <label>Message</label>
            <span>Now</span>
          </div>
          <p>{{template.content}}</p>
        </div>
      </div>
      <div class="preview_detail" v-else-if="form.kind==='WeChat'">
        <img src="../../../../assets/images/tem2.png" >
        <div class="content2">
          <div class="top">
            <h5>Service notification</h5>
            <label class="time">17/05/2018</label>
          </div>
          <p>{{template.content}}</p>
          <div class="bottom">
            <label>Details</label>
            <svg-icon icon-class="arrow_down"></svg-icon>
          </div>
        </div>
      </div>
      <!-- <div class="preview_detail" v-else-if="form.kind==='EDM'">
        <div class="content3">
          <p style="border:6px solid #adadad; padding:20px 10px ">【member service】today is your birthday, we will send you a gift. Please click here ~</p>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
  import DialogEdm from '@/views/campaign/dialog-edm'
  import { mapGetters, mapMutations } from 'vuex'
  import { getLifeCycleTemplateListByType } from '@/api/lifecycleStudio'
  import { getReservedFieldListByCommunicationChannelType } from '@/api/campaign'
  import { getSelectPosition } from '@/utils'
  import { updateTemplate, addTemplate } from '@/api/campaign'
  export default {
    props: {
      edit_state: {
        type: Boolean,
        default: false
      },
      nonius_id: {
        type: Number,
        default: 1
      },
      communication_channel_list: {
        type: Array,
        default: []
      }
    },
    components: {
      DialogEdm
    },
    computed: {
      ...mapGetters([
        'lifecycle_info',
        'lifecycle_configuration'
      ])
    },
    data() {
      return {
        subject: '',
        handle_obj: {},
        dialog_edm: false,
        dialog_state: false,
        seleP: 0,
        template_loading: false,
        channel_list: this.communication_channel_list,
        template: {},
        form: {},
        reserved_field_list: [],
        textarea2: ''
      }
    },
    methods: {
      ...mapMutations({
        setLifecycleHow: 'SET_LIFECYCLE_HOW'
      }),
      init() {
        const info = JSON.parse(JSON.stringify(this.lifecycle_info))
        const communication_definition_list = info.wave_list[this.nonius_id - 1].communication_definition_list[0]
        this.form = { ...communication_definition_list }
      },
      cancelDialog(state) {
        this.dialog_edm = state
      },
      getChannelTemplate() {
        this.template_loading = true
        getLifeCycleTemplateListByType({ communication_channel_type: this.form.kind, wave_number: this.nonius_id, campaign_type: this.lifecycle_configuration[parseInt(this.$route.params.id)].lifecycle_campaign_type }).then(res => {
          this.template = res.return_result.length <= 0 ? {} : res.return_result[0]
          this.form.communication_channel_code = this.template.id
          this.template_loading = false
          this.textarea2 = this.template.content
          this.subject = this.template.subject
        })
      },
      fieldTemplateList() {
        getReservedFieldListByCommunicationChannelType({ communication_channel_type: this.handleChannelType() }).then(res => {
          this.reserved_field_list = res.return_result === null ? [] : res.return_result
        })
      },
      edit() {
        if (this.form.kind !== 'EDM') {
          this.textarea2 = this.template.content
          this.dialog_state = true
        } else {
          var channel_type_id = 1
          for (var item of this.channel_list) {
            if (item.code === this.form.kind) {
              channel_type_id = item.id
            }
          }
          this.handle_obj = {
            communication_channel_type: this.handleChannelType(),
            communication_channel_type_id: channel_type_id,
            communication_template_id: this.form.communication_channel_code
          }
          this.dialog_edm = true
        }
      },
      save() {
        this.$emit('save', 'save')
      },
      editTemplate() {
        this.getChannelTemplate()
      },
      selVal(item) {
        if (this.form.kind === 'EDM') {
          this.textarea2 = this.textarea2 + `{${item.name}}`
          this.$refs.tinymce.setContent(this.textarea2)
        } else {
          this.textarea2 = this.insert_flg(this.textarea2, `{${item.name}}`, this.seleP)
          this.seleP = this.textarea2.length
        }
      },
      insert_flg(str, flg, sn) {
        if (str === '' || !str) {
          return flg
        }
        var newstr = str.substring(0, sn) + flg + str.substring(sn, str.length)
        return newstr
      },
      clickText() {
        this.seleP = getSelectPosition(this.$refs['input'])
      },
      confirm() {
        var timestamp = Date.parse(new Date())
        var template_field_list = []
        var patt = /\{([^{}]+)\}/g
        var result = []
        var i = 1
        while ((result = patt.exec(this.textarea2)) != null) {
          for (const item of this.reserved_field_list) {
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
        var channel_type_id = 1
        for (var item of this.channel_list) {
          if (item.code === this.form.kind) {
            channel_type_id = item.id
          }
        }
        var handle_obj = {
          communication_channel_type: this.handleChannelType(),
          communication_channel_type_id: channel_type_id,
          campaign_type_id: this.lifecycle_configuration[parseInt(this.$route.params.id)].campaign_type_id,
          content: this.textarea2,
          setting_time: timestamp,
          template_reserved_fields: template_field_list
        }
        // 处理
        if (this.template.id) {
          handle_obj.communication_template_id = this.template.id
          this.handleEditTemplate(handle_obj)
        } else {
          this.handleAddTemplate(handle_obj)
        }
        this.dialog_state = false
      },
      handleEditTemplate(obj) {
        updateTemplate(obj).then(res => {
          this.editState = false
          this.getChannelTemplate()
        })
      },
      handleAddTemplate(obj) {
        addTemplate(obj).then(res => {
          this.getChannelTemplate()
        })
      },
      handleChannelType() {
        if (this.form.kind === 'SMS') {
          return 1
        } else if (this.form.kind === 'EDM') {
          return 2
        } else if (this.form.kind === 'WeChat') {
          return 3
        }
      }
    },
    watch: {
      'form': {
        handler(val) {
          this.setLifecycleHow({ info: JSON.parse(JSON.stringify(this.form)), nonius_id: this.nonius_id })
        },
        deep: true
      },
      'form.kind': {
        handler(val) {
          this.$emit('setCommunicationChannel', this.form.kind)
          this.getChannelTemplate()
          this.fieldTemplateList()
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
  .config{
    .el-input, .el-input-number{
      width: 200px;
    }
    min-height: 436px;
    padding-bottom: 20px;
    margin-top: 55px;
    .button{
      margin-left: 200px;
      .el-button{
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: center;
        width: 90px;
      }
    }
  }
  .how-item{
    display: flex;
    flex: 1;
    .left{
      flex: 0 0 50%;
    }
    .el-form-item{
      margin-left: 35px;
    }
    .item{
      .svg-icon{
        flex: 0 0 20px;
        margin-top: 5px;
        font-size: 20px!important;
        margin-left: 50px;
      }
    }
    .template_type{
      cursor: pointer;
      margin-left: 25px;
      display: flex;
      margin-bottom: 20px;
      .type-item{
        flex: 0 0 30%;
      }
    }
    .template{
      &_item{
        margin-right: 45px;
        margin-bottom: 20px;
        height: 140px;
        width: 297px;
        border-radius: 0;
        background-color: rgba(255, 255, 255, 0);
        text-align: center;
        border: 1px solid rgba(187, 187, 187, 1);
        position: relative;
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

      }
      .add{
        .add_svg{
          font-size:48px!important;
          color:#888888;
          position: absolute;
          left:0;
          right:0;
          top:0;
          bottom:0;
          margin:auto;
        }
      }
      &_button{
        font-size:14px;
        background-color: #f2f2f2;
        left:0;
        width: 100%;
        right:0;
        left: 815px;
        color: rgba(61, 142, 227, 1);
        i{
          margin-right:5px;
        }
        align-items: center;
        height:40px;
        position: absolute;
        bottom:0;
        left:0;
        flex:1;
        justify-content: space-around;
        display: flex;
        .edit{
          flex: 1;
          position: relative;
        }
      }
    }
    .button{
      margin-top: 20px!important;
      margin-left: 35px!important;
    }
    .preview{
      &_detail{
        width: 280px;
        margin-right:50px;
        img {
          width: 90%;
        }
        position: relative;
        .content{
          color:#000000;
          font-size:14px;
          line-height: 16px;
          width: 70%;
          position: absolute;
          top:180px;
          left: 45%;
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
    }
  }
</style>
