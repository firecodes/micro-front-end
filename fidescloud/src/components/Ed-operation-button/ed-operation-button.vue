<template>
  <div class="ed-operation-button">
    <label>
      <slot />
    </label>
  </div>
</template>
<script>
  export default {
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .ed-operation-button{
    display: inline-block;
    min-width:80px;
    height:30px;
    color:rgba(39,119,255,1);
    background:rgba(74,144,226,0.07);
    border-radius:4px;
    label{
      font-size:14px;
      // font-family: HelveticaNeue1;
      min-width:80px;
      height: 30px;
      border-radius:4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover{
        border:1px solid $new-primary;
      }
    }
  }
</style>
