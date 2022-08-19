import { computed, ref } from "vue";
export default function useShortcut(props, groupRef) {
  // 获取到scorll实例
  const scrollRef = ref(null);
  const ANCHOR_HEIGHT = 18;
  const touch = {};
  const shortCutList = computed(() => {
    return props.data.map((group) => {
      return group.title;
    });
  });

  // 右侧卡片添加touchStart事件
  function onShortCutTouchStart(e) {
    // debugger;
    // 获取当前移动到某个标签上 并获取对应的index
    const anchorIndex = parseInt(e.target.dataset.index);
    touch.y1 = e.touches[0].pageY;
    // 简单的闭包技巧 获取anchorIndex
    touch.anchorIndex = anchorIndex;
    scrollTo(anchorIndex);
  }

  //
  function onShortCutTouchMove(e) {
    touch.y2 = e.touches[0].pageY;
    // | 0  floor 向下取整的一种写法 获取偏移量 除以锚点固定高度18px
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0;
    const anchorIndex = touch.anchorIndex + delta;
    scrollTo(anchorIndex);
  }

  function scrollTo(index) {
    if (isNaN(index)) {
      return;
    }
    // 获取singerList对应的DOM元素
    index = Math.max(0, Math.min(shortCutList.value.length - 1, index));
    const targetEl = groupRef.value.children[index];
    const scroll = scrollRef.value.scroll;
    // 移动到对应的DOM处
    scroll.scrollToElement(targetEl, 0);
  }
  return {
    shortCutList,
    scrollRef,
    onShortCutTouchStart,
    onShortCutTouchMove,
  };
}
