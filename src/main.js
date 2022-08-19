import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入图片懒加载插件
// https://www.npmjs.com/package/vue3-lazy 相关API说明
import lazyPlugin from "vue3-lazy";

// 引入v-loading自定义指令的hook函数
import loadingDirective from "./components/base/loading/directive";

// 引入noresult指令
import noResultDirective from "./components/base/no-result/directive";
// 引入全局样式文件
import "@/assets/scss/index.scss";
// 引入动画样式
import "animate.css";

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, {
    // 此处设定默认懒加载图片
    loading: require("@/assets/images/default.png"),
  })
  //   全局注册loading指令
  .directive("loading", loadingDirective)
  .directive("noresult", noResultDirective)
  .mount("#app");
