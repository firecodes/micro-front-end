<template>
  <el-select
    v-selectLoadmore="selectLoadmore"
    v-model="brand"
    :disabled="disabled"
    filterable
    multiple
    style="width:300px;"
    @change = "change"
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
  >
    <el-option
      v-for="(item, index) in list"
      :key="item.brand_code"
      :label="item.brand_name"
      :value="index">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count" />
      <i class="el-icon-loading"  v-else />
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
          this.list = this.list.concat(res.return_result.brands || [])
        })
      },
      change() {
        const arr = []
        const length = this.brand.length
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.brand[i]])
        }
        this.$emit('brand_value', { value: arr, type: 'brand', index: this.brand })
      }
    },
    watch: {
      value() {
        this.brand = this.value
      }
    }
  }
</script>
