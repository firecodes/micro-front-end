<template>
  <el-select
    clearable
    v-selectLoadmore="selectLoadmoreProvince"
    v-model="province"
    :placeholder="$t('member.fc_member_recruitment_address_province_input_label')"
    filterable
    style="width:100%;"
    @change="handleLocahostChange('province')"
  >
    <location-option :list="list" :total_count = "total_count"></location-option>
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
      parentCountry: {
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
        province: null,
        list: [],
        page: 0,
        total_count: 0
      }
    },
    methods: {
      selectLoadmoreProvince() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getProvinceList()
      },
      getProvinceList() {
        this.page = ++this.page
        getChildDictionaryList({
          parent_dictionary_type_code: dictionaryTypeCode.country,
          parent_dictionary_code: this.parentCountry,
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
        this.$emit('handleLocahostChange', { type: type, value: this.province })
      }
    },
    watch: {
      parentCountry(newValue, oldValue) {
        if (this.parentCountry.length > 0 && newValue !== oldValue) {
          [this.province, this.list, this.page, this.total_count] = ['', [], 0, 0]
          this.getProvinceList()
        }
      },
      value() {
        this.province = this.value
      }
    }
  }
</script>
<style>

</style>
