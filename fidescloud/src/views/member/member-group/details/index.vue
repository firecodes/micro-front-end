<template>
  <div class="analysisPage">
    <div class="click-button">
      <div>
        <el-button class="cancel" @click="goBack()">{{$t('member.fc_member_details_person_btn_back_label')}}</el-button>
        <el-button type="primary" class="save" @click="goEdit">{{$t('loyalty.fc_loyalty_point_type_btn_edit_label')}}</el-button>
      </div>
    </div>
    <ed-header-title :title="$t('member.fc_member_group_details_basic_section_title')" />
    <!-- <i class="el-icon-edit"></i> -->
    <div class="basic-contain">
      <el-form label-width="200px" label-position="left">
        <el-form-item :label="$t('member.fc_member_group_details_basic_name_label')">
          <span class="groupName">
            <ed-clamp :max-lines="1" autoresize>{{form.group_name || table_placeholder}}</ed-clamp>
          </span>
        </el-form-item>
        <el-form-item class="member-tags-item" :label="$t('member.fc_member_group_details_basic_tags_label')">
          <span class="tagSpan" v-for="(item, index) in form.tag_names" :key="index">
            {{ item && item.length > 120 ? item.substring(0, 117) + '...' : item }}
          </span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_group_details_basic_audience_label')">
          <span>{{ form.member_num }}</span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_group_details_basic_created_label')">
          <span>{{ form.create_date | formatTimeStamp }}</span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_group_details_basic_modified_label')">
          <span>{{ form.modify_date | formatTimeStamp }}</span>
        </el-form-item>
      </el-form>
    </div>
    <!-- <ed-header-title :title="'Analysis information'" />
    <analysis-information></analysis-information>
    <ed-header-title :title="'Marketing campaign history'" />
    <campaign-history></campaign-history> -->
  </div>
</template>

<script>
import CampaignHistory from '../campaign-history'
import AnalysisInformation from '../analysis-info'
export default {
  components: {
    CampaignHistory,
    AnalysisInformation
  },
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  created() {
    this.form = JSON.parse(sessionStorage.getItem('groupdetail'))
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goEdit() {
      this.$router.push(`/member/member-group/edit/${this.$route.params.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.analysisPage {
  padding: 50px;
  position: relative;
  .groupName /deep/ span {
    color:#333;
    font-size:14px;
    font-weight:bold;
  }
  .click-button {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      text-align: right;
      margin-bottom: -20px;
      .save{
        margin-left: 8px;
        background-color: $new-primary;
        border-color: $new-primary;
      }
      .cancel, .delete{
        border-color: $new-primary;
        color: $new-primary;
      }
    }
  .el-icon-edit {
    font-size: 29px;
    color: #ccc;
    position: absolute;
    right: 50px;
    top: 60px;
  }
  .basic-contain {
    background-color: #fff;
    box-shadow: 0 5px 15px -3px #ccc;
    padding-left: 20px;
    margin-bottom: 30px;
    .member-tags-item {
      padding: 3px 0px;
      .tagSpan {
        display: inline-block;
        min-width: 80px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border: 1px solid rgba(39, 119, 255, 1.0);
        color: #2777FF;
        font-size: 14px;
        border-radius: 15px;
        background-color: rgba(74, 144, 226, 0.07);
        margin-right: 8px;
        padding: 0 4px;
        &:focus {
          outline: none;
        }
      }
    }
    .el-form-item {
      border-bottom: 1px solid #e6e6e6;
      min-height: 60px;
      margin-bottom: 0px !important;
      display: flex;
      align-items: center;
      /deep/ .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
}
</style>
