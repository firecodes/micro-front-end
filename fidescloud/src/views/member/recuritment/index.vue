<template>
  <div class="recruitment">
    <div class="contain">
      <div class="header">
        <p>{{$t('member.fc_member_recruitment_basic_section_label')}}</p>
      </div>
      <div class="info">
        <el-form :model="form"  :rules="rules" autoComplete="on"  label-width="180px" ref="form">
          <!--Member code-->
          <el-row>
            <el-form-item :label="$t('member.fc_member_recruitment_basic_code_label')" prop="member_code" ref="member_code">
              <el-input v-model="form.member_code" @change="form.member_code=MixTrim(form.member_code)" maxlength="32" :disabled="is_generation_flag"></el-input>
              <el-checkbox style="margin-left: 10px;" v-model="is_generation_flag">{{$t('member.fc_member_recruitment_basic_code_auto_label')}}</el-checkbox>
            </el-form-item>
          </el-row>
          <!--First name-->
          <el-row>
            <el-col :lg="12" :sm="24" :xl="10" :xs="24">
              <el-form-item :label="$t('member.fc_member_recruitment_basic_first_label')" prop="first_name">
                <el-input v-model="form.first_name" @change="form.first_name=MixTrim(form.first_name)" maxlength="15"></el-input>
              </el-form-item>
            </el-col>
            <!--Last name-->
            <el-col :lg="10" :sm="24" :xl="8" :xs="24">
              <el-form-item :label="$t('member.fc_member_recruitment_basic_last_label')" prop="last_name">
                <el-input v-model="form.last_name" @change="form.last_name=MixTrim(form.last_name)" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!--Gender-->
            <el-col :lg="12" :sm="24" :xl="10" :xs="24">
              <el-form-item :label="$t('member.fc_member_recruitment_basic_gender_label')">
                <el-select v-model="form.gender" :placeholder="$t('member.fc_member_recruitment_basic_gender_input_label')">
                  <el-option :label="$t('member.fc_member_recruitment_basic_gender_menu1_label')" :value="parseInt(1)"></el-option>
                  <el-option :label="$t('member.fc_member_recruitment_basic_gender_menu2_label')" :value="parseInt(2)"></el-option>
                  <el-option :label="$t('member.fc_member_recruitment_basic_gender_menu3_label')" :value="parseInt(0)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!--Mobile-->
            <el-col :lg="10" :sm="24" :xl="8" :xs="24">
              <el-form-item :label="$t('member.fc_member_recruitment_basic_mobile_label')" required>
                <div style="display: flex">
                  <el-form-item label-width="0" prop="mobile_region_code">
                    <el-select :loading="member_region_code_status" clearable style="width: 150px;" v-model="form.mobile_region_code" >
                      <el-option :key="item.code" :label="item.displayValue" :value="item.displayValue" v-for="item in member_region_code_list"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label-width="0"  prop="mobile">
                    <el-input @change="form.mobile=MixTrim(form.mobile)" class="margin-left-10" maxlength="32"  onafterpaste="this.value=this.value.replace(/\D/g,'')"  onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 200px;" v-model="form.mobile"></el-input>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!--Birthday-->
            <el-col :lg="12" :sm="24" :xl="10" :xs="24">
              <el-form-item :label="$t('member.fc_member_recruitment_basic_birthday_label')" prop="birthday">
                <date-pick :date="form.birthday" @setBirthday="setBirthday"></date-pick>
              </el-form-item>
            </el-col>
            <!--Email-->
            <el-col :lg="10" :sm="24" :xl="8" :xs="24">
              <el-form-item :label="$t('member.fc_member_recruitment_basic_email_label')" prop="email">
                <el-input v-model="form.email" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--Privacy-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_privacy_label')" required prop="options">
            <ul class="ul">
              <li>
                <span>{{$t('member.fc_member_recruitment_basic_privacy_option1_label')}}</span>
                <el-switch class="switch" v-model="form.options[0].option_value" :disabled="form.options[0].disabled"></el-switch>
              </li>
              <li>
                <span>{{$t('member.fc_member_recruitment_basic_privacy_option2_label')}}</span>
                <el-switch class="switch" v-model="form.options[1].option_value" :disabled="form.options[1].disabled"></el-switch>
              </li>
              <li>
                <span>{{$t('member.fc_member_recruitment_basic_privacy_option3_label')}}</span>
                <el-switch class="switch" v-model="form.options[2].option_value" :disabled="form.options[2].disabled"></el-switch>
              </li>
            </ul>
          </el-form-item>
          <!--Terms & Conditions-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_tc_label')" prop="check">
            <el-checkbox v-model="form.check"></el-checkbox>
            <label>
              {{$t('member.fc_member_recruitment_basic_tc_input_label').split('{')[0]}}
              <a @click="handleTermsConditions" class="border-bottom-1px">{{$t('member.fc_member_recruitment_basic_tc_input_label').split('{')[1].split('}')[0]}}</a>
            </label>
