<!--操作按钮的背景-->
<template>
  <div class="operate-button">
    <slot></slot>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
.operate-button {
  background-color: $--operate-bg-color;
  padding: 8px 14px 8px 14px;
  display: flex;
  justify-content: flex-end;
}
</style>
