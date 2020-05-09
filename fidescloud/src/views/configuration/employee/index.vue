<template>
  <div class="r-employee-home-wrapper">
    <!-- 按钮区域 -->
    <div class="flex justify-space-between top-header">
      <el-row>
        <el-button type="primary" @click="handleClickAdd">{{handleGlobalI18n('store', 'mgt_store_add_label')}}</el-button>
        <!-- <el-button class="import_btn" type="primary" @click="handleClickImport">Import</el-button>
        <el-button class="export_btn" type="primary">Export all employees</el-button> -->
      </el-row>
      <el-row class="flex">
        <el-select v-model="namevalue" value-key="type_id" @change="selectType" :placeholder="handleGlobalI18n('system', 'please_select')">
          <el-option
            v-for="item in nameoptions"
            :key="item.type_id"
            :label="item.label ? handleGlobalI18n('employee', item.label) : item.type_name"
            :value="item.type_id">
          </el-option>
        </el-select>
        <div class="flex search_input">
          <el-input v-model="inputSearch" :placeholder="handleGlobalI18n('store', 'mgt_company_add_content_input_label')"></el-input>
          <el-button @click="clickSearch(inputSearch)"><i class="el-icon-search"></i></el-button>
        </div>
      </el-row>
    </div>
    <!-- table 区域 -->
    <div class="">
      <el-table
        border
        v-loading='loading'
        ref="singleTable"
        :data="list"
        highlight-current-row
        style="width: 100%">
        <el-table-column type="index" :index="(index) => common.tableListIdx(index, listQuery.page_no, listQuery.page_size)" label="#" align="center" width="80"></el-table-column>
        <el-table-column prop="name" :label="handleGlobalI18n('employee', 'mgt_empl_table_name_label')" align="center"></el-table-column>
        <el-table-column prop="gender" :label="handleGlobalI18n('employee', 'mgt_empl_table_gender_label')" align="center">
          <template slot-scope="scope">
            <span style="text-transform: capitalize;">{{ handleGlobalI18n('system', gendersValue[scope.row.gender]) || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="position" :label="handleGlobalI18n('employee', 'mgt_empl_table_position_label')" align="center"></el-table-column>
        <el-table-column prop="mobile" :label="handleGlobalI18n('employee', 'mgt_empl_table_mobile_label')" align="center"></el-table-column>
        <el-table-column prop="store" :label="handleGlobalI18n('employee', 'mgt_empl_table_store_label')" align="center">
          <template slot-scope="scope">
            <span v-for="(item, idx) in scope.row.store" :key="item">{{item}}<i v-if="idx !== scope.row.store.length - 1">,</i></span>
          </template>
        </el-table-column>
        <el-table-column prop="create_date" :label="handleGlobalI18n('employee', 'mgt_empl_table_created_time_label')" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.create_date) }}
          </template>
        </el-table-column>
        <el-table-column :label="handleGlobalI18n('employee', 'mgt_empl_table_operation_label')" align="center" min-width="180">
          <template slot-scope="scope">
            <div class="handle-btns">
              <span @click="goDetail(scope.row)" :class="{ 'unopened': !scope.row.is_change_status }">{{ handleGlobalI18n('employee', 'mgt_operation_btn_details_label') }}</span>
              <!-- <router-link :to="'/configuration/employee/list/details/' + scope.row.id">{{ handleGlobalI18n('employee', 'mgt_operation_btn_details_label') }}</router-link> -->
              <!-- <span @click="disable(scope.row)" :class="{ 'unopened': !scope.row.is_change_status }" v-text="scope.row.disable ? handleGlobalI18n('employee', 'mgt_operation_btn_disable_label'): handleGlobalI18n('employee', 'mgt_operation_btn_enable_label')"></span> -->
              <span @click="goEdit(scope.row)" :class="{ 'unopened': !scope.row.is_change_status && (scope.row.id !== $store.state.user.userInfo.employee_id) }">{{ handleGlobalI18n('employee', 'mgt_operation_btn_edit_label') }}</span>
              <span @click="deleteItem(scope.row)" :class="{ 'unopened': !scope.row.is_change_status }">{{ handleGlobalI18n('employee', 'mgt_operation_btn_delete_label') }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page_no"
          :page-sizes="[10,20,30,40,50]"
          :page-size="listQuery.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { employeeList, employeeDelete } from '@/api/employ'
import { parseTime } from '@/utils'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      gendersValue: ['unknown', 'male', 'female'],
      namevalue: 0,
      type_id: 0,
      inputSearch: '',
      listQuery: { ...this.common.listQuery },
      loading: true,
      nameoptions: [
        { type_id: 0, label: 'mgt_empl_search_menu_1st_label', type_name: this.handleGlobalI18n('employee', 'mgt_empl_search_menu_1st_label') },
        { type_id: 1, label: 'mgt_empl_search_menu_2nd_label', type_name: this.handleGlobalI18n('employee', 'mgt_empl_search_menu_2nd_label') }
      ],
      list: [],
      total: null,
      formatTime(val) {
        return parseTime(val)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    selectType(val) {
      this.listQuery.key = val
    },
    clickSearch(val) {
      this.listQuery.content = val
      this.getList()
    },
    getList() {
      this.loading = true
      employeeList(this.listQuery).then(res => {
        if (res.return_result) {
          this.loading = false
          let temp = res.return_result.results || []
          temp = temp.sort((a, b) => {
            return a.name.localeCompare(b.name)
          })
          this.list = temp
          this.total = res.return_result.total_count
        }
      }).catch(() => { this.loading = false })
    },
    handleClickAdd() {
      this.$router.push('/configuration/employee/list/add')
    },
    handleClickImport() {
      this.$router.push('/configuration/employee/list/import')
    },
    goDetail(row) {
      this.$router.push('/configuration/employee/list/detail/' + row.id)
      console.log('detail', row)
    },
    goEdit(row) {
      this.$router.push('/configuration/employee/list/edit/' + row.id)
    },
    deleteItem(row) {
      this.$confirm(this.handleGlobalI18n('employee', 'mgt_empl_delete_confirm_content_label'), this.handleGlobalI18n('employee', 'mgt_operation_delete_confirm_title_label'), {
        confirmButtonText: this.handleGlobalI18n('store', 'mgt_operation_delete_confirm_ok_label'),
        cancelButtonText: this.handleGlobalI18n('store', 'mgt_operation_delete_confirm_cancel_label'),
        confirmButtonClass: 'new_confirm_confirm',
        cancelButtonClass: 'new_confirm_cancel'
      }).then(() => {
        employeeDelete({ id: row.id, active_flag: 0 }).then(res => {
          if (res.return_result) {
            if (res.return_result.success) {
              this.getList()
              this.$message({
                dangerouslyUseHTMLString: true,
                message: this.handleGlobalI18n('employee', 'mgt_empl_delete_notification_label'),
                type: 'success'
              })
            } else {
              Message({
                message: res.msg,
                type: 'error'
              })
            }
          }
        }).catch(err => {
          Message({
            message: err,
            type: 'error'
          })
        })
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.listQuery.page_no = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.r-employee-home-wrapper {
  margin: 15px 20px;
  .top-header {
    margin-bottom: 30px;
    .import_btn {
      margin: 0px 15px;
    }
    .export_btn {
      margin-left: 0px;
    }
    .search_input {
      margin-left: 15px;
    }
  }
  .el-pagination {
    padding: 20px;
    text-align: center;
    background-color: #fff;
  }
  .flex {
    display: flex;
  }
  .justify-space-between {
    justify-content: space-between;
  }
}
</style>
