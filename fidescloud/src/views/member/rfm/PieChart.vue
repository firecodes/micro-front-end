<template>
  <div class="chart" :style="{height:height,width:width}"></div>
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
      name: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      content: {
        type: Object,
        default: () => {
          return {
            datatype: [],
            datasource: [],
            name: ''
          }
        }
      }
    },
    data() {
      return {
        chart: null,
        data: []
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
    created() {
      // this.initChart()
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          tooltip: {
            show: false,
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          color: ['#8EB4FF', '#4E89FE', '#C6DAFF', '#85CDFF', '#0058FF'],
          legend: {
            icon: 'circle',
            type: 'plain',
            orient: 'vertical',
            left: '65%',
            top: '20%',
            data: this.content.datatype,
            itemWidth: 10,
            itemHeight: 10,
            align: 'left'
          },
          series: [
            {
              name: this.content.name || '',
              type: 'pie',
              radius: ['50%', '75%'],
              center: ['35%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  formatter: function(params) {
                    return params.percent + '%' + '\n' + params.name
                  },
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.content.datasource
            }
          ]
        })
      }
    }
  }
</script>
