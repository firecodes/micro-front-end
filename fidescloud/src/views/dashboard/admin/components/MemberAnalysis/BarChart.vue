<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  import { debounce } from '@/utils'
  import { mapGetters } from 'vuex'
  require('echarts/theme/macarons') // echarts theme
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
        default: '200px'
      },
      pieChartData: {
        type: Array,
        default: []
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
      pieChartData: {
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
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.pieChartData)
      },
      setOptions([yearData, p12mData] = []) {
        var _this = this
        this.chart.setOption({
          // textStyle: {
          //   fontFamily: 'Century Gothic'
          // },
          tooltip: {
            trigger: 'item',
            formatter: (params, ticket, callback) => {
              if (params.name === 'last_year_1') {
                return `${_this.$t('homepage.fc_home_members_3rd_section_title')} <br/>${_this.$t('homepage.fc_home_members_3rd_item2_label')} : ${params.value}`
              } else {
                return `${_this.$t('homepage.fc_home_members_3rd_section_title')} <br/>${_this.$t('homepage.fc_home_members_3rd_item1_label')} : ${params.value}`
              }
            },
            // formatter: '{a} <br/>{b} : {c} ({d}%)',
            position: ['30%', '10%']
          },
          grid: {
            top: '35%',
            right: '65%',
            bottom: '0',
            containLabel: true,
            x: 25,
            y: 45,
            x2: 5,
            y2: 20
          },
          legend: {
            itemHeight: 10,
            itemWidth: 10,
            orient: 'verticla',
            y: '63%',
            x: '48%'
          },
          xAxis: [{
            type: 'category',
            data: [yearData ? yearData.name : '', p12mData ? p12mData.name : ''],
            boundaryGap: ['120%', '20%'],
            axisLabel: {
              color: '#ffffff'
            },
            axisPointer: {
              show: false
            },
            axisTick: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              color: '#ffffff'
            },
            axisPointer: {
              show: false
            },
            axisTick: {
              show: false
            }
          }],
          series: [
            {
              name: yearData ? this.$t(`homepage.${yearData.name}`) : '',
              type: 'bar',
              barWidth: '35%',
              data: ['', yearData ? yearData.value : 0],
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: function(data) {
                    return `${(data.value)}`
                  }
                }
              },
              animationDuration: 2000,
              animationEasing: 'quadraticOut'
            },
            {
              name: p12mData ? this.$t(`homepage.${p12mData.name}`) : '',
              type: 'bar',
              barWidth: '35%',
              data: [p12mData ? p12mData.value : 0],
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: function(data) {
                    return `${(data.value)}`
                  }
                }
              },
              animationDuration: 2000,
              animationEasing: 'cubicInOut'
            }
          ]
        })
      }
    }
  }
</script>
