<template>
  <div class="redemption">
    <redemptionlist></redemptionlist>
  </div>
</template>

<script>
import Redemptionlist from '@/views/loyalty/redemption/redemption-list/index'
export default {
  components: {
    Redemptionlist
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .redemption{
      background: #fff;
      margin: 15px 20px;
      padding: 15px;
  }
</style>
