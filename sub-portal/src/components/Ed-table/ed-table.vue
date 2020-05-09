<!--新的table组件
  type === '1'  height: 40px;
-->
<template>
  <div :class="{ type1: type === '1' }" class="ed-table">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.ed-table {
  font-family: Helvetica-medium-1, sans-serif;
  box-shadow: 0 5px 15px -3px #cccccc;
  /deep/ .el-table__header {
    background-color: #ecf4ff;
  }
  /deep/ .el-table__header th,
  .el-table__header-wrapper {
    background: rgba(236, 244, 255, 1) !important;
    font-size: 16px;
    line-height: 19px;
    height: 68px !important;
    font-weight: 500 !important;
    color: rgba(51, 51, 51, 1) !important;
  }
  /deep/ .el-table__row {
    &:hover {
      td {
        background: rgba(249, 249, 249, 1) !important;
        box-shadow: 20px 5px 20px 5px rgba(204, 204, 204, 0.46) !important;
      }
    }
  }
  /deep/ td {
    height: 68px !important;
  }
  /deep/ .el-table__body .current-row > td {
    background-color: #ffffff !important;
  }
  /deep/ .el-table__body td {
    transition: none !important;
  }
  /deep/ .el-checkbox__inner {
    width: 20px !important;
    height: 20px !important;
    &:after {
      top: 1.8px;
      height: 10px;
      left: 6px;
      width: 5px;
    }
  }
  /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    background-color: #2777ff;
    height: 6px;
    right: 0;
    top: 6px;
  }
}
.type1 {
  /deep/ .el-table__header th,
  .el-table__header-wrapper {
    height: 40px !important;
  }
  /deep/ td {
    height: 40px !important;
  }
}
</style>
