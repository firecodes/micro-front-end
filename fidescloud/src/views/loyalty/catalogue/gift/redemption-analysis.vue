<template>
  <div class="catalogue-redemption-analysis">
    <statistics-list />
    <!--Gift redemption list-->
    <div class="gift-redemption-list">
      <!--Member Participation List-->
      <ed-header-title :title="$t('loyalty.fc_redemption_gift_redemption_analysis_list_section_label')">
        <div slot="right-content">
          <el-button type="primary">{{$t('loyalty.fc_redemption_gift_redemption_analysis_list_btn_label')}}</el-button>
        </div>
      </ed-header-title>
      <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange" size="medium"  highlight-current-row :empty-text="$t('member.fc_table_no_data_label')">
        <!--Member code-->
        <el-table-column prop="gift_code" min-width="120" align="center" :label="$t('loyalty.fc_redemption_gift_redemption_analysis_table_code_label')">
          <template slot-scope="scope">
            <div style="cursor:pointer;color:#0099ff" @click="handleRouter(scope.row.gift_code, 'detail')">
              {{scope.row.gift_code || table_placeholder}}
            </div>
          </template>
        </el-table-column>
        <!--Member name-->
        <el-table-column prop="gift_name" min-width="130" align="center" :label="$t('loyalty.fc_redemption_gift_redemption_analysis_table_name_label')">
          <template slot-scope="scope">
            {{scope.row.gift_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Redemption date-->
        <el-table-column prop="gift_name" align="center" :label="$t('loyalty.fc_redemption_gift_redemption_analysis_table_date_label')" min-width="130">
          <template slot-scope="scope">
            {{scope.row.gift_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Number if redeemed gifts-->
        <el-table-column prop="gift_name" align="center" :label="$t('loyalty.fc_redemption_gift_redemption_analysis_table_gifts_label')" min-width="120">
          <template slot-scope="scope">
            {{scope.row.gift_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Redeemed points-->
        <el-table-column :label="$t('loyalty.fc_redemption_gift_redemption_analysis_table_points_label')" prop="unit_price" align="center" width="150">
          <template slot-scope="scope">
            {{scope.row.unit_price || table_placeholder}}
          </template>
        </el-table-column>
      </el-table>
      <pagination-container
        :page = "listQuery.page_no"
        :page_size = 'listQuery.page_size'
        :total = 'total'
        layout="total, prev, pager, next, jumper"
        @handleCurrentChange = "handleCurrentChange"
      ></pagination-container>
    </div>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainer'
  import StatisticsList from './statistics-list'
  export default{
    components: {
      PaginationContainer,
      StatisticsList
    },
    data() {
      return {
        total: 0,
        listQuery: {
          page_no: 1,
          page_size: 6
        },
        tableData: [{}, {}, {}, {}, {}, {}, {}],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.listQuery.page_no = val
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .catalogue-redemption-analysis{
    margin: $over-margin;
    .gift-redemption-list{
      margin-top: 40px;
      .el-button{
        width: 88px;
        border-color: $new-primary;
        background-color: $new-primary;
      }
    }
    .rank-content{
      width: 100%;
      height:380px;
      background:rgba(255,255,255,1);
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
    }
    .operation{
      display: flex;
      justify-content: center;
      font-size:14px;
      font-weight:bold;
      color:rgba(39,119,255,1);
      align-items: center;
      label{
        width: 160px;
        height:30px;
        background:rgba(74,144,226,0.07);
        border-radius:4px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .catalogue-redemption-analysis{
    .el-table__header-wrapper .el-table__header th {
      background: #ECF4FF!important;
      color: #333333!important;
      font-size: 16px!important;
      height: 68px!important;
      div{
        font-weight: 700!important;
      }
    }
    .el-table td{
      height: 68px!important;
    }
    .el-table__row {
      &:hover{
        td{
          background:rgba(249,249,249,1)!important;
          box-shadow: 20px 5px 20px 5px rgba(204,204,204,0.46)!important;
        }
      }
    }
    .el-table__body .current-row >td{
      background-color: #ffffff!important;
    }
    .el-table--enable-row-transition .el-table__body td{
      transition: none!important;
    }
  }
</style>
