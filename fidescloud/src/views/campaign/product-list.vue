<template>
  <el-select
    v-selectLoadmore="selectLoadMore"
    v-model="product"
    filterable
    multiple
    remote
    reserve-keyword
    :remote-method="remoteMethod"
    style="width:300px;"
    @change = "change"
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
  >
    <el-option
      v-for="(item,index) in list"
      :key="item.product_code"
      :label="item.product_name.length > 20 ? item.product_name.substring(0, 20) + '...' : item.product_name"
      :value="index">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count" />
      <i class="el-icon-loading"  v-else />
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
          this.list = this.list.concat(result.products || [])
        })
      },
      change() {
        const arr = []
        const length = this.product.length
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.product[i]])
        }
        this.$emit('select-product-arr', { value: arr, type: 'product', index: this.product })
      }
    },
    watch: {
      value() {
        this.product = this.value
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped />
