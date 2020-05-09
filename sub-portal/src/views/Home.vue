<template>
  <div>
    <h1>这是portal项目首页</h1>
    <el-button type="primary" @click="skip('/about')"
      >portal-关于页面</el-button
    >
    <el-button type="primary" @click="skip('/product')"
      >portal-产品列表页面</el-button
    >
    <el-button type="primary" @click="skip('/product/details/1')"
      >portal-产品详情页面</el-button
    >
  </div>
</template>
<script>
export default {
  methods: {
    skip(href) {
      console.log(11223, href);
      this.$router.push(href);
    }
  }
};
</script>
