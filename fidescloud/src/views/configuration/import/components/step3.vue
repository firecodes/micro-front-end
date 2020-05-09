<template>
  <div class="step3Component" v-loading="loading">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <el-form-item label="Choose Type:" prop="chooseType">
        <el-select v-model="ruleForm.chooseType" placeholder="">
          <el-option label="SFTP" value="sftp"></el-option>
          <el-option label="Local File Folder" value="localfile"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.chooseType === 'localfile'" label="File Folder:" prop="fileFolder">
        <el-input maxlength="60" v-model="ruleForm.fileFolder" autocomplete="off" placeholder="Please input the folder"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.chooseType === 'sftp'" label="SFTP URL:" prop="stfpUrl">
        <el-input maxlength="60" v-model="ruleForm.stfpUrl" autocomplete="off" placeholder="Please input url"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.chooseType === 'sftp'" label="SFTP Account:" prop="account">
        <el-input maxlength="60" v-model="ruleForm.account" autocomplete="off" placeholder="Please input account"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.chooseType === 'sftp'" label="SFTP Password:" prop="password">
        <el-input maxlength="60" v-model="ruleForm.password" type="password" autocomplete="off" placeholder="Please input password"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.chooseType === 'sftp'" label="File Folder:" prop="fileFolder2">
        <el-input maxlength="60" v-model="ruleForm.fileFolder2" autocomplete="off" placeholder="Please input the folder"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="clickBack">Back</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">Next</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { remoteEdit, getRemoteInfo } from '@/api/configuration'
import { Message } from 'element-ui'
export default {
  props: {
    patternId: {
      type: Number
    },
    remoteId: {
      type: Number
    },
    filePath: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      ruleForm: {
        chooseType: 'sftp',
        fileFolder: '',
        stfpUrl: '',
        account: '',
        password: '',
        fileFolder2: ''
      },
      rules: {
        stfpUrl: [{ required: true, trigger: 'blur', message: 'url is not empty' }],
        account: [{ required: true, trigger: 'blur', message: 'account is not empty' }],
        password: [{ required: true, trigger: 'blur', message: 'password is not empty' }],
        fileFolder2: [{ required: false, trigger: 'blur' }],
        fileFolder: [{ required: false, trigger: 'blur' }]
      }
    }
  },
  methods: {
    clickBack() {
      this.$emit('back')
    },
    init(id) {
      getRemoteInfo(`/batch/pattern/remote/${id}`).then(res => {
        const ret = res.return_result
        if (ret) {
          if (ret.remote_type.toLowerCase() !== 'sftp') {
            this.ruleForm.chooseType = 'localfile'
            this.ruleForm.fileFolder = this.filePath
            return
          } else {
            this.ruleForm.chooseType = 'sftp'
            this.ruleForm.stfpUrl = ret.remote_url
            this.ruleForm.account = ret.remote_account
            this.ruleForm.password = ret.remote_password
            this.ruleForm.fileFolder2 = this.filePath
          }
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch(err => {
        Message({ message: err, type: 'error' })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.ruleForm.chooseType === 'sftp') {
            remoteEdit({
              file_import_pattern_id: this.patternId,
              remote_account: this.ruleForm.account,
              remote_password: this.ruleForm.password,
              remote_port: null,
              remote_type: null,
              remote_url: this.ruleForm.stfpUrl,
              file_path: this.ruleForm.fileFolder2
            }).then(res => {
              this.loading = false
              if (res.return_result) {
                this.$emit('nextStep')
              } else {
                Message({ message: res.msg, type: 'error' })
              }
            }).catch(err => {
              this.loading = false
              Message({ message: err, type: 'error' })
            })
          } else {
            remoteEdit({
              file_import_pattern_id: this.patternId,
              remote_account: null,
              remote_password: null,
              remote_port: null,
              remote_type: null,
              remote_url: null,
              file_path: this.ruleForm.fileFolder
            }).then(res => {
              this.loading = false
              if (res.return_result) {
                this.$emit('nextStep')
              } else {
                Message({ message: res.msg, type: 'error' })
              }
            }).catch(err => {
              this.loading = false
              Message({ message: err, type: 'error' })
            })
          }
        }
      })
    }
  },
  watch: {
    remoteId: {
      deep: true,
      immediate: true,
      handler(newV) {
        if (newV === null || newV === undefined) return
        this.init(newV)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step3Component /deep/ {
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
