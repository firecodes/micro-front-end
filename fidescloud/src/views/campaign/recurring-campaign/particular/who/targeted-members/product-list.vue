<template>
  <el-select
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
    :remote-method="remoteMethod"
    @change = "change"
    filterable
    multiple
    ref="product-list"
    remote
    reserve-keyword
    style="width:300px;"
    v-model="product"
    v-selectLoadmore="selectLoadMore"
  >
    <el-option
      :key="item.product_code"
      :label="item.product_name"
      :value="index"
      v-for="(item,index) in list">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count"></span>
      <i class="el-icon-loading"  v-else></i>
    </div>
  </el-select>
</template>
<script>
  import { queryProductList } from '@/api/master'
  import { pageLimit } from '@/api/api'
  import { checkObjHasOwnProperty } from '@/utils'
  export default{
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      value: {
        type: Array,
        default: ''
      }
    },
    data() {
      return {
        product: '',
        list: [],
        total_count: 0,
        page: 0
      }
    },
    created() {
      this.getProductList()
    },
    methods: {
      selectLoadMore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getProductList()
      },
      remoteMethod(query) {
        this.page = 0
        this.list = []
        this.total_count = 0
        this.getProductList({ product_query: query })
      },
      getProductList(obj = {}) {
        this.page = ++this.page
        queryProductList({
          page_no: this.page,
          page_size: pageLimit,
          ...obj
        }).then((res) => {
          const result = res.return_result
          if (!checkObjHasOwnProperty(result, 'products')) {
            return false
          }
          this.total_count = result.total_count
          this.list = this.list.concat(result.products)
        })
      },
      change() {
        const arr = []
        const length = this.product.length
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.product[i]])
        }
        return { value: arr, type: 'product', index: this.product }
      }
    },
    watch: {
      value() {
        this.product = this.value
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>
