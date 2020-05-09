<template>
  <div class="catalogue-overall-analysis">
    <statistics-list />
    <!--rank of gift redemption-->
    <div class="rank-of-gift-redemption">
      <ed-header-title :title="$t('loyalty.fc_redemption_overall_analysis_gift_rank_section_label')">
        <div slot="right-content">
          <el-select v-model="value" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="$t(`loyalty.${item.name}`)"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </ed-header-title>
      <div class="rank-content">
        <rank-gift-redemption-charts />
      </div>
    </div>
    <!--Gift redemption list-->
    <div class="gift-redemption-list">
      <ed-header-title :title="$t('loyalty.fc_redemption_overall_analysis_gift_list_section_label')">
        <div slot="right-content">
          <el-button type="primary">{{$t('loyalty.fc_redemption_overall_analysis_gift_list_btn_label')}}</el-button>
        </div>
      </ed-header-title>
      <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange" size="medium"  highlight-current-row :empty-text="$t('member.fc_table_no_data_label')">
        <!--Gift code-->
        <el-table-column prop="gift_code" min-width="120" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_gift_table_code_label')">
          <template slot-scope="scope">
            <div style="cursor:pointer;color:#0099ff" @click="handleRouter(scope.row.gift_code, 'detail')">
              {{scope.row.gift_code || table_placeholder}}
            </div>
          </template>
        </el-table-column>
        <!-- Gift name-->
        <el-table-column prop="gift_name" min-width="130" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_gift_table_name_label')">
          <template slot-scope="scope">
            {{scope.row.gift_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Gift category-->
        <el-table-column prop="gift_name" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_gift_table_category_label')" min-width="130">
          <template slot-scope="scope">
            {{scope.row.gift_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Gift unit-->
        <el-table-column prop="gift_name" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_gift_table_unit_label')" min-width="120">
          <template slot-scope="scope">
            {{scope.row.gift_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Number or redeemed points-->
        <el-table-column prop="available_inventory" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_gift_table_points_label')" width="150">
          <template slot-scope="scope">
            <template v-if="!scope.row.is_limited_inventory">
              No limit
            </template>
            <template v-else>
              {{scope.row.available_inventory || 0}}
            </template>
          </template>
        </el-table-column>
        <!--Number of redeemed gifts-->
        <el-table-column :label="$t('loyalty.fc_redemption_overall_analysis_gift_table_gifts_label')" prop="unit_price" align="center" width="150">
          <template slot-scope="scope">
            {{scope.row.unit_price || table_placeholder}}
          </template>
        </el-table-column>
        <!--Number of participation members -->
        <el-table-column :label="$t('loyalty.fc_redemption_overall_analysis_gift_table_members_label')" align="center" prop="purchased_price" width="200">
          <template slot-scope="scope">
            {{scope.row.purchased_price || table_placeholder}}
          </template>
        </el-table-column>
        <!--Operation-->
        <el-table-column :label="$t('loyalty.fc_redemption_overall_analysis_gift_table_operation_label')" align="center" width="280"  >
          <template slot-scope="scope" >
            <div class="operation">
              <!--Redemption analysis-->
              <label @click="handleRouter(scope.row.gift_code, 'edit')">{{$t('loyalty.fc_operation_btn_redemption_analysis_label')}}</label>
            </div>
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
  import RankGiftRedemptionCharts from './rank-gift-redemption-charts'
  export default{
    components: {
      PaginationContainer,
      StatisticsList,
      RankGiftRedemptionCharts
    },
    data() {
      return {
        total: 0,
        listQuery: {
          page_no: 1,
          page_size: 6
        },
        tableData: [{}, {}, {}, {}, {}, {}, {}],
        options: [{ name: 'fc_redemption_overall_analysis_gift_rank_1st_label', value: 'all' }, { name: 'fc_redemption_overall_analysis_gift_rank_2nd_label', value: 'cash' }, { name: 'fc_redemption_overall_analysis_gift_rank_3rd_label', value: 'discount' }, { name: 'fc_redemption_overall_analysis_gift_rank_4th_label', value: 'gwp' }],
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
  .catalogue-overall-analysis{
    margin: $over-margin;
    .rank-of-gift-redemption, .gift-redemption-list{
      margin-top: 40px;
      .el-select{
        width: 150px;
      }
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
  .catalogue-overall-analysis{
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
