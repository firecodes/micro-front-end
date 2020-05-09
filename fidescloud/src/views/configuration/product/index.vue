<template>
  <div class="productWapper">
    <search
      :setnull="setnull"
      :loadingExport="loadingExport"
      @handleSearch="handleSearch"
      @handleAdvanced="handleAdvanced"
      @handleExport="handleExport"
    ></search>
    <advanced-search
      :active="active"
      :brandList="brandList"
      :categoryList="categoryList"
      :loadingSearch="loadingSearch"
      @handleAdvacedSearch="handleAdvacedSearch"
    ></advanced-search>
    <list
      :loadingTable="loadingTable"
      :content="list"
      :count="+total_count"
      :listQuery="listQuery"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @handleDelete="handleDelete"
    ></list>
  </div>
</template>
<script>
import Search from './components/search'
import AdvancedSearch from './components/advancesearch'
import List from './components/list'
import { productListMixins } from './mixins/productlist'
import { GlobalMixin } from '@/utils/mixin'
export default {
  components: {
    Search,
    AdvancedSearch,
    List
  },
  mixins: [GlobalMixin, productListMixins],
  data() {
    return {}
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getList()
      this.loadingTable = false
    }
  }
}
</script>
<style lang='scss' scoped>
.productWapper {
  padding: 50px;
}
</style>