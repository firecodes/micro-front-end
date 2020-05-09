<template>
  <el-dialog fullscreen :title="handleGlobalI18n('campaign', type)" :visible.sync="dialog_edm_1" @close="cancel">
    <el-form :model="form" ref="subject" label-width="100px">
      <div class="subject">
        <el-form-item
          prop="subject"
          :label="$t('campaign.fc_campaign_lifecycle_edit_how_add_subject_label')"
          :rules="[{ required: true, message: handleGlobalI18n('validation', 'subject_null'), trigger: ['blur', 'change'] }]"
        >
          <el-input v-model="form.subject"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="ld">
      <div class="valiable" v-if="type!=='view'">
        <div style="overflow-y: hidden; min-height:100%; width: 100%;">
          <el-scrollbar style="height:100%;">
            <div class="list">
              <p v-show = "reserved_field_list.length>0" v-for="(item,index) in reserved_field_list" :key="index" @click="selVal(item)" v-html="item.name"></p>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="content">
        <div style="width: 100%;">
          <editor
            class="editor"
            :value="content"
            :reserved_field="reserved_field"
            :setting="editorSetting"
            @show="editors"
            :url              = "Url"
            :max-size         = "MaxSize"
            :accept           = "Accept"
            :with-credentials = "withCredentials"
            @on-upload-fail         = "onEditorReady"
            @on-upload-success= "onEditorUploadComplete"></editor>
        </div>
      </div>
    </div>
    <div style="text-align: center; flex: 100%; margin-top: 40px;" class="width-90">
      <el-button @click="cancel" class="cancle">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
      <el-button @click="confirm" type="primary" v-show="type!=='view'">{{$t('loyalty.fc_operation_btn_confirm_label')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import editor from '@/components/Edit/edit'
  import { uploadImgUrl } from '@/api/api'
  import { updateTemplate, addTemplate } from '@/api/campaign'
  export default{
    props: {
      campaign_type_id: {
        type: Number,
        default: 0
      },
      subject: {
        type: String,
        default: ''
      },
      template_content: {
        type: String,
        default: ''
      },
      handle_obj: {
        type: Object,
        default: {}
      },
      reserved_field_list: {
        type: Array,
        default: []
      },
      dialog_edm: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'modify'
      }
    },
    components: {
      editor
    },
    data() {
      return {
        form: {
          subject: ''
        },
        resources: [],
        reserved_field: '',
        dialog_edm_1: false,
        fullscreen: true,
        editorSetting: { // 配置富文本编辑器高
          height: 500
        },
        Url: uploadImgUrl, // 图片对应的上传地址
        MaxSize: 75765, // 文件大小
        Accept: 'image/jpeg, image/png, image/gif', // 文件格式
        withCredentials: true,
        content: '' // 富文本编辑器双向绑定的内容
      }
    },
    methods: {
      cancel() {
        this.dialog_edm_1 = false
        this.$emit('cancelDialog', this.dialog_edm_1)
      },
      confirm() {
        this.$refs['subject'].validate((valid) => {
          if (valid) {
            this.submit()
          } else {
            return false
          }
        })
      },
      handleAddTemplate(obj) {
        var new_obj = Object.assign({}, { communication_channel_type: 2, communication_channel_type_id: 2 }, obj)
        if (this.campaign_type_id > 0) {
          new_obj = Object.assign({}, { campaign_type_id: this.campaign_type_id }, new_obj)
        }
        addTemplate(new_obj).then(res => {
          this.$emit('editTemplate', 1)
          this.dialog_edm_1 = false
          this.$emit('cancelDialog', this.dialog_edm_1)
        })
      },
      submit() {
        if (this.content === null || this.content === undefined || this.content === '') {
          this.$message({
            message: 'EDM content cannot be blank',
            type: 'warning'
          })
          return false
        }
        var template_field_list = []
        var patt = /\{([^{}]+)\}/g
        var result = []
        var i = 1
        while ((result = patt.exec(this.content)) != null) {
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
        this.content = this.content.replace(/&amp;/g, '&')
        var n_obj = Object.assign({ subject: this.form.subject, content: this.content, setting_time: Date.parse(new Date()), template_reserved_fields: template_field_list, resources: this.resources }, this.handle_obj)
        if (this.handle_obj.communication_template_id === null || this.handle_obj.communication_template_id === '' || this.handle_obj.communication_template_id === undefined) {
          // add
          delete n_obj.communication_template_id
          this.handleAddTemplate(n_obj)
        } else {
          this.handleEditTemplate(n_obj)
        }
      },
      // 修改模板信息
      handleEditTemplate(obj) {
        updateTemplate(obj).then(res => {
          this.$emit('editTemplate', 1)
          this.dialog_edm_1 = false
          this.$emit('cancelDialog', this.dialog_edm_1)
        })
      },
      selVal(item) {
        this.reserved_field = item.name
      },
      editors(content) { // editor组件传过来的值赋给content
        this.content = content
      },
      onEditorReady(ins, ina) { // 上传失败的函数
        // console.log('ins')
        // console.log(ins)
        // console.log(ina)
      },
      onEditorUploadComplete(json) { // 处理上传图片后返回数据， 添加进resources进行保存
        this.resources.push(json)
      }
    },
    watch: {
      'dialog_edm': {
        handler(val) {
          this.dialog_edm_1 = val
        }
      },
      'template_content': {
        handler(val) {
          this.content = val
        }
      },
      subject() {
        this.form.subject = this.subject
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-input{
    width: 500px;
  }
  .cancle{
    border-color: $primary;
    color: $primary;
  }
  .width-90{
    .el-button{
      width: 90px;
    }
  }
  .subject{
    display: flex;
    align-items: center;
    label{
      padding-right: 20px;
    }
    margin-bottom: 20px;
  }
  .ld {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .valiable{
      margin-right:20px;
      display: flex;
      flex-wrap: wrap;
      width: 250px;
      .list{
        flex: 1;
        min-height:100%;
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
      flex: 1;
    }
  }
</style>
