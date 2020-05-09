import {
  getCategoryList,
  deleteCategory,
  editCategory,
  addCategory as addNewSubCategory
} from '@/api/product'
export const addSubCategory = {
  data() {
    return {
      listQuery: {
        page_no: 1,
        page_size: 10,
        category_parent_id: ''
      },
      subCategoryList: [],
      totals: 0,
      loading: false
    }
  },
  methods: {
    async getSubCategorylists() {
      this.loading = true
      await getCategoryList(this.listQuery).then(res => {
        if (res.return_result) {
          this.totals = res.return_result.total_count
          this.subCategoryList = res.return_result.results
          this.$emit('updateSubCategoryData', 'update')
        } else {
          this.$message.success(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
      this.loading = false
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.listQuery.page_no = 1
      this.getSubCategorylists()
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      this.getSubCategorylists()
    },
    cancelAddSubCategory(index, row) {
      const { result, idx } = this.filterItem(row)
      if (row.id) {
        this.$set(this.subCategoryList, idx, Object.assign({}, result, { type: 'none', name: result.oriName }))
      }
      if (!row.id) {
        this.subCategoryList.splice(index, 1)
      }
    },
    editSubCategory(index, row) {
      const { result, idx } = this.filterItem(row)
      this.$set(this.subCategoryList, idx, Object.assign({}, result, { type: 'addOrEdit', oriName: result.name }))
    },
    saveSubCategory(row, index) {
      const { name, id, code } = row
      if (name === '' || name === null || name === undefined) {
        this.$message.error(this.$t('member.fc_field_input_empty_tips'))
        return false
      }
      if (code) { // edit
        this.updateSub({ id, name: name ? name.trim() : '', category_parent_id: this.listQuery.category_parent_id })
      } else { // add
        this.addSub({ name: name ? name.trim() : '', category_parent_id: this.listQuery.category_parent_id })
      }
    },
    addSub(obj) {
      return addNewSubCategory(obj).then(res => {
        if (res.return_result) {
          this.$message.success(this.$t('member.fc_member_tag_add_feedback_label'))
          this.getSubCategorylists()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    updateSub(obj) {
      return editCategory(obj).then(res => {
        if (res.return_result) {
          this.$message.success(this.$t('member.fc_member_group_edit_feedback_label'))
          this.getSubCategorylists()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    addSubCategory() {
      this.subCategoryList.splice(0, 0, {
        type: 'addOrEdit',
        id: '',
        name: '',
        code: ''
      })
      this.$nextTick(() => {
        this.$refs.inpt.focus()
      })
    },
    deleteSubCategory(index, id) {
      this.deleteItem(this.$t('loyalty.fc_operation_delete_confirm_title_label'), this.$t('configuration.fc_product_sub_category_delete_popup_content_label')).then(res => {
        this.loading = true
        return deleteCategory({ id: id }).then(res => {
          this.loading = false
          if (res.return_result) {
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            this.listQuery.page_no = 1
            this.getSubCategorylists()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err)
        })
      }).catch(() => {
        this.loading = false
      })
    },
    filterItem(row) {
      let result = null
      let idx = ''
      result = this.subCategoryList.find((item, index) => {
        if (item.id === row.id) {
          idx = index
          return true
        }
      })
      return {
        result,
        idx
      }
    },
    handleCloseSub() {
      this.$emit('closeAddSubCategory')
    }
  }
}
