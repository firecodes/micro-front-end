<template>
  <div class="lifecircleComponent">
    <div id='lifecircle'></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted() {
    const myChart = echarts.init(document.getElementById('lifecircle'))
    // var symbolSize = 2
    var data = [[8000, 21300], [2550, 44000], [5600.5, 20000], [10000, 30000], [18222.1, 40040]]
    var types = ['Prospect buyers', 'New buyers', 'Loyal members', 'Lapsed members', 'Sleeping members']
    var option = {
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(34, 118, 242, 1.0)',
        formatter: function(params) {
          var data = params.data || [0, 0]
          // return data[0].toFixed(2) + ', ' + data[1].toFixed(2)
          return data[1].toFixed(2)
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        // data: [1,2,3,4,5],
        type: 'category',
        boundaryGap: true,
        axisLine: { onZero: false },
        splitLine: {
          show: false
        },
        axisTick: {
          show: true, // 显示刻度
          inside: true,
          alignWithLabel: true
        },
        axisLabel: {
          formatter: function(value, index) {
            return types[index]
          }
        }
      },
      yAxis: {
        type: 'value',
        show: true,
        axisLine: {
          onZero: false,
          show: false
        },
        splitLine: {
          lineStyle: {
            type: 'dotted',
            color: ['#f1f1f1']
          }
        },
        splitArea: {
          show: false
        },
        axisTick: { // 刻度
          show: false
        }
      },
      series: [
        {
          id: 'a',
          type: 'line',
          lineStyle: {
            normal: {
              width: 3,
              color: '#005FFF',
              // shadowColor: 'rgba(0, 88, 255, 0.6)',
              shadowColor: 'rgba(198, 218, 255, 1)',
              shadowBlur: 10,
              shadowOffsetY: 20
            }
          },
          // 设置折线点为实心点
          // symbol: 'circle',
          smooth: true,
          color: '#005FFF',
          // 设置折线点的大小
          symbolSize: 25,
          // symbolSize: 25,
          symbol: 'image://' + require('@/assets/images/Oval.png'),
          showSymbol: true,
          data: data,
          animationDuration: 1100,
          animationEasing: 'cubicInOut',
          itemStyle: {
            // 静止时
            normal: {
              opacity: 0
            },
            emphasis: {
              opacity: 1
            }
          },
          areaStyle: {
            origin: 'start',
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0, // x2为0，y2为1时表示从上到下
              y2: 1, // x2为1，y2为0时表示从左到右
              colorStops: [{
                offset: 0, color: '#CDDFFF' // 0% 处的颜色
              }, {
                offset: 1, color: '#EDF4FF' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            normal: {
              // rgba(207, 225, 255, 1)
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(220, 232, 255, 1)' },
                  { offset: 0.5, color: 'rgba(241, 246, 255, 1)' },
                  { offset: 1, color: 'rgba(250, 252, 255, 1)' }
                  // { offset: 0, color: "rgba(58, 167, 255,0.3)" },
                  // { offset: 0.5, color: "rgba(58, 167, 255,0.2)" },
                  // { offset: 1, color: "rgba(58, 167, 255,0)" }
                ]
              )
            }
            // shadowColor: '#CDDFFF',
            // shadowOffsetX: 0,
            // shadowOffsetY: 20,
            // opacity: 0.3
          }
        }
      ]
    }
    var zr = myChart.getZr()
    zr.on('click', function(params) {
      var pointInPixel = [params.offsetX, params.offsetY]
      var pointInGrid = myChart.convertFromPixel('grid', pointInPixel)
      if (myChart.containPixel('grid', pointInPixel)) {
        data.push(pointInGrid)
        myChart.setOption({
          series: [
            {
              id: 'a',
              data: data
            }
          ]
        })
      }
    })
    zr.on('mousemove', function(params) {
      var pointInPixel = [params.offsetX, params.offsetY]
      zr.setCursorStyle(
        myChart.containPixel('grid', pointInPixel) ? 'copy' : 'default'
      )
    })
    myChart.setOption(option)

    window.onresize = function() {
      myChart.resize()
    }
  }
}
</script>

<style lang='scss' scoped>
.lifecircleComponent {
  #lifecircle {
    width: 100%;
    height: 380px;
    box-shadow:0px 5px 15px -3px rgba(204,204,204,1);
    background-color: #fff;
    padding-bottom: 53px;
  }
}
</style>
