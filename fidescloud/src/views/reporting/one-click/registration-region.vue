<template>
  <ed-select>
    <el-select :loading="loading" :placeholder="$t('reporting.fc_reporting_oneclick_search_channel_pos_region_input_lable')" @change = "change" clearable filterable style="width:100%;" v-model="region">
    <el-option :key="item.id" :label="item.dictionary_name" :value="item.id" v-for="item in list" />
  </el-select>
  </ed-select>
</template>
<script>
  import { storeDistinctCity } from '@/api/master'
  import { mapGetters } from 'vuex'
  export default{
    props: {
      value: {
        type: [String, Number]
      }
    },
    data() {
      return {
        loading: true,
        region: '',
        list: []
      }
    },
    created() {
      this.getRegionList()
    },
    computed: {
      ...mapGetters([
        'language'
      ])
    },
    methods: {
      getRegionList() {
        //
        this.loading = true
        storeDistinctCity({ language: this.language || 'lang_zh' }).then(res => {
          this.loading = false
          this.list = (res.return_result.results || [])
        }).catch(() => {
          this.loading = false
        })
      },
      change() {
        this.$emit('registration_region', { value: this.region, type: 'region' })
      }
    },
    watch: {
      value() {
        this.region = this.value
      },
      language() {
        this.getRegionList()
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
