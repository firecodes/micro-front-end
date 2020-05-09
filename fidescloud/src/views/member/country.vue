<template>
  <el-select
    clearable
    v-selectLoadmore="selectLoadmoreCountry"
    v-model="country"
    :placeholder="$t('member.fc_member_recruitment_address_location_input_label')"
    filterable
    style="width:100%;"
    @change="handleLocahostChange('country')"
  >
    <location-option :list="list" :total_count="total_count"></location-option>
  </el-select>
</template>
<script>
  import {
    dictionaryTypeCode,
    pageLimit
  } from '@/api/api'
  import { getDictionaryListByType } from '@/api/master'
  import LocationOption from '@/views/member/location-option'
  export default {
    props: {
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
        country: '',
        list: [],
        page: 0,
        total_count: 0
      }
    },
    created() {
      this.getCountryList()
    },
    methods: {
      selectLoadmoreCountry() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getCountryList()
      },
      getCountryList() {
        this.page = ++this.page
        getDictionaryListByType({
          dictionary_type_code: dictionaryTypeCode.country,
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.dictionaries)
        })
      },
      handleLocahostChange(type) {
        this.$emit('handleLocahostChange', { type: type, value: this.country })
      }
    },
    watch: {
      value() {
        this.country = this.value
      }
    }
  }
</script>
<style>

</style>
