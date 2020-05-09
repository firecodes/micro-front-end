<template>
  <div id="app" @click="clicked">

    <div class="layout" v-show="$route.path === '/login'">
      <keep-alive>
        <router-view v-if="$route.meta.noCache" />
      </keep-alive>
      <router-view v-if="!$route.meta.noCache" />
    </div>

    <div class="layout" v-show="$route.path !== '/login'">
      <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <sidebar class="sidebar-container" />
        <div class="main-container">
          <main-top class="main-top" />
          <!-- <app-main class="app-main" /> -->
          <section class="app-main" ref="appMain">
            <el-scrollbar style="height:100%;">
              <!-- <transition name="fade-transverse" mode="out-in"> -->
              <keep-alive>
                <router-view v-if="$route.meta.noCache" />
              </keep-alive>
              <router-view v-if="!$route.meta.noCache" />
              <div
                id="sub-app-layout"
                class="app-view-box"
                v-html="content"
              ></div>
              <div v-if="loading" class="subapp-loading"></div>
              <!-- </transition> -->
            </el-scrollbar>
          </section>
        </div>
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
    name: 'app',
    props: {
      loading: Boolean,
      content: String
    },
    components: {
      Sidebar,
      AppMain,
      MainTop
    },
    data() {
      return {
        lTime: new Date().getTime(), // 最后一次点击的时间
        ctTime: new Date().getTime(), // 当前时间
        tOut: 60 * 60 * 1000, // 超时时间60min
        t1: null
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    },
    watch: {
      '$route': {
        handler() {
          var arr = 'login'
          if (window.location.href.indexOf(arr) <= 0) {
            window.clearInterval(this.t1)
            this.t1 = window.setInterval(this.tTime, 2000)
          }
        }
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
      },
      clicked() {
        this.lTime = new Date().getTime() // 当界面被点击更新点击时间
      },
      tTime() {
        // 如果在登录页面则不处理
        var arr = 'login'
        if (window.location.href.indexOf(arr) > 0) {
          return true
        }
        this.ctTime = new Date().getTime()
        if (this.ctTime - this.lTime > this.tOut) {
          // 退出登录
          window.clearInterval(this.t1)
          this.$store.dispatch('FedLogOut').then(() => {
            window.localStorage.removeItem('tenantInfo')
            window.sessionStorage.removeItem('route')
            location.reload()
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import './src/styles/mixin.scss';
  .layout {
    min-width: 1400px;
  }
  #sub-app-layout {
    margin-top: 60px;
    margin-left: 112px;
  }
  .app-wrapper {
    @include clearfix;
    position: relative; /*fixed*/
    height: 100%;
    width: 100%;
  }
</style>
