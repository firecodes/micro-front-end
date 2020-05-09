<template>
  <el-date-picker
    :disabled="disabled"
    v-model="date"
    value-format="yyyy-MM-dd"
    type="daterange"
    align="right"
    unlink-panels
    :format="globalData.value.date_format"
    :range-separator="$t('member.fc_member_details_campaign_date_to_label')"
    :start-placeholder="$t('member.fc_member_details_campaign_date_start_label')"
    :end-placeholder="$t('member.fc_member_details_campaign_date_end_label')"
    :picker-options="pickerOptions ? pickerOptions : pickerOptions2" >
  </el-date-picker>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'dateRange',
    props: {
      value: {
        type: Array,
        default: []
      },
      disabled: {
        type: Boolean,
        default: false
      },
      pickerOptions: {
        type: Object
      }
    },
    computed: {
      ...mapGetters([
        'language'
      ])
    },
    data() {
      return {
        date: '',
        pickerOptions2: {
          shortcuts: [{
            text: this.handleGlobalI18n('system', 'last_week'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.handleGlobalI18n('system', 'last_month'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.handleGlobalI18n('system', 'last_3_month'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    watch: {
      date() {
        this.$emit('valueDate', this.date)
      },
      value() {
        this.date = this.value
      },
      language() {
        this.pickerOptions2 = {
          shortcuts: [{
            text: this.handleGlobalI18n('system', 'last_week'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.handleGlobalI18n('system', 'last_month'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.handleGlobalI18n('system', 'last_3_month'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    }
  }
</script>
