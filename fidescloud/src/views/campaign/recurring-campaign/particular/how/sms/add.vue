<!--
  新增
-->
<template>
  <div class="recurring_campaign_how__add_sms">
    <ed-dialog>
      <!--Edit Add-->
      <el-dialog :before-close="toHandleClose" :title="edit_state ? $t('campaign.fc_campaign_spot_create_how_sms_btn_edit_label') : $t('campaign.fc_campaign_spot_how_sms_add_title_label')" :visible.sync="dialog_visible" width="1000px">
        <ed-form>
          <el-form :model="form" :rules="rules" label-width="80px" ref="form">
          <div class="detail">
            <div class="left">
              <!--Variable-->
              <el-form-item :label="$t('campaign.fc_campaign_spot_how_sms_add_variable_label')">
                <div class="el-select-dropdown el-popper variable" style="min-width: 240px; margin-top: 0; height:327px; transform-origin: center top; z-index: 2019;" v-loading="reserved_field_loading" x-placement="bottom-start">
                  <el-scrollbar style="height:100%; width: 100%">
                    <ul class="el-scrollbar__view el-select-dropdown__list" >
                      <li :key="item.id" @click="selVal(item)" class="el-select-dropdown__item" v-for="item in reserved_field_list" ><span>{{item.name}}</span></li>
                    </ul>
                  </el-scrollbar>
                </div>
              </el-form-item>
            </div>
            <div class="right">
              <!--Content-->
              <el-form-item :label="$t('campaign.fc_campaign_spot_how_sms_add_centent_label')" prop="content">
               <textarea
                 @blur="clickText"
                 ref="input"
                 style="height: 327px;width:530px;background:rgba(255,255,255,1);border-radius:4px;border:1px solid rgba(204,204,204,1);resize: none;"
                 v-model="form.content">
                </textarea>
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
  import { getSelectPosition } from '@/utils'
  import { updateTemplate, addTemplate } from '@/api/campaign'

  export default {
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
          this.handleOpen()
        } else {
          this.select_identifying = 0
          this.dialog_visible = false
          this.reserved_field_loading = true
          this.reserved_field_list = []
          this.save_loading = false
          this.edit_state = false
          this.form.content = ''
        }
        this.$emit('handleDialogShow', value)
      }
    },
    data() {
      return {
        select_identifying: 0,
        dialog_visible: false,
        form: {
          content: ''
        },
        rules: {
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
      handleOpen() {
        if (Object.keys(this.template_row).length > 0) {
          this.form.content = this.template_row.content || ''
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
      // 添加或者更新模板s
      handleSave() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            var template_field_list = []
            var patt = /\{([^{}]+)\}/g
            var result = []
            var i = 1
            while ((result = patt.exec(this.form.content)) != null) {
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
            var handle_obj = {
              campaign_type_id: this.form_data.campaign_type_code,
              communication_channel_type: 1,
              communication_channel_type_id: 1,
              content: this.form.content,
              setting_time: Date.parse(new Date()),
              template_reserved_fields: template_field_list
            }
            this.save_loading = true
            if (this.edit_state) {
              // 编辑
              updateTemplate(Object.assign({}, handle_obj, { communication_template_id: this.template_row.id })).then(res => {
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
              addTemplate(handle_obj).then(res => {
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
        this.form.content = this.insert_flg(this.form.content, `{${item.name}}`, this.select_identifying)
        this.select_identifying = this.form.content.length
      },
      insert_flg(str, flg, sn) {
        return str.substring(0, sn) + flg + str.substring(sn, str.length)
      },
      clickText() {
        this.select_identifying = getSelectPosition(this.$refs['input'])
      },
      toHandleClose() {
        this.dialog_visible = false
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign_how__add_sms{
    .dialog-footer{
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
      margin-top: -10px;
      display: flex;
      justify-content: space-between;
      .right{
        margin-right: 10px;
      }
    }
  }
</style>
