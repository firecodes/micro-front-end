<!--Bonus points-->
<template>
  <div class="spot_campaign_what_bonus_point" ref="BonusPoints">
      <el-form :model="form" :rules="rules" label-width="280px" ref="form_b_p">
        <!--point type-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_what_point_type_label')" class="spot_campaign_what_multiple_point__earn_rule" required>
          <el-select v-model="form.point_type">
            <el-option :key="item.value" :label="$t(`member.${item.label}`)" :value="item.value" v-for="item in point_type_list" />
          </el-select>
        </el-form-item>
        <!--Offer-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_what_offer_label')" prop="fixed_point">
          <el-input-number :max="99999999" :min="1" :precision="2" v-model.number="form.fixed_point" />
          <!--points-->
          <label>{{$t('campaign.fc_campaign_spot_create_what_offer_content_label')}}</label>
        </el-form-item>
        <!--Expiry date-->
        <el-form-item :label="$t('campaign.fc_campaign_spot_create_what_expiry_label')">
          <el-radio-group v-model.number="form.expired_type">
            <!--specific date-->
            <el-radio :label="1" class="min-width-330">{{$t('campaign.fc_campaign_spot_create_what_expiry_specific_label')}}</el-radio>
            <!--relative date-->
            <el-radio :label="2">{{$t('campaign.fc_campaign_spot_create_what_expiry_relative_label')}}</el-radio>
          </el-radio-group>
          <div class="specific_date_div margin-35-15" v-if="form.expired_type === 1">
            <el-form-item prop="expired_date" style="border-bottom: none;">
              <el-date-picker
                :format = 'globalData.value.date_format'
                :picker-options="picker_options"
                :placeholder="$t('campaign.fc_campaign_spot_create_what_expiry_input_label')"
                popper-class="ed-data-table"
                type="date"
                v-model="form.expired_date"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="relative_date_div margin-35-15" v-else-if="form.expired_type === 2">
            <el-form-item prop="expired_value" style="border-bottom: none;">
              <el-input type="text" v-model="form.expired_value" />
            </el-form-item>
            <!--days after points reception-->
            <label>{{$t('campaign.fc_campaign_spot_create_what_expiry_relative_content_label')}}</label>
          </div>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
  import { DateTime } from 'luxon'
  import { RegExp } from '@/utils/RegExp'
  export default {
    props: {
      reward: {
        default: Object
      }
    },
    data() {
      return {
        picker_options: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        rules: {
          expired_value: [{ validator: this.handleExpiredValue, trigger: ['change'] }],
          expired_date: [{ validator: this.handleExpiredDate, trigger: ['change'] }],
          fixed_point: [{ validator: this.handleFixedPoint, trigger: ['change'] }]
        },
        point_type_list: [{ label: 'fc_member_details_loyalty_point_type_menu8_label', value: 'standard_points' }, { label: 'fc_member_details_loyalty_point_type_menu9_label', value: 'tier_points' }, { label: 'fc_member_details_loyalty_point_type_menu1_label', value: 'campaign_points' }],
        form: {
          point_type: 'standard_points',
          fixed_point: 1,
          expired_type: 1,
          expired_value: 1,
          expired_date: ''
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      // 验证offer 积分值
      handleFixedPoint(rule, value, callback) {
        if (!value) {
          callback(new Error(' '))
        }
        // 验证数据格式是否正确
        var reg = RegExp.positive_integer
        !reg.test(value) ? callback(new Error(' ')) : callback()
      },
      // 验证Specific date
      handleExpiredDate(rule, value, callback) {
        if (!value) {
          callback(new Error(' '))
        }
        // 验证指定日期 大于当前日期
        const current_time = new Date()
        const specific_time = new Date(value + '23:59:59')
        if (current_time > specific_time) {
          callback(new Error(' '))
        }
        callback()
      },
      // 验证相对时间
      handleExpiredValue(rule, value, callback) {
        if (!value) {
          callback(new Error(' '))
        }
        // 验证数据格式是否正确
        var reg = RegExp.positive_integer
        !reg.test(value) ? callback(new Error(' ')) : callback()
      },
      init() {
        if (this.reward) {
          this.form = {
            fixed_point: this.reward.reward_point.fixed_point || 1,
            expired_type: this.reward.reward_point.expired_type || 1,
            point_type: this.reward.reward_point.point_type || 'standard_points',
            expired_value: this.reward.reward_point.expired_value || 1,
            expired_date: this.reward.reward_point.expired_date
          }
          // sku
          if (this.form.select_sku) {
            this.table_data = this.reward.purchase_product_limits || []
          }
        }
      },
      async saveData() {
        var generate_time = DateTime.local().toISO()
        return new Promise((resolve, reject) => {
          this.$refs['form_b_p'].validate((valid) => {
            if (valid) {
              resolve({
                reward_point: {
                  point_type: this.form.point_type,
                  fixed_point: this.form.fixed_point,
                  expired_type: this.form.expired_type,
                  effective_date: this.form.expired_type === 1 ? generate_time.substring(0, 10) : null,
                  expired_date: this.form.expired_type === 1 ? this.form.expired_date : null,
                  expired_value: this.form.expired_type === 2 ? this.form.expired_value : 0
                }
              })
            } else {
              reject()
            }
          })
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spot_campaign_what_bonus_point{
    /deep/ .el-form-item__error:before {
      display: none;
    }
    label{
      font-size:14px;
      font-family: HelveticaNeue1, sans-serif;
      color:rgba(51,51,51,1);
      margin-left: 10px;
    }
    .margin-35-15{
      margin: 20px 0 15px;
    }
    .relative_date_div{
      display: flex;
      align-items: center;
      .el-input{
        width: 124px;
      }
    }
  }
</style>
