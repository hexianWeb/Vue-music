const { defineConfig } = require("@vue/cli-service");
const registerRouter = require("./backend/router");
// module.exports = defineConfig({
//   css: {
//     loaderOptions: {
//       // 全局引入变量和一些sass方法
//       sass: {
//         additionalData: `
//           @import "@/assets/scss/variable.scss";
//           @import "@/assets/scss/mixin.scss";
//         `,
//       },
//     },
//   },
//   lintOnSave: false,
//   transpileDependencies: true,
//   devServer: {
//     before(app) {
//       registerRouter(app);
//     },
//   },
// });
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        //  全局引入变量和mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `,
      },
    },
  },
  devServer: {
    onBeforeSetupMiddleware: (app) => {
      registerRouter(app.app);
    },
    // before方法：能够在其他所以的中间件之前执行自定义的中间件
    // before(app) {
    //   registerRouter(app);
    // },
    // 但是vue/cli5.0后 取消了before
    // setupMiddlewares(middlewares, devServer) {
    //   if (!devServer) {
    //     throw new Error("webpack-dev-server is not defined");
    //   }
    //   // Use the `unshift` method if you want to run a middleware before all other middlewares
    //   // or when you are migrating from the `onBeforeSetupMiddleware` option
    //   middlewares.unshift({
    //     name: "fist-in-array",
    //     // `path` is optional
    //     path: "/",
    //     middleware: (req, res) => {
    //       // res.send("Foo!");
    //       // registerRouter(devServer.app);
    //       console.log(req);
    //     },
    //   });
    //   // console.log(app.app.get);
    // },
  },
  lintOnSave: false,
  transpileDependencies: true,

  // configureWebpack: (config) => {
  //   if (process.env.npm_config_report) {
  //     const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  //     config.plugins.push(new BundleAnalyzerPlugin())
  //   }
  // },
  productionSourceMap: false, // 生产不需要打开sourceMap 否则别人很容易去看你的源码
  publicPath: process.env.NODE_ENV === "production" ? "/music-next/" : "/",
};
