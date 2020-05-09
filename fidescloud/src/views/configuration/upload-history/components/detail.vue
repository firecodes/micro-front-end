<template>
  <div class="uploadHistoryDetail" v-loading="loading">
    <button class="el-button el-button--primary el-button--medium back-btn" @click="back">Back</button>
    <div class="top">
      <Header1 :content="header" />
      <!-- <Header2 /> -->
    </div>
    <div class="executionDetailsPanel">
      <div class="top-panel">
        <p>Execution Details</p>
        <el-select v-model="statusValue" placeholder="" @change="change(statusValue)">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="bottom-panel">
        <!-- <p>Showing：1-10&nbsp;of 2000</p> -->
        <div class="download-btn pointer" @click="download"><i class="el-icon-download"></i> Download this file</div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;marginTop: 20px;">
        <el-table-column
          align="center"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="sourcedata"
          label="Source Data">
          <template slot-scope="scope">
            <div class="">
              <el-row :gutter="20">
                <el-col :lg="4" :md="12" :sm="12" :xs="24" v-for="(value, key) in scope.row.sourcedata" :key="key">
                  <span>{{key}}:  <span>{{value}}</span></span>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="180"
          label="Status">
          <template slot-scope="scope">
            <div>
              <i v-if="scope.row.status" class="el-icon-check"></i>
              <i v-else class="el-icon-close"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="reason"
          width="180"
          label="Remark">
        </el-table-column>
      </el-table>
      <pagination-container
        :page = "listQuery.page_no"
        :page_size = 'listQuery.page_size'
        :total = 'total'
        :page_sizes = 'page_sizes'
        @handleCurrentChange = "handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination-container>
    </div>
  </div>
</template>

<script>
import PaginationContainer from '@/components/PaginationContainer'
import { executionQuery, downloadFile } from '@/api/configuration'
import { Message } from 'element-ui'
import Header1 from './header1'
import Header2 from './header2'
export default {
  components: {
    Header1,
    Header2,
    PaginationContainer
  },
  data() {
    return {
      page_sizes: [15, 20, 30, 40, 50],
      total_page: 0,
      total: null,
      listQuery: {
        page_size: 15,
        page_no: 1
      },
      tableData: [],
      statusList: [
        {
          value: null,
          label: 'All Status'
        },
        {
          value: 0,
          label: 'Pending'
        },
        {
          value: 1,
          label: 'Progress'
        },
        {
          value: 4,
          label: 'Completed'
        },
        {
          value: -4,
          label: 'System Error'
        }
      ],
      statusValue: null,
      header: {},
      loading: true
    }
  },
  created() {
    this.renderHeader()
    this.getDatail()
  },
  methods: {
    download() {
      let tmp = this.statusValue
      tmp = tmp === null ? undefined : tmp
      downloadFile(`/batch/file/download/execution/${this.$route.params.id}/${tmp}`).then(res => {
        if (res.return_result) {
          const url = res.return_result.url
          const link = document.createElement('a')
          link.href = url
          link.target = '_blank'
          link.setAttribute('download', 'file.pdf')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }).catch(err => {
        Message({ message: err, type: 'error' })
      })
    },
    change(val) {
      this.getDatail(val)
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      this.getDatail(this.statusValue)
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getDatail(this.statusValue)
    },
    renderHeader() {
      const detail = JSON.parse(sessionStorage.getItem('detail'))
      if (Object.keys(detail).length <= 0) return
      this.header = detail
    },
    back() {
      this.$router.push('/configuration/upload-history')
    },
    getDatail(status = '') {
      this.loading = true
      const params = this.$route.params
      executionQuery({
        asc: true,
        file_id: params.id,
        page_no: this.listQuery.page_no,
        page_size: this.listQuery.page_size,
        status
      }).then(res => {
        this.loading = false
        if (res.return_result) {
          const arr = []
          if (res.return_result.results.length > 0) {
            res.return_result.results.forEach((item, idx) => {
              const obj = {}
              obj['sourcedata'] = JSON.parse(res.return_result.results[idx].row_detail)
              obj['status'] = item.status
              obj['reason'] = item.reason
              arr.push(obj)
            })
          }
          this.tableData = arr
          this.total = res.return_result.total
          this.total_page = res.return_result.total_page
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch(err => {
        this.loading = false
        Message({ message: err, type: 'error' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadHistoryDetail {
  margin: 29px 24px;
  .back-btn {
    margin-bottom: 30px;
  }
  .top {
    background-color: #fff;
    padding: 10px;
    .title {
      margin-bottom: 20px;
    }
  }
  .executionDetailsPanel {
    margin-top: 20px;
    background-color: #fff;
    padding: 10px;
    .top-panel, .bottom-panel {
      display: flex;
      justify-content: space-between;
    }
    .bottom-panel {
      margin-top: 10px;
      .download-btn {
        width: 185px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        text-align: center;
        color: rgba(25, 137, 250, 1);
        border: 1px solid rgba(25, 137, 250, 1);
      }
    }
  }
  .pointer {
    cursor: pointer;
  }
}
</style>
