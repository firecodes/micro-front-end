<template>
  <div class="home">
    <h1>这是主应用的首页</h1>
    <button type="primary" @click="skip">click</button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  components: {},
  methods: {
    skip() {
      window.history.pushState({}, "portal", "/portal/about");
      if (!window.sessionStorage.getItem("crossRoute")) {
        location.reload();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  text-align: center;
  padding-top: 100px;
}
</style>
