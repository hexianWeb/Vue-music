<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import { ref } from "vue";
import useScroll from "./use-scroll";
export default {
  name: "scroll",
  props: {
    click: {
      type: Boolean,
      default: true,
    },
    probeType: {
      type: Number,
      // 默认不派发scroll事件
      default: 0,
    },
  },
  // Vue3建议的emit风格
  emits: ["scroll"],
  setup(props, { emit }) {
    const rootRef = ref(null);
    // 原组件支持传递ref标识 或者ID 类选择器  **emit
    const scroll = useScroll(rootRef, props, emit);
    return {
      rootRef,
      // 将Betterscorll实例化组件暴露出去 方便调用scrollToEl API
      scroll,
    };
  },
};
</script>

<style></style>
