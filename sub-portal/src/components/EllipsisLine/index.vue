<template>
  <div class="EllipsisLine">{{ list }}}</div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {};
  },
  computed: {
    list() {
      var countC = "";
      for (let i = 0; i < 1000; i++) {
        countC += ".";
      }
      return countC;
    }
  },
  methods: {}
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.ellipsisLine {
}
</style>
