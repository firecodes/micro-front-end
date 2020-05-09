<!--年-->
<template>
  <div id="year">
    <el-select v-model="year">
      <el-option
        :key="item.value"
        :label="item.name"
        :value="item.value"
        v-for="item in data"
      />
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    nYear: {
      type: String
    }
  },
  data() {
    return {
      year: "",
      data: []
    };
  },
  created() {
    // 获取当前年份
    var myDate = new Date();
    const nYear = myDate.getFullYear();
    const minYear = 1900;
    // 初始化年份
    for (var i = nYear; i > minYear; i--) {
      this.data.push({
        name: i,
        value: i.toString()
      });
    }
  },
  watch: {
    year() {
      this.$emit("setYear", this.year);
    },
    nYear: {
      handler() {
        this.year = this.nYear;
      },
      immediate: true
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-select {
  width: 130px;
}
</style>
