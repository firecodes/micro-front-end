<template>
  <div class="ed-dialog">
    <slot />
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .ed-dialog{
    /deep/ .el-dialog__header{
      height:60px;
      text-align: left;
      background:rgba(249,249,249,1);
    }
    /deep/ .el-dialog__title{
      line-height: 40px;
    }
    /deep/ .el-dialog__headerbtn{
      top: 20px;
      line-height: 20px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background:rgba(153,153,153,1);
      .el-dialog__close{
        color: #ffffff;
        line-height: 20px;
      }
    }
    .dialog-footer{
      .cancel{
        background-color: #ffffff;
        border-color: $new-primary;
        color: $new-primary;
        min-width: 88px;
      }
      .confirm{
        background-color: $new-primary;
        border-color: $new-primary;
        min-width: 88px;
      }
    }

  }
</style>
