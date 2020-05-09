<template>
  <div class="step2Component">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="Choose Type:">
        <el-radio-group v-model="form.resource">
          <el-radio label="Standard"></el-radio>
          <el-radio label="Customize"></el-radio>
        </el-radio-group>
        <div class="download-box pointer" @click="downloadTmp(content.file_template_id, form.resource)">
          <i class="el-icon-download"></i><span>Download Template</span>
        </div>
      </el-form-item>
      <el-form-item :label="form.resource === 'Customize' ? 'Field Mapping:' : ''">
        <Step21 :loading1="loading1" v-if="form.resource === 'Standard'" :content="standList"></Step21>
        <Step22 :loading1="loading1" v-if="form.resource === 'Customize'" @delete="deleteItem" @blurTargetFileld="blurTargetFileld" @changeSwitch="changeSwitch" :templateId="content.file_template_id" :content="custList"></Step22>
      </el-form-item>
      <el-form-item>
        <el-button @click="clickBack('form')">Back</el-button>
        <el-button type="primary" @click="submitForm('form')">Next</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { downloadStandTmp, templateDetail, fieldEditStatus, fieldAdd, fieldDelete } from '@/api/configuration'
import { Message } from 'element-ui'
import Step21 from './step21'
import Step22 from './step22'
export default {
  components: {
    Step21,
    Step22
  },
  props: {
    content: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      standList: [],
      custList: [],
      loading1: true,
      form: {
        resource: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    deleteItem(id) {
      this.loading1 = true
      fieldDelete({ field_id: id }).then(res => {
        this.loading1 = false
        if (res.return_result) {
          this.init()
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch(err => {
        this.loading1 = false
        Message({ message: err, type: 'error' })
      })
    },
    blurTargetFileld(field, id, isNew, tmpId) {
      this.loading1 = true
      if (isNew === false) {
        fieldEditStatus({ customized_field_name: field, enable: null, field_id: id }).then(res => {
          this.loading1 = false
          if (res.return_result) {
            this.init()
          } else {
            Message({ message: res.msg, type: 'error' })
          }
        }).catch(err => {
          this.loading1 = false
          Message({ message: err, type: 'error' })
        })
      } else {
        fieldAdd({ field_name: field, field_type: 'string', file_template_id: tmpId, mandatory: null, unique: null }).then(res => {
          this.loading1 = false
          if (res.return_result) {
            this.init()
          } else {
            Message({ message: res.msg, type: 'error' })
          }
        }).catch(err => {
          this.loading1 = false
          Message({ message: err, type: 'error' })
        })
      }
    },
    changeSwitch(name, status, id) {
      this.loading1 = true
      fieldEditStatus({ customized_field_name: name, enable: status, field_id: id }).then(res => {
        this.loading1 = false
        if (res.return_result) {
          this.init()
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch(msg => {
        this.loading1 = false
        Message({ message: msg, type: 'error' })
      })
    },
    init() {
      this.loading1 = true
      templateDetail(`/batch/template/detail/${this.content.file_template_id}`).then(res => {
        this.loading1 = false
        if (res.return_result) {
          this.standList = res.return_result.standard_template_rows
          this.custList = res.return_result.customize_template_rows
          this.form.resource = res.return_result.has_customized ? 'Customize' : 'Standard'
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch((err) => {
        Message({ message: err, type: 'error' })
        this.loading1 = false
      })
    },
    downloadTmp(id, type) {
      let url = null
      url = type === 'Standard' ? `/batch/template/download/standard/${id}` : `/batch/template/download/customize/${id}`
      downloadStandTmp(url).then(res => {
        window.open(res.return_result.url, '_blank')
      }).catch(err => {
        Message({ message: err, type: 'error' })
      })
    },
    clickBack() {
      this.$emit('back')
    },
    submitForm(formName) {
      this.$emit('nextStep')
    }
  }
}
</script>

<style lang="scss" scoped>
.step2Component {
  .download-box {
    margin-top: 8px;
    margin-bottom: 22px;
    width: 200px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid #1989FA;
    color: rgba(25, 137, 250, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pointer {
    cursor: pointer;
  }
}
</style>
