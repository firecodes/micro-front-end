<template>
  <div class="campaign">
    <div class="header-top cursor-pointer" @click.stop="goBack">
      <back-button></back-button>
    </div>
    <div class="check">
      <div class="margin">
        <el-form :inline="true" label-width="160px">
          <el-form-item :label="$t('member.fc_member_details_campaign_date_label')">
            <eldate-picker :value="date" @valueDate="valueDate"></eldate-picker>
          </el-form-item>
          <el-form-item :label="$t('member.fc_member_details_campaign_type_label')">
            <el-select v-model="campaign_type_code" clearable :placeholder="$t('member.fc_member_details_campaign_type_input_label')">
              <el-option :label="$t('member.fc_member_details_campaign_type_menu1_label')" value="multiple_points"></el-option>
              <el-option :label="$t('member.fc_member_details_campaign_type_menu2_label')" value="coupon"></el-option>
              <el-option :label="$t('member.fc_member_details_campaign_type_menu3_label')"  value="gwp"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click = "search">{{$t('member.fc_member_details_campaign_btn_search_label')}}</el-button>
            <el-button @click="cancel">{{$t('member.fc_member_details_campaign_btn_reset_label')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <p class="query_result">{{$t('member.fc_member_details_campaign_result_title')}}</p>
    <div v-loading = "loading">
      <el-table :data="tableData"  border :empty-text="$t('member.fc_table_no_data_label')">
        <el-table-column prop="campaign_code" align="center" :label="$t('member.fc_member_details_campaign_table_code_label')">
          <template slot-scope="scope">
            {{scope.row.campaign_code || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="campaign_name" align="center" :label="$t('member.fc_member_details_campaign_table_name_label')">
          <template slot-scope="scope">
            {{scope.row.campaign_name || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="campaign_type_name" align="center" :label="$t('member.fc_member_details_campaign_table_type_label')">
          <template slot-scope="scope">
            {{scope.row.campaign_type_name || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="participation_date" align="center" :label="$t('member.fc_member_details_campaign_table_date_label')">
          <template slot-scope="scope">
            {{ globalData.formatDate((scope.row.participation_date).substring(0, 10)) || table_placeholder }}
          </template>
        </el-table-column>
      </el-table>
      <pagination-container
        :page = "listQuery.page_no"
        :page_size = 'listQuery.page_size'
        :total = 'total'
        @handleCurrentChange = "handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination-container>
    </div>
  </div>
</template>
<script>
  import {
    queryMemberCampaignListBySearch
  } from '@/api/member'
  import EldatePicker from '@/components/EldatePicker'
  import PaginationContainer from '@/components/PaginationContainer'
  import BackButton from '@/components/BackButton'
  import {
    pageLimit
  } from '@/api/api'
  export default {
    components: {
      BackButton,
      EldatePicker,
      PaginationContainer
    },
    data() {
      return {
        date: [],
        date_from: '',
        date_to: '',
        campaign_type_code: '',
        tableData: [],
        total: 0,
        listQuery: {
          page_no: 1,
          page_size: pageLimit
        },
        loading: true
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        this.loading = true
        this.queryMemberCampaignListBySearch()
      },
      queryMemberCampaignListBySearch() {
        queryMemberCampaignListBySearch(Object.assign({
          member_code: this.$route.query.member_code,
          create_date_from: this.date_from,
          create_date_to: this.date_to,
          campaign_type_code: this.campaign_type_code
        }, this.listQuery)).then(res => {
          this.loading = false
          this.tableData = res.return_result.member_campaigns
          this.total = res.return_result.total_count
        }).catch(res => {
          this.loading = false
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getData()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getData()
      },
      valueDate(val) {
        [this.date_from, this.date_to] = val
      },
      search() {
        this.listQuery.page_no = 1
        this.getData()
      },
      cancel() {
        [this.date, this.campaign_type_code] = [[], '']
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .campaign {
    margin: 20px 20px;
    .header-top {
      padding:0!important;
      height: 30px !important;
    }
    .check{
      background-color:#f9f9f9;
      margin-top:20px;
      .margin{
        padding:12px 0 0 0;
      }
    }
    .query_result{
      margin:15px 0;
    }
  }
</style>
