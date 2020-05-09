<template>
  <div class="catalogue-overall-analysis">
    <statistics-list />
    <!--rank of coupon redemption-->
    <div class="rank-of-coupon-redemption">
      <ed-header-title :title="$t('loyalty.fc_redemption_overall_analysis_coupon_rank_section_label')">
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
        <rank-coupon-redemption-charts />
      </div>
    </div>
    <!--Coupon Redemption List:-->
    <div class="coupon-redemption-list">
      <ed-header-title :title="$t('loyalty.fc_redemption_overall_analysis_coupon_list_section_label')">
        <div slot="right-content">
          <el-button type="primary">{{$t('loyalty.fc_redemption_overall_analysis_coupon_list_btn_label')}}</el-button>
        </div>
      </ed-header-title>
      <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange" size="medium"  highlight-current-row :empty-text="$t('member.fc_table_no_data_label')">
        <!--Coupon code-->
        <el-table-column prop="coupon_code" min-width="130" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_coupon_table_code_label')">
          <template slot-scope="scope">
            <div style="cursor:pointer;color:#0099ff" @click="handleRouter(scope.row.coupon_code, 'detail')">
              {{scope.row.coupon_code || table_placeholder}}
            </div>
          </template>
        </el-table-column>
        <!--Coupon name-->
        <el-table-column prop="coupon_name" min-width="130" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_coupon_table_name_label')">
          <template slot-scope="scope">
            {{scope.row.coupon_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Redeemed points-->
        <el-table-column prop="coupon_name" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_coupon_table_points_label')" min-width="160">
          <template slot-scope="scope">
            {{scope.row.coupon_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Sales with coupons-->
        <el-table-column prop="coupon_name" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_coupon_table_sales_label')" min-width="180">
          <template slot-scope="scope">
            {{scope.row.coupon_name || table_placeholder}}
          </template>
        </el-table-column>
        <!--Average basket with coupons-->
        <el-table-column prop="available_inventory" align="center" :label="$t('loyalty.fc_redemption_overall_analysis_coupon_table_ab_label')" width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.is_limited_inventory">
              No limit
            </template>
            <template v-else>
              {{scope.row.available_inventory || 0}}
            </template>
          </template>
        </el-table-column>
        <!--Number of redeemed coupons-->
        <el-table-column :label="$t('loyalty.fc_redemption_overall_analysis_coupon_table_redeemed_label')" prop="unit_price" align="center" width="180">
          <template slot-scope="scope">
            {{scope.row.unit_price || table_placeholder}}
          </template>
        </el-table-column>
        <!--Number of Expense coupons-->
        <el-table-column :label="$t('loyalty.fc_redemption_overall_analysis_coupon_table_number_expensed_label')" align="center" prop="purchased_price" width="180">
          <template slot-scope="scope">
            {{scope.row.purchased_price || table_placeholder}}
          </template>
        </el-table-column>
        <!--Rate of expense coupons-->
        <el-table-column :label="$t('loyalty.fc_redemption_overall_analysis_coupon_table_rate_expensed_label')" align="center" width="180"  >
          <template slot-scope="scope">
            {{scope.row.purchased_price || table_placeholder}}
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
  import RankCouponRedemptionCharts from './rank-coupon-redemption-charts'
  export default{
    components: {
      PaginationContainer,
      StatisticsList,
      RankCouponRedemptionCharts
    },
    data() {
      return {
        total: 0,
        listQuery: {
          page_no: 1,
          page_size: 6
        },
        tableData: [{}, {}, {}, {}, {}, {}, {}],
        options: [{ name: 'fc_redemption_overall_analysis_coupon_rank_1st_label', value: 'all' }, { name: 'fc_redemption_overall_analysis_coupon_rank_2nd_label', value: 'cash' }, { name: 'fc_redemption_overall_analysis_coupon_rank_3rd_label', value: 'discount' }, { name: 'fc_redemption_overall_analysis_coupon_rank_4th_label', value: 'gwp' }],
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
    .rank-of-coupon-redemption, .coupon-redemption-list{
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
    .rank-of-coupon-redemption{
      margin-top: 10px!important;
    }
    .rank-content{
      width: 100%;
      height:380px;
      background:rgba(255,255,255,1);
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
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
