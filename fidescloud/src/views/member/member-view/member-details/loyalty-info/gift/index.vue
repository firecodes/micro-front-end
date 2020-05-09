<template>
  <div class="gift" v-loading = "loading">
    <div class="check">
      <div class="margin">
        <el-form >
          <el-row>
            <!--Issued date-->
            <el-col :span="10">
              <div class="date-from">
                <el-form-item :label="$t('member.fc_member_details_loyalty_gift_date_label')">
                  <eldate-picker :value="date" @valueDate="valueDate"></eldate-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="button">
                <el-button type="primary" @click="search">{{$t('member.fc_member_details_loyalty_gift_btn_search_label')}}</el-button>
                <el-button @click="resetForm1">{{$t('member.fc_member_details_loyalty_gift_btn_reset_label')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <p class="query_result">{{$t('member.fc_member_details_loyalty_gift_history_label')}}</p>
    <el-table :data="tableData" border :empty-text="$t('member.fc_table_no_data_label')">
      <!--Gift code-->
      <el-table-column prop="gift_code" align="center" :label="$t('member.fc_member_details_loyalty_gift_table_code_label')">
        <template slot-scope="scope">
          {{scope.row.gift_code || table_placeholder }}
        </template>
      </el-table-column>
      <!--Gift name-->
      <el-table-column prop="gift_name" align="center" :label="$t('member.fc_member_details_loyalty_gift_table_name_label')">
        <template slot-scope="scope">
            {{scope.row.gift_name || table_placeholder }}
        </template>
      </el-table-column>
      <!--Quantity-->
      <el-table-column prop="quantity" align="center" :label="$t('member.fc_member_details_loyalty_gift_table_quantity_label')">
        <template slot-scope="scope">
          {{scope.row.quantity || 0 }}
        </template>
      </el-table-column>
      <!--Issue date-->
      <el-table-column prop="issue_date" align="center" :label="$t('member.fc_member_details_loyalty_gift_table_date_label')">
        <template slot-scope="scope">
          {{ scope.row.issue_date ? globalData.formatDate((scope.row.issue_date).substring(0, 10)) : table_placeholder }}
        </template>
      </el-table-column>
    </el-table>
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
  import EldatePicker from '@/components/EldatePicker'
  import PaginationContainer from '@/components/PaginationContainer'
  import {
    loyaltyInfoMixins
  } from '@/utils/util'
  import {
    firstWordUpperCase
  } from '@/utils'
  import {
    queryMemberGiftListBySearch
  } from '@/api/member'
  import { DateTime } from 'luxon'
  var status_data = [
    'Inactive',
    'Normal',
    'Used',
    'Expired(before used)'
  ]
  export default {
    mixins: [loyaltyInfoMixins],
    components: {
      EldatePicker,
      PaginationContainer
    },
    filters: {
      handleStatus(val) {
        return status_data[val] || '-'
      }
    },
    data() {
      return {
        date: [],
        date_form: null,
        date_to: null,
        tableData: [],
        listQuery: {
          page_size: 10
        },
        loading: true,
        postfix: '',
        form: {},
        valueDateForm: []
      }
    },
    created() {
      this.queryListBySearch()
    },
    methods: {
      firstWordUpperCase,
      handleView(data) {
        this.dialogFormVisible = true
        this.form = data
        if (this.form.specific_effective_date_from) {
          this.valueDateForm = [(this.form.specific_effective_date_from).substring(0, 10), (this.form.specific_effective_date_to).substring(0, 10)]
        }
      },
      queryListBySearch() {
        this.setDateTime()
        this.loading = true
        queryMemberGiftListBySearch(Object.assign({
          member_code: this.member_code,
          issue_date_from: this.date_form ? `${this.date_form}T00:00:00.000${this.postfix}` : null,
          issue_date_to: this.date_to ? `${this.date_to}T23:59:59.999${this.postfix}` : null
        }, this.listQuery)).then((res) => {
          this.tableData = res.return_result.member_gifts
          this.total = res.return_result.total_count
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },
      setDateTime() {
        const generate_time = DateTime.local().toISO()
        const nowDateLength = generate_time.length
        this.postfix = generate_time.substring(nowDateLength - 6, nowDateLength)
      },
      valueDate(val) {
        [this.date_form, this.date_to] = val
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.queryListBySearch()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.queryListBySearch()
      },
      search() {
        this.listQuery.page_no = 1
        this.queryListBySearch()
      },
      resetForm1() {
        this.date = []
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .width200{
    width: 200px;
  }
  .gift{
    margin-top:20px;
    .check{
      background-color:#f9f9f9;
      margin-top:20px;
      .margin{
        padding:12px;
      }
    }
    .query_result{
      margin:15px 0;
    }
  }
</style>
