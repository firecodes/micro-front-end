<template>
  <div class="layout">
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <main-top class="main-top" />
        <app-main class="app-main" />
      </div>
    </div>
  </div>
</template>

<script>
  import {
    AppMain,
    MainTop,
    Sidebar
  } from '@/views/layout/components'
  export default {
    name: 'layout',
    props: {
      test: Number
    },
    components: {
      Sidebar,
      AppMain,
      MainTop
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    },
    mounted() {
      this.setSidebarOpen()
      window.onresize = () => {
        return (() => {
          this.setSidebarOpen()
        })()
      }
    },
    methods: {
      setSidebarOpen() {
        if (document.body.clientWidth <= 1400) {
          // 关闭左侧导航栏
          this.$store.dispatch('setOpen', 1)
          this.$store.dispatch('ToggleSideBar')
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../../src/styles/mixin.scss';
  .layout {
    min-width: 1400px;
  }
  .app-wrapper {
    @include clearfix;
    position: relative; /*fixed*/
    height: 100%;
    width: 100%;
  }
</style>

