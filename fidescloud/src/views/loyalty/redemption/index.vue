<template>
  <div class="redemption">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tabList" :label="handleGlobalI18n('loyalty', item.label)" :name="item.name" :key="index">
      </el-tab-pane>
      <component :is="tabList[parseInt(activeName)].component"></component>
    </el-tabs>
  </div>
</template>
<script>
  import RedemptionEvent from '../catalogue'
  import RedemptionList from './redemption-list/index'
  import { mapGetters, mapMutations } from 'vuex'
  import { setRedeemComponentId as setComponentSession } from '@/utils/auth'
  export default {
    components: {
      RedemptionEvent,
      RedemptionList
    },
    data() {
      return {
        tabList: [
          { name: '0', label: 'redemption_event', component: 'RedemptionEvent' },
          { name: '1', label: 'redemption_list', component: 'RedemptionList' }
        ],
        activeName: '0'
      }
    },
    computed: {
      ...mapGetters([
        'redeem_component_id'
      ])
    },
    created() {
      this.activeName = this.redeem_component_id
    },
    methods: {
      ...mapMutations({
        setRedeemComponentId: 'SET_REDEEM_COMPONENT_ID'
      }),
      handleClick(tab, event) {
        // console.log(tab, event)
        this.setRedeemComponentId(this.activeName)
        setComponentSession(this.activeName)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .redemption {
    background: #fff;
    margin: 15px 20px;
    padding: 1px 15px 10px 10px;
  }
</style>
