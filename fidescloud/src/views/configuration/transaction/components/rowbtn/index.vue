<template>
  <el-button plain class="table-operation-btn" @click="() => this.$emit('click')">
    <slot></slot>
  </el-button>  
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang='scss' scoped>
.table-operation-btn {
  padding: 7px 16px;
  height:30px;
  background:rgba(74,144,226,0.07);
  border-radius:4px;
  /deep/ span {
    font-size:14px;
    color: #2777FF;
  }
}
</style>