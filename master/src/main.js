import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);

// 导入乾坤函数
import {
  registerMicroApps, // 注册子应用方法
  // setDefaultMountApp, // 设默认启用的子应用
  runAfterFirstMounted, // 有个子应用加载完毕回调
  start, // 启动qiankun
  addGlobalUncaughtErrorHandler // 添加全局未捕获异常处理器
  // initGlobalState, // 官方应用间通信
} from "qiankun";

// 主应用渲染函数
let app = null;
function render({ appContent, loading } = {}) {
  if (!app) {
    app = new Vue({
      el: "#container",
      router,
      store,
      data() {
        return {
          content: appContent,
          loading
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading
          }
        });
      }
    });
  } else {
    app.content = appContent;
    app.loading = loading;
  }
}
render();

store.dispatch("menu/setUserMenu", [
  {
    id: "2",
    title: "首页",
    icon: "el-icon-date",
    module: "master",
    defaultRegister: false,
    devEntry: "//localhost:6650",
    depEntry: "",
    routerBase: "/",
    children: [
      {
        id: "2-1",
        title: "Dashboard",
        url: "/home"
      },
      {
        id: "2-2",
        title: "关于",
        url: "/about"
      }
    ]
  }
]);

registerMicroApps(
  [
    {
      name: "portal",
      entry: "//localhost:6652",
      render,
      activeRule: "/portal"
    }
  ],
  {
    beforeLoad: [
      app => {
        window.sessionStorage.setItem("crossRoute", true);
        console.log("before load", app);
      }
    ],
    beforeMount: [
      app => {
        console.log("before mount", app);
      }
    ],
    afterUnmount: [
      app => {
        window.sessionStorage.removeItem("crossRoute");
        console.log("after unload", app);
      }
    ]
  }
);

start({ prefetch: true });

runAfterFirstMounted(() => {
  console.log("[MainApp] first app mounted");
});

addGlobalUncaughtErrorHandler(event => console.log(event));
