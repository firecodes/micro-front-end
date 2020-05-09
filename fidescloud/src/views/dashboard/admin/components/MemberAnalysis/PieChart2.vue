<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import { mapGetters } from 'vuex'
  import { debounce } from '@/utils'

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
        default: '220px'
      },
      data: {
        type: Array,
        default: []
      },
      name: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
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
    methods: {
      initChart() {
        const data = this.data
        var _this = this
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          // textStyle: {
          //   fontFamily: 'Century Gothic'
          // },
          tooltip: {
            trigger: 'item',
            formatter: (params, ticket, callback) => {
              return `${_this.handleGlobalI18n('kpi', params.name)} : ${params.value}%`
            },
            position: ['30%', '10%']
          },
          series: [{
            type: 'pie',
            radius: ['27%', '42%'],
            center: ['25%', '57.5%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                textStyle: {
                  fontSize: '12',
                  fontWeight: ''
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data,
            animationDuration: 3000,
            animationEasing: 'cubicInOut'
          }]
        })
      }
    },
    watch: {
      data() {
        this.initChart()
      },
      language() {
        this.initChart()
      }
    }
  }
</script>
