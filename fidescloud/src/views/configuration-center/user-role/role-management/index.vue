<!--role management-->
<template>
  <div class="role-management">
    <div class="operation">
      <el-button icon="el-icon-plus" type="primary" @click="addRole">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
      <div class="search">
        <el-input type="text" v-model= "listQuery.role_name" maxlength="32" :placeholder="handleGlobalI18n('user_role', 'role_search_placeholder')" @keyup.enter.native="handleSearch"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{handleGlobalI18n('loyalty', 'search')}}</el-button>
      </div>
    </div>
    <div v-loading="listLoading">
      <el-table :data="tableData"  highlight-current-row border :empty-text="$t('member.fc_table_no_data_label')">
        <el-table-column min-width="90" align="center" type="index" :index="calcIndex" label="#">
        </el-table-column>
        <el-table-column prop="name" align="center" :label="handleGlobalI18n('user_role', 'role_management_table_role_name')">
          <template slot-scope="scope">
            {{scope.row.name || table_placeholder}}
          </template>
        </el-table-column>
        <el-table-column prop="app_name" align="center" :label="handleGlobalI18n('user_role', 'role_management_table_app')">
          <template slot-scope="scope">
            {{scope.row.app_name || table_placeholder}}
          </template>
        </el-table-column>
        <el-table-column :label="handleGlobalI18n('user_role', 'role_management_table_operation')" align="center" width="180">
          <template slot-scope="scope">
            <ul style="display: flex;align-items: center;cursor: pointer;" class="primary-color">
              <li @click="handleEditDetails(scope.row.role_id, '1')">{{handleGlobalI18n('user_role', 'role_management_table_details')}}</li>
              <li class="margin-0-5">|</li>
              <li @click="handleEditDetails(scope.row.role_id, '2')">{{handleGlobalI18n('user_role', 'role_management_table_edit')}}</li>
              <li class="margin-0-5">|</li>
              <li @click.stop="handleDelete(scope.row.role_id)">{{handleGlobalI18n('user_role', 'role_management_table_delete')}}</li>
            </ul>
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
    <!--delete 弹出框--------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <el-dialog
      :title="handleGlobalI18n('user_role', 'role_management_dialog_delete_confirmation')"
      :visible.sync="delete_dialog_visible"
      width="500px">
      <span>{{handleGlobalI18n('user_role', 'role_management_dialog_delete_content')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="delete_loading" @click="handleDeleteRole()">{{handleGlobalI18n('user_role', 'role_management_dialog_delete_confirm')}}</el-button>
        <el-button @click="delete_dialog_visible = false">{{handleGlobalI18n('user_role', 'role_management_dialog_delete_cancel')}}</el-button>
      </span>
    </el-dialog>
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <add-role
      :show_state="add_role_state"
      @setAddState = "setAddState"
      @regain="handleSearch"
    />
    <!--编辑 查看权限页面-->
    <edit-detail-role
      :show_state = "edit_detail_state"
      @setEditDetailState = "setEditDetailState"
      :role_id="id"
      :type="edit_detail_type"
      @regain="handleSearch"
    />
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainer'
  import { list, deleteRole } from '@/api/role'
  import { pageLimit } from '@/api/api'
  import AddRole from './add-role'
  import EditDetailRole from './edit-detail-role'
  export default {
    components: {
      AddRole,
      EditDetailRole,
      PaginationContainer
    },
    data() {
      return {
        delete_loading: false,
        delete_id: null,
        id: null,
        edit_detail_type: null,
        edit_detail_state: false,
        add_role_state: false,
        delete_dialog_visible: false,
        listLoading: true,
        tableData: [],
        type_id: 2,
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          role_name: ''
        },
        total: 0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleDeleteRole() {
        this.delete_loading = true
        deleteRole({
          role_id: this.delete_id
        }).then(res => {
          this.delete_loading = false
          if (res.return_result.flag) {
            this.$message({
              message: this.handleGlobalI18n('system', 'success'),
              type: 'success'
            })
            this.delete_dialog_visible = false
            this.handleSearch()
          } else {
            this.$message.error(this.handleGlobalI18n('system', 'fail'))
          }
        }).catch(res => {
          this.delete_loading = false
          this.delete_dialog_visible = false
          this.$message.error(res)
        })
      },
      handleEditDetails(id, type) {
        this.id = id
        this.edit_detail_type = type
        this.edit_detail_state = true
      },
      setEditDetailState(val) {
        this.edit_detail_state = val
      },
      setAddState(val) {
        this.add_role_state = val
      },
      calcIndex(index) {
        return (this.listQuery.page_no - 1) * this.listQuery.page_size + index + 1
      },
      // delete
      handleDelete(val) {
        this.delete_dialog_visible = true
        this.delete_id = val
      },
      getList() {
        this.listLoading = true
        list(Object.assign({}, this.listQuery, { asc: false })).then(res => {
          const obj = res.return_result
          this.tableData = obj.results
          this.total = obj.total_count
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      selectType(id) {
        this.type_id = id
      },
      addRole() {
        this.add_role_state = true
      },
      handleSearch() {
        this.listQuery.page_no = 1
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
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../dialog-common";
  .role-dialog{
    .content{
      margin-top: -10px;
      width: 100%;
      margin-bottom: 40px;
      p{
        @include p-style;
      }
      .smart-inchain-roles{
        margin-top: 32px;
      }
      .el-checkbox{
        line-height: 40px;
        min-width: 180px;
        height: 40px;
      }
    }
  }
  .primary-color{
    color: $primary;
  }
  .el-button{
    min-width: 80px;
  }
  .margin-0-5{
    margin: 0 6px;
  }
  .role-management {
    margin: 20px;
    padding: 15px;
    background-color: #fff;
    .operation{
      display: flex;
      margin-bottom:14px;
      justify-content: space-between;
      align-items: center;
    }
    .search{
      .el-input{
        width: 300px;
        margin-right: 10px;
      }
    }
  }
</style>
