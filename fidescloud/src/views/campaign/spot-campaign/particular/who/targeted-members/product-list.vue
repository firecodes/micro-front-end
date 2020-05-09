<template>
  <el-select
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
    :remote-method="remoteMethod"
    @change = "change"
    filterable
    multiple
    ref="product-list"
    remote
    reserve-keyword
    style="width:300px;"
    v-model="product"
    v-selectLoadmore="selectLoadMore"
  >
    <el-option
      :key="item.product_code"
      :label="item.product_name"
      :value="item.product_code"
      v-for="item in list">
    </el-option>
    <div style="text-align: center;" >
      <span style="font-size:13px;" v-if="list.length>=total_count" />
      <i class="el-icon-loading"  v-else />
    </div>
  </el-select>
</template>
<script>
  import { queryProductList } from '@/api/master'
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
        pass_parameter: [],
        product: '',
        list: [],
        total_count: 0,
        page: 0,
        old_list: []
      }
    },
    created() {
      this.getProductList()
    },
    methods: {
      selectLoadMore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getProductList()
      },
      remoteMethod(query) {
        this.page = 0
        this.list = []
        this.total_count = 0
        this.getProductList({ product_query: query })
      },
      getProductList(obj = {}) {
        this.page = ++this.page
        queryProductList({
          page_no: this.page,
          page_size: pageLimit,
          ...obj
        }).then((res) => {
          const result = res.return_result
          if (!checkObjHasOwnProperty(result, 'products')) {
            return false
          }
          this.total_count = result.total_count
          this.list = this.list.concat(result.products)
          this.old_list = this.old_list.concat(result.products)
        })
      },
      change() {
        // 去重
        var arr = this.pass_parameter
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].product_code === arr[j].product_code) {
              arr.splice(j, 1)
              j--
            }
          }
        }
        return { value: arr, type: 'product', index: this.product }
      }
    },
    watch: {
      value() {
        this.product = this.value
      },
      product: {
        handler(val, old_val) {
          console.log(val, old_val)
          let del_value = ''
          if (val.length < old_val.length) {
            // 删除
            del_value = val.concat(old_val).filter((v, i, arr) => {
              return arr.indexOf(v) === arr.lastIndexOf(v)
            })
          }
          if (del_value) {
            this.pass_parameter = []
          }
          for (const item of this.old_list) {
            if (val.indexOf(item.product_code) > -1) {
              this.pass_parameter.push(item)
            }
          }
        }
      }
    }
  }
</script>
