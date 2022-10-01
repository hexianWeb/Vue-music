// https://better-scroll.github.io/docs/en-US/guide/base-scroll-options.html
// 具体文档配置如上
import BScroll from "@better-scroll/core";
import ObserveDOM from "@better-scroll/observe-dom";
import { onMounted, ref, onUnmounted, onDeactivated, onActivated } from "vue";

// 自动弹出内容变化 计算高度并滚动
BScroll.use(ObserveDOM);

export default function useScroll(wrapperRef, options, emit) {
  // debugger;
  const scroll = ref(null);

  //   注册
  onMounted(() => {
    // console.log(wrapperRef.value);
    const scrollVal = (scroll.value = new BScroll(wrapperRef.value, {
      // 解构参数
      observeDOM: true, // 开启 observe-dom 插件,
      ...options,
    }));
    // https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html#probetype
    // probeType相关配置API
    if (options.probeType > 0) {
      scrollVal.on("scroll", (pos) => {
        // console.log("出发了Scroll事件", pos);
        emit("scroll", pos);
      });
    }
  });

  onUnmounted(() => {
    scroll.value.destroy();
  });
  onActivated(() => {
    scroll.value.enable();
    scroll.value.refresh();
  });
  onDeactivated(() => {
    scroll.value.disable();
  });
  return scroll;
}
