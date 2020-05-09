<!--edit or detail role-->
<template>
  <div class="edit-detail-role" >
    <el-form :model="form" ref="form" label-width="170px" :inline="true" :rules="rules">
      <el-dialog
        class="add-role-dialog"
        :title="type_state === '1' ? handleGlobalI18n('user_role', 'role_detail_title') : handleGlobalI18n('user_role', 'role_edit_title')"
        :visible.sync="edit_detail_role_dialog_visible"
        width="900px">
        <div class="content" v-loading = "loading">
          <div class="user-type">
            <p>{{handleGlobalI18n('user_role', 'dialog_add_user_basic_information')}}<span>*</span></p>
            <el-form-item :label="handleGlobalI18n('user_role', 'role_edit_detail_role_name')" prop="name">
              <el-input type="text" v-model="form.name" v-if="type_state === '2'"/>
              <span v-else>{{form.name}}</span>
            </el-form-item>
            <br />
            <el-form-item :label="handleGlobalI18n('user_role', 'role_edit_detail_app')" prop="app_id">
              <el-radio-group v-model="form.app_id" v-if="type_state === '2'">
                <el-radio v-for="(item, index) in app_list" :key="index" :label="item.app_id">{{item.app_name}}</el-radio>
              </el-radio-group>
              <template v-else>
                <span v-for="item in app_list" v-if="item.app_id === form.app_id">{{item.app_name}}</span>
              </template>
            </el-form-item>
          </div>
          <div class="resource">
            <p>{{handleGlobalI18n('user_role', 'role_edit_detail_resource')}}</p>
            <el-form-item label=" " label-width="0px" prop="resource">
              <el-input  type="textarea" :rows="5" :placeholder="handleGlobalI18n('user_role', 'role_edit_detail_resource_placeholder')" style="width: 100%" v-model="form.resource" v-if="type_state === '2'" />
              <span v-else style="font-size: 12px; line-height: 1">{{form.resource}}</span>
            </el-form-item>
          </div>
        </div>
        <div class="line"></div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toEdit" v-if="type_state === '1'">{{handleGlobalI18n('user_role', 'role_edit_detail_edit')}}</el-button>
        <el-button type="primary" @click="handleEdit" :loading="save_loading" v-else>{{handleGlobalI18n('user_role', 'role_edit_detail_save')}}</el-button>
        <el-button @click="edit_detail_role_dialog_visible = false">{{handleGlobalI18n('user_role', 'role_edit_detail_cancel')}}</el-button>
      </span>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
  import { detail, edit } from '@/api/role'
  import { pageQueryApp } from '@/api/app'
  import { checkJsonFormat } from '@/utils'
  export default {
    props: {
      type: {
        type: String,
        default: '1' // 1表示详情 2表示编辑
      },
      show_state: {
        type: Boolean,
        default: false
      },
      role_id: {
        type: Number
      }
    },
    data() {
      return {
        app_list: [],
        type_state: '1',
        loading: false,
        save_loading: false,
        edit_detail_role_dialog_visible: false,
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
          this.edit_detail_role_dialog_visible = this.show_state
          this.type_state = this.type
          if (this.role_id !== '' || this.role_id !== null) {
            // 去获取详情
            this.getDetail()
          }
          if (this.app_list.length <= 0) {
            this.getAppList()
          }
          this.$refs['form'].clearValidate()
        }
      },
      type: {
        handler() {
          this.type_state = this.type
        }
      },
      edit_detail_role_dialog_visible: {
        handler() {
          this.$emit('setEditDetailState', this.edit_detail_role_dialog_visible)
          this.$refs['form'].clearValidate()
        }
      },
      role_id: {
        handler() {
          if (this.role_id !== '' || this.role_id !== null) {
            // 去获取详情
            this.getDetail()
          }
        }
      }
    },
    methods: {
      checkJsonFormat,
      getAppList() {
        pageQueryApp({ page_no: 1, page_size: 10000 }).then(res => {
          this.app_list = res.return_result.results
        })
      },
      handleEdit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.save_loading = true
            edit(Object.assign({}, this.form, { role: this.role_id })).then(res => {
              if (res.return_result.flag) {
                this.$message({
                  message: this.handleGlobalI18n('system', 'success'),
                  type: 'success'
                })
                this.edit_detail_role_dialog_visible = false
                this.save_loading = false
                this.form = {
                  name: '',
                  resource: '',
                  app_id: ''
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
      },
      toEdit() {
        this.type_state = '2'
      },
      getDetail() {
        this.loading = true
        detail({ role_id: this.role_id }).then(res => {
          this.form = res.return_result
          this.loading = false
        }).catch(_ => {
          this.loading = false
        })
      },
      checkIsNotNull(rule, value, callback) {
        if (value === '' || value === undefined || value === null) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        } else {
          callback()
        }
      },
      handleCheckResource(rule, value, callback) {
        if (value === '' || value === undefined || value === null) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        } else if (!this.checkJsonFormat(value)) {
          callback(new Error(this.handleGlobalI18n('user_role', 'json_format_error')))
        } else {
          callback()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .edit-detail-role {
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
