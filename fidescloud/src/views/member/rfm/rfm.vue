<template>
  <div class="rfm">
    <ul class="list">
      <li>
        <p>Recency</p>
        <piechart :content="recency"/>
      </li>
      <li class="li2">
        <p>Frequency</p>
        <piechart :content="frequency"/>
      </li>
      <li>
        <p>Monetary</p>
        <piechart :content="monetary"/>
      </li>
    </ul>
  </div>
</template>
<script>
  import Piechart from './PieChart'
  export default {
    components: {
      Piechart
    },
    data() {
      return {
        type: '全部会员',
        recency: {
          datatype: ['< 3 Months', '3-5 Months', '6-8 Months', '9-11 Months', '≥ 12 Months'],
          datasource: [
            { value: 335, name: '< 3 Months' },
            { value: 310, name: '3-5 Months' },
            { value: 234, name: '6-8 Months' },
            { value: 135, name: '9-11 Months' },
            { value: 1548, name: '≥ 12 Months' }
          ],
          name: 'Recency'
        },
        frequency: {
          datatype: ['F=1', 'F=2', 'F=3', 'F=4', 'F=5'],
          datasource: [
            { value: 335, name: 'F=1' },
            { value: 310, name: 'F=2' },
            { value: 234, name: 'F=3' },
            { value: 135, name: 'F=4' },
            { value: 1548, name: 'F=5' }
          ],
          name: 'Frequency'
        },
        monetary: {
          datatype: ['< 50  USD', '50-100 USD', '100-250 USD', '250-500 USD', '≥500 USD'],
          datasource: [
            { value: 335, name: '< 50  USD' },
            { value: 310, name: '50-100 USD' },
            { value: 234, name: '100-250 USD' },
            { value: 135, name: '250-500 USD' },
            { value: 1548, name: '≥500 USD' }
          ],
          name: 'Monetary'
        }
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  $titleColor: rgba(51,51,51,1);
  .rfm{
    padding: 18px 20px 25px 0;
    background:rgba(255,255,255,1);
    box-shadow:0px 5px 15px -3px rgba(204,204,204,1);
  }
  .list{
    margin-top: 25px;
    display: flex;
    flex: 1;
    li{
      text-align: center;
      flex: 0 0 33.3%;
      p{
        font-size:20px;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:20px;
        margin-bottom: 5px;
      }
    }
    .li2{
      border-left: 1px dotted #ccc;
      border-right: 1px dotted #ccc;
    }
  }
</style>
