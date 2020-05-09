<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  import { debounce, formatMonty2 } from '@/utils'
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
        default: '300px'
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
          // textStyle: {
          //   fontFamily: 'Century Gothic'
          // },
          title: {
            top: '10',
            left: 'center',
            text: '活动收益',
            textStyle: {
              color: '#777777',
              size: '18px'
            }
          },
          xAxis: {
            data: this.handleGlobalI18n('kpi', 'data_month'),
            boundaryGap: true,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#000000'
            },
            axisLine: {
              lineStyle: {
                color: '#333'
              }
            }
          },
          grid: {
            left: 5,
            right: 10,
            bottom: 50,
            top: 50,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            nameTextStyle: {
              color: '#000000'
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: function(name) {
                return formatMonty2(name, 0)
              },
              color: '#000000'
            },
            // splitNumber: '8', // 划分的个数
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: ['#aaa', '#ddd']
              }
            },
            splitArea: {
              show: false
            }
          },
          legend: {
            itemHeight: 4,
            orient: 'horizontal',
            align: 'auto',
            bottom: '20'
          },
          series: [
            {
              name: thisYearData.length > 0 ? this.handleGlobalI18n('kpi', 'this_year') : '',
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#FF005A',
                  lineStyle: {
                    color: '#FF005A',
                    width: 2
                  }
                }
              },
              smooth: false,
              data: thisYearData,
              animationDuration: 2100,
              animationEasing: 'cubicInOut'
            },
            {
              name: lastYearData.length > 0 ? this.handleGlobalI18n('kpi', 'sale_last_year') : '',
              smooth: false,
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#3888fa',
                  lineStyle: {
                    color: '#3888fa',
                    width: 2
                  }
                  // areaStyle: {
                  //   color: '#f3f8ff'
                  // }
                }
              },
              data: lastYearData,
              animationDuration: 2100,
              animationEasing: 'quadraticOut'
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
