<template>
  <ed-select>
    <el-select
    class="registration-store"
    clearable
    :loading="loading"
    v-selectLoadmore="selectLoadmore"
    v-model="store"
    :placeholder="$t('reporting.fc_reporting_oneclick_search_channel_pos_store_input_lable')"
    filterable
    style="width:100%"
    @change = "change"
    :multiple="multiple"
  >
      <el-option
        v-for="(item,index) in list"
        :label="item.store_name"
        :key="index+ item.store_name"
        :value="item.id">
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
  import { storeList } from '@/api/store'
  import { pageLimit } from '@/api/api'
  export default{
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      city_id: {
        type: [String, Number]
      },
      type: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Number, Array]
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
        storeList({
          key: '0',
          city_id: this.city_id ? this.city_id : null,
          page_no: this.page,
          page_size: pageLimit,
          language: sessionStorage.getItem('language')
        }).then((res) => {
          this.loading = false
          const result = res.return_result
          this.total_count = result.total_count
          const has = Object.prototype.hasOwnProperty
          if (has.call(result, 'results')) {
            this.list = this.list.concat(result.results || [])
          }
        }).catch((res) => {
          this.loading = false
          // this.$message(res.return_message)
        })
      },
      change() {
        this.$emit('registration_store', { value: this.store, type: this.type })
      }
    },
    watch: {
      value() {
        this.store = this.value
      },
      city_id() {
        this.page = 0
        this.list = []
        this.store = ''
        this.getStoreList()
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .registration-store{
    /deep/ .el-tag.el-tag--info{
      max-width: 250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
