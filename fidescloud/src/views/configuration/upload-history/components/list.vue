<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="file_name"
        label="File Name"
        width="180">
        <template slot-scope="scope">
          <a v-if="scope.row.file_name" target="_blank" :href="scope.row.file_download_url">{{scope.row.file_name}} <i style="color: #1989FA;" class="el-icon-download"></i></a>
          <span v-else>{{'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="file_import_pattern_name"
        label="File Pattern Name"
        width="180">
        <template slot-scope="scope">
          {{scope.row.file_import_pattern_name ? scope.row.file_import_pattern_name : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="file_source"
        label="File Source">
        <template slot-scope="scope">
          {{scope.row.file_source ? scope.row.file_source : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="Start/End Time">
        <template slot-scope="scope">
          {{scope.row.process_start_time | formatDate(true)}} / {{scope.row.process_end_time | formatDate(true)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status">
        <template slot-scope="scope">
          <span :style="{color: (scope.row.status === 2 || scope.row.status === -4) ? 'red' : ''}">{{scope.row.status | filterStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="errors"
        label="Total Errors">
        <template slot-scope="scope">
          <span :style="{color: scope.row.failed_count > 0 ? 'red' : ''}">{{scope.row.failed_count === null ? '-' : scope.row.failed_count}}</span> / {{scope.row.total_count === null ? '-' : scope.row.total_count}}
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="Operation">
        <template slot-scope="scope">
          <div style="color: #1989FA;" class="pointer">
            <span @click="detail(scope.row, scope.row.file_id)">Detail</span>
          </div>
        </template>
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
</template>

<script>
import PaginationContainer from '@/components/PaginationContainer'
import { fileQuery } from '@/api/configuration'
import { Message } from 'element-ui'
export default {
  props: {
    content: {
      type: Object
    }
  },
  components: {
    PaginationContainer
  },
  data() {
    return {
      loading: true,
      page_sizes: [15, 20, 30, 40, 50],
      total_page: 0,
      total: null,
      listQuery: {
        page_size: 15,
        page_no: 1
      },
      tableData: []
    }
  },
  created() {
    this.init()
  },
  watch: {
    content: {
      handler(newV, oldV) {
        if (newV) {
          this.init(newV)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    detail(scope, id) {
      sessionStorage.setItem('detail', JSON.stringify(scope))
      this.$router.push(`/configuration/upload-history/detail/${id}`)
    },
    init(arg) {
      this.loading = true
      fileQuery({
        ...arg,
        asc: true,
        page_no: this.listQuery.page_no,
        page_size: this.listQuery.page_size
      }).then(res => {
        this.loading = false
        if (res.return_result) {
          this.tableData = res.return_result.results
          this.total = res.return_result.total_count
          this.total_page = res.return_result.total_page
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch(err => {
        this.loading = false
        Message({ message: err, type: 'error' })
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      this.init()
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
