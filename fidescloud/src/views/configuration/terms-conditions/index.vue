<template>
  <div class="termsConditions" v-loading="loading">
    <div>
      <div class="click-button">
        <div>
          <!-- <el-button class="cancel" @click="goBack()">Cancel</el-button> -->
          <el-button class="cancel" @click="preview()">{{$t('configuration.fc_operation_btn_preview_label')}}</el-button>
          <el-button type="primary" :loading="save_loading" class="save" @click="submitForm">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
        </div>
      </div>
      <ed-header-title :title="$t('configuration.fc_configuration_tc_title_label')" />
      <el-form :model="form" label-width="240px" label-position="left">
        <el-form-item :label="$t('configuration.fc_configuration_tc_member_title_label')">
          <editor-terms-conditions class="editor"  @show="editors" :value="form.termsconditions" style="width: 100%; min-width: 420px; height: 300px;" />
        </el-form-item>
      </el-form>
    </div>
    <preview :content="form.termsconditions" :show="dialog_show" @close="close" />
  </div>
</template>

<script>
import EditorTermsCondition from '@/components/TermsConditions'
import Preview from './preview'
import { saveCondition, getCondition } from '@/api/configuration'
import { handleOssFileHtmlStr } from '@/views/data/oss-file-html-str'
export default {
  name: '',
  mixins: [handleOssFileHtmlStr],
  components: {
    'editor-terms-conditions': EditorTermsCondition,
    Preview
  },
  data() {
    return {
      save_loading: false,
      dialog_show: false,
      loading: true,
      form: {
        termsconditions: ''
      }
    }
  },
  watch: {
    'form.termsconditions': {
      handler(val) {
        if (val && val.length > 400000) {
          this.form.termsconditions = val.substr(0, 400000)
        }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getCondition()
    },
    close(val) {
      this.dialog_show = val
    },
    getCondition() {
      this.loading = true
      return getCondition().then(async res => {
        if (res.return_result) {
          if (res.return_result.url) {
            this.form.termsconditions = await this.handleHtml2str(res.return_result.url)
          } else {
            this.form.termsconditions = ''
          }
          this.loading = false
        } else {
          this.$message.error(res.msg)
          this.loading = false
        }
      }).catch(err => {
        this.$message.error(err)
        this.loading = false
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    editors(content) {
      this.form.termsconditions = content
    },
    preview() {
      if (this.preventTerms(this.form.termsconditions) === false) return
      this.dialog_show = true
    },
    preventTerms(terms) {
      let flag = true
      if (!terms) {
        flag = false
        this.$message.error(this.$t('member.fc_field_input_empty_tips'))
        return flag
      }
      const temp = terms
      if (temp.replace(/\<p\>|\<\/p\>/igm, '').trim() === '') {
        flag = false
        this.$message.error(this.$t('member.fc_field_input_empty_tips'))
        return flag
      }
      // const temp = terms.termsconditions && terms.termsconditions.replace(/\<p\>|\<\/p\>/igm, '').trim()
      // // 点击save保存按钮时候，需要获取到富文本编辑器的内容
      if (temp.indexOf('html') !== -1) {
        const temp2 = temp.match(/<p[^>]*?>[\w\W]*?<\/p>/igm)
        if (temp2 === null) {
          flag = false
          this.$message.error(this.$t('member.fc_field_input_empty_tips'))
          return flag
        }
        const arr = []
        temp2.forEach(item => {
          arr.push(item && item.replace(/\<p\>|\<\/p\>/igm, '').trim())
        })
        if (arr.join('') === '') {
          flag = false
          this.$message.error(this.$t('member.fc_field_input_empty_tips'))
          return flag
        }
      }
      return flag
    },
    async submitForm() {
      if (this.preventTerms(this.form.termsconditions) === false) return
      this.save_loading = true
      await this.handleStr2html(this.form.termsconditions, true).then(res => {
        saveCondition({ content_url: res }).then(res => {
          this.save_loading = false
          if (res.return_result) {
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.save_loading = false
          this.$message.error(err)
        })
      }).catch(() => {
        this.save_loading = false
        this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.termsConditions {
  padding: 0 34px 34px 34px;
  /deep/ strong {
    font-weight: bold !important;
  }
  .click-button {
    padding-top: 34px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    text-align: right;
    margin-bottom: -20px;
    .save{
      margin-left: 8px;
      background-color: $new-primary;
      border-color: $new-primary;
    }
    .cancel, .delete{
      border-color: $new-primary;
      color: $new-primary;
    }
  }
  .el-form-item /deep/ .el-form-item__label {
    color: #333;
    font-weight: bold;
  }
  .el-form-item /deep/ #mceu_0-open {
    margin-left: 10px;
    border: 1px solid #ccc;
    width: 70px;
    height: 100%;
    border-radius: 4px;
  }
  .el-form-item /deep/ .mce-btn-group:not(:first-child) {
    border-left: none !important;
  }
  .el-form-item /deep/ .mce-btn.mce-active, .el-form-item /deep/ .mce-btn.mce-active:hover, .el-form-item /deep/ .mce-btn.mce-active:focus, .el-form-item /deep/ .mce-btn.mce-active:active {
    background-color: white !important;
    color: #333 !important;
  }
  .el-form-item /deep/ .mce-btn.mce-active button, .el-form-item /deep/ .mce-btn.mce-active:hover button, .el-form-item /deep/ .mce-btn.mce-active i, .el-form-item /deep/ .mce-btn.mce-active:hover i {
    color: #333 !important;
  }
}
</style>
<style lang="scss">
  #mceu_22 {
    // left: 522px !important;
  }
</style>
