<!--日期选择-->
<template>
  <div class="date-pick">
    <day :n-day="form.day" :n-month="form.month" :n-year="form.year" @setDay="setDay" />
    <month :n-month="form.month" @setMonth="setMonth" />
    <year :n-year="form.year" @setYear="setYear" />
  </div>
</template>
<script>
  import year from './year'
  import month from './month'
  import day from './day'
  export default {
    props: {
      date: {
        type: String
      }
    },
    components: {
      year,
      month,
      day
    },
    data() {
      return {
        form: {
          year: '',
          month: '',
          day: ''
        }
      }
    },
    methods: {
      setMonth(val) {
        this.form.month = val
      },
      setYear(val) {
        this.form.year = val
      },
      setDay(val) {
        this.form.day = val
      }
    },
    watch: {
      form: {
        handler() {
          this.$emit('setBirthday', this.form)
        },
        deep: true
      },
      date: {
        handler() {
          if (this.date) {
            [this.form.year, this.form.month, this.form.day] = this.date.split('-')
          }
        },
        immediate: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .date-pick{
    display: flex!important;
  }
</style>
