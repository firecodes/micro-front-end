<!--
  test campaign dialog
  2020.03.04
-->
<template>
  <div class="test-campaign-dialog">
    <ed-dialog>
      <el-dialog :title="$t('campaign.fc_campaign_spot_test_campaign_title_label')" :visible.sync="dialog" @close="close" @open="init" center class="dialog" width="700px">
        <ed-form>
          <el-form :model="form" :rules="rules" :validate-on-rule-change	="false" label-position="left" label-width="140px" ref="test-dialog">
            <!--Target audience-->
            <el-form-item :label="$t('campaign.fc_campaign_spot_test_campaign_target_label')" prop = 'target_audience'>
              <section class="section">
                <!--上面单选按钮-->
                <div class="test-type">
                  <el-radio-group v-model="form.test_type">
                    <!--From test group-->
                    <el-radio :label="1">{{$t('campaign.fc_campaign_spot_test_campaign_target_group_label')}}</el-radio>
                    <!--Input manually-->
                    <el-radio :label="2">{{$t('campaign.fc_campaign_spot_test_campaign_target_manually_label')}}</el-radio>
                  </el-radio-group>
                </div>
                <!--from test group content----------------------------------------------------------------------------------------->
                <div class="from_test_group__content" v-show="form.test_type === 1">
                  <div class="from_test_group__select">
                    <el-input :placeholder="$t('campaign.fc_campaign_spot_test_target_group_input_label')" style="width: 300px;" v-model="list_query.group_name" />
                    <!--Search-->
                    <el-button @click="handleSearch" class="search" type="primary">{{$t('campaign.fc_campaign_spot_test_target_group_btn_search_label')}}</el-button>
                  </div>
                  <div class="from_test_group__table_data">
                    <ed-table type="1">
                      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')"  :row-key="getRowKeys" @selection-change="handleSelectionChange" header-row-class-name="no-m-s" ref="member_tags_table" style="width: 100%; margin-bottom: 13px;" v-loading="init_loading">
                        <!--multiple select-->
                        <el-table-column :reserve-selection="true" align="center" type="selection" width="60" />
                        <!--Test group name-->
                        <el-table-column :label="$t('campaign.fc_campaign_spot_test_target_group_table_name_label')" align="center"  min-width="110px" prop="group_name">
                          <template slot-scope="scope">
                            <ed-clamp :max-lines="1" autoresize>{{scope.row.group_name || table_placeholder}}</ed-clamp>
                          </template>
                        </el-table-column>
                        <!--Description-->
                        <el-table-column :label="$t('campaign.fc_campaign_spot_test_target_group_table_desc_label')" align="center"  prop="group_description">
                          <template slot-scope="scope">
                            <ed-clamp :max-lines="1" autoresize>{{scope.row.group_description || table_placeholder}}</ed-clamp>
                          </template>
                        </el-table-column>
                        <!--Contact list-->
                        <el-table-column :label="$t('campaign.fc_campaign_spot_test_target_group_table_list_label')" align="center" prop="contact_list">
                          <template slot-scope="scope">
                            <ed-clamp :max-lines="1" autoresize>{{scope.row.contact_list || table_placeholder}}</ed-clamp>
                          </template>
                        </el-table-column>
                      </el-table>
                    </ed-table>
                    <ed-pagination
                      :page = "list_query.page_no"
                      :page_size = 'list_query.page_size'
                      :total = 'list_query_total'
                      @handleCurrentChange = "handleCurrentChange"
                    />
                  </div>
                </div>
                <!--input manually content----------------------------------------------------------------------------------------->
                <div class="input_manually__contact_list" v-show="form.test_type === 2">
                  <el-tooltip class="tooltip" effect="light" placement="bottom">
                    <!--<template v-slot:content>-->
                    <template #content>
                      <p v-html="$t('campaign.fc_campaign_spot_test_target_manually_email_tips_label')" v-if="communication_channels.communication_channel_code !== '1'" />
                      <p v-else v-html="$t('campaign.fc_campaign_spot_test_target_manually_sms_tips_label')" />
                    </template>
                    <svg-icon class-name='tishi-i' icon-class="tishi-i"/>
                  </el-tooltip>
                  <el-form-item :label="$t('campaign.fc_campaign_spot_test_target_manually_contact_label')" label-width="105px" prop = 'contact_list'>
                    <el-input maxlength="4000" rows="6" type="textarea" v-model="form.contact_list"/>
                  </el-form-item>
                </div>
                <!--Estimated audience------------------------------------------------------------------------------------------>
                <div class="from_test_group__estimated_audience">
                  <svg-icon class-name='tishi-i' icon-class="tishi-i"/>
                  <!--Estimated audience------------------------------------------------------------------------------------------->
                  <label>{{$t('campaign.fc_campaign_spot_test_campaign_target_estimated_label')}}</label>
                  <span>{{ form.test_type === 2 ? estimated_audience_2 : estimated_audience_1}}</span>
                </div>
              </section>
            </el-form-item>
            <!--Confirm-->
            <div class="from_test_group__button" style="text-align: center;">
              <!--Cancel-->
              <el-button @click="dialog = false" class="cancel-button">{{$t('campaign.fc_campaign_spot_test_campaign_btn_cancel_label')}}</el-button>
              <!--Test campaign-->
              <el-button :loading="loading" @click="handleTestCampaign" class="confirm-button" type="primary">{{$t('campaign.fc_campaign_spot_test_campaign_btn_test_label')}}</el-button>
            </div>
          </el-form>
        </ed-form>
      </el-dialog>
    </ed-dialog>
  </div>
