<template>
  <ed-select>
    <el-select
      :disabled="disabled"
      :loading = "loading"
      :placeholder="handleGlobalI18n('system', 'please_select')"
      @change = "change"
      clearable
      filterable
      style="width:100%"
      v-model="store"
      v-selectLoadmore="selectLoadmore"
    >
      <el-option
        :key="index+ item.store_name"
        :label="item.store_name"
        :value="item.store_code"
        v-for="(item,index) in list">
      </el-option>
      <div style="text-align: center" >
        <!-- <i class="el-icon-loading"  v-if="list.length<total_count"></i>
        <span style="font-size:13px;" v-if="list.length>=total_count && page>1">{{handleGlobalI18n('system', 'after_loaded')}}</span> -->
        <span style="font-size:13px;" v-if="list.length>=total_count"></span>
        <i class="el-icon-loading"  v-else></i>
      </div>
    </el-select>
  </ed-select>
</template>
<script>
  import { queryStoreList } from '@/api/master'
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
        loading: true,
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
      selectLoadmore() {
        if (this.list.length >= this.total_count) {
          return
        } else {
          this.getStoreList()
        }
      },
      getStoreList() {
        this.page = ++this.page
        queryStoreList({
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.loading = false
          const result = res.return_result
          this.total_count = result.total_count
          const has = Object.prototype.hasOwnProperty
          if (has.call(result, 'stores')) {
            this.list = this.list.concat(result.stores)
          }
        }).catch((res) => {
          this.loading = false
          // this.$message(res.return_message)
        })
      },
      change() {
        this.$emit(this.type, { value: this.store, type: this.type })
      }
    },
    watch: {
      value() {
        this.store = this.value
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
