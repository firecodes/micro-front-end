<template>
  <el-select
    v-selectLoadmore="selectLoadMore"
    v-model="category"
    :disabled="disabled"
    filterable
    multiple
    style="width:300px;"
    @change = "change"
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
  >
    <el-option
      v-for="(item, index) in list"
      :key="item.product_category_code"
      :label="item.product_category_name"
      :value="index">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count" />
      <i class="el-icon-loading"  v-else />
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
        type: Array,
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
      selectLoadMore() {
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
          this.list = this.list.concat(res.return_result.product_categories || [])
        })
      },
      change() {
        const arr = []
        const length = this.category.length
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.category[i]])
        }
        this.$emit('category_value', { value: arr, type: 'category', index: this.category })
      }
    },
    watch: {
      value() {
        this.category = this.value
      }
    }
  }
</script>
