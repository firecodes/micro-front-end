<template>
  <el-row class="campaign-analysis" v-loading="listLoading">
    <el-col>
      <!--标题-->
      <p class="p">{{$t('homepage.fc_home_campaigns_section_title')}}</p>
      <!--选择年份-->
      <div class="select-year">
        <el-select v-model.number="select_year">
          <el-option :key="item.value" :label="item.value" :value="item.value" v-for="item in query_year_data" />
        </el-select>
      </div>
      <el-row :gutter="0" class="list">
        <!--Campaign sales-->
        <el-col :span="6">
          <label class="label">{{$t('homepage.fc_home_campaigns_1st_section_title')}}</label>
          <h2>
            <label>{{globalData.value.currency_symbol}}</label>
            <count-to :duration="1600" :endVal="campaign_data.campaign_sales || 0" :startVal="0" class="card-panel-num" />
          </h2>
        </el-col>
        <!--Campaign numbers-->
        <el-col :span="6">
          <label class="label">{{$t('homepage.fc_home_campaigns_2nd_section_title')}}</label>
          <h2>
            <count-to :duration="1600" :endVal="campaign_data.campaign_number || 0" :startVal="0" class="card-panel-num" />
          </h2>
        </el-col>
        <!--Participants-->
        <el-col :span="6">
          <label class="label">{{$t('homepage.fc_home_campaigns_3rd_section_title')}}</label>
          <h2>
            <count-to :duration="1600" :endVal="campaign_data.campaign_participants || 0" :startVal="0" class="card-panel-num" />
          </h2>
        </el-col>
        <!--Response rate-->
        <el-col :span="6">
          <label class="label">{{$t('homepage.fc_home_campaigns_4th_section_title')}}</label>
          <h2 class="rate">{{(campaign_data.campaign_response_rate || 0)+'%'}}</h2>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
  import CountTo from 'vue-count-to'
  export default {
    components: {
      CountTo
    },
    props: {
      campaign_data: {
        type: Object,
        default: {}
      },
      query_year_data: {
        type: Array,
        default: []
      },
      default_year: {
        type: Number
      }
    },
    data() {
      return {
        listLoading: false, // true
        select_year: this.default_year,
        detail: {}
      }
    },
    watch: {
      'select_year': {
        handler(val) {
          this.listLoading = true
          this.$emit('getKpiYear', parseInt(this.select_year), 'campaign')
        }
      },
      campaign_data() {
        this.listLoading = false
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .select-year {
    position: absolute;
    right: 27px;
    top: 11px;
    .el-select {
      width: 90px;
    }
  }

  .campaign-analysis {
    margin-top: 20px;
    background: #ffffff;
    height: 219px;
    box-shadow: 0 6px 5px rgba(204, 204, 204, 0.349019607843137);
    font-size: 16px;
    position: relative;
    .p {
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .list {
      height: 131px;
      margin: 0 27px;
      margin-top: 25px;
      .el-col {
        height: 131px;
        text-align: center;
        h2 {
          font-size: 30px;
          line-height: 1.7;
          label {
            font-size: 22px;
          }
        }
        &:not(:last-child) {
          position: relative;
          &:after {
            content: '';
            position: absolute;
            height: 50px;
            width: 1px;
            background: #0f377e;
            top: 0;
            bottom: 0;
            margin: auto;
            right: 0;
          }
        }
        .label {
          display: inline-block;
          padding-top: 40px;
          font-size: 16px;
          color: #777777;
        }
      }
      .select-before {
        position: relative;
        &:before {
          content: '';
          bottom: -70px;
          left: 0;
          right: 0;
          margin: auto;
          position: absolute;
          display: inline-block;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 20px;
          border-color: rgba(249, 249, 249, 1) rgba(249, 249, 249, 1) transparent transparent;
          transform: rotate(135deg);
          box-shadow: 5px -5px 5px rgba(204, 204, 204, 0.349019607843137);
        }
      }
    }
  }
</style>
