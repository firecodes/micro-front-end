<template>
  <div :style="{height:height,width:width}"></div>
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
      autoResize: {
        type: Boolean,
        default: true
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
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
      }

      // 监听侧边栏的变化
      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
      }

      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

      this.chart.dispose()
      this.chart = null
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      },
      language() {
        this.setOptions(this.chartData)
      }
    },
    methods: {
      setOptions({ indicator, value } = {}) {
        var _this = this
        this.chart.setOption({
          title: {
            top: '10',
            left: 'center',
            text: _this.$t('member.fc_member_details_transactions_channel_label'),
            textStyle: {
              color: '#777777',
              size: '18px'
            }
          },
          xAxis: [{
            type: 'category',
            color: '#59588D',
            data: indicator.length > 0 ? indicator : ['online', 'pos', 'wechat', 'ecommerce'],
            axisPointer: {
              type: 'line'
            },
            axisTick: {
              show: true
            }
          }],
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
            padding: [5, 10]
          },
          yAxis: [{
            axisTick: {
              show: true
            },
            axisLine: {
              show: true
            }
          }],
          series: [{
            type: 'bar',
            data: value,
            barWidth: '20px'
          }]
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      }
    }
  }
</script>
