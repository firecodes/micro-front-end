<template>
  <div class="redemption">
    <div class="check">
      <div class="margin">
        <el-form >
          <el-row>
            <el-col :xs="24" :sm="24" :lg="12" :xl="16">
              <div class="date-from">
                <el-form-item :label="handleGlobalI18n('member', 'date_from')+':'">
                  <el-date-picker type="date" :format = 'globalData.value.date_format' placeholder="DD-MM-YYYY" v-model="date_from" style="width: 20%"></el-date-picker>
                  <span>to</span>
                  <el-date-picker type="date" :format = 'globalData.value.date_format' placeholder="DD-MM-YYYY" v-model="date_to" style="width: 20%"></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :xs="24" :sm="8" :lg="8">
              <div class="button">
                <el-button type="primary">{{handleGlobalI18n('member', 'search')}}</el-button>
                <el-button>{{handleGlobalI18n('member', 'reset')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <p class="query_result">{{handleGlobalI18n('system', 'query_result')}}:</p>
    <el-table :data="tableData" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column prop="redeem_date" align="center" :label="handleGlobalI18n('member', 'redemption_date')"></el-table-column>
      <el-table-column prop="redeem_channel" align="center" :label="handleGlobalI18n('member', 'redemption_channel')"></el-table-column>
      <el-table-column prop="gift" align="center" :label="handleGlobalI18n('member', 'gift')"></el-table-column>
      <el-table-column prop="points" align="center" :label="handleGlobalI18n('member', 'points')"></el-table-column>
      <el-table-column prop="status" align="center" :label="handleGlobalI18n('member', 'status')"></el-table-column>
     </el-table>
    <loading v-show="mixLoadingState"></loading>
  </div>
</template>

<script>
  import {
    mixLoading
  } from '@/utils/util'
  export default {
    mixins: [mixLoading],
    data() {
      return {
        date_from: '',
        date_to: '',
        tableData: [{ redeem_date: '12/12/2017', redeem_channel: 'channel1', gift: 'gift1*2', points: '-50pts', status: 'redeem' },
          { redeem_date: '02/06/2017', redeem_channel: 'channel2', gift: 'gift2*1', points: '-20pts', status: 'redeem' },
          { redeem_date: '14/09/2017', redeem_channel: 'channel3', gift: 'gift3*1', points: '20pts', status: 'cancel' }]
      }
    },
    created() {
      this.handleMixLoadingStateFalse()
    },
    methods: {}
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-form-item{
    margin-bottom: 0!important;
  }
  .redemption{
    margin-top:20px;
    .check{
      background-color:#f9f9f9;
      margin-top:20px;
      .margin{
        padding:12px;
      }
    }
    .query_result{
      margin:15px 0;
    }
  }
</style>
