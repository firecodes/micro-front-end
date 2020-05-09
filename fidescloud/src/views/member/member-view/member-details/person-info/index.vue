<!--person info-->
<template>
  <div class="person-info" v-loading="loading">
    <el-container>
      <el-header class="header-top cursor-pointer" >
        <back-button />
      </el-header>
      <el-container class="container">
        <el-main class="main">
          <div class="contain">
            <div class="header1">
              <p>{{$t('member.fc_member_details_person_basic_section_label')}}</p>
              <svg-icon @click.native="toEditMemberInfo" class="edit cursor-pointer" icon-class="edit" v-if="show_edit" />
            </div>
            <el-row :gutter="20" class="list1">
              <!--BASIC DETAILS 基本详细信息 REGISTRATION DETAILS 注册基本信息-->
              <el-col :xs="24" :sm="24" :lg="24" :xl="14">
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :lg="8" :xl="10">
                    <ul class="basic-info">
                      <li class="name">
                        <p>{{$t('member.fc_member_details_person_basic_basic_label')}}</p>
                      </li>
                      <!--member code-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_code_label')}}</label>
                        <!--<span class="span">*</span>-->
                        <p class="value">{{info.member_code? handleMemberCodeLength(info.member_code) : '-'}}</p>
                      </li>
                      <!--first name-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_first_label')}}</label>
                        <label class="value">{{info.first_name || '-'}}</label>
                      </li>
                      <!--last name-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_last_label')}}</label>
                        <label class="value">{{info.last_name || '-'}}</label>
                      </li>
                      <!--gender-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_gender_label')}}</label>
                        <label class="value">{{handleGender(info.gender) || '-'}}</label>
                      </li>
                      <!--mobile-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_mobile_label')}}</label>
                        <label class="value">{{info.mobile ? ((info.mobile_region_code ?  (info.mobile_region_code + ' ') : '-') + info.mobile) : table_placeholder }}</label>
                      </li>
                      <!--email-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_email_label')}}</label>
                        <label class="value">{{info.email || '-'}}</label>
                      </li>
                      <!--birthday-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_birthday_label')}}</label>
                        <label class="value">{{globalData.formatDate(info.birthday) || '-'}}</label>
                      </li>
                    </ul>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8" :xl="14">
                    <ul class="registration-details">
                      <li class="name">
                        <p>{{$t('member.fc_member_details_person_basic_registration_label')}}</p>
                      </li>
                      <!--registration date-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_registration_date_label')}}</label>
                        <label class="value">{{info.register_date ? globalData.formatDate(info.register_date.substring(0, 10)) : '-'}}</label>
                      </li>
                      <!--registration brand-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_registration_brand_label')}}</label>
                        <label class="value">{{info.register_brand_name || '-'}}</label>
                      </li>
                      <!--registration channel-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_registration_channel_label')}}</label>
                        <label class="value">{{info.register_channel_resources_key ? $t(`reporting.${info.register_channel_resources_key}`) : (info.register_channel_name ? info.register_channel_name : table_placeholder) }}</label>
                      </li>
                      <!--registration store-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_registration_store_label')}}</label>
                        <label class="value">{{info.register_store_name || '-'}}</label>
                      </li>
                      <!--registration store code-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_store_code_label')}}</label>
                        <label class="value">{{info.register_store_code || '-'}}</label>
                      </li>
                      <!--preferred store-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_preferred_store_label')}}</label>
                        <label class="value">{{info.preferred_store_name || '-'}}</label>
                      </li>
                      <!--registration staff-->
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_registration_staff_label')}}</label>
                        <label class="value">{{info.register_employee_name || '-'}}</label>
                      </li>
                    </ul>
                  </el-col>
                </el-row>
              </el-col>
              <!--PRIVACY 隐私 ADDRESS DETAILS 地址详细信息-->
              <el-col :xs="24" :sm="24" :lg="16" :xl="10">
                <div class="pvadde">
                  <!--privacy-->
                  <ul class="privacy">
                    <li class="name">
                      <p>{{$t('member.fc_member_details_person_basic_privacy_label')}}</p>
                    </li>
                    <li>
                      <span class="color000">{{$t('member.fc_member_details_person_basic_privacy_option1_label')}}</span>
                      <el-switch class="switch" :value="checkOption(0)" disabled ></el-switch>
                    </li>
                    <li>
                      <span class="color000">{{$t('member.fc_member_details_person_basic_privacy_option2_label')}}</span>
                      <el-switch class="switch" :value="checkOption(1)" disabled></el-switch>
                    </li>
                    <li>
                      <span class="color000">{{$t('member.fc_member_details_person_basic_privacy_option3_label')}}</span>
                      <el-switch class="switch" :value="checkOption(2)" disabled></el-switch>
                    </li>
                  </ul>
                  <ul class="address-details">
                    <li class="name">
                      <p>{{$t('member.fc_member_details_person_basic_addrees_label')}}</p>
                    </li>
                    <template v-if="isBHGLoginUser()">
                      <!--singapore 和 其他国家-->
                      <template v-if="address_info.whichregion === 'singapore'">
                        <li>
                          <label class="key">Postal Code:</label>
                          <p class="value">{{address_info.postalcode || '-'}}</p>
                        </li>
                        <li>
                          <label class="key">House / Block No:</label>
                          <p class="value">{{address_info.blockhouse || '-'}}</p>
                        </li>
                        <li>
                          <label class="key">Level:</label>
                          <p class="value">{{address_info.level || '-'}}</p>
                        </li>
                        <li>
                          <label class="key">Unit:</label>
                          <p class="value">{{address_info.levelunit || '-'}}</p>
                        </li>
                        <li>
                          <label class="key">Street Name:</label>
                          <p class="value">{{address_info.streetname || '-'}}</p>
                        </li>
                        <li>
                          <label class="key">Building Name:</label>
                          <p class="value">{{address_info.buildingname || '-'}}</p>
                        </li>
                      </template>
                      <template v-else>
                        <!--Address-->
                        <li>
                          <label class="key">{{$t('member.fc_member_details_person_basic_addrees_details_label')}}</label>
                          <label class="value">{{address_info.singaporeadd || '-'}}</label>
                        </li>
                        <!--city/state/region/province-->
                        <li>
                          <label class="key">{{$t('member.fc_member_details_person_basic_addrees_city_label')}}</label>
                          <label class="value">{{address_info.region || '-'}}</label>
                        </li>
                        <!--zip code-->
                        <li>
                          <label class="key">{{$t('member.fc_member_details_person_basic_addrees_zipcode_label')}}</label>
                          <label class="value">{{address_info.zipCode || '-'}}</label>
                        </li>
                      </template>
                    </template>
                    <template v-else>
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_addrees_city_label')}}</label>
                        <label class="value">{{(info.country_dictionary_name || '-') + (info.province_dictionary_name ? (',' + info.province_dictionary_name) : '-') + ''+ (info.city_dictionary_name ? (',' + info.city_dictionary_name) : '-') + ''+ (info.district_dictionary_name ? ( ',' + info.district_dictionary_name) : '-')}}</label>
                      </li>
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_addrees_details_label')}}</label>
                        <label class="value">{{info.address || '-'}}</label>
                      </li>
                      <li>
                        <label class="key">{{$t('member.fc_member_details_person_basic_addrees_zipcode_label')}}</label>
                        <label class="value">{{info.zip_code || '-'}}</label>
                      </li>
                    </template>
                  </ul>
                </div>
              </el-col>
              <!--自定义字段-->
              <el-col :xs="24" :sm="24" :lg="24" :xl="24" v-if="dynamic_info !== null">
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :lg="16" :xl="12">
                    <ul class="addtional-info">
                      <li class="name">
                        <p>{{handleGlobalI18n('member', 'addtional_info')}}</p>
                      </li>
                      <li v-for="(item, index) in dynamic_info[getLanguage()]" :key="index">
                        <label class="key">{{item.dynamic_field_name}}:</label>
                        <p class="value">  {{dynamic_info['value'][index].field_value || '-'}} </p>
                      </li>
                    </ul>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="contain2">
            <div class="header1">
              <p>{{$t('member.fc_member_details_person_segmentation_section_label')}}</p>
              <!--<svg-icon icon-class="edit" class="edit cursor-pointer" @click.native="editSegmentation"></svg-icon>-->
            </div>
            <div class="detail">
              <segmentation-canvas :member_code = "member_code"></segmentation-canvas>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import SegmentationCanvas from './segmentation-canvas/index'
  import { getMemberInfo } from '@/api/member'
  import BackButton from '@/components/BackButton'
  import { isBHGLoginUser } from '@/utils'
  import { getMemberDynamicInfoMixin } from '@/views/data/addtional_info_list'
  import VClamp from 'vue-clamp'
  export default {
    mixins: [getMemberDynamicInfoMixin],
    components: {
      SegmentationCanvas,
      BackButton,
      VClamp
    },
    data() {
      return {
        member_code: '',
        info: '',
        loading: true,
        show_edit: true,
        address_info: {
          postalcode: '',
          blockhouse: '',
          level: '',
          levelunit: '',
          streetname: '',
          buildingname: '',
          whichregion: '',
          singaporeadd: '',
          region: '',
          zipCode: ''
        }
      }
    },
    created() {
      var full_path = this.$route.path
      if (full_path.indexOf('member-query') > -1) {
        this.show_edit = false
      }
      this.member_code = this.$route.query.member_code
      this.getMemberInfo()
    },
    methods: {
      isBHGLoginUser,
      checkOption(index) {
        if (this.info.options === undefined || this.info.options === null) {
          return false
        }
        if (this.info.options[index]) {
          if (this.info.options[index].option_value) {
            return true
          }
        }
        return false
      },
      handleMemberCodeLength(val) {
        if (val.length <= 15) {
          return val
        } else {
          return val.substring(0, 15) + '.....'
        }
      },
      handleGender(gender) {
        if (gender === 1) {
          return 'Male'
        } else if (gender === 2) {
          return 'Female'
        } else {
          return 'Unknown'
        }
      },
      getMemberInfo() {
        getMemberInfo(this.member_code).then((res) => {
          // 单独处理隐私
          var default_options = [{
            option_code: 'sms',
            option_value: false
          }, {
            option_code: 'email',
            option_value: false
          }, {
            option_code: 'mobile',
            option_value: false
          }]
          var option = res.return_result.options
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
            })
          }
          this.info = Object.assign({}, res.return_result, { options: default_options })
          // 处理地址详细信息
          if (this.info.address_info !== null && this.info.address_info !== '') {
            this.address_info = JSON.parse(this.info.address_info)
          }
          this.loading = false
        }).catch(res => {
          this.$message.error(res)
          this.loading = false
        })
      },
      editSegmentation() {
        this.$router.push({
          path: '/member/edit-segmentation'
        })
      },
      toEditMemberInfo() {
        this.$router.push({
          path: `/member/improve-info/${this.member_code}`
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  $border-color: #dedede;
  .registration-details,.privacy,.address-details,.basic-info, .addtional-info{
    border-radius: 4px;
  }
  .person-info {
    margin: 20px;
    .header-top {
      padding:0!important;
      height: 30px !important;
    }
    .basic-info,.address-details{
      margin-bottom:20px;
    }
    .header1 {
      height: 40px;
      line-height: 40px;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: rgba(51, 51, 51, 0.07);
      }
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
      .edit {
        position: absolute;
        right:0;
        top:2.5px;
        font-size: 35px;
        margin-right: 20px;
      }
    }
    .container {
      margin-top: 15px;
      .main {
        padding: 0;
        overflow-x: hidden;
        .contain {
          margin-top: 4px;
          background-color: #ffffff;
          position: relative;
          .name {
            background-color: #F3F6FB;
            height: 30px;
            line-height: 30px;
            text-align: center;
          }
          .list1 {
            padding: 20px 20px 30px;
            ul {
              border: 1px solid $border-color;
            }
            li {
              &:not(.name){
                display: flex;
                align-items: center;
              }
              .key{
                flex: none;
              }
              .key,.color000 {
                color: #000000;
                font-weight: bold;
              }
              .value {
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                color: #101010;
              }
              .span {
                color: red;
              }
              &:not(:first-child) {
                background-color: #ffffff;
                margin: 0 10px;
                height: 40px;
                line-height: 40px;
                font-size: 15px;

              }
            }
            .pvadde {
              .address-details {
                margin-top: 30px;
              }
            }
          }
        }
        .contain2 {
          margin-top: 20px;
          background-color: #ffffff;
        }
      }
    }
  }

  @media (max-width: 1024px) {
    ul {
      margin-top: 20px;
    }
  }
</style>
