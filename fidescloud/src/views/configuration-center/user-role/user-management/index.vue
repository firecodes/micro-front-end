<!--user management-->
<template>
  <div class="user-management">
    <div class="operation">
      <el-button icon="el-icon-plus" type="primary" @click="addUser">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
      <div class="search">
        <el-input type="text" v-model= "listQuery.user_name" maxlength="32" :placeholder="handleGlobalI18n('user_role', 'search_placeholder')" @keyup.enter.native="handleSearch"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{handleGlobalI18n('loyalty', 'search')}}</el-button>
      </div>
    </div>
    <div v-loading="listLoading">
      <el-table :data="tableData"  highlight-current-row border :empty-text="$t('member.fc_table_no_data_label')">
        <el-table-column type="index" :index="calcIndex" min-width="90" align="center" label="#"></el-table-column>
        <el-table-column prop="name" align="center" :label="handleGlobalI18n('user_role', 'table_username')">
          <template slot-scope="scope">
            {{scope.row.name || table_placeholder}}
          </template>
        </el-table-column>
        <el-table-column prop="roles" align="center" :label="handleGlobalI18n('user_role', 'table_roles')">
          <template slot-scope="scope" >
            <div @click.stop="handleConfigurationRole(scope.row.user_id)">
              <svg-icon icon-class="member_2" class="primary-color cursor-pointer" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" align="center" :label="handleGlobalI18n('user_role', 'table_enabled')">
          <template slot-scope="scope">
            {{scope.row.enable ? handleGlobalI18n('user_role', 'table_yes') : handleGlobalI18n('user_role', 'table_no')}}
          </template>
        </el-table-column>
        <el-table-column :label="handleGlobalI18n('user_role', 'table_operation')" align="center" width="250">
          <template slot-scope="scope">
            <ul style="display: flex;align-items: center;cursor: pointer;" class="primary-color">
              <li @click="handleEditDetails(scope.row.user_id, '1')">{{handleGlobalI18n('user_role', 'table_details')}}</li>
              <li class="margin-0-5">|</li>
              <li @click="handleEditDetails(scope.row.user_id, '2')">{{handleGlobalI18n('user_role', 'table_edit')}}</li>
              <li class="margin-0-5">|</li>
              <li @click="handleUserStatus(scope.row.user_id, scope.row.enable)">{{scope.row.enable ? handleGlobalI18n('user_role', 'table_disable') : handleGlobalI18n('user_role', 'table_enabled')}}</li>
              <li class="margin-0-5">|</li>
              <li @click.stop="handleDelete(scope.row.user_id)">{{handleGlobalI18n('user_role', 'table_delete')}}</li>
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
      :title="handleGlobalI18n('user_role', 'table_operation')"
      :visible.sync="delete_dialog_visible"
      width="500px">
      <span>{{handleGlobalI18n('user_role', 'dialog_content')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="delete_loading" @click="handleDeleteUser">{{handleGlobalI18n('user_role', 'dialog_confirm')}}</el-button>
        <el-button @click="delete_dialog_visible = false">{{handleGlobalI18n('user_role', 'dialog_cancel')}}</el-button>
      </span>
    </el-dialog>
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <!-----配置用户权限页面---------------------------------------------------------------------------------------------------------------------------------------------------------->
    <el-dialog
      class="role-dialog"
      :title="handleGlobalI18n('user_role', 'dialog_user_roles')"
      :visible.sync="role_dialog_visible"
      width="900px">
      <div class="content" v-loading="role_list_state">
        <div class="fides-cloud-roles" v-for="(item, index) in role_list" :key="index" :class="{'margin-top-32' : index > 0}">
          <p>{{item.app_name}} {{handleGlobalI18n('user_role', 'dialog_roles')}}</p>
          <el-checkbox-group v-model="select_role_list[index]">
            <el-checkbox v-for="(item1, index1) in item.roles" :key="index1" :label="item1.role_id" @change="handleChangeCheckbox($event, index, item1.role_id)">
              <!--{{item1.checked ? select_role_list.push(item1.role_id) : ''}}-->
              {{item1.role_name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="save_role_loading" @click="setRole">{{handleGlobalI18n('user_role', 'dialog_save')}}</el-button>
        <el-button @click="role_dialog_visible = false">{{handleGlobalI18n('user_role', 'dialog_cancel')}}</el-button>
      </span>
    </el-dialog>
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <add-user
      :show_state="add_user_state"
      @setAddState = "setAddState"
      @regain="handleSearch"
    />
    <!--编辑 查看用户页面------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <edit-detail-user
      :show_state = "edit_detail_state"
      @setEditDetailState = "setEditDetailState"
      :user_id="id"
      :type="edit_detail_type"
      @regain="handleSearch"
    />
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainer'
  import { list, status, deleteUser, roleList, assign } from '@/api/user'
  import { pageLimit } from '@/api/api'
  import { DateTime } from 'luxon'
  import AddUser from './add-user'
  import EditDetailUser from './edit-detail-user'
  export default {
    components: {
      AddUser,
      EditDetailUser,
      PaginationContainer
    },
    data() {
      return {
        role_user_id: null,
        save_role_loading: false,
        select_role_list: [[], [], []],
        delete_loading: false,
        role_list_state: false,
        role_list: [],
        delete_id: null,
        id: null,
        add_user_state: false,
        edit_detail_state: false,
        edit_detail_type: null,
        delete_dialog_visible: false,
        role_dialog_visible: false,
        radio: '',
        listLoading: true,
        tableData: [],
        type_id: 2,
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          user_name: ''
        },
        total: 0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleChangeCheckbox(a, index, role_id) {
        if (a) {
          this.select_role_list[index] = []
          this.select_role_list[index] = [role_id]
        }
      },
      setRole() {
        this.save_role_loading = true
        var roles = []
        for (var i = 0; i < this.select_role_list.length; i++) {
          var value = this.select_role_list[i][0]
          if (value !== null && value !== undefined) {
            roles.push(value)
          }
        }
        assign({ roles: roles, user_id: this.role_user_id }).then(res => {
          if (res.return_result.flag) {
            this.$message({
              message: this.handleGlobalI18n('system', 'success'),
              type: 'success'
            })
            this.role_dialog_visible = false
          } else {
            this.$message.error(this.handleGlobalI18n('system', 'fail'))
          }
          this.save_role_loading = false
        }).catch(res => {
          this.$message.error(res)
          this.save_role_loading = false
        })
      },
      getRoleList(user_id) {
        this.select_role_list = [[], [], []]
        this.role_list = []
        this.role_list_state = true
        roleList({ user_id: user_id }).then(res => {
          this.role_list = res.return_result.results
          this.role_list_state = false
          for (var index in this.role_list) {
            for (var item1 of this.role_list[index].roles) {
              if (item1.checked) {
                this.select_role_list[index].push(item1.role_id)
              }
            }
          }
        }).catch(_ => {
          this.role_list_state = false
        })
      },
      handleDeleteUser() {
        this.delete_loading = true
        deleteUser({
          user_id: this.delete_id
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
      handleUserStatus(user_id, val) {
        status({
          user_id: user_id,
          enable: !val
        }).then(res => {
          if (res.return_result.flag) {
            this.$message({
              message: this.handleGlobalI18n('system', 'success'),
              type: 'success'
            })
            this.handleSearch()
          } else {
            this.$message.error(this.handleGlobalI18n('system', 'fail'))
          }
        }).catch(res => {
          this.$message.error(res)
        })
      },
      handleEditDetails(id, type) {
        this.id = id
        this.edit_detail_type = type
        this.edit_detail_state = true
      },
      calcIndex(index) {
        return (this.listQuery.page_no - 1) * this.listQuery.page_size + index + 1
      },
      // delete
      handleDelete(val) {
        this.delete_dialog_visible = true
        this.delete_id = val
      },
      setAddState(val) {
        this.add_user_state = val
      },
      setEditDetailState(val) {
        this.edit_detail_state = val
      },
      // 新增用户
      addUser() {
        this.add_user_state = true
      },
      // 配置权限页面
      handleConfigurationRole(user_id) {
        this.role_dialog_visible = true
        this.getRoleList(user_id)
        this.role_user_id = user_id
      },
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
        var obj = Object.assign({}, this.listQuery, { asc: false })
        if (!this.listQuery.user_name) {
          delete obj.user_name
        }
        list(obj).then(res => {
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
      .margin-top-32{
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
  .user-management {
    margin: 20px;
    padding: 15px;
    background-color: #fff;
    .operation{
      display: flex;
      margin-bottom:14px;
      justify-content: space-between;
      align-items: center;
      .el-button{
        min-width: 80px;
      }
    }
    .search{
      .el-input{
        width: 300px;
        margin-right: 10px;
      }
    }
  }
</style>
