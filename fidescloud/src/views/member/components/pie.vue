<template>
  <div class='drawPieComponent'>
    <div id='drawPie'>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'DrawPie',
  props: {
    colors: {
      type: Array,
      default: () => ['#3398DB']
    },
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.draw('drawPie', this.content.title, this.content.datatype, this.content.datasource)
  },
  methods: {
    draw(ele, title = '', datatype = [], datasource = []) {
      const app = echarts.init(document.getElementById(ele))
      var option = {
        title: {
          text: title,
          x: 'center',
          y: '20',
          itemGap: 20
          // subtext: 'subtext' // 副标题
          // padding: [50, 10] // 控制上下左右padding
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#8EB4FF', '#4E89FE', '#C6DAFF', '#85CDFF', '#0058FF'],
        legend: {
          icon: 'circle',
          type: 'plain',
          orient: 'vertical',
          x: 'right',
          y: '20',
          data: datatype,
          itemWidth: 10,
          itemHeight: 10,
          align: 'left'
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: ['50%', '63%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
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
            data: datasource
          }
        ]
      }
      app.setOption(option)
      window.onresize = function() {
        app.resize()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.drawPieComponent {
  #drawPie {
    width: 100%;
    height: 320px;
    box-shadow: 0 5px 10px rgba(204, 204, 204, 1.0);
    background-color: #fff;
    padding-right: 70px;
  }
}
</style>
