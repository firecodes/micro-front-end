<!--分页-->
<template>
  <div class="pagination-container pagination-container-new" v-if="total > 0">
    <el-pagination
      background
      @size-change = "handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="page_size"
      :layout="layout"
      :page-sizes="page_sizes"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import {
    pageLimit
  } from '@/api/api'
  export default {
    props: {
      layout: {
        type: String,
        default: 'total, prev, pager, next, jumper'
      },
      page: {
        type: Number,
        default: 1
      },
      page_size: {
        type: Number,
        default: pageLimit
      },
      total: {
        type: Number,
        default: 1
      },
      page_sizes: {
        type: Array,
        default: function() {
          return [10, 20, 30, 40, 50]
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.$emit('handleCurrentChange', val)
      },
      handleSizeChange(val) {
        this.$emit('handleSizeChange', val)
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .pagination-container {
    text-align: right;
    padding: 15px 0;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .total-btn{
    color: #606266;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
<style rel="stylesheet" lang="scss">
  .pagination-container-new .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: $new-primary;
  }
  .pagination-container-new .el-pagination.is-background .el-pager li:not(.active):hover{
    color: $new-primary;
  }
  .pagination-container-new .el-pagination__sizes .el-input .el-input__inner:hover, .pagination-container-new .el-select .el-input.is-focus .el-input__inner, .pagination-container-new .el-select .el-input__inner:focus{
    border-color: $new-primary;
  }
</style>
