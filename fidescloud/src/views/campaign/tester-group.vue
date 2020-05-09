<template>
  <div class="test-group">
    <!--<div class="send-test">-->
      <!--<el-form ref="form" style="display: flex">-->
        <!--<el-form-item label="" @click.native= "dialog_state = true" >-->
          <!--<el-input v-model="group_name" placeholder="Enter phone number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-button type="primary" style="height: 30px;" :loading="send_test_message_statue" @click.stop="handleSendTestMessage()">Send test group</el-button>-->
      <!--</el-form>-->
    <!--</div>-->
    <div class="send-test">
      <el-button type="primary" style="height: 30px;"   @click="dialog_state = true">{{handleGlobalI18n('campaign', 'send_test')}}</el-button>
    </div>
      <el-dialog
        :title="handleGlobalI18n('campaign', 'tester_groups')"
        :visible.sync="dialog_state"
        width="350px"
      >
        <el-select
          v-model="group_list"
          filterable
          multiple
          style="width:300px;"
          :placeholder="handleGlobalI18n('campaign', 'please_select')"
        >
          <el-option
            v-for="item in list"
            :key="item.tester_group_id"
            :label="item.name"
            :value="item.tester_group_id">
          </el-option>
          <div style="text-align: center" >
            <i class="el-icon-loading" v-show="list_loading"></i>
          </div>
        </el-select>
        <div class="button" style="text-align: center; margin-top: 20px;">
          <el-button type="primary" :disabled="group_list.length <=0" style="height: 30px;" :loading="send_test_message_statue" @click.stop="handleSendTestMessage()">{{handleGlobalI18n('campaign', 'send_test_group')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  <script>
    import { getTesterGroupList, sendTesterGroupCommunication } from '@/api/campaign'
    export default{
      props: {
        channel_type: {
          type: String
        },
        template_id: {
          type: Number,
          default: 1
        },
        campaign_type_id: {
          type: Number
        },
        campaign_wizard_id: {
          type: Number
        }
      },
      data() {
        return {
          group_name: '',
          send_test_message_statue: false,
          dialog_state: false,
          group_list: [],
          list: [],
          total_count: 0,
          page: '',
          list_loading: true
        }
      },
      created() {
        this.getTestGroupList()
      },
      methods: {
        // 发送测试消息
        handleSendTestMessage() {
          this.send_test_message_statue = true
          var obj = { channel_type: parseInt(this.channel_type), tester_group_ids: this.group_list, template_id: this.template_id, campaign_type_id: this.campaign_type_id.toString(), campaign_wizard_id: this.campaign_wizard_id.toString() }
          sendTesterGroupCommunication(obj).then(res => {
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            this.dialog_state = false
            this.send_test_message_statue = false
          }).catch(() => {
            this.send_test_message_statue = false
          })
        },
        getTestGroupList() {
          getTesterGroupList().then((res) => {
            this.list_loading = false
            this.list = this.list.concat(res.return_result)
          })
        }
      }
    }
  </script>
  <style scoped lang="scss" rel="stylesheet/scss">
    .send-test{
      .el-input{
        width: 200px;
      }
      .el-button{
        margin-left: 17px;
        width: 145px;
      }
    }
  </style>
