<!--
  Test group management
  2020.03.06
-->
<template>
  <div class="test_group_management">
    <section class="test_group_management__top_search">
      <el-input :placeholder="$t('configuration.fc_configuration_test_search_input_label')" v-model="list_query.group_name" />
      <!--Search-->
      <el-button @click="handleCurrentChange(1)" class="search" type="primary">{{$t('configuration.fc_configuration_test_btn_search_label')}}</el-button>
      <!--Add new test group-->
      <el-button @click="handleRoute('add', null)" class="add-button" type="primary">{{$t('configuration.fc_configuration_test_btn_add_label')}}</el-button>
    </section>
    <section class="test_group_management__content">
      <ed-table>
        <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" highlight-current-row size="medium" v-loading="loading">
          <!--#-->
          <el-table-column :label="$t('configuration.fc_configuration_test_table_num_label')" align="center" width="80">
            <template slot-scope="scope">
               {{(scope.$index + ((list_query.page_no-1) * list_query.page_size) + 1).toString().padStart(2, '0') }}
            </template>
          </el-table-column>
          <!--Test group name-->
          <el-table-column :label="$t('configuration.fc_configuration_test_table_name_label')" align="center" prop="group_name">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.group_name || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Communication channel-->
          <el-table-column :label="$t('configuration.fc_configuration_test_table_channel_label')" align="center">
            <template slot-scope="scope">
              {{scope.row.communication_channel || table_placeholder}}
            </template>
          </el-table-column>
          <!--Description-->
          <el-table-column :label="$t('configuration.fc_configuration_test_table_desc_label')" align="center">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.group_description || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Contact list-->
          <el-table-column :label="$t('configuration.fc_configuration_test_table_contact_label')" align="center">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.contact_list || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Operation-->
          <el-table-column :label="$t('configuration.fc_configuration_test_table_operation_label')" align="center" width="300">
            <template slot-scope="scope">
              <div class="button-list">
                <!--Details-->
                <div @click="handleRoute('detail', scope.row.id)"><ed-operation-button >{{$t('loyalty.fc_operation_btn_details_label')}}</ed-operation-button></div>
                <!--Edit-->
                <div @click="handleRoute('edit', scope.row.id)"><ed-operation-button>{{$t('loyalty.fc_operation_btn_edit_label')}}</ed-operation-button></div>
                <!--Delete-->
                <div @click="handleDelete(scope.row.id)"><ed-operation-button>{{$t('loyalty.fc_operation_btn_delete_label')}}</ed-operation-button></div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </ed-table>
      <ed-pagination
        :layout="'total, sizes, prev, pager, next, jumper'"
        :page = "list_query.page_no"
        :page_size = 'list_query.page_size'
        :total = 'total_count'
        @handleCurrentChange = "handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </section>
  </div>
</template>
<script>
  import { groupList, groupDelete } from '@/api/testGroup'
  import { pageLimit } from '@/api/api'
  import { handleOssFileHtmlStr } from '@/views/data/oss-file-html-str'
  export default {
    mixins: [handleOssFileHtmlStr],
    data() {
      return {
        loading: false,
        total_count: 0,
        list_query: {
          page_no: 1,
          page_size: pageLimit,
          group_name: '',
          asc: false,
          communication_channel_type: 0
        },
        table_data: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleRoute(type, id) {
        this.$router.push({
          path: `/configuration/test-group-management/${type}`,
          query: {
            type,
            id
          }
        })
      },
      handleDelete(id) {
        this.$confirm(this.$t('configuration.fc_configuration_test_delete_popup_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
          confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
          cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          this.loading = true
          groupDelete({ test_group_id: id }).then(res => {
            this.loading = false
            if (res.return_result) {
              this.handleCurrentChange(1)
              this.$message.success(this.handleGlobalI18n('system', 'success'))
            } else {
              this.$message.error('Fail')
            }
          }).catch(() => {
            this.$message.error('Fail')
          })
        })
      },
      getList() {
        this.loading = true
        groupList(Object.assign({}, this.list_query, { group_name: this.list_query.group_name.trim() })).then(res => {
          this.loading = false
          this.table_data = res.return_result.results || []
          this.total_count = res.return_result.total_count || 0
        }).catch(res => {
          this.$message.error(res)
          this.loading = false
        })
      },
      handleCurrentChange(val) {
        this.list_query.page_no = val
        this.getList()
      },
      handleSizeChange(size) {
        this.list_query.page_no = 1
        this.list_query.page_size = size
        this.getList()
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .test_group_management{
    margin: 50px;
    .search{
      min-width: 88px;
    }
    &__top_search{
      position: relative;
      margin-bottom: 40px;
      .el-input{
        width: 600px;
      }
      .el-button{
        background-color: $new-primary;
      }
      .search{
        margin-left: 8px;
        min-width: 88px;
      }
      .add-button{
        position: absolute;
        right: 0;
      }
    }
    .button-list{
      display: flex;
      justify-content: center;
      .ed-operation-button{
        &:not(first-child){
          margin-left: 8px;
        }
      }
    }
  }
</style>
