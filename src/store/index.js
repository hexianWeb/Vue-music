// createLogger
import { createStore, createLogger } from "vuex";
import state from "./state";
import mutations from "./mutations";
import * as getters from "./getters";
import * as actions from "./actions";
const debug = process.env.NODE_ENV !== "production";
export default createStore({
  state,
  mutations,
  getters,
  actions,
  // 严格模式 会有性能损耗 需要规定初始状态下开启
  strict: debug,
  // 线下开启插件 查看提交状态
  plugins: debug ? [createLogger()] : [],
});
