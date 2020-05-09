<template>
  <div class="chart clearfix">
    <h6>Territory</h6>
    <div class="cont">
      <div id="map">
      </div>
      <div class="right">
        <b>Ranking:</b>
        <ul>
          <li><span :style="{'background': bg1}"></span> 广州：60%</li>
          <li><span :style="{'background': bg2}"></span> 上海：20%</li>
          <li><span :style="{'background': bg3}"></span> 深圳：10%</li>
          <li><span :style="{'background': bg4}"></span> 北京：5%</li>
          <li><span :style="{'background': bg5}"></span> 天津：5%</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts/map/js/china.js'
  import 'echarts/map/js/world.js'

  export default {
    name: 'Maps',
    data() {
      return {
        bg1: '#0058FF',
        bg2: '#4E89FE',
        bg3: '#8EB4FF',
        bg4: '#85CDFF',
        bg5: '#C4C4C4'
      }
    },
    mounted() {
      this.getMapChart()
    },
    methods: {
      getMapChart() { // 地图分布
        const mydata = [
          { name: '北京', value: Math.round(Math.random() * 1000) },
          { name: '天津', value: Math.round(Math.random() * 1000) },
          { name: '上海', value: Math.round(Math.random() * 1000) },
          { name: '重庆', value: Math.round(Math.random() * 1000) },
          { name: '河北', value: Math.round(Math.random() * 1000) },
          { name: '河南', value: Math.round(Math.random() * 1000) },
          { name: '云南', value: Math.round(Math.random() * 1000) },
          { name: '辽宁', value: Math.round(Math.random() * 1000) },
          { name: '黑龙江', value: Math.round(Math.random() * 1000) },
          { name: '湖南', value: Math.round(Math.random() * 1000) },
          { name: '安徽', value: Math.round(Math.random() * 1000) },
          { name: '山东', value: Math.round(Math.random() * 1000) },
          { name: '新疆', value: Math.round(Math.random() * 1000) },
          { name: '江苏', value: Math.round(Math.random() * 1000) },
          { name: '浙江', value: Math.round(Math.random() * 1000) },
          { name: '江西', value: Math.round(Math.random() * 1000) },
          { name: '湖北', value: Math.round(Math.random() * 1000) },
          { name: '广西', value: Math.round(Math.random() * 1000) },
          { name: '甘肃', value: Math.round(Math.random() * 1000) },
          { name: '山西', value: Math.round(Math.random() * 1000) },
          { name: '内蒙古', value: Math.round(Math.random() * 1000) },
          { name: '陕西', value: Math.round(Math.random() * 1000) },
          { name: '吉林', value: Math.round(Math.random() * 1000) },
          { name: '福建', value: Math.round(Math.random() * 1000) },
          { name: '贵州', value: Math.round(Math.random() * 1000) },
          { name: '广东', value: Math.round(Math.random() * 1000) },
          { name: '青海', value: Math.round(Math.random() * 1000) },
          { name: '西藏', value: Math.round(Math.random() * 1000) },
          { name: '四川', value: Math.round(Math.random() * 1000) },
          { name: '宁夏', value: Math.round(Math.random() * 1000) },
          { name: '海南', value: Math.round(Math.random() * 1000) },
          { name: '台湾', value: Math.round(Math.random() * 1000) },
          { name: '香港', value: Math.round(Math.random() * 1000) },
          { name: '澳门', value: Math.round(Math.random() * 1000) }
        ]

        const mapOption = {
          layoutCenter: ['37%', '50%'],
          layoutSize: 230,
          // center: [117.98561551896913, 31.205000490896193],
          // zoom: 1,
          visualMap: {// 颜色轴，可以根据数据点的值大小，展示不同的颜色，或用来展示地图块的不同颜色
            show: false,
            min: 0,
            max: 1000,
            realtime: true, // 拖拽时，是否实时更新
            calculable: false, // 是否显示拖拽用的手柄
            inverse: true,
            inRange: {
              color: ['#2EC7C9', '#2777FF', '#279BED']
            },
            textStyle: {
              color: '#fff'
            }
          },
          geo: {// 配置地图参数
            map: 'singapore',
            zoom: 1, // 默认显示级别
            itemStyle: {
              normal: {
                areaColor: '#058bd2',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#1e67b2'
              }
            }
          },
          series: [
            {// 根据数据展示点，并显示为波纹效果
              name: 'iphone',
              type: 'map',
              // mapType: 'china',
              map: 'china',
              roam: false,
              label: {
                normal: {
                  show: false // 是否显示省份
                },
                emphasis: {
                  show: true
                }
              },
              data: mydata
            }
          ]
        }
        var myChart = echarts.init(document.getElementById('map'))
        myChart.setOption(mapOption)
      }

    }
  }

</script>

<style lang="scss" scoped>
  .chart{
    float: left;
    width:100%;
    height: 320px;
    background-color: #fff;
    text-align:center;
    margin:0 2% 15px 0;
    box-shadow: 0 5px 10px rgba(204, 204, 204, 1.0);
    h6{
      line-height:40px;
      font-size:16px;
      color: #333;
      font-weight: bold;
      padding-top: 16px;
    }
    .cont{
      position: relative;
      #map{
        height: 320px;
      }
      .circle-box{
       position: relative;
       .circle{
         position: absolute;
         span{
           display: block;
         }
       }
      }
      .right{
        position: absolute;
        right: 20px;
        top: 112px;
        z-index: 10000000;
        float: right;
        font-size: 12px;
        color: #333;
        text-align: left;
        b{
          display: block;
          margin-bottom: 19px;
          font-size: 14px;
          color: #333;
          font-weight: bold;
        }
        ul{
          li{
            margin-top: 8px;
            span {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
</style>
