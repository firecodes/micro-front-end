<template>
  <el-select
    clearable
    v-selectLoadmore="selectLoadMore"
    v-model="redemption"
    :multiple="multiple"
    :placeholder="handleGlobalI18n('system', 'please_select')"
    filterable
    style="width:200px;"
    @change = "change"
  >
    <el-option
      v-for="item in list"
      :key="item.redemption_event_code"
      :label="item.redemption_event_name"
      :value="item.redemption_event_code">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count"></span>
      <i class="el-icon-loading"  v-else></i>
    </div>
  </el-select>
</template>
<script>
  import { queryValidRedemptionEvent } from '@/api/redemption'
  import { pageLimit } from '@/api/api'
  export default{
    props: {
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        redemption: '',
        list: [],
        total_count: 0,
        page: ''
      }
    },
    created() {
      this.getRedemptionList()
    },
    methods: {
      selectLoadMore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getRedemptionList()
      },
      getRedemptionList() {
        this.page = ++this.page
        queryValidRedemptionEvent({
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.redemption_events)
        }).catch((res) => {
          this.$message(res.return_message)
        })
      },
      change() {
        this.$emit('select-redemption-list', this.redemption)
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
