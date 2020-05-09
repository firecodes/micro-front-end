<template>
  <div class="improve-info" v-loading="loading">
    <el-form ref="form" :model="form"  :rules="rules"  label-width="150px" >
      <el-collapse v-model="activeNames">
      <!--basic info 基本信息-->
      <el-collapse-item name="1" style="background-color: #ffffff">
        <template slot="title">
          <div class="header">
            <p>{{$t('member.fc_member_recruitment_basic_section_label')}}</p>
          </div>
        </template>
        <div class="contain">
          <!--Member code-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_code_label')" label-width="110px"  prop="member_code">
            <el-input v-model="form.member_code" :disabled="true" ></el-input>
          </el-form-item>
          <!--First name-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_first_label')" label-width="110px"  prop="first_name">
            <el-input v-model="form.first_name" :disabled="disabled" maxlength="32"></el-input>
          </el-form-item>
          <!--Last name-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_last_label')"  label-width="110px"  prop="last_name">
            <el-input v-model="form.last_name" :disabled="disabled" maxlength="32"></el-input>
          </el-form-item>
          <!--Gender-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_gender_label')" label-width="110px">
            <el-select v-model="form.gender" :placeholder="$t('member.fc_member_recruitment_basic_gender_input_label')" :disabled="disabled" clearable>
              <el-option :label="$t('member.fc_member_recruitment_basic_gender_menu1_label')"  :value="parseInt(1)"></el-option>
              <el-option :label="$t('member.fc_member_recruitment_basic_gender_menu2_label')" :value="parseInt(2)"></el-option>
              <el-option :label="$t('member.fc_member_recruitment_basic_gender_menu3_label')" :value="parseInt(0)"></el-option>
            </el-select>
          </el-form-item>
          <!--Mobile-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_mobile_label')"  label-width="110px">
            <div style="display: flex">
              <el-form-item prop="mobile_region_code">
                <el-select :loading="member_region_code_status" clearable style="width: 150px;" v-model="form.mobile_region_code">
                  <el-option :key="item.code" :label="item.displayValue" :value="item.displayValue" v-for="item in member_region_code_list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="mobile">
                <el-input :disabled="disabled" maxlength="32" style="width: 240px;" v-model="form.mobile"></el-input>
              </el-form-item>
            </div>
          </el-form-item>
          <!--Email-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_email_label')" label-width="110px" prop="email">
            <el-input :disabled="disabled || isUsedMemberPortalTenant()" maxlength="32" v-model="form.email"></el-input>
          </el-form-item>
          <!--Birthday-->
          <el-form-item :label="$t('member.fc_member_recruitment_basic_birthday_label')" label-width="110px" prop="birthday">
            <date-pick :date="form.birthday" @setBirthday="setBirthday"></date-pick>
          </el-form-item>
        </div>
      </el-collapse-item>
      <!--privacy 隐私-->
      <el-collapse-item name="2">
        <template slot="title">
          <div class="header">
            <p>{{$t('member.fc_member_recruitment_privacy_section_label')}} </p><!--(0%)-->
          </div>
        </template>
        <div class="contain">
            <el-form-item label="" label-width="0">
              <ul class="ul privacy">
                <li>
                  <span>{{$t('member.fc_member_recruitment_privacy_option1_label')}}</span>
                  <el-switch class="switch" v-model="form.options[0].option_value" :disabled="form.options[0].disabled"></el-switch>
                </li>
                <li>
                  <span>{{$t('member.fc_member_recruitment_privacy_option2_label')}}</span>
                  <el-switch class="switch" v-model="form.options[1].option_value" :disabled="form.options[1].disabled"></el-switch>
                </li>
                <li>
                  <span>{{$t('member.fc_member_recruitment_privacy_option3_label')}}</span>
                  <el-switch class="switch" v-model="form.options[2].option_value" :disabled="form.options[2].disabled"></el-switch>
                </li>
              </ul>
            </el-form-item>
        </div>
      </el-collapse-item>
      <!--address details 地址详细信息-->
      <el-collapse-item name="3">
        <template slot="title">
          <div class="header">
            <p>{{$t('member.fc_member_recruitment_address_section_label')}}</p>
          </div>
        </template>
        <div class="contain" v-cloak>
          <div style="display: flex;flex-wrap: wrap">
            <!--country-->
            <el-form-item
              :label="$t('member.fc_member_recruitment_address_location_label')"
              label-width="100px">
              <country @handleLocahostChange="handleLocalhostChange" :value="form.country_dictionary_name"></country>
            </el-form-item>
            <!--province-->
            <el-form-item  label-width="100px" :label="$t('member.fc_member_recruitment_address_province_label')">
              <province :parentCountry="form.country_dictionary_code" :value="form.province_dictionary_name" @handleLocahostChange="handleLocalhostChange"></province>
             </el-form-item>
            <!--city-->
            <el-form-item label-width="100px" :label="$t('member.fc_member_recruitment_address_city_label')">
              <city :parentProvince="form.province_dictionary_code" :value="form.city_dictionary_name" @handleLocahostChange="handleLocalhostChange"></city>
            </el-form-item>
            <!--district-->
            <el-form-item label-width="100px" style="display: none">
              <district :parentCity="form.city_dictionary_code" :value="form.district_dictionary_name" @handleLocahostChange="handleLocalhostChange"></district>
            </el-form-item>
          </div>
          <!--Address-->
          <el-form-item :label="$t('member.fc_member_recruitment_address_details_label')" label-width="100px" prop="address">
            <el-input v-model="form.address" style="width: 605px;" :disabled="disabled" maxlength="150"></el-input>
          </el-form-item>
          <!--Zip code-->
          <el-form-item :label="$t('member.fc_member_recruitment_address_zipcode_label')" label-width="100px" prop="zipcode">
              <el-input v-model="form.zip_code" :disabled="disabled" maxlength="10"></el-input>
            </el-form-item>
        </div>
      </el-collapse-item>
      <!--registration details 注册详细信息-->
      <el-collapse-item name="4">
        <template slot="title">
          <div class="header">
            <p>{{$t('member.fc_member_recruitment_registration_section_label')}}</p>
          </div>
        </template>
        <div class="contain">
            <el-row  class="list registration_details_list">
              <!--registration date-->
                <el-form-item :label="$t('member.fc_member_recruitment_registration_date_label')">
                  <el-date-picker style="width: 217px" type="date" :format="globalData.value.date_format" v-model="form.register_date" :disabled="true"
                  ></el-date-picker>
                </el-form-item>
              <!--registration brand-->
                <el-form-item :label="$t('member.fc_member_recruitment_registration_brand_label')">
                  <registration-brand style="width: 217px" :disabled="disabled" @registration_brand = "selectRegistration" :value="form.register_brand_code"></registration-brand>
                </el-form-item>
              <!--registration channel-->
                <el-form-item :label="$t('member.fc_member_recruitment_registration_channel_label')">
                  <registration-channel style="width: 217px" :disabled="disabled" @registration_channel = "selectRegistration" :value="form.register_channel_code"></registration-channel>
                </el-form-item>
              <!--registration store-->
                <el-form-item :label="$t('member.fc_member_recruitment_registration_store_label')">
                  <registration-store
                    style="width: 217px"
                    :list="store_lists"
                    :disabled="disabled"
                    :value="form.register_store_code || ''"
                    @registration_store = "selectRegistration"
                    :type = "getRegistrationName('registration_store')"
                  ></registration-store>
                </el-form-item>
              <!--preferred store-->
                <el-form-item :label="$t('member.fc_member_recruitment_registration_preferred_label')">
                  <registration-store
                    style="width: 217px"
                    :disabled="disabled"
                    :list="store_lists"
                    @prefer_store = "selectRegistration"
                    :value="form.preferred_store_code || ''"
                    :type = "getRegistrationName('prefer_store')"
                  ></registration-store>
                </el-form-item>
              <!--registration staff-->
                <el-form-item :label="$t('member.fc_member_recruitment_registration_staff_label')">
                  <registration-staff :disabled="disabled" style="width: 217px" @registration_staff = "selectRegistration" :value="form.register_employee_code" :parentStoreCode = "form.register_store_code || ''"></registration-staff>
                </el-form-item>
            </el-row>
        </div>
      </el-collapse-item>
      <!--Addtional info-->
      <el-collapse-item name="5" v-if="dynamic_info !== null">
        <template slot="title">
          <div class="header">
            <p>{{handleGlobalI18n('member', 'addtional_info')}}</p>
          </div>
        </template>
        <div class="contain">
          <el-row class="list registration_details_list">
            <el-form-item v-for="(item, index) in dynamic_info[getLanguage()]"  :label="item.dynamic_field_name + ':'" :key="index">
              <el-input v-model="dynamic_info['value'][index].field_value" style="width: 217px;" maxlength="128" />
            </el-form-item>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
    </el-form>
    <div class="click-button">
      <el-button type="primary" class="save" @click.native="submitForm('form')"  v-if="!disabled" :loading="saveLoading">{{handleGlobalI18n('member', 'save')}}</el-button>
      <el-button type="primary" class="edit" @click="disabled=!disabled"  v-if="disabled">{{handleGlobalI18n('member', 'edit')}}</el-button>
      <el-button @click="goBack">{{handleGlobalI18n('member', 'cancel')}}</el-button>
    </div>
  </div>
