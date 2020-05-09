<template>
  <div class="add-category">
    <el-dialog :title="$t('member.fc_member_group_add_new_title_label')" :visible.sync="dialog_visible" width="700px" :before-close="handleClose">
      <el-table :data="table_data" border style="width: 100%">
        <el-table-column prop="group_name" :label="$t('member.fc_member_group_my_table_name_label')">
          <template slot-scope="scope">
            <template v-if="scope.row.type==='addOrEdit'">
              <div class="add">
                <el-input :placeholder="$t('member.fc_member_group_add_new_name_input_label')" maxlength="200" v-model="table_data[scope.$index].group_name" />
                <label class="cancel" @click="cancelAddCategory(scope.$index, scope.row)">{{$t('loyalty.fc_add_new_category_table_cancel_label')}}</label>
              </div>
            </template>
            <template v-else>
              {{scope.row.group_name}}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="operation" :label="$t('loyalty.fc_add_new_category_table_operation_label')" width="200px">
            <template slot-scope="scope">
              <template v-if="scope.row.type==='addOrEdit'">
                <label @click.stop="saveCategory(scope.row, scope.$index)" class="ok">{{$t('loyalty.fc_add_new_category_table_ok_label')}}</label>
              </template>
              <template v-else>
                <div class="operation">
                  <label @click.stop="editCategory(scope.$index, scope.row)" class="edit">{{$t('loyalty.fc_add_new_category_table_edit_label')}}</label>
                  <label @click.stop="deleteCategory(scope.$index)" class="delete">{{$t('loyalty.fc_add_new_category_table_delete_label')}}</label>
                </div>
              </template>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" class="close">{{$t('loyalty.fc_add_new_category_btn_close_label')}}</el-button>
        <el-button type="primary"  @click="addCategory" class="add-button">{{$t('loyalty.fc_add_new_category_btn_add_label')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addMemberTagGroup, editMemberTagGroup, deleteMemberTagGroup } from '@/api/memberTag'
import { GlobalMixin } from '@/utils/mixin'
export default {
  mixins: [GlobalMixin],
  props: {
    dialog_show: {
      type: Boolean,
      default: false
    },
    content: {
      type: Array,
      default: () => []
    },
    id: ''
  },
  watch: {
    async dialog_show() {
      this.dialog_visible = this.dialog_show
      this.origin_data = JSON.parse(JSON.stringify(this.table_data))
      await this.$nextTick()
      this.getTagGroupList()
      this.resetModel()
    },
    dialog_visible() {
      // this.$emit('closeSelectCategory', this.table_data)
      // this.$emit('handleDialogVisible', this.dialog_visible)
    },
    content() {
      const temp = this.content
      this.table_data = temp
      this.origin_data = JSON.parse(JSON.stringify(this.table_data))
    }
  },
  data() {
    return {
      dialog_visible: false,
      table_data: [],
      origin_data: []
    }
  },
  created() {
    this.getTagGroupList()
  },
  methods: {
    resetModel() {
      for (let i = 0; i < this.content.length; i++) {
        if (!this.content[i].group_id) {
          this.content.splice(i, 1)
        } else {
          this.$set(this.content, i, { group_name: this.content[i].group_name, group_id: this.content[i].group_id, type: 'none' })
        }
      }
    },
    handleClose() {
      this.dialog_visible = false
      this.$emit('closeTagGroupModel')
    },
    getTagGroupList() {
      const ret_data = this.content
      this.table_data = ret_data
    },
    addCategory() {
      this.table_data.splice(0, 0, {
        type: 'addOrEdit',
        group_name: '',
        group_id: ''
      })
    },
    saveCategory(row, index) {
      var name = row.group_name
      var code = row.group_id
      if (name === '' || name === null || name === undefined) {
        this.$message.error('category name is not null')
        return false
      }
      if (row.group_id) {
        // 修改
        this.update({ group_id: code, group_name: name }, index)
      } else {
        // 新增
        this.add({ group_name: name }, index)
      }
    },
    update(params, index) {
      editMemberTagGroup(params).then(res => {
        this.$set(this.table_data, index, {
          group_name: res.return_result.group_name,
          group_id: res.return_result.id
        })
        this.table_data = this.table_data.sort((a, b) => a.group_name.localeCompare(b.group_name, 'zh-CN'))
        this.$message({
          message: 'Success',
          type: 'success'
        })
        // this.handleClose()
      }).catch(err => {
        this.$message.error(err)
      })
    },
    add(params, index) {
      addMemberTagGroup({
        category_id: this.id,
        group_name: params.group_name
      }).then(res => {
        if (res.return_result) {
          this.$set(this.table_data, index, Object.assign({}, params, {
            group_id: res.return_result.id,
            group_name: res.return_result.group_name
          }))
          this.table_data = this.table_data.sort((a, b) => a.group_name.localeCompare(b.group_name, 'zh-CN'))
          this.$message({
            message: 'Success',
            type: 'success'
          })
          // this.handleClose()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    editCategory(index, row) {
      // this.$set(this.table_data, index, Object.assign({}, this.table_data[index], { type: 'addOrEdit' }))
      const { result, idx } = this.filterItem(row)
      this.$set(this.table_data, idx, Object.assign({}, result, { type: 'addOrEdit', oriName: result.name }))
    },
    deleteCategory(index) {
      this.deleteItem().then(() => {
        deleteMemberTagGroup(this.table_data[index].group_id).then(res => {
          if (res.return_result) {
            this.table_data.splice(index, 1)
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.handleClose()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    cancelAddCategory(index, row) {
      const { result, idx } = this.filterItem(row)
      if (row.group_id) {
        this.$set(this.table_data, idx, Object.assign({}, result, { type: 'none', name: result.oriName }))
      }
      if (!row.group_id) {
        this.table_data.splice(index, 1)
      }

      this.$set(this.table_data, index, Object.assign({}, this.origin_data[index], { type: 'none' }))
      if (!this.table_data[index].group_name || !this.table_data[index].group_id) {
        this.table_data.splice(index, 1)
      }
    },
    filterItem(row) {
      let result = null
      let idx = ''
      result = this.table_data.find((item, index) => {
        if (item.group_id === row.group_id) {
          idx = index
          return true
        }
      })
      return {
        result,
        idx
      }
    }
  }
}
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.add-category{
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
