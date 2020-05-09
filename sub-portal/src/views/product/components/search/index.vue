<template>
  <div class="wrapper">
    <el-input
      v-model="val"
      :placeholder="$t('configuration.fc_product_search_input_label')"
    ></el-input>
    <el-button
      type="primary"
      @click="() => this.$emit('handleSearch', this.val.trim())"
      >{{ $t("configuration.fc_product_btn_search_label") }}</el-button
    >
    <!-- <el-button
      type="primary"
      @click="() => this.$emit('handleAdvanced', this.val)"
      >{{ $t("configuration.fc_product_btn_advanced_search_label") }}</el-button
    >
    <el-button
      type="primary"
      @click="() => this.$router.push('/configuration/product/add')"
      >{{ $t("configuration.fc_product_btn_add_label") }}</el-button
    > -->
    <el-button
      plain
      @click="() => this.$emit('handleExport')"
      :loading="loadingExport"
      >{{ $t("configuration.fc_product_btn_export_label") }}</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Search",
  props: {
    loadingExport: {
      type: Boolean,
      default: false
    },
    setnull: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      val: ""
    };
  },
  watch: {
    setnull(val) {
      if (val) {
        this.val = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$placeholderColor: "#ccc";
$placeholderSize: 14px;
.wrapper {
  display: flex;
  /deep/ .el-input {
    width: 600px;
    height: 36px;
    margin-right: 8px;
    input {
      border-radius: 4px;
    }
  }
  /deep/ .el-input__inner {
    &::placeholder {
      color: $placeholderColor;
      font-size: $placeholderSize;
    }

    &::-webkit-input-placeholder {
      /* WebKit browsers 适配谷歌 */
      color: $placeholderColor;
      font-size: $placeholderSize;
    }

    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 适配火狐 */
      color: $placeholderColor;
      font-size: $placeholderSize;
    }

    &::-moz-placeholder {
      /* Mozilla Firefox 19+ 适配火狐 */
      color: $placeholderColor;
      font-size: $placeholderSize;
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10+  适配ie*/
      color: $placeholderColor;
      font-size: $placeholderSize;
    }
  }
  /deep/ .el-button {
    padding: 9px 25px;
    height: 36px;
    border-radius: 4px;
    font-size: 16px;
  }
  /deep/ .el-button--primary {
    background: rgba(39, 119, 255, 1);
  }
  /deep/ .is-plain {
    background: 1px solid rgba(249, 249, 249, 1);
  }
}
</style>
