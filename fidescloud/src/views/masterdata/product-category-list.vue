<template>
      <el-select
        v-selectLoadmore="selectLoadmore"
        v-model="category"
        :disabled="disabled"
        filterable
        style="width:200px;"
        @change = "change"
      >
        <el-option
          v-for="item in list"
          :key="item.product_category_code"
          :label="item.product_category_name"
          :value="item.product_category_code">
        </el-option>
        <div style="text-align: center" >
          <i class="el-icon-loading"  v-if="list.length<total_count"></i>
        </div>
      </el-select>
</template>
<script>
  import { queryProductCategoryList } from '@/api/master'
  import { pageLimit } from '@/api/api'
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
        type: String,
        default: ''
      }
    },
    data() {
      return {
        category: '',
        list: [],
        total_count: 0,
        page: ''
      }
    },
    created() {
      this.getProductCategoryList()
    },
    methods: {
      selectLoadmore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getProductCategoryList()
      },
      getProductCategoryList() {
        this.page = ++this.page
        queryProductCategoryList({
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.product_categories)
        })
      },
      change() {
        this.$emit(this.type, { value: this.category, type: 'category' })
      }
    },
    watch: {
      value() {
        this.category = this.value
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
