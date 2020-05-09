<template>
  <div class="memberTagPage">
    <search @clickSearch="handleClickSearch"></search>
    <div class="gift-list-index new-table-css">
      <div class="list-type">
        <div v-loading="listLoading">
          <el-table :data="tableData" size="medium"  highlight-current-row :empty-text="handleGlobalI18n('system', 'no_data')">
            <!-- <el-table-column
              type="selection"
              align="center"
              width="80">
            </el-table-column> -->
            <el-table-column prop="category_name" align="center" :label="$t('member.fc_member_tag_table_category_label')">
              <template slot-scope="scope">
                <template v-if="scope.row.is_limited_inventory">
                  No limit
                </template>
                <template v-else>
                  <ed-clamp :max-lines="1" autoresize>{{$t('member.'+keyMap[scope.row.category_name]) || table_placeholder}}</ed-clamp>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="group_name" align="center" :label="$t('member.fc_member_tag_table_group_label')" min-width="120">
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.group_name || table_placeholder}}</ed-clamp>
              </template>
            </el-table-column>
            <el-table-column prop="tag_name" min-width="90" align="center" :label="$t('member.fc_member_tag_table_name_label')">
              <template slot-scope="scope">
                <div>
                  <ed-clamp :max-lines="1" autoresize>{{scope.row.tag_name || table_placeholder}}</ed-clamp>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('member.fc_member_tag_table_type_label')" prop="type" align="center" width="125">
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{$t('member.'+keyMap[scope.row.type]) || table_placeholder}}</ed-clamp>
              </template>
            </el-table-column>
            <el-table-column :label="$t('member.fc_member_tag_table_members_label')" align="center" prop="member_num" width="115">
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.member_num}}</ed-clamp>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('member.fc_member_tag_table_creation_date_label')" width="150" prop="create_date">
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{ scope.row.create_date | formatTimeStamp('YYYY-MM-DD') }}</ed-clamp>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('member.fc_member_tag_table_update_date_label')" width="150" prop="modify_date">
              <template slot-scope="scope">
                <ed-clamp :max-lines="1" autoresize>{{ scope.row.modify_date | formatTimeStamp('YYYY-MM-DD') }}</ed-clamp>
              </template>
            </el-table-column>
            <el-table-column :label="$t('member.fc_member_tag_table_operation_label')" align="center" width="280"  >
              <template slot-scope="scope" >
                <div class="operation">
                  <label @click="lineDetailsTag(scope.row.tag_id, scope.row)" >{{$t('loyalty.fc_operation_btn_details_label')}}</label>
                  <label @click="lineEditTag(scope.row.tag_id)">{{$t('loyalty.fc_operation_btn_edit_label')}}</label>
                  <label @click="handleDeleteMemTag(scope.row.tag_id)" >{{$t('loyalty.fc_operation_btn_delete_label')}}</label>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" :label="$t('member.fc_member_tag_table_campaign_label')" width="150">
              <template>
                <img style="width: 27px;" :src="require('@/assets/images/launch.png')" alt="">
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <pagination-container
        layout="total,sizes,prev,pager,next,jumper"
        :page = "listQuery.page_no"
        :page_size = 'listQuery.page_size'
        :total = 'total'
        @handleCurrentChange = "handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination-container>
      </div>
    </div>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryAllTags, deleteMemberTag } from '@/api/memberTag'
  // import { pageLimit } from '@/api/api'
  import Search from './search'
  import { GlobalMixin } from '@/utils/mixin'
  export default {
    mixins: [
      GlobalMixin
    ],
    components: {
      PaginationContainer,
      Search
    },
    data() {
      return {
        listLoading: true,
        tableData: [],
        listQuery: {
          page_no: 1,
          page_size: 10,
          asc: true,
          condition: ''
        },
        total: 0,
        keyMap: {
          'Campaign': 'fc_member_tag_edit_category_4th_label',
          'Lifecycle': 'fc_member_tag_edit_category_5th_label',
          'Loyalty': 'fc_member_tag_edit_category_2nd_label',
          'Privacy': 'fc_member_tag_edit_category_6th_label',
          'Socio demographic': 'fc_member_tag_edit_category_1st_label',
          'Transaction': 'fc_member_tag_edit_category_3rd_label',
          'true': 'fc_member_tag_add_type_1st_label',
          'false': 'fc_member_tag_add_type_2nd_label'
        }
      }
    },
    created() {
      this.getAllTags()
    },
    activated() {
      if (this.$route.query.update) {
        this.getAllTags()
      }
    },
    methods: {
      getAllTags() {
        this.listLoading = true
        queryAllTags({ ...this.listQuery }).then(res => {
          this.listLoading = false
          if (res.return_result) {
            this.total = res.return_result.total_count
            this.sortAscent(res.return_result.results)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.listLoading = false
          this.$message.error(err)
        })
      },
      sortAscent(arr) {
        this.tableData = arr.sort((a, b) => {
          return a.category_name.localeCompare(b.category_name, 'zh-CN')
        })
      },
      handleClickSearch(val) {
        this.listQuery.condition = val
        this.listQuery.page_no = 1
        this.getAllTags()
      },
      lineDetailsTag(id, row) {
        sessionStorage.setItem('member_tag_detail', JSON.stringify(row))
        this.$router.push(`/member/member-tag/details/${id}`)
      },
      lineEditTag(id) {
        this.$router.push(`/member/member-tag/edit/${id}`)
      },
      handleDeleteMemTag(id) {
        this.deleteItem(this.$t('loyalty.fc_operation_delete_confirm_title_label'), this.$t('member.fc_member_tag_delete_content_label')).then(() => {
          this.handleDelete(id)
        })
      },
      handleDelete(id) {
        deleteMemberTag(id).then(res => {
          if (res.return_result) {
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            this.getAllTags()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getAllTags()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.listQuery.page_no = 1
        this.getAllTags()
      }
    },
    watch: {
      '$route': {
        handler(val) {
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.memberTagPage {
  padding: 50px;
}
  .color-2777ff{
    color: #2777FF
  }
  .gift-list-index {
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
  @import "../new-theme-css";
</style>
