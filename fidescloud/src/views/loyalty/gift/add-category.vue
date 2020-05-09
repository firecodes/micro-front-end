<template>
  <div class="add-category">
    <el-dialog :title="$t('loyalty.fc_add_new_category_title_label')" :visible.sync="dialog_visible" width="700px" :before-close="handleClose">
      <el-table :data="table_data" border style="width: 100%">
        <el-table-column prop="gift_category_name" :label="$t('loyalty.fc_add_new_category_table_category_label')">
          <template slot-scope="scope">
            <template v-if="scope.row.type==='addOrEdit'">
              <div class="add">
                <el-input :placeholder="$t('loyalty.fc_add_new_category_table_input_label')" maxlength="32" v-model="table_data[scope.$index].gift_category_name" />
                <label class="cancel" @click="cancelAddCategory(scope.$index)">{{$t('loyalty.fc_add_new_category_table_cancel_label')}}</label>
              </div>
            </template>
            <template v-else>
              {{scope.row.gift_category_name}}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="operation" :label="$t('loyalty.fc_add_new_category_table_operation_label')" width="200px">
            <template slot-scope="scope">
              <template v-if="scope.row.type==='addOrEdit'">
                <label @click.stop="saveCategory(scope.row, scope.$index)" class="ok" v-loading="save_loading">{{$t('loyalty.fc_add_new_category_table_ok_label')}}</label>
              </template>
              <template v-else>
                <div class="operation">
                  <label @click.stop="editCategory(scope.$index)" class="edit">{{$t('loyalty.fc_add_new_category_table_edit_label')}}</label>
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
  import { queryGiftCategory, createGiftCategory, deleteGiftCategoryByCode, updateGiftCategoryByCode } from '@/api/loyalty'
  export default {
    props: {
      dialog_show: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      dialog_show() {
        this.dialog_visible = this.dialog_show
      },
      dialog_visible() {
        this.getCategoryListByEmit()
        this.$emit('handleDialogVisible', this.dialog_visible)
      }
    },
    data() {
      return {
        save_loading: false,
        gift_category_name: '',
        dialog_visible: false,
        table_data: [],
        emit_table_data: []
      }
    },
    created() {
      this.getCategoryList()
    },
    methods: {
      handleClose() {
        this.dialog_visible = false
        this.getCategoryListByEmit()
      },
      getCategoryListByEmit() {
        queryGiftCategory({ gift_category_name: this.gift_category_name, page_no: 1, page_size: 10000 }).then(res => {
          this.emit_table_data = res.return_result.results
          this.$emit('closeSelectCategory', this.emit_table_data)
        })
      },
      getCategoryList() {
        queryGiftCategory({ gift_category_name: this.gift_category_name, page_no: 1, page_size: 10000 }).then(res => {
          res.return_result.results.map(o => {
            o.rel_gift_category_name = o.gift_category_name
          })
          this.table_data = res.return_result.results
        })
      },
      addCategory() {
        this.table_data.splice(0, 0, {
          type: 'addOrEdit',
          gift_category_name: '',
          rel_gift_category_name: '',
          gift_category_code: ''
        })
      },
      saveCategory(row, index) {
        var name = row.gift_category_name.replace(/(^\s*)|(\s*$)/g, '')
        var code = row.gift_category_code
        if (name === '' || name === null || name === undefined) {
          this.$message.error(this.$t('member.fc_field_input_empty_tips'))
          return false
        }
        this.save_loading = true
        if (row.gift_category_code) {
          // 修改
          this.update({ gift_category_code: code, gift_category_name: name }, index)
        } else {
          // 新增
          this.add({ gift_category_name: name }, index)
        }
      },
      update(params, index) {
        updateGiftCategoryByCode(params).then(res => {
          this.$set(this.table_data, index, {
            type: 'none',
            gift_category_name: params.gift_category_name,
            gift_category_code: res.return_result.gift_category_code
          })
          this.$message({
            message: this.$t('configuration.fc_operation_feedback_notification_label'),
            type: 'success'
          })
          this.save_loading = false
        }).catch(res => {
          this.save_loading = false
          this.$message.error(res)
        })
      },
      add(params, index) {
        createGiftCategory(params).then(res => {
          this.$set(this.table_data, index, Object.assign({}, params, {
            type: 'none',
            gift_category_code: res.return_result.gift_category_code
          }))
          this.$message({
            message: this.$t('configuration.fc_operation_feedback_notification_label'),
            type: 'success'
          })
          this.save_loading = false
        }).catch(res => {
          this.table_data.splice(index, 1)
          this.$message.error(res)
          this.save_loading = false
        })
      },
      editCategory(index) {
        this.$set(this.table_data, index, Object.assign({}, this.table_data[index], { type: 'addOrEdit' }))
      },
      deleteCategory(index) {
        deleteGiftCategoryByCode({ code: this.table_data[index].gift_category_code }).then(res => {
          this.table_data.splice(index, 1)
          this.$message({
            message: this.$t('configuration.fc_operation_feedback_notification_label'),
            type: 'success'
          })
        })
      },
      cancelAddCategory(index) {
        this.table_data[index].gift_category_name = this.table_data[index].rel_gift_category_name
        this.table_data[index].type = 'none'
        // this.$set(this.table_data, index, Object.assign({}, this.table_data[index], { type: 'none' }))
        if (!this.table_data[index].gift_category_name && !this.table_data[index].rel_gift_category_name) {
          this.table_data.splice(index, 1)
        }
      },
      saveAddCategory() {
        createGiftCategory()
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
