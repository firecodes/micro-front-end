<template>
  <div class="importPage">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="file_import_pattern_name"
        label="File import"
        width="180">
        <template slot-scope="scope">
          <div>
            <span style="color:rgb(0, 153, 255);">{{scope.row.file_import_pattern_name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="file_template_name"
        label="File template"
        width="180">
      </el-table-column>
      <el-table-column
        prop="file_source"
        label="File source">
      </el-table-column>
      <el-table-column
        prop="file_name_regular_pattern"
        label="File name pattern">
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.status">Active</span>
            <span v-else style="color: red">inActive</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="cron_expression"
        label="Schedule">
      </el-table-column>
      <el-table-column
        prop="address"
        label="Operation">
        <template slot-scope="scope">
          <div style="color: rgb(0, 153, 255);">
            <!-- <router-link to="/configuration/import1/edit">Edit</router-link> -->
            <span @click="clickEdit(scope.row)" class="pointer">Edit</span>
            <span>|</span>
            <span @click="clickDisable(scope.row.status, scope.row.file_import_pattern_id)" class="pointer">{{scope.row.status ? 'Disable' : 'Enable'}}</span>
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
import { Message } from 'element-ui'
import { importQuery, patternStatus } from '@/api/configuration'
import { mapMutations } from 'vuex'
export default {
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
  methods: {
    ...mapMutations({
      setEditItem: 'SET_EDIT_ITEM'
    }),
    clickEdit(obj) {
      this.setEditItem(obj)
      sessionStorage.setItem('import', JSON.stringify(obj))
      this.$router.push('/configuration/import1/edit')
    },
    clickDisable(status, id) {
      this.loading = true
      patternStatus({ activate: !status, file_import_pattern_id: id }).then(res => {
        this.loading = false
        if (res.return_result) {
          this.init()
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch(err => {
        this.loading = false
        Message({ message: err, type: 'error' })
      })
    },
    init() {
      this.loading = true
      importQuery({ asc: true, page_no: this.listQuery.page_no, page_size: this.listQuery.page_size }).then(res => {
        const ret = res.return_result
        this.loading = false
        if (ret) {
          this.tableData = ret.results
          this.total_page = ret.total_page
          this.total = ret.total_count
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch((err) => {
        Message({ message: err, type: 'error' })
        this.loading = false
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
.importPage {
  margin: 29px 24px;
}
.pointer {
  cursor: pointer;
}
</style>