</template>
<script>
import { campaignTestHistorySend, groupList } from '@/api/testGroup'
import { RegExp } from '@/utils/RegExp'
export default {
  props: {
    test_dialog: {
      type: Boolean,
      default: false
    },
    communication_channels: {
      type: Object
    },
    id: {
      type: Number | String
    }
  },
  data() {
    return {
      loading: false,
      estimated_audience_1: 0,
      estimated_audience_2: 0,
      dialog: false,
      rules: {
        target_audience: [{ required: true, trigger: ['change'] }]
      },
      form: {
        test_type: 1,
        select_list: [],
        target_audience: '1',
        contact_list: ''
      },
      table_data: [],
      list_query: {
        page_no: 1,
        page_size: 5,
        asc: false,
        group_name: ''
      },
      list_query_total: 0,
      init_loading: true
    }
  },
  watch: {
    dialog(value) {
      this.$emit('handleClickTestDialog', value)
    },
    test_dialog(value) {
      this.dialog = value
    },
    communication_channels() {
      this.init()
    },
    'form.test_type': {
      handler() {
        if (this.form.test_type === 1) {
          this.rules = {
            target_audience: [{ required: true, trigger: ['change'] }]
          }
        } else {
          this.rules = {
            target_audience: [{ required: true, trigger: ['change'] }],
            contact_list: [
              { required: true, trigger: ['change'], message: this.$t('campaign.fc_campaign_spot_create_when_period_warning_label') },
              { validator: this.checkContactList, trigger: ['blur'] }
            ]
          }
        }
      }
    }
  },
  methods: {
    close() {
      this.estimated_audience_1 = 0
      this.estimated_audience_2 = 0
      this.form = {
        test_type: 1,
        select_list: [],
        target_audience: '1',
        contact_list: ''
      }
      this.$refs.member_tags_table.clearSelection()
      this.$refs['test-dialog'].resetFields()
    },
    checkContactList(rule, value, callback) {
      if (!value) {
        return callback(new Error(this.$t('campaign.fc_campaign_spot_create_when_period_warning_label')))
      }
      // 验证邮箱
      const reg = RegExp.email
      // 验证数字
      const reg1 = RegExp.area_code_contact_type
      const arr = this.form.contact_list.split(/[,，]/)
      // var reg2 = /^\s|\s$/g
      for (let item of arr) {
        item = item.trim()
        // 验证这里 除了验证电话和邮件格式是否正确外
        if (this.communication_channels.communication_channel_code === '1') {
          // 数字
          if (!reg1.test(item)) {
            return callback(new Error(this.handleGlobalI18n('validation', 'correct_mobile')))
          }
        } else {
          if (!reg.test(item)) {
            return callback(new Error(this.handleGlobalI18n('validation', 'correct_email')))
          }
        }
      }
      this.estimated_audience_2 = arr.length
      callback()
    },
    handleSearch() {
      this.list_query.page_no = 1
      this.init()
    },
    init() {
      this.init_loading = true
      const channel_code = this.communication_channels.communication_channel_code
      if (channel_code) {
        groupList(Object.assign({ communication_channel_type: parseInt(channel_code || 0) }, this.list_query)).then(res => {
          const result = res.return_result
          this.table_data = result.results || []
          this.list_query_total = result.total_count || 0
          this.init_loading = false
        }).catch(() => {
          this.init_loading = false
        })
      } else {
        this.init_loading = false
      }
    },
    getRowKeys(row) {
      return row.id
    },
    handleSelectionChange(rows) {
      this.form.select_list = []
      // 计算预估发送人数
      this.estimated_audience_1 = 0
      for (const item of rows) {
        const arr = item.contact_list ? item.contact_list.split(/[,，]/) : []
        this.estimated_audience_1 += arr.length
        this.form.select_list.push(item.id)
      }
    },
    handleCurrentChange(val) {
      this.list_query.page_no = val
      this.init()
    },
    handleTestCampaign() {
      const communication_channels = this.communication_channels
      if (!communication_channels) {
        return false
      }
      this.$refs['test-dialog'].validate(valid => {
        if (valid) {
          const obj = {
            campaign_wizard_id: parseInt(this.id),
            communication_channel_type: parseInt(communication_channels.communication_channel_code || 0),
            'template_id': parseInt(communication_channels.communication_template_id)
          }
          let params = {}
          if (this.form.test_type === 1) {
            if (this.form.select_list.length <= 0) {
              this.$message.error('Please select test group')
              return false
            }
            params = Object.assign({ 'test_groups': this.form.select_list }, obj)
          } else if (this.form.test_type === 2) {
            params = Object.assign({ 'contact_list': this.form.contact_list }, obj)
          }
          this.loading = true
          campaignTestHistorySend(params).then(() => {
            // close dialog, then refresh
            this.dialog = false
            this.loading = false
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            this.$emit('refreshTestList', (new Date()).valueOf())
          }).catch(res => {
            this.loading = false
            this.$message.error(res)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .test-campaign-dialog{
    /deep/ .no-m-s .el-checkbox {
      display: none;
    }
    .ed-form{
      margin: -10px 0 -5px 0;
    }
    .svg-icon{
      font-size: 18px;
    }
    .from_test_group{
      &__content{
        margin-top: 20px;
        .search{
          margin-left: 8px;
          background-color: $new-primary;
        }
      }
      &__table_data{
        margin-top: 15px;
      }
      &__estimated_audience{
        margin-top: -10px;
        .svg-icon{
          font-size: 18px;
          margin-right: 8px;
        }
        label, span{
          font-size:14px;
          font-family:Helvetica-medium-1;
          font-weight:500;
          color:rgba(51,51,51,1);
        }
        span{
          padding-left: 20px;
        }
      }
      &__button{
        .cancel-button{
          border-color: $new-primary;
          color: $new-primary;
          min-width: 88px;
          background-color: #ffffff;
        }
        .confirm-button{
          background-color: $new-primary;
        }
      }
    }
    .input_manually{
      &__contact_list{
        display: flex;
        margin: 20px 0;
        /deep/ .el-form-item__label {
          line-height: 18px;
        }
        .el-form-item{
          flex: 1;
        }
        .tooltip{
          margin-right: 8px;
        }
      }
    }
  }
</style>
