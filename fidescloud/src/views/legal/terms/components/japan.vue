<template>
  <div class="japanTerms">
    <!-- <div style="height: 100vh;">
      <el-scrollbar style="height:100%;"> -->
        <div class="main-body" v-html="content">
        </div>
      <!-- </el-scrollbar>
    </div> -->
  </div>
</template>

<script>
import { TcJapan } from '@/data/terms/tc-japan'
export default {
  data() {
    return {
      content: TcJapan
    }
  }
}
</script>

<style lang='scss' scoped>
.japanTerms {
  margin-bottom: 50px;
}
.japanTerms /deep/ .title {
  font-size: 20px;
  font-weight: bold;
  margin: 30px 0;
}
.japanTerms /deep/ .main-body {
  padding: 0 30px;
}
.japanTerms /deep/ .text-center {
  text-align: center;
}
.japanTerms /deep/ .bold-text {
  color: #323232;
  font-weight: bold;
}
.japanTerms /deep/ .text-underline {
  text-decoration: underline;
}
</style>
