<!--campaign respondent 活动响应-->
<template>
  <el-select
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
    @change = "change"
    filterable
    multiple
    ref="c-respondent"
    style="width:300px;"
    v-model="respondent"
    v-selectLoadmore="selectLoadMore"
  >
    <el-option
      :key="item.campaign_wizard_id"
      :label="item.campaign_name"
      :value="index"
      v-for="(item,index) in list">
    </el-option>
    <div style="text-align: center" >
      <span style="font-size:13px;" v-if="list.length>=total_count"></span>
      <i class="el-icon-loading"  v-else></i>
    </div>
  </el-select>
</template>
<script>
  import { getCampaignWizardList } from '@/api/campaign'
  import { pageLimit } from '@/api/api'
  import { checkObjHasOwnProperty } from '@/utils'
  export default{
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      value: {
        type: Array,
        default: ''
      }
    },
    data() {
      return {
        respondent: '',
        list: [],
        total_count: 0,
        page: 0
      }
    },
    created() {
      this.getCampaignRespondentList()
    },
    methods: {
      selectLoadMore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getCampaignRespondentList()
      },
      getCampaignRespondentList() {
        this.page = ++this.page
        getCampaignWizardList({
          type: 3,
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          const result = res.return_result
          if (!checkObjHasOwnProperty(result, 'result')) {
            return false
          }
          this.total_count = result.total_count
          this.list = this.list.concat(result.result)
        })
      },
      change() {
        const arr = []
        const length = this.respondent.length
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.respondent[i]])
        }
        return { value: arr, index: this.respondent }
      }
    },
    watch: {
      value() {
        this.respondent = this.value
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>

