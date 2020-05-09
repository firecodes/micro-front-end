<template>
  <div class="coupon" style="padding:20px;">
      <div style="padding-bottom:20px;">
        <el-input style="width: 500px;" class="filter-item" :placeholder="$t('campaign.fc_campaign_history_view_how_mobile_label')" v-model="quick_search">
        </el-input>
        <el-button type="primary" icon="el-icon-search" style="margin-bottom:10px" @click="search">添加黑名单</el-button>
        <el-input style="width: 500px;" class="filter-item" :placeholder="$t('campaign.fc_campaign_history_view_how_mobile_label')" v-model="mobile">
        </el-input>
        <el-button type="primary" icon="el-icon-search" style="margin-bottom:10px" @click="searchBlack">查询黑名单</el-button>
      </div>
    <el-table :data="tableData" v-loading="listloading" border :empty-text="$t('member.fc_table_no_data_label')">
     <!--member code-->
        <el-table-column prop="member_code" align="center" width="130" :label="$t('member.fc_member_query_table_code_label')">
          <!-- <template slot-scope="scope">
            <div style="cursor:pointer;color:#0099ff" @click="toMemberDetails(scope.row.member_code)">
              {{ scope.row.member_code }}
            </div>
          </template> -->
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
        <el-table-column :label="handleGlobalI18n('loyalty', 'member_name')" prop="full_name" width="140" align="center">
          <template slot-scope="scope">
            {{ scope.row.full_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--mobile-->
        <el-table-column prop="mobile" align="center" width="140" :label="$t('member.fc_member_query_table_mobile_label')" >
          <template slot-scope="scope">
            {{ scope.row.mobile || table_placeholder }}
          </template>
        </el-table-column>
        <!--tier-->
        <el-table-column prop="member_tier_name" align="center" width="140" :label="$t('member.fc_member_query_table_tier_label')" >
          <template slot-scope="scope">
            {{ scope.row.member_tier_name || table_placeholder }}
          </template>
        </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'operation')" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            @click="handleRemove(scope.row, scope.$index)">移出
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></pagination-container>

    <el-dialog title="会员信息" :visible.sync="dialogTableVisible">
    <el-table :data="gridData">
        <el-table-column prop="member_code" align="center" width="100" :label="$t('member.fc_member_query_table_code_label')">
        </el-table-column>
        <el-table-column property="mobile" label="手机号" width="150"></el-table-column>
        <el-table-column property="full_name" label="会员名" width="100"></el-table-column>
        <!-- <el-table-column property="address" label="地址"></el-table-column> -->
        <el-table-column :label="handleGlobalI18n('loyalty', 'operation')" align="center">
        <template slot-scope="scope">
                <el-button type="success" plain @click="handleAdd(scope.row,scope.$index)">添加</el-button>
        </template>
        </el-table-column>
    </el-table>
    </el-dialog>
  </div>
</template>


<script>
import PaginationContainer from '@/components/PaginationContainer'
// import {
//   pageLimit
// } from '@/api/api'
import {
  removeBlack,
  insertBlack,
  queryBlacklist,
  queryBlackByMobile
} from '@/api/order'
import { quickQueryMemberBySearch } from '@/api/member'

export default {
  components: {
    PaginationContainer
    // AddProcuct,
  },
  data() {
    return {
      dialogTableVisible: false,
      gridData: [],
      queryList: {
        page_no: 1,
        page_size: 10
      },
      total: 0,
      tableData: [],
      quick_search: '',
      mobile: '',
      listQuery: {
        asc: true,
        page_size: 15,
        page_no: 1
      },
      listloading: false
    }
  },
  computed: {
    message() {
      return '这个页面你不能进......'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleAdd(row, index) {
      console.log(row)
      this.$alert('是否确认添加黑名单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const member_code_list = []
        member_code_list.push(row.member_code)
        // this.headers['signature'] = md5(`${guid}&${tstamp}&` + `${JSON.stringify({ 'bu_content': subOrder })}&`)
        //   this.loading = true
        insertBlack({ member_code_list: member_code_list }).then(res => {
          if (res.return_code === '2000') {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.dialogTableVisible = false
            this.getData()
          } else {
            this.dialogTableVisible = false
          }
          // this.loading = false
        }).catch(res => {
          // this.loading = false
        })
      }).catch(() => {

      })
    },
    searchBlack() {
      if (this.mobile === '') {
        this.getData()
      } else {
        this.listloading = true
        queryBlackByMobile({
          mobile: this.mobile
        }).then(res => {
          this.listloading = false
          if (res.return_code === '2000') {
            if (res.return_result.list_response.length) {
              const result = res.return_result
              this.tableData = res.return_result.list_response
              this.total = result.total_count
              this.total_page = result.total_page
            } else {
              this.tableData = []
            }
          } else {
            this.tableData = []
          }
        }).catch(ras => {
          this.listloading = false
          this.tableData = []
        })
      }
    },
    handleRemove(row, index) {
      this.$alert('是否确认移出黑名单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const newmember_code_list = []
        newmember_code_list.push(row.member_code)
        removeBlack({ member_code_list: newmember_code_list }).then(res => {
          this.$message({
            type: 'success',
            message: '移出成功'
          })
          this.getData()
          // this.loading = false
        }).catch(res => {
          // this.loading = false
        })
      }).catch(() => {

      })
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      this.getData()
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getData()
    },
    search() {
      if (this.quick_search !== '') {
        this.quick({ search_param: this.quick_search })
        this.dialogTableVisible = true
      }
    },
    getData() {
      this.listloading = true
      queryBlacklist(this.listQuery).then(res => {
        this.listloading = false
        console.log(res)
        const result = res.return_result
        this.tableData = res.return_result.list_response
        this.total = result.total_count
        this.total_page = result.total_page
      })
    },
    quick(form = {}, page_no = null) {
      // this.listLoading = true
      quickQueryMemberBySearch({ ...this.queryList, ...form }).then(res => {
        //   this.listLoading = false
        const result = res.return_result
        this.gridData = result.members
        //   this.total = result.total_count
        //   this.total_page = result.total_page
        //   this.select_type = 1
      }).catch(() => {
        //   this.listLoading = false
        //   if (page_no !== null) {
        //     this.listQuery.page_no = page_no - 1
        //   }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wscn-http404 {
  position: relative;
  width: 1200px;
  margin: 20px auto 60px;
  padding: 0 100px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    padding: 150px 0;
    overflow: hidden;
    &__parent {
      width: 100%;
    }
    &__child {
      position: absolute;
      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }
      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 150px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}

</style>
