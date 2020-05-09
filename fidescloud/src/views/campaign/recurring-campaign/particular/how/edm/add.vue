<!--
  新增/修改EDM
  2020/01/13
-->
<template>
  <div class="spot_campaign_how__add_edm">
    <ed-dialog>
      <!--Edit Add-->
      <el-dialog :before-close="toHandleClose" :title="edit_state ? $t('campaign.fc_campaign_spot_create_how_edm_btn_edit_label') : $t('campaign.fc_campaign_spot_how_edm_add_title_label')" :visible.sync="dialog_visible" fullscreen>
        <ed-form>
          <el-form :model="form" :rules="rules" label-width="80px" ref="form">
            <!--Subject-->
            <el-form-item :label="$t('campaign.fc_campaign_spot_how_edm_add_subject_label')" prop="subject">
              <el-input v-model="form.subject"></el-input>
            </el-form-item>
            <div class="detail">
              <div class="left">
                <!--Variable-->
                <el-form-item :label="$t('campaign.fc_campaign_spot_how_edm_add_variable_label')">
                  <div class="el-select-dropdown el-popper variable" v-loading="reserved_field_loading" x-placement="bottom-start">
                    <el-scrollbar style="height:100%; width: 100%">
                      <ul class="el-scrollbar__view el-select-dropdown__list" >
                        <li :key="item.id" @click="selVal(item)" class="el-select-dropdown__item" v-for="item in reserved_field_list" ><span>{{item.name}}</span></li>
                      </ul>
                    </el-scrollbar>
                  </div>
                </el-form-item>
              </div>
              <div class="right">
                <el-form-item label=" " label-width="0">
                  <editor
                    :accept           = "Accept"
                    :max-size         = "MaxSize"
                    :reserved_field="reserved_field"
                    :setting="editorSetting"
                    :url              = "Url"
                    :value="form.content"
                    :with-credentials = "withCredentials"
                    @on-upload-fail         = "onEditorReady"
                    @on-upload-success= "onEditorUploadComplete"
                    @show="editors"
                    class="editor" />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </ed-form>
        <span class="dialog-footer" slot="footer">
          <!--cancel-->
          <el-button @click="dialog_visible = false" class="cancel">{{$t('campaign.fc_campaign_spot_how_sms_add_btn_cancel_label')}}</el-button>
          <!--confirm-->
          <el-button :loading = "save_loading" @click="handleSave" class="confirm" type="primary">{{$t('campaign.fc_campaign_spot_how_sms_add_btn_confirm_label')}}</el-button>
        </span>
      </el-dialog>
    </ed-dialog>
  </div>
</template>
<script>
  import { getReservedFieldListByCommunicationChannelType } from '@/api/campaign'
  import { updateTemplate, addTemplate } from '@/api/campaign'
  import editor from '@/components/Edit/edit'
  import { uploadImgUrl } from '@/api/api'

  export default {
    components: {
      editor
    },
    props: {
      dialog_show_state: {
        type: Boolean,
        value: false
      },
      template_row: {
        type: Object,
        value: {}
      },
      form_data: {
        type: Object
      },
      channel_id: {
        type: Number,
        value: -1
      }
    },
    watch: {
      dialog_show_state() {
        this.dialog_visible = this.dialog_show_state
      },
      dialog_visible(value) {
        if (value) {
          this.editorSetting.height = document.body.clientHeight - 270
          this.handleOpen()
        } else {
          this.dialog_visible = false
          this.reserved_field_loading = true
          this.reserved_field_list = []
          this.save_loading = false
          this.edit_state = false
          this.form.content = ''
          this.form.subject = ''
        }
        this.$emit('handleDialogShow', value)
      }
    },
    data() {
      return {
        reserved_field: '',
        resources: [],
        MaxSize: 75765, // 文件大小
        Accept: 'image/jpeg, image/png, image/gif', // 文件格式
        withCredentials: true,
        Url: uploadImgUrl, // 图片对应的上传地址
        editorSetting: { // 配置富文本编辑器高
          height: '100%'
        },
        dialog_visible: false,
        form: {
          content: '',
          subject: ''
        },
        rules: {
          subject: [
            { required: true, message: 'can not be empty', trigger: ['blur'] }
          ],
          content: [
            { required: true, message: 'can not be empty', trigger: ['blur', 'change'] }
          ]
        },
        reserved_field_loading: true,
        reserved_field_list: [],
        save_loading: false,
        edit_state: false
      }
    },
    methods: {
      onEditorUploadComplete(json) { // 处理上传图片后返回数据， 添加进resources进行保存
        this.resources.push(json)
      },
      onEditorReady(ins, ina) { // 上传失败的函数
        // console.log('ins')
        // console.log(ins)
        // console.log(ina)
      },
      editors(content) { // editor组件传过来的值赋给content
        this.form.content = content
      },
      handleOpen() {
        if (Object.keys(this.template_row).length > 0) {
          this.form.content = this.template_row.content || ''
          this.form.subject = this.template_row.subject || ''
          this.edit_state = true
        }
        // 获取动态字段值
        if (this.channel_id <= 0 || !this.channel_id) {
          return true
        }
        this.reserved_field_list = []
        getReservedFieldListByCommunicationChannelType({ communication_channel_type: this.channel_id }).then(res => {
          this.reserved_field_loading = false
          this.reserved_field_list = res.return_result === null ? [] : res.return_result
        }).catch(() => {
          this.$message.error('Failed to get the dynamic field')
          this.reserved_field_loading = false
        })
      },
      handleSave() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
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
            this.form.content = this.form.content.replace(/&amp;/g, '&')
            var n_obj = { subject: this.form.subject, content: this.form.content, setting_time: Date.parse(new Date()), template_reserved_fields: template_field_list, resources: this.resources, campaign_type_id: this.campaign_type_id, communication_channel_type: 2, communication_channel_type_id: 2 }
            this.save_loading = true
            if (this.edit_state) {
              // 编辑
              updateTemplate(Object.assign({}, n_obj, { communication_template_id: this.template_row.id })).then(res => {
                // 传递出去 重新刷新
                this.$emit('refreshTemplate')
                this.dialog_visible = false
                this.$message.success('Success')
                this.save_loading = false
              }).catch(() => {
                this.$message.error('Fail')
                this.save_loading = false
              })
            } else {
              // 新增
              addTemplate(n_obj).then(res => {
                // 传递出去 重新刷新
                this.$emit('refreshTemplate')
                this.dialog_visible = false
                this.$message.success('Success')
                this.save_loading = false
              }).catch(() => {
                this.$message.error('Fail')
                this.save_loading = false
              })
            }
          }
        })
      },
      selVal(item) {
        this.reserved_field = item.name
      },
      toHandleClose() {
        this.dialog_visible = false
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign_how__add_edm{
    /deep/ .el-dialog__body{
      padding: 10px 20px;
    }
    .dialog-footer{
      position: absolute;
      top: 12px;
      right: 20px;
      .cancel{
        background-color: #ffffff;
        border-color: $new-primary;
        color: $new-primary;
        min-width: 88px;
      }
      .confirm{
        background-color: $new-primary;
        border-color: $new-primary;
        min-width: 88px;
      }
    }
    .detail{
      display: flex;
      justify-content: space-between;
      width: 100%;
      .variable{
        min-width: 240px;
        margin-top: 0;
        height: calc(100vh - 200px);
        transform-origin: center top;
        z-index: 2019;
      }
      .right{
        width: calc(100vw - 399px);
        border-radius:4px;
      }
    }
  }
</style>
