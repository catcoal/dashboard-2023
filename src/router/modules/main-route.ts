import { RouteRecordRaw } from "vue-router";

export const MainRoutes: RouteRecordRaw[] = [
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
    path: "/comment",
    name: "comment",
    redirect: "/comment/list",
    meta: {
      label: "评论管理",
    },
    children: [
      {
        path: "/comment/list",
        name: "CommentList",
        component: () => import("@/views/comment/index.vue"),
        meta: {
          label: "评论列表",
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
      {
        path: "/post_mange/post/:id",
        name: "PostUpate",
        component: () => import("@/views/post/post.vue"),
        meta: {
          label: "编辑文章",
          menuHiden: true,
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
  {
    path: "/resource",
    name: "Resource",
    component: () => import("@/views/resource/index.vue"),
    meta: {
      label: "素材管理",
    },
    children: [],
  },
];
