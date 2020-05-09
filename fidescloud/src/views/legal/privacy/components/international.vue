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
// import { International } from './international-privacy'
import { PrivacyInternational } from '@/data/privacy/privacy-international'
export default {
  name: '',
  data() {
    return {
      content: PrivacyInternational
    }
  }
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
