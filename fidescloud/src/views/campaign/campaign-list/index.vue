<!--campaign list-->
<template>
  <div class="campaign-list">
    <div class="filter-container1">
      <!---->
      <el-input @keyup.enter.native="search(1)" style="width: 400px;" class="filter-item"  :placeholder="$t('campaign.fc_campaign_history_search_input_empty_label')"    v-model="listQuery.campaign_name">
      </el-input>
      <!--Search-->
      <el-button type="primary" icon="el-icon-search" @click="search(1)">{{$t('campaign.fc_campaign_history_btn_search_label')}}</el-button>
      <!--Advanced search-->
      <el-button class="filter-item" type="primary" style="margin-left: 0;" @click="aq_state = !aq_state">{{$t('campaign.fc_campaign_history_btn_advanced_label')}}</el-button>
      <!--Create campaign -->
      <router-link to="/campaign/campaign-setting" tag="span">
        <el-button type="primary">{{$t('campaign.fc_campaign_history_btn_create_label')}}</el-button>
      </router-link>
      <!--Export-->
      <el-button type="primary" @click="exportData" :loading="downloadLoading" icon="el-icon-download">{{$t('campaign.fc_campaign_history_btn_export_label')}}</el-button>
    </div>
    <!--高级搜索-->
    <el-collapse-transition>
      <advanced-query @advanced_search="advanced_search" v-show="aq_state" />
    </el-collapse-transition>
    <div v-loading="loading">
      <el-table :data="tableData" border :empty-text="$t('member.fc_table_no_data_label')">
        <!--Campaign name-->
        <el-table-column :label="$t('campaign.fc_campaign_history_advanced_table_name_label')" align="center" prop="campaign_name">
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.campaign_name || table_placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <!--Campaign type-->
        <el-table-column :label="$t('campaign.fc_campaign_history_advanced_table_type_label')" align="center" prop="campagin_type_name">
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.campagin_type_name || table_placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <!--Campaign create date-->
        <el-table-column prop="campaign_create_date" align="center" :label="$t('campaign.fc_campaign_history_advanced_table_date_label')" width="120">
          <template slot-scope="scope">
            {{globalData.formatDate(scope.row.campaign_create_date ? (scope.row.campaign_create_date).substring(0, 10) : '') || table_placeholder}}
          </template>
        </el-table-column>
        <!--Campaign communication channel-->
        <el-table-column prop="campaign_channel" align="center" :label="$t('campaign.fc_campaign_history_advanced_table_channel_label')">
          <template slot-scope="scope">
            {{scope.row.campaign_channel || table_placeholder}}
          </template>
        </el-table-column>
        <!--Campaign statue-->
        <el-table-column prop="campaign_status" align="center" :label="$t('campaign.fc_campaign_history_advanced_table_status_label')" min-width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.campaign_status === '3'">
              Submitted
            </template>
            <template v-else>
              Save
            </template>
          </template>
        </el-table-column>
        <!--Operation-->
        <el-table-column :label="$t('campaign.fc_campaign_history_advanced_table_operation_label')" align="center" min-width="180">
          <template slot-scope="scope">
            <el-button
              v-if = "scope.row.campaign_status === '3'"
              icon="el-icon-tickets"
              @click="handleEdit(scope.row)">{{$t('campaign.fc_operation_btn_view_labe')}}
            </el-button>
            <el-button
              v-else
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">{{$t('loyalty.fc_operation_btn_edit_label')}}
            </el-button>
            <el-button v-show="scope.row.campaign_status === '3'" @click="clickEffect(scope.row)">{{$t('campaign.fc_operation_btn_view_performance_labe')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ed-pagination :page = "listQuery.page_no" :page_size = 'listQuery.page_size' :total = 'total' @handleCurrentChange = "handleCurrentChange" @handleSizeChange="handleSizeChange" />
    </div>
  </div>
</template>
<script>
  import { pageLimit } from '@/api/api'
  import { queryCampaignListBySearch } from '@/api/campaign'
  import AdvancedQuery from './advanced-query/index'
  import { mapMutations } from 'vuex'
  import { handlePageNoMixins } from '@/utils/util'
  export default {
    mixins: [handlePageNoMixins],
    data() {
      return {
        search_type: 1,
        loading: false,
        downloadLoading: false,
        total: 0, /* null */
        aq_state: false,
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          campaign_name: ''
        },
        tableData: [],
        ad_search_obj: {}
      }
    },
    components: {
      AdvancedQuery
    },
    created() {
      this.getList()
    },
    methods: {
      ...mapMutations({
        setPerformanceParams: 'SET_PERFORMANCE_PARAMS'
      }),
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        let obj = {}
        if (this.search_type === 2) {
          obj = this.ad_search_obj
        }
        this.getList(obj)
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        let obj = {}
        if (this.search_type === 2) {
          obj = this.ad_search_obj
        }
        this.getList(obj)
      },
      advanced_search(formValue) {
        this.search_type = 2
        this.ad_search_obj = formValue
        this.handlePageNo(1)
        this.getList(formValue)
      },
      search(type) {
        this.search_type = type
        this.handlePageNo(1)
        this.getList()
      },
      getList(form = {}) {
        this.loading = true
        var obj = Object.assign({}, this.listQuery, form)
        obj.campaign_name = obj.campaign_name.trim()
        queryCampaignListBySearch(obj).then(response => {
          this.loading = false
          this.tableData = response.return_result.result || []
          this.total = response.return_result.total_count || 0
        }).catch(() => {
          this.loading = false
        })
      },
      clickEffect(obj) {
        this.setPerformanceParams(obj)
        this.$router.push({
          path: `/campaign/campaign-effect/${obj.campaign_code}/${obj.campaign_wizard_id}`
        })
      },
      clickAvdvancedQuery() {
        this.$router.push({
          path: '/campaign/advanced-query'
        })
      },
      handleEdit(obj) {
        // 状态为3的是只能查看不能修改的
        // 其他的跳转到编辑页面
        // var new_obj = Object.assign({}, obj, { campaign_type: obj.campaign_type_code })
        // window.localStorage.spot_cam_info = JSON.stringify(new_obj)
        let path = ''
        if (obj.campaign_status === '3') {
          path = `/campaign/spot-campaign/detail?type=detail&id=${obj.campaign_wizard_id}`
        } else {
          path = `/campaign/spot-campaign/edit?type=edit&id=${obj.campaign_wizard_id}`
        }
        this.$router.push({
          path: path
        })
      },
      exportData() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.handleGlobalI18n('campaign', 'campaign_name'), this.handleGlobalI18n('campaign', 'campaign_type'), this.handleGlobalI18n('campaign', 'creation_date'), this.handleGlobalI18n('campaign', 'campaign_communication_channel'), this.handleGlobalI18n('campaign', 'campaign_status')]
          const filterVal = ['campaign_name', 'campagin_type_name', 'campaign_create_date', 'campaign_channel', 'campaign_status']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${this.handleGlobalI18n('campaign', 'export_filename')}-${Date.parse(new Date())}`,
            autoWidth: 250
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'campaign_status') {
            return v[j] === '3' ? 'Submitted' : 'Save'
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .campaign-list{
    margin:25px;
    .filter-container1 {
      margin: 20px 0;
    }
  }
  .pagination-container {
    text-align: right;
    padding: 15px 0;
    background-color: #ffffff;
  }
</style>
