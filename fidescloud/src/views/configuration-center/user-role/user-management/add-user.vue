<!--add user-->
<template>
  <div class="add-user">
    <el-form :model="form" ref="form" label-width="170px" :inline="true" :rules="rules">
      <el-dialog
      class="add-user-dialog"
      :title="handleGlobalI18n('user_role', 'dialog_add_user_title')"
      :visible.sync="add_user_dialog_visible"
      width="900px">
      <div class="content">
        <div class="user-type">
          <p>{{handleGlobalI18n('user_role', 'dialog_add_user_basic_information')}}<span>*</span></p>
          <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_user_name')" prop="name">
            <el-input type="text" v-model="form.name"/>
          </el-form-item>
          <br />
          <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_password')" prop="password">
            <el-input type="password" v-model="form.password" />
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_confirm_password')" prop="confirm_password">
            <el-input type="password" v-model="form.confirm_password" />
          </el-form-item>
        </div>
        <div class="additional-information">
          <p>{{handleGlobalI18n('user_role', 'dialog_add_user_additional_information')}}</p>
          <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_email')">
            <el-input type="text" v-model="form.email" />
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('user_role', 'dialog_add_user_mobile')">
            <el-input type="text" v-model.number="form.mobile" />
          </el-form-item>
        </div>
      </div>
      <div class="line"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" :loading="save_loading">{{handleGlobalI18n('user_role', 'dialog_add_user_save')}}</el-button>
        <el-button @click="add_user_dialog_visible = false">{{handleGlobalI18n('user_role', 'dialog_add_user_cancel')}}</el-button>
      </span>
    </el-dialog>
    </el-form>
  </div>
</template>
<script>
  import { insert } from '@/api/user'
  // import md5 from 'js-md5'
  var sha1 = require('sha1')
  export default {
    props: {
      show_state: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        save_loading: false,
        add_user_dialog_visible: false,
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
          this.add_user_dialog_visible = this.show_state
        }
      },
      add_user_dialog_visible: {
        handler() {
          this.$emit('setAddState', this.add_user_dialog_visible)
        }
      }
    },
    created() {
      this.form = {
        name: '',
        password: '',
        email: ' ',
        mobile: '',
        confirm_password: ''
      }
    },
    methods: {
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
      },
      save() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            var obj = {
              name: this.form.name,
              password: sha1(this.form.password),
              email: this.form.email,
              mobile: this.form.mobile
            }
            this.save_loading = true
            insert(obj).then(res => {
              if (res.return_result.flag) {
                this.$message({
                  message: this.handleGlobalI18n('system', 'success'),
                  type: 'success'
                })
                this.add_user_dialog_visible = false
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
