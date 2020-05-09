<template>
      <div class="wh-100 r-storelist-wrapper">
        <div class="top-wrapper">
          <div class="store-form">
            <router-link to="/configuration/store/list/add" tag="a" class="el-button el-button--primary el-button--small">{{ handleGlobalI18n('store', 'mgt_store_add_label') }}</router-link>
          </div>
          <el-row class="select_input">
            <el-select v-model="namevalue" value-key="type_id" :placeholder="handleGlobalI18n('system', 'please_select')">
              <el-option
                v-for="item in nameoptions"
                :key="item.type_id"
                :label="item.label ? handleGlobalI18n('store', item.label) : item.type_name"
                :value="item.type_id">
              </el-option>
            </el-select>
            <div class="flex search_input">
              <el-input v-model="inputSearch" :placeholder="handleGlobalI18n('store', 'mgt_company_add_content_input_label')"></el-input>
              <el-button @click="clickSearchBtn(inputSearch)"><i class="el-icon-search"></i></el-button>
            </div>
          </el-row>
    </div>
    <div>
      <el-table
        :data="list"
        v-loading = "loading"
        border
        style="width: 100%;"
        >
         <el-table-column type="index" :index="(index) => common.tableListIdx(index, listQuery.page_no, listQuery.page_size)" label="#" align="center" width="80"></el-table-column>
         <el-table-column prop="store_name" :label="handleGlobalI18n('store', 'mgt_store_table_name_label')" align="center"></el-table-column>
         <el-table-column prop="telephone" :label="handleGlobalI18n('store', 'mgt_store_table_phone_label')" align="center"></el-table-column>
         <el-table-column prop="state" :label="handleGlobalI18n('store', 'mgt_store_table_state_label')" align="center"></el-table-column>
         <el-table-column prop="city" :label="handleGlobalI18n('store', 'mgt_store_table_city_label')" align="center"></el-table-column>
         <el-table-column prop="address" :label="handleGlobalI18n('store', 'mgt_store_table_address_label')" align="center" min-width="160">
          <template slot-scope="scope">
            <div class="table-content">{{scope.row.address}}</div>
          </template>
         </el-table-column>
         <el-table-column :label="handleGlobalI18n('store', 'mgt_store_table_operation_label')" align="center" min-width="160">
            <template slot-scope="scope">
              <div class="handle-btns">
                <router-link :to="'/configuration/store/list/details/' + scope.row.id">{{ handleGlobalI18n('store', 'mgt_operation_btn_details_label') }}</router-link>
                <router-link :to="'/configuration/store/list/edit/' + scope.row.id">{{ handleGlobalI18n('store', 'mgt_operation_btn_edit_label') }}</router-link>
                <span @click="deleteItem(scope.row.id)">{{ handleGlobalI18n('store', 'mgt_operation_btn_delete_label') }}</span>
              </div>
            </template>
          </el-table-column>
       </el-table>
      <div class="pagination text-center bg-fff"  v-if="!loading && list.length !== 0">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page_no"
          :page-sizes="[10,20,30,40,50]"
          :page-size="listQuery.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Category from './components/category'
import { storeList, storeDelete } from '@/api/store'
export default {
  name: 'store',
  components: { Category },
  data() {
    return {
      loading: false,
      listQuery: {
        asc: true,
        content: '',
        key: 0,
        state_id: '',
        city_id: '',
        page_no: 1,
        page_size: this.common.listQuery.page_size
      },
      list: [],
      inputSearch: '',
      nameoptions: [
        { type_id: 0, label: 'mgt_store_search_menu_1st_label', type_name: this.handleGlobalI18n('store', 'mgt_store_search_menu_1st_label') }
      ],
      namevalue: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clickSearchBtn(val) {
      this.listQuery.content = val
      this.getList()
    },
    getList() {
      this.loading = true
      storeList({ ...this.listQuery, ...{ language: this.$store.getters.language }}).then(res => {
        this.loading = false
        let result = res.return_result.results || []
        if (res) {
          result = result.sort((a, b) => {
            return a.store_name.localeCompare(b.store_name)
          })
          this.list = result
          this.total = res.return_result.total_count
        }
      }).catch(() => { this.loading = false })
    },
    deleteItem(id) {
      this.$confirm(this.handleGlobalI18n('store', 'mgt_store_delete_confirm_content_label'), this.handleGlobalI18n('store', 'mgt_operation_delete_confirm_title_label'), {
        confirmButtonText: this.handleGlobalI18n('store', 'mgt_operation_delete_confirm_ok_label'),
        cancelButtonText: this.handleGlobalI18n('store', 'mgt_operation_delete_confirm_cancel_label'),
        confirmButtonClass: 'new_confirm_confirm',
        cancelButtonClass: 'new_confirm_cancel'
      }).then(() => {
        storeDelete({
          id
        }).then(res => { // 0 => delete 1 => recover
          if (res && res.return_result.success) {
            this.listQuery.page_no = 1
            this.getList()
            this.$message({
              dangerouslyUseHTMLString: true,
              message: this.handleGlobalI18n('store', 'mgt_store_delete_notification_label'),
              type: 'success'
            })
          }
        })
      }).catch(() => {})
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.listQuery.page_no = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      this.getList()
    }
  }
}
</script>
<style lang='scss' scoped>
.r-storelist-wrapper {
  margin: 15px 20px;
  .flex {
    display: flex;
  }
  .top-wrapper {
    overflow: hidden;
    .el-select {
      width: 200px;
      float: left;
    }
    .el-input {
      width: 350px;
    }
  }
  .store-form {
    margin-bottom: 30px;
    float: left;
  }
  .select_input {
    float: right;
  }
  .store-form .btn-link {
    float: left;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border-radius: 5px;
    background: #409EFF;
    color: #fff;
    margin-right: 15px;
    border: none;
  }
  .pagination {
    padding: 20px;
  }
}
</style>
