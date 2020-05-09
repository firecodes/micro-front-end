<!--loyalty-info-->
<template>
  <div class="loyalty-info">
    <div class="header-top cursor-pointer">
      <back-button />
    </div>
    <el-tabs v-model="type_id" >
      <!--Transaction-->
      <el-tab-pane :label="$t(`member.fc_member_details_loyalty_tab_transaction_label`)" name="0">
        <transaction :member_code="member_code" />
      </el-tab-pane>
      <!--Point-->
      <el-tab-pane :label="$t(`member.fc_member_details_loyalty_tab_point_label`)" name="1" v-if="isBHGLoginUser()">
        <point-b-h-g :member_code="member_code" />
      </el-tab-pane>
      <el-tab-pane :label="$t(`member.fc_member_details_loyalty_tab_point_label`)" name="1" v-else-if="isFloorXpertUser()">
        <point-floor-xpert :member_code="member_code" />
      </el-tab-pane>
      <el-tab-pane :label="$t(`member.fc_member_details_loyalty_tab_point_label`)" name="1" v-else>
        <points :member_code="member_code" />
      </el-tab-pane>
      <!--Tier-->
      <el-tab-pane :label="$t(`member.fc_member_details_loyalty_tab_tier_label`)" name="2">
        <tier :member_code="member_code" />
      </el-tab-pane>
      <!--Coupon-->
      <el-tab-pane :label="$t(`member.fc_member_details_loyalty_tab_coupon_label`)" name="3">
        <coupon :member_code="member_code" />
      </el-tab-pane>
      <!--Gift-->
      <el-tab-pane :label="$t(`member.fc_member_details_loyalty_tab_gift_label`)" name="4">
        <gift :member_code="member_code" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Transaction from './transaction/index'
import Coupon from './coupon/index'
import Gift from './gift/index'
import Redemption from './redemption/index'
import Points from './points/index'
import PointBHG from './points-bhg/index'
import Tier from './tier/index'
import { view404 } from '@/api/api'
import BackButton from '@/components/BackButton'
import { isBHGLoginUser, isFloorXpertUser } from '@/utils'
import PointFloorXpert from './FloorXpertPoints/index'
export default {
  components: {
    PointFloorXpert,
    Transaction,
    Coupon,
    Redemption,
    Points,
    Tier,
    BackButton,
    Gift,
    PointBHG
  },
  data() {
    return {
      type_id: '0',
      member_code: ''
    }
  },
  created() {
    this.member_code = this.$route.query.member_code
    if (this.member_code.length <= 0) {
      this.$router.push(view404)
    }
  },
  methods: {
    isBHGLoginUser,
    isFloorXpertUser
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-tabs__content{
    overflow: scroll;
  }
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }
  .loyalty-info {

    margin: 15px 20px;
    .header-top {
      padding:0!important;
      height: 30px !important;
    }
    .el-tabs {
      margin-top: 20px;
      background: #fff;
      padding: 0 20px;
      padding-bottom: 20px;
    }
  }
</style>
