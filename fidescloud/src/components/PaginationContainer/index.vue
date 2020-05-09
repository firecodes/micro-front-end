<!--分页-->
<template>
  <div class="pagination-container" v-if="total > 0">
    <!--<el-pagination-->
      <!--layout="slot"-->
    <!--&gt;-->
      <!--<div class="total-btn">{{handleGlobalI18n('system', 'total')}} {{total}}</div>-->
    <!--</el-pagination>-->
    <!--<el-pagination-->
      <!--background-->
      <!--@current-change="handleCurrentChange"-->
      <!--:current-page="page"-->
      <!--:page-size="page_size"-->
      <!--layout="total,slot,prev"-->
      <!--:total="total"-->
    <!--&gt;-->
      <!--<div class="first-pager">首页</div>-->
    <!--</el-pagination>-->
    <!--<el-pagination-->
      <!--background-->
      <!--@current-change="handleCurrentChange"-->
      <!--:current-page="page"-->
      <!--:page-size="page_size"-->
      <!--layout="prev, pager,next,slot"-->
      <!--:total="total"-->
    <!--&gt;-->
      <!--<div class="last-pager">末页</div>-->
    <!--</el-pagination>-->
    <!--<el-pagination-->
      <!--background-->
      <!--@current-change="handleCurrentChange"-->
      <!--:current-page="page"-->
      <!--:page-size="page_size"-->
      <!--layout="slot"-->
      <!--:total="total"-->
    <!--&gt;-->
      <!--<div class="ensure-btn">确定</div>-->
    <!--</el-pagination>-->
    <el-pagination
      background
      @size-change = "handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="page_size"
      :layout="layout"
      :page-sizes="page_sizes"
      :total="total"><!--sizes-->
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
        default: 'total, sizes , prev, pager, next, jumper'
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
