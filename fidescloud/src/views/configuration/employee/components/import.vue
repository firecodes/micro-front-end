<template>
  <div class="r-import-wrapper">
    <div class="import-tit">
      <span v-html="handleGlobalI18n('employee', 'mgt_empl_import_template_label').slice(0, handleGlobalI18n('employee', 'mgt_empl_import_template_label').indexOf('{'))"></span>
      <span class="link" @click="downloadTemplate">{{ common.getTranslateLink(handleGlobalI18n('employee', 'mgt_empl_import_template_label')) }}</span>
      <span v-html="handleGlobalI18n('employee', 'mgt_empl_import_template_label').slice(handleGlobalI18n('employee', 'mgt_empl_import_template_label').indexOf('}') + 1, handleGlobalI18n('employee', 'mgt_empl_import_template_label').length)"></span>
    </div>
    <el-upload class="upload-demo"
      :http-request="upload"
      accept='.xls, .xlsx'
      :show-file-list="false"
      action="http://172.31.212.64:8669/smic/admin/learn/faq/upload" drag>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ common.getTransfirstLink(handleGlobalI18n('employee', 'mgt_empl_import_upload_label')) }}<em>{{ common.getTranslateLink(handleGlobalI18n('employee', 'mgt_empl_import_upload_label')) }}</em>{{ common.getTransMiddleLink(handleGlobalI18n('employee', 'mgt_empl_import_upload_label')) }}
      </div>
      <div class="el-upload__tip" slot="tip">{{ handleGlobalI18n('employee', 'mgt_empl_import_file_format_label') }}</div>
    </el-upload>

    <div v-if="result">
      <h4 class="preview-tit">{{ handleGlobalI18n('employee', 'mgt_ques_bank_import_result_section_label') }}</h4>
      <p class="failed-info">
        {{ result.total - result.fail_num }}
        {{ handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').slice(handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').indexOf('0}') + 2, handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').indexOf('{1')) }}
        {{ result.fail_num }}
        {{ handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').slice(handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').indexOf('1}') + 2, handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').length - 1) }}
      </p>
      <a v-if="result.fail_num !== 0" class="link" download :href="result.url">{{ handleGlobalI18n('employee', 'mgt_ques_bank_import_result_link_label') }}</a>
    </div>
  </div>
</template>

<script>
import { employeetTemplateDownload, employeeUpload } from '@/api/import'
export default {
  name: 'uploadExcel',
  data() {
    return {
      preview: false,
      btnLoading: false,
      result: false,
      tableData: [],
      errorDatas: []
    }
  },
  created() {
    console.log(this.handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').slice(this.handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').indexOf('1}') + 2, this.handleGlobalI18n('employee', 'mgt_ques_bank_import_result_desc_label').length - 1))
  },
  computed: {
    excelHeader() {
      return {
        'dropdown_list': [
          {
            'value_string': 'gender',
            'values': [
              {
                'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_gender_unspecified_label'),
                'value_string': '0'
              },
              {
                'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_gender_male_label'),
                'value_string': '1'
              },
              {
                'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_gender_female_label'),
                'value_string': '2'
              }
            ]
          },
          {
            'value_string': '$role',
            'values': []
          },
          {
            'value_string': 'notify',
            'values': [
              {
                'display_string': this.handleGlobalI18n('employee', 'mgt_operation_import_notify_option1_label'),
                'value_string': '1'
              },
              {
                'display_string': this.handleGlobalI18n('employee', 'mgt_operation_import_notify_option2_label'),
                'value_string': '0'
              }
            ]
          }
        ],
        'header': [
          {
            'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_first_label').trim().slice(0, this.handleGlobalI18n('employee', 'mgt_empl_add_first_label').trim().length - 1),
            'value_string': 'first_name'
          },
          {
            'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_last_label').trim().slice(0, this.handleGlobalI18n('employee', 'mgt_empl_add_last_label').trim().length - 1),
            'value_string': 'last_name'
          },
          {
            'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_account_label').trim().slice(0, this.handleGlobalI18n('employee', 'mgt_empl_add_account_label').trim().length - 1),
            'value_string': 'account'
          },
          {
            'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_gender_label').trim().slice(0, this.handleGlobalI18n('employee', 'mgt_empl_add_gender_label').trim().length - 1),
            'value_string': 'gender'
          },
          {
            'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_mobile_label').trim().slice(0, this.handleGlobalI18n('employee', 'mgt_empl_add_mobile_label').trim().length - 1),
            'value_string': 'mobile'
          },
          {
            'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_email_label').trim().slice(0, this.handleGlobalI18n('employee', 'mgt_empl_add_email_label').trim().length - 1),
            'value_string': 'email'
          },
          {
            'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_position_label').trim().slice(0, this.handleGlobalI18n('employee', 'mgt_empl_add_position_label').trim().length - 1),
            'value_string': 'role'
          },
          {
            'display_string': this.handleGlobalI18n('employee', 'mgt_empl_add_notify_label').trim().slice(0, this.handleGlobalI18n('employee', 'mgt_empl_add_notify_label').trim().length),
            'value_string': 'notify'
          }
        ],
        'language': this.$store.getters.language
      }
    }
  },
  methods: {
    downloadTemplate() {
      employeetTemplateDownload(this.excelHeader).then(res => {
        if (res && res.url) {
          this.common.downloadFile(res.url)
        }
      })
    },
    upload(file) {
      // console.log(file)
      this.result = false
      this.errorDatas = []
      const isEXCEL = file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.file.type === 'application/vnd.ms-excel'
      if (!isEXCEL) {
        this.$message.error(this.handleGlobalI18n('employee', 'mgt_empl_import_file_format_notification_label'))
        return
      }
      const form_data = new FormData()
      form_data.append('file', file.file)
      employeeUpload(encodeURIComponent(JSON.stringify(this.excelHeader)), form_data).then(res => {
        if (res) {
          this.result = res
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.r-import-wrapper {
  margin: 15px 20px;
  .link {
    color: #2777FF;
  }
  .import-tit {
    color: #333;
    margin-bottom: 20px;
    line-height: 1.5;
  }
}
</style>

