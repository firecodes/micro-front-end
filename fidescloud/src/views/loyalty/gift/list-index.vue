<template>
  <div class="gift-list-index new-table-css">
    <top-search :menu_type_list="menu_type_list" :multiple_selection="multiple_selection" @handleSearch="handleSearch" @selectMultipleLinesDeleteGift="selectMultipleLinesDeleteGift" class="new-theme-css" />
    <div class="list-type">
      <div v-loading="listLoading">
        <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange" size="medium"  highlight-current-row :empty-text="$t('member.fc_table_no_data_label')">
          <el-table-column align="center" type="selection" width="80" />
          <!--Gift code-->
          <el-table-column prop="gift_code" align="center" :label="$t('loyalty.fc_gift_table_code_label')">
            <template slot-scope="scope">
              <div @click="handleRouter(scope.row.gift_code, 'detail', scope.row)" style="cursor:pointer;color:#0099ff;">
                {{scope.row.gift_code || table_placeholder}}
              </div>
            </template>
          </el-table-column>
          <!--Gift name-->
          <el-table-column prop="gift_name" align="center" :label="$t('loyalty.fc_gift_table_name_label')">
            <template slot-scope="scope">
              {{scope.row.gift_name || table_placeholder}}
            </template>
          </el-table-column>
          <!--Retail Market Prices-->
          <el-table-column :label="$t('loyalty.fc_gift_table_market_price_label')" align="center" min-width="115" prop="unit_price">
            <template slot-scope="scope">
              {{scope.row.unit_price || table_placeholder}}
            </template>
          </el-table-column>
          <!--Purchased Price-->
          <el-table-column :label="$t('loyalty.fc_gift_table_purchased_price_label')" align="center" min-width="110" prop="purchased_price">
            <template slot-scope="scope">
              {{scope.row.purchased_price || table_placeholder}}
            </template>
          </el-table-column>
          <!--Available stock-->
          <el-table-column prop="available_inventory" align="center" :label="$t('loyalty.fc_gift_table_stock_label')">
            <template slot-scope="scope">
              <template v-if="!scope.row.is_limited_inventory">
                No limit
              </template>
              <template v-else>
                {{scope.row.available_inventory || 0}}
              </template>
            </template>
          </el-table-column>
          <!--Used in Redemption-->
          <el-table-column prop="redemption_status" align="center" :label="$t('loyalty.fc_gift_table_used_redemption_label')" min-width="115">
            <template slot-scope="scope">
              {{scope.row.is_used_in_redemption ? 'Yes' : 'No'}}
            </template>
          </el-table-column>
          <!--Number of Redeemed Gifts-->
          <el-table-column align="center" :label="$t('loyalty.fc_gift_table_number_label')" min-width="115">
            <template slot-scope="scope">
              {{scope.row.redeemed_counts ? scope.row.redeemed_counts : 0}}
            </template>
          </el-table-column>
          <!--Operation-->
          <el-table-column :label="$t('loyalty.fc_gift_table_operation_label')" align="center" :width="operation_width">
            <template slot-scope="scope" >
              <div class="operation">
                <!--Edit-->
                <label @click="handleRouter(scope.row.gift_code, 'edit', scope.row)">{{$t('loyalty.fc_operation_btn_edit_label')}}</label>
                <!--Copy-->
                <label @click="handleRouter(scope.row.gift_code, 'copy', scope.row)">{{$t('loyalty.fc_operation_btn_copy_label')}}</label>
                <!--Delete-->
                <label @click="lineDeleteGift(scope.row, 2)" >{{$t('loyalty.fc_operation_btn_delete_label')}}</label>
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
  import { searchGift } from '@/api/loyalty'
  import { pageLimit } from '@/api/api'
  import { deleteCategoryMixin } from './mixins'
  import TopSearch from './search'
  export default {
    mixins: [
      deleteCategoryMixin
    ],
    components: {
      TopSearch,
      PaginationContainer
    },
    data() {
      return {
        operation_width: 275,
        search_type: 1,
        menu_type_list: true,
        timeSubstring(value) {
          if (!value) return ''
          value = value.toString()
          return value.substring(0, 10)
        },
        advanced_search_obj: {},
        radio: '',
        listLoading: true,
        tableData: [],
        type_id: 2,
        quick_obj: {},
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          asc: false,
          status: 1,
          order_by: 'id'
        },
        total: 0,
        multiple_selection: []
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      this.__resizeHanlder = debounce(() => {
        const width = document.body.clientWidth
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
      sortChange(row) {
        this.listQuery.page_no = 1
        this.getList({
          order_by: row.prop,
          asc: row.order === 'ascending'
        })
      },
      handleRouter(gift_code, type, detail) {
        this.$router.push({
          path: `/loyalty/gift/${type}`,
          query: {
            id: gift_code,
            type: type
          }
        })
        sessionStorage.setItem('gift_list_info_detail', JSON.stringify(detail))
      },
      handleSelectionChange(val) {
        this.multiple_selection = val
      },
      getList(obj = {}) {
        this.listLoading = true
        searchGift(Object.assign({}, this.listQuery, obj)).then(res => {
          const obj = res.return_result
          this.tableData = obj.gifts || []
          this.total = obj.total_count
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      selectType(id) {
        this.type_id = id
      },
      addRedemption(id, index = 0) {
        let path
        if (id === '1') {
          path = `/loyalty/catalogue/add-event/${id}`
        } else if (id === '2') {
          path = `/loyalty/catalogue/edit-event/${id}/${index}`
        } else {
          path = `/loyalty/catalogue/view-event/${id}/${index}`
        }
        this.$router.push({
          path: path
        })
      },
      handleSearch(obj = {}, type) {
        this.search_type = type
        this.listQuery.page_no = 1
        if (type === 2) {
          this.advanced_search_obj = obj
        } else {
          this.quick_obj = obj
        }
        this.getList(obj)
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        let obj = {}
        if (this.search_type === 2) {
          obj = this.advanced_search_obj
        } else {
          obj = this.quick_obj
        }
        this.getList(obj)
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      }
    },
    watch: {
      '$route': {
        handler() {
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
  .gift-list-index {
    margin: 50px;
    .list-type{
      margin-top: 40px;
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
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
  @import "../new-theme-css";
</style>
