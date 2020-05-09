<template>
  <el-select
    :disabled="disabled"
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
    @change = "change"
    filterable
    multiple
    ref="brand-list"
    style="width:300px;"
    v-model="brand"
    v-selectLoadmore="selectLoadmore"
  >
    <el-option
      :key="item.brand_code"
      :label="item.brand_name"
      :value="index"
      v-for="(item, index) in list">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count"></span>
      <i class="el-icon-loading"  v-else></i>
    </div>
  </el-select>
</template>
<script>
  import { queryBrandList } from '@/api/master'
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
        brand: '',
        list: [],
        total_count: 0,
        page: ''
      }
    },
    created() {
      this.getProductBrandList()
    },
    methods: {
      selectLoadmore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getProductBrandList()
      },
      getProductBrandList() {
        this.page = ++this.page
        queryBrandList({
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.brands)
        })
      },
      change() {
        const arr = []
        const length = this.brand.length
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.brand[i]])
        }
        return { value: arr, index: this.brand }
      }
    },
    watch: {
      value() {
        this.brand = this.value
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>
