<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
    <!--<component :is="currentRole"></component>-->
  </div>
</template>

<script>
  import adminDashboard from './admin'
  import reimaDashboard from './ReimaAdmin'
  export default {
    name: 'dashboard',
    components: { adminDashboard, reimaDashboard },
    data() {
      return {
        currentRole: ''
      }
    },
    created() {
      var source_list = ['adminDashboard', 'reimaDashboard']
      var global_value = this.globalData.value
      const has = Object.prototype.hasOwnProperty
      if (has.call(global_value, 'homepage')) {
        if (source_list.includes(global_value.homepage)) {
          this.currentRole = global_value.homepage
        } else {
          this.currentRole = 'adminDashboard'
        }
      } else {
        this.currentRole = 'adminDashboard'
      }
    }
  }
</script>
