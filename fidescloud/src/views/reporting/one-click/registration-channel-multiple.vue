<template>
  <ed-select>
    <el-select :loading="loading" :placeholder="$t('reporting.fc_reporting_oneclick_search_channel_input_lable')" @change = "change" clearable filterable multiple style="width:280px" v-model="channel" v-selectLoadmore="selectLoadMore">
    <el-option :key="item.channel_code" :label="item.resources_key ? $t(`reporting.${item.resources_key}`) : item.channel_name" :value="item.id" v-for="(item, index) in list" />
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count" />
      <i class="el-icon-loading"  v-else />
    </div>
  </el-select>
  </ed-select>
</template>
<script>
  import { queryChannelList } from '@/api/master'
  import { pageLimit } from '@/api/api'
  export default{
    data() {
      return {
        loading: true,
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
          this.loading = false
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.channels)
          // sort
          this.list = this.list.sort(function(a, b) {
            return a.channel_name.localeCompare(b.channel_name, 'zh-CN')
          })
        }).catch((res) => {
          this.loading = false
          // this.$message(res.return_message)
        })
      },
      change() {
        if (this.channel === '') {
          this.$emit('registration_channel', { channel: '', channel_code: '', type: 'channel' })
        } else {
          this.$emit('registration_channel', { channel: this.channel.join(','), type: 'registration_channel_multiple' })
        }
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
