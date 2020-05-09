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
        <el-table :data="tableData" :empty-text="$t('member.fc_table_no_data_label')"  :row-style="row_style" highlight-current-row size="medium">
          <!--Gift  code-->
          <el-table-column prop="gift_code" align="center" :label="$t('loyalty.fc_redemption_gift_table_code_label')">
            <template slot-scope="scope">
              <template v-if="handleGiftStatus(scope.row.gift_status,scope.row.stock, !scope.row.is_limited_inventory) === 'Deleted'">
                <ed-clamp :max-lines="1" autoresize>{{scope.row.gift_code || table_placeholder}}</ed-clamp>
              </template>
              <template v-else>
                <div style="cursor:pointer;color:#0099ff" @click="handleForGiftDetail(scope.row.gift_code)">
                  <ed-clamp :max-lines="1" autoresize>{{scope.row.gift_code || table_placeholder}}</ed-clamp>
                </div>
              </template>
            </template>
          </el-table-column>
          <!--Gift name-->
          <el-table-column prop="gift_name" align="center" :label="$t('loyalty.fc_redemption_gift_table_name_label')">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.gift_name || table_placeholder}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Available tiers-->
          <el-table-column prop="limited_tier_list" align="center" :label="$t('loyalty.fc_redemption_gift_table_tiers_label')" min-width="100">
            <template slot-scope="scope">
              <ed-clamp :max-lines="1" autoresize>{{scope.row.limited_tier_name_list || $t('loyalty.fc_add_a_coupon_details_tiers_nolimit_label')}}</ed-clamp>
            </template>
          </el-table-column>
          <!--Redemption points-->
          <el-table-column :label="$t('loyalty.fc_redemption_gift_table_points_label')" prop="redeem_point" align="center" min-width="110">
            <template slot-scope="scope">
              {{scope.row.redeem_point || table_placeholder}}
            </template>
          </el-table-column>
          <!--Number of redeemed gifts-->
          <el-table-column :label="$t('loyalty.fc_redemption_gift_table_number_label')" align="center" min-width="115" prop="redeem_gift_count">
            <template slot-scope="scope">
              {{scope.row.redeem_gift_count || 0}}
            </template>
          </el-table-column>
          <!--Available stock-->
          <el-table-column prop="stock" align="center" :label="$t('loyalty.fc_redemption_gift_table_stock_label')">
            <template slot-scope="scope">
              <template v-if="!scope.row.is_limited_inventory">
                No limit
              </template>
              <template v-else>
                {{scope.row.stock || 0}}
              </template>
            </template>
          </el-table-column>
          <!--Gift status-->
          <el-table-column prop="gift_status" align="center" :label="$t('loyalty.fc_redemption_gift_table_gift_status_label')">
            <template slot-scope="scope">
              {{$t('loyalty.'+keyMap[handleGiftStatus(scope.row.gift_status, scope.row.stock, !scope.row.is_limited_inventory)]) || table_placeholder}}
            </template>
          </el-table-column>
          <!--Redemption status-->
          <el-table-column align="center" :label="$t('loyalty.fc_redemption_gift_table_redemption_status_label')" min-width="115">
            <template slot-scope="scope">
              {{$t('loyalty.'+keyMap[handleRedemptionStatus(scope.row.redemption_status, scope.row.redemption_start_date)]) || table_placeholder}}
            </template>
          </el-table-column>
          <!--Operation-->
          <el-table-column :label="$t('loyalty.fc_redemption_gift_table_operation_label')" :width="operation_width" align="center">
            <template slot-scope="scope" >
              <div class="operation">
                <label class="border-color" @click="handleRouter(scope.row.gift_code, 'redemption-details', 'gift', scope.row)">{{$t('loyalty.fc_operation_btn_details_label')}}</label>
                <template v-if="handleGiftStatus(scope.row.gift_status, scope.row.stock, !scope.row.is_limited_inventory) === 'Deleted'">
                  <label class="button-disabled-new">{{$t('loyalty.fc_operation_btn_config_label')}}</label>
                </template>
                <template v-else>
                 <label @click="handleRouter(scope.row.gift_code, 'config-gift', 'config', scope.row)">{{$t('loyalty.fc_operation_btn_config_label')}}</label>
                </template>
                <!--<label @click="handleRouter(scope.row.gift_code, 'redemption-analysis', 'analysis')" >{{$t('loyalty.fc_operation_btn_analysis_label')}}</label>-->
                <label class="button-disabled-new">{{$t('loyalty.fc_operation_btn_analysis_label')}}</label>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination-container
        :page = "listQuery.page_no"
        :page_size = 'listQuery.page_size'
        :total = 'total'
        @handleCurrentChange = "handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination-container>
    </div>
  </div>
</template>
<script>
  import { debounce } from '@/utils'
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryRedeemCatalogRelGifts } from '@/api/catalogue'
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
        row_style: {
          'border': '1px solid red!important'
        },
        operation_width: 275,
        search_type: 1,
        advanced_search_obj: {},
        quick_obj: {},
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
          gift_name: '',
          asc: false,
          status: 1
        },
        total: 0,
        multiple_selection: [],
        keyMap: {
          'Available': 'fc_redemption_gift_gift_status_1st_label',
          'Deleted': 'fc_redemption_gift_gift_status_3rd_label',
          'Out of stock': 'fc_redemption_gift_gift_status_2nd_label',
          'Active': 'fc_redemption_coupon_advanced_status_1st_label',
          'Planned': 'fc_redemption_coupon_advanced_status_2nd_label',
          'Inactive': 'fc_redemption_coupon_advanced_status_3rd_label'
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
      handleRouter(gift_code, type, type1, info = {}) {
        sessionStorage.setItem('redemption_info', JSON.stringify(info))
        this.$router.push({
          path: `/loyalty/catalogue/${type}`,
          query: {
            id: gift_code,
            type: type1
          }
        })
      },
      handleForGiftDetail(code) {
        this.$router.push({
          path: `/loyalty/gift/detail`,
          query: {
            id: code,
            type: 'detail'
          }
        })
      },
      getList(obj = {}) {
        this.listLoading = true
        queryRedeemCatalogRelGifts(Object.assign({}, this.listQuery, obj)).then(res => {
          const obj = res.return_result
          this.tableData = obj.redemption_rel_gifts
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
