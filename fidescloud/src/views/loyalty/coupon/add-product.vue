<template>
  <el-dialog :title="handleGlobalI18n('loyalty', 'add_product')" :visible.sync="dialogFormVisibleProduct" append-to-body>
      <el-form ref="addProcuct" label-width="150px" :model="form">
        <el-form-item :label="handleGlobalI18n('loyalty', 'product_category')" prop="category_code"
        :rules="{required: true, message: handleGlobalI18n('validation', 'product_category_null'), trigger: ['blur', 'change']}">
          <product-category-list
            type="category_list"
            @category_list = "selectCategory"
            :value="form.category_code"
          ></product-category-list>
          <el-button type="primary" @click="search">{{handleGlobalI18n('loyalty', 'query')}}</el-button>
        </el-form-item>
        <el-table :data="tableData"  v-loading="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
          <el-table-column :label="handleGlobalI18n('loyalty', 'product_name')" align="center" prop="product_name"></el-table-column>
          <el-table-column :label="handleGlobalI18n('loyalty', 'product_operation')" align="center">
            <template slot-scope="scope">
              <el-button
                @click="handleSelect(scope.row)">{{handleGlobalI18n('loyalty', 'select')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination-container
          :page = "page"
          :page_size = 'pageLimit'
          :total = 'total_count'
          @handleCurrentChange = "handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        ></pagination-container>
      </el-form>
    <div style="text-align: center">
      <el-button @click="dialogFormVisibleProduct = false">{{handleGlobalI18n('loyalty', 'back')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { queryProductList } from '@/api/master'
  import { pageLimit } from '@/api/api'
  import ProductList from '@/views/=-r/product-list'
  import ProductCategoryList from '@/views/masterdata/product-category-list'
  import PaginationContainer from '@/components/PaginationContainer'
  export default {
    components: {
      ProductList,
      ProductCategoryList,
      PaginationContainer
    },
    props: {
      state: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pageLimit: pageLimit,
        dialogFormVisibleProduct: false,
        form: {
          category_code: ''
        },
        listLoading: false,
        tableData: [],
        total_count: 0,
        page: 1
      }
    },
    methods: {
      search() {
        this.$refs['addProcuct'].validate((valid) => {
          if (valid) {
            this.getProductList()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleSelect(val) {
        this.dialogFormVisibleProduct = false
        this.$emit('handleSelectProductInfo', val)
      },
      handleCurrentChange(val) {
        this.page = val
        this.getProductList()
      },
      handleSizeChange(val) {
        this.pageLimit = val
        this.getProductList()
      },
      selectCategory(obj) {
        this.form.category_code = obj.value
        this.getProductList()
      },
      getProductList() {
        this.listLoading = true
        queryProductList({
          product_category_code: this.form.category_code,
          page_no: this.page,
          page_size: this.pageLimit
        }).then((res) => {
          this.listLoading = false
          this.total_count = res.return_result.total_count
          this.tableData = res.return_result.products || []
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    watch: {
      state() {
        this.dialogFormVisibleProduct = this.state
      },
      dialogFormVisibleProduct() {
        this.$emit('handleAddProduct', this.dialogFormVisibleProduct)
      }
    }
  }
</script>
