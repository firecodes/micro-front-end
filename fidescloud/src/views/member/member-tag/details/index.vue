<template>
  <div class="analysisPage">
    <div class="click-button">
      <div>
        <el-button class="cancel" @click="goBack()">{{$t('member.fc_member_details_person_btn_back_label')}}</el-button>
        <el-button type="primary" class="save" @click="goEdit">{{$t('loyalty.fc_loyalty_point_type_btn_edit_label')}}</el-button>
      </div>
    </div>
    <ed-header-title :title="$t('member.fc_member_tag_details_basic_section_label')" />
    <div class="basic-contain">
      <el-form label-width="200px" label-position="left">
        <el-form-item :label="$t('member.fc_member_tag_details_basic_name_label')">
          <span class="tagNameSpan">{{ this.detail.tag_name || table_placeholder }}</span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_tag_details_basic_category_label')">
          <span>{{ categoryName(this.detail.category_name) || table_placeholder }}</span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_tag_details_basic_group_label')">
          <span>{{ this.detail.group_name || table_placeholder }}</span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_tag_details_basic_type_label')">
          <span>{{ this.detail.type ? $t('member.fc_member_tag_add_type_1st_label') : $t('member.fc_member_tag_add_type_2nd_label') || table_placeholder }}</span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_tag_details_basic_number_label')">
          <span>{{ this.detail.member_num }}</span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_tag_details_basic_created_date_label')">
          <span>{{ this.detail.create_date | formatTimeStamp('YYYY/MM/DD') }}</span>
        </el-form-item>
        <el-form-item :label="$t('member.fc_member_tag_details_basic_updated_date_label')">
          <span>{{ this.detail.modify_date | formatTimeStamp('YYYY/MM/DD') }}</span>
        </el-form-item>
      </el-form>
    </div>
    <!-- <ed-header-title :title="'Analysis information'" /> -->
    <!-- <analysis-information></analysis-information>
    <ed-header-title :title="'Marketing campaign history'" />
    <campaign-history></campaign-history> -->
  </div>
</template>

<script>
import CampaignHistory from './campaign-history'
import AnalysisInformation from './analysis-info'
export default {
  components: {
    CampaignHistory,
    AnalysisInformation
  },
  data() {
    return {
      detail: {}
    }
  },
  computed: {
    categoryName() {
      return function(name) {
        const origin = name
        name = name && name.toLowerCase()
        switch (name) {
          case 'campaign':
            return this.$t('member.fc_member_tag_edit_category_4th_label')
          case 'lifecycle':
            return this.$t('member.fc_member_tag_edit_category_5th_label')
          case 'loyalty':
            return this.$t('member.fc_member_tag_edit_category_2nd_label')
          case 'privacy':
            return this.$t('member.fc_member_tag_edit_category_6th_label')
          case 'socio-demographic':
            return this.$t('member.fc_member_tag_edit_category_1st_label')
          case 'transaction':
            return this.$t('member.fc_member_tag_edit_category_3rd_label')
          default:
            return origin
        }
      }
    }
  },
  created() {
    this.detail = { ...JSON.parse(sessionStorage.getItem('member_tag_detail')) }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goEdit() {
      this.$router.push(`/member/member-tag/edit/${this.$route.params.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.analysisPage {
  padding: 50px;
  .tagNameSpan {
    word-break: break-all;
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
  .basic-contain {
    background-color: #fff;
    box-shadow: 0 5px 15px -3px #ccc;
    padding-left: 20px;
    margin-bottom: 30px;
    .el-form-item {
      border-bottom: 1px solid #e6e6e6;
      height: 60px;
      margin-bottom: 0px !important;
      display: flex;
      align-items: center;
      /deep/ .el-form-item__content {
        margin-left: 0px !important;
      }
      span {
        color: #333;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
</style>
