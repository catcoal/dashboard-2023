import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/dashboard/index.vue"),
    meta: {
      label: "控制面板",
    },
    children: [],
  },
  {
    path: "/user",
    name: "User",
    redirect: "/user/list",
    meta: {
      label: "用户管理",
    },
    children: [
      {
        path: "/user/list",
        name: "UserList",
        component: () => import("@/views/user/index.vue"),
        meta: {
          label: "用户列表",
        },
      },
    ],
  },
  {
    path: "/post_mange",
    name: "Post_mange",
    redirect: "/post_mange/list",
    meta: {
      label: "发文管理",
    },
    children: [
      {
        path: "/post_mange/list",
        name: "PostList",
        component: () => import("@/views/post/index.vue"),
        meta: {
          label: "文章列表",
        },
      },
      {
        path: "/post_mange/post",
        name: "Post",
        component: () => import("@/views/post/post.vue"),
        meta: {
          label: "发布文章",
        },
      },
    ],
  },
  {
    path: "/tag",
    name: "Tag",
    component: () => import("@/views/tag/index.vue"),
    meta: {
      label: "标签管理",
    },
    children: [],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
