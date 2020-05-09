<template>
  <el-select
    clearable
    v-selectLoadmore="selectLoadmoreCity"
    v-model="city"
    :placeholder="$t('member.fc_member_recruitment_address_city_input_label')"
    filterable
    style="width:100%;"
    @change="handleLocahostChange('city')"
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
      parentProvince: {
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
        city: '',
        list: [],
        page: 0,
        total_count: 0
      }
    },
    methods: {
      selectLoadmoreCity() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getCityList()
      },
      getCityList() {
        this.page = ++this.page
        getChildDictionaryList({
          parent_dictionary_type_code: dictionaryTypeCode.province,
          parent_dictionary_code: this.parentProvince,
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
        this.$emit('handleLocahostChange', { type: type, value: this.city })
      }
    },
    watch: {
      parentProvince(newValue, oldValue) {
        if (this.parentProvince.length > 0 && newValue !== oldValue) {
          [this.city, this.list, this.page, this.total_count] = ['', [], 0, 0]
          this.getCityList()
        }
      },
      value() {
        this.city = this.value
      }
    }
  }
</script>
