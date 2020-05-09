<template>
  <div class="japanPrivacy">
    <!-- <div style="height: 100vh;">
      <el-scrollbar style="height:100%;"> -->
        <div class="main-body" v-html="content">
        </div>
      <!-- </el-scrollbar>
    </div> -->
  </div>
</template>

<script>
import { PrivacyJa } from '@/data/privacy/ja'
export default {
  data() {
    return {
      content: PrivacyJa
    }
  }
}
</script>

<style lang='scss' scoped>
.japanPrivacy {
  margin-bottom: 50px;
}
.japanPrivacy /deep/ .text-center {
  text-align: center;
}
.japanPrivacy /deep/ .title {
    font-size: 20px;
    font-weight: bold;
    margin: 0px 0;
  }
 .japanPrivacy /deep/ .main-body {
    padding: 30px 30px 0px 30px;
  }
.japanPrivacy /deep/ .bold-text {
  color: #323232;
  font-weight: bold;
}
.japanPrivacy /deep/ .text-underline {
  text-decoration: underline;
}
</style>
