<template>
  <div class="sales" v-loading="listLoading">
    <div class="header">
      <p class="label">优惠券</p>
      <div class="select-year">
        <el-select v-model.number="select_year">
          <el-option v-for="item in query_year_data" :key="item.value" :value="item.value" :label="item.value" ></el-option>
        </el-select>
      </div>
    </div>
    <div class="details">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :lg="24" :xl="12">
          <el-row :gutter="10" class="ul">
            <el-col :xs="24" :sm="24" :lg="12" :xl="12" @click.native="handleClick('total_sales', 'total_sales')" class="li" >
              <el-card shadow="hover" :body-style="card_body_style">
                <div class="li1">
                <h5>优惠券收益</h5>
                <div class="detail">
                  <div class="left">
                    <span>{{globalData.value.currency_symbol}}</span>
                    <label v-html="formatMonty(sale_data.total_sales || 0)"></label>
                  </div>
                  <div class="right">
                    <p>
                      <label>Vs {{handleGlobalI18n('kpi', 'last_month')}} {{decimal2FormatValue(sale_data.total_sales_vs_last_month) || 0}}%</label>
                      <span :class="handleArrowColor(sale_data.total_sales_vs_last_month || 0)"><svg-icon :icon-class="handleArrow(sale_data.total_sales_vs_last_month || 0)"></svg-icon></span>
                    </p>
                    <p>
                      <label>Vs {{handleGlobalI18n('kpi', 'last_year')}} {{decimal2FormatValue(sale_data.total_sales_vs_last_year  ) || 0}}%</label><span :class="handleArrowColor(sale_data.total_sales_vs_last_year || 0)"><svg-icon :icon-class="handleArrow(sale_data.total_sales_vs_last_year || 0)"></svg-icon></span>
                    </p>
                  </div>
                </div>
              </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12" :xl="12" @click.native="handleClick('member_sales', 'member_sales')" class="li">
              <el-card shadow="hover" :body-style="card_body_style">
                <div class="li2">
                <h5>领券数</h5>
                <div class="detail">
                  <div class="left">
                    <span>{{globalData.value.currency_symbol}}</span>
                    <label v-html="formatMonty(sale_data.member_sales || 0)"></label>
                  </div>
                  <div class="right">
                    <p><label>Vs {{handleGlobalI18n('kpi', 'last_month')}} {{decimal2FormatValue(sale_data.member_sales_vs_last_month  ) || 0}}%</label><span :class="handleArrowColor(sale_data.member_sales_vs_last_month || 0)"><svg-icon :icon-class="handleArrow(sale_data.member_sales_vs_last_month || 0)"></svg-icon></span>
                    </p>
                    <p><label>Vs {{handleGlobalI18n('kpi', 'last_year')}} {{decimal2FormatValue(sale_data.member_sales_vs_last_year  ) || 0}}%</label><span :class="handleArrowColor(sale_data.member_sales_vs_last_year || 0)"><svg-icon :icon-class="handleArrow(sale_data.member_sales_vs_last_year || 0)"></svg-icon></span>
                    </p>
                  </div>
                </div>
              </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12" :xl="12" @click.native="handleClick('average_basket', 'average_basket')" class="li">
              <el-card shadow="hover" :body-style="card_body_style">
                <div class="li3">
                <h5>核销数</h5>
                <div class="detail">
                  <div class="left">
                    <span>{{globalData.value.currency_symbol}}</span>
                    <label v-html="formatMonty(sale_data.average_basket || 0)"></label>
                  </div>
                  <div class="right">
                    <p><label>Vs {{handleGlobalI18n('kpi', 'last_month')}}  {{decimal2FormatValue(sale_data.average_basket_vs_last_month) || 0}}% </label><span :class="handleArrowColor(sale_data.average_basket_vs_last_month || 0)"><svg-icon :icon-class="handleArrow(sale_data.average_basket_vs_last_month || 0)"></svg-icon></span>
                    </p>
                    <p><label>Vs {{handleGlobalI18n('kpi', 'last_year')}} {{decimal2FormatValue(sale_data.average_basket_vs_last_year) || 0}}%</label><span :class="handleArrowColor(sale_data.average_basket_vs_last_year || 0)"><svg-icon :icon-class="handleArrow(sale_data.average_basket_vs_last_year || 0)"></svg-icon></span>
                    </p>
                  </div>
                </div>
              </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12" :xl="12" @click.native="handleClick('average_items', 'average_items')" class="li">
              <el-card shadow="hover" :body-style="card_body_style">
                <div class="li4">
                <h5>核销率</h5>
                <div class="detail">
                  <div class="left">
                    <label v-html="formatMonty(sale_data.average_items || 0)"></label>
                  </div>
                  <div class="right">
                    <p><label>Vs {{handleGlobalI18n('kpi', 'last_month')}} {{decimal2FormatValue(sale_data.average_items_vs_last_month) || 0}}%</label><span :class="handleArrowColor(sale_data.average_items_vs_last_month || 0)"><svg-icon :icon-class="handleArrow(sale_data.average_items_vs_last_month || 0)"></svg-icon></span></p>
                    <p><label>Vs {{handleGlobalI18n('kpi', 'last_year')}} {{decimal2FormatValue(sale_data.average_items_vs_last_year) || 0}}%</label><span :class="handleArrowColor(sale_data.average_items_vs_last_year || 0)"><svg-icon :icon-class="handleArrow(sale_data.average_items_vs_last_year || 0)"></svg-icon></span>
                    </p>
                  </div>
                </div>
              </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24" :xl="12">
          <line-chart :chart-data="sale_data.lineChartData" :sale_blocks_title="sale_blocks_title" class="line-chart"></line-chart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import LineChart from './LineChart'
  import {
    formatMonty,
    decimal2FormatValue
  } from '@/utils'
  export default {
    components: {
      LineChart
    },
    props: {
      sale_data: {
        type: Object,
        default: []
      },
      query_year_data: {
        type: Array,
        default: []
      },
      default_year: {
        type: Number
      },
      sale_blocks_title: {
        type: String
      }
    },
    data() {
      return {
        card_body_style: { padding: 0 },
        listLoading: false, // true
        select_year: this.default_year
      }
    },
    methods: {
      handleArrow(v) {
        if (v > 0) {
          return 'arrows'
        } else if (v < 0) {
          return 'arrows1'
        }
        return ''
      },
      handleArrowColor(v) {
        return v > 0 ? 'top' : 'bottom'
      },
      decimal2FormatValue,
      formatMonty,
      handleClick(type, title) {
        this.$emit('salesClickData', type, title)
      }
    },
    watch: {
      select_year() {
        this.listLoading = true
        this.$emit('getKpiYear', parseInt(this.select_year), 'sale')
      },
      sale_data() {
        this.listLoading = false
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .sales {
    margin-top: 20px;
    background: #ffffff;
    box-shadow: 0 6px 5px rgba(204, 204, 204, 0.349019607843137);
    font-size: 16px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      height: 26px;
      width: 3px;
      top: 11px;
      left: -1;
      background: #333333;
    }
    .header{
      height:50px;
    }
    .label {
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .ul {
      padding: 0 27px 20px 27px;
      display: flex;
      flex: 1;
      justify-content: space-between;
      flex-wrap: wrap;
      .li1{
        background-color: #9ad3cd;
      }
      .li2{
        background-color: #b08af1;
      }
      .li3{
        background-color: #ffbc61;
      }
      .li4{
        background-color: #e58c9e;
      }
      .li {
        margin-top: 10px;
        text-align: center;
        h5 {
          font-weight: 600;
          position: relative;
          top: 20px;
          font-size: 18px;
          text-align: center;
          display: inline-block;
          color: #ffffff;
        }
        .detail {
          margin-top: 45px;
          padding-bottom: 20px;
          display: flex;
          flex: 1;
          align-items: center;
          color: #ffffff;
          .left {
            width: 50%;
            label {
              font-size: 39px;
              font-weight: bold;
            }
            span {
              font-size: 18px;
            }
          }
          .right {
            line-height: 1.3;
            width: 50%;
            text-align: left;
            p {
              font-size: 14px;
              color: #ffffff;
              display: flex;
              align-items: center;
              label {
                flex: 1
              }
              position: relative;
              span {
                width: 30px;
                text-align: left;
              }
            }
          }
          .top {
            font-size: 17px;
            color: #4bc36c !important;
          }
          .bottom {
            font-size: 17px;
            font-weight: bold;
            color: #ed5e64 !important;
          }
        }
      }
    }
    .line-chart {
      width:100%;
      padding:0 27px;
    }
  }

  .select-year {
    position: absolute;
    right: 27px;
    top: 11px;
    .el-select {
      width: 90px;
    }
  }
</style>
