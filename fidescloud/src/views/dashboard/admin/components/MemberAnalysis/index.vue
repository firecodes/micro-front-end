<template>
  <el-row class="member" v-loading="listLoading">
    <p class="label">{{$t('homepage.fc_home_members_section_title')}}</p>
    <!--Total members-->
    <el-col :xs="24" :sm="24" :lg="8" class="col">
      <div class="chart-wrapper">
        <pie-chart :data="member_pie_data" :name="$t('homepage.fc_home_members_1st_section_title')" type="member" />
        <div class="right">
          <div class="all">
            <label>{{$t('homepage.fc_home_members_1st_section_title')}}</label>
            <p><count-to :duration="1600" :endVal="tenant_detail.total_member || 0" :startVal="0" class="card-panel-num" /></p>
          </div>
        </div>
      </div>
    </el-col>
    <!--Active rate-->
    <el-col :xs="24" :sm="24" :lg="8" class="col">
      <div class="chart-wrapper">
        <pie-chart2 :data="tier_pie_data" :name="$t('homepage.fc_home_members_2nd_section_title')" type="activity" />
        <div class="right">
          <div class="all">
            <label>{{$t('homepage.fc_home_members_2nd_section_title')}}</label>
            <p>{{decimal2FormatValue(tenant_detail.active_rate || 0, 1)}}%</p>
            <ul class="tier_list" v-if="tier_list.length > 0">
              <li v-for="item in tier_list">{{item.member_tier_name + ': ' + (item.active_rate * 100).toFixed(1) + '%'}}</li>
            </ul>
          </div>
        </div>
      </div>
    </el-col>
    <!--Frequency-->
    <el-col :xs="24" :sm="24" :lg="8">
      <div class="frequency">
        <bar-chart :pie-chart-data="bar_chart_data" />
        <div class="right">
          <div class="all">
            <label>{{$t('homepage.fc_home_members_3rd_section_title')}}</label>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import PieChart from './PieChart'
  import PieChart2 from './PieChart2'
  import BarChart from './BarChart'
  import CountTo from 'vue-count-to'
  import {
    decimal2FormatValue
  } from '@/utils'
  export default {
    components: {
      CountTo,
      PieChart,
      BarChart,
      PieChart2
    },
    props: {
      bar_chart_data: {
        type: Array,
        default: []
      },
      member_pie_data: {
        type: Array,
        default: []
      },
      tenant_detail: {
        type: Object,
        default: {}
      },
      tier_list: {
        type: Array,
        default: []
      },
      tier_pie_data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        listLoading: false // true
      }
    },
    methods: {
      decimal2FormatValue
    },
    watch: {
      member_pie_data() {
        this.listLoading = false
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
  .member {
    width: 100%;
    background: #ffffff;
    position: relative;
    margin-top:25px;
    box-shadow: 0 6px 5px rgba(204, 204, 204, 0.349019607843137);
    .label {
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .chart-wrapper, .frequency{
      // line-height: 220px;
      position: relative;
      // height:220px;
      min-height: 220px;
      width: 100%;
      margin:auto;
      text-align: center;
      .all{
        // border:1px solid palegreen;
        text-align: left;
      }
      label{
        font-size:18px;
        color:#777777;
        // border:1px solid red;
      }
      p{
        font-size:32px;
        // border:1px solid red;
      }
      .right{
        left:48%;right:0;
        text-align: center;
        line-height: 1.4;
        font-size:28px;
        top:25%;
        position: relative;
        margin: -163px auto 20px auto;
        .tier_list{
          font-size: 13px;
          color: #777777;
          li{
            line-height: 20px;
          }
        }
      }
    }

  }
  @media (min-width: 1200px) {
    .col{
      position: relative;
      &:after{
        content: '';
        width: 1px;
        height:100px;
        background-color: #BBBBBB;
        position: absolute;
        right:0;
        margin-top:40px;
        top: 40px;
        bottom:0;
      }
    }
  }
</style>
