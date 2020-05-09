<template>
  <div class="e-employee-details-wrapper">
    <el-container class="container"> 
      <!--aside-->
      <el-aside class="details-aside">
        <div class="store-info">
          <span class="info-date" v-if="!common.validatIsNull(details.register_date)">{{ details.register_date | parseTime('{d}/{m}/{y}') }}</span>
          <router-link :to="'/employee/list/edit/' + details.id" v-if="!(!details.is_change_status && (details.id !== $store.state.user.userInfo.employee_id))">
            <svg-icon icon-class="edit" class="employee-edit"></svg-icon>
          </router-link>
          <div class="store-img">
            <img :onerror="default_avatar" :src="details.avatar || ''" class="img" alt="">
          </div>
          <p class="store-name">
            <label>{{details.name}}</label>
            <img v-if="details.gender === 1" src="../../../../assets/images/male.png" alt="">
            <img v-if="details.gender === 2" src="../../../../assets/images/madam.png" alt="">
          </p>
          <div class="info-points">
            <router-link :to="'/employee/list/details/' + $route.params.id + '/points' ">
              {{ handleGlobalI18n('employee', 'mgt_empl_details_point_label') }}<span v-text="details.points === null ? 0 : details.points" class="link"></span>
            </router-link>
          </div>
        </div>
        <ul class="store-infos">
          <li><label>{{ handleGlobalI18n('employee', 'mgt_empl_details_account_label') }}</label><span>{{details.account_name}}</span></li>
          <li><label>{{ handleGlobalI18n('employee', 'mgt_empl_details_mobile_label') }}</label><span>{{details.mobile}}</span></li>
          <li><label>{{ handleGlobalI18n('employee', 'mgt_empl_details_email_label') }}</label><span>{{details.email}}</span></li>
          <li><label>{{ handleGlobalI18n('employee', 'mgt_empl_details_position_label') }}</label><span>{{details.position}}</span></li>
          <li>
            <label>{{ handleGlobalI18n('employee', 'mgt_empl_details_store_label') }}</label>
            <span>
              <em v-for="(item,idx) in details.store" :key="item">
                {{item}} <i v-if="idx !== details.store.length - 1 ">,</i>
              </em>
            </span>
          </li>
          <li>
            <label>{{ handleGlobalI18n('employee', 'mgt_empl_details_store_group_label') }}</label>
            <span>
              <em v-for="(item,idx) in details.store_group" :key="item">
                {{item}} <i v-if="idx !== details.store_group.length - 1 ">,</i>
              </em>
            </span>
          </li>
        </ul>
      </el-aside>
      <!-- main -->
      <el-main class="details-main">
        <div class="datas-panel">
          <div>
            <p>{{ handleGlobalI18n('employee', 'mgt_empl_details_top_2nd_label') }}</p>
            <strong>{{ kpis.total_members }}</strong>
          </div>
          <div>
            <p>{{ handleGlobalI18n('employee', 'mgt_empl_details_top_3rd_label') }}</p>
            <strong>{{ kpis.total_sales|unit(kpis.currency_type) }}</strong>
          </div>
        </div>  

        <div class="kpi-box">
          <kpi-panel :kpis="kpis"/>
        </div>

        <div>
          <h3 class="h3"><span>{{ handleGlobalI18n('employee', 'mgt_empl_details_bottom_section_title') }}</span></h3>
          <div class="table-box" v-loading="tableLoading">
            <el-table
              :data="tableData.slice(0, 10)"
              border
              style="width: 100%">
              <el-table-column type="index" :index="(index) => common.tableListIdx(index, 1, 10)" label="#" align="center" width="80"></el-table-column>
              <el-table-column prop="customer" :label="handleGlobalI18n('employee', 'mgt_empl_details_bottom_table_name_label')" align="center">
                <template slot-scope="scope">{{scope.row.customer.user_name}}</template>  
              </el-table-column>
              <el-table-column prop="last_chat_time" :label="handleGlobalI18n('employee', 'mgt_empl_details_bottom_table_time_label')" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.last_chat_time">{{ new Date(scope.row.last_chat_time).getTime() | parseTime }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="last_message" :label="handleGlobalI18n('employee', 'mgt_empl_details_bottom_table_message_label')" align="center">
                <template slot-scope="scope">{{scope.row.last_message.content}}</template>
              </el-table-column>
              <el-table-column :label="handleGlobalI18n('employee', 'mgt_empl_details_bottom_table_operation_label')" align="center">
                <template slot-scope="scope">
                  <div class="handle-btns">
                    <router-link :to="{
                      path: '/member/communication/details/' + $route.params.id,
                      query: { listIndex: tableData.findIndex(item => item === scope.row), employee_name: details.name }
                    }" class="more-link link">{{ handleGlobalI18n('employee', 'mgt_operation_btn_details_label') }}</router-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="more-link-box" v-if="tableData.length > 10">
              <router-link :to="{
                path: '/member/communication/details/' + $route.params.id
              }" class="more-link link">{{ handleGlobalI18n('employee', 'mgt_empl_details_bottom_more_label') }}</router-link>
            </div> 
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { employeeHistoryList } from '@/api/communication'
import { employeeDetail } from '@/api/employ'
import { employeeMonthlyKpi } from '@/api/kpi'
import kpiPanel from './kpiPanel'
export default {
  name: 'employee-details',
  components: { kpiPanel },
  data() {
    return {
      default_avatar: 'this.src="' + require('../../../../assets/images/employee.png') + '"',
      kpis: {
        currency_type: '',
        bonus: 0,
        existing_members: 0,
        new_members: 0,
        total_sales: 0,
        existing_member_sales: 0,
        new_member_sales: 0,
        member_sales_contribution: 0,
        rate_of_member_purchase_twice: 0,
        rate_of_active_member: 0,
        rate_of_member_social_media_binding: 0,
        rate_of_member_retention: 0,
        average_items: 0,
        average_items_of_member: 0,
        average_items_of_non_member: 0,
        average_basket: 0,
        average_basket_of_member: 0,
        average_basket_of_non_member: 0
      },
      tableData: [],
      tableLoading: true,
      details: {
        register_date: '111'
      }
    }
  },
  created() {
    this.getEmployeeDetail()
    this.getEmployeeMonthlyKpiData()
  },
  methods: {
    getEmployeeDetail() {
      employeeDetail(this.$route.params.id).then(res => {
        if (res && res.id) {
          res.account_name = res.account_name || ''
          const Idx = res.account_name.indexOf('@') === -1 ? res.account_name.length : res.account_name.indexOf('@')
          res.account_name = res.account_name.slice(0, Idx)
          this.details = res
          this.getEmployeeCommunicationData()
        } else {
          this.tableLoading = false
        }
      }).catch(() => { this.tableLoading = false })
    },
    getEmployeeMonthlyKpiData() {
      const params = {
        employee_id: this.$route.params.id
      }
      // console.log('是不是到这里来了:', params)
      employeeMonthlyKpi(params).then(res => {
        if (res) {
          res.currency_type = res.currency
          res.member_sales_contribution = res.contribution_rate_of_member_sales
          res.average_items = res.average_item || res.average_items || 0
          res.average_items_of_member = res.average_item_of_member
          res.average_items_of_non_member = res.average_item_of_non_member
          res.average_basket = res.average_basket || 0
          this.kpis = res
        }
      })
    },
    getEmployeeCommunicationData() {
      const listQuery = { asc: false, page_no: 1, page_size: 11, content: '', user_id: this.$route.params.id }
      employeeHistoryList(listQuery).then(res => {
        this.tableLoading = false
        if (res && res.results) {
          this.tableData = res.results || []
        }
      }).catch(() => { this.tableLoading = false })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.e-employee-details-wrapper {
  .container {
    margin: 15px 20px;
  }
  .employee-edit {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 26px;
  }
  .details-main > div {
    background: #fff;
    margin-bottom: 20px;
  }
  .store-info {
    background-color: #ffffff;
    overflow: hidden;
    position: relative;
    padding: 20px;
  }
  .store-infos {
    background-color: #F3F6FB;
    padding: 10px;
    font-size: 16px
  }
  .store-infos li {
    padding: 10px 0;
    border-bottom: 1px solid #CECFD1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .info-points {
    .link {
      text-decoration: underline;
      margin-left: 5px;
    }
  }
  .info-date {
    position: absolute;
    left: 0;
    top: 10px;
    background-color: #FD9899;
    color: #fff;
    padding: 10px;
    padding: 0 10px;
    line-height: 2;
    font-size: 14px;
    border-radius: 0 28px 28px 0;
  }
  .store-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: relative;
    margin: 0 auto 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info-points {
    margin-bottom: 15px;
    text-align: center;
    a {
      display: inline-block;
      padding: 0 10px;
      line-height: 24px;
      border-radius: 3px;
      background-color: #f9b046;
      color: white;
      font-size: 16px;
      text-align: center;
      border: 1px solid #f9b046;
    }
  }
  .kpi-box {
    margin-bottom: 20px;
  }
  .more-link-box {
    text-align: center;
    padding: 20px 0;
  }
  .communication{
    width: 135px;
    height: 36px;
    border: 1px solid #CCCCCC;
    border-radius: 36px;
    text-align: center;
    line-height: 36px;
    margin: 0 auto 20px;
    img{
      width: 25px;
      vertical-align: middle;
    }
    span{
      color: #666;
      margin-left: 8px;
    }
  }
  .details-main {
    padding: 0px 0 20px;
    margin: 0 0 0 20px;
    overflow: hidden;
    > div {
      background: #fff;
      margin-bottom: 20px;
      p {
        font-size: 18px;
        margin-bottom: 10px;
      }
    }
    .datas-panel {
      display: flex;
      padding: 20px;
      div {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        text-align: center;
        color: #666;
        position: relative;
      }
    }
    .datas-panel div:not(:last-child):after {
      content: '';
      width: 1px;
      height: 50px;
      background: #666;
      position: absolute;
      right: 0;
      top: 50%;
      -webkit-transform: translate3d(0, -50%, 0);
      transform: translate3d(0, -50%, 0);
    }
    .h3 {
      height: 50px;
      background-color: #ffffff;
      position: relative;
      color: #409EFF !important;
      span {
        position: relative;
        top: 18px;
        left: 13px;
      }
    }
    .h3::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 3px;
      top: 17px;
      left: 0;
      background: #409EFF;
    }
  }
}
</style>
