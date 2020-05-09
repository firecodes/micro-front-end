<template>
  <div class="ed-form">
    <slot />
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .ed-form{
    /deep/ .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before{
      color: #333333;
    }
    /deep/ .el-form-item--medium .el-form-item__label{
      font-family: Helvetica-medium-1;
      font-size:14px;
      font-weight: bold;
      color:rgba(51,51,51,1);
    }
    /deep/ .el-input__inner:focus, /deep/ .el-textarea__inner:focus, /deep/ .el-range-editor.is-active, /deep/ .el-select .el-input.is-focus .el-input__inner, /deep/ .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled), /deep/ .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled){
      border-color: $new-primary;
    }
    /deep/ .el-form-item__error{
      padding-top: 0;
      font-size:12px;
      display: flex;
      align-items: center;
      font-family: HelveticaNeue1-Bold;
      color:rgba(213,0,0,1);
      &:before{
        font-family: "iconfont";
        content: '\e727';
        font-size: 14px;
        margin-right: 4px;
      }
    }
    /deep/ .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus{
      border-color: #D50000;
    }

    /*checkbox*/
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
      background: $new-primary!important;
      color: $new-primary!important;
      border-color: $new-primary!important;
    }
    /deep/ .el-checkbox__inner {
      width:14px;
      height:14px;
      background:linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(237,237,237,1) 100%);
      border-radius:2px;
      border:1px solid rgba(151,151,151,1);
    }
    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label, /deep/ .el-input-number__increase:hover, .el-input-number__decrease:hover{
      color: $new-primary;
    }
    /deep/ .el-checkbox__label{
      font-size:14px;
      font-family: HelveticaNeue1;
    }
    /deep/ .el-textarea__inner:focus{
      border-color: $new-primary;
    }


    /*
      radio
    */
    /deep/ .el-radio__inner{
      width: 20px!important;
      height: 20px!important;
      background:linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(237,237,237,1) 100%);
      border:1px solid rgba(151,151,151,1);
    }
    /deep/ .el-radio__input.is-checked + .el-radio__label, .el-checkbox__input.is-checked + .el-checkbox__label{
      color: #333;
    }
    /deep/ .el-radio__label{
      font-family: Helvetica-medium-1;
      font-size:14px;
      color: #999;
    }
    /deep/ .el-radio__input.is-checked .el-radio__inner{
      background-color: #fff;
      &:after{
        width: 12px;
        height: 12px;
        border-radius: 12px;
        background-color: $new-primary;
      }
    }
    /deep/ .el-textarea__inner:focus{
      border-color: $new-primary;
    }
  }
</style>
