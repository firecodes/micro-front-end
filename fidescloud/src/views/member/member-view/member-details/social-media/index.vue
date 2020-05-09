<template>
  <div class="social-media">
    <div style="display: flex;justify-content: space-between">
      <div class="header-top cursor-pointer">
        <back-button></back-button>
      </div>
    </div>
    <br />
    <el-table :data="tableData" v-loading="loading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column prop="sns_type_name" align="center" :label="$t('member.fc_member_details_social_table_media_label')"></el-table-column>
      <el-table-column prop="binding_date" align="center" :label="$t('member.fc_member_details_social_table_date_label')">
        <template slot-scope="scope">
          {{scope.row.binding_date ? globalData.formatDate(scope.row.binding_date.substring(0, 10)) : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="sns_member_account" align="center" :label="$t('member.fc_member_details_social_table_account_label')"></el-table-column>
      <el-table-column align="center" :label="$t('member.fc_member_details_social_table_status_label')">
        <template slot-scope="scope">
         {{ scope.row.binding_status === 1? 'binding': 'unbinding' }}
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
</template>
<script>
  import {
    getMemberSNSList
  } from '@/api/member'
  import {
    loyaltyInfoMixins
  } from '@/utils/util'
  import PaginationContainer from '@/components/PaginationContainer'
  import BackButton from '@/components/BackButton'
  import {
    pageLimit
  } from '@/api/api'
  export default {
    mixins: [loyaltyInfoMixins],
    components: {
      PaginationContainer,
      BackButton
    },
    data() {
      return {
        loading: true,
        sns_binding_type_code: '',
        tableData: [],
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          member_code: ''
        }
      }
    },
    created() {
      this.listQuery.member_code = this.$route.query.member_code
      this.getData()
    },
    methods: {
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getData()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getData()
      },
      getData() {
        this.loading = true
        this.getMemberSNSList()
      },
      getMemberSNSList() {
        getMemberSNSList(Object.assign({}, {
          sns_binding_type_code: this.sns_binding_type_code
        }, this.listQuery)).then(res => {
          this.loading = false
          this.tableData = res.return_result.sns_bindings
          this.total = res.return_result.total_count
        }).catch(res => {
          this.loading = false
        })
      }
    },
    watch: {
      sns_binding_type_code() {
        this.listQuery.page_no = 1
        this.getData()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-form-item{
    margin-bottom: 0!important;
  }
  .social-media {
    margin: 20px 20px;
    .header-top {
      padding:0!important;
      height: 30px !important;
    }
    .account{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom:20px;
    }
    .account-details{
      line-height: 40px;
      .binding_date,.sns-channel{
        height:40px;
        border:1px solid #797979;
        border-left-color: #ffffff;
        background-color: #ffffff;
      }
      .sns-channel{
        border-left:1px solid #797979;
      }
      .key{
        height:38px;
        border-right:1px solid #797979;
        z-index:-1;
        width: 40%;
        text-align: center;
        background-color:#f3f6fb;

      }
    }
    .query_result{
      margin:15px 0;
    }
  }
  @media (max-width: 1024px){
    .binding_date{
      margin-top:10px;
      border-left-color:#797979!important;
    }
  }
</style>
