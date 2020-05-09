<template>
  <div class="memberTagPage">
    <div class="gift-list-index new-table-css">
      <div class="list-type">
        <div v-loading="listLoading">
          <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange" size="medium"  highlight-current-row :empty-text="handleGlobalI18n('system', 'no_data')">
            <el-table-column
              type="selection"
              align="center"
              width="80">
            </el-table-column>
            <el-table-column prop="Campaign name" min-width="90" align="center" label="Tag name" width="280">
              <template slot-scope="scope">
                <div style="cursor:pointer;color:#0099ff" @click="handleRouter(scope.row.gift_code, 'detail')">
                  {{scope.row.gift_code || table_placeholder}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Campaign date" prop="unit_price" align="center" >
              <template slot-scope="scope">
                {{scope.row.unit_price || table_placeholder}}
              </template>
            </el-table-column>
            <el-table-column label="Operation" align="center" width="200">
              <template slot-scope="scope">
                <div class="operation">
                  <label @click="lineDeleteGift(scope.row, 2)" >Details</label>
                  <label @click="handleRouter(scope.row.gift_code, 'edit')">Re-run</label>
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
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { searchGift } from '@/api/loyalty'
  import { pageLimit } from '@/api/api'
  import { deleteCategoryMixin } from '../../mixins'
  export default {
    mixins: [
      deleteCategoryMixin
    ],
    components: {
      PaginationContainer
    },
    data() {
      return {
        search_type: 1,
        menu_type_list: true,
        timeSubstring(value) {
          if (!value || value === null || value === undefined) return ''
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
          asc: true,
          status: 1,
          order_by: 'gift_name'
        },
        total: 0,
        multiple_selection: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      sortChange(row) {
        this.listQuery.page_no = 1
        this.getList({
          order_by: row.prop,
          asc: row.order === 'ascending'
        })
      },
      handleRouter(gift_code, type) {
        this.$router.push({
          path: `/loyalty/gift/${type}`,
          query: {
            id: gift_code,
            type: type
          }
        })
      },
      handleSelectionChange(val) {
        this.multiple_selection = val
      },
      getList(obj = {}) {
        this.listLoading = true
        searchGift(Object.assign({}, this.listQuery, obj)).then(res => {
          const obj = res.return_result
          this.tableData = obj.gifts
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
        var obj = {}
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
  .gift-list-index {
    // margin: 50px;
    .list-type{
      margin-top: 40px;
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
    }
    .operation{
      display: flex;
      justify-content: space-between;
      font-size:14px;
      font-weight:bold;
      color:rgba(39,119,255,1);
      line-height:17px;
      align-items: center;
      label{
        width:80px;
        height:30px;
        background:rgba(74,144,226,0.07);
        border-radius:4px;
        font-weight: bold;
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
