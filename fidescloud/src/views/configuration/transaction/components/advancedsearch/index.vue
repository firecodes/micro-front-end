<template>
  <div class="advancedWrapper" v-show="active">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="ruleForm" v-loading="loadingAdvanced">
      <el-row class="searchbox">
        <el-form-item :label="$t('configuration.fc_transaction_advanced_code_label')" prop="transactionCode">
          <el-input v-model="ruleForm.transactionCode" />
        </el-form-item>
        <el-form-item :label="$t('configuration.fc_transaction_advanced_type_label')" prop="transactionType">
          <el-select v-model="ruleForm.transactionType" clearable :placeholder="$t('configuration.fc_transaction_advanced_type_input_label')">
            <el-option
              v-for="item in (typeList || [])"
              :key="item.transaction_type_id"
              :label="item.transaction_type_name"
              :value="item.transaction_type_id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--Transaction channel-->
        <el-form-item :label="$t('configuration.fc_transaction_advanced_channel_label')" prop="transactionChannel">
          <el-select v-model="ruleForm.transactionChannel" clearable :placeholder="$t('configuration.fc_transaction_advanced_channel_input_label')">
            <el-option
              v-for="item in (channelList || [])"
              :key="item.channel_code"
              :label="item.resources_key ? $t(`reporting.${item.resources_key}`) : item.channel_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('configuration.fc_transaction_advanced_store_label')" prop="transactionStore">
          <el-select v-selectLoadmore="selectLoadmore" v-model="ruleForm.transactionStore" clearable filterable :placeholder="$t('configuration.fc_transaction_advanced_store_input_label')">
            <el-option
              v-for="item in (storelList || [])"
              :key="item.store_code"
              :label="item.store_name"
              :value="item.store_id">
            </el-option>
            <div style="text-align: center" v-show="loadingStore">
              <i class="el-icon-loading"></i>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('configuration.fc_transaction_advanced_purchased_time_label')" prop="purchasedTime">
          <el-select v-model="ruleForm.purchasedTime" clearable :placeholder="$t('configuration.fc_configuration_select_box_default_label')">
            <el-option
              v-for="item in (purchasedList || [])"
              :key="item.id"
              :label="item.label ? $t(`member.${item.label}`) : item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('configuration.fc_transaction_advanced_member_name_label')" prop="memberName">
          <el-input v-model="ruleForm.memberName"></el-input>
        </el-form-item>
      </el-row>
      <el-form-item class="bottomitem">
        <el-button @click="resetForm('ruleForm')">{{$t('configuration.fc_transaction_advanced_btn_reset_label')}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('configuration.fc_transaction_advanced_btn_search_label')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    props: {
      active: {
        type: Boolean,
        default: false
      },
      typeList: {
        type: Array,
        default: () => []
      },
      channelList: {
        type: Array,
        default: () => []
      },
      storelList: {
        type: Array,
        default: () => []
      },
      loadingStore: {
        type: Boolean,
        default: false
      },
      purchasedList: {
        type: Array,
        default: () => []
      },
      loadingAdvanced: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        ruleForm: {
          transactionCode: '',
          transactionType: '',
          transactionChannel: '',
          transactionStore: '',
          purchasedTime: '',
          memberName: '',
          start_time: '',
          end_time: moment(Date.now()).format('YYYY-MM-DD')
        },
        rules: {}
      }
    },
    methods: {
      selectLoadmore() {
        this.$emit('reGetStore')
      },
      submitForm(formName) {
        this.$refs[formName].validate(() => {
          switch (+this.ruleForm.purchasedTime) {
            case 1:
              this.ruleForm.start_time = moment().subtract(1, 'days').format('YYYY-MM-DD') // 当前时间的前1天时间
              break
            case 2:
              this.ruleForm.start_time = moment().subtract(7, 'days').format('YYYY-MM-DD') // 当前时间的前7天时间
              break
            case 3:
              this.ruleForm.start_time = moment().subtract(30, 'days').format('YYYY-MM-DD')
              break
            case 4:
              this.ruleForm.start_time = moment().subtract(90, 'days').format('YYYY-MM-DD')
              break
            case 5:
              this.ruleForm.start_time = moment().subtract(180, 'days').format('YYYY-MM-DD')
              break
            case 6:
              this.ruleForm.start_time = moment().subtract(12, 'months').format('YYYY-MM-DD')
              break
            case 7:
              this.ruleForm.start_time = moment().subtract(18, 'months').format('YYYY-MM-DD')
              break
            case 8:
              this.ruleForm.start_time = moment().subtract(24, 'months').format('YYYY-MM-DD')
              break
            default:
              this.ruleForm.start_time = this.ruleForm.purchasedTime
              break
          }
          this.ruleForm.transactionCode = this.ruleForm.transactionCode.trim()
          this.ruleForm.memberName = this.ruleForm.memberName.trim()
          this.ruleForm.start_time = moment(new Date(this.ruleForm.start_time)).format('YYYY-MM-DD')
          if (this.ruleForm.start_time === 'Invalid date') {
            this.ruleForm.start_time = ''
            this.ruleForm.end_time = ''
          } else {
            this.ruleForm.end_time = moment(Date.now()).format('YYYY-MM-DD')
          }
          this.$emit('handleAdvancedSearch', this.ruleForm)
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang='scss' scoepd>
.advancedWrapper {
  margin-top: 10px;
  padding-top: 15px;
  background-color: #fff;
  padding-right: 24px;
  padding-bottom: 1px;
  .searchbox {
    display: flex;
    flex-wrap: wrap;
  }
  .ruleForm {
    /deep/ .el-button--default {
      border-color: #2777FF !important;
    }
    /deep/ .el-form-item__label {
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
    .bottomitem {
      /deep/ .el-form-item__content {
        margin-left: 0px !important;
      }
      text-align: center;
    }
    /deep/ .el-select, /deep/ .el-input {
      width: 220px !important;
    }
  }
}
</style>
