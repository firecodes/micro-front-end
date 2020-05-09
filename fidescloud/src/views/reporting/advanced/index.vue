<template>
  <el-container class="container">
    <el-header class="header">
      <h1>{{$t('reporting.fc_reporting_advanced_title_lable')}}</h1>
      <p>{{$t('reporting.fc_reporting_advanced_sub_title_lable')}}</p>
    </el-header>
    <el-main>
      <el-form ref="form" :model="form">
        <!--Please select a category for your reports-->
        <el-form-item :label="$t('reporting.fc_reporting_advanced_category_lable')" prop="category">
          <el-select :placeholder="$t('reporting.fc_reporting_advanced_category_input_lable')">
            <el-option label="category 1" value="category_one"></el-option>
            <el-option label="category 2" value="category_two"></el-option>
            <el-option label="category 3" value="category_three"></el-option>
            <el-option label="category 4" value="category_four"></el-option>
          </el-select>
        </el-form-item>
        <!--Briefly describe the reports you would like to add-->
        <el-form-item :label="$t('reporting.fc_reporting_advanced_describe_lable')">
          <el-input type="textarea" v-model="form.desc" maxlength="512" :rows="6"></el-input>
        </el-form-item>
        <!--What's a contact number we can reach you on ?-->
        <el-form-item :label="$t('reporting.fc_reporting_advanced_contact_number_lable')">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!--Submit-->
        <el-form-item class="submit-box">
          <el-button type="primary" @click="onSubmit">{{$t('reporting.fc_reporting_advanced_btn_submit_lable')}}</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  width: 580px;
  margin: auto;
  margin-top: 50px;
  background-color: #fff;
  padding-top: 50px;
}
.header {
  text-align: center;
  h1 {
    color: #101010;
    font-size: 18px;
  }
  p {
    color: #888;
    font-size: 16px;
    margin-top: 5px;
  }
}
.el-main {
  .el-select {
    width: 100%;
  }
  .submit-box {
    text-align: center;
  }
}
</style>
