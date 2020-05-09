<template>
  <div class="select-product">
    <el-dialog :title="$t('member.fc_member_tag_select_brand_title_label')" :visible.sync="dialog_visible" width="700px" :before-close="handleClose" @open="toggleSelection">
      <div class="search-box">
        <el-input :placeholder="$t('member.fc_member_tag_select_brand_input_label')" v-model="input5" class="input-with-select">
        </el-input>
        <el-button slot="append" icon="el-icon-search" class="search-btn" @click="clickSearch">{{$t('member.fc_member_tag_select_brand_btn_search_label')}}</el-button>
      </div>
      <div class="">
        <el-table ref="multipleTable123" :row-key="getRowKey" v-loading="loading" @selection-change="handleSelectionChange" :data="tableData" size="medium"  highlight-current-row :empty-text="handleGlobalI18n('system', 'no_data')">
          <el-table-column
            type="selection"
            align="center"
            :reserve-selection="true"
            width="80">
          </el-table-column>
          <el-table-column prop="brand_code" min-width="90" align="center" :label="$t('member.fc_member_tag_select_brand_table_code_label')">
            <template slot-scope="scope">
              {{scope.row.brand_code || table_placeholder}}
            </template>
          </el-table-column>
          <el-table-column prop="brand_name" min-width="90" align="center" :label="$t('member.fc_member_tag_select_brand_table_name_label')">
            <template slot-scope="scope">
              {{scope.row.brand_name || table_placeholder}}
            </template>
          </el-table-column>
          <el-table-column prop="brand_desc" min-width="90" align="center" :label="$t('member.fc_member_tag_select_brand_table_desc_label')">
            <template slot-scope="scope">
              {{scope.row.brand_desc || table_placeholder}}
            </template>
          </el-table-column>
        </el-table>
        <pagination-container
          :page = "listQuery.page_no"
          :page_size = 'listQuery.page_size'
          :total = 'total'
          @handleCurrentChange = "handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        ></pagination-container>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" class="close">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
        <el-button type="primary"  @click="handleSave" class="add-button">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { queryBrandList } from '@/api/master'
  import PaginationContainer from '@/components/PaginationContainerNew'
  export default {
    components: {
      PaginationContainer
    },
    props: {
      dialog_show_brands: {
        type: Boolean,
        default: false
      },
      content: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        listQuery: {
          page_no: 1,
          page_size: 10,
          asc: true,
          condition: ''
        },
        total: '',
        dialog_visible: false,
        input5: '',
        tableData: [],
        loading: true,
        multipleSelection: [],
        domArr: [],
        aa: [],
        total_page: 0
      }
    },
    mounted() {
      this.getBrandsList()
    },
    watch: {
      content() {
        this.multipleSelection = this.content
      },
      dialog_show_brands() {
        this.listQuery.page_no = 1
        this.listQuery.condition = ''
        this.input5 = ''
        this.dialog_visible = this.dialog_show_brands
        this.getBrandsList()
      }
    },
    methods: {
      filterData(arrOrigin, arr) {
        this.domArr = []
        for (let i = 0; i < arrOrigin.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (arrOrigin[i].brand_code === arr[j].brand_code) {
              this.domArr.push(arrOrigin[i])
            }
          }
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      getRowKey(row) {
        return row.brand_code
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getBrandsList()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getBrandsList()
      },
      getBrandsList() {
        this.loading = true
        queryBrandList(this.listQuery).then(res => {
          this.loading = false
          if (res.return_result) {
            const { total_count, total_page } = res.return_result
            if (!res.return_result.brands) {
              res.return_result.brands = []
            }
            this.tableData = res.return_result.brands.sort((a, b) => a.brand_name.localeCompare(b.brand_name, 'zh-CN'))
            this.total = total_count
            this.total_page = total_page
            this.toggleSelection()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err)
        })
      },
      toggleSelection() {
        if (this.aa.length === this.content) {
          return true
        }
        this.filterData(this.tableData, this.content)
        var rows = this.domArr
        if (rows) {
          setTimeout(() => {
            this.$nextTick(() => {
              rows.forEach(row => {
                if (this.aa.includes(row.brand_code)) {
                  return true
                }
                this.aa.push(row.brand_code)
                this.$refs.multipleTable123 && this.$refs.multipleTable123.toggleRowSelection(row, true)
              })
            })
          }, 200)
        } else {
          this.$refs.multipleTable123 && this.$refs.multipleTable123.clearSelection()
        }
      },
      handleCancel() {},
      handleClose() {
        this.$emit('handleBrandsDialogVisible', false)
      },
      handleSave() {
        // this.aa[] this.content   this.tableData
        this.content.forEach(item => {
          if (!this.aa.includes(item.brand_code)) {
            this.multipleSelection.push(item)
          }
        })
        this.$emit('handleSelectedBrands', this.multipleSelection)
      },
      clickSearch() {
        this.listQuery.page_no = 1
        this.listQuery.condition = this.input5 === '' ? '' : this.input5.trim()
        this.getBrandsList()
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .select-product{
    .search-box {
      display: flex;
      margin-bottom: 10px;
      .el-input {
        width: 600px;
      }
      .search-btn {
        background-color: #2777FF !important;
        color: #fff !important;
        margin-left: 8px;
        border-radius: 4px;
      }
      .update-btn {
        img {
          width: 14px;
        }
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
