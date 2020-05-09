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
        const _this = this
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          // textStyle: {
          //   fontFamily: 'Century Gothic'
          // },
          tooltip: {
            trigger: 'item',
            formatter: (params, ticket, callback) => {
              if (_this.type === 'member') {
                return `${params.seriesName} <br/>${_this.$t(`homepage.${params.name}`)} : ${params.value || 0}`
              }
              return `${params.seriesName} <br/>${params.name} : ${(params.value || 0 * 100).toFixed(1)}%`
            },
            // formatter: '{a} <br/>{b} : {c} ({d}%)',
            position: ['30%', '10%']
          },
          legend: {
            itemHeight: 10,
            itemWidth: 10,
            orient: 'vertical',
            y: '62%',
            x: '48%',
            formatter: function(name) {
              // var total = 0
              // var target
              // for (let i = 0, l = data.length; i < l; i++) {
              //   total += data[i].value
              //   if (data[i].name === name) {
              //     target = data[i].value
              //   }
              // }
              // return name + ' : ' + ((target / total) * 100).toFixed(2) + '%'
              // var total = 0
              var target
              for (let i = 0, l = data.length; i < l; i++) {
                if (data[i].name === name) {
                  target = data[i].rate
                }
              }
              if (_this.type === 'member') {
                return _this.$t(`homepage.${name}`) + ' ' + ((target || 0) * 100).toFixed(1) + '%'
              } else {
                return name + ' ' + ((target || 0) * 100).toFixed(1) + '%'
              }
            }
          },
          series: [{
            name: this.name,
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
            data: this.data,
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
