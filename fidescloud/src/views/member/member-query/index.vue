<template>
  <div class="member-view">
    <div class="filter-container">
      <el-input style="width: 500px;" class="filter-item" :placeholder="$t('member.fc_member_query_input_empty_tips')" v-model="quick_search">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('member.fc_member_query_btn_search_label')}}</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" style="margin-left:0;margin-right: 0" @click="aq_state=!aq_state">
        {{$t('member.fc_member_query_btn_advanced_label')}}
      </el-button>
    </div>
    <el-collapse-transition>
      <advanced-query
        v-show="aq_state"
        @advanced_search="advanced_search"
      />
    </el-collapse-transition>
    <div v-loading="listLoading">
      <el-table :data="tableData" border ref="tableData" :empty-text="$t('member.fc_table_no_data_label')">
        <!--member code-->
        <el-table-column prop="member_code" align="center" width="130" :label="$t('member.fc_member_query_table_code_label')">
          <template slot-scope="scope">
            <div style="cursor:pointer;color:#0099ff" @click="toMemberDetails(scope.row.member_code)">
              {{ scope.row.member_code }}
            </div>
          </template>
        </el-table-column>
        <!--register date-->
        <el-table-column
          prop="register_date"
          align="center"
          :label="$t('member.fc_member_query_table_register_date_label')" width="140">
          <template slot-scope="scope">
            {{ scope.row.register_date ? globalData.formatDate((scope.row.register_date).substring(0, 10)) : table_placeholder }}
          </template>
        </el-table-column>
        <!--member name-->
        <el-table-column :label="$t('member.fc_member_query_table_name_label')" prop="full_name" align="center">
          <template slot-scope="scope">
            {{ scope.row.full_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--mobile-->
        <el-table-column prop="mobile" align="center" :label="$t('member.fc_member_query_table_mobile_label')" >
          <template slot-scope="scope">
            {{ scope.row.mobile || table_placeholder }}
          </template>
        </el-table-column>
        <!--tier-->
        <el-table-column prop="member_tier_name" align="center" :label="$t('member.fc_member_query_table_tier_label')" >
          <template slot-scope="scope">
            {{ scope.row.member_tier_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--point-->
        <el-table-column prop="member_tier_name" align="center" :label="handleGlobalI18n('member', 'point')" >
          <template slot-scope="scope">
            {{ scope.row.point || 0 }}
          </template>
        </el-table-column>
        <!--birthday-->
        <el-table-column prop="birthday" align="center" :label="$t('member.fc_member_query_table_birthday_label')">
          <template slot-scope="scope">
            {{ globalData.formatDate(scope.row.birthday) || table_placeholder }}
          </template>
        </el-table-column>
        <!--province-->
        <el-table-column prop="province_dictionary_name" align="center" :label="handleGlobalI18n('member', 'province')">
          <template slot-scope="scope">
            {{ scope.row.province_dictionary_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--city-->
        <el-table-column prop="city_dictionary_name" align="center" :label="handleGlobalI18n('member', 'city')">
          <template slot-scope="scope">
            {{ scope.row.city_dictionary_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--register channel-->
        <el-table-column prop="register_channel_name" align="center" width="160" :label="$t('member.fc_member_query_table_channel_label')">
          <template slot-scope="scope">
            <template>
              {{ scope.row.register_channel_resources_key ? $t(`reporting.${scope.row.register_channel_resources_key}`) : (scope.row.register_channel_name ? scope.row.register_channel_name : table_placeholder)  }}
            </template>
          </template>
        </el-table-column>
        <!--register store code-->
        <el-table-column prop="register_store_code" align="center" width="180" :label="$t('member.fc_member_query_table_store_code_label')" >
          <template slot-scope="scope">
            {{ scope.row.register_store_code || table_placeholder }}
          </template>
        </el-table-column>
        <!--register store name-->
        <el-table-column prop="register_store_name" align="center" width="160" :label="$t('member.fc_member_query_table_store_label')" >
          <template slot-scope="scope">
            {{ scope.row.register_store_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--register employee name-->
        <el-table-column prop="register_employee_name" align="center" width="170" :label="$t('member.fc_member_query_table_employee_label')">
          <template slot-scope="scope">
            {{ scope.row.register_employee_name || table_placeholder }}
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
      ></pagination-container>
    </div>
  </div>
</template>

<script>
  import { queryMemberListBySearch, quickQueryMemberBySearch } from '@/api/member'
  // import { pageLimit } from '@/api/api'
  import AdvancedQuery from '@/views/member/member-view/advanced-query/indexQuery'
  import PaginationContainer from '@/components/PaginationContainer'
  export default {
    components: {
      AdvancedQuery,
      PaginationContainer
    },
    data() {
      return {
        page_sizes: [15, 20, 30, 40, 50],
        select_type: 1, // 1是快速查询 2是高级查询
        quick_search: '',
        aq_state: false,
        total: null, /* null */
        filename: `${this.handleGlobalI18n('member', 'export_filename')}-${Date.parse(new Date())}`,
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
      advanced_search(formValue) {
        this.advancedData = formValue
        var state = 0
        for (var i in this.advancedData) {
          if (this.advancedData[i] !== '') {
            state = 1
          }
        }
        if (state === 0) {
          this.$message({
            message: 'Please enter a query condition',
            type: 'warning'
          })
        } else {
          this.listQuery.page_no = 1
          this.getList(this.advancedData)
        }
      },
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
      toMemberDetails(id) {
        this.$router.push({
          path: `/member/member-query/member-details/${id}`
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

  .member-view {
    margin: 0 30px;
  }
</style>
