<template>
  <div class="international-comp">
    <!-- <div style="height: 100vh;">
      <el-scrollbar style="height:100%;"> -->
        <div class="main-body" v-html="content">
        </div>
      <!-- </el-scrollbar>
    </div> -->
  </div>
</template>

<script>
import { PrivacyCn } from '@/data/privacy/cn'
export default {
  name: '',
  data() {
    return {
      content: PrivacyCn
    }
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.international-comp {
  color: #333;
  margin-bottom: 50px;
  /deep/ p {
    line-height: 22px
  }
  .main-body {
      padding: 30px 20px 0px 30px;
  }
}
</style>
