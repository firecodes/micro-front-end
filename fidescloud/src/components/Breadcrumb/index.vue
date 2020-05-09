<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="de-redirect" :class="index == levelList.length - 1 ? 'no-redirect' : ''">
          {{handleRouter(item)}}</span>
        <router-link :to="item.redirect||item.path" v-else>{{handleRouter(item)}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  import { generateTitle } from '@/utils/i18n'
  export default {
    created() {
      this.getBreadcrumb()
    },
    data() {
      return {
        levelList: null,
        module: ''
      }
    },
    watch: {
      $route() {
        this.module = ''
        this.getBreadcrumb()
      }
    },
    methods: {
      generateTitle,
      handleRouter(item) {
        if (this.module !== '') {
          return this.generateTitle(item.meta.transaction_key, this.module, item.meta.title)
        }
        var module = ''
        if (item.hasOwnProperty('parent')) {
          if (item.parent !== undefined && item.parent.meta.hasOwnProperty('title')) {
            module = item.parent.meta.title
          } else {
            module = item.meta.title
          }
        } else {
          module = item.meta.title
        }
        this.module = module
        return this.generateTitle(item.meta.transaction_key, module, item.meta.title)
      },
      getBreadcrumb() {
        const matched = this.$route.matched.filter(item => item.name)
        const second = matched[1]
        // if ((first && first.name === 'member') && (second && second.name === 'member_details')) {
        //   // matched = [{ path: '/member/member-view', meta: { title: 'Member View', name: 'member-view' }}].concat(matched)
        //   matched.splice(1, 0, { path: '/member/member-view', meta: { title: 'Member View' }})
        // }
        if (second !== undefined) {
          if (second.meta.hasOwnProperty('parents')) {
            const second_parent = second.parent.name
            const second_params_parent = second.meta.parents
            const second_params_parent_length = second_params_parent.length
            if (second_params_parent_length > 0) {
              if (second_params_parent[second_params_parent_length - 1].path !== second_parent) {
                matched.splice(1, 0, { path: `/${second_parent}/${second_params_parent[0].path}`, meta: { title: second_params_parent[0].name, transaction_key: second_params_parent[0].transaction_key }})
                for (let i = 1; i < second_params_parent_length; i++) {
                  matched.splice(i + 1, 0, { path: `/${second_params_parent[i - 1].path}/${second_params_parent[i].path}`, meta: { title: second_params_parent[i].name, transaction_key: second_params_parent[0].transaction_key }})
                }
              }
            }
          }
        }
        this.levelList = matched
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .de-redirect {
      color: #97a8be;
    }
    .no-redirect {
      color: #303133 !important;
      font-weight: bold;
      cursor: text;
    }
  }
</style>
