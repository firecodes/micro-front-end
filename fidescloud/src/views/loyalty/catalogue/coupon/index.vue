<template>
  <div class="catalogue-gift-index new-table-css">
    <top-search
      class="new-theme-css"
      :menu_type_list="menu_type_list"
      :multiple_selection="multiple_selection"
      @handleSearch="handleSearch"
    />
    <div class="list-type">
      <div v-loading="listLoading">
        <el-table :data="tableData" size="medium"  highlight-current-row :empty-text="$t('member.fc_table_no_data_label')">
          <!--Coupon code-->
          <el-table-column prop="coupon_code" align="center" :label="$t('loyalty.fc_redemption_coupon_table_code_label')">
            <template slot-scope="scope">
              <template v-if="handleCouponStatus(scope.row.coupon_status, scope.row.effective_type, scope.row.specific_effective_date_to) === 'Deleted'">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.coupon_code || table_placeholder}}</ed-clamp>
              </template>
              <template v-else>
                <div style="cursor:pointer;color:#0099ff" @click="handleForCouponDetail(scope.row.coupon_code)">
                  <ed-clamp :max-lines="1" autoresize>{{scope.row.coupon_code || table_placeholder}}</ed-clamp>
                </div>
              </template>
            </template>
          </el-table-column>
          <!--Coupon name-->
          <el-table-column prop="coupon_name" align="center" :label="$t('loyalty.fc_redemption_coupon_table_name_label')">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.coupon_name || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Coupon type name-->
          <el-table-column prop="coupon_type_name" align="center" :label="$t('loyalty.fc_redemption_coupon_table_type_label')">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{$t('loyalty.'+keyMap[scope.row.coupon_type_code]) || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Available tiers-->
          <el-table-column :label="$t('loyalty.fc_redemption_coupon_table_tiers_label')" prop="limited_tier_list" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.is_limited_tier">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.limited_tier_name_list || table_placeholder}}</ed-clamp>
              </template>
              <template v-else>
                {{$t('loyalty.fc_add_a_coupon_details_limited_times_nolimit_label')}}
              </template>
            </template>
          </el-table-column>
          <!--Redemption points-->
          <el-table-column :label="$t('loyalty.fc_redemption_coupon_table_points_label')" prop="redeem_point" align="center" min-width="110">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.redeem_point || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Number of redeemed coupons-->
          <el-table-column :label="$t('loyalty.fc_redemption_coupon_table_number_label')" align="center" prop="redeem_coupon_count" min-width="110">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.redeem_coupon_count || 0}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Coupon status-->
          <el-table-column prop="coupon_status" align="center" :label="$t('loyalty.fc_redemption_coupon_table_coupon_status_label')" >
            <template slot-scope="scope">
              {{$t('loyalty.'+keyMap[handleCouponStatus(scope.row.coupon_status, scope.row.effective_type, scope.row.specific_effective_date_to)]) || table_placeholder}}
            </template>
          </el-table-column>
          <!--Redemption status-->
          <el-table-column prop="redemption_status" align="center" :label="$t('loyalty.fc_redemption_coupon_table_redemption_status_label')" min-width="110">
            <template slot-scope="scope">
              {{$t('loyalty.'+keyMap[handleRedemptionStatus(scope.row.redemption_status, scope.row.specific_effective_date_from)]) || table_placeholder}}
            </template>
          </el-table-column>
          <!--Operation-->
          <el-table-column :label="$t('loyalty.fc_redemption_coupon_table_operation_label')" align="center" :width="operation_width">
            <template slot-scope="scope" >
              <div class="operation">
                <label class="border-color" @click="handleRouter(scope.row.coupon_code, 'redemption-details', 'coupon', scope.row)">{{$t('loyalty.fc_operation_btn_details_label')}}</label>
                <template v-if="handleCouponStatus(scope.row.coupon_status, scope.row.effective_type, scope.row.specific_effective_date_to) === 'Deleted'">
                  <label class="button-disabled-new">{{$t('loyalty.fc_operation_btn_config_label')}}</label>
                </template>
                <template v-else>
                  <label @click="handleRouter(scope.row.coupon_code, 'config-coupon', 'config', scope.row)">{{$t('loyalty.fc_operation_btn_config_label')}}</label>
                </template>
                <!--<label @click="handleRouter(scope.row.gift_code, 'redemption-analysis-coupon', 'analysis')" >{{$t('loyalty.fc_operation_btn_analysis_label')}}</label>-->
                <label class="button-disabled-new">{{$t('loyalty.fc_operation_btn_analysis_label')}}</label>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination-container :page = "listQuery.page_no" :page_size = 'listQuery.page_size' :total = 'total' @handleCurrentChange = "handleCurrentChange" @handleSizeChange="handleSizeChange" />
    </div>
  </div>
