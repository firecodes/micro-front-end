<template>
  <div class="modelWrapper">
    <el-dialog :before-close="handleClose" :title="title" :visible.sync="dialog_visible" width="440px">
      <div class="tiers-main">
        <el-select multiple :placeholder="$t('member.fc_member_tag_add_category_input_label')" v-model="select">
          <el-option
            :key="index"
            :label="item.tag_name && item.tag_name.length > 45 ? item.tag_name.substring(0, 42) + '...' : item.tag_name "
            :value="item.tag_id"
            v-for="(item, index) in tag_list">
          </el-option>
        </el-select>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleClose" class="close">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
        <el-button @click="save"  class="add-button" type="primary">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    dialog_show: {
      type: Boolean,
      default: false
    },
    content: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialog_visible: false,
      tag_list: [],
      select: []
    }
  },
  watch: {
    dialog_show() {
      this.dialog_visible = this.dialog_show
      this.select = []
    },
    dialog_visible() {
      this.$emit('closeSelectCategory')
      this.$emit('handleDialogVisible', this.dialog_visible)
    },
    content: {
      deep: true,
      handler: function() {
        this.tag_list = this.content
        for (let i = 0; i < this.content.length; i++) {
          if (this.content[i].checked) {
            this.select.push(this.content[i].tag_id)
          }
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.dialog_visible = false
      this.$emit('closeSelectCategory')
    },
    save() {
      this.handleClose()
      const origin = JSON.parse(JSON.stringify(this.tag_list))
      if (this.select.length === 0) {
        for (let i = 0; i < origin.length; i++) {
          this.$set(origin, i, { checked: false, tag_id: origin[i].tag_id, tag_name: origin[i].tag_name })
        }
      } else {
        for (let i = 0; i < origin.length; i++) {
          if (this.select.includes(origin[i].tag_id)) {
            this.$set(origin, i, { checked: true, tag_id: origin[i].tag_id, tag_name: origin[i].tag_name })
          } else {
            this.$set(origin, i, { checked: false, tag_id: origin[i].tag_id, tag_name: origin[i].tag_name })
          }
        }
      }
      this.$emit('select', origin, this.select, this.title)
    }
  }
}
</script>

<style lang='scss' scoped>
.modelWrapper /deep/ .el-dialog__body .tiers-main .el-select {
  width: 100%;
}
.tiers-main {
  text-align: center;
  /deep/ .el-select .el-select__tags .el-tag {
    min-width: 80px;
    background: rgba(74,144,226,0.07);
    border-radius: 15px;
    border: 1px solid rgba(39,119,255,1);
    color: rgba(39,119,255,1);
  }
  /deep/ .el-select .el-select__tags .el-tag__close {
    font-size: 16px;
    background-color: transparent;
    color: #2777FF;
  }
}
.modelWrapper /deep/ .add-button {
    background-color: #2777FF;
    color: #fff;
    border: 1px solid #2777FF;
  }
.modelWrapper /deep/ .close {
  border: 1px solid #2777FF;
  color: #2777FF;
}
</style>
