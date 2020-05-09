<template>
  <div class="point-setting">
    <section class="top">
      <div class="image">
        <svg-icon icon-class="points_update" style="color: #ffffff;" />
      </div>
      <div class="info">
        <h1>{{$t('loyalty.fc_loyalty_point_title_label')}}</h1>
        <p>{{$t('loyalty.fc_loyalty_point_sub_title_label')}}</p>
      </div>
      <div class="right-button" @click="savePointLimitation" v-if="activeName === '3'">
        <el-button type="primary">{{$t('loyalty.fc_loyalty_point_btn_save_label')}}</el-button>
      </div>
      <div class="right-button" v-if="activeName === '0'" >
        <el-button :loading="saveLoading" @click="save"  class="Modify" type="primary" v-if="modify_state">{{$t('loyalty.fc_loyalty_point_btn_save_label')}}</el-button>
      </div>
    </section>
    <div class="point">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--Standard points rule-->
        <el-tab-pane :label="$t(`loyalty.fc_loyalty_point_tab_standard_label`)" name="0">
          <basic-point @getFormId="getFormId" ref="standard_points_rule" />
        </el-tab-pane>
        <!--Standard points type-->
        <el-tab-pane :label="$t(`loyalty.fc_loyalty_point_tab_type_label`)" name="1">
          <point-type ref="standard_points_type" />
        </el-tab-pane>
        <!--Specific points-->
        <el-tab-pane :label="$t(`loyalty.fc_loyalty_point_tab_specific_label`)" name="2">
          <specific-points ref="specific_points" />
        </el-tab-pane>
        <!--Point limitation-->
        <el-tab-pane :label="$t(`loyalty.fc_loyalty_point_tab_limitation_label`)" name="3">
          <point-limitation ref="point_limitation" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import BasicPoint from './basic-point'
  import PointAccountType from './point-account-type'
  import PointType from './point-type'
  import SpecificPoints from './specific-points'
  import PointLimitation from './point-limitation/point-limitation'
  export default {
    components: {
      BasicPoint,
      PointAccountType,
      PointType,
      SpecificPoints,
      PointLimitation
    },
    data() {
      return {
        tabList: [
          { name: '0', label1: 'fc_loyalty_point_tab_standard_label', component: 'BasicPoint', label: 'standard_points_rule' },
          { name: '1', label1: 'fc_loyalty_point_tab_type_label', component: 'PointType', label: 'standard_points_type' },
          { name: '2', label1: 'fc_loyalty_point_tab_specific_label', component: 'SpecificPoints', label: 'specific_points' },
          { name: '3', label1: 'fc_loyalty_point_tab_limitation_label', component: 'PointLimitation', label: 'point_limitation' }
        ],
        activeName: '0',
        saveLoading: false,
        modify_state: false
      }
    },
    methods: {
      getFormId(state) {
        this.modify_state = state
        console.log(state)
      },
      savePointLimitation() {
        this.$refs.point_limitation.handlePointLimitation()
      },
      save() {
        if (this.activeName === '0') {
          this.$refs.standard_points_rule.save()
        }
      },
      handleClick(tab, event) {
        // console.log(tab, event)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .point-setting{
    margin: 15px 20px;
  }
  .top{
    height: 80px;
    width: 100%;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    padding-left: 25px;
    position: relative;
    .image{
      width: 58px;
      height: 58px;
      line-height: 20px;
      border-radius: 8px;
      background-color: $primary;
      border: 1px solid $primary;
      position: relative;
    }
    .svg-icon{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      font-size: 36px;
    }
    .info{
      margin-left: 13px;
    }
    h1{
      color: rgba(51, 51, 51, 1);
      font-size: 26px;
      line-height: 1.2;
    }
    p{
      line-height: 1.2;
      color: $primary;
      font-size: 18px;
    }
    .right-button{
      position: absolute;
      right: 20px;
      min-width: 80px;
      .el-button{
        min-width: 80px;
      }
    }
  }
  .point {
    background: #fff;
    margin-top: 20px;
    // padding: 0 25px;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .point-setting .el-tabs__nav-scroll{
    padding-left: 25px;
  }
  .point-setting{
    .el-message-box__message{
      white-space: pre
    }
  }

</style>
