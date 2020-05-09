<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'
  import { mapGetters } from 'vuex'
  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      chartData: {
        type: Object
      }
    },
    data() {
      return {
        chart: null
      }
    },
    computed: {
      ...mapGetters([
        'language'
      ])
    },
    mounted() {
      this.initChart()
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHanlder)
      this.chart.dispose()
      this.chart = null
    },
    watch: {
      chartData: {
        deep: true,
        handler() {
          this.setOptions(this.chartData)
        }
      },
      language() {
        this.setOptions(this.chartData)
      }
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions({ thisYearData, lastYearData } = {}) {
        this.chart.setOption({
          title: {
            top: '10',
            left: 'center',
            text: this.$t('member.fc_member_details_transactions_chart_label'),
            textStyle: {
              color: '#777777',
              size: '18px'
            }
          },
          grid: {
            top: '50',
            left: '20',
            bottom: '20',
            right: '0',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            // formatter: (params, ticket, callback) => {
            //   console.log(params)
            //   return `${params.seriesName} <br/>${_this.handleGlobalI18n('kpi', params.name)} : ${_this.globalData.value.currency_symbol} ${params.value || 0}`
            // },
            // formatter: '{a} <br/>{b} : {c} {${_this.globalData.value.currency_symbol}}({d}%)',
            padding: [5, 10]
          },
          xAxis: [{
            type: 'category',
            data: this.$t('member.fc_member_details_transactions_chart_months_label').split(',')
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [
            {
              name: thisYearData.length > 0 ? this.handleGlobalI18n('kpi', 'this_year') : '',
              type: 'bar',
              barWidth: '20%',
              data: thisYearData
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'top',
              //     formatter: function(data) {
              //       return `${_this.globalData.value.currency_symbol}${(data.value)}`
              //     }
              //   }
              // }
            },
            {
              name: lastYearData.length > 0 ? this.handleGlobalI18n('kpi', 'sale_last_year') : '',
              type: 'bar',
              barWidth: '20%',
              data: lastYearData
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'top',
              //     formatter: function(data) {
              //       return `${_this.globalData.value.currency_symbol}${(data.value)}`
              //     }
              //   }
              // }
            }
          ]
        })
      }
    }
  }
</script>

