<template>
  <div class="memberGroupPage">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :label="$t('member.fc_member_group_recommended_tab_label')" name="first">
      <div class="quesheng">
        <img :src="require('@/assets/images/quesheng.png')" alt="">
        <span>{{$t('campaign.fc_campaign_trigger_available_soon_label')}}...</span>
      </div>
    </el-tab-pane>
    <el-tab-pane :label="$t('member.fc_member_group_my_tab_label')" name="first">
      <member-groups></member-groups>
    </el-tab-pane>
  </el-tabs> -->
    <member-groups></member-groups>
  </div>
</template>

<script>
import RecommendedItem from './components/recommendItem'
import MemberGroups from './components/memberGroups'
export default {
  components: {
    RecommendedItem,
    MemberGroups
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.memberGroupPage {
  .quesheng {
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 155px;
    }
    span {
      display: block;
      color: #666;
      font-size: 20px;
      margin-top: 5px;
    }
  }
  padding: 50px;
  background-color: #f9f9f9;
  /deep/ .el-tabs__content {
    overflow: initial !important;
  }
  /deep/ .el-tabs__active-bar {
    height: 4px;
    background-color: #2777FF;
  }
  /deep/ .el-tabs__item {
    color: #999;
    font-size: 20px;
    &:hover {
      color: #2777FF;
    }
  }
  /deep/ .el-tabs__item.is-active {
    color: #2777FF;
  }
  /deep/ .el-tabs__nav {
    padding-bottom: 14px !important;
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px !important;
    background-color: #e6e6e6 !important;
  }
  /deep/ #tab-first:focus,
  /deep/ #tab-first:active {
    outline: none !important;
  }
  /deep/ #tab-second:focus,
  /deep/ #tab-second:active {
    outline: none !important;
  }
}
</style>
