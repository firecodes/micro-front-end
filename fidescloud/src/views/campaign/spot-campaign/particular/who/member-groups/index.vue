<template>
  <div class="spot_campaign_who_member_group" ref="MemberGroups" v-loading="member_group_loading">
    <el-form-item label=" " label-width="0">
      <div class="search">
        <el-input :placeholder="$t('campaign.fc_campaign_spot_create_who_search_content_label')" v-model="list_query.group_or_tag_name" />
        <el-button @click="getList" type="primary">{{$t('campaign.fc_campaign_spot_create_who_btn_search_label')}}</el-button>
      </div>
      <ed-table>
        <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" :row-key="getRowKeys" @selection-change="handleSelectionChange" ref="member_tags_table" style="width: 100%">
          <!--选择-->
          <el-table-column
            :reserve-selection="true"
            align="center"
            type="selection"
            width="90">
          </el-table-column>
          <!--Group name-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_group_table_name_label')" align="center">
            <template slot-scope="scope">
              {{scope.row.group_name || table_placeholder}}
            </template>
          </el-table-column>
          <!--Member tags-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_group_table_tags_label')" align="center" width="300">
            <template slot-scope="scope" v-if="scope.row.tag_names">
              <div class="flex">
                <template v-for = "item in handleMemberTagsShow(scope.row.tag_names, 1)">
                  <p class="member_tags_li margin-right-8"><label><ed-clamp :max-lines="1" autoresize>{{item}}</ed-clamp></label></p>
                </template>
                <el-popover
                  placement="top"
                  popper-class="tags_popver"
                  trigger="hover"
                  v-if="show_member_tags_length < scope.row.tag_names.length" width="400">
                  <template v-for = "item in handleMemberTagsShow(scope.row.tag_names, 2)">
                    <p class="member_tags_li margin-right-8"><label><ed-clamp :max-lines="1" autoresize>{{item}}</ed-clamp></label></p>
                  </template>
                  <div slot="reference">
                    <p class="member_tags_li cursor-pointer"><label style="margin-top: -6px;">...</label></p>
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <!--Number-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_group_table_number_label')" align="center">
            <template slot-scope="scope">
              {{scope.row.member_num || 0}}
            </template>
          </el-table-column>
          <!--Created date-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_group_table_created_label')" align="center">
            <template slot-scope="scope">
              {{ globalData.formatDate( formatTimeStamp(scope.row.create_date).substr(0, 10)) }}
            </template>
          </el-table-column>
          <!--Update date-->
          <el-table-column :label="$t('campaign.fc_campaign_spot_create_group_table_update_label')" align="center">
            <template slot-scope="scope">
              {{ globalData.formatDate( formatTimeStamp(scope.row.modify_date).substr(0, 10)) }}
            </template>
          </el-table-column>
        </el-table>
      </ed-table>
      <pagination-container
      :page = "list_query.page_no"
      :page_size = 'list_query.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      layout="total, prev, pager, next, jumper"
     />
    </el-form-item >
  </div>
</template>
<script>
import PaginationContainer from '@/components/PaginationContainerNew'
import { queryMemberGroupList } from '@/api/member'
const moment = require('moment')
export default {
  components: {
    PaginationContainer
  },
  props: {
    target: {
      type: Object
    }
  },
  watch: {
    table_data() {
      this.init()
    }
  },
  data() {
    return {
      member_group_loading: true,
      table_data: [],
      select_list: [],
      total: 0,
      tags_content: [],
      show_member_tags_length: 1,
      list_query: {
        page_no: 1,
        page_size: 3,
        asc: false,
        group_or_tag_name: '',
        group_type: 1
      }
    }
  },
  created() {
    this.tags_content = this.target && this.target.tags_content ? JSON.parse(this.target.tags_content) : []
    this.getList()
  },
  methods: {
    handleMemberTagsShow(item, id) {
      if (id === 1) {
        return item.slice(0, this.show_member_tags_length)
      } else if (id === 2) {
        return item.slice(this.show_member_tags_length)
      }
    },
    init() {
      if (this.target && this.tags_content.length > 0) {
        setTimeout(() => {
          for (var item of this.table_data) {
            if (this.tags_content.indexOf(item.group_id) > -1) {
              this.$refs.member_tags_table && this.$refs.member_tags_table.toggleRowSelection(item, true)
              this.tags_content.splice(this.tags_content.indexOf(item.group_id), 1)
            }
          }
        }, 400)
      }
    },
    formatTimeStamp(dataStr, pattern = 'YYYY-MM-DD') {
      if (dataStr) {
        return moment(dataStr).format(pattern)
      } else {
        return '-'
      }
    },
    getList() {
      this.member_group_loading = true
      queryMemberGroupList(this.list_query).then(res => {
        this.member_group_loading = false
        var result = res.return_result
        this.table_data = result.results || []
        this.total = result.total_count || 0
        this.init()
      }).catch(res => {
        this.member_group_loading = false
      })
    },
    getRowKeys(row) {
      return row.group_id
    },
    handleSelectionChange(rows) {
      this.select_list = rows
    },
    handleCurrentChange(val) {
      this.list_query.page_no = val
      this.getList()
    },
    handleSelectGroupIds() {
      var arr = []
      if (this.select_list.length > 0) {
        for (var item of this.select_list) {
          arr.push(item.group_id)
        }
      }
      return JSON.stringify(arr)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.spot_campaign_who_member_group{
  margin-left: -20px;
  margin-right: -20px;
  .flex{
    display: flex;
    justify-content: center;
  }
  .margin-right-8{
    margin-right: 8px;
  }
  /deep/ .member_tags_li{
    min-width:80px;
    max-width: 190px;
    height:30px;
    background:rgba(74,144,226,0.07);
    border-radius:15px;
    border:1px solid rgba(39,119,255,1);
    font-size:14px;
    font-family: Helvetica-medium-1;
    color:rgba(39,119,255,1);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    label{
      margin:0 15px;
    }
  }
  .search{
    display: flex;
    align-items: center;
    .el-input{
      width: 480px;
    }
    .el-button{
      margin-left: 10px;
      background-color: $new-primary;
      border-color: $new-primary;
      color: #ffffff
    }
  }
  .ed-table{
    box-shadow: none!important;
  }
  .el-table{
    margin-top: 12px;
  }
}
</style>
