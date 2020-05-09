<template>
  <div class="wrapper">
    <div class="sub-wrapper">
        <img :src="commingSoon" alt="" style="width: 450px;">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commingSoon: require('@/assets/images/comming-soon.png')
    }
  }
}
</script>

<style lang='scss' scoped>
.main-container {
  position: relative;
}
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-scrollbar__view {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
