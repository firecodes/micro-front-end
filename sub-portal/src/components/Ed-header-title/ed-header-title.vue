<template>
  <div class="ed-header-title">
    <h1>{{ title }}</h1>
    <slot name="right-content"></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
      required: true
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.ed-header-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 100%;
  h1 {
    font-family: Helvetica-medium-1;
    padding-left: 20px;
    font-size: 18px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    position: relative;
    line-height: 50px;
    &:before {
      content: "";
      width: 4px;
      height: 20px;
      background: rgba(39, 119, 255, 1);
      position: absolute;
      left: 0;
      top: 15px;
    }
  }
}
</style>
