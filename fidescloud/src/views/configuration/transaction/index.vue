<template>
  <div class="transactionPage">
    <search
      :setnull = "setnull"
      :lodingExport="lodingExport"
      @handleSearch="handleSearch"
      @handleAdvanced="handleAdvanced"
      @handleExport="handleExport"
    />
    <advanced-search
      :active="active"
      :loadingAdvanced="loadingAdvanced"
      :typeList="typeList"
      :channelList="channelList"
      :storelList="storelList"
      :loadingStore="loadingStore"
      :purchasedList="purchasedList"
      @handleAdvancedSearch="handleAdvancedSearch"
      @reGetStore="reGetStore"
    />
    <list
      :loading="loading"
      :content="tableData"
      :total="total"
      :listQuery="listQuery"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    />
  </div>
</template>

<script>
import Search from './components/search'
import List from './components/list'
import AdvancedSearch from './components/advancedsearch'
import { transactionIndex } from './mixins/index'
export default {
  components: {
    Search,
    List,
    AdvancedSearch
  },
  mixins: [transactionIndex],
  created() {
    this.init()
  }
}
</script>
<style lang='scss' scoepd>
.transactionPage {
  padding: 50px;
}
</style>
