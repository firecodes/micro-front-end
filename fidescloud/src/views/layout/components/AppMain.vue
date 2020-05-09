<template>
  <section class="app-main" ref="appMain">
    <el-scrollbar style="height:100%;">
      <transition name="fade-transverse" mode="out-in">
        <router-view />
      </transition>
    </el-scrollbar>
  </section>
</template>

<script>
  import ScrollMain from '@/components/ScrollMain/index'
  export default {
    name: 'AppMain',
    components: {
      ScrollMain
    },
    mounted() {
      this.appMainHeight()
      // 然后监听window的resize事件．在浏览器窗口变化时再设置下高度．
      window.onresize = () => {
        this.appMainHeight()
      }
    },
    methods: {
      appMainHeight() {
        const clientHeight = document.documentElement.clientHeight
        this.$refs.appMain.style.height = `${clientHeight - 55}px`
      }
    },
    computed: {
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-main {
    margin-top: $el-header;
  }
</style>
