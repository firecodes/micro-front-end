<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialog" ref="dialog" :before-close="closeDialog" width="60%" key="Math.random()">
      <el-scrollbar class="dialog-container">
        <div>
          <!-- v-loading="loadingDialog" -->
          <div class="transfer-box">
            <div class="transfer-item">
              <div class="search-employee">
                <Search :placeholder="handleGlobalI18n('store', 'mgt_search_input_empty_tips')" :className="'search-box'" :selWidth="'130px'" @searchList="searchList" :typeList="typeList" :type="child_listQuery.key" :content="child_listQuery.content" />
              </div>
              <el-table
                :data="list"
                v-loading="loading"
                ref="multipleTable"
                tooltip-effect="dark"
                :row-key="getRowKeys"
                style="width: 100%;"
                border
                @row-click="rowClick"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
                <el-table-column prop="name" :label="handleGlobalI18n('store', 'mgt_empl_table_name_label')" align="center"></el-table-column>
                <el-table-column prop="gender" :label="handleGlobalI18n('store', 'mgt_empl_table_gender_label')" align="center">
                  <template slot-scope="scope"><span style="text-transform: capitalize;">{{ utils.genderFilter(scope.row.gender) }}</span></template>
                </el-table-column>
                <el-table-column prop="position" :label="handleGlobalI18n('store', 'mgt_empl_table_position_label')" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="mobile" :label="handleGlobalI18n('store', 'mgt_empl_table_mobile_label')" align="center" show-overflow-tooltip></el-table-column>
              </el-table>
              <div class="pagination" v-if="!loading && list != ''">
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="child_listQuery.page_no"
                  :page-sizes="[10,20,30,40,50]"
                  :page-size="child_listQuery.page_size"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
              </div>  
            </div>
          </div>
        </div>
      </el-scrollbar>
      <span slot="footer" v-if="!loading" class="dialog-footer">
        <el-button type="primary" @click="closeDialog('save')">{{ handleGlobalI18n('store', 'mgt_operation_btn_save_label') }}</el-button>
        <el-button @click="closeDialog">{{ handleGlobalI18n('store', 'mgt_operation_btn_cancel_label') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { employeeList, employeeListByRole } from '@/api/employee/employee'
  import Search from '@/views/components/search'
  export default {
    name: 'employee-transfer',
    components: { Search },
    props: {
      'dialog': { type: Boolean },
      'title': { type: String },
      'selectData': { type: Array, default: [] },
      'listQuery': {
        type: Object,
        default: function() {
          return {
            asc: false,
            content: '',
            key: 0,
            page_no: 1,
            page_size: 10
          }
        }
      }
    },
    data() {
      return {
        list: [],
        loading: true,
        total: null,
        originalTotal: null,
        originedList: null,
        child_listQuery: Object.assign({}, this.listQuery),
        selectList: []
      }
    },
    watch: {
      'dialog': {
        deep: true,
        handler() {
          if (this.dialog) {
            this.child_listQuery = Object.assign({}, this.listQuery)
            this.selectList = this.selectData
            if (this.originedList === null) {
              this.getList('created')
            } else {
              this.list = this.originedList
              this.total = this.originalTotal
              this.changeData('created')
            }
          }
        }
      },
      'selectData': {
        deep: true,
        handler() {
          this.selectList = this.selectData
        }
      },
      '$route': {
        handler(val) {
          this.getList()
        }
      }
    },
    computed: {
      typeList() {
        return [{ type_id: 0, type_name: this.$t('mgt_empl_table_name_label') }, { type_id: 1, type_name: this.$t('mgt_empl_table_mobile_label') }]
      }
    },
    methods: {
      getList(type) {
        this.loading = true
        this.list = []
        if (this.listQuery.level) {
          employeeListByRole(this.child_listQuery).then(res => {
            this.loading = false
            this.list = res.results || []
            this.total = res.total_count
            this.setList(type, res)
            this.changeData(type)
          }).catch(() => { this.loading = false })
        } else {
          employeeList(this.child_listQuery).then(res => {
            this.loading = false
            this.list = res.results || []
            this.total = res.total_count
            this.setList(type, res)
            this.changeData(type)
          }).catch(() => { this.loading = false })
        }
      },
      setList(type, res) {
        if (type === 'created') {
          this.originedList = res.results || []
          this.originalTotal = res.total_count
        }
      },
      searchList(key, content) {
        this.$emit('clickEmployeeHandleSearch', null)
        this.child_listQuery.page_no = 1
        this.child_listQuery.key = key
        this.$set(this.child_listQuery, 'content', content)
        // this.child_listQuery.content = content
        this.getList()
      },
      changeData(type) {
        if (type !== 'created') return false
        this.selectList.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      },
      handleSizeChange(val) {
        this.child_listQuery.page_size = val
        this.child_listQuery.page_no = 1
        this.getList()
      },
      handleCurrentChange(val) {
        this.child_listQuery.page_no = val
        this.getList()
      },
      getRowKeys(row) {
        return row.id
      },
      rowClick(val) {
        this.$refs.multipleTable.toggleRowSelection(val)
      },
      handleSelectionChange(rows) {
        this.selectList = rows
      },
      closeDialog(type) {
        if (type === 'save') {
          this.$emit('employeeChooseHandle', this.selectList)
        } else {
          this.$emit('employeeChooseHandle', this.selectData)
        }
        this.$refs.multipleTable.clearSelection()
      }
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .transfer-item {
    .transfer-tit {
      background: #ccc;
      color: #fff;
      padding: 10px 15px;
    }
    .search-employee {
      margin-bottom: 20px;
    }
  }
  .transfer-btns {
    margin: 0 20px;
    .transfer-btn {
      display: block;
      margin: 10px auto;
    }
  }
</style>
