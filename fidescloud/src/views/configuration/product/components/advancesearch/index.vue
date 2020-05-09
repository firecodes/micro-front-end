<template>
<transition name="el-fade-in-linear">
  <div class="advancedWrapper" v-show="active">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="ruleForm" v-loading="loadingSearch">
      <el-row class="searchbox">
        <el-form-item :label="$t('configuration.fc_product_advanced_code_label')" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('configuration.fc_product_advanced_name_label')" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('configuration.fc_product_advanced_category_label')" prop="category">
          <el-select v-model="ruleForm.category" filterable clearable :placeholder="$t('configuration.fc_configuration_select_box_default_label')">
            <el-option
              v-for="item in categoryList"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('configuration.fc_product_advanced_brand_label')" prop="brand">
          <el-select v-model="ruleForm.brand" clearable filterable :placeholder="$t('configuration.fc_configuration_select_box_default_label')
">
            <el-option
              v-for="item in brandList"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-form-item class="bottomitem">
        <el-button @click="resetForm('ruleForm')">{{$t('configuration.fc_product_advanced_btn_reset_label')}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('configuration.fc_product_advanced_btn_search_label')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</transition>
</template>

<script>
  export default {
    props: {
      categoryList: {
        type: Array,
        default: () => []
      },
      brandList: {
        type: Array,
        default: () => []
      },
      active: {
        type: Boolean,
        default: false
      },
      loadingSearch: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        ruleForm: {
          code: '',
          name: '',
          category: '',
          brand: ''
        },
        rules: {}
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(() => {
          const { code, name, category, brand } = this.ruleForm
          this.$emit('handleAdvacedSearch', {
            asc: false,
            code: code ? code.trim() : '',
            name: name ? name.trim() : '',
            category: category,
            brand: brand
          })
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang='scss' scoepd>
.advancedWrapper {
  margin-top: 10px;
  padding-top: 15px;
  background-color: #fff;
  padding-right: 24px;
  padding-bottom: 1px;
  .searchbox {
    display: flex;
    flex-wrap: wrap;
  }
  .ruleForm {
    /deep/ .el-button--default {
      border-color: #2777FF !important;
    }
    /deep/ .el-form-item__label {
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
    .bottomitem {
      /deep/ .el-form-item__content {
        margin-left: 0px !important;
      }
      text-align: center;
    }
  }
}
</style>