<!--Ongoing-->
<template>
  <section class="spot_campaign__ongoing">
    <ed-header-title :title="$t('campaign.fc_campaign_spot_ongoing_section_label')" />
    <div class="spot-campaign__table">
      <ed-table>
        <el-table :data="table_data" style="width: 100%" v-loading="table_loading">
          <!--#-->
          <el-table-column align="center" label="#" width="60">
            <template slot-scope="scope">
              {{(list_query.page_no - 1) * list_query.page_size + scope.$index + 1}}
            </template>
          </el-table-column>
          <!--Campaign name-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_ongoing_table_name_label')" align="center"  prop="campaign_name">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.campaign_name || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Reward type-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_ongoing_table_type_label')" align="center"  prop="campaign_type_code">
            <template slot-scope="scope">
              {{scope.row.campaign_type_code || table_placeholder}}
            </template>
          </el-table-column>
          <!--Estimated audience-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_ongoing_table_audience_label')" align="center" prop="estimated_audience">
            <template slot-scope="scope">
              {{scope.row.estimated_audience || table_placeholder  }}
            </template>
          </el-table-column>
          <!--Send date-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_ongoing_table_date_label')" align="center" prop="send_date">
            <template slot-scope="scope">
              {{scope.row.send_date ? globalData.formatDate( formatTimeStamp(scope.row.send_date).substr(0, 10)) : table_placeholder}}
            </template>
          </el-table-column>
          <!--Operation-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_ongoing_table_operation_label')" align="center" prop="address" width="195">
            <template slot-scope="scope">
              <div class="button-list">
                <!--Details-->
                <div @click="detailRouter(scope.row.campaign_wizard_id)"><ed-operation-button >{{$t('campaign.fc_operation_table_btn_datails_label')}}</ed-operation-button></div>
                <!--Copy-->
                <div @click="copyRouter(scope.row)"><ed-operation-button>{{$t('campaign.fc_operation_table_btn_copy_label')}}</ed-operation-button></div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </ed-table>
    </div>
    <ed-pagination :page = "list_query.page_no" :page_size = 'list_query.page_size' :total = 'total' @handleCurrentChange = "handleCurrentChange" />
  </section>
</template>
<script>
  import { handleCampaignWizardListMixin } from '@/views/data/campaign_wizard_list'
  import { home_page_display_number } from './data'
  import { operationMixin } from './operation'
  export default {
    mixins: [handleCampaignWizardListMixin, operationMixin],
    data() {
      return {
        table_loading: true,
        table_data: [],
        list_query: {
          page_no: 1,
          page_size: home_page_display_number
        },
        total: 0,
        type: 2
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.table_loading = true
        this.handleGetCampaignWizardList(this.type, this.list_query.page_no).then(res => {
          this.total = res.total_count || 0
          this.table_data = res.list || []
          this.table_loading = false
        }).catch(res => {
          this.table_loading = false
          this.$message.error(res)
        })
      },
      handleCurrentChange(page) {
        this.list_query.page_no = page
        this.getList()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .button-list{
    display: flex;
    .ed-operation-button{
      &:not(first-child){
        margin-left: 8px;
      }
    }
  }
</style>
