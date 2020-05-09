<!--月-->
<template>
  <div id="month">
    <el-select clearable v-model="month">
      <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in list" />
    </el-select>
  </div>
</template>
<script>
  export default {
    props: {
      nMonth: {
        type: String
      }
    },
    data() {
      return {
        month: '',
        list: []
      }
    },
    created() {
      // 初始化年份
      for (var i = 1; i <= 12; i++) {
        this.list.push({
          name: i.toString().padStart(2, '0'),
          value: i.toString().padStart(2, '0')
        })
      }
    },
    watch: {
      month() {
        this.$emit('setMonth', this.month)
      },
      nMonth: {
        handler() {
          this.month = this.nMonth
        },
        immediate: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-select{
    width: 130px;
  }
</style>
