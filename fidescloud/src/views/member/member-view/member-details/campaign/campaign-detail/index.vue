<template>
  <div class="campaign-detail">
    <div class="header-top cursor-pointer" @click.stop="goBack">
      <p><< {{handleGlobalI18n('member', 'back')}}</p>
    </div>
    <div class="account">
      <p>{{handleGlobalI18n('member', 'campaign_basic_info')}}</p>
    </div>
    <div class="account-details">
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12" :xl="6">
          <div class="campaign-name">
            <div class="key">
              <label>{{handleGlobalI18n('member', 'campaign_name')}}</label>
            </div>
            <p class="value">EA0129234</p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12" :xl="6">
          <div class="code1">
            <div class="key">
              <label>{{handleGlobalI18n('member', 'campaign_code')}}</label>
            </div>
            <p class="value">115346234234</p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12" :xl="6">
          <div class="type1">
            <div class="key">
              <label>{{handleGlobalI18n('member', 'campaign_type')}}</label>
            </div>
            <p class="value">GWP</p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12" :xl="6">
          <div class="descripiton">
            <div class="key">
              <label>{{handleGlobalI18n('member', 'description')}}</label>
            </div>
            <p class="value">camp1</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <p class="query_result">{{handleGlobalI18n('member', 'multiple_points')}}:</p>
    <el-table :data="mp_data" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column prop="create_date" align="center" :label="handleGlobalI18n('member', 'create_date')"></el-table-column>
      <el-table-column prop="effective_date" align="center" :label="handleGlobalI18n('member', 'effective')"></el-table-column>
      <el-table-column prop="expired_date" align="center" :label="handleGlobalI18n('member', 'expiry')"></el-table-column>
      <el-table-column prop="points_type" align="center" :label="handleGlobalI18n('member', 'point_type')"></el-table-column>
      <el-table-column prop="amount" align="center" :label="handleGlobalI18n('member', 'amount')"></el-table-column>
    </el-table>
    <p class="query_result">{{handleGlobalI18n('member', 'gwp')}}:</p>
    <el-table :data="gwp_data" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column prop="name" align="center" :label="handleGlobalI18n('member', 'name')"></el-table-column>
      <el-table-column prop="code" align="center" :label="handleGlobalI18n('member', 'code')"></el-table-column>
    </el-table>
    <p class="query_result">{{handleGlobalI18n('member.member_details.coupon')}}:</p>
    <el-table :data="coupon_data" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column prop="name" align="center" :label="handleGlobalI18n('member', 'name')"></el-table-column>
      <el-table-column prop="code" align="center" :label="handleGlobalI18n('member', 'code')"></el-table-column>
      <el-table-column prop="amount" align="center" :label="handleGlobalI18n('member', 'amount')"></el-table-column>
      <el-table-column prop="effective_date" align="center" :label="handleGlobalI18n('member', 'effective')"></el-table-column>
      <el-table-column prop="expired_date" align="center" :label="handleGlobalI18n('member', 'expiry')"></el-table-column>
      <el-table-column prop="create_date" align="center" :label="handleGlobalI18n('member', 'create_date')"></el-table-column>
      <el-table-column prop="status" align="center" :label="handleGlobalI18n('member', 'status')"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        account_type: '1',
        mp_data: [],
        gwp_data: [],
        coupon_data: [],
        listLoading: false
      }
    },
    methods: {}
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-form-item{
    margin-bottom: 0!important;
  }
  .campaign-detail{
    margin: 20px 20px;
    .header-top {
      height: 30px !important;
      width: 100px;
      color: #ffffff;
      line-height: 30px;
      background-color: $primary;
      text-align: center;
    }
    .account{
      margin-bottom:20px;
      margin-top:10px;
    }
    .account-details{
      line-height: 40px;
      .campaign-name,.code1,.type1,.descripiton{
        height:40px;
        border:1px solid #797979;
        border-left-color: #ffffff;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .campaign-name{
        border-left:1px solid #797979;
      }
      .value{
        width: 60%;
        text-align: center;
      }
      .key{
        height:38px;
        border-right:1px solid #797979;
        width: 40%;
        text-align: center;
        background-color:#f3f6fb;
      }
    }
    .query_result{
      margin:15px 0;
    }
  }
  @media (min-width: 1024px){
    .code1,.type1,.descripiton{
      margin-top:10px;
    }
  }
  @media (min-width: 1200px){
    .campaign-name,.type1,.descripiton{
      margin-top:10px;
    }
  }
</style>
