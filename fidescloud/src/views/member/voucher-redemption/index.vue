<template>
  <div class="voucher-redeem">
    <div class="filter-container">
      <el-input style="width: 500px;" class="filter-item" placeholder="Search by member code, mobile and email" v-model="quick_search">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{handleGlobalI18n('member', 'search')}}</el-button>
    </div>
    <div v-loading="listLoading">
      <el-table :data="tableData" border ref="tableData" :empty-text="$t('member.fc_table_no_data_label')">
        <el-table-column prop="member_code" align="center" :label="handleGlobalI18n('member', 'member_code')" width="120" >
          <template slot-scope="scope">
            <div style="cursor:pointer;color:#0099ff" @click="toMemberDetails(scope.row)">
              {{ scope.row.member_code }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="handleGlobalI18n('member', 'name')" prop="full_name" align="center">
          <template slot-scope="scope">
            {{ scope.row.full_name || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" align="center" :label="handleGlobalI18n('member', 'mobile')" >
          <template slot-scope="scope">
            {{ scope.row.mobile || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="birthday" align="center" :label="handleGlobalI18n('member', 'birthday')">
          <template slot-scope="scope">
            {{ globalData.formatDate(scope.row.birthday) || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column
          prop="register_date"
          align="center"
          width="140"
          :label="handleGlobalI18n('member', 'register_date')">
          <template slot-scope="scope">
            {{ scope.row.register_date ? globalData.formatDate((scope.row.register_date).substring(0, 10)) : table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="member_tier_name" align="center" :label="handleGlobalI18n('member', 'tier')" >
          <template slot-scope="scope">
            {{ scope.row.member_tier_name || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="register_store_code" width="165" align="center" :label="handleGlobalI18n('member', 'registration_store_code')" >
          <template slot-scope="scope">
            {{ scope.row.register_store_code || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="register_store_name" align="center" width="145" :label="handleGlobalI18n('member', 'register_store')" >
          <template slot-scope="scope">
            {{ scope.row.register_store_name || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="register_channel_name" align="center" width="155" :label="handleGlobalI18n('member', 'registration_channel')">
          <template slot-scope="scope">
            {{ scope.row.register_channel_resources_key ? $t(`reporting.${scope.row.register_channel_resources_key}`) : (scope.row.register_channel_name ? scope.row.register_channel_name : table_placeholder) }}
          </template>
        </el-table-column>
        <el-table-column prop="register_employee_name" align="center" width="170" :label="handleGlobalI18n('member', 'registration_employee')">
          <template slot-scope="scope">
            {{ scope.row.register_employee_name || table_placeholder }}
          </template>
          <template slot-scope="scope">
            {{ scope.row.register_employee_code || table_placeholder}}
          </template>
        </el-table-column>
      </el-table>
      <pagination-container
        :page = "listQuery.page_no"
        :page_size = 'listQuery.page_size'
        :total = 'total'
        :page_sizes = 'page_sizes'
        @handleCurrentChange = "handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
  </div>
</template>
<!--
  2017
  2018
-->
<script>
  import { queryMemberListBySearch, quickQueryMemberBySearch } from '@/api/member'
  // import { pageLimit } from '@/api/api'
  import PaginationContainer from '@/components/PaginationContainer'
  export default {
    components: {
      PaginationContainer
    },
    data() {
      return {
        page_sizes: [15, 20, 30, 40, 50],
        select_type: 1, // 1是快速查询 2是高级查询
        quick_search: '',
        aq_state: false,
        total: null, /* null */
        total_page: 0,
        tableData: [],
        listLoading: false,
        listQuery: {
          page_size: 15,
          page_no: 1
        },
        showReviewer: '',
        downloadLoading: false,
        advancedData: {}
      }
    },
    created() {
      // this.quick()
    },
    methods: {
      handleCurrentChange(val) {
        // 判断上一次是选择的啥查询
        this.listQuery.page_no = val
        if (this.select_type === 1) {
          this.quick({ search_param: this.quick_search }, val)
        } else {
          this.getList(this.advancedData, val)
        }
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        if (this.select_type === 1) {
          this.quick({ search_param: this.quick_search }, val)
        } else {
          this.getList(this.advancedData, val)
        }
      },
      handleSearch() {
        this.listQuery.page_no = 1
        if (this.quick_search === '') {
          this.$message({
            message: 'Please enter a query condition',
            type: 'warning'
          })
        } else {
          this.quick({ search_param: this.quick_search })
        }
      },
      toMemberDetails(val) {
        this.$router.push({
          query: {
            member_code: val.member_code,
            mobile: val.mobile,
            full_name: val.full_name,
            birthday: this.globalData.formatDate(val.birthday)
          },
          path: `/member/voucher-redeem/point`
        })
      },
      // 快速查询
      quick(form = {}, page_no = null) {
        this.listLoading = true
        quickQueryMemberBySearch({ ...this.listQuery, ...form }).then(res => {
          this.listLoading = false
          const result = res.return_result
          this.tableData = result.members
          this.total = result.total_count
          this.total_page = result.total_page
          this.select_type = 1
        }).catch(() => {
          this.listLoading = false
          if (page_no !== null) {
            this.listQuery.page_no = page_no - 1
          }
        })
      },
      getList(form = {}, page_no = null) {
        this.listLoading = true
        const newObj = {}
        Object.assign(newObj, this.listQuery, form)
        queryMemberListBySearch(newObj).then(response => {
          this.listLoading = false
          this.tableData = response.return_result.members
          this.total = response.return_result.total_count
          this.total_page = response.return_result.total_page
          this.select_type = 2
        }).catch(() => {
          this.listLoading = false
          if (page_no !== null) {
            this.listQuery.page_no = page_no
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .filter-container {
    margin: 20px 0;
  }
  .pagination-container {
    text-align: right;
    padding: 15px 0;
    background-color: #ffffff;
  }

  .filter-item {
    &:not(:first-child) {
      margin: 0 10px;
    }
    input {
      margin-right: 20px;
    }
  }

  .voucher-redeem {
    margin: 0 30px;
  }
</style>
