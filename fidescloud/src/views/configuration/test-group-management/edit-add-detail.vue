<template>
  <div class="test-group-management" v-loading="loading">
    <div class="click-button">
      <template v-if="query.type === 'detail'">
        <!--<p class="top-p-left">Coupon Details</p>-->
        <p class="top-p-left" />
      </template>
      <template v-else>
        <p />
      </template>
      <div>
        <!--Go back-->
        <el-button @click="goBack()" class="cancel" v-if="query.type === 'detail'">{{$t('loyalty.fc_operation_btn_back_label')}}</el-button>
        <!--Cancel-->
        <el-button @click="goBack()" class="cancel" v-else>{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
        <!--Edit-->
        <el-button @click="handleClickEdit" class="save el-button-width-108" type="primary" v-if="query.type === 'detail'">{{$t('loyalty.fc_operation_btn_edit_label')}}</el-button>
         <!--Save-->
        <el-button :loading="save_loading" @click="submitForm" class="save" type="primary" v-else>{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
      </div>
    </div>
    <!--info-->
    <div :class="{'detail-contain' : query.type === 'detail'}" class="contain">
      <ed-header-title :title="handleHeaderTitle()" />
      <div class="info">
        <ed-form>
          <el-form :model="form" :rules="rules" label-position="left" label-width="300px" ref="test-group">
            <!--Test group name-->
            <el-form-item :label="$t('configuration.fc_configuration_test_details_name_label')" prop="group_name">
              <template v-if="query.type=== 'detail'">
                <p><ed-clamp :max-lines="1" autoresize>{{form.group_name}}</ed-clamp></p>
              </template>
              <template v-else>
                <el-input maxlength="128" v-model="form.group_name" />
              </template>
            </el-form-item>
            <!--Communication channel-->
            <el-form-item :label="$t('configuration.fc_configuration_test_details_channel_label')" prop="communication_channel_type">
              <template v-if="query.type=== 'detail'">
                <p>{{form.communication_channel}}</p>
              </template>
              <template v-else>
                <el-select :loading="channel_select_loading" v-model="form.communication_channel_type">
                  <el-option :key="item.value" :label="$t(`campaign.${item.label}`)" :value="item.value" v-for="item in channel_list"  />
                </el-select>
              </template>
            </el-form-item>
            <!--Description-->
            <el-form-item :class="{'height-60': query.type === 'detail'}" :label="$t('configuration.fc_configuration_test_details_desc_label')" class="description" prop="group_description">
              <p class="line-height-1 white-space" style="padding-right: 20em; margin-top: 6px" v-html="form.group_description || table_placeholder" v-if="query.type=== 'detail'" />
              <el-input :rows="8" class="width-1000" maxlength="512" type="textarea" v-else v-model="form.group_description" />
            </el-form-item>
            <!-- Contact list -->
            <div class="contact_list_div">
              <el-tooltip :visible-arrow="false" class="tooltip" effect="light" placement="bottom-start">
                <template #content>
                  <p v-html="$t('configuration.fc_configuration_test_add_contact_sms_label')" v-if="form.communication_channel_type === 1" />
                  <p v-else v-html="$t('configuration.fc_configuration_test_add_contact_edm_label')" />
                </template>
                <svg-icon class-name='tishi-i' icon-class="tishi-i" v-show="query.type !== 'detail'"/>
              </el-tooltip>
              <el-form-item :class="{'height-60': query.type === 'detail'}" :label="$t('configuration.fc_configuration_test_details_contact_label')" class="contact_list" prop="contact_list">
                <p class="line-height-1 white-space" style="padding-right: 20em; margin-top: 6px" v-html="form.contact_list" v-if="query.type=== 'detail'" />
                <el-input :rows="8" class="width-1000" maxlength="4096" type="textarea" v-else v-model="form.contact_list" />
              </el-form-item>
            </div>
          </el-form>
        </ed-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { groupAdd, groupEdit, groupDetail } from '@/api/testGroup'
  import { handleOssFileHtmlStr } from '@/views/data/oss-file-html-str'
  import { handleCommunicationListMixin } from '@/views/data/communication-channel'
  import { mapGetters } from 'vuex'
  import { RegExp } from '@/utils/RegExp'
  export default {
    mixins: [handleCommunicationListMixin, handleOssFileHtmlStr],
    computed: {
      ...mapGetters([
        'language'
      ])
    },
    data() {
      return {
        channel_select_loading: false,
        tableData: [],
        channel_list: [],
        loading: false,
        save_loading: false,
        rules: {
          group_name: [{ required: true, message: this.handleGlobalI18n('validation', 'group_name_null'), trigger: ['blur', 'change'] }],
          communication_channel_type: [{ required: true, message: this.handleGlobalI18n('validation', 'communication_channel_null'), trigger: ['blur', 'change'] }],
          contact_list: [{ required: true, message: this.handleGlobalI18n('validation', 'contact_list_null'), trigger: ['change', 'blur'] }, { validator: this.checkContactList, trigger: ['blur'] }
          ]
        },
        form: {
          group_name: '',
          communication_channel_type: '',
          contact_list: '',
          group_description: null
        },
        query: {}
      }
    },
    watch: {
      language() {
        if (this.query.type === 'detail') {
          this.rules = {}
        } else {
          this.rules = {
            group_name: [{ required: true, message: this.handleGlobalI18n('validation', 'group_name_null'), trigger: ['blur', 'change'] }],
            communication_channel_type: [{ required: true, message: this.handleGlobalI18n('validation', 'communication_channel_null'), trigger: ['blur', 'change'] }],
            contact_list: [{ required: true, message: this.handleGlobalI18n('validation', 'contact_list_null'), trigger: ['change', 'blur'] }, { validator: this.checkContactList, trigger: ['blur'] }
            ]
          }
        }
      },
      '$route': {
        handler() {
          this.query = this.$route.query
          this.communicationChannelList()
          if (this.query.type === 'detail' || this.query.type === 'edit') {
            // 获取详情
            this.detail_loading = true
            this.edit_state = true
            this.handleGetDetailInfo()
          }
          if (this.query.type === 'detail') {
            this.rules = {}
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      checkContactList(rule, value, callback) {
        if (!value) {
          return callback(new Error(' '))
        }
        // 验证邮箱
        const reg = RegExp.email
        // 验证手机号 +00 434343 类似这种
        const reg1 = RegExp.area_code_contact_type
        const arr = this.form.contact_list.split(/[,，]/)
        // var reg2 = /^\s|\s$/g
        for (let item of arr) {
          item = item.trim()
          if (this.form.communication_channel_type === 1) {
            // 数字
            if (!reg1.test(item)) {
              return callback(new Error(this.handleGlobalI18n('validation', 'correct_mobile')))
            }
          } else {
            if (!reg.test(item)) {
              return callback(new Error(this.handleGlobalI18n('validation', 'correct_email')))
            }
          }
        }
        callback()
      },
      goBack() {
        if (this.query.type === 'edit') {
          this.$confirm(this.$t('configuration.fc_configuration_test_edit_cancel_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
            cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
            confirmButtonClass: 'new_confirm_confirm',
            cancelButtonClass: 'new_confirm_cancel'
          }).then(() => {
            this.$router.push(`/configuration/test-group-management`)
          }).catch(_ => {
            // do something
          })
        } else {
          this.$router.push(`/configuration/test-group-management`)
        }
      },
      // get communication channel list
      communicationChannelList() {
        this.channel_select_loading = true
        this.handleGetCommunicationChannelList().then(res => {
          this.channel_select_loading = false
          this.channel_list = []
          let obj = {}
          for (const item of res) {
            const name = (item.name || '').toLowerCase()
            obj = { value: item.id, name: name, code: item.code, reserved_field_list: [] }
            if (name === 'sms') {
              this.channel_list.push({ ...obj, label: 'fc_campaign_spot_create_how_channel_menu1_label' })
              this.form.communication_channel_type = !this.form.communication_channel_type ? obj.value : this.form.communication_channel_type
            } else if (name === 'edm') {
              this.channel_list.push({ ...obj, label: 'fc_campaign_spot_create_how_channel_menu2_label' })
            }
          }
        }).catch(() => {
          this.channel_select_loading = false
        })
      },
      handleClickEdit() {
        this.$set(this.query, 'type', 'edit')
        this.rules = {
          group_name: [{ required: true, message: 'The Group name cannot be null', trigger: ['change', 'blur'] }],
          communication_channel_type: [{ required: true, message: 'The communication channel type cannot be null', trigger: ['change', 'blur'] }],
          contact_list: [{ required: true, message: this.handleGlobalI18n('validation', 'contact_list_null'), trigger: ['change', 'blur'] }, { validator: this.checkContactList, trigger: ['blur'] }]
        }
        this.$router.push({
          path: `/configuration/test-group-management/edit`,
          query: {
            type: 'edit',
            id: this.query.id
          }
        })
      },
      handleGetDetailInfo() {
        this.loading = true
        groupDetail({ 'test_group_id': this.query.id }).then(res => {
          this.form = res.return_result
          this.edit_state = false
          this.loading = false
          // if (this.form.group_description) {
          //   this.handleHtml2str(this.form.group_description).then(res => {
          //     this.form.group_description = res.replace(/<br\/>/g, '\r\n')
          //     this.loading = false
          //   }).catch(res => {
          //     this.loading = false
          //   })
          // } else {
          //   this.loading = false
          // }
        }).catch(() => {
          this.loading = false
        })
      },
      // 保存
      submitForm() {
        this.$refs['test-group'].validate(valid => {
          if (valid) {
            this.save_loading = true
            this.handleSubmitForm()
          } else {
            return false
          }
        })
      },
      // 保存新增
      async handleSubmitForm() {
        // var group_description = ''
        // if (this.form.group_description) {
        //   var rs = this.form.group_description.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')
        //   await this.handleStr2html(rs).then(res => {
        //     group_description = res
        //   }).catch(() => {
        //     this.save_loading = false
        //     this.$message.error('Fail')
        //   })
        // }
        // var contact_list = ''
        // if (this.form.contact_list) {
        //   // 这里应该添加过滤
        //   await this.handleStr2html(this.form.contact_list).then(res => {
        //     contact_list = res
        //   }).catch(() => {
        //     this.save_loading = false
        //     this.$message.error('Fail')
        //   })
        // }
        // 是新增 还是编辑
        if (this.query.type === 'add') {
          this.handleSubmitFormAdd(this.form.group_description)
        } else if (this.query.type === 'edit') {
          this.handleSubmitFormEdit(this.form.group_description)
        } else {
          this.save_loading = false
          return false
        }
      },
      // 保存
      handleSubmitFormAdd(group_description) {
        groupAdd(Object.assign({}, this.form, { group_description: group_description })).then(() => {
          this.save_loading = false
          this.$message.success(this.handleGlobalI18n('system', 'success'))
          this.$router.push({
            path: `/configuration/test-group-management`
          })
        }).catch(res => {
          this.save_loading = false
          this.$message.error(res)
        })
      },
      // 保存
      handleSubmitFormEdit(group_description) {
        groupEdit(Object.assign({ id: this.query.id }, this.form, { group_description: group_description })).then(() => {
          this.save_loading = false
          this.$message.success(this.handleGlobalI18n('system', 'success'))
          this.$router.push({
            path: `/configuration/test-group-management`
          })
        }).catch(res => {
          this.save_loading = false
          this.$message.error(res)
        })
      },
      handleHeaderTitle() {
        const type = this.query.type
        if (type === 'detail') {
          return this.$t('configuration.fc_configuration_test_details_title')
        } else if (type === 'add') {
          return this.$t('configuration.fc_configuration_test_add_title')
        } else if (type === 'edit') {
          return this.$t('configuration.fc_configuration_test_edit_title')
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .contact_list_div{
    position: relative;
    .tishi-i{
      position: absolute;
      left: 115px;
      top: 17px;
    }
  }
  .white-space{
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
  .line-height-1{
    line-height: 1.5;
  }
  .test-group-management {
    .el-button{
      min-width: 88px;
    }
    .el-input, .el-select{
      width: 300px;
    }
    .el-form-item{
      margin: 0 0 70px 20px;
      height: 66px;
      line-height: 66px;
      margin-bottom: 0!important;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(230,230,230,1);
      }
      display: flex;
      align-items: center;
    }
    .contact_list, .description{
      align-items: flex-start;
      padding: 15px 0!important;
      min-height: 66px;
      height: auto!important;
    }
    .width-1000{
      width: 700px!important;
    }
    margin: 30px;
    .click-button {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      text-align: right;
      margin-bottom: -20px;
      .save{
        margin-left: 8px;
        background-color: $new-primary;
        border-color: $new-primary;
      }
      .cancel{
        background-color: #ffffff;
      }
      .cancel, .delete{
        border-color: $new-primary;
        color: $new-primary;
      }
    }
    .contain {
      z-index: 1;
      position: relative;
      .info{
        background:rgba(255,255,255,1);
        box-shadow:0 5px 15px -3px rgba(204,204,204,1);
        width: 100%;
      }
    }

    .p{
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      margin-top: -20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
  .height-60{
    min-height:66px!important;
  }
  /deep/ .height-60 .el-form-item__label, .line-height-33 .line-height-1{
    line-height: 33px!important;
  }
</style>

<style lang="scss" rel="stylesheet/scss">
  .test-group-management{
    .el-form-item .el-form-item__label {
      font-size: 14px!important;
      font-weight: 700!important;
      color: rgba(51,51,51,1);
      line-height: 17px;
      &:before{
        color: rgba(51,51,51,1)!important;
      }
    }
    .el-form-item__content{
      margin-left: 0!important;
      width: 100%;
    }
  }
</style>
