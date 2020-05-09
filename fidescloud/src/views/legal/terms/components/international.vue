<template>
  <div class="international-comp">
    <!-- <div style="height: 100vh;">
      <el-scrollbar style="height:100%;"> -->
        <div class="tc-inter-main-body" v-html="newContent">
        </div>
      <!-- </el-scrollbar>
    </div> -->
  </div>
</template>

<script>
// import { International } from './international-terms'
import { TcInternational } from '@/data/terms/tc-international'
export default {
  name: '',
  data() {
    return {
      newContent: TcInternational
    }
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.international-comp {
  color: #333;
  margin-bottom: 50px;
  .tc-inter-main-body {
    padding: 30px 20px 0px 30px;
  }
  /deep/ p {
    line-height: 22px;
    margin-bottom: 15px;
  }
}
</style>
