<template>
  <div class="ruima-admin-container">
    <ul>
      <div>
        <li>会员: 注册成为会员的顾客 (留有手机号码)</li>
        <li>会员销售收入:  会员的实际销售总收入</li>
        <li>活跃会员: 6个月内产生交易的会员</li>
        <li>沉睡会员: 6-12个月内产生交易的会员</li>
        <li>会员的交易频次: 会员的交易笔数/ 交易会员的人数</li>
        <li>会员的年贡献金额：会员销售总金额/ 交易会员的人数</li>
        <li>平均客单价ATV: 总销售收入 / 总交易笔数</li>
        <li>连带率UPT:  交易商品的数量 / 交易的笔数</li>
        <li>折扣率: 实际销售总收入/ 吊卡价格的总收入</li>
        <li>* 同人同天的交易笔数不做合并</li>
      </div>
    </ul>
  </div>
</template>

<script>
  export default {
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .ruima-admin-container {
    padding: 25px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    ul{
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      box-shadow: 0 6px 5px rgba(204, 204, 204, 0.349019607843137);
      font-family: HelveticaNeue1;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      div{
        text-align: left;
      }
      li{
        width: 100%;
        line-height: 30px;
      }

    }
  }
</style>
