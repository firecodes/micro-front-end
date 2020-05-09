<!--campaign-->
<template>
  <div class="campaign">
    <p class="p">Campaign</p>
    <el-table :data="tableData" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column prop="id" align="center" label='id' width="95"></el-table-column>
      <el-table-column prop="campaign_name" align="center" label="Campaign name"></el-table-column>
      <el-table-column prop="participation_time" align="center" label="Participation time"></el-table-column>
      <el-table-column prop="payment" align="center" label="Payment"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default{
    data() {
      return {
        listLoading: false,
        tableData: [{ id: 1, campaign_name: 'aaaa', participation_time: '01-01-01', payment: '' },
          { id: 1, campaign_name: 'aaaa', participation_time: '01-01-01', payment: '' },
          { id: 1, campaign_name: 'aaaa', participation_time: '01-01-01', payment: '' },
          { id: 1, campaign_name: 'aaaa', participation_time: '01-01-01', payment: '' }]
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .campaign{
    margin-top:20px;
    height: 320px;
    background-color: #ffffff;
    font-size: 16px;
    .p {
      line-height: 30px;
      height: 30px;
      padding-left: 10px;
      border-bottom: 1px solid #C3C3C3;
      font-size: 18px;
      color: #888888;
    }
    .el-table{
      padding:15px;
    }
  }
</style>
