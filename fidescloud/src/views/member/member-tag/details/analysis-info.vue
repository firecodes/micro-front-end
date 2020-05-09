<template>
  <div class="analysisInfoComponent">
    <div class="gender-box">
      <gender></gender>
    </div>
    <div class="age-box">
      <draw-shape :content={...age} :colors="age.colors"></draw-shape>
    </div>
    <div class="territory-box">
      <maps></maps>
    </div>
    <div class="tier-box">
      <span>Tier</span>
      <draw-pie :content={...tier}></draw-pie>
    </div>
    <div class="frequency-box">
      <draw-shape :content={...frequency} :colors="frequency.colors"></draw-shape>
    </div>
    <div class="purchase-box">
      <draw-shape :content={...purchase} :colors="purchase.colors"></draw-shape>
    </div>
    <div class="skus-box">
      <scatter :content={...skus}></scatter>
    </div>
    <div class="campaigns-box">
      <scatter :content={...campaign}></scatter>
    </div>
    <div class="average-box">
      <draw-shape :content={...average} :colors="average.colors"></draw-shape>
    </div>
    <div class="averages-box">
      <draw-shape :content={...averageItems} :colors="averageItems.colors"></draw-shape>
    </div>
  </div>
</template>

<script>
import Gender from '../../components/gender'
import DrawShape from '../../components/drawShape'
import Maps from '../../components/map'
import DrawPie from '../../rfm/PieChart'
import Scatter from '../../components/goods'
export default {
  components: {
    Gender,
    DrawShape,
    Maps,
    DrawPie,
    Scatter
  },
  data() {
    return {
      age: {
        title: 'Age',
        xData: ['< 24', '25-30', '31-35', '36-40', '≥ 41'],
        myXAxisName: 'Age',
        myYAxisName: 'Percentage',
        dataSource: [22, 29, 25, 16, 8],
        colors: ['#4E89FE']
      },
      frequency: {
        title: 'Purchase frenquency',
        xData: ['0', '5', '10', '15', '20', '25'],
        myXAxisName: 'Times',
        myYAxisName: 'Members',
        dataSource: [150, 520, 710, 750, 488, 415],
        colors: ['#1740AA']
      },
      purchase: {
        title: 'Purchase interval',
        xData: ['0', '30', '60', '90', '120', '150'],
        myXAxisName: 'Days',
        myYAxisName: 'Members',
        dataSource: [320, 380, 488, 710, 620, 495],
        colors: ['#4E89FE']
      },
      average: {
        title: 'Average basket',
        xData: ['0-500', '500-999', '1000-1499', '1500-1999', '2000-2499', '≥ 2500'],
        myXAxisName: 'AB ($)',
        myYAxisName: 'Members',
        dataSource: [495, 360, 428, 780, 520, 500],
        colors: ['#85CDFF']
      },
      averageItems: {
        title: 'Average items',
        xData: ['1-3', '4-6', '7-9', '10-12', '13-15', '≥ 15'],
        myXAxisName: 'AI(items)',
        myYAxisName: 'Members',
        dataSource: [450, 370, 310, 550, 710, 660],
        colors: ['#0D61FF']
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
        ]
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.analysisInfoComponent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .gender-box, .age-box, .territory-box, .tier-box, .skus-box, .campaigns-box, .purchase-box, .average-box
  , .averages-box, .frequency-box {
    width: 500px;
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
</style>
