<template>
  <div class="topbtn-group">
    <el-button @click="() => this.$router.go(-1)">{{
      this.$route.params.id && this.$route.name !== "product_edit"
        ? $t("configuration.fc_configuration_test_btn_back_label")
        : $t("loyalty.fc_operation_btn_cancel_label")
    }}</el-button>
    <!-- <el-button
      type="primary"
      @click="() => this.$emit('handleSave')"
      :loading="saveloading"
      >{{
        this.$route.params.id && this.$route.name !== "product_edit"
          ? $t("loyalty.fc_tile_btn_edit_label")
          : $t("loyalty.fc_operation_btn_save_label")
      }}</el-button
    > -->
  </div>
</template>

<script>
export default {
  props: ["saveloading"],
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.topbtn-group {
  display: flex;
  justify-content: flex-end;
  .el-button--default {
    border-color: #2777ff;
    padding: 9px 19px;
    /deep/ span {
      font-size: 16px;
    }
  }
}
</style>
