<!--
  member query -> advanced query
  2020.04.01
-->
<template>
  <div class="advanced-query" ref="advanced-query">
    <el-form ref="form" :rules="rules"  :model="form" label-width="210px">
      <el-row class="list">
        <!-- member code -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_member_code_label')" prop="member_code">
            <el-input type="text" v-model="form.member_code" class="width-300" max="32" />
          </el-form-item>
        </el-col>
        <!-- country/province/city -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_country_label')" prop="cpc">
            <select-country-province-city @handleSelectCity="handleSelectCity" :value1="form.cpc" class="width-300"/>
          </el-form-item>
        </el-col>
        <!-- first name -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_first_name_label')" prop="first_name">
            <el-input type="text" v-model="form.first_name" class="width-300" />
          </el-form-item>
        </el-col>
        <!--register date period-->
        <el-col>
          <el-form-item :label="$t('member.fc_member_view_registration_date_label')" prop="join_date_form">
            <date-range @valueDate = "valueDateJoin" :value="join_date" class="width-300" />
          </el-form-item>
        </el-col>
        <!-- last name -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_last_name_label')" prop="last_name">
            <el-input type="text" v-model="form.last_name" class="width-300" />
          </el-form-item>
        </el-col>
        <!-- Registration channel -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_channel_label')" prop="register_channel_code">
            <registration-channel :value="form.register_channel_code" @registration_channel = "selectRegistration" class="width-300" />
          </el-form-item>
        </el-col>
        <!--gender-->
        <el-col>
          <el-form-item :label="$t('member.fc_member_view_gender_label')" prop="gender">
            <el-select v-model="form.gender" filterable clearable :placeholder="handleGlobalI18n('member', 'please_select')" class="width-300">
              <el-option :label="handleGlobalI18n('member', 'male')" :value="parseInt(1)" />
              <el-option :label="handleGlobalI18n('member', 'female')" :value="parseInt(2)" />
              <el-option :label="handleGlobalI18n('member', 'unknown')" :value="parseInt(0)" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- registration store name -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_store_label')" prop="register_store_code">
            <registration-name :list="list" :value="form.registration1" @registration_name = "selectRegistration" class="width-300" />
          </el-form-item>
        </el-col>
        <!-- Registration staff -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_staff_label')" prop="register_employee_code">
            <registration-staff :value="form.register_employee_code" :parentStoreCode="register_store_code" @registration_staff = "selectRegistration" class="width-300" />
          </el-form-item>
        </el-col>
        <!--birthday period-->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_birthday_label')" prop="birthday_form">
            <date-range @valueDate = "valueDateBirthday" :value="birthday_date" class="width-300" />
          </el-form-item>
        </el-col>
        <!-- registration store code -->
        <el-col >
          <el-form-item :label="$t('member.fc_member_query_store_code_label')" prop="register_store_code">
            <el-input type="text" v-model="form.register_store_code" class="width-300" />
          </el-form-item>
        </el-col>
        <!-- mobile -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_mobile_label')" prop="mobile">
            <el-input type="text" v-model="form.mobile" class="width-300" />
          </el-form-item>
        </el-col>
        <!-- preferred store name -->
        <el-col>
          <el-form-item :label="$t('member.fc_member_query_preferred_store_label')">
            <registration-store :list="list" :value="form.preferred_store_code" @prefer_store = "selectRegistration" :type = "getRegistrationName('prefer_store')" class="width-300" />
          </el-form-item>
        </el-col>
        <!--email-->
        <el-col>
          <el-form-item :label="$t('member.fc_member_details_email_label')" prop="email" :rules="[{ validator: this.checkEmail, trigger: 'blur' }]">
            <el-input type="text" v-model="form.email" class="width-300" />
          </el-form-item>
        </el-col>
        <!--Additional Field-->
        <el-col v-if="dynamic_fields !== null">
          <el-form-item :label="handleGlobalI18n('member', 'additional_field')+':'">
            <el-select v-model="form.additional_code" class="width-300">
              <el-option
                v-for="(item, index) in dynamic_fields[getLanguage()]"
                :key="index"
                :label="item.dynamic_field_name"
                :value="dynamic_fields['value'][index].dynamic_field_code">
              </el-option>
            </el-select>
            <el-input v-model="form.additional_value" maxlength="128" class="width-300"/>
          </el-form-item>
        </el-col>
        <el-col class="button" type="flex" justify="right">
          <el-form-item>
            <div>
              <el-button @click="resetForm1" icon="el-icon-refresh">{{$t('member.fc_member_query_btn_reset_label')}}</el-button>
              <el-button type="primary" @click="search" icon="el-icon-search">{{$t('member.fc_member_query_btn_search_label')}}</el-button>
              <!--<el-button type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">{{handleGlobalI18n('member', 'export')}}</el-button>-->
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import SelectCountryProvinceCity from '@/components/CountryProvinceCity'
  import RegistrationChannel from '@/views/member/registration-channel'
  import RegistrationStore from '@/views/member/registration-store'
  import RegistrationName from '@/views/member/registration-name'
  import RegistrationStaff from '@/views/member/registration-staff'
  import Country from '@/views/member/country'
  import Province from '@/views/member/province'
  import City from '@/views/member/city'
  import DateRange from '@/components/EldatePicker'
  import { validateEmail, validateMobile } from '@/utils/validate'
  import DatePick from '@/components/DatePick'
  import { queryStoreList } from '@/api/master'
  import { getDynamicFieldsMixin } from '@/views/data/dynamic_fields'
  export default {
    mixins: [getDynamicFieldsMixin],
    components: {
      RegistrationName,
      SelectCountryProvinceCity,
      RegistrationChannel,
      RegistrationStore,
      RegistrationStaff,
      Country,
      Province,
      City,
      DateRange,
      DatePick
    },
    data() {
      return {
        downloadLoading: false,
        rules: {
          email: [
            { min: 0, max: 128, message: this.handleGlobalI18n('validation', 'email_length'), trigger: 'change' },
            { validator: this.checkEmail, trigger: 'blur' }
          ],
          member_code: [
            { min: 0, max: 32, message: this.handleGlobalI18n('validation', 'member_code_length'), trigger: 'change' }
          ],
          mobile: [
            { validator: this.checkMobile, trigger: 'change' }
          ]
        },
        days: [1, 2, 3],
        months: [1, 2, 3, 4],
        years: [5, 6, 7, 8],
        birthday_date: [],
        join_date: [],
        store_code: '',
        register_store_code: '',
        form: {
          registration1: '',
          cpc: [],
          birthday_from: '',
          birthday_to: '',
          city_dictionary_code: '',
          country_dictionary_code: '',
          province_dictionary_code: '',
          email: '',
          gender: '',
          member_code: '',
          mobile: '',
          first_name: '',
          last_name: '',
          register_channel_code: '',
          register_store_code: '',
          register_store_name: '',
          preferred_store_code: '',
          register_employee_code: '',
          register_date_from: '',
          register_date_to: '',
          recent_purchase_store_code: ''
        },
        flags: {
          flagPhoneNumber: false,
          flagMemberCode: false,
          flagEmail: false
        },
        list: []
      }
    },
    created() {
      this.getStoreList()
    },
    methods: {
      getStoreList() {
        queryStoreList({
          page_no: 1,
          page_size: 10000000
        }).then((res) => {
          const result = res.return_result
          const has = Object.prototype.hasOwnProperty
          if (has.call(result, 'stores')) {
            this.list = this.list.concat(result.stores)
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      handleSelectCity(value) {
        this.form.cpc = value;
        [this.form.country_dictionary_code, this.form.province_dictionary_code, this.form.city_dictionary_code] = value
      },
      handleDownload() {
        this.downloadLoading = true
        this.$refs['form'].validate((valid) => {
          if (valid) {
            var new_form = JSON.parse(JSON.stringify(this.form))
            if (this.store_code !== '') {
              new_form.register_store_code = this.store_code
            }
            this.$emit('download_member', {
              'header': {
                'birthday': this.handleGlobalI18n('member', 'birthday'),
                'city_dictionary_name': this.handleGlobalI18n('member', 'city'), //
                'full_name': this.handleGlobalI18n('member', 'name'),
                'member_code': this.handleGlobalI18n('member', 'member_code'),
                'member_tier_name': this.handleGlobalI18n('member', 'tier'),
                'mobile': this.handleGlobalI18n('member', 'mobile'),
                'point': this.handleGlobalI18n('member', 'point'), //
                'province_dictionary_name': this.handleGlobalI18n('member', 'province'), //
                'register_channel_name': this.handleGlobalI18n('member', 'registration_channel'),
                'register_date': this.handleGlobalI18n('member', 'register_date'),
                'register_employee_name': this.handleGlobalI18n('member', 'registration_employee'),
                'register_store_code': this.handleGlobalI18n('member', 'registration_store_code'),
                'register_store_name': this.handleGlobalI18n('member', 'register_store')
              },
              'member_by_search_request': new_form
            })
          }
        })
      },
      checkEmail(rule, value, callback) {
        if (this.form.email.length > 0) {
          validateEmail(this.form.email) ? callback() : callback(new Error(this.handleGlobalI18n('validation', 'email_error')))
        } else {
          callback()
        }
      },
      checkMobile(rule, value, callback) {
        this.form.mobile = value.replace(/\D/gi, '')
        callback()
      },
      checkPhoneNumber(rule, value, callback) {
        if (this.form.phoneNumber.length > 0) {
          validateMobile(this.form.phoneNumber) ? callback() : callback(new Error(this.handleGlobalI18n('validation', 'mobile_error')))
        } else {
          callback()
        }
      },
      setBirthday(val) {
        this.form.birthday = `${val.year}-${val.month}-${val.day}`
      },
      valueDateBirthday(val) {
        this.birthday_date = val
      },
      valueDateJoin(val) {
        this.join_date = val
      },
      getRegistrationName(value) {
        return value
      },
      selectRegistration(obj) {
        switch (obj.type) {
          case 'channel':
            this.form.register_channel_code = obj.value
            break
          case 'registration_store':
            this.form.register_store_code = obj.value
            break
          case 'registration_name':
            this.form.registration1 = obj.id
            this.form.register_store_name = obj.value.store_name
            this.register_store_code = obj.value.store_code
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
          default:
            break
        }
      },
      search() {
        const rightCount = this.confirmSubmit(this.form.phoneNumber, 32) - 0 + this.confirmSubmit(this.form.memberCode, 32) - 0 + this.confirmSubmit(this.form.email, 128)
        this.$refs['form'].validate((valid) => {
          if (rightCount >= 1 || valid) {
            var new_form = JSON.parse(JSON.stringify(this.form))
            if (this.store_code !== '') {
              new_form.register_store_code = this.store_code
            }
            this.$emit('advanced_search', new_form)
          }
        })
      },
      confirmSubmit(value, limitLength, callback) {
        if (value) {
          if ((!callback && value.length <= limitLength) || (callback && callback(value) && value.length <= limitLength)) {
            return 1
          } else {
            return 0
          }
        } else {
          return 0
        }
      },
      resetForm1() {
        this.$refs.form.resetFields()
        this.join_date = []
        this.register_store_code = ''
        this.form.registration1 = ''
        this.form.register_store_name = ''
        this.register_store_code = '';
        [this.form.country_dictionary_code, this.form.province_dictionary_code, this.form.city_dictionary_code, this.form.register_employee_code] = ['', '', '', ''];
        [this.form.register_date_from, this.form.register_date_to] = ['', ''];
        [this.form.birthday_from, this.form.birthday_to, this.birthday_date] = ['', '', []]
        this.form.preferred_store_code = ''
      }
    },
    watch: {
      birthday_date() {
        [this.form.birthday_from, this.form.birthday_to] = this.birthday_date || ['', '']
      },
      join_date() {
        [this.form.register_date_from, this.form.register_date_to] = this.join_date || ['', '']
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .width-300{
    width: 300px!important;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
  }
  .el-button{
    min-width: 80px;
  }
  .el-input, .el-select {
    width: 100%;
  }
  h5 {
    line-height: 3;
  }
  .advanced-query {
    padding:0;
    margin:0 20px;
    .el-form {
      padding-top:20px;
      margin-bottom: 20px;
      background-color: #F9F9F9;
    }
  }
  .button{
    text-align: right;
    margin-bottom:30px;
  }
  .purchased-products {
    display: flex;
    margin-top: 5px;
    align-items: center;
    li {
      border: 1px solid #666666;
      padding: 5px 10px;
      font-size: 14px;
      line-height: 1;
      border-radius: 10px;
      background-color: #ffffff;
      color: #888888;
      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
  .el-col-24 {
    width: auto !important;
  }
  .date-pick {
    width: 33.333% !important;
  }
  .el-range-input {
    position: relative;
    top: -10px;
  }
</style>
