<template>
  <div class="list">
    <ed-table>
       <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="payment"
          label="Payment"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="postage"
          label="Postage"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="cash"
          label="Cash"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="discount"
          label="Discount"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="gwp"
          label="GWP"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="refund"
          label="Refund"
          align="center"
        >
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page_no"
          :page-sizes="[10,20,30,40,50]"
          :page-size="listQuery.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </ed-table>
  </div>
</template>

<script>
import EdTable from '@/components/Ed-table/ed-table'
import OperationBtn from '../rowbtn/index'
export default{
  components: {
    EdTable,
    OperationBtn
  },
  data() {
    return {
      listQuery: {
        page_no: 1,
        page_size: 15
      },
      total: 1,
      tableData: [
        {
          payment: 1,
          postage: 2,
          cash: 3,
          discount: 4,
          gwp: 5,
          refund: 5
        }
      ]
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>

<style lang='scss' scoped>
.list {
  // padding-top: 20px;
  .el-pagination {
    padding: 20px;
    text-align: center;
    background-color: #fff;
  }
}
</style>