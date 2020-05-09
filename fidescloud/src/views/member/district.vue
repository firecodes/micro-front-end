<template>
  <el-select
    clearable
    v-selectLoadmore="selectLoadmoreDistrict"
    v-model="district"
    :placeholder="handleGlobalI18n('member', 'please_select')"
    filterable
    style="width:100%;"
    @change="handleLocahostChange('district')"
  >
    <location-option :list = "list" :total_count = "total_count"></location-option>
  </el-select>
</template>
<script>
  import {
    dictionaryTypeCode,
    pageLimit
  } from '@/api/api'
  import { getChildDictionaryList } from '@/api/master'
  import LocationOption from '@/views/member/location-option'
  import { checkObjHasOwnProperty } from '@/utils'
  export default {
    props: {
      parentCity: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      }
    },
    components: {
      LocationOption
    },
    data() {
      return {
        district: '',
        list: [],
        page: 0,
        total_count: 0
      }
    },
    methods: {
      selectLoadmoreDistrict() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getDistrictList()
      },
      getDistrictList() {
        this.page = ++this.page
        getChildDictionaryList({
          parent_dictionary_type_code: dictionaryTypeCode.city,
          parent_dictionary_code: this.parentCity,
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.total_count = res.return_result.total_count
          if (checkObjHasOwnProperty(res.return_result, 'dictionaries')) {
            this.list = this.list.concat(res.return_result.dictionaries)
          }
        })
      },
      handleLocahostChange(type) {
        this.$emit('handleLocahostChange', { type: type, value: this.district })
      }
    },
    watch: {
      parentCity(newValue, oldValue) {
        if (this.parentCity.length > 0 && newValue !== oldValue) {
          [this.district, this.list, this.page, this.total_count] = ['', [], 0, 0]
          this.getDistrictList()
        }
      },
      value() {
        this.district = this.value
      }
    }
  }
</script>
