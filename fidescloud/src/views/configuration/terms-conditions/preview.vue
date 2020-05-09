<template>
  <div class="preview-dialog">
    <el-dialog
      :title="$t('configuration.fc_configuration_tc_title_label')"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <div style="height: 500px;">
        <el-scrollbar style="height:100%;" class="tcsroll">
          <div class="content" v-html="content">
          </div>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose" class="close">{{$t('member.fc_operation_btn_close_label')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    content: {
      type: [String, Number],
      default: ''
    }
  },
  watch: {
    show() {
      this.dialogVisible = this.show
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$emit('close', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.preview-dialog {
  height: 300px;
  .el-button {
    // border: 1px solid #2777FF !important;
    // border-radius: 18px;
    // color: #2777FF;
    // background-color: rgba(74, 144, 226, 0.07) !important;
    margin-left: 0;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .content {
    min-height: 500px;
    border: 1px solid #C0C4CC;
    padding: 6px;
  }
  /deep/ .el-dialog__header {
    text-align: center;
  }
  /deep/ .el-scrollbar__thumb {
    background-color: rgba(144, 147, 153, 0.5);
  }
}
</style>
