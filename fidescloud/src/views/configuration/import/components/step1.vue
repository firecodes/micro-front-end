<template>
  <div class="step1Component" v-loading="loading">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <el-form-item label="File Import Name:" prop="file_import_pattern_name">
        <el-input v-model="ruleForm.file_import_pattern_name" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="File Format:" prop="file_format">
        <el-select v-model="ruleForm.file_format" placeholder="">
          <el-option v-for="item in fileFormatList" :label="item" :value="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Separator:" prop="field_separator" v-if="ruleForm.file_format === 'TXT'">
        <el-input maxlength="8" v-model="ruleForm.field_separator" autocomplete="off" placeholder="Please input separator"></el-input>
      </el-form-item>
      <el-form-item label="Need File Header:" prop="has_header">
        <el-radio-group v-model="ruleForm.has_header">
          <el-radio label="Need"></el-radio>
          <el-radio label="No Need"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="File Encoder:" prop="file_encode">
        <el-select v-model="ruleForm.file_encode" placeholder="">
          <el-option v-for="item in encoderList" :label="item" :value="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="File Name Pattern:" class="fileNamePatternBox" prop="file_name_regular_pattern">
        <el-input maxlength="100" v-model="ruleForm.file_name_regular_pattern" autocomplete="off" placeholder="Please input file name pattern"></el-input>
        <!-- <el-checkbox label="Limit the file name" v-model="checked"></el-checkbox> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">Next</el-button>
        <el-button @click="clickCancelBtn('ruleForm')">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { patternEdit } from '@/api/configuration'
import { Message } from 'element-ui'
export default {
  props: {
    content: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      loading: false,
      checked: false,
      pattern_id: '',
      ruleForm: {
        file_import_pattern_name: '',
        file_format: '',
        field_separator: '',
        has_header: '',
        file_encode: '',
        file_name_regular_pattern: ''
      },
      fileFormatList: ['TXT', 'CSV'],
      encoderList: ['UTF-8', 'GBK', 'GB2312'],
      rules: {
        file_import_pattern_name: [{ required: true, message: 'Please enter the file import name', trigger: 'blur' }],
        file_format: [{ required: true, message: 'Please select the file format', trigger: 'blur' }],
        field_separator: [{ required: true, message: 'Please enter the separator', trigger: 'blur' }],
        has_header: [{ required: true, message: 'Please select the need file header', trigger: 'blur' }],
        file_encode: [{ required: true, message: 'Please select the encoder', trigger: 'blur' }],
        file_name_regular_pattern: [{ required: false, trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  watch: {
    content: {
      deep: true, // 只要对象中的属性发生了变化，就会触发监视
      immediate: true, // 立即触发一次监视
      handler(newV, oldV) {
        this.ruleForm.file_import_pattern_name = newV.file_import_pattern_name
        this.ruleForm.file_format = (newV.file_format && newV.file_format.toLowerCase() === 'txt') ? 'TXT' : 'CSV'
        this.ruleForm.has_header = newV.has_header ? 'Need' : 'No Need'
        this.ruleForm.field_separator = newV.field_separator
        this.pattern_id = newV.file_import_pattern_id
        this.ruleForm.file_name_regular_pattern = newV.file_name_regular_pattern
        if (newV.file_encode && newV.file_encode.toLowerCase() === 'gbk') {
          this.ruleForm.file_encode = 'GBK'
        } else if (newV.file_encode && newV.file_encode.toLowerCase() === 'gb2312') {
          this.ruleForm.file_encode = 'GB2312'
        } else {
          this.ruleForm.file_encode = 'UTF-8'
        }
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          patternEdit({
            field_separator: this.ruleForm.field_separator,
            file_encode: this.ruleForm.file_encode.toLowerCase(),
            file_format: this.ruleForm.file_format.toLowerCase(),
            file_import_pattern_id: this.pattern_id,
            file_name_regular_pattern: this.ruleForm.file_name_regular_pattern,
            has_header: this.ruleForm.has_header === 'Need'
          }).then(res => {
            this.loading = false
            if (res.return_result && res.return_result.flag) {
              this.$emit('nextStep')
            } else {
              Message({
                message: res.msg,
                type: 'error'
              })
            }
          }).catch(err => {
            this.loading = false
            Message({
              message: err,
              type: 'error'
            })
          })
        }
      })
    },
    clickCancelBtn(formName) {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.step1Component /deep/ {
  .demo-ruleForm {
    .el-form-item__content {
      .el-input {
        width: 250px;
      }
    }
    .fileNamePatternBox {
      .el-form-item__content {
        display: flex;
        .el-input {
          width: 250px;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
