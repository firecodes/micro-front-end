<template>
      <el-select
        clearable
        v-selectLoadmore="selectLoadmore"
        v-model="channel"
        :disabled="disabled"
        :placeholder="$t('member.fc_member_recruitment_registration_channel_input_label')"
        filterable
        style="width:100%;"
        @change = "change"
      >
        <el-option
          v-for="item in list"
          :key="item.channel_code"
          :label="item.resources_key ? $t(`reporting.${item.resources_key}`) : item.channel_name"
          :value="item.channel_code">
        </el-option>
        <div style="text-align: center" >
          <!-- <i class="el-icon-loading"  v-if="list.length<total_count"></i>
          <span style="font-size:13px;" v-if="list.length>=total_count && page>1">{{handleGlobalI18n('system', 'after_loaded')}}</span> -->
          <span style="font-size:13px;" v-if="list.length>=total_count" />
          <i class="el-icon-loading"  v-else />
        </div>
      </el-select>
</template>
<script>
  import { queryChannelList } from '@/api/master'
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
          this.list = this.list.concat(res.return_result.channels || []).sort((a, b) => a.channel_code.localeCompare(b.channel_code, 'zh-CN'))
        }).catch(() => {
          // this.$message(res.return_message)
        })
      },
      change() {
        this.$emit('registration_channel', { value: this.channel, type: 'channel' })
      }
    },
    watch: {
      value() {
        this.channel = this.value
      }
    }
  }
</script>
