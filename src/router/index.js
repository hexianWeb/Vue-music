import { createRouter, createWebHashHistory } from "vue-router";

const Recommend = () =>
  import("@/views/recommend" /*webpackChunkName:"recommend" */);
const Singer = () => import("@/views/singer" /*webpackChunkName:"singer" */);
const TopList = () => import("@/views/toplist" /*webpackChunkName:"topList" */);
const Search = () => import("@/views/search" /*webpackChunkName:"Search" */);
const SingerDetail = () =>
  import("@/views/singer-detail" /*webpackChunkName:"SingerDetail" */);
const Album = () => import("@/views/album" /*webpackChunkName:"Album" */);
const TopDetail = () =>
  import("@/views/topDetail" /*webpackChunkName:"TopDetail" */);
const routes = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    component: Recommend,
    children: [
      {
        path: ":id",
        component: Album,
      },
    ],
  },
  {
    path: "/singer",
    component: Singer,
    // 子路由配置
    children: [{ path: ":id", component: SingerDetail }],
  },
  {
    path: "/top-list",
    component: TopList,
    children: [
      {
        path: ":id",
        component: TopDetail,
      },
    ],
  },
  {
    path: "/search",
    component: Search,
    children: [
      {
        path: ":id",
        component: SingerDetail,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
