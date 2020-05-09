<template>
  <div class="cron step4Component" v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="140px">
      <el-form-item :label="'Select the timing'" prop="crons" class="pointer">
        <el-popover v-model="cronPopover">
          <cron @change="changeCron" @close="cronPopover=false" :i18n="lang"></cron>
          <!-- <vueCron /> -->
          <el-input slot="reference" readonly @click="cronPopover=true" v-model="form.crons" placeholder="Select the timing"></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-button  @click="clickBack('form')">Back</el-button>
        <el-button type="primary" @click="submitForm('form')">Next</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { cron } from 'vue-cron'
import { scheduleEdit } from '@/api/configuration'
import { Message } from 'element-ui'
export default {
  props: {
    content: {
      type: Object
    }
  },
  components: { cron },
  data() {
    return {
      lang: '',
      loading: false,
      cronPopover: false,
      form: {
        crons: null
      },
      rules: {
        crons: [{ required: true, trigger: 'blur', message: 'timing is not empty' }]
      }
    }
  },
  created() {
    this.form.crons = this.content.cron_expression
  },
  methods: {
    clickBack() {
      this.$emit('back')
    },
    changeCron(val) {
      this.form.crons = val
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.loading = true
          scheduleEdit({ file_import_pattern_id: this.content.file_import_pattern_id, cron_expression: this.form.crons }).then(res => {
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
      })
    }
  },
  watch: {
    '$store.getters.language': {
      deep: true,
      immediate: true,
      handler(newV) {
        if (newV === 'lang_zh') {
          this.lang = 'cn'
        } else {
          this.lang = 'en'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .step4Component {
    .form {
      /deep/ .el-form-item {
        .el-form-item__content {
          input {
            width: 260px;
          }
        }
      }
    }
    .pointer {
      cursor: pointer;
    }
  }
</style>
