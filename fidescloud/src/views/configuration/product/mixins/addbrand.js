import {
  getBrandList,
  deleteBrand,
  editBrand,
  addBrand as addNewBrand
} from '@/api/product'
export const addBrand = {
  data() {
    return {
      listQuery: {
        page_no: 1,
        page_size: 10
      },
      brandList: [],
      total: '',
      loading: false
    }
  },
  methods: {
    async brandlists() {
      this.loading = true
      await getBrandList(this.listQuery).then(res => {
        if (res.return_result) {
          this.total = res.return_result.total_count
          this.brandList = res.return_result.results
          this.$emit('updateBrandData', 'update')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
      this.loading = false
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.listQuery.page_no = 1
      this.brandlists()
    },
    handleCurrentChange(val) {
      // this.listQuery.page_size = 10
      this.listQuery.page_no = val
      this.brandlists()
    },
    cancelAddCategory(index, row) {
      const { result, idx } = this.filterItem(row)
      if (row.id) {
        this.$set(this.brandList, idx, Object.assign({}, result, { type: 'none', name: result.oriName }))
      }
      if (!row.id) {
        this.brandList.splice(index, 1)
      }
    },
    editCategory(index, row) {
      const { result, idx } = this.filterItem(row)
      this.$set(this.brandList, idx, Object.assign({}, result, { type: 'addOrEdit', oriName: result.name }))
    },
    saveCategory(row, index) {
      const { name, id, code } = row
      if (name === '' || name === null || name === undefined) {
        this.$message.error(this.$t('member.fc_field_input_empty_tips'))
        return false
      }
      if (code) { // edit
        this.update({ id, name: name ? name.trim() : '' })
      } else { // add
        this.add({ name: name ? name.trim() : '' })
      }
    },
    add(obj) {
      return addNewBrand(obj).then(res => {
        if (res.return_result) {
          this.$message.success(this.$t('member.fc_member_tag_add_feedback_label'))
          this.brandlists()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    update(obj) {
      return editBrand(obj).then(res => {
        if (res.return_result) {
          this.$message.success(this.$t('member.fc_member_group_edit_feedback_label'))
          this.brandlists()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    addCategory() {
      this.brandList.splice(0, 0, {
        type: 'addOrEdit',
        id: '',
        name: '',
        code: ''
      })
      this.$nextTick(() => {
        this.$refs.inpt.focus()
      })
    },
    deleteCategory(index, id) {
      this.deleteItem(this.$t('loyalty.fc_operation_delete_confirm_title_label'), this.$t('configuration.fc_product_brand_delete_popup_content_label')).then(res => {
        this.loading = true
        return deleteBrand({ id: id }).then(res => {
          this.loading = false
          if (res.return_result) {
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            this.listQuery.page_no = 1
            // this.listQuery = {
            //   page_no: 1,
            //   page_size: 10
            // }
            this.brandlists()
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
      result = this.brandList.find((item, index) => {
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
    handleClose() {
      this.$emit('closeAddBrand')
    }
  }
}
