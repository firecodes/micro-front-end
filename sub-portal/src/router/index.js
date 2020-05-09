import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    component: About
  },
  {
    path: "/product",
    name: "product",
    component: () => import("../views/product/index.vue")
  },
  {
    path: "/product/details/:id",
    name: "mydetail",
    component: () => import("../views/product/details.vue")
  }
];

/* const router = new VueRouter({
  mode: "history",
  routes
}); */

export default routes;
