<template>
  <div class="redemption-list">
    <div class="search">
      <el-form :rules="rules" :model="listQuery" label-width="190px" ref="form" :inline="true" >
        <el-form-item :label="handleGlobalI18n('loyalty', 'redemption_event') + ':'" prop="redemption_event_code">
          <el-select
            clearable
            v-selectLoadmore="selectLoadmore"
            v-model="listQuery.redemption_event_code"
            filterable
            :placeholder="handleGlobalI18n('loyalty', 'please_select')"
          >
            <el-option
              v-for="item in valid.list"
              :key="item.redemption_event_code"
              :label="item.redemption_event_name"
              :value="item.redemption_event_code">
            </el-option>
            <div style="text-align: center">
              <i class="el-icon-loading" v-if="valid.length<valid.total_count"></i>
            <!-- <span style="font-size:13px;" v-if="valid.length>=valid.total_count && page>1">{{handleGlobalI18n('system', 'after_loaded')}}</span> -->
            </div>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'redeemed_order_status') + ':'">
          <el-select v-model.number="listQuery.redemption_order_status" :placeholder="handleGlobalI18n('loyalty', 'please_select')">
            <el-option :label="handleGlobalI18n('loyalty', 'redeem')" :value="parseInt(1)"></el-option>
            <el-option :label="handleGlobalI18n('loyalty', 'taken')" :value="parseInt(2)"></el-option>
            <el-option :label="handleGlobalI18n('loyalty', 'cancel')" :value="parseInt(3)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'member_code') + ':'">
           <el-input type="text" style="width:250px; margin-bottom: 10px;" max="32" v-model="listQuery.member_code">
          </el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'mobile') + ':'" >
           <el-input type="text" style="width:150px; margin-bottom: 10px;" max="20" v-model="listQuery.mobile">
          </el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'redeemed_order_period') + ':'">
        <date-range @valueDate = "valueDateJoin" :value="member_redeem_time"></date-range>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search('form')">{{handleGlobalI18n('loyalty', 'search')}}</el-button>
        <el-button type="primary" icon="el-icon-download" @click="export1('form')" :loading="exportLoading">{{handleGlobalI18n('loyalty', 'export')}}</el-button>
      </el-form>
    </div>
    <p class="p">{{handleGlobalI18n('loyalty', 'query_result')}}:</p>
    <div v-loading="listLoading">
      <el-table :data="tableData"  highlight-current-row border :empty-text="$t('member.fc_table_no_data_label')">
        <el-table-column prop="member_code" min-width="90" align="center" :label="handleGlobalI18n('loyalty', 'member_code')"></el-table-column>
        <el-table-column prop="member_name" align="center" :label="handleGlobalI18n('loyalty', 'member_name')"></el-table-column>
        <el-table-column prop="redemption_date" align="center" :label="handleGlobalI18n('loyalty', 'redemption_date')">
          <template slot-scope="scope">
            {{globalData.formatDate((scope.row.order_time).substring(0, 10))}}
          </template>
        </el-table-column>
        <el-table-column prop="redemption_date" align="center" :label="handleGlobalI18n('loyalty', 'status')">
          <template slot-scope="scope">
            {{ handleStatus(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column prop="redeem_points" align="center" :label="handleGlobalI18n('loyalty', 'redeemed_points')"></el-table-column>
        <el-table-column :label="handleGlobalI18n('loyalty', 'operation')" align="center">
          <template slot-scope="scope">
          <el-button @click="detailRedeem(scope.row)">{{handleGlobalI18n('loyalty', 'view')}}</el-button>
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
</template>
<script>
  import DateRange from '@/components/EldatePicker'
  import PaginationContainer from '@/components/PaginationContainer'
  import { queryRedemptionOrder, queryValidRedemptionEvent, exportRedemptionList } from '@/api/redemption'
  import { pageLimit } from '@/api/api'
  import { mapMutations } from 'vuex'
  // import { downloadFile } from '@/utils'
  import { setRedeemDetail as setRedeemDetailSession } from '@/utils/auth'
  import { DateTime } from 'luxon'
  import { redeemStatus } from './mixin'
  export default {
    mixins: [redeemStatus],
    components: {
      PaginationContainer,
      DateRange
    },
    data() {
      return {
        rules: {
          redemption_event_code: [
            { required: true, message: this.handleGlobalI18n('validation', 'redemption_event_null'), trigger: 'change' }
          ]
        },
        radio: '',
        exportLoading: false,
        listLoading: true,
        tableData: [],
        valid: {
          list: [],
          total_count: null,
          page: 0
        },
        type_id: 2,
        member_redeem_time: [],
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          redemption_event_code: null,
          redemption_order_status: 1,
          redeem_date_from: null,
          redeem_date_to: null,
          member_code: '',
          mobile: ''
        },
        total: 0,
        generate_time: '',
        postfix: ''
      }
    },
    created() {
      this.init()
    },
    methods: {
      setRedeemDetailSession,
      ...mapMutations({
        setRedeemDetail: 'SET_REDEEM_DETAIL'
      }),
      setDateTime() {
        this.generate_time = DateTime.local().toISO()
        const nowDateLength = this.generate_time.length
        this.postfix = this.generate_time.substring(nowDateLength - 6, nowDateLength)
      },
      detailRedeem(row) {
        this.setRedeemDetail(row)
        this.setRedeemDetailSession(JSON.stringify(row))
        this.$router.push({
          path: '/loyalty/redemption/member-redeem-detail'
        })
      },
      selectLoadmore() {
        if (this.valid.list.length >= this.valid.total_count) {
          return
        }
        this.getValidRedemptionList()
      },
      init() {
        this.setDateTime()
        this.getValidRedemptionList()
        this.getRedemptionOrder()
        // this.setRedeemDate()
      },
      // setRedeemDate() {
      //   this.listQuery.redeem_date_from = `${this.generate_time.substring(0, 10)}T00:00:00.000${this.postfix}`
      //   this.listQuery.redeem_date_to = `${this.generate_time.substring(0, 10)}T23:59:59.999${this.postfix}`
      // },
      getValidRedemptionList() {
        this.valid.page = ++this.valid.page
        queryValidRedemptionEvent({
          page_no: this.valid.page,
          page_size: pageLimit
        }).then((res) => {
          this.valid.total_count = res.return_result.total_count
          this.valid.list = this.valid.list.concat(res.return_result.redemption_events || [])
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      search(formName) {
        this.valid.page = 0
        this.listLoading = true
        this.getRedemptionOrder()
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //     this.listLoading = true
        //     this.getRedemptionOrder()
        //   }
        // })
      },
      export1(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.exportLoading = true
            this.handleExport()
          }
        })
      },
      handleExport() {
        const nobj = {
          'redeem_date_from': this.listQuery.redeem_date_from,
          'redeem_date_to': this.listQuery.redeem_date_to,
          'redemption_event_code': this.listQuery.redemption_event_code,
          'redemption_order_status': this.listQuery.redemption_order_status,
          'member_code': this.listQuery.member_code,
          'mobile': this.listQuery.mobile
        }
        exportRedemptionList(nobj).then(res => {
          this.exportLoading = false
          const url = window.URL.createObjectURL(new Blob([res]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'redemption-order-list.csv')
          document.body.appendChild(link)
          link.click()
        }).catch(() => {
          this.exportLoading = false
        })
      },
      valueDateJoin(val) {
        [this.listQuery.redeem_date_from, this.listQuery.redeem_date_to] = val || [null, null]
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getRedemptionOrder()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getRedemptionOrder()
      },
      getRedemptionOrder() {
        this.listLoading = true
        var obj = {}
        if (this.listQuery.redeem_date_from === null || this.listQuery.redeem_date_to === null) {
          obj = this.listQuery
        } else {
          obj = { ...this.listQuery, ...{ redeem_date_from: `${this.listQuery.redeem_date_from.substring(0, 10)}T00:00:00.000${this.postfix}`, redeem_date_to: `${this.listQuery.redeem_date_to.substring(0, 10)}T23:59:59.999${this.postfix}` }}
        }

        queryRedemptionOrder(obj).then(res => {
          const obj = res.return_result
          this.tableData = obj.redemption_orders
          this.total = obj.total_count
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .redemption-list {
    margin: 20px 0;
    .search{
      .el-input{
        width: 30%;
      }
    }
    .p{
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      box-sizing: border-box;
    }
  }
</style>

