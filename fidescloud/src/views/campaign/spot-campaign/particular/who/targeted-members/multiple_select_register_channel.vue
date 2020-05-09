<template>
  <el-select
    :disabled="disabled"
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
    @change = "change"
    filterable
    multiple
    ref="register_channel"
    style="width:300px;"
    v-model="channel"
    v-selectLoadmore="selectLoadmore"
  >
    <el-option
      :key="item.channel_code"
      :label="item.resources_key ? $t(`reporting.${item.resources_key}`) : item.channel_name"
      :value="index"
      v-for="(item,index) in list">
    </el-option>
    <div style="text-align: center" ><!--{{$t('system.after_loaded')}}-->
      <span style="font-size:13px;" v-if="list.length>=total_count" />
      <i class="el-icon-loading"  v-else />
    </div>
  </el-select>
</template>
<script>
  import { queryChannelList } from '@/api/master'
  import { pageLimit } from '@/api/api'
  export default{
    name: 'reg_channel',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: Array,
        default: ''
      }
    },
    data() {
      return {
        channel: '',
        list: [],
        total_count: 0,
        page: ''
      }
    },
    created() {
      this.getChannelList()
    },
    methods: {
      selectLoadmore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getChannelList()
      },
      getChannelList() {
        this.page = ++this.page
        queryChannelList({
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.channels || [])
        })
      },
      change() {
        const arr = []
        const length = this.channel.length
        var obj = {}
        var item = {}
        for (let i = 0; i < length; i++) {
          item = this.list[this.channel[i]]
          obj = Object.assign({}, item, { channel_name: item.resources_key ? this.$t(`reporting.${item.resources_key}`) : item.channel_name })
          arr.push(obj)
        }
        return { value: arr, index: this.channel }
      }
    },
    watch: {
      value() {
        this.channel = this.value
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
</style>
