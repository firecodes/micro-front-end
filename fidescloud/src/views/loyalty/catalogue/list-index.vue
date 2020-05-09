<template>
  <div class="catalogue-list">
    <ul class="tab-ul">
      <li v-for="item in list" :key="item.name" :class="{'is-active' : active_id === item.value}" @click="active_id = item.value">{{$t(`loyalty.${item.name}`)}}</li>
    </ul>
    <component :is="tabList[active_id].component"></component>
  </div>
</template>
<script>
  import GiftList from './gift'
  import CouponList from './coupon'
  export default {
    components: {
      GiftList,
      CouponList
    },
    data() {
      return {
        list: [{ name: 'fc_redemption_coupon_tab_label', value: 0 }, { name: 'fc_redemption_gift_tab_label', value: 1 }],
        tabList: [{ name: '0', label: 'Coupon', component: 'CouponList' }, { name: '1', label: 'Gift', component: 'GiftList' }],
        active_id: 0
      }
    },
    watch: {
      active_id() {
        sessionStorage.setItem('catalogue_li_value', this.active_id)
      }
    },
    destroyed() {
      // sessionStorage.setItem('catalogue_li_value', 0)
    },
    created() {
      this.active_id = parseInt(sessionStorage.getItem('catalogue_li_value')) || 0
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .catalogue-list{
    .tab-ul{
      margin-top: 21px;
      width: 100%;
      height: 68px;
      background: rgba(255,255,255,1);
      position: relative;
      &:after{
        content: '';
        position: absolute;
        bottom: 0;
        left:50px;
        right: 0;
        height: 1px;
        width: 100%;
        background:rgba(230,230,230,1);
      }
      display: flex;
      align-items: center;
      li{
        font-family: Helvetica-medium-1;
        cursor: pointer;
        width: 100px;
        font-size:20px;
        font-weight:500;
        color:rgba(153,153,153,1);
        height: 68px;
        line-height: 68px;
        text-align: center;
        &:first-child{
          margin-left: 100px;
        }
        &:last-child{
          margin-left: 21px;
        }
      }
      .is-active{
        position: relative;
        color: $new-primary;
        &:after{
          content: '';
          position: absolute;
          width: 100%;
          height:4px;
          left: 0;
          bottom: 0;
          background: $new-primary;
        }
      }
    }
  }
</style>
