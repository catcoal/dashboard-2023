import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { MainRoutes } from "./modules/main-route";

const routes: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layout/default.vue"),
    children: MainRoutes,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
