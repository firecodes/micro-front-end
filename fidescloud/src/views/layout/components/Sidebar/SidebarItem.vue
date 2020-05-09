<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <!-- 渲染单层，没有子级的 -->
      <router-link v-if="item.children.length===1 && !item.children[0].children"
                   to=""
                   :key="item.children[0].name">
        <el-menu-item :class="{'submenu-title-noDropdown':!isNest}" @click="handleClickMenuItem();clickPortal()" style="display: flex; align-items: center" v-if="item.children[0].meta.title">
          <svg-icon :icon-class="item.children[0].meta.icon" v-if="item.children[0].meta&&item.children[0].meta.icon" />
          <span slot="title" v-if="item.children[0].meta&&item.children[0].meta.title">{{generateTitle(item.children[0].meta.transaction_key, item.children[0].meta.title, item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link>
      <!-- 渲染下面有多级的 -->
      <el-submenu v-else :index="item.name||item.path" :key="item.name" :class="{'to-bottom' : item.meta.bottom}">
        <template slot="title" v-if="item.meta.title" >
          <svg-icon :icon-class="item.meta.icon" v-if="item.meta&&item.meta.icon" />
          <span slot="title" v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.transaction_key, item.meta.title, item.meta.title)}}</span>
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" :key="child.path" :routes="[child]" class="nest-menu" v-if="child.children&&child.children.length>0" />
          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item @click="handleClickMenuItem" :index="item.path+'/'+child.path">
              <span slot="title" style="font-family: Helvetica-medium-1; font-weight: 400" v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.transaction_key, item.meta.title, child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
  import { generateTitle } from '@/utils/i18n'
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      generateTitle,
      clickPortal() {
        window.history.pushState({}, 'portal', '/portal')
        location.reload()
      },
      handleClickMenuItem() {
        // 获取当前屏幕的宽度
        this.$nextTick(() => {
          if (document.body.clientWidth <= 1400) {
            this.$store.dispatch('setOpen', 1)
            this.$store.dispatch('ToggleSideBar')
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .menu-wrapper{
    height: 100%;
    position: relative;
  }
  .to-bottom{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
