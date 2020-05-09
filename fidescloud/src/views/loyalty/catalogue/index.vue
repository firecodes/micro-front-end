<template>
  <div class="redemption-event">
    <div class="search">
      <el-input type="text" v-model= "listQuery.redemption_event_name" maxlength="32" :placeholder="handleGlobalI18n('loyalty', 'redemption_input_placeholder')" @keyup.enter.native="handleSearch"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{handleGlobalI18n('loyalty', 'search')}}</el-button>
      <el-button icon="el-icon-plus" @click="addRedemption('1','')">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
    </div>
    <div v-loading="listLoading">
        <el-table :data="tableData"  highlight-current-row border :empty-text="$t('member.fc_table_no_data_label')">
            <el-table-column prop="redemption_event_name" min-width="90" align="center" :label="handleGlobalI18n('loyalty', 'redemption_event_name')"></el-table-column>
            <el-table-column prop="effective_from_time" align="center" :label="handleGlobalI18n('loyalty', 'start_date')">
              <template slot-scope="scope">
                {{scope.row.effective_from_time !== null ? globalData.formatDate(timeSubstring(scope.row.effective_from_time)) : table_placeholder}}
              </template>
            </el-table-column>
            <el-table-column prop="effective_to_time" align="center" :label="handleGlobalI18n('loyalty', 'end_date')">
              <template slot-scope="scope">
                {{scope.row.effective_to_time !== null ? globalData.formatDate(timeSubstring(scope.row.effective_to_time)) : table_placeholder}}
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" :label="handleGlobalI18n('loyalty', 'status')">
              <template slot-scope="scope">
                {{scope.row.status === 1 ? 'Active' : 'Inactive'}}
              </template>
            </el-table-column>
            <el-table-column prop="create_date" align="center" :label="handleGlobalI18n('loyalty', 'redemption_created')">
              <template slot-scope="scope">
                {{scope.row.generate_time !== null ? globalData.formatDate(timeSubstring(scope.row.generate_time)) : table_placeholder}}
              </template>
            </el-table-column>
            <el-table-column :label="handleGlobalI18n('loyalty', 'operation')" align="center">
                <template slot-scope="scope">
                    <el-button v-if = "checkEffective(scope.row.effective_to_time)" @click="addRedemption('2',scope.row.redemption_event_code)">{{handleGlobalI18n('loyalty', 'edit')}}</el-button>
                    <el-button v-else @click="addRedemption('3',scope.row.redemption_event_code)">{{handleGlobalI18n('loyalty', 'view')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
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
  import PaginationContainer from '@/components/PaginationContainer'
  import { searchRedemptionEvent } from '@/api/redemption'
  import { pageLimit } from '@/api/api'
  import { DateTime } from 'luxon'
  export default {
    components: {
      PaginationContainer
    },
    data() {
      return {
        timeSubstring(value) {
          if (!value || value === null || value === undefined) return ''
          value = value.toString()
          return value.substring(0, 10)
        },
        radio: '',
        listLoading: true,
        tableData: [],
        type_id: 2,
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          redemption_event_name: ''
        },
        total: 0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      checkEffective(effective_to) {
        const now_date = new Date().valueOf()
        const end_date = DateTime.fromISO(effective_to).toFormat('x')
        if (now_date >= end_date) {
          return false
        }
        return true
      },
      getList() {
        this.listLoading = true
        searchRedemptionEvent(Object.assign({}, this.listQuery, { asc: false })).then(res => {
          const obj = res.return_result
          this.tableData = obj.redemption_events
          this.total = obj.total_count
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      selectType(id) {
        this.type_id = id
      },
      addRedemption(id, index = 0) {
        let path
        if (id === '1') {
          path = `/loyalty/catalogue/add-event/${id}`
        } else if (id === '2') {
          path = `/loyalty/catalogue/edit-event/${id}/${index}`
        } else {
          path = `/loyalty/catalogue/view-event/${id}/${index}`
        }
        this.$router.push({
          path: path
        })
      },
      handleSearch() {
        this.listQuery.redemption_event_name = this.listQuery.redemption_event_name && this.listQuery.redemption_event_name.trim()
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      }
    },
    watch: {
      '$route': {
        handler(val) {
          this.getList()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .redemption-event {
    margin: 20px;
    padding: 15px;
    background-color: #fff;
    .search{
      margin-bottom:14px;
      .el-input{
        width: 30%;
      }
    }
  }
</style>
