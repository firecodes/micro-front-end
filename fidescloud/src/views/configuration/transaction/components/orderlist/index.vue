<template>
  <div class="list">
    <ed-table>
       <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="transaction_code"
          :label="$t('configuration.fc_transaction_details_related_table_code_label')"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.transaction_code || table_placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_time"
          :label="$t('configuration.fc_transaction_details_related_table_time_label')"
          align="center"
        >
        <template slot-scope="scope">
          <span>{{scope.row.transaction_time | formatTimeStamp('DD/MM/YYYY HH:mm')}}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="transaction_amount"
          :label="$t('configuration.fc_transaction_details_related_table_amount_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.transaction_amount === '' || scope.row.transaction_amount === null ? '-' : globalData.value.currency_symbol + scope.row.transaction_amount}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_type"
          :label="$t('configuration.fc_transaction_details_related_table_type_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.transaction_type || table_placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="channel_name"
          :label="$t('configuration.fc_transaction_details_related_table_channel_label')"
          align="center"
        >
        <template slot-scope="scope">
          <ed-clamp :max-lines="1" autoresize>{{scope.row.channel_resources_key ? $t(`reporting.${scope.row.channel_resources_key}`) : scope.row.channel_name ? scope.row.channel_name : '-'}}</ed-clamp>
        </template>
        </el-table-column>
        <el-table-column
          prop="store_name"
          :label="$t('configuration.fc_transaction_details_related_table_store_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.store_name || table_placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="member_name"
          :label="$t('configuration.fc_transaction_details_related_table_member_code_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.member_name || table_placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('configuration.fc_transaction_details_related_table_operation_label')"
          align="center"
        >
          <template slot-scope="scope">
            <operation-btn><router-link target="_blank" :to="`/configuration/transaction/detail/${scope.row.transaction_id}`">{{$t('configuration.fc_transaction_details_related_table_btn_details_label')}}</router-link></operation-btn>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="pagination">
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
      </div> -->
    </ed-table>
  </div>
</template>

<script>
import EdTable from '@/components/Ed-table/ed-table'
import OperationBtn from '../rowbtn/index'
export default{
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    EdTable,
    OperationBtn
  },
  data() {
    return {
      listQuery: {
        page_no: 1,
        page_size: 15
      },
      total: 1,
      tableData: [
        {
          transaction_ode: 1,
          transaction_time: 2,
          amount: 3,
          transaction_type: 4,
          transaction_channel: 5,
          transaction_store: 5,
          member_code: 6
        }
      ]
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>

<style lang='scss' scoped>
.list {
  // padding-top: 20px;
  // margin-top: 22px;
  .el-pagination {
    padding: 20px;
    text-align: center;
    background-color: #fff;
  }
}
</style>