</template>
<script>
  import { debounce } from '@/utils'
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryRedeemCatalogRelCoupons } from '@/api/catalogue'
  import { pageLimit } from '@/api/api'
  import TopSearch from './search'
  import { redemption_state_mixin } from '../data'
  export default {
    mixins: [
      redemption_state_mixin
    ],
    components: {
      TopSearch,
      PaginationContainer
    },
    data() {
      return {
        operation_width: 275,
        menu_type_list: true,
        timeSubstring(value) {
          if (!value) return ''
          value = value.toString()
          return value.substring(0, 10)
        },
        radio: '',
        listLoading: true,
        tableData: [],
        type_id: 2,
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          asc: false
        },
        total: 0,
        multiple_selection: [],
        search_type: 1,
        advanced_search_obj: {},
        quick_obj: {},
        keyMap: {
          'cash': 'fc_redemption_coupon_advanced_type_1st_label',
          'discount': 'fc_redemption_coupon_advanced_type_2nd_label',
          'gwp': 'fc_redemption_coupon_advanced_type_3rd_label',
          'sku': 'fc_add_coupon_type_4th_label',
          'Inactive': 'fc_redemption_coupon_advanced_status_3rd_label',
          'Active': 'fc_redemption_coupon_advanced_status_1st_label',
          'Planned': 'fc_redemption_coupon_advanced_status_2nd_label',
          'Deleted': 'fc_redemption_coupon_coupon_status_3rd_label',
          'Available': 'fc_redemption_coupon_coupon_status_1st_label',
          'Expired': 'fc_redemption_coupon_coupon_status_2nd_label'
        }
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      this.__resizeHanlder = debounce(() => {
        var width = document.body.clientWidth
        if (width > 1500) {
          this.operation_width = 275
        } else {
          this.operation_width = 110
        }
      }, 100)
      this.__resizeHanlder()
      window.addEventListener('resize', this.__resizeHanlder)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.__resizeHanlder)
    },
    methods: {
      handleForCouponDetail(code) {
        this.$router.push({
          path: `/loyalty/coupon/detail`,
          query: {
            id: code,
            type: 'detail'
          }
        })
      },
      handleRouter(coupon_code, type, type1, info = {}) {
        sessionStorage.setItem('redemption_info', JSON.stringify(info))
        this.$router.push({
          path: `/loyalty/catalogue/${type}`,
          query: {
            id: coupon_code,
            type: type1
          }
        })
      },
      getList(obj = {}) {
        this.listLoading = true
        queryRedeemCatalogRelCoupons(Object.assign({}, this.listQuery, obj)).then(res => {
          const obj = res.return_result
          this.tableData = obj.redemption_rel_coupons
          this.total = obj.total_count
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleSearch(obj = {}, type) {
        this.select_type = type
        if (type === 2) {
          this.advanced_search_obj = obj
        } else {
          this.quick_obj = obj
        }
        this.listQuery.page_no = 1
        this.getList(obj)
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        var obj = {}
        if (this.select_type === 2) {
          obj = this.advanced_search_obj
        } else if (this.select_type === 1) {
          obj = this.quick_obj
        }
        this.getList(obj)
      },
      handleSizeChange(val) {}
    },
    watch: {
      '$route': {
        handler(val) {
          this.getList()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .color-2777ff{
    color: #2777FF
  }
  .catalogue-gift-index {
    margin: 30px 50px 50px 50px;
    .list-type{
      margin-top: 40px;
    }
    .operation{
      @media (max-width: 1500px) {
        flex-wrap: wrap;
        justify-content: center;
        label{
          &:not(:nth-child(1)) {
            margin-top: 5px!important;
            margin-left: 0!important;
          }
        }
      }
      display: flex;
      justify-content: space-between;
      font-size:14px;
      font-weight:bold;
      color:rgba(39,119,255,1);
      line-height:17px;
      align-items: center;
      label{
        &:not(:nth-child(1)) {
          margin-left: 8px;
        }
        min-width:80px;
        height:30px;
        background:rgba(74,144,226,0.07);
        border-radius:4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover{
          border:1px solid $new-primary;
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  @import "../../new-theme-css";
</style>
