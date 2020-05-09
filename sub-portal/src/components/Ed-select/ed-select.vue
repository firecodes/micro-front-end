<!--select-->
<template>
  <div class="ed-select">
    <slot />
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
.ed-select {
  /deep/ .el-select .el-input.is-focus .el-input__inner {
    border-color: $new-primary;
  }
  /deep/ .el-select .el-input__inner:focus {
    border-color: $new-primary;
  }
}
</style>
