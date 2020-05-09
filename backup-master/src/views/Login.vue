<template>
  <el-form
    class="form"
    :label-position="labelPosition"
    label-width="180px"
    :model="formLabelAlign"
  >
    <el-form-item label="Company code">
      <el-input v-model="formLabelAlign.name"></el-input>
    </el-form-item>
    <el-form-item label="Username">
      <el-input v-model="formLabelAlign.region"></el-input>
    </el-form-item>
    <el-form-item label="Password">
      <el-input v-model="formLabelAlign.type"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="clickLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      }
    };
  },
  methods: {
    clickLogin() {
      this.$router.push("/home");
      console.log("clickLogin");
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  width: 500px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  transform: translateX(-50%);
}
</style>
