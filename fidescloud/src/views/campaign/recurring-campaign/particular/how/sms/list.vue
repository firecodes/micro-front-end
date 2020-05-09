<!--SMS List 2020/01/10-->
<template>
  <div class="sms_list" ref="ListComponent">
    <div v-loading="list_loading">
      <ed-table class="box-shadow-none">
        <el-checkbox-group v-model="check_arr">
          <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')"  highlight-current-row size="medium">
            <el-table-column align="center" label=" " width="90">
              <template slot-scope="scope">
                <el-checkbox :label="scope.row"></el-checkbox>
              </template>
            </el-table-column>
            <!--Channel-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_how_sms_table_channel_label')" align="center">
              <template slot-scope="scope">
                SMS
              </template>
            </el-table-column>
            <!--Content-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_how_sms_table_content_label')" align="center">
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.content || table_placeholder}}</ed-clamp>
              </template>
            </el-table-column>
            <!--Creation date-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_how_sms_table_create_label')" align="center">
              <template slot-scope="scope">
                {{scope.row.create_date ? globalData.formatDate( formatTimeStamp(scope.row.create_date).substr(0, 10)) : table_placeholder}}
              </template>
            </el-table-column>
            <!--Last updated date-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_how_sms_table_update_label')" align="center" prop="effective_from">
              <template slot-scope="scope">
                {{scope.row.modify_date ? globalData.formatDate( formatTimeStamp(scope.row.modify_date).substr(0, 10)) : table_placeholder}}
              </template>
            </el-table-column>
            <!--Operation-->
            <el-table-column :label="$t('campaign.fc_campaign_spot_create_how_sms_table_operation_label')" align="center" width="200px">
              <template slot-scope="scope">
                <div class="operation">
                  <!--Edit-->
                  <label @click="handleEditTemplate(scope.row)">{{$t('campaign.fc_campaign_spot_create_how_sms_btn_edit_label')}}</label>
                  <!--Delete-->
                  <label @click="handleDelete(scope.row.id)">{{$t('campaign.fc_campaign_spot_create_how_sms_btn_delete_label')}}</label>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </ed-table>
    </div>
    <pagination-container
        :page = "list_query.page_no"
        :page_size = 'list_query.page_size'
        :total = 'total'
        @handleCurrentChange = "handleCurrentChange"
      ></pagination-container>
    <add-sms />
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { handleCommunicationTemplateListMixin } from '@/views/data/communication-template'
  import AddSms from './add'
  import { operationMixin } from '../operation'
  const moment = require('moment')
  export default {
    mixins: [handleCommunicationTemplateListMixin, operationMixin],
    components: {
      PaginationContainer,
      AddSms
    },
    props: {
      form_data: {
        type: Object
      },
      channel_type_id: {
        type: Number
      },
      channel_value: {
        type: String,
        default: ''
      },
      refresh_template: {
        type: Boolean,
        default: false
      },
      select_obj: {
        type: Object
      }
    },
    watch: {
      select_obj: {
        handler() {
          this.init()
        },
        deep: true,
        immediate: true
      },
      refresh_template() {
        this.handleCurrentChange(1)
      },
      check_arr: {
        handler: function() {
          if (this.check_arr.length >= 2) {
            var arr = this.check_arr[1]
            this.check_arr = []
            this.check_arr.push(arr)
          }
          this.$emit('handleCheckBox', this.check_arr[0] || {})
        },
        deep: true
      }
    },
    data() {
      return {
        list_loading: true, // 123
        check_arr: [],
        table_data: [],
        type_id: 2,
        list_query: {
          page_no: 1,
          page_size: 4
        },
        total: 0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      init() {
        if (Object.keys(this.select_obj).length > 0 && this.table_data.length > 0) {
          for (var item of this.table_data) {
            if (item.id === this.select_obj.id) {
              // this.check_arr[0] = item
              this.$set(this.check_arr, 0, item)
              break
            }
          }
        }
      },
      formatTimeStamp(dataStr, pattern = 'YYYY-MM-DD') {
        if (dataStr) {
          return moment(dataStr).format(pattern)
        } else {
          return '-'
        }
      },
      handleEditTemplate(row) {
        this.$emit('handleEditTemplate', row, 'SMS')
      },
      getList() {
        this.list_loading = true
        this.handleGetCommunicationTemplateList(this.channel_value, this.list_query.page_no, this.list_query.page_size).then(res => {
          this.table_data = res.list
          this.init()
          this.total = res.count
          this.list_loading = false
        }).catch(res => {
          this.list_loading = false
        })
      },
      handleCurrentChange(val) {
        this.list_query.page_no = val
        this.getList()
      },
      handleDelete(id) {
        var obj = {
          communication_template_id: id,
          communication_channel_type: this.channel_value,
          campaign_type_id: this.form_data.campaign_type_code,
          communication_channel_type_id: this.channel_type_id
        }
        this.handleDeleteTemplate(obj).then(res => {
          this.handleCurrentChange(1)
        }).catch(res => {
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .sms_list {
    .box-shadow-none{
      box-shadow: none!important;
    }
    /deep/ .el-radio__label{
      display: none;
    }
    .operation{
      display: flex;
      font-size:14px;
      font-weight:bold;
      color:rgba(39,119,255,1);
      line-height:17px;
      align-items: center;
      label{
        &:not(:nth-child(1)) {
          margin-left: 8px;
        }
        min-width:80px;
        height:30px;
        background:rgba(74,144,226,0.07);
        border-radius:4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover{
          border:1px solid $new-primary;
        }
      }
    }
  }
</style>
