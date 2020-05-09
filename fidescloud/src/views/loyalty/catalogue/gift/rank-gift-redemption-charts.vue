<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  import { debounce } from '@/utils'
  require('echarts/theme/macarons') // echarts theme
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
        default: '100%'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object
      },
      sale_blocks_title: {
        type: String
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
      if (sidebarElm !== undefined) {
        sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)
      }

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
        this.initChart()
      }
    },
    methods: {
      setOptions({ thisYearData, lastYearData } = {}) {
        this.chart.setOption({
          xAxis: {
            data: ['Facial cleaner', 'Moisturizer', 'Spray fragrance', 'Refreshing moisturizer', 'Exfoliating face wash', 'Age-defying serum', 'Vitamin C booster', 'Extractor mask', 'Eye cream', 'Night moisturizer'],
            axisLabel: {
              color: '#666666',
              fontSize: '14px',
              rotate: 20
            },
            axisTick: {
              alignWithLabel: true
            }
          },
          legend: {
            show: false
          },
          grid: {
            left: 45,
            right: 45,
            bottom: 45,
            top: 45,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          yAxis: {
            nameTextStyle: {
              color: '#000000'
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#000000'
            },
            // splitNumber: '8', // 划分的个数
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#aaa'
              }
            },
            splitArea: {
              show: false
            }
          },
          series: [
            {
              name: 'aaa',
              type: 'bar',
              barWidth: '30px',
              itemStyle: {
                color: '#5984FF',
                barBorderRadius: [4, 4, 0, 0]
              },
              smooth: false,
              data: [3000, 2700, 2550, 2500, 1800, 1600, 1500, 1400, 1200, 800],
              animationDuration: 1100,
              animationEasing: 'cubicInOut'
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
