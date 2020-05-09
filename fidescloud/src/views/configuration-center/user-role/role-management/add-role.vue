<!--add role-->
<template>
  <div class="add-role">
    <el-form :model="form" ref="form" label-width="170px" :inline="true" :rules="rules">
      <el-dialog
        class="add-role-dialog"
        :title="handleGlobalI18n('user_role', 'role_add_role')"
        :visible.sync="add_role_dialog_visible"
        width="900px">
        <div class="content" v-loading="app_loading">
          <div class="user-type">
            <p>{{handleGlobalI18n('user_role', 'dialog_add_user_basic_information')}}<span>*</span></p>
            <el-form-item :label="handleGlobalI18n('user_role', 'role_edit_detail_role_name')" prop="name">
              <el-input type="text" v-model="form.name"/>
            </el-form-item>
            <br />
            <el-form-item :label="handleGlobalI18n('user_role', 'role_edit_detail_app')" prop="app_id">
              <el-radio-group v-model="form.app_id">
                <el-radio v-for="(item, index) in app_list" :key="index" :label="item.app_id">{{item.app_name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="resource">
            <p>{{handleGlobalI18n('user_role', 'role_edit_detail_resource')}}</p>
            <el-form-item label=" " label-width="0px" prop="resource">
              <el-input  type="textarea" :rows="5" :placeholder="handleGlobalI18n('user_role', 'role_edit_detail_resource_placeholder')" style="width: 100%" v-model="form.resource" />
            </el-form-item>
          </div>
        </div>
        <div class="line"></div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" :loading="save_loading">{{handleGlobalI18n('user_role', 'role_edit_detail_save')}}</el-button>
        <el-button @click="add_role_dialog_visible = false">{{handleGlobalI18n('user_role', 'role_edit_detail_cancel')}}</el-button>
      </span>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
  import { insert } from '@/api/role'
  import { pageQueryApp } from '@/api/app'
  import { checkJsonFormat } from '@/utils'
  export default {
    props: {
      show_state: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        app_loading: false,
        app_list: [],
        save_loading: false,
        add_role_dialog_visible: false,
        form: {
          name: '',
          resource: '',
          app_id: ''
        },
        rules: {
          name: [{ validator: this.checkIsNotNull, trigger: ['blur', 'change'] }],
          app_id: [{ validator: this.checkIsNotNull, trigger: ['blur', 'change'] }],
          resource: [{ validator: this.handleCheckResource, trigger: ['blur', 'change'] }]
        }
      }
    },
    watch: {
      show_state: {
        handler() {
          this.add_role_dialog_visible = this.show_state
          this.$refs['form'].clearValidate()
          // 去获取app list
          if (this.app_list.length <= 0) {
            this.getAppList()
          }
        }
      },
      add_role_dialog_visible: {
        handler() {
          this.$emit('setAddState', this.add_role_dialog_visible)
        }
      }
    },
    created() {
      this.form = {
        name: '',
        resource: '',
        app_id: null
      }
    },
    methods: {
      checkJsonFormat,
      handleCheckResource(rule, value, callback) {
        if (value === '' || value === undefined || value === null) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        } else if (!this.checkJsonFormat(value)) {
          callback(new Error(this.handleGlobalI18n('user_role', 'json_format_error')))
        } else {
          callback()
        }
      },
      getAppList() {
        this.app_loading = true
        pageQueryApp({ page_no: 1, page_size: 10000 }).then(res => {
          this.app_list = res.return_result.results
          this.app_loading = false
        }).catch(res => {
          this.app_loading = false
        })
      },
      checkIsNotNull(rule, value, callback) {
        if (value === '' || value === undefined || value === null) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        } else {
          callback()
        }
      },
      save() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.save_loading = true
            insert(this.form).then(res => {
              if (res.return_result.flag) {
                this.$message({
                  message: this.handleGlobalI18n('system', 'success'),
                  type: 'success'
                })
                this.add_role_dialog_visible = false
                this.save_loading = false
                this.form = {
                  name: '',
                  resource: '',
                  app_id: null
                }
                this.$emit('regain')
              } else {
                this.$message.error(this.handleGlobalI18n('system', 'fail'))
              }
            }).catch(res => {
              this.$message.error(res)
              this.save_loading = false
            })
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .add-role {
    .resource{
      .el-form-item, .el-form-item--small{
        width: 100%
      }
      .el-form-item__content{
        width: 97%!important;
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../dialog-common";
  .el-button{
    min-width: 80px;
  }
  .add-role-dialog {
    .content {
      margin-top: -10px;
      width: 100%;
      margin-bottom: 20px;
      p {
        @include p-style;
        span{
          color: red;
        }
      }
    }
    .resource{
      margin-top: 14px;
    }
    .line{
      margin: 0 -20px;
      border-bottom: 1px solid #E8EBED;
      position: relative;
      top: 20px;
    }
  }
</style>
