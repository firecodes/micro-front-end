<template>
  <div>
    <h1>这是portal项目产品列表页面</h1>
    <el-button type="primary" @click="skip('/')">portal-首页</el-button>
    <el-button type="primary" @click="skip('/about')"
      >portal-关于页面</el-button
    >
  </div>
</template>
<script>
export default {
  methods: {
    skip(href) {
      this.$router.push(href);
      // window.history.pushState({}, null, href);
    }
  }
};
</script>
