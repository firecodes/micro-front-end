<template>
  <div class="point-type">
    <div v-loading="loading">
      <el-table :data="tableData" border :empty-text="$t('member.fc_table_no_data_label')">
        <!--standard point name-->
        <el-table-column prop="point_type_name" align="center" :label="$t('loyalty.fc_loyalty_point_specific_table_name_label')">
          <template slot-scope="scope">
            {{scope.row.specific_point_rule_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--creation date-->
        <el-table-column prop="create_date" align="center" :label="$t('loyalty.fc_loyalty_point_specific_table_date_label')">
          <template slot-scope="scope">
            {{scope.row.create_date ? globalData.formatDate((scope.row.create_date).substring(0,10)) : table_placeholder }}
          </template>
        </el-table-column>
        <!--rule versus standard points-->
        <el-table-column prop="create_date" align="center" :label="$t('loyalty.fc_loyalty_point_specific_table_rule_label')">
          <template slot-scope="scope">
            {{scope.row.plus_point_ratio || table_placeholder }}
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" :label="$t('loyalty.fc_loyalty_point_specific_table_description_label')">
          <template slot-scope="scope">
            {{scope.row.description || table_placeholder }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {
    queryPointRuleSpecByStore
  } from '@/api/loyalty'
  import PaginationContainer from '@/components/PaginationContainer'
  export default {
    components: {
      PaginationContainer
    },
    data() {
      return {
        loading: false,
        saveLoading: false,
        dialogFormVisible: false,
        tableData: [],
        form: {},
        listQuery: {
          page_no: 1,
          page_size: 10
        },
        total: 0,
        edit: false
      }
    },
    created() {
      this.getData()
    },
    methods: {
      clickModify() {
        this.$alert(this.handleGlobalI18n('loyalty', 'point_type_modify'), this.handleGlobalI18n('loyalty', 'attention'), {
          confirmButtonText: this.handleGlobalI18n('loyalty', 'confirm')
        })
      },
      addPointType() {
        this.edit = false
        this.dialogFormVisible = !this.dialogFormVisible
        this.form = {}
      },
      getData() {
        this.queryList()
      },
      queryList() {
        this.loading = true
        queryPointRuleSpecByStore({ store_id: 1 }).then(res => {
          this.total = res.return_result.total_count
          this.loading = false
          this.tableData = res.return_result.point_rule_spec_infoes
        }).catch(res => {
          this.loading = false
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getData()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getData()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .point-type {
    margin-top: 20px;
    .click-button {
      padding:5px;
      width: 100%;
      background-color: #ffffff;
      .add {
        margin-left: 20px;
      }
    }
    .el-input,.el-select,.el-textarea{
      width:300px;
    }
    .el-table{
      margin-top:20px;
    }
    .contain {
      padding:30px 0;
      margin-top: 30px;
      background-color: #ffffff;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: -4px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: rgba(51, 51, 51, 0.1);
      }
      .label{
        position: relative;
        left:-10px;
        color:red;
      }
    }
    p{
      line-height: 4;
    }
  }
</style>
