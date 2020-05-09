<template>
  <ed-select>
    <el-select
    clearable
    :loading="loading"
    v-selectLoadmore="selectLoadMore"
    v-model="coupon"
    :multiple="multiple"
    :placeholder="handleGlobalI18n('system', 'please_select')"
    filterable
    style="width:200px;"
    @change = "change"
  >
    <el-option
      v-for="item in list"
      :key="item.coupon_code"
      :label="item.coupon_name"
      :value="item.coupon_code">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count"></span>
      <i class="el-icon-loading"  v-else></i>
    </div>
  </el-select>
  </ed-select>
</template>
<script>
  import { queryCouponListBy } from '@/api/loyalty'
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
        loading: true,
        coupon: '',
        list: [],
        total_count: 0,
        page: ''
      }
    },
    created() {
      this.getCouponList()
    },
    methods: {
      selectLoadMore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getCouponList()
      },
      getCouponList() {
        this.page = ++this.page
        queryCouponListBy({
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.loading = false
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.coupons)
        }).catch((res) => {
          this.loading = false
          this.$message(res.return_message)
        })
      },
      change() {
        this.$emit('select-coupon-list', this.coupon)
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
