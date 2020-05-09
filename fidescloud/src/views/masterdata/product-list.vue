<template>
  <el-select
    v-selectLoadmore="selectLoadmore"
    v-model="product"
    :disabled="disabled"
    filterable
    style="width:200px;"
    @change = "change"
  >
    <el-option
      v-for="item in list"
      :key="item.product_code"
      :label="item.product_name"
      :value="item.product_code">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count">{{$t('system.after_loaded')}}</span>
      <i class="el-icon-loading"  v-else></i>
    </div>
  </el-select>
</template>
<script>
  import { queryProductList } from '@/api/master'
  import { pageLimit } from '@/api/api'
  export default{
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      },
      parentProductCategoryCode: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        product: '',
        list: [],
        total_count: 0,
        page: ''
      }
    },
    methods: {
      selectLoadmore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getProductList()
      },
      getProductList() {
        this.page = ++this.page
        queryProductList({
          product_category_code: this.parentProductCategoryCode,
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.products)
        })
      },
      change() {
        this.$emit('product_list', { value: this.product, type: 'product' })
      }
    },
    watch: {
      parentProductCategoryCode(newValue, oldValue) {
        if (this.parentProductCategoryCode.length > 0 && newValue !== oldValue) {
          [this.product, this.list, this.page, this.total_count] = ['', [], 0, 0]
          this.getProductList()
        }
      },
      value() {
        this.product = this.value
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
