<template>
  <div class="chart clearfix">
    <h6>{{content.title}}</h6>
    <div id="goods" class="cont clearfix">
      <div class="right">
        <b>Ranking:</b>
        <ul>
          <li v-for="(item, index) in content.ranks" :key="index"><span :style="{'background': item.color}"></span> {{item.name}}</li>
        </ul>
      </div>
      <div class="left" :class="content.className">
        <div class="no1">
          <el-tooltip class="item" effect="dark" :content="content.ranks[0].name" placement="top-start">
            <span>{{ filter_no1(content.ranks[0].name, content.className) }}</span>
          </el-tooltip>
        </div>
        <div class="no2">
          <el-tooltip class="item" effect="dark" :content="content.ranks[1].name" placement="top-start">
            <span>{{ filter_no2(content.ranks[1].name, content.className) }}</span>
          </el-tooltip>
        </div>
        <div class="no3">
          <el-tooltip class="item" effect="dark" :content="content.ranks[2].name" placement="top-start">
            <span>{{ filter_no3(content.ranks[2].name, content.className) }}</span>
          </el-tooltip>
        </div>
        <!-- <div class="circle cr1"><img src="./img/circle4.png" alt="" /><span>80人</span><span>倩碧...</span></div> -->
        <!-- <div class="circle cr2"><img src="./img/circle5.png" alt="" /><span>100人购买</span><span>兰蔻粉水</span></div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {
        return {
          title: ''
        }
      }
    }
  },
  methods: {
    filter_no1(val, name) {
      if (name === 'skus') {
        return this.filter_name(...arguments, 13, 11)
      } else {
        return this.filter_name(...arguments, 20, 17)
      }
    },
    filter_no2(val, name) {
      return this.filter_name(...arguments, 13, 9)
    },
    filter_no3(val, name) {
      if (name === 'skus') {
        return this.filter_name(...arguments, 20, 17)
      } else {
        return this.filter_name(...arguments, 13, 11)
      }
    },
    filter_name(val, name, limit, splitLen) {
      let tmp = ''
      if (name === 'skus') {
        if (val && val.length > limit) {
          tmp = val.substring(0, splitLen).concat('...')
        } else {
          tmp = val
        }
      } else {
        if (val && val.length > limit) {
          tmp = val.substring(0, splitLen).concat('...')
        } else {
          tmp = val
        }
      }
      return tmp
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .chart{
    float: left;
    width: 100%;
    text-align:center;
    margin:0 2% 15px 0;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(204, 204, 204, 1.0);
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
      .left.skus, .left.campaigns {
        position: relative;
        height: 270px;
        margin:0 130px 0 30px;
        .no1, .no2, .no3 {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-radius: 50%;
          background-position: center !important;
          background-repeat: no-repeat !important;
          position: absolute;
       }
      }

      .left.skus{
       .no1 {
         top: 5%;
         width:86px;
          height:86px;
          background:rgba(23,64,170,1);
          box-shadow:0px 10px 18px -3px rgba(157,182,230,1);
       }
       .no2 {
         left: 55%;
         top: 10%;
         width:60px;
          height:60px;
          background:rgba(134,211,242,1);
          box-shadow:0px 10px 18px -3px rgba(134,211,242,1);
       }
       .no3 {
         bottom: 8%;
         left: 15%;
         width:120px;
          height:120px;
          background:rgba(0,95,255,1);
          box-shadow:0px 10px 18px -3px rgba(183,210,255,1);
       }
      }
      .left.campaigns {
        .no1 {
          left: 20%;
          top: 5%;
          width:120px;
          height:120px;
          background:rgba(23,64,170,1);
          box-shadow:0px 10px 18px -3px rgba(179,198,231,1);
        }
        .no2 {
          top: 50%;
          width:60px;
          height:60px;
          background:rgba(78,137,254,1);
          box-shadow:0px 10px 18px -3px rgba(132,173,255,1);
        }
        .no3 {
          bottom: 8%;
          left: 45%;
          width:86px;
          height:86px;
          background:rgba(134,211,242,1);
          box-shadow:0px 10px 18px -3px rgba(153,226,255,1);
        }
      }
      // new style
      @media screen and (max-width: 1400px) {
        .no1, .no2, .no3 {
          // background-repeat: no-repeat !important;
          // background-size: 100% !important;
          span {
            font-size:14px;
            font-weight:600;
            color:rgba(255,255,255,1);
          }
        }
        // .no1 {
        //   height: 70px;
        // }
        // .no2 {
        //   width: 105px;
        //   height: 105px;
        // }
        // .no3 {
        //   width: 150px;
        //   height: 150px;
        // }
      }
      @media screen and (min-width: 1400px) {
        .no1, .no2, .no3 {
          // background-repeat: no-repeat !important;
          // background-size: 100% !important;
          span {
            font-size:16px;
            font-weight:600;
            color:rgba(255,255,255,1);
          }
        }
        // .no1 {
        //   width: 90px;
        //   height: 90px;
        // }
        // .no2 {
        //   width: 125px;
        //   height: 125px;
        // }
        // .no3 {
        //   width: 150px;
        //   height: 150px;
        // }
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
</style>
