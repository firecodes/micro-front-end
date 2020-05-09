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
        default: '80%'
      },
      height: {
        type: String,
        default: '290px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object
      }
    },
    computed: {
      ...mapGetters([
        'language'
      ])
    },
    data() {
      return {
        chart: null
      }
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
          // textStyle: {
          //   fontFamily: 'Century Gothic'
          // },
          title: {
            top: '10',
            left: 'center',
            text: _this.handleGlobalI18n('member', 'transaction_channel'),
            textStyle: {
              color: '#777777',
              size: '18px'
            }
          },
          tooltip: {},
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#2777FF',
                borderRadius: 3,
                padding: [5, 5]
              }
            },
            indicator: indicator,
            center: ['50%', '60%'],
            radius: 80
          },
          series: [{
            type: 'radar',
            itemStyle: { normal: { areaStyle: { type: 'default' }}},
            data: [
              {
                value: value,
                name: 'Transaction'
              }
            ]
          }]
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        // this.setOptions(this.chartData)
      }
    }
  }
</script>
