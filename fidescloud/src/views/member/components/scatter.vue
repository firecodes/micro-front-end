<template>
  <div class="chart clearfix">
    <h6>{{content.title}}</h6>
    <div id="goods" class="cont clearfix">
      <div class="right">
        <b>Ranking:</b>
        <ul>
          <li v-for="item in content.ranks" :key="item"><span :style="{'background': item.color}"></span> {{item.name}}</li>
        </ul>
      </div>
      <div class="left">
        <div class="circle cl1">
          <img :src="require('@/assets/images/circle2.png')" alt="" />
          <span>NO.1</span>
        </div>
        <div class="circle cl2">
          <img :src="require('@/assets/images/circle3.png')" alt="" />
          <span>NO.3</span>
        </div>
        <div class="circle cc">
          <img :src="require('@/assets/images/circle4.png')" alt="" />
          <span>NO.2 Birthday</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scatter',
  props: {
    content: {
      type: Object,
      default: () => {
        return {
          title: ''
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .chart{
    float: left;
    width:100%;
    text-align:center;
    margin:0 2% 15px 0;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(204, 204, 204, 1.0);
    box-sizing: border-box;
    h6{
      padding-top: 30px;
      font-size:18px;
      color: #04183F;
      font-weight: bold;
    }
    .cont{
      height: 270px;
      .right{
        float: right;
        margin-top: 68px;
        width: 120px;
        font-size: 12px;
        color: #333;
        text-align: left;
        margin-right: 20px;
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
      .left{
       position: relative;
       height: 270px;
       margin:0 130px  0 30px;
       font-size: 14px;
       // float:left;
       // width:78%;
       .circle{
         position: absolute;
         span{
           display: block;
           position: absolute;
           top: 25%;
           width: 100%;
           margin-top: 20px;
           text-align: center;
           color: #fff;
           font-size: 14px;
           overflow: hidden;
           white-space: nowrap;
           word-break:normal;
           width:auto;
           display:block;
           white-space:pre-wrap;
           word-wrap : break-word ;
           overflow: hidden ;
           padding-left: 30px;
         }
         span:last-child{
           margin-top: 5px;
         }
         img{
           width: 100%;
           font-size: 0;
           vertical-align: bottom;
         }
       }
       .cl1{
         top: 47px;
         left: 0px;
         width: 23.5%;
        //  max-width: 80px;
        //  min-width: 60px;
         width: 100px;
        }
      }
      .cl2{
        bottom: 47px;
        left: 0px;
        width: 21%;
        // max-width: 72px;
        // min-width: 52px;
        width: 90px;
      }
      .cc{
        top: 63px;
        left: 28.6%;
        // width: 47.6%;
        // max-width: 128px;
        // min-width: 128px;
        width: 159px;
        span{
          font-size: 14px;
          top: 30% !important;
        }
      }
      .cr1{
        top: 67px;
        right: 0;
        width: 15.3%;
        max-width: 52px;
        min-width: 42px;
        span{
          top: 10% !important;
        }
      }
      .cr2{
        bottom: 51px;
        right: 8.59%;
        width: 19.4%;
        max-width: 66px;
        min-width: 52px;
        span{
          top: 20% !important;
        }
      }
    }
  }


  @media screen and (min-width: 1980px){
    .chart{
      .cont{
        .left{
          margin: 0 160px 0 30px;
        }
        .right{
          margin-right: 20px;
        }
      }
    }
  }
  @media screen and (max-width: 1600px){
    .chart{
      .cont{
        .left{
          .circle{
            span{
              font-size: 8px;
            }
          }
          .cc{
            top: 80px;
          }
        }
      }
    }
  }
</style>
