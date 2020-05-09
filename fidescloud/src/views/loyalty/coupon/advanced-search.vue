<template>
  <div class="advanced-query-coupon" ref="advanced-query">
    <el-form ref="form" :model="form" label-width="143px" label-position="left">
      <el-row class="list" >
        <!-- coupon_type -->
        <el-form-item :label="`${$t('loyalty.fc_coupon_advanced_type_label')}:`" prop="coupon_type_code">
            <el-select clearable filterable v-model="form.coupon_type_code" :placeholder="$t('loyalty.fc_coupon_advanced_type_input_label')" style="width: 300px;">
              <el-option
                class="new-select-option"
                v-for="item in coupon_type_list"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- channel -->
        <el-form-item :label="`${$t('loyalty.fc_coupon_advanced_channel_label')}:`" prop="channel_code">
            <el-select clearable filterable v-model="form.channel_code" :placeholder="$t('loyalty.fc_coupon_advanced_channel_input_label')">
              <el-option class="new-select-option" v-for="item in channel_list" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        <!-- Used in redemption -->
        <el-form-item :label="`${$t('loyalty.fc_coupon_advanced_used_redemption_label')}:`" prop="is_used_in_redemption">
            <el-select clearable filterable v-model="form.is_used_in_redemption" :placeholder="$t('loyalty.fc_coupon_advanced_used_redemption_input_label')">
              <el-option class="new-select-option" v-for="item in boolean_list" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        <!-- Used in campaign -->
        <el-form-item :label="`${$t('loyalty.fc_coupon_advanced_used_campaign_label')}:`" prop="campaign_status">
            <el-select clearable filterable v-model="form.campaign_status" :placeholder="$t('loyalty.fc_coupon_advanced_used_campaign_input_label')">
              <el-option class="new-select-option" v-for="item in boolean_list" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        <!--operation-->
        <div class="button" >
            <el-button @click="resetForm1" class="reset">{{$t('loyalty.fc_coupon_advanced_btn_reset_label')}}</el-button>
            <el-button type="primary" @click="search" class="search">{{$t('loyalty.fc_coupon_advanced_btn_search_label')}}</el-button>
        </div>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        coupon_type_list: [{ name: this.$t('loyalty.fc_coupon_advanced_type_1st_label'), value: 'cash' }, { name: this.$t('loyalty.fc_coupon_advanced_type_2nd_label'), value: 'discount' }, { name: this.handleGlobalI18n('loyalty', 'sku'), value: 'sku' }],
        channel_list: [{ name: this.$t('loyalty.fc_coupon_advanced_channel_1st_label'), value: 'online' }, { name: this.$t('loyalty.fc_coupon_advanced_channel_2nd_label'), value: 'offline' }, { name: this.$t('loyalty.fc_coupon_advanced_channel_3rd_label'), value: 'all' }],
        boolean_list: [{ name: this.$t('loyalty.fc_option_yes_no_1st_label'), value: 1 }, { name: this.$t('loyalty.fc_option_yes_no_2nd_label'), value: 0 }],
        form: {
          campaign_status: null,
          is_used_in_redemption: null,
          channel_code: null,
          coupon_type_code: null
        }
      }
    },
    watch: {
      '$store.getters.language': {
        handler() {
          this.coupon_type_list = [{ name: this.$t('loyalty.fc_coupon_advanced_type_1st_label'), value: 'cash' }, { name: this.$t('loyalty.fc_coupon_advanced_type_2nd_label'), value: 'discount' }, { name: this.$t('loyalty.fc_coupon_advanced_type_3rd_label'), value: 'gwp' }]
          this.channel_list = [{ name: this.$t('loyalty.fc_coupon_advanced_channel_1st_label'), value: 'online' }, { name: this.$t('loyalty.fc_coupon_advanced_channel_2nd_label'), value: 'offline' }, { name: this.$t('loyalty.fc_coupon_advanced_channel_3rd_label'), value: 'all' }]
          this.boolean_list = [{ name: this.$t('loyalty.fc_option_yes_no_1st_label'), value: 1 }, { name: this.$t('loyalty.fc_option_yes_no_2nd_label'), value: 0 }]
        }
      }
    },
    methods: {
      search() {
        this.$refs['form'].validate((valid) => {
          this.$emit('advanced_search', this.form)
        })
      },
      resetForm1() {
        this.$refs['form'].resetFields()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .el-button{
    min-width: 88px;
  }
  .el-select {
    width: 200px!important;
  }
  .el-col{
    height: 66px;
  }
  h5 {
    line-height: 3;
  }
  .advanced-query-coupon {
    background:rgba(255,255,255,1);
    box-shadow:0 5px 15px -3px rgba(204,204,204,1);
    padding: 0 20px;
    margin-top: 10px;
    /deep/ .el-form-item__label{
      font-family: Helvetica-medium-1;
      font-size:14px;
      font-weight: 500;
      color:rgba(51,51,51,1);
    }
    /deep/ .el-row::before, .el-row::after{
      display: none;
    }
    /deep/ .el-form-item{
      margin-bottom: 30px;
    }
    .button{
      text-align: center;
      width: 100%;
      margin-top: -3px;
      margin-bottom: 12px;
      .reset{
        margin-right: 7px;
        background-color: #ffffff;
      }
    }
    .el-form {
      padding-top:20px;
    }
    .connecting-line{
      margin: 0 8px;
      width:14px;
      height:2px;
      background:rgba(51,51,51,1);
      display: block;
    }
  .reset{
      border-color: $new-primary;
      color: $new-primary;
    }
    .search{
      background-color: $new-primary;
      border-color: $new-primary;
    }
  }
</style>
