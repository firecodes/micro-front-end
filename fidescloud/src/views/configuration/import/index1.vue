<!--configuration import-->
<template>
  <div class="import">
    <div class="contain">
      <div class="info">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="180px"
          label-position="left"
          style="margin-top: 20px;"
        >
          <el-row class="list1">
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item :label="$t('configuration.fc_configuration_import_type_lable')" prop="selected_type">
                <el-select
                  :loading="import_types_status"
                  v-model="form.selected_type"
                  :placeholder="$t('configuration.fc_configuration_import_type_input_lable')"
                >
                  <el-option
                    v-for="item in import_types"
                    :key="item.type_code"
                    :label="item.type_code"
                    :value="item.type_code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="3">
              <!--Import from files-->
              <el-upload :before-upload="beforeAvatarUpload" :disabled="form.selected_type === ''" :http-request="handleHttpRequest" :show-file-list="false" action v-loading="uploadLoading">
                <el-button @click="clickImportFile">{{$t('configuration.fc_configuration_import_btn_import_lable')}}</el-button>
              </el-upload>
            </el-col>
            <!--Download format-->
            <el-col :xs="12" :sm="12" :lg="3">
              <div class="grid-content">
                <a class="download" :href="templateFile" @click="download"><el-button>{{$t('configuration.fc_configuration_import_btn_download_lable')}}</el-button></a>
                <!-- <el-button @click="downloadTemplate">Download template</el-button> -->
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24" style="margin-top: 20px;">
              <el-form-item :label="$t('configuration.fc_configuration_import_upload_history_lable')"></el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item :label="$t('configuration.fc_configuration_import_date_lable')">
                <date-range @valueDate = "valueDateJoin" :value="form.creation_date_from"></date-range>
                <el-button type="primary" @click="queryStatus">{{$t('configuration.fc_configuration_import_btn_search_lable')}}</el-button>
                <!--<el-button>{{handleGlobalI18n('configuration', 'confirm')}}</el-button>-->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="jobStatus" v-loading.body="listLoading" :empty-text="$t('member.fc_table_no_data_label')" stripe>
          <el-table-column :label="$t('configuration.fc_configuration_import_table_type_lable')" align="center" prop="type_code" width="95" />
          <!--Job code-->
          <el-table-column :label="$t('configuration.fc_configuration_import_table_job_lable')" align="center" prop="code" />
          <!--Status-->
          <el-table-column :label="$t('configuration.fc_configuration_import_table_status_lable')" align="center" prop="status" />
          <!--Total count-->
          <el-table-column :label="$t('configuration.fc_configuration_import_table_total_count_lable')" align="center" prop="total_count" />
          <!--Success count-->
          <el-table-column :label="$t('configuration.fc_configuration_import_table_success_count_lable')" align="center" prop="success_count" />
          <!--Fail count-->
          <el-table-column :label="$t('configuration.fc_configuration_import_table_fail_count_lable')" align="center" prop="fail_count" />
          <!--Remarks-->
          <el-table-column :label="$t('configuration.fc_configuration_import_table_remarks_lable')" align="center" prop="remarks" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import DateRange from '@/components/EldatePicker'
import axios from 'axios'
import {
  listImportType,
  importFile,
  queryImportDetail,
  queryImportStatus
} from '@/api/import'
import { uploadFileNew } from '@/api/master'
import { DateTime } from 'luxon'
export default {
  components: {
    DateRange
  },
  data() {
    return {
      upload_disable: true,
      rules: {
        selected_type: [
          { required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: 'blur' }
        ]
      },
      tableData: [],
      listLoading: false,
      pickerOptions2: {
        shortcuts: [
          {
            text: 'latest week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'latest month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'latest three month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      form: {
        import_type: '',
        creation_date_from: [],
        selected_type: ''
      },
      import_types: [],
      import_types_status: true,
      isInitial: true,
      isSaving: false,
      uploadFieldName: '',
      file: '',
      uploadLoading: false,
      jobStatus: [],
      queryParams: {
        page_size: 10,
        page_no: 1,
        from: '',
        to: ''
      }
    }
  },
  created() {
    listImportType().then(res => {
      this.import_types_status = false
      this.import_types = res.return_result.import_types
    }).catch(() => {
      this.import_types_status = false
    })
  },

  methods: {
    listImportType() {},
    beforeUpload(file) {
      const fileDate = {
        code: this.form.selected_type,
        file: file
      }
      importFile(fileDate).then(res => {
        console.log('success')
      })
      return false
    },
    uploadSuccess(res) {
      console.log('res', res)
    },
    clickImportFile() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          return true
        }
      })
    },
    beforeAvatarUpload(file) {
      this.file = file
    },
    handleHttpRequest() {
      if (this.file === '' || this.file === undefined) {
        return true
      }
      this.uploadLoading = true
      var formData = new FormData()
      formData.append('file', this.file)
      formData.append('oldUrl', '')
      formData.append('project', 'fides')
      formData.append('module', 'import')
      uploadFileNew(formData).then(res => {
          let url = res.return_result.url
          // url = url.substring(0, url.lastIndexOf('?'))
          this.file = ''
          importFile(this.form.selected_type, url).then(res => {
            this.uploadLoading = false
            this.$message({
              message: this.handleGlobalI18n('system', 'success'),
              type: 'success'
            })
          }).catch(res => {
            this.$message.error(res)
            this.uploadLoading = false
          })
      }).catch(res => {
        this.$message.error(res)
        this.uploadLoading = false
      })
    },
    queryStatus() {
      this.listLoading = true
      var generate_time = DateTime.local().toISO()
      const nowDateLength = generate_time.length
      var postfix = generate_time.substring(nowDateLength - 6, nowDateLength)
      queryImportStatus(Object.assign({}, this.queryParams, { from: this.queryParams.from ? `${this.queryParams.from}T00:00:00.000${postfix}` : null, to: this.queryParams.to ? `${this.queryParams.to}T23:59:59.999${postfix}` : null })).then(res => {
        this.jobStatus = res.return_result.results
        this.listLoading = false
      }).catch(res => {
        this.$message.error(res)
        this.listLoading = false
      })
    },
    download(e) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const templateFile = this.templateFile
          if (templateFile === null || templateFile === undefined || templateFile === '') {
            e.preventDefault()
          }
        } else {
          e.preventDefault()
          return false
        }
      })
    },
    downloadTemplate() {
      const templateFile = this.templateFile
      if (templateFile === null || templateFile === undefined) {
        console.log('vvv')
      } else {
        axios({
          url: templateFile,
          method: 'GET',
          responseType: 'blob' // important
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'file.pdf')
          document.body.appendChild(link)
          link.click()
        })
      }
    },
    valueDateJoin(val) {
      [this.queryParams.from, this.queryParams.to] = val
    }
  },
  computed: {
    templateFile() {
      const selected_type = this.form.selected_type
      const import_type = this.import_types.filter(e => e.type_code === selected_type)
      const template = import_type[0] === undefined ? '' : import_type[0].template_file
      return template
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.import {
  margin: 25px;
  .confirm {
    background-color: #ffffff;
    height: 40px;
    line-height: 40px;
    label {
      margin-left: 20px;
    }
  }
  .el-input {
    width: 200px;
  }
  .contain {
    margin-top: 30px;
    background-color: #ffffff;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: -4px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: rgba(51, 51, 51, 0.07);
    }
    .info {
      padding: 8px 20px 20px;
      .upload-history {
        label {
          text-align: right;
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }
}
</style>
