import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
export default function useCD() {
  const store = useStore();
  //   ref
  const cdRef = ref(null);
  const cdImageRef = ref(null);

  //   computed
  const playing = computed(() => store.state.playing);
  const cdStyle = computed(() => {
    return playing.value ? "playing" : "";
  });
  watch(playing, (newStatus) => {
    if (!newStatus) {
      syncTransfrom(cdRef.value, cdImageRef.value);
    }
  });

  //   静态状态下 外层的cd-wrapper 与 内层的cd 旋转角度要一致 即为同步
  function syncTransfrom(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform;
    const innerTransform = getComputedStyle(inner).transform;
    // 让外层赋予内层的旋转偏移量 如果初始wrapper已经旋转了一些角度 例如已经暂停一次 则需要用concat叠加角度样式
    wrapper.style.transform =
      wrapperTransform === "none"
        ? innerTransform
        : innerTransform.concat(" ", wrapperTransform);
  }
  return {
    cdRef,
    cdImageRef,
    cdStyle,
  };
}
