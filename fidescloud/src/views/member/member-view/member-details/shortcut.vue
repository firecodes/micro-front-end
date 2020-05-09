<template>
  <div class="shortcut">
    <ed-header-title :title="$t('member.fc_member_details_advanced_section_title')" />
    <el-row class="list"  :gutter="15">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" >
        <div class='card-panel' @click="toPersonInfo()">
          <div class="card-panel-icon-wrapper icon-people"><span><svg-icon icon-class="member_detail_personal_details"></svg-icon></span></div>
          <label>{{$t('member.fc_member_details_advanced_personal_label')}}</label>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link :to="{path:'/member/loyalty-info', query: {member_code: member_code}}" tag="div"  class="card-panel">
          <div class="card-panel-icon-wrapper icon-message"><span><svg-icon icon-class="member_detail_loyalty"></svg-icon></span></div>
          <label>{{$t('member.fc_member_details_advanced_loyalty_label')}}</label>
        </router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link :to="{path: '/member/campaign-info', query: {member_code: member_code}}" tag="div"  class="card-panel">
          <div class="card-panel-icon-wrapper icon-message"><span><svg-icon icon-class="member_detail_campaign"></svg-icon></span></div>
          <label>{{$t('member.fc_member_details_advanced_campaign_label')}}</label>
        </router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link :to="{path: '/member/social-media-info', query: {member_code: member_code}}" tag="div"  class="card-panel">
          <div class="card-panel-icon-wrapper icon-message"><span><svg-icon icon-class="member_detail_social"></svg-icon></span></div>
          <label>{{$t('member.fc_member_details_advanced_social_label')}}</label>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    props: {
      member_code: {
        type: String
      }
    },
    created() {

    },
    methods: {
      toPersonInfo() {
        var path = '/member/member-view/person-info'
        var full_path = this.$route.path
        if (full_path.indexOf('member-query') > -1) {
          path = '/member/member-query/person-info'
        }
        this.$router.push({
          path: path,
          query: { member_code: this.member_code }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .shortcut{
    width: 100%;
    margin-top: 20px;
  }
  .list {
    margin-top: -10px;
    .card-panel-col {
      height:150px;
      margin-bottom: 15px;
      text-align: center;
      position: relative;
    }
    .card-panel {
      width: 100%;
      height:100%;
      padding:0 12px;
      background: rgba(243, 246, 251, 1);
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      cursor: pointer;
      font-size: 12px;
      color: #666;
    }
    .card-panel-icon-wrapper{
      display: table;
      text-align: center;
      margin:auto;
      background-color: $primary;
      margin-top:10px;
      width: 70px;
      height:70px;
      border-radius: 50%;
      border:5px solid #fff;
      margin-bottom: 30px;
      color:#ffffff;
      position: relative;
      top:17px;
      span{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        font-size:16px;
        .svg-icon{
          font-size: 30px;
          color: #fff;
        }
      }
    }
    label{
      padding-top:17px;
      font-size:16px;
      color: $primary;
    }
  }
</style>
