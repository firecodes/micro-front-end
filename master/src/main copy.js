import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { getAppConfigApi } from "@/api/appConfig";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import { Message } from "element-ui";
// 开发环境导入api mock数据
import { mockXHR } from "../mock";
// if(process.env.NODE_ENV == 'development'){
mockXHR();
// }
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
// 按需导入element-ui
// import "./plugins/element.js";
// 导入封装后的ui组件
// import "./library/ui/install";
// 导入路由监听函数
import { genActiveRule } from "./util";
/**
 * 主应用公共资源下发子应用
 */
// 导入主应用ui库
// import LibraryUi from "./library/ui/";
// 导入主应用工具类库
// import LibraryJs from "./library/js";

// 导入主应用需要下发的emit函数
// import * as childEmit from "./util/childEmit";

// 定义传入子应用的数据
import pager from "./util/pager";
// 导入应用间通信介质：呼机
// let msg = {
//   data: store.getters, // 从主应用仓库读出的数据
//   components: LibraryUi, // 从主应用读出的组件库
//   utils: LibraryJs, // 从主应用读出的工具类库
//   emitFnc: childEmit, // 从主应用下发emit函数来收集子应用反馈
//   pager, // 从主应用下发应用间通信呼机
//   state: {
//     message: "主应用呼叫子应用",
//     time: "2020.04.15 20:52",
//     from: ""
//   } // 便于展示官方通信示例的临时数据
// };

// 在主应用注册呼机
pager.subscribe(v => {
  console.log(`监听到子应用${v.from}发来消息：`, v);
  store.dispatch("app/setToken", v.token);
});

/* // 在主应用注册官方通信方案
const actions = initGlobalState(msg.state);
// 注册消息监听函数
actions.onGlobalStateChange((state, prev) => console.log(`主应用应用监听到来自${state.from}发来消息：`, state, prev)); */

// 主应用渲染函数
let app = null;
function render({ appContent, loading } = {}) {
  if (!app) {
    app = new Vue({
      // public index.html中的div容器
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
            loading: this.loading,
            myroute: [1, 2]
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

// 获取app注册表
getAppConfigApi().then(({ data }) => {
  if (data.code === 200) {
    let _res = data.data || [];
    // 处理菜单
    store.dispatch("menu/setUserMenu", _res);
    // 过滤module：master的
    // const temp = _res.filter(item => {
    //     return item.module !== "master";
    // });
    // _res = temp;
    if (_res.length === 0) {
      this.$message.error("没有可以注册的子应用数据");
      // Message({
      //   type: "error",
      //   message: ""
      // });
      return;
    }
    // 处理子应用注册数据
    let isDev = process.env.NODE_ENV === "development";
    let apps = [];
    let defaultApp = null;
    _res.forEach(i => {
      if (i.module !== "master") {
        apps.push({
          name: i.module,
          entry: isDev ? i.devEntry : i.depEntry,
          render,
          activeRule: genActiveRule(i.routerBase)
          // props: { ...msg, ROUTES: i.children, routerBase: i.routerBase }
        });
      } else {
        apps.push({
          name: i.module,
          entry: isDev ? i.devEntry : i.depEntry,
          render,
          activeRule: genActiveRule(i.routerBase)
          // props: { ...msg, ROUTES: i.children, routerBase: i.routerBase }
        });
      }
      if (i.defaultRegister) defaultApp = i.routerBase;
    });
    // 注册子应用
    apps = apps.filter(item => {
      return item.name !== "master";
    });
    // 只有子应用才需要这些生命周期函数
    registerMicroApps(apps, {
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
    });
    // 设置默认子应用
    if (!defaultApp) defaultApp = _res[0].routerBase;
    // setDefaultMountApp("/home");
    // 第一个子应用加载完毕回调
    runAfterFirstMounted(app => {
      console.log(app);
    });
    // 启动微服务
    start({ prefetch: true });
    // 设置全局未捕获一场处理器
    addGlobalUncaughtErrorHandler(event => console.log(event));
  }
});
