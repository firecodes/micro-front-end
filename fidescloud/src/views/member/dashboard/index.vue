<template>
  <div class="dashboardPage">
    <ed-header-title :title="'Member lifecycle'" />
    <life-circle></life-circle>
    <div style="height: 30px;"></div>
    <ed-header-title :title="'Member RFM'" />
    <rfm></rfm>
    <div style="height: 30px;"></div>
    <ed-header-title :title="'Member analysis'" />
    <div class="analysis">
      <div class="analysis-item">
        <div class="box">
          <gender></gender>
        </div>
        <div class="box">
          <draw-shape :content={...age} :colors="age.colors"></draw-shape>
        </div>
        <div class="box">
          <maps></maps>
        </div>
      </div>
      <div class="analysis-item">
        <div class="box tier-box">
          <!-- <tier></tier> -->
          <span>Tier</span>
          <pie-chart :content={...tier}></pie-chart>
        </div>
        <div class="box">
          <draw-shape :content={...basket} :colors="basket.colors"></draw-shape>
        </div>
        <div class="box">
          <draw-shape :content={...item} :colors="item.colors"></draw-shape>
        </div>
      </div>
      <div class="analysis-item">
        <div class="box">
          <goods :content={...skus}></goods>
        </div>
        <div class="box">
          <goods :content={...campaign}></goods>
        </div>
        <div class="box">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LifeCircle from './lifecircle'
import Rfm from '../rfm/rfm'
import Gender from '../components/gender'
import Maps from '../components/map'
import DrawShape from '../components/drawShape'
import Scatter from '../components/scatter'
import Goods from '../components/goods'
import PieChart from '../rfm/PieChart'

export default {
  components: {
    LifeCircle,
    Rfm,
    Gender,
    Maps,
    DrawShape,
    Scatter,
    Goods,
    PieChart
  },
  data() {
    return {
      age: {
        title: 'Age',
        xData: ['< 24', '25-30', '31-35', '36-40', '≥ 41'],
        myXAxisName: 'Age',
        myYAxisName: 'Percentage',
        dataSource: [22, 29, 25, 16, 8],
        colors: ['#4E89FE'],
        extraCssText: 'background: linear-gradient(90deg, rgba(133,205,255,1) 0%, rgba(47,124,255,1) 100%)'
      },
      basket: {
        title: 'Average basket',
        xData: ['0-500', '500-999', '1000-1499', '1500-1999', '2000-2499', '≥ 2500'],
        myXAxisName: 'AB($)',
        myYAxisName: 'Members',
        dataSource: [490, 340, 420, 780, 540, 500],
        colors: ['#85CDFF'],
        extraCssText: 'background: linear-gradient(90deg, rgba(133,205,255,1) 0%, rgba(47,124,255,1) 100%)'
      },
      item: {
        title: 'Average items',
        xData: ['1-3', '4-6', '7-9', '10-12', '13-15', '≥ 15'],
        myXAxisName: 'AI(items)',
        myYAxisName: 'Members',
        dataSource: [450, 370, 320, 550, 710, 680],
        colors: ['#0D61FF'],
        extraCssText: 'background: linear-gradient(270deg,rgba(0,95,255,1) 0%,rgba(74,144,226,1) 100%)'
      },
      skus: {
        title: 'Most purchased SKUs',
        className: 'skus',
        ranks: [
          {
            color: '#0058FF',
            name: 'No.1 Double points'
          },
          {
            color: '#1740AA',
            name: 'No.2 Birthday package'
          },
          {
            color: '#85CDFF',
            name: "No.3 Member's day"
          },
          {
            color: '#C4C4C4',
            name: 'No.4 Invite new etiquette'
          },
          {
            color: '#C4C4C4',
            name: 'No.5 Black friday'
          }
        ]
      },
      campaign: {
        title: 'Most participants campaigns',
        className: 'campaigns',
        ranks: [
          {
            color: '#0058FF',
            name: 'No.1 Double points'
          },
          {
            color: '#1740AA',
            name: 'No.2 Birthday package'
          },
          {
            color: '#85CDFF',
            name: "No.3 Member's day"
          },
          {
            color: '#C4C4C4',
            name: 'No.4 Invite new etiquette'
          },
          {
            color: '#C4C4C4',
            name: 'No.5 Black friday'
          }
        ]
      },
      tier: {
        title: 'Tier',
        datatype: ['< 3 Months', '3-5 Months', '6-8 Months', '9-11 Months', '≥ 12 Months'],
        colors: ['#8EB4FF', '#4E89FE', '#C6DAFF', '#85CDFF', '#0058FF'],
        datasource: [
          { value: 335, name: '< 3 Months' },
          { value: 310, name: '3-5 Months' },
          { value: 234, name: '6-8 Months' },
          { value: 135, name: '9-11 Months' },
          { value: 1548, name: '≥ 12 Months' }
        ],
        name: 'Tier'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboardPage {
  padding: 50px;
  .analysis {
    .analysis-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .box {
        width: 32%;
        height: 320px;
        margin-bottom: 20px;
      }
      .tier-box {
        background-color: #fff;
        text-align: center;
        padding-top: 30px;
        box-shadow:0px 5px 15px -3px rgba(204,204,204,1);
        span {
          color: #04183F;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
