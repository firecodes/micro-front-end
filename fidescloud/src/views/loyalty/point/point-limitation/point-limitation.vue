<template>
  <div class="point-limitation" v-loading="loading" ref="point_limitation">
    <div>
      <!--need to limit the earned points bu month/year-->
      <el-checkbox v-model="form.is_limit_earned_points_flag">{{$t('loyalty.fc_loyalty_point_limitation_earn_point_label')}}</el-checkbox>
      <section v-show="form.is_limit_earned_points_flag">
        <div class="value">
          {{$t('loyalty.fc_loyalty_point_limitation_earn_point_rule1_label').split('{')[0]}}
          <el-input-number :max="99999999" :min="0" v-model="form.max_earned_points_per_month" />
          {{$t('loyalty.fc_loyalty_point_limitation_earn_point_rule1_label').split('}')[1]}}
        </div>
        <div class="value">
          {{$t('loyalty.fc_loyalty_point_limitation_earn_point_rule2_label').split('{')[0]}}
          <el-input-number :max="99999999" :min="0" v-model="form.max_earned_points_per_year" />
          {{$t('loyalty.fc_loyalty_point_limitation_earn_point_rule2_label').split('}')[1]}}
        </div>
      </section>
    </div>
    <!--need to limit the redeemed points by month/year-->
    <div class="margin-top-20">
      <el-checkbox v-model="form.is_limit_redeemed_points">{{$t('loyalty.fc_loyalty_point_limitation_redeemed_point_label')}}</el-checkbox>
      <section v-show="form.is_limit_redeemed_points">
        <div class="value">
          {{$t('loyalty.fc_loyalty_point_limitation_redeemed_point_rule1_label').split('{')[0]}}
          <el-input-number :max="99999999" :min="0" v-model="form.max_redeemed_points_per_month" />
          {{$t('loyalty.fc_loyalty_point_limitation_redeemed_point_rule1_label').split('}')[1]}}
        </div>
        <div class="value">
          {{$t('loyalty.fc_loyalty_point_limitation_redeemed_point_rule2_label').split('{')[0]}}
          <el-input-number :max="99999999" :min="0" v-model="form.max_redeemed_points_per_year" />
          {{$t('loyalty.fc_loyalty_point_limitation_redeemed_point_rule2_label').split('}')[1]}}
        </div>
      </section>
    </div>
  </div>
</template>
<script>
  import { addLoyaltyProcessCfg, queryLoyaltyProcessCfg, updateLoyaltyProcessCfg } from '@/api/loyalty'

  export default {
    data() {
      return {
        loading: false,
        form: {
          id: null,
          is_limit_earned_points_flag: false,
          max_earned_points_per_month: null,
          max_earned_points_per_year: null,
          is_limit_redeemed_points: false,
          max_redeemed_points_per_month: null,
          max_redeemed_points_per_year: null
        }
      }
    },
    created() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        this.loading = true
        queryLoyaltyProcessCfg().then(res => {
          this.form = res.return_result
          this.form.is_limit_earned_points_flag = this.form.is_limit_earned_points_flag === 1
          this.form.is_limit_redeemed_points = this.form.is_limit_redeemed_points === 1
          this.loading = false
        }).catch(_ => {
          this.loading = false
        })
      },
      handlePointLimitation() {
        // 如果有ID 则修改 否则新增
        this.loading = true
        const data = {
          is_limit_earned_points_flag: this.form.is_limit_earned_points_flag ? 1 : 0,
          max_earned_points_per_month: this.form.is_limit_earned_points_flag ? this.form.max_earned_points_per_month : null,
          max_earned_points_per_year: this.form.is_limit_earned_points_flag ? this.form.max_earned_points_per_year : null,
          is_limit_redeemed_points: this.form.is_limit_redeemed_points ? 1 : 0,
          max_redeemed_points_per_month: this.form.is_limit_redeemed_points ? this.form.max_redeemed_points_per_month : null,
          max_redeemed_points_per_year: this.form.is_limit_redeemed_points ? this.form.max_redeemed_points_per_year : null
        }
        if (this.form.id === null) {
          // 新增
          this.handleAdd(data)
        } else {
          // 修改
          this.handleUpdate(data)
        }
      },
      handleAdd(data) {
        addLoyaltyProcessCfg(data).then(res => {
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.form.id = res.return_result.id
          this.loading = false
        }).catch(res => {
          this.$message.error(res)
          this.loading = false
        })
      },
      handleUpdate(data) {
        updateLoyaltyProcessCfg(Object.assign({}, data, { id: this.form.id })).then(res => {
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.form.id = res.return_result.id
          this.loading = false
        }).catch(res => {
          this.$message.error(res)
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .point-limitation{
    margin: 20px 30px;
    font-size: 14px;
    color: #606266;
    .el-input{
      width: 100px;
      margin: 0 5px;
    }
    .value{
      margin-top: 5px;
      margin-left: 23px;
    }
    .margin-top-20{
      margin-top: 20px;
    }
  }
</style>
