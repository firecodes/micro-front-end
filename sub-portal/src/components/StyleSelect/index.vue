<template>
  <el-dropdown
    trigger="click"
    class="style-select"
    @command="handleSetLanguage"
  >
    <div>
      <svg-icon class-name="font-skin" icon-class="font-skin" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="1" :disabled="ccstyle === '1'"
        >style1</el-dropdown-item
      >
      <el-dropdown-item command="2" :disabled="ccstyle === '2'"
        >style2</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    ccstyle() {
      return this.$store.getters.ccstyle;
    }
  },
  methods: {
    handleSetLanguage(style) {
      this.$store.dispatch("setCcstyle", style);
    }
  }
};
</script>

<style scoped>
.font-skin {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px !important;
}
</style>
