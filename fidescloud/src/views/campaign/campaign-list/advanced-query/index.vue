<!--advanced query-->
<template>
  <div class="advanced-list">
    <div class="filter-container">
      <el-form ref="form" :model="form" label-width="190px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="12" >
            <!--Campaign name-->
            <el-form-item :label="$t('campaign.fc_campaign_history_advanced_name_label')" prop="campaign_name">
              <el-input :placeholder="$t('campaign.fc_campaign_history_advanced_name_input_label')" type="text" v-model="form.campaign_name" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <!--Campaign type-->
            <el-form-item :label="$t('campaign.fc_campaign_history_advanced_type_label')" prop="campaign_type_code">
              <el-select :placeholder="$t('campaign.fc_campaign_history_advanced_type_input_label')" clearable style="width: 350px;" v-model="form.campaign_type_code">
                <el-option
                  v-for="item in cam_type_list"
                  :key="item.campaign_type_id"
                  :label="item.campaign_type_name_resource_key ? $t(`campaign.${item.campaign_type_name_resource_key}`) : item.campaign_type_name"
                  :value="item.campaign_type_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <!--Campaign from-->
            <el-form-item :label="$t('campaign.fc_campaign_history_advanced_date_label')">
              <date-range :value="campaign_date" @valueDate = "valueDateJoin" />
            </el-form-item>
          </el-col>
          <div class="button">
            <el-col :xs="24" :sm="24" :lg="24">
              <!--Search-->
              <el-button type="primary" @click="search">{{$t('campaign.fc_campaign_history_advanced_btn_search_label')}}</el-button>
              <!--Reset-->
              <el-button type="primary" @click="reset">{{$t('campaign.fc_campaign_history_advanced_btn_reset_label')}}</el-button>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import DateRange from '@/components/EldatePicker'
  import { getCampaignTypeInfo } from '@/api/campaign'

  export default {
    components: {
      DateRange
    },
    data() {
      return {
        form: {
          campaign_name: '',
          campaign_type_code: null,
          campaign_start_date: null,
          campaign_end_date: null
        },
        cam_type_list: [],
        campaign_date: []
      }
    },
    created() {
      this.getCamTypeList()
    },
    methods: {
      getCamTypeList() {
        getCampaignTypeInfo().then(res => {
          this.cam_type_list = res.return_result
        })
      },
      search() {
        this.$emit('advanced_search', this.form)
      },
      valueDateJoin(val) {
        [this.form.campaign_start_date, this.form.campaign_end_date] = val
      },
      reset() {
        this.campaign_date = []

        this.$refs.form.resetFields()
        this.form.campaign_start_date = null
        this.form.campaign_end_date = null
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-input {
    width: 350px;
  }
  .advanced-list {
    padding:0;
    margin:0 20px;
    .filter-container {
      background-color: #f9f9f9;
      margin-bottom: 20px;
    }
    h5 {
      line-height: 3;
    }
    .button {
      margin-left: 190px;
    }
    .el-form {
      padding: 20px 0;
    }
  }
</style>
