<template>
  <el-select
    v-selectLoadmore="selectLoadMore"
    v-model="store"
    filterable
    multiple
    style="width:300px;"
    @change = "change"
     :placeholder="handleGlobalI18n('campaign', 'please_select')"
  >
    <el-option
      v-for="(item,index) in list"
      :key="item.store_code"
      :label="item.store_name"
      :value="index">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count" />
      <i class="el-icon-loading"  v-else />
    </div>
  </el-select>
</template>
<script>
  import { queryStoreList } from '@/api/master'
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
        store: '',
        list: [],
        total_count: 0,
        page: 0
      }
    },
    created() {
      this.getStoreList()
    },
    methods: {
      selectLoadMore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getStoreList()
      },
      getStoreList() {
        this.page = ++this.page
        queryStoreList({
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          const result = res.return_result
          if (!checkObjHasOwnProperty(result, 'stores')) {
            return false
          }
          this.total_count = result.total_count
          this.list = this.list.concat(result.stores || [])
        })
      },
      change() {
        const arr = []
        const length = this.store.length
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.store[i]])
        }
        this.$emit('store_value', { value: arr, type: 'store', index: this.store })
      }
    },
    watch: {
      value() {
        this.store = this.value
      }
    }
  }
</script>
