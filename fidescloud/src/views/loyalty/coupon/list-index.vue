<template>
  <div class="coupon-list-index new-table-css">
    <top-search
      class="new-theme-css"
      :menu_type_list="menu_type_list"
      :multiple_selection="multiple_selection"
      @handleSearch="handleSearch"
      @selectMultipleLinesDeleteCoupon="selectMultipleLinesDeleteCoupon"
    />
    <div class="list-type">
      <div v-loading="listLoading">
        <el-table :data="tableData" @selection-change="handleSelectionChange" size="medium"  highlight-current-row :empty-text="$t('member.fc_table_no_data_label')">
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <!--Coupon code-->
          <el-table-column prop="coupon_code" align="center" :label="$t('loyalty.fc_coupon_table_code_label')">
            <template slot-scope="scope">
              <div style="cursor:pointer;color:#0099ff" @click="handleRouter(scope.row.coupon_code, 'detail', scope.row)">
                {{scope.row.coupon_code || table_placeholder}}
              </div>
            </template>
          </el-table-column>
          <!--Coupon name-->
          <el-table-column prop="coupon_name" align="center" :label="$t('loyalty.fc_coupon_table_name_label')">
            <template slot-scope="scope">
              {{scope.row.coupon_name || table_placeholder}}
            </template>
          </el-table-column>
          <!--Coupon type-->
          <el-table-column prop="coupon_type" align="center" :label="$t('loyalty.fc_coupon_table_type_label')">
            <template slot-scope="scope">
              {{scope.row.coupon_type_name || table_placeholder}}
            </template>
          </el-table-column>
          <!--Channel-->
          <el-table-column prop="channel" align="center" :label="$t('loyalty.fc_coupon_table_channel_label')">
            <template slot-scope="scope">
              {{scope.row.channel_name === 'All' ? 'Online + Offline' : (scope.row.channel_name || table_placeholder)}}
            </template>
          </el-table-column>
          <!--Effective from-->
          <el-table-column prop="effective_from" align="center" :label="$t('loyalty.fc_coupon_table_effective_from_label')">
            <template slot-scope="scope">
              <template v-if="scope.row.effective_type === 2">
                {{scope.row.specific_effective_date_from ? globalData.formatDate((scope.row.specific_effective_date_from).substr(0, 10)) : table_placeholder}}
              </template>
              <template v-else>
                {{$t('loyalty.fc_coupon_table_effective_from_relative_label').replace('{3}',scope.row.relative_value_from ? scope.row.relative_value_from : 0)}}
              </template>
            </template>
          </el-table-column>
          <!--Effective to-->
          <el-table-column :label="$t('loyalty.fc_coupon_table_effective_to_label')" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.effective_type === 2">
                {{scope.row.specific_effective_date_to ? globalData.formatDate((scope.row.specific_effective_date_to).substr(0, 10)) : table_placeholder}}
              </template>
              <template v-else>
                {{$t('loyalty.fc_coupon_table_effective_to_relative_label').replace('{10}',scope.row.relative_value)}}
              </template>
            </template>
          </el-table-column>
          <!--Used in redemption-->
          <el-table-column :label="$t('loyalty.fc_coupon_table_used_in_redemption_label')" align="center" min-width="110">
            <template slot-scope="scope">
              {{scope.row.is_used_in_redemption  ? 'Yes' : 'No'}}
            </template>
          </el-table-column>
          <!--Used in campaign-->
          <el-table-column :label="$t('loyalty.fc_coupon_table_used_in_camagin_label')" align="center" min-width="100">
            <template slot-scope="scope">
              {{scope.row.campaign_status ? 'Yes' : 'No'}}
            </template>
          </el-table-column>
          <!--Coupon view-->
          <el-table-column :label="$t('loyalty.fc_coupon_table_coupon_view_label')" align="center" prop="cpntools_coupon_id" v-if="enable_coupon_tools">
            <template slot-scope="scope">
              {{scope.row.cpntools_coupon_id ? 'Completed' : 'Uncompleted'}}
            </template>
          </el-table-column>
          <!--Operation-->
          <el-table-column :label="$t('loyalty.fc_coupon_table_operation_label')" align="center" :width="operation_width">
            <template slot-scope="scope">
              <div class="operation">
                <!--Edit-->
                <label @click="handleRouter(scope.row.coupon_code, 'edit', scope.row)">{{$t('loyalty.fc_operation_btn_edit_label')}}</label>
                <!--Copy-->
                <label @click="handleRouter(scope.row.coupon_code, 'copy', scope.row)" v-if="!enable_coupon_tools">{{$t('loyalty.fc_operation_btn_copy_label')}}</label>
                <!--Delete-->
                <label @click="lineDeleteCoupon(scope.row, 2)" >{{$t('loyalty.fc_operation_btn_delete_label')}}</label>
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
      />
    </div>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryCouponListBy, isEnableCouponTools } from '@/api/loyalty'
  import { pageLimit } from '@/api/api'
  import { debounce } from '@/utils'
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
          asc: false,
          status: 1,
          order_by: 'id'
        },
        total: 0,
        multiple_selection: [],
        enable_coupon_tools: false
      }
    },
    created() {
      this.enableCouponTools()
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
      handleRouter(coupon_code, type, detail) {
        this.$router.push({
          path: `/loyalty/coupon/${type}`,
          query: {
            id: coupon_code,
            type: type
          }
        })
        sessionStorage.setItem('coupon_list_info_detail', JSON.stringify(detail))
      },
      handleSelectionChange(val) {
        this.multiple_selection = val
      },
      getList(obj = {}) {
        this.listLoading = true
        queryCouponListBy(Object.assign({}, this.listQuery, obj)).then(res => {
          const obj = res.return_result
          this.tableData = obj.coupons
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
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      enableCouponTools() {
        isEnableCouponTools().then(res => {
          this.enable_coupon_tools = res.return_result.enable_coupon_tools
          sessionStorage.setItem('enable_coupon_tools', this.enable_coupon_tools)
          this.getList()
        })
      }
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
  .coupon-list-index {
    margin: 50px;
    .list-type{
      margin-top: 40px;
      box-shadow:0px 5px 15px -3px rgba(204,204,204,1);
      /deep/ .el-table {
        color: #666666;
      }
    }
    .operation{
      @media (max-width: 1500px) {
        flex-wrap: wrap;
        label{
          &:not(:nth-child(1)) {
            margin-top: 5px!important;
            margin-left: 0!important;
          }
        }
      }
      display: flex;
      justify-content: center;
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
