<!--Draft-->
<template>
  <section class="recurring_campaign__draft">
    <ed-header-title :title="$t('campaign.fc_campaign_spot_draft_section_label')" />
    <div class="recurring-campaign__table">
      <ed-table>
        <el-table :data="table_data" align="center" style="width: 100%" v-loading="table_loading">
          <!--Campaign name-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_draft_table_name_label')" align="center"  prop="campaign_name">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.campaign_name || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Reward type-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_draft_table_type_label')" align="center"  prop="campaign_type_code">
            <template slot-scope="scope">
              {{scope.row.campaign_type_code === 'DEFAULT' ?  table_placeholder : scope.row.campaign_type_code || table_placeholder}}
            </template>
          </el-table-column>
          <!--Estimated audience-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_draft_table_audience_label')" align="center" prop="estimated_audience">
            <template slot-scope="scope">
              {{scope.row.estimated_audience || table_placeholder  }}
            </template>
          </el-table-column>
          <!--Recurrence pattern-->
          <el-table-column align="center" label="Recurrence pattern" prop="send_date">
            <template slot-scope="scope">
              {{scope.row.send_date ? globalData.formatDate( formatTimeStamp(scope.row.send_date).substr(0, 10)) : table_placeholder}}
            </template>
          </el-table-column>
          <!--Send date-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_draft_table_date_label')" align="center" prop="send_date">
            <template slot-scope="scope">
              {{scope.row.send_date ? globalData.formatDate( formatTimeStamp(scope.row.send_date).substr(0, 10)) : table_placeholder}}
            </template>
          </el-table-column>
          <!--Operation-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_draft_table_operation_label')" align="center" prop="address" width="372">
            <template slot-scope="scope">
              <div class="button-list">
                <!--Detail-->
                <div @click="detailRouter(scope.row.campaign_wizard_id)"><ed-operation-button >{{$t('campaign.fc_operation_table_btn_datails_label')}}</ed-operation-button></div>
                <!--Copy-->
                <div @click="copyRouter(scope.row)"><ed-operation-button>{{$t('campaign.fc_operation_table_btn_copy_label')}}</ed-operation-button></div>
                <!--Edit-->
                <div @click="editRouter(scope.row.campaign_wizard_id)"><ed-operation-button >{{$t('campaign.fc_operation_table_btn_edit_label')}}</ed-operation-button></div>
                <!--Delete-->
                <div @click="toDelete(scope.row.campaign_wizard_id)"><ed-operation-button >{{$t('campaign.fc_operation_table_btn_delete_label')}}</ed-operation-button></div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </ed-table>
    </div>
    <ed-pagination
      :page = "list_query.page_no"
      :page_size = 'list_query.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
    ></ed-pagination>
  </section>
</template>
<script>
import { handleCampaignWizardListMixin } from '@/views/data/campaign_wizard_list'
import { operationMixin } from './operation'
import { home_page_display_number } from './data'
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
      type: 1
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
    },
    toDelete(id) {
      this.handleDelete(id).then(res => {
        this.list_query.page_no = 1
        this.getList()
      }).catch(res => {

      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .button-list{
    display: flex;
    .ed-operation-button{
      &:not(first-child){
        margin-left: 8px;
      }
    }
  }
</style>
