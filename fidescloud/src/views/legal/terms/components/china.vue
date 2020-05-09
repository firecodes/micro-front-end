<template>
  <div class="china-comp">
    <!-- <div style="height: 100vh;">
      <el-scrollbar style="height:100%;"> -->
        <div class="tc-china-main-body" v-html="content">
        </div>
      <!-- </el-scrollbar>
    </div> -->
  </div>
</template>

<script>
import { TcChina } from '@/data/terms/tc-china'
export default {
  name: '',
  data() {
    return {
      content: TcChina
    }
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.china-comp {
  color: #333;
  margin-bottom: 50px;
  .tc-china-main-body {
    padding: 30px 20px 0px 30px;
  }
  /deep/ p {
    line-height: 22px;
    margin-bottom: 15px;
    &:nth-last-of-type(1) {
      margin-bottom: 0px;
    }
  }
  /deep/ b {
    font-weight: bold !important;
  }
}
</style>
