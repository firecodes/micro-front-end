<!--
  2019/10/28
  Association report
-->
<template>
  <div class="association-report-10" ref="association-report-10">
    <ed-table>
      <el-table :data="table_data" :empty-text="$t('member.fc_table_no_data_label')" border v-loading='table_loading'>
        <!--Member code-->
        <el-table-column align="center" label="Member code" prop='member_code'>
          <template slot-scope="scope">
            {{ scope.row.member_code || table_placeholder }}
          </template>
        </el-table-column>
        <!--Full name-->
        <el-table-column align="center" label="Full name" prop="full_name">
          <template slot-scope="scope">
            {{ scope.row.full_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--Gender-->
        <el-table-column align="center" label="Gender" prop="gender">
          <template slot-scope="scope">
            {{ handleGlobalI18n('system', scope.row.gender) || table_placeholder }}
          </template>
        </el-table-column>
        <!--Birthday-->
        <el-table-column align="center" label="Birthday" prop="birthday">
          <template slot-scope="scope">
            {{ scope.row.birthday ? scope.row.birthday.substring(0, 10) : table_placeholder }}
          </template>
        </el-table-column>
        <!--Tier-->
        <el-table-column align="center"  label="Tier" prop="member_tier_name">
          <template slot-scope="scope">
            {{ scope.row.member_tier_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--Transaction amount-->
        <el-table-column align="center" label="Transaction amount" prop="transaction_amount">
          <template slot-scope="scope">
            {{ scope.row.transaction_amount || 0 }}
          </template>
        </el-table-column>
        <!--Number of transactions-->
        <el-table-column align="center" label="Number of transactions" prop="transaction_number">
          <template slot-scope="scope">
            {{ scope.row.transaction_number || 0 }}
          </template>
        </el-table-column>
        <!--Points-->
        <el-table-column align="center" label="Points" prop="points">
          <template slot-scope="scope">
            {{ scope.row.points || 0 }}
          </template>
        </el-table-column>
        <!--Registration date-->
        <el-table-column align="center" label="Registration date" prop="register_date">
          <template slot-scope="scope">
            {{ scope.row.register_date ? scope.row.register_date.substring(0, 10) : table_placeholder }}
          </template>
        </el-table-column>
        <!--Registration store-->
        <el-table-column align="center" label="Registration store" prop="register_store_name">
          <template slot-scope="scope">
            {{ scope.row.register_store_name || table_placeholder }}
          </template>
        </el-table-column>
        <!--Association-->
        <el-table-column align="center" label="Association" prop="association">
          <template slot-scope="scope">
            {{ scope.row.association || table_placeholder }}
          </template>
        </el-table-column>
      </el-table>
      <pagination-container
      :page = "list_query.page_no"
      :page_size = 'list_query.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></pagination-container>
    </ed-table>
  </div>
</template>
<script>
  import { associationReport } from '@/api/report'
  import PaginationContainer from '@/components/PaginationContainer'
  import { pageLimit } from '@/api/api'
  export default {
    components: {
      PaginationContainer
    },
    data() {
      return {
        obj: {},
        list_query: {
          page_no: 1,
          page_size: pageLimit
        },
        total: null,
        export_total: null,
        table_data: [],
        table_loading: false,
        export_data: []
      }
    },
    watch: {
      table_data() {
        this.$emit('handleExportButton', this.table_data.length > 0)
      }
    },
    methods: {
      handleCurrentChange(val) {
        console.log(val)
        this.list_query.page_no = val
        this.handleMemberCouponReport(this.obj)
      },
      handleSizeChange(val) {
        this.list_query.page_size = val
        this.handleMemberCouponReport(this.obj)
      },
      handleMemberCouponReport(obj) {
        this.obj = obj
        this.table_loading = true
        associationReport(Object.assign({}, obj, this.list_query)).then(res => {
          this.table_loading = false
          this.table_data = res.return_result.results || []
          this.total = res.return_result.total_count
        }).catch(() => {
          this.table_loading = false
        })
      },
      // 循环导出数据
      exportData(data, no = 0) {
        this.table_loading = true
        var page_no = ++no
        associationReport(Object.assign({}, data, { page_no: page_no, page_size: 50 })).then(res => {
          this.export_data = this.export_data.concat(res.return_result.results || [])
          this.export_total = res.return_result.total_count
          var page = res.return_result.total_page
          if (page_no < page) {
            this.exportData(data, page_no)
          } else {
            this.table_loading = false
            this.exportAssociationReport()
          }
        }).catch(() => {
          this.table_loading = false
        })
      },
      exportAssociationReport() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Member code', 'Full name', 'Gender', 'Birthday', 'Tier', 'Transaction amount', 'Number of transactions', 'Points', 'Registration date', 'Registration store', 'Association']
          const filterVal = ['member_code', 'full_name', 'gender', 'birthday', 'member_tier_name', 'transaction_amount', 'transaction_number', 'points', 'register_date', 'register_store_name', 'association']
          const list = this.export_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `Association Report-${Date.parse(new Date())}`,
            autoWidth: 250
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'transaction_amount' || j === 'transaction_number' || j === 'points') {
            return v[j] || 0
          } else if (j === 'birthday' || j === 'register_date') {
            return v[j] ? v[j].substring(0, 10) : this.table_placeholder
          } else {
            return v[j] || this.table_placeholder
          }
        }))
      }
    }
  }
</script>
