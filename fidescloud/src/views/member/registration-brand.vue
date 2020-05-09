<template>
      <el-select
        clearable
        v-selectLoadmore="selectLoadmore"
        v-model="brand"
        :disabled="disabled"
        :placeholder="$t('member.fc_member_recruitment_registration_brand_input_label')"
        filterable
        style="width:100%;"
        @change = "change"
      >
        <el-option
          v-for="item in list"
          :key="item.brand_code"
          :label="item.brand_name"
          :value="item.brand_code">
        </el-option>
        <div style="text-align: center" >
          <!-- <i class="el-icon-loading"  v-if="list.length<total_count"></i>
          <span style="font-size:13px;" v-if="list.length>=total_count && page>1">{{handleGlobalI18n('system', 'after_loaded')}}</span> -->
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
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        brand: '',
        list: [],
        total_count: 0,
        page: 0
      }
    },
    created() {
      this.getBrandList()
    },
    methods: {
      selectLoadmore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getBrandList()
      },
      getBrandList() {
        this.page = ++this.page
        queryBrandList({
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          const result = res.return_result
          this.total_count = result.total_count
          const has = Object.prototype.hasOwnProperty
          if (has.call(result, 'brands')) {
            this.list = this.list.concat(result.brands || [])
          }
        }).catch((res) => {
          // this.$message(res.return_message)
        })
      },
      change() {
        this.$emit('registration_brand', { value: this.brand, type: 'brand' })
      }
    },
    watch: {
      value() {
        this.brand = this.value
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
