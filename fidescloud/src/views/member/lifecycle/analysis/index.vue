<template>
  <div class="analysisPage">
    <ed-header-title :title="'Basic information'" />
    <div class="basic-contain">
      <el-form label-width="200px" label-position="left">
        <el-form-item label="Lifecycle stage:">
          <span>Repeat buyers</span>
        </el-form-item>
        <el-form-item label="Estimated audience:">
            <span>15,000</span>
        </el-form-item>
        <el-form-item label="Last update:">
            <span>31/10/2019</span>
        </el-form-item>
      </el-form>
    </div>
    <ed-header-title :title="'Analysis information'" />
    <analysis-information></analysis-information>
    <ed-header-title :title="'Marketing campaign history'" />
    <campaign-history></campaign-history>
  </div>
</template>

<script>
import CampaignHistory from './campaign-history'
import AnalysisInformation from './analysis-information'
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
  }
}
</script>

<style lang="scss" scoped>
.analysisPage {
  padding: 50px;
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
    }
  }
}
</style>