</template>
<script>
  import {
    getMemberInfo,
    updateMember,
    saveOrUpdateMemberDynamicInfo
  } from '@/api/member'
  import RegistrationBrand from '@/views/member/registration-brand'
  import RegistrationChannel from '@/views/member/registration-channel'
  import RegistrationStore from '@/views/member/registration-store'
  import RegistrationStaff from '@/views/member/registration-staff'
  import Country from '@/views/member/country'
  import Province from '@/views/member/province'
  import City from '@/views/member/city'
  import District from '@/views/member/district'
  import {
    parseIntVal
  } from '@/utils/util'
  import {
    // validateMobile,
    validateEmail
  } from '@/utils/validate'
  import { queryStoreList } from '@/api/master'
  import DatePick from '@/components/DatePick'
  import { getMemberDynamicInfoMixin } from '@/views/data/addtional_info_list'
  import { handleMemberRegionCodeMixin } from '@/views/data/member-region-code'
  import { isUsedMemberPortalTenant } from '@/utils'
  export default {
    mixins: [parseIntVal, getMemberDynamicInfoMixin, handleMemberRegionCodeMixin],
    components: {
      RegistrationBrand,
      RegistrationChannel,
      RegistrationStore,
      RegistrationStaff,
      Country,
      Province,
      City,
      District,
      DatePick
    },
    data() {
      return {
        store_lists: [],
        country_code: '',
        province_code: '',
        city_code: '',
        district_code: '',
        saveLoading: false,
        rules: {
          birthday: [{ required: true, message: 'Message is missing', trigger: ['blur', 'change'] }],
          mobile: [{ validator: this.checkMobile, trigger: ['blur', 'change'] }],
          mobile_region_code: [{ validator: this.checkMobileRegion, trigger: ['blur', 'change'] }],
          email: [{ validator: this.checkEmail, trigger: ['blur', 'change'] }]
        },
        activeNames: ['1', '2', '3', '4', '5'],
        disabled: false,
        loading: true,
        form: {
          mobile_region_code: '',
          register_date: '',
          first_name: null,
          last_name: null,
          mobile: null,
          gender: null,
          member_code: null,
          email: null,
          country: null,
          province: null,
          city: null,
          birthday: null,
          city_dictionary_code: null,
          country_dictionary_code: null,
          province_dictionary_code: null,
          options: [{
            option_code: 'sms',
            option_value: false,
            disabled: false
          }, {
            option_code: 'email',
            option_value: false,
            disabled: false
          }, {
            option_code: 'mobile',
            option_value: false,
            disabled: false
          }],
          register_store_code: null,
          preferred_store_code: null,
          register_employee_code: null,
          register_channel_code: null,
          register_brand_code: null,
          address: null,
          district: null,
          zip_code: null
        },
        params_member_code: ''
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
    watch: {
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
    created() {
      this.params_member_code = this.$route.params.member_code || ''
      this.member_code = this.params_member_code
      if (this.params_member_code.length > 0) {
        this.loading = true
        this.getMemberInfo()
        this.getStoreList()
      } else {
        this.loading = false
        this.$message('fail')
      }
    },
    methods: {
      isUsedMemberPortalTenant,
      getStoreList() {
        queryStoreList({
          page_no: 1,
          page_size: 10000000
        }).then((res) => {
          const result = res.return_result
          const has = Object.prototype.hasOwnProperty
          if (has.call(result, 'stores')) {
            this.store_lists = this.store_lists.concat(result.stores || [])
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      checkEmail(rule, value, callback) {
        if (this.form.email === '' || this.form.email === null) {
          callback()
        }
        if (this.form.email !== '') {
          validateEmail(this.form.email) ? callback() : callback(new Error(this.handleGlobalI18n('validation', 'email_error')))
        } else {
          callback()
        }
      },
      checkMobile(rule, value, callback) {
        if (this.form.mobile === '' || this.form.mobile === null) {
          callback()
        }
        if (this.form.mobile !== '') {
          this.globalData.validateMobile(this.form.mobile) ? callback() : callback(new Error(this.handleGlobalI18n('validation', 'mobile_error')))
        } else {
          callback()
        }
      },
      checkMobileRegion(rule, value, callback) {
        if (this.form.mobile && !value) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
        }
        callback()
      },
      getRegistrationName(value) {
        return value
      },
      setBirthday(val) {
        if (!val.month || !val.day) {
          this.form.birthday = ''
        } else {
          this.form.birthday = `${val.year}-${val.month}-${val.day}`
        }
      },
      selectRegistration(obj) {
        switch (obj.type) {
          case 'brand':
            this.form.register_brand_code = obj.value
            break
          case 'channel':
            this.form.register_channel_code = obj.value
            break
          case 'registration_store':
            this.form.register_store_code = obj.value
            break
          case 'prefer_store':
            this.form.preferred_store_code = obj.value
            break
          case 'staff':
            this.form.register_employee_code = obj.value
            break
          default:
            break
        }
      },
      handleLocalhostChange(obj) {
        switch (obj.type) {
          case 'country':
            this.form.country_dictionary_code = obj.value
            break
          case 'province':
            this.form.province_dictionary_code = obj.value
            break
          case 'city':
            this.form.city_dictionary_code = obj.value
            break
          case 'district':
            this.form.district_dictionary_code = obj.value
            break
          default:
            break
        }
      },
      // 保存自定义字段
      saveField() {
        if (!this.dynamic_info) {
          return true
        }
        saveOrUpdateMemberDynamicInfo({
          member_code: this.member_code,
          fields: this.dynamic_info ? this.dynamic_info['value'] : []
        }).then(res => {
          // 保存成功
        }).catch(res => {
          this.$message.error(res)
        })
      },
      getMemberInfo() {
        getMemberInfo(this.params_member_code).then((res) => {
          var result = res.return_result
          var default_options = [{
            option_code: 'sms',
            option_value: false,
            disabled: false
          }, {
            option_code: 'email',
            option_value: false,
            disabled: false
          }, {
            option_code: 'mobile',
            option_value: false,
            disabled: false
          }]
          const option = result.options
          if (option) {
            option.forEach((value, index, array) => {
              if (value.option_type_code === 'sms') {
                default_options[0].option_value = value.option_value === 1
              }
              if (value.option_type_code === 'email') {
                default_options[1].option_value = value.option_value === 1
              }
              if (value.option_type_code === 'mobile') {
                default_options[2].option_value = value.option_value === 1
              }
              if (default_options[0].option_value && default_options[1].option_value) {
                default_options[2].disabled = true
              } else if (default_options[2].option_value) {
                default_options[0].disabled = true
                default_options[1].disabled = true
              }
            })
          }
          this.form = { ...this.form, ...result }
          this.form.register_date = result.register_date ? result.register_date.substr(0, 10) : ''
          this.form.options = default_options
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      submitForm(formName) {
        this.saveLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const aData = {}
            if (this.form.birthday && this.form.birthday.length > 0) {
              [aData.birthday_year, aData.birthday_month, aData.birthday_day] = (this.form.birthday.split('-')).map((value) => {
                return parseInt(value)
              })
            }
            const options = JSON.parse(JSON.stringify(this.form.options))
            options.forEach((value, index) => {
              options[index].option_value = value.option_value ? 1 : 2
            })
            const newData = Object.assign({}, this.form, aData, { options: options })
            updateMember(newData).then(res => {
              this.$message({
                message: this.$t('configuration.fc_operation_feedback_notification_label'),
                type: 'success'
              })
              this.saveLoading = false
              this.$router.go(-1)
            }).catch(res => {
              this.saveLoading = false
              this.$message.error(res)
            })
            this.saveField()
          } else {
            this.saveLoading = false
            this.$message.error(this.handleGlobalI18n('sustem', 'error_submit'))
            return false
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .improve-info {
    .registration_details_list{
      display: flex;
      flex-wrap: wrap;
    }
    margin: 5px 25px;
    .click-button {
      margin-top: 20px;
      padding: 5px;
      width: 100%;
      margin-bottom: 30px;
      .save {
        margin-left: 20px;
      }
    }
    .el-input, .el-select, .el-date-picker {
      width: 390px;
    }
    .header {
      height: 40px;
      line-height: 40px;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 3px;
        height: 26px;
        background-color: $new-primary;
        top: 0;
        margin: auto 0;
      }
      p {
        margin-left: 20px;
        font-size: 18px;
        color: #333;
      }
    }
    .contain {
      width: 100%;
      margin-top: 30px;
      background-color: #ffffff;
      .privacy {
        margin-left: 10px;
      }
      .ul {
        padding: 0;
        li {
          width: 640px;
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
  }
</style>
