<template>
  <div class="add-category">
    <el-dialog :visible.sync="dialog_visible" width="600px" :before-close="handleClose">
      <div class="tiers-main">
        <el-button v-for="(item, index) in tag_list" :key="index" :class="{'is-checked': item.checked}">
          <span>{{ item.tag_name }} <i class="el-icon-close" @click="clickDelete(index, item.tag_id)"></i></span>
        </el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" class="close">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
        <el-button type="primary"  @click="save" class="add-button">{{$t('member.fc_operation_btn_save_label')}}</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
  export default {
    props: {
      dialog_show: {
        type: Boolean,
        default: false
      },
      content: {
        type: Array,
        default: () => []
      },
      origin: {
        type: Array,
        default: () => []
      }
    },
    watch: {
      dialog_show() {
        this.dialog_visible = this.dialog_show
        if (this.dialog_show) {
          const tmp = JSON.parse(JSON.stringify(this.content))
          this.tag_list = tmp
        }
      },
      dialog_visible() {
        this.$emit('closeSelectCategory')
        this.$emit('handleDialogVisible', this.dialog_visible)
      },
      content() {
        this.tag_list = this.content
      }
    },
    data() {
      return {
        dialog_visible: false,
        table_data: [],
        tag_list: [],
        idArr: []
      }
    },
    created() {
    },
    methods: {
      clickDelete(index, id) {
        // 遍历查找所有的tag，找到当前点击的id号，将其checked设置为false
        const copy = JSON.parse(JSON.stringify(this.content))
        for (let i = 0; i < copy.length; i++) {
          if (copy[i].tag_id === id) {
            this.$set(copy, i, { tag_id: id, checked: !copy[i].checked, tag_name: copy[i].tag_name })
          }
        }
        this.$emit('deleteTag', copy)
      },
      handleTag() {
        this.$nextTick(() => {
          this.tag_list = this.content
        })
      },
      save() {
        // 获取到所有的tag id
        this.idArr = []
        for (let i = 0; i < this.tag_list.length; i++) {
          this.tag_list[i].checked && this.idArr.push(this.tag_list[i].tag_id)
        }
        this.$emit('saveModelTag', this.idArr, false)
      },
      handleClose() {
        this.dialog_visible = false
        this.$emit('closeSelectCategory')
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .add-category{
    .tiers-main {
      width: 560px;
      min-height: 250px;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 15px 10px;
      .el-button {
        border: 1px solid #ccc !important;
        border-radius: 18px;
        color: #333;
        background-color: rgba(74, 144, 226, 0.07) !important;
        margin-left: 0;
        margin-right: 20px;
        margin-bottom: 20px;
      }
      .is-checked {
        border: 1px solid #2777FF !important;
        color: #2777FF;
      }
    }
    .search{
      display: flex;
      margin: -10px 0 20px 0;
      .el-input{
        margin-right: 20px;
        width: 280px;
      }
    }
    .el-button{
      min-width: 80px;
    }
    .add{
      display: flex;
      align-items: center;
      .el-input{
        margin-right: 20px;
      }
    }
    .edit, .cancel, .ok, .delete{
      width:80px;
      height:30px;
      background:rgba(74,144,226,0.07);
      border-radius:4px;
      cursor: pointer;
      color: $new-primary;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close{
      border-color: $new-primary;
      color: $new-primary
    }
    .add-button, .search-button{
      background-color: $new-primary;
      border-color: $new-primary;
    }
    .operation{
      display: flex;
      justify-content: space-between;
      font-size:14px;
      font-weight:bold;
      line-height:17px;
      align-items: center;
    }
  }
</style>
