<!--
  Test history
  2020/03/04
-->
<template>
  <div class="spot_campaign_detail__test_history">
    <ed-header-title :title="$t('campaign.fc_campaign_spot_details_module_test_label')" />
    <ed-table v-loading="loading">
      <el-table :data="table_data" style="width: 100%;">
        <!--Send time-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_test_table_time_label')" align="center"  prop="send_time">
          <template slot-scope="scope">
            {{formatTimeStamp(scope.row.send_time || '') }}
          </template>
        </el-table-column>
        <!--Communication channel-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_test_table_channel_label')" align="center" prop="communication_channel">
          <template slot-scope="scope">
            {{scope.row.communication_channel || table_placeholder}}
          </template>
        </el-table-column>
        <!--Test group-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_test_table_group_label')" align="center" prop="test_group">
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.test_group_name || 'Customized'}}</ed-clamp>
          </template>
        </el-table-column>
        <!--Title-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_test_table_title_label')" align="center" prop="title">
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.title || table_placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <!--Content-->
<!--        <el-table-column :label="$t('campaign.fc_campaign_spot_test_table_content_label')" align="center" prop="content">-->
<!--          <template slot-scope="scope">-->
<!--            <ed-clamp :max-lines="1" autoresize>{{scope.row.content || table_placeholder}}</ed-clamp>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <!--Result-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_test_table_result_label')" align="center" prop="result">
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{(scope.row.success_count || table_placeholder) + ' / ' + (scope.row.total_count || 0)}}</ed-clamp>
          </template>
        </el-table-column>
        <!--Operation-->
        <el-table-column :label="$t('campaign.fc_campaign_spot_test_table_operation_label')" align="center" prop="total_cost">
          <template slot-scope="scope">
            <!--Details-->
            <div @click="handleClickDetail(scope.row)"><ed-operation-button >{{$t('campaign.fc_campaign_spot_test_table_btn_details_label')}}</ed-operation-button></div>
          </template>
        </el-table-column>
      </el-table>
    </ed-table>
    <ed-pagination
      :page = "list_query_history.page_no"
      :page_size = 'list_query_history.page_size'
      :total = 'list_query_history.total_count'
      @handleCurrentChange = "handleCurrentChangeHistory"
    />
    <!--show test campaign detail dialog-->
    <div class="test-campaign-detail-dialog">
      <ed-dialog>
        <el-dialog :title="$t('campaign.fc_campaign_spot_test_popup_title_label')" :visible.sync="dialog" center class="dialog" width="700px">
          <div class="dialog__content" v-loading="table_loading">
            <ul>
              <!--Send time-->
              <li>
                <label>{{$t('campaign.fc_campaign_spot_test_details_time_label')}}</label>
                <span>{{formatTimeStamp(detail.send_time)}}</span>
              </li>
              <!--Type-->
              <li>
                <label>{{$t('campaign.fc_campaign_spot_test_details_channel_label')}}</label>
                <span>{{detail.communication_channel}}</span>
              </li>
              <!--Test group-->
              <li>
                <label>{{$t('campaign.fc_campaign_spot_test_details_group_label')}}</label>
                <span>{{detail.test_group_name || 'Customized'}}</span>
              </li>
              <!--Title-->
              <li>
                <label>{{$t('campaign.fc_campaign_spot_test_details_title_label')}}</label>
                <span>{{detail.title}}</span>
              </li>
              <!--Content-->
              <li>
                <label>{{$t('campaign.fc_campaign_spot_test_details_content_label')}}</label>
                <span v-if="detail.communication_channel !== 'EDM'"><ed-clamp :max-lines="1" autoresize>{{detail.content}}</ed-clamp></span>
                <span v-else>
                  <div class="content" style="width: 476px;">
                    <el-scrollbar style="height:100%; width: 100%">
                      <p class="html" v-html="detail.content || table_placeholder" />
                    </el-scrollbar>
                  </div>
                </span>
              </li>
              <!--Result-->
              <li>
                <label>{{$t('campaign.fc_campaign_spot_test_details_result_label')}}</label>
                <span>{{(detail.success_count || 0) + ' / ' + (detail.total_count || 0)}}</span>
              </li>
            </ul>
            <ed-table type="1">
              <el-table :data="table_data_detail" style="width: 100%;">
                <!--#-->
                <el-table-column :label="$t('campaign.fc_campaign_spot_test_details_table_num_label')" align="center" width="60">
                  <template slot-scope="scope">
                    {{(list_query.page_no - 1) * list_query.page_size + scope.$index + 1}}
                  </template>
                </el-table-column>
                <!--Mobile-->
                <el-table-column :label="$t(`campaign.${handleAddressTitle()}`)" align="center"  prop="mobile">
                  <template slot-scope="scope">
                    {{scope.row.address || table_placeholder}}
                  </template>
                </el-table-column>
                <!--Status-->
                <el-table-column :label="$t('campaign.fc_campaign_spot_test_details_table_status_label')" align="center" prop="status">
                  <template slot-scope="scope">
                    <label class="status_suc" v-if="scope.row.status === 1">Succeed</label>
                    <label class="status_fail" v-else-if="scope.row.status === 2">Failure</label>
                    <label class="status_fail" v-else>To be sent</label>
                  </template>
                </el-table-column>
              </el-table>
            </ed-table>
            <ed-pagination
              :page = "list_query.page_no"
              :page_size = 'list_query.page_size'
              :total = 'list_query_total'
              @handleCurrentChange = "handleCurrentChange1"
            />
            <div class="dialog_close">
              <el-button @click="dialog = false" type="primary">{{$t('campaign.fc_campaign_spot_test_popup_btn_close_label')}}</el-button>
            </div>
          </div>
        </el-dialog>
      </ed-dialog>
    </div>
  </div>
