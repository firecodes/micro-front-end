<template>
  <div class='drawStatisticalComponent'>
    <div id='drawStatistical' ref="drawStatistical"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'drawShape',
  props: {
    colors: {
      type: Array,
      default: () => ['#3398DB']
    },
    content: {
      type: Object,
      default: () => {
        return {
          xData: [],
          interval: 0,
          extraCssText: ''
        }
      }
    }
  },
  mounted() {
    const app = echarts.init(this.$refs.drawStatistical)
    var option = {
      color: this.colors,
      title: {
        text: this.content.title,
        x: 'center',
        y: '21'
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        formatter: function(params) {
          return params[0].value
        },
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow',
        },
        position: function(point, params, dom, rect, size) {
          // 固定在顶部
          return [point[0], '6%']
        },
        padding: [5, 15, 5, 15],
        testStyle: {
          color: '#fff',
          fontSize: 12
        },
        extraCssText: this.content.extraCssText || 'background: linear-gradient(90deg, rgba(133,205,255,1) 0%, rgba(47,124,255,1) 100%)'
      },
      grid: {
        left: '3%',
        right: '14%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.content.xData,
          tooltip: {
            show: false
          },
          axisLabel: {
            color: '#666',
            interval: this.content.interval // 设置坐标轴上的文字全部显示，默认当内容过多时部分间隔显示
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          name: this.content.myXAxisName,
          nameTextStyle: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: this.content.myYAxisName,
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: ['#f1f1f1']
            }
          },
          axisTick: { // 刻度
            show: false
          },
          axisLine: { // y轴
            show: false
          }
        }
      ],
      series: [
        {
          name: this.hoverName,
          type: 'bar',
          barWidth: '35%',
          data: this.content.dataSource
          // itemStyle: {
          //   normal: {
          //     label: {
          //       show: true,
          //       position: 'top'
          //     }
          //   }
          // }
        }
      ]
    }
    window.onresize = () => {
      app.resize()
    }
    app.setOption(option)
  }
}
</script>

<style lang='scss' scoped>
.drawStatisticalComponent {
  #drawStatistical {
    width: 100%;
    height: 320px;
    box-shadow: 0 5px 10px rgba(204, 204, 204, 1.0);
    background-color: #fff;
  }
}
</style>
