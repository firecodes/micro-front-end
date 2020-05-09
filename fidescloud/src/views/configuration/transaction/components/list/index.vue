<template>
  <div class="list">
    <ed-table>
       <el-table
        v-loading="loading"
        :data="content"
        style="width: 100%">
        <el-table-column
          prop="transaction_code"
          :label="$t('configuration.fc_transaction_table_code_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.transaction_code | placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_time"
          :label="$t('configuration.fc_transaction_table_time_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.transaction_time | formatTimeStamp('DD/MM/YYYY HH:mm')}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_amount"
          :label="$t('configuration.fc_transaction_table_amount_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{(scope.row.transaction_amount === '' || scope.row.transaction_amount === null) ? '-' : globalData.value.currency_symbol + scope.row.transaction_amount}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_type"
          :label="$t('configuration.fc_transaction_table_type_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.transaction_type | placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="channel_name"
          :label="$t('configuration.fc_transaction_table_channel_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.channel_resources_key ? $t(`reporting.${scope.row.channel_resources_key}`) : scope.row.channel_name ? scope.row.channel_name : '-'}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="store_name"
          :label="$t('configuration.fc_transaction_table_store_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.store_name | placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="member_name"
          :label="$t('configuration.fc_transaction_table_member_name_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.member_name | placeholder}}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('configuration.fc_transaction_table_operation_label')"
          align="center"
        >
          <template slot-scope="scope">
            <operation-btn><router-link :to="`/configuration/transaction/detail/${scope.row.transaction_id}`">{{$t('loyalty.fc_operation_btn_details_label')}}</router-link></operation-btn>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
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
    </ed-table>
  </div>
</template>

<script>
import EdTable from '@/components/Ed-table/ed-table'
import OperationBtn from '../rowbtn/index'
export default{
  components: {
    EdTable,
    OperationBtn
  },
  props: {
    content: {
      type: Array,
      default: () => []
    },
    total: {
      type: [String, Number],
      default: 0
    },
    listQuery: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style lang='scss' scoped>
.list {
  padding-top: 20px;
  .el-pagination {
    padding: 20px;
    text-align: center;
    background-color: #fff;
  }
}
</style>