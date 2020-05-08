<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "basic-app",
  props: {
    msg: String,
    message: String
  },
  data() {
    return {
      myMsg: "",
      myMessage: ""
    };
  },
  created() {
    this.myMsg = this.msg;
    this.myMessage = this.message;
  },
  methods: {
    /**
     * 路由切换
     * url 路由地址
     */
    routerChange(url) {
      this.$router.push(url).catch(err => {
        console.log(err);
      });
    },
    /**
     * 跨应用路由切换
     * url 路由地址
     */
    toAppReport(url) {
      this.$mainUtils.routerGo(url);
    },
    /**
     * 通知父应用变天了
     * type 通信方案
     */
    callParentChange(type) {
      if (type === "default") {
        this.myMessage = "子应用subapp-ui收到";
        this.$actions.setGlobalState({
          message: this.myMessage,
          from: "subapp-ui"
        });
        return;
      }
      this.myMsg = "但若不见你，阳光也无趣";
      this.$pager.next({
        from: "subapp-ui",
        token: "但若不见你，阳光也无趣"
      });
    }
  }
};
</script>

<style lang="scss">
.parent-child-communication {
  padding: 20px 0;
  line-height: 36px;
}</style
>>