<!--            <label>{{$t('member.fc_member_recruitment_basic_tc_input_label').split('{')[0]}}<a @click="handleTermsConditions" class="border-bottom-1px">{{$t('member.fc_member_recruitment_basic_tc_input_label').split('{')[1].split('}')[0]}}</a>{{$t('member.fc_member_recruitment_basic_tc_input_label').split('{')[1].split('}')[1] }} <a class="border-bottom-1px">{{$t('member.fc_member_recruitment_basic_tc_input_label').split('{')[2].split("}")[0]}}</a>{{$t('member.fc_member_recruitment_basic_tc_input_label').split("}")[2]}}</label>-->
          </el-form-item>
        </el-form>
        <div class="click-button">
          <el-button @click='cancel' class="cancel">{{$t('member.fc_member_details_loyalty_tier_adjust_btn_cancel_label')}}</el-button>
          <el-button type="primary" @click="submitForm('form')"  :loading="saveLoading">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      :title="$t('member.fc_member_recruitment_popup_title')"
      :visible.sync="centerDialogVisible"
      width="30%"
      left>
      <span>{{$t('member.fc_member_recruitment_popup_content_label')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFalse">{{$t('member.fc_member_recruitment_popup_btn_no_label')}}</el-button>
        <el-button type="primary" @click="dialogTrue">{{$t('member.fc_member_recruitment_popup_btn_yes_label')}}</el-button>
      </span>
    </el-dialog>
    <!--Terms & Conditions-->
    <el-dialog
      :title="$t('member.fc_member_recruitment_tc_popup_title_label')"
      :visible.sync="tc_visible"
      width="50%"
      class="tc"
      :center="true"
      :before-close="handleClose">
      <div style="height: 500px;">
        <el-scrollbar style="height:100%;">
          <div class="main-body content" style="word-break:keep-all;hyphens: auto;
padding: 6px;font-size:16px; line-height: 1.3;border: 1px solid #C0C4CC;min-height: 500px;width: 100%;" v-html="termsconditions">
          </div>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <!--Close-->
        <el-button @click="tc_visible = false">{{$t('member.fc_operation_btn_close_label')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { createMember, checkMemberCode, checkMemberFieldUsing } from '@/api/member'
  import { handleMemberRegionCodeMixin } from '@/views/data/member-region-code'
  import { getCondition } from '@/api/configuration'
  import { handleOssFileHtmlStr } from '@/views/data/oss-file-html-str'
  import {
    parseIntVal,
    handleTrim
  } from '@/utils/util'
  import {
    validateEmail
  } from '@/utils/validate'
  import { DateTime } from 'luxon'
  import DatePick from '@/components/DatePick'
  export default {
    mixins: [parseIntVal, handleTrim, handleMemberRegionCodeMixin, handleOssFileHtmlStr],
    components: {
      DatePick
    },
    data() {
      return {
        tc_textarea: '1.Early Termination: if you do break up with us within your Initial Commitment Period, an early termination fee of $300 + GST is payable. If the amount outstanding under your Agreement with us is less than this early termination fee, then the lesser amount is payable. <br />2.I authorise Apeiro Group Pte Ltd to collect the early termination fee in the case of early termination.<br />3.By ticking this box you agree that after the Initial Commitment Period your agreement with us will automatically renew for further monthly commitment periods unless terminated by you.<br />4.I authorise Apeiro Group to deduct my monthly dues from my Nominated account',
        tc_visible: false,
        rules: {
          member_code: [
            { required: true, message: this.handleGlobalI18n('validation', 'member_code'), trigger: 'blur' },
            { validator: this.checkMemberCode, trigger: 'blur' }
          ],
          mobile: [{ required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: ['blur', 'change'] },
            { validator: this.checkMobile, trigger: ['blur', 'change'] }
          ],
          birthday: [{ required: true, message: 'Message is missing', trigger: ['blur', 'change'] }],
          mobile_region_code: [{ required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: ['blur', 'change'] }],
          email: [
            { required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: 'blur' },
            { validator: this.checkEmail, trigger: 'blur' }
          ],
          check: [{ required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: ['blur', 'change'] }, { validator: this.checkTC, trigger: ['blur', 'change'] }],
          options: [
            { validator: this.checkOptions, trigger: 'blur' }
          ]
        },
        centerDialogVisible: false,
        saveLoading: false,
        is_generation_flag: false,
        form: {
          birthday: '1990-01-01',
          mobile_region_code: '',
          check: null,
          member_code: '',
          first_name: '',
          last_name: '',
          mobile: '',
          gender: null,
          birthday_year: '',
          birthday_month: '',
          birthday_day: '',
          email: '',
          options: [
            {
              option_code: 'sms',
              option_value: null,
              disabled: false
            }, {
              option_code: 'email',
              option_value: null,
              disabled: false
            }, {
              option_code: 'mobile',
              option_value: null,
              disabled: false
            }
          ],
          channel_code: 'back_office'
        },
        return_member_code: '',
        termsconditions: ''
      }
    },
    methods: {
      handleClose() {
        this.tc_visible = false
      },
      getTerms() {
        return getCondition().then(async res => {
          if (res.return_result) {
            if (!res.return_result.url) {
              this.termsconditions = ''
              return
            }
            this.termsconditions = await this.handleHtml2str(res.return_result.url)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleTermsConditions() {
        var tenant_info = window.localStorage.tenantInfo && JSON.parse(window.localStorage.tenantInfo)
        var code = tenant_info ? tenant_info.code : ''
        code = 'ApeiroPerformance19'
        if (code === 'UATApeiroPerformance19' || code === 'ApeiroPerformance19') {
          this.tc_visible = true
        }
      },
      checkOptions(rule, value, callback) {
        var state = false
        for (var item of this.form.options) {
          if (item.option_value) {
            state = true
          }
        }
        if (state) {
          callback()
        } else {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        }
      },
      checkEmail(rule, value, callback) {
        if (!this.form.email) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        } else {
          if (validateEmail(this.form.email)) {
            checkMemberFieldUsing({ email: this.form.email }).then(res => {
              const obj = res.return_result
              obj.success ? callback(new Error("Email can't be duplicated")) : callback()
            }).catch(res => {
              callback(new Error('Error'))
            })
          } else {
            callback(new Error(this.handleGlobalI18n('validation', 'email_error')))
          }
        }
      },
      checkTC(rule, value, callback) {
        if (value) {
          callback()
        } else {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        }
      },
      checkMobile(rule, value, callback) {
        if (this.form.mobile.length > 0) {
          this.globalData.validateMobile(this.form.mobile) ? callback() : callback(new Error(this.handleGlobalI18n('validation', 'mobile_error')))
        } else {
          callback()
        }
      },
      checkMemberCode(rule, value, callback) {
        if (this.form.member_code === '') {
          return true
        }
        checkMemberCode(this.form.member_code).then(res => {
          const obj = res.return_result
          obj.exist ? callback(new Error(this.handleGlobalI18n('validation', 'member_code_duplicated'))) : callback()
        }).catch(res => {
          callback(new Error(res))
        })
      },
      setBirthday(val) {
        if (!val.month || !val.day) {
          this.form.birthday = ''
        } else {
          this.form.birthday = `${val.year}-${val.month}-${val.day}`
        }
      },
      dialogTrue() {
        this.centerDialogVisible = false
        this.$router.push({
          path: `/member/improve-info/${this.return_member_code}`
        })
      },
      dialogFalse() {
        this.centerDialogVisible = false
        this.$router.push({
          path: '/member/member-view'
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            const newobj = JSON.parse(JSON.stringify(this.form))
            if (this.form.birthday.length > 0) {
              const arrBirthday = this.form.birthday.split('-')
              arrBirthday.map((val, key) => {
                arrBirthday[key] = parseInt(val)
              });
              [newobj.birthday_year, newobj.birthday_month, newobj.birthday_day] = arrBirthday
            }
            newobj.options.map((obj) => {
              if (this.form.options[2].option_value) {
                obj.option_value = 2
              } else {
                obj.option_value = obj.option_value ? 1 : 2
              }
            })
            const newData = { ...newobj, is_generation_flag: this.is_generation_flag ? 1 : 0, register_date: DateTime.local().toISO() }
            createMember(newData).then(res => {
              this.$message({
                message: res.return_message,
                type: 'success'
              })
              this.centerDialogVisible = true
              this.return_member_code = res.return_result.member_code
              this.saveLoading = false
            }).catch(res => {
              this.saveLoading = false
              this.$message(res)
            })
          } else {
            this.saveLoading = false
            // console.log('error submit!!')
            return false
          }
        })
      },
      cancel() {
        this.$nextTick(() => {
          [this.form.sms_option, this.form.mobile_option, this.form.email_option, this.form.gender] = [false, false, false, '']
          this.$refs.form.resetFields()
          this.saveLoading = false
        })
      },
      examineMemberCode() {}
    },
    watch: {
      is_generation_flag(...args) {
        if (args[0] === 0) {
          return true
        }
        if (args[0]) {
          this.form.omember_code = this.form.member_code
          this.form.member_code = ''
          this.rules.member_code = []
          this.$refs.member_code.clearValidate()
          // this.rules = Object.assign({}, this.rules)
        } else {
          this.form.member_code = this.form.omember_code
          this.rules.member_code = []
          this.rules = Object.assign(this.rules, { member_code: [
            { required: true, message: this.handleGlobalI18n('validation', 'member_code'), trigger: 'change' },
            { validator: this.checkMemberCode, trigger: 'blur' }] })
        }
      },
      watchOptions: {
        handler(newVal, oldVal) {
          if (newVal[0] || newVal[1] || (newVal[0] && newVal[1])) {
            this.form.options[2].option_value = null
            this.form.options[2].disabled = true
          } else {
            this.form.options[2].disabled = false
          }
          if (newVal[2]) {
            this.form.options[0].option_value = null
            this.form.options[0].disabled = true
            this.form.options[1].option_value = null
            this.form.options[1].disabled = true
          } else {
            this.form.options[0].disabled = false
            this.form.options[1].disabled = false
          }
        }
      }
    },
    computed: {
      watchOptions() {
        const newArr = []
        for (var i = 0; i < this.form.options.length; i++) {
          newArr.push(this.form.options[i].option_value)
        }
        return newArr
      }
    },
    created() {
      this.getTerms()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recruitment {
    /deep/ strong {
      font-weight: bold !important;
    }
    .tc{
      /deep/ .el-dialog__header{
        border: none
      }
      /deep/ .el-dialog--center .el-dialog__body{
        padding: 0 49px 7px;
      }
    }
    .el-checkbox{
      margin-right: 0!important;
    }
    .border-bottom-1px{
      @include border-bottom-solid(1px, #000000)
    }
    .el-input, .el-select, .el-date-picker {
      width: 350px;
    }
    margin: 25px;
    .click-button {
      padding: 5px;
      .cancel {
        margin-left: 120px;
      }
    }
    .contain {
      margin-top: 30px;
      background-color: #ffffff;
      position: relative;
      padding-bottom: 30px;
      .header {
        height: 40px;
        line-height: 40px;
        position: relative;
        &:before {
          content: '';
          position: absolute;
          height: 26px;
          width: 3px;
          top: 0;
          bottom:0;
          margin:auto 0;
          left: -1;
          background: $new-primary;
        }
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: rgba(51, 51, 51, 0.07);
        }
        p {
          margin-left: 20px;
          font-size: 18px;
          color: #333;
        }
      }
      .info {
        margin-top: 30px;
      }
      .ul {
        padding: 0;
        margin-right:20px;
        li {
          max-width: 600px;
          height: 45px;
          line-height: 45px;
          box-shadow: none;
          background: #F2F2F2;
          &:not(:first-child) {
            margin-top: 20px;
          }
          span {
            margin-left: 20px;
          }
          position: relative;
          .switch {
            position: absolute;
            right: 20px;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }
    /deep/ .tc {
      word-break: break-word;
      white-space: normal;
      p {
        word-break: break-word;
        white-space: normal;
      }
    }
  }
</style>
