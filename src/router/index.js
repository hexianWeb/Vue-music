import { createRouter, createWebHashHistory } from "vue-router";

const Recommend = () => import("@/views/recommend");
const Singer = () => import("@/views/singer");
const TopList = () => import("@/views/toplist");
const Search = () => import("@/views/search");
const SingerDetail = () => import("@/views/singer-detail");
const routes = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    component: Recommend,
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
  },
  {
    path: "/search",
    component: Search,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