</template>
<script>
  const moment = require('moment')
  import { campaignTestHistoryList, campaignTestHistoryDetail } from '@/api/testGroup'
  export default {
    props: {
      id: {
        type: Number | String
      },
      refresh_test_list_val: {
        type: Number
      }
    },
    watch: {
      refresh_test_list_val() {
        this.init()
      }
    },
    data() {
      return {
        dialog_loading: true,
        list_query_history: {
          page_no: 1,
          page_size: 5,
          total_count: 0,
          asc: false
        },
        dialog: false,
        table_data: [],
        table_data_detail: [],
        table_loading: false,
        loading: false,
        list_query: {
          asc: false,
          history_id: null,
          page_no: 1,
          page_size: 5
        },
        list_query_total: 0,
        detail: {}
      }
    },
    created() {
      this.init()
    },
    methods: {
      handleAddressTitle() {
        if (this.detail.communication_channel === 'SMS') {
          return 'fc_campaign_spot_test_details_table_mobile_label'
        } else {
          return 'Email'
        }
      },
      formatTimeStamp(dataStr) {
        if (dataStr) {
          const _this = this.globalData.value
          const date_format = _this.date_time_format.substring(0, 10).toUpperCase() + ' ' + _this.date_time_format.substring(12, 19)
          return moment(dataStr).format(date_format)
        } else {
          return '-'
        }
      },
      handleCurrentChangeHistory(val) {
        this.list_query_history.page_no = val
        this.init()
      },
      handleCurrentChange1(val) {
        this.list_query.page_no = val
        this.handleTestGroupDetailList()
      },
      handleClickDetail(item) {
        this.list_query.history_id = item.id
        this.handleTestGroupDetailList()
      },
      handleTestGroupDetailList() {
        this.dialog = true
        this.table_loading = true
        // 调用获取详情接口
        campaignTestHistoryDetail(this.list_query).then(res => {
          this.table_loading = false
          const result = res.return_result
          this.detail = result
          this.table_data_detail = result.results
          this.list_query_total = result.total_count
        }).catch(res => {
          this.table_loading = false
          this.$message.error(res)
        })
      },
      init() {
        this.loading = true
        campaignTestHistoryList(Object.assign({ campaign_wizard_id: parseInt(this.id) }, this.list_query_history)).then(res => {
          const results = res.return_result
          this.table_data = results.results || []
          this.list_query_history.total_count = results.total_count || 0
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign_detail__test_history{
    .html{
      /deep/ img{
        width: 100%;
        height: auto;
      }
    }
    .content{
      overflow-y: hidden;
      height: 200px;
      border: 1px solid #e6e6e6;
      padding: 2%;
      background: #ffffff;
      label{
        color: #000;
        font-size: 14px;
        font-weight: bold;
      }
      p{
        line-height: 1.3;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: left;
      }
      .center{
        display: flex;
        label{
          display: block;
          width: 35%;
          text-align: left;
        }
      }
      .subject{
        margin-top: 3px;
      }
      .line{
        margin: 8px 0;
        width: 100%;
        border-top: 1px solid rgba(187, 187, 187, 1);
      }
    }
    .dialog{
      .dialog_close{
        text-align: center;
        margin-top: 14px;
        margin-bottom: 20px;
        .el-button{
          min-width: 88px;
          background-color: $new-primary;
        }
      }
      .status_suc ,.status_fail{
        font-size:14px;
        font-family: HelveticaNeue1;
        color:rgba(26,188,156,1);
      }
      .status_fail{
        color: #D50000;
      }
      &__content{
        margin: -25px -25px -30px;
        ul{
          margin: 0 20px 10px 20px;
        }
        li{
          min-height: 40px;
          line-height: 40px;
          font-size:14px;
          display: flex;
          align-items: center;
          label{
            min-width: 160px;
            display: block;
            font-family: Helvetica-medium-1;
            font-weight: 500;
            color:rgba(153,153,153,1);
            margin-right: 24px;
          }
          span{
            font-size:14px;
            font-family: HelveticaNeue1;
            color:rgba(51,51,51,1);
          }
        }
      }
    }
  }
</style>
