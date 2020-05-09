<template>
  <div>
    <el-table
      v-loading="loading1"
      :data="this.getList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="field_name"
        label="Field Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="field_type"
        label="Field Type"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mandatory"
        width="180"
        label="Mandatory">
        <template slot-scope="scope">
          <div>
            {{scope.row.mandatory ? 'Yes' : 'No'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="unique"
        label="Unique Field">
        <template slot-scope="scope">
          <div>
            {{scope.row.unique ? 'Yes' : 'No'}}
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
export default {
  props: {
    loading1: {
      type: Boolean,
      default: true
    },
    content: {
      type: Array,
      default: []
    }
  },
  components: {
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
      tableData: this.getList
    }
  },
  computed: {
    getList() {
      this.tableData = [...this.content]
      return this.tableData
    }
  },
  methods: {
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

<style lang="scss" scoped>

</style>
