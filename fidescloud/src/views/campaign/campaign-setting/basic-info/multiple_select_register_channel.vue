<template>
  <el-select
    v-selectLoadmore="selectLoadMore"
    v-model="channel"
    :disabled="disabled"
    filterable
    multiple
    style="width:300px;"
    @change = "change"
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
  >
    <el-option
      v-for="(item,index) in list"
      :key="item.channel_code"
      :label="item.resources_key ? $t(`reporting.${item.resources_key}`) : item.channel_name"
      :value="index">
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
      selectLoadMore() {
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
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.channel[i]])
        }
        this.$emit('registration_channel', { value: arr, type: 'channel', index: this.channel })
      }
    },
    watch: {
      value() {
        this.channel = this.value
      }
    }
  }
</script>
