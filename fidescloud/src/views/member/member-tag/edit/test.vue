<template>
  <div class="select-product">
    <el-dialog title="Select product brands" :visible.sync="dialog_visible" width="700px" :before-close="handleClose">
      <div class="search-box">
        <el-input placeholder="Please enter brand code or brand name" v-model="input5" class="input-with-select">
        </el-input>
        <el-button slot="append" icon="el-icon-search" class="search-btn" @click="clickSearch">Search</el-button>
      </div>
      <div class="">
        <el-table ref="multipleTable" :row-key="getRowKey" @selection-change="handleSelectionChange" v-loading="loading" :data="tableData" size="medium"  highlight-current-row :empty-text="handleGlobalI18n('system', 'no_data')">
          <el-table-column
            type="selection"
            align="center"
            :reserve-selection="true"
            width="80">
          </el-table-column>
          <el-table-column prop="brand_code" min-width="90" align="center" label="Brand code">
            <template slot-scope="scope">
              {{scope.row.brand_code || table_placeholder}}
            </template>
          </el-table-column>
          <el-table-column prop="brand_name" min-width="90" align="center" label="Brand name">
            <template slot-scope="scope">
              {{scope.row.brand_name || table_placeholder}}
            </template>
          </el-table-column>
          <el-table-column prop="brand_desc" min-width="90" align="center" label="Brand description">
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
        <el-button @click="handleClose" class="close">Cancel</el-button>
        <el-button type="primary"  @click="handleSave" class="add-button">Save</el-button>
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
          page_size: 15,
          asc: true,
          condition: ''
        },
        total: '',
        dialog_visible: false,
        input5: '',
        tableData: [],
        loading: true,
        multipleSelection: [],
        domArr: []
      }
    },
    created() {
      this.getBrandsList()
    },
    watch: {
      dialog_show_brands() {
        this.dialog_visible = this.dialog_show_brands
      }
    },
    methods: {
      getRowKey(row) {
        return row.brand_code
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
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
            const { brands, total_count } = res.return_result
            this.tableData = brands
            this.total = total_count
            this.filterData(brands)
            this.toggleSelection(this.domArr)
            // this.$nextTick(() => {
            //   setTimeout(() => {
            //     this.toggleSelection(this.domArr)
            //   }, 1000)
            // })
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      filterData(arr) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < this.content.length; j++) {
            if (arr[i].brand_code === this.content[j]) {
              this.domArr.push(arr[i])
            }
          }
        }
      },
      toggleSelection(rows) {
        
        this.$nextTick(function() {
          console.log('rows', this.$refs.multipleTable)
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row, true)
            });
          } else {
            this.$refs.multipleTable.clearSelection()
          }
        })
      },
      handleCancel() {},
      handleClose() {
        this.$emit('handleBrandsDialogVisible', false)
      },
      handleSave() {
        this.$emit('handleSelectedBrands', this.multipleSelection)
      },
      clickSearch() {
        this.listQuery.condition = this.input5
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
