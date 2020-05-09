<template>
  <scroll-bar class="sidebar-index">
    <div class="logo">
      <img alt="" class="logo0531" src="../../../../assets/images/logo0531.png">
    </div>
    <el-menu
      mode="vertical"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened = "true"
      background-color="#0f377e"
      text-color="#ffffff"
      active-text-color="red"
      :collapse-transition="true"
      class="el-menu-a"
    >
      <sidebar-item :routes="permission_routers" v-if="sidebar_item_state" />
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'sidebar_item_state'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .sidebar-index{
    .logo{
      width: 100%;
      text-align: center;
      margin-top: 10px;
      img{
        height: 68px;
      }
    }
  }
  .el-menu-a{
    height: calc(100% - 78px);
  }
</style>
