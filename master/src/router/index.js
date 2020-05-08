import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    meta: {
      module: "master"
    },
    component: () => import("../views/Login.vue")
  },
  {
    path: "/home",
    name: "home",
    meta: {
      module: "master"
    },
    component: Home
  },
  {
    path: "/about",
    name: "about",
    meta: {
      module: "master"
    },
    component: () => import("../views/About.vue")
  },
  // 404
  {
    path: "/err-404",
    name: "err404",
    meta: {
      withoutAuth: true
    },
    component: () => import("../views/error/404.vue")
  }
];

const createRouter = () =>
  new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
  });

const router = createRouter();

// 重置路由
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
