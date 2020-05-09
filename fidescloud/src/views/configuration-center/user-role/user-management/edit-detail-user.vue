<!--edit or detail user-->
<template>
  <div class="edit-detail-user" >
    <el-form :model="form" ref="form" label-width="170px" :inline="true" :rules="rules">
      <el-dialog
        class="add-user-dialog"
        :title="type_state === '1' ? handleGlobalI18n('user_role', 'user_detail_title') : handleGlobalI18n('user_role', 'user_edit_title')"
        :visible.sync="edit_detail_user_dialog_visible"
        width="900px">
        <div class="content" v-loading = "loading">
          <div class="user-type">
            <p>{{handleGlobalI18n('user_role', 'dialog_add_user_basic_information')}}<span>*</span></p>
            <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_user_name')" prop="name">
              <el-input type="text" v-model="form.name" v-if="type_state === '2'"/>
              <span v-else>{{form.name}}</span>
            </el-form-item>
            <br />
            <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_password')" prop="password">
              <el-input type="password" v-model="form.password" v-if="type_state === '2'" />
              <span v-else>********</span>
            </el-form-item>
            <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_confirm_password')" prop="confirm_password" v-if="type_state === '2'">
              <el-input type="password" v-model="form.confirm_password" />
            </el-form-item>
          </div>
          <div class="additional-information">
            <p>{{handleGlobalI18n('user_role', 'dialog_add_user_additional_information')}}</p>
            <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_email')">
              <el-input type="text" v-model="form.email" v-if="type_state === '2'" />
              <span v-else>{{form.email}}</span>
            </el-form-item>
            <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_mobile')">
              <el-input type="text" v-model.number="form.mobile" v-if="type_state === '2'" />
              <span v-else>{{form.mobile}}</span>
            </el-form-item>
          </div>
        </div>
        <div class="line"></div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toEdit" v-if="type_state === '1'">{{handleGlobalI18n('user_role', 'user_edit_edit')}}</el-button>
        <el-button type="primary" @click="handleEdit" :loading="save_loading" v-else>{{handleGlobalI18n('user_role', 'dialog_save')}}</el-button>
        <el-button @click="edit_detail_user_dialog_visible = false">{{handleGlobalI18n('user_role', 'dialog_cancel')}}</el-button>
      </span>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
  import { detail, edit } from '@/api/user'
  var sha1 = require('sha1')
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
      user_id: {
        type: Number
      }
    },
    data() {
      return {
        type_state: '1',
        loading: false,
        save_loading: false,
        edit_detail_user_dialog_visible: false,
        form: {
          name: '',
          password: '',
          email: '',
          mobile: '',
          confirm_password: ''
        },
        rules: {
          name: [{ validator: this.checkIsNotNull, trigger: ['blur', 'change'] }],
          password: [{ validator: this.checkIsNotNull, trigger: ['blur', 'change'] }],
          confirm_password: [{ validator: this.checkIsNotNull, trigger: ['blur', 'change'] }, { validator: this.checkConfirmPassword, trigger: ['blur', 'change'] }]
        }
      }
    },
    watch: {
      show_state: {
        handler() {
          this.edit_detail_user_dialog_visible = this.show_state
          this.type_state = this.type
          if (this.user_id !== '' || this.user_id !== null) {
            // 去获取详情
            this.getDetail()
          }
          this.$refs['form'].clearValidate()
        }
      },
      type: {
        handler() {
          this.type_state = this.type
        }
      },
      edit_detail_user_dialog_visible: {
        handler() {
          this.$emit('setEditDetailState', this.edit_detail_user_dialog_visible)
          this.$refs['form'].clearValidate()
        }
      },
      user_id: {
        handler() {
          if (this.user_id !== '' || this.user_id !== null) {
            // 去获取详情
            this.getDetail()
          }
        }
      }
    },
    created() {
    },
    methods: {
      handleEdit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            var obj = {
              user_id: this.user_id,
              name: this.form.name,
              password: sha1(this.form.password),
              email: this.form.email,
              mobile: this.form.mobile
            }
            this.save_loading = true
            edit(obj).then(res => {
              if (res.return_result.flag) {
                this.$message({
                  message: this.handleGlobalI18n('system', 'success'),
                  type: 'success'
                })
                this.edit_detail_user_dialog_visible = false
                this.save_loading = false
                this.form = {
                  name: '',
                  password: '',
                  email: '',
                  mobile: '',
                  confirm_password: ''
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
        detail({ user_id: this.user_id }).then(res => {
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
      checkConfirmPassword(rule, value, callback) {
        if (value !== this.form.password) {
          callback(new Error(this.handleGlobalI18n('user_role', 'add_user_password_inconsistency')))
        } else {
          callback()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../dialog-common";
  .el-button{
    min-width: 80px;
  }
  .add-user-dialog {
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
    .additional-information{
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
