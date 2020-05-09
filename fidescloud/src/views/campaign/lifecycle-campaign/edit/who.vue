<template>
  <div class="lifecycle-campaign-who-item" ref="who">
    <el-form label-width="160px" >
      <p class="p">{{$t('campaign.fc_campaign_lifecycle_edit_who_title_label')}}</p>
      <!--选择模式-->
      <div class="select-mode">
        <el-form-item :label="$t('campaign.fc_campaign_lifecycle_edit_who_audience_label')">
          <el-select v-model="form.select_type">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="handleGlobalI18n('campaign', item.label)"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!--选择模式为目标会员-->
      <div class="target-member-mode" v-if="form.select_type === 'filter'">
        <div class="profile-target t"  v-for="(item,index) in by_profile" :key="index">
          <label class="title">{{ handleGlobalI18n('campaign', item.criteria_group).substring(0,1).toUpperCase()+handleGlobalI18n('campaign', item.criteria_group).substring(1)}}</label>
          <div class="ul">
              <template  v-for="item1 in item.criteria_field" >
                <!--age-->
                <div class="li" :class="{'check': tags.age.length>0 }" v-if="item1.criteria_field_code==='age'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.age" @handleDelete="handleDeleteAge"></by-profile>
                </div>
              </template>
            </div>
        </div>
        <div class="profile-target t">
          <label class="title">{{ handleGlobalI18n('campaign', 'register_channel') }}</label>
          <div class="ul">
            <div class="li" :class="{'check' : select_register_channel_id[index1] === index1 + 1}" v-for="(item1, index1) in register_channel_data" :key="item1.channel_code" @click="handleSelectRegisterChannel(index1)">
              <p>{{item1.resources_key ? $t(`reporting.${item1.resources_key}`) : item1.channel_name}}</p>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <el-dialog :title="handleDialogTitle" :visible.sync="selectDialog" width="350px">
      <el-form label-position="top" :model="dialogData" :rules="rulesDialog" ref="dialog">
        <div v-if="profile_type==='age'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')" prop="age_from">
            <el-input-number :min="0" :precision="0" :step="1" style="width:300px;" v-model="dialogData.age_from" />
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')"  prop="age_to">
            <el-input-number :min="0" :precision="0" :step="1" style="width:300px;" v-model="dialogData.age_to" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDialog = false">{{$t('campaign.fc_campaign_lifecycle_edit_btn_back_label')}}</el-button>
        <el-button type="primary" @click="closeDialog(profile_type)">{{handleGlobalI18n('campaign', 'submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ByProfile from '../../campaign-setting/by-profile'
  import {
    validateCompare,
    validatePositiveInteger
  } from '@/utils/validate'
  import { isObjectValueEqual } from '@/utils'
  import { who_options, who_target_1, who_target_2 } from '@/data/lifecycle-campaign'
  export default {
    components: {
      ByProfile
    },
    props: {
      tier_list: {
        type: Array
      },
      nonius_id: {
        type: Number,
        default: 1
      },
      form_data: {
        type: Object,
        default: {}
      },
      register_channel_data: {
        type: Array
      }
    },
    data() {
      return {
        select_register_channel_id: [0, 0, 0, 0, 0],
        rulesDialog: {
          age_from: [
            { validator: this.validateAgeFrom, trigger: ['blur', 'change'] }
          ],
          age_to: [
            { validator: this.validateAgeTo, trigger: ['blur', 'change'] }
          ]
        },
        dialogData: {
          age_from: '',
          age_to: ''
        },
        transfer_tier: [],
        profile_type: 'profile_type',
        selectDialog: false,
        by_profile: who_target_1,
        by_profile2: who_target_2,
        tags: {
          age: []
        },
        options: who_options,
        form: {}
      }
    },
    computed: {
      handleDialogTitle() {
        return this.handleFirstToUpperCase(this.profile_type)
      }
    },
    methods: {
      validatePositiveInteger,
      validateCompare,
      isObjectValueEqual,
      handleSelectRegisterChannel(index) {
        var value = index
        if (this.select_register_channel_id[index] !== 0) {
          value = 0
        } else {
          value += 1
        }
        this.$set(this.select_register_channel_id, index, value)
      },
      // 翻译
      handleFirstToUpperCase(value) {
        return this.handleGlobalI18n('campaign', value).substring(0, 1).toUpperCase() + this.handleGlobalI18n('campaign', value).substring(1)
      },
      validateAgeFrom(rule, value, callback) {
        this.validatePositiveInteger(this.dialogData.age_from, callback)
      },
      validateAgeTo(rule, value, callback) {
        this.validateCompare(this.dialogData.age_from, this.dialogData.age_to, callback)
      },
      clickP(val) {
        this.selectDialog = true
        this.profile_type = val
      },
      handleDeleteAge(tag) {
        this.tags.age.splice(this.tags.age.indexOf(tag), 1)
      },
      init() {
        this.dialogData = {
          age_from: '',
          age_to: ''
        }
        this.tags.age = []
        this.select_register_channel_id = [0, 0, 0, 0, 0]
        const info = this.form_data
        const who_definition_list = info.who_definition_list[0]
        this.form = { ...who_definition_list }
        // target
        if (this.form.select_type === 'filter' && this.form.target_criteria.length > 0) {
          const target_criteria = this.form.target_criteria
          for (const obj of target_criteria) {
            var code = obj.criteria_code
            if (obj.criteria_field_code === 'age_from') {
              this.dialogData.age_from = ''
              this.dialogData.age_from = code > 0 ? code : ''
            } else if (obj.criteria_field_code === 'age_to') {
              this.dialogData.age_to = code > 0 ? code : ''
              if (this.dialogData.age_from && this.dialogData.age_to) {
                this.tags.age = []
                this.tags.age.push(`${this.dialogData.age_from}-${this.dialogData.age_to}`)
              }
            }
            if (obj.criteria_field_code === 'register_channel') {
              var value1 = ''
              if (this.form.target_criteria.length > 2) {
                value1 = this.form.target_criteria[2].criteria_value
              } else {
                value1 = this.form.target_criteria[0].criteria_value
              }
              if (this.form.target_criteria[2].criteria_value) {
                this.select_register_channel_id = [0, 0, 0, 0, 0]
                for (var i in this.register_channel_data) {
                  if (value1.indexOf(this.register_channel_data[i].channel_name) > -1) {
                    this.select_register_channel_id[i] = parseInt(i) + 1
                  }
                }
              }
            }
          }
        }
      },
      closeDialog(index) {
        this.$refs['dialog'].validate((valid) => {
          if (valid) {
            this.selectDialog = false
            switch (index) {
              case 'age':
                this.$set(this.tags.age, 0, `${this.dialogData.age_from}-${this.dialogData.age_to}`)
                break
            }
          } else {
            return false
          }
        })
      }
    },
    watch: {
      nonius_id: {
        handler(val) {
          this.init()
        },
        immediate: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .lifecycle-campaign-who-item{
    .el-input-number, .el-select{
      width: 160px;
    }
    .tip{
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      text-align: left;
      margin-left: 12px;
    }
    .p{
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .select-mode{
      margin-top: 17px;
    }
  }
  .target-member-mode {
    margin-top: 40px;
    .t {
      .title {
        min-width: 205px;
        text-align: right;
        color: #888888;
        font-weight: bold;
        font-size: 14px;
        margin-top: 7px;
        margin-right: 14px;
      }
      .title1{
        @extend .title;
        flex:0 0 100%;
        text-align: left;
        margin-bottom:10px;
      }
      display: flex;
      flex:1;
      margin-bottom:18px;
    }
    .t1{
      @extend .t;
      flex-wrap: wrap;
    }
    .ul {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: 10px;
        cursor: pointer;
        margin-bottom: 10px;
        p {
          font-size: 14px;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px dashed rgb(187, 187, 187);
          color: rgb(136, 136, 136);
          background-color: #ffffff;
          z-index:11;
          span {
            padding-right: 3px;
          }
        }
      }
      .check{
        p{
          border-style: solid;
          border-color: $primary;
          color: $primary;
        }
      }
    }
  }
</style>
