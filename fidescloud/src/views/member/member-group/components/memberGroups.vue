<template>
  <div class="gift-list-index new-table-css">
    <search :add="'add'" @clickSearch="clickSearch"></search>
    <div class="list-type">
      <div v-loading="listLoading">
        <el-table :data="tableData" @selection-change="handleSelectionChange" size="medium"  highlight-current-row :empty-text="handleGlobalI18n('system', 'no_data')">
          <el-table-column
            type="selection"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column prop="group_name" min-width="90" align="center" :label="$t('member.fc_member_group_my_table_name_label')">
            <template slot-scope="scope">
              <div style="cursor:pointer;color:#0099ff">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.group_name || table_placeholder}}</ed-clamp>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="gift_name" class="member_tags" align="center" :label="$t('member.fc_member_group_my_table_tags_label')" min-width="120">
            <template slot-scope="scope">
              <el-button class="member_tags_btn" v-for="(item, index) in computedTagNames(scope.row.tag_names)" :key="index" style="border-radius: 18px;color: #2777FF;font-size: 14px;border-color: rgba(39, 119, 255, 1.0);background-color: rgba(74, 144, 226, 0.07);">{{ item }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="member_num" align="center" :label="$t('member.fc_member_group_my_table_audience_label')" width="170">
            <template slot-scope="scope">
              <template v-if="scope.row.is_limited_inventory">
                No limit
              </template>
              <template v-else>
                <ed-clamp :max-lines="1" autoresize>{{scope.row.member_num || table_placeholder}}</ed-clamp>
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="$t('member.fc_member_group_my_table_cerated_label')" prop="create_date" align="center" width="125">
            <template slot-scope="scope">
              {{scope.row.create_date | formatTimeStamp}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('member.fc_member_group_my_table_modified_label')" align="center" prop="modify_date" width="115">
            <template slot-scope="scope">
              {{scope.row.modify_date | formatTimeStamp}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('member.fc_member_group_my_table_operation_label')" align="center" width="280"  >
            <template slot-scope="scope" >
              <div class="operation">
                <label @click="clickGroupDetails(scope.row)" >{{$t('loyalty.fc_operation_btn_details_label')}}</label>
                <label @click="clickGroupEdit(scope.row)" style="margin: 0 10px;">{{$t('loyalty.fc_operation_btn_edit_label')}}</label>
                <label @click="clickGroupCopy(scope.row)" style="margin-right: 10px;">{{$t('loyalty.fc_operation_btn_copy_label')}}</label>
                <label @click="handleDeleteGroup(scope.row.group_id)" >{{$t('loyalty.fc_operation_btn_delete_label')}}</label>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" :label="$t('member.fc_member_group_my_table_campaign_label')" width="150">
            <template>
              <img style="width: 27px;" :src="require('@/assets/images/launch.png')" alt="">
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <pagination-container
      :page = "listQuery.page_no"
      layout="total,sizes,prev,pager,next,jumper"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></pagination-container>
    </div>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { GlobalMixin } from '@/utils/mixin'
  import { queryMemberGroupList, deleteMemberGroup } from '@/api/memberGroup'
  import Search from './search'
  import { mapGetters } from 'vuex'
  export default {
    mixins: [
      GlobalMixin
    ],
    components: {
      Search,
      PaginationContainer
    },
    computed: {
      ...mapGetters([
        'memberTag'
      ])
    },
    data() {
      return {
        listLoading: true,
        tableData: [],
        listQuery: {
          asc: true,
          group_or_tag_name: '',
          group_type: 1,
          page_no: 1,
          page_size: 10
        },
        total: 0,
        multiple_selection: []
      }
    },
    watch: {
      'memberTag': {
        handler(val) {
          this.init()
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.getGroupList()
      },
      getGroupList() {
        this.listLoading = true
        queryMemberGroupList({
          ...this.listQuery
        }).then(res => {
          this.listLoading = false
          if (res.return_result) {
            this.tableData = res.return_result.results.sort((a, b) => a.group_name.localeCompare(b.group_name, 'zh-CN'))
            this.total = res.return_result.total_count
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.listLoading = false
          this.$message.error(err)
        })
      },
      computedTagNames(list) {
        if (list.length >= 2) {
          let temp = list[0]
          if (temp && temp.length > 11) {
            temp = temp.substring(0, 8).concat('...')
          }
          return [temp, '...']
        } else {
          return list
        }
      },
      clickSearch(val) {
        this.listQuery.group_or_tag_name = val
        this.listQuery.page_no = 1
        this.getGroupList()
      },
      handleDeleteGroup(id) {
        this.deleteItem(this.$t('loyalty.fc_operation_delete_confirm_title_label'), this.$t('member.fc_member_group_delete_content_label')).then(() => {
          this.handleDelete(id)
        })
      },
      handleDelete(id) {
        deleteMemberGroup(id).then(res => {
          if (res.return_result) {
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            this.listQuery.page_no = 1
            this.getGroupList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      clickGroupDetails(row) {
        sessionStorage.setItem('groupdetail', JSON.stringify(row))
        this.$router.push('/member/member-group/details' + `/${row.group_id}`)
      },
      clickGroupEdit(row) {
        sessionStorage.setItem('member_num', JSON.stringify(row.member_num))
        this.$router.push('/member/member-group/edit' + `/${row.group_id}`)
      },
      clickGroupCopy(row) {
        sessionStorage.setItem('groupcopy', JSON.stringify(row))
        this.$router.push('/member/member-group/copy' + `/${row.group_id}`)
      },
      handleSelectionChange(val) {
        this.multiple_selection = val
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getGroupList()
      },
      handleSizeChange(val) {
        this.listQuery.page_no = 1
        this.listQuery.page_size = val
        this.getGroupList()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .color-2777ff{
    color: #2777FF
  }
  .member_tags {
    .el-button {
      color: #2777FF;
      font-size: 14px;
      border-color: rgba(39, 119, 255, 1.0);
      background-color: rgba(74, 144, 226, 1.0);
      border-radius: 15px;
    }
  }
  .member_tags_btn {
    &:not(:first-child) {
      @media (max-width: 1800px) {
        margin-top: 8px !important;
      }
    }
  }
  .gift-list-index {
    // margin: 50px;
    .list-type{
      margin-top: 40px;
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
    }
    .operation{
      display: flex;
      justify-content: space-between;
      font-size:14px;
      font-weight:bold;
      color:rgba(39,119,255,1);
      line-height:17px;
      align-items: center;
      label{
        width:80px;
        height:30px;
        background:rgba(74,144,226,0.07);
        border-radius:4px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover{
          border:1px solid $new-primary;
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  @import "../../new-theme-css";
</style>